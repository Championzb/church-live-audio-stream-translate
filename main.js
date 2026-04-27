const path = require('path');
const fs = require('fs/promises');
const { app, BrowserWindow, ipcMain, globalShortcut, dialog } = require('electron');
const OpenAI = require('openai');
const { toFile } = require('openai/uploads');

let mainWindow;
let openai;
let running = false;
let translationConfig = {
  glossary: '',
  chineseVariant: 'simplified'
};
let segmentCounter = 0;
let nextSegmentToEmit = 0;
const segmentResults = new Map();

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1500,
    height: 920,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'src/index.html'));
}

function pushSegmentResult(index, payload) {
  segmentResults.set(index, payload);

  while (segmentResults.has(nextSegmentToEmit)) {
    const data = segmentResults.get(nextSegmentToEmit);
    segmentResults.delete(nextSegmentToEmit);
    mainWindow?.webContents.send('segment-result', data);
    nextSegmentToEmit += 1;
  }
}

function getOpenAIClient() {
  if (!openai) {
    throw new Error('OpenAI API key is not configured.');
  }
  return openai;
}

async function processSegment({ audioBuffer, mimeType }) {
  const index = segmentCounter;
  segmentCounter += 1;

  try {
    const client = getOpenAIClient();
    const file = await toFile(Buffer.from(audioBuffer), `segment-${Date.now()}.webm`, {
      type: mimeType || 'audio/webm'
    });

    const englishResult = await client.audio.translations.create({
      file,
      model: 'whisper-1'
    });

    const englishText = (englishResult.text || '').trim();

    if (!englishText) {
      pushSegmentResult(index, {
        index,
        english: '',
        chinese: '',
        warning: 'Empty transcription result for this segment.'
      });
      return;
    }

    let chineseText = '';
    let chineseError = '';

    try {
      const glossaryPrompt = translationConfig.glossary
        ? `\nGlossary and preferred translations:\n${translationConfig.glossary}`
        : '';

      const chineseResult = await client.responses.create({
        model: 'gpt-4o-mini',
        input: [
          {
            role: 'system',
            content: [
              {
                type: 'input_text',
                text: `Translate church sermon English into natural Simplified Chinese.
Keep Bible references accurate.
Preserve names and church terms.
Return only the translated text.${glossaryPrompt}`
              }
            ]
          },
          {
            role: 'user',
            content: [{ type: 'input_text', text: englishText }]
          }
        ]
      });

      chineseText = (chineseResult.output_text || '').trim();
    } catch (err) {
      chineseError = err instanceof Error ? err.message : 'Chinese translation failed';
    }

    pushSegmentResult(index, {
      index,
      english: englishText,
      chinese: chineseText,
      warning: chineseError
    });
  } catch (err) {
    pushSegmentResult(index, {
      index,
      english: '',
      chinese: '',
      warning: err instanceof Error ? err.message : 'Segment processing failed'
    });
  }
}

app.whenReady().then(() => {
  createWindow();

  globalShortcut.register('F8', () => {
    running = !running;
    mainWindow?.webContents.send('toggle-from-hotkey', { running });
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.handle('config-api-key', async (_event, apiKey) => {
  if (!apiKey || !apiKey.trim()) {
    openai = undefined;
    return { ok: false, message: 'API key is empty' };
  }

  openai = new OpenAI({ apiKey: apiKey.trim() });
  return { ok: true };
});

ipcMain.handle('get-running', async () => ({ running }));

ipcMain.handle('set-running', async (_event, nextRunning) => {
  running = Boolean(nextRunning);
  if (!running) {
    segmentCounter = 0;
    nextSegmentToEmit = 0;
    segmentResults.clear();
  }
  return { running };
});

ipcMain.handle('set-translation-config', async (_event, config) => {
  const glossary = typeof config?.glossary === 'string' ? config.glossary.trim() : '';
  const chineseVariant = config?.chineseVariant === 'traditional' ? 'traditional' : 'simplified';
  translationConfig = {
    glossary,
    chineseVariant
  };
  return { ok: true };
});

ipcMain.on('segment-ready', (_event, payload) => {
  if (!running) {
    return;
  }
  processSegment(payload);
});

ipcMain.handle('export-transcript', async (_event, payload) => {
  const entries = Array.isArray(payload?.entries) ? payload.entries : [];
  if (!entries.length) {
    return { ok: false, message: 'No transcript entries to export.' };
  }

  const defaultName = `church-translation-${new Date().toISOString().replace(/[:.]/g, '-')}.txt`;
  const saveResult = await dialog.showSaveDialog({
    title: 'Export Transcript',
    defaultPath: defaultName,
    filters: [{ name: 'Text files', extensions: ['txt'] }]
  });

  if (saveResult.canceled || !saveResult.filePath) {
    return { ok: false, message: 'Export canceled.' };
  }

  const content = entries
    .map((entry) => {
      const stamp = entry.timestamp || '';
      const english = entry.english || '';
      const chinese = entry.chinese || '';
      return `[${stamp}] EN: ${english}\n[${stamp}] ZH: ${chinese}`;
    })
    .join('\n\n');

  await fs.writeFile(saveResult.filePath, content, 'utf8');
  return { ok: true, path: saveResult.filePath };
});
