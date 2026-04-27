const { invoke } = window.__TAURI__.core;
const { listen } = window.__TAURI__.event;

const apiKeyInput = document.getElementById('apiKey');
const saveKeyButton = document.getElementById('saveKey');
const audioInputSelect = document.getElementById('audioInput');
const sourceLanguageSelect = document.getElementById('sourceLanguage');
const targetLanguageSelect = document.getElementById('targetLanguage');
const refreshDevicesButton = document.getElementById('refreshDevices');
const toggleRunButton = document.getElementById('toggleRun');
const toggleWorshipModeButton = document.getElementById('toggleWorshipMode');
const togglePresentationButton = document.getElementById('togglePresentation');
const toggleHelpButton = document.getElementById('toggleHelp');
const toggleLockControlsButton = document.getElementById('toggleLockControls');
const toggleOutputWindowButton = document.getElementById('toggleOutputWindow');
const testAudioFileButton = document.getElementById('testAudioFile');
const testAudioFileInput = document.getElementById('testAudioFileInput');
const clearPanelsButton = document.getElementById('clearPanels');
const clearTranscriptButton = document.getElementById('clearTranscript');
const resetSessionButton = document.getElementById('resetSession');
const copyLatestChineseButton = document.getElementById('copyLatestChinese');
const exportTranscriptButton = document.getElementById('exportTranscript');
const statusEl = document.getElementById('status');
const modeSummaryEl = document.getElementById('modeSummary');
const costSummaryEl = document.getElementById('costSummary');
const englishPanel = document.getElementById('englishPanel');
const chinesePanel = document.getElementById('chinesePanel');
const translatedHeadingEl = document.getElementById('translatedHeading');
const englishLiveEl = document.getElementById('englishLive');
const chineseLiveEl = document.getElementById('chineseLive');
const vadThresholdInput = document.getElementById('vadThreshold');
const vadValueEl = document.getElementById('vadValue');
const silenceMsInput = document.getElementById('silenceMs');
const maxSegmentMsInput = document.getElementById('maxSegmentMs');
const glossaryInput = document.getElementById('glossary');
const saveGlossaryButton = document.getElementById('saveGlossary');
const importGlossaryButton = document.getElementById('importGlossary');
const exportGlossaryButton = document.getElementById('exportGlossary');
const autoSaveOnStopInput = document.getElementById('autoSaveOnStop');
const helpOverlay = document.getElementById('helpOverlay');
const closeHelpButton = document.getElementById('closeHelp');

const MAX_LINES = 6;
const SEGMENT_MAX_RETRIES = 2;
const RETRY_DELAYS_MS = [300, 700];
const TRANSLATION_INPUT_COST_PER_1M = 0.15;
const TRANSLATION_OUTPUT_COST_PER_1M = 0.6;
let running = false;
let mediaStream;
let mediaRecorder;
let audioContext;
let analyser;
let monitorId;
let speechDetectedAt = 0;
let silenceStartedAt = 0;
let recordingStartedAt = 0;
let currentChunks = [];
let recording = false;
let presentationMode = false;
let worshipMode = false;
let helpVisible = false;
let controlsLocked = false;

const englishLines = [];
const chineseLines = [];
const transcriptEntries = [];
const pendingSegments = [];
let segmentQueueRunning = false;
let totalAudioMs = 0;
let totalSegments = 0;
let totalEnglishChars = 0;
let totalTranslatedChars = 0;
let pendingSegmentDurationMs = 0;

const TARGET_LANGUAGE_LABELS = {
  'zh-hans': 'Simplified Chinese',
  'zh-hant': 'Traditional Chinese',
  korean: 'Korean',
  japanese: 'Japanese',
  spanish: 'Spanish',
  english: 'English'
};

function loadNumericSetting(key, fallback, minValue, maxValue) {
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  const value = Number(raw);
  if (Number.isNaN(value)) return fallback;
  if (value < minValue || value > maxValue) return fallback;
  return value;
}

function setStatus(text) {
  statusEl.textContent = text;
}

function sttRatePerMinute() {
  if (sourceLanguageSelect.value === 'korean') {
    return 0.006;
  }
  return 0.003;
}

function estimateTranslationCostUsd() {
  const estimatedInputTokens = Math.ceil(totalEnglishChars / 4) + totalSegments * 120;
  const estimatedOutputTokens = Math.ceil(totalTranslatedChars / 4);
  const inputCost = (estimatedInputTokens / 1_000_000) * TRANSLATION_INPUT_COST_PER_1M;
  const outputCost = (estimatedOutputTokens / 1_000_000) * TRANSLATION_OUTPUT_COST_PER_1M;
  return inputCost + outputCost;
}

function updateCostSummary() {
  const minutes = totalAudioMs / 60000;
  const sessionSttCost = minutes * sttRatePerMinute();
  const sessionTranslationCost = estimateTranslationCostUsd();
  const sessionTotal = sessionSttCost + sessionTranslationCost;
  const estimatedMonth = sessionTotal * 4;
  costSummaryEl.textContent = `Cost estimate: session ${sessionTotal.toFixed(
    2
  )} USD | month ${estimatedMonth.toFixed(2)} USD`;
}

function updateModeSummary() {
  const targetLabel = TARGET_LANGUAGE_LABELS[targetLanguageSelect.value] || targetLanguageSelect.value;
  modeSummaryEl.textContent = `Mode: ${running ? 'running' : 'stopped'} | Source: ${
    sourceLanguageSelect.value || 'korean'
  } | Target: ${targetLabel}
  | Worship: ${worshipMode ? 'on' : 'off'} | Presentation: ${
    presentationMode ? 'on' : 'off'
  } | Queue: ${pendingSegments.length}${segmentQueueRunning ? ' (processing)' : ''}`;
  syncOutputWindow();
}

function setHelpVisible(nextVisible) {
  helpVisible = Boolean(nextVisible);
  helpOverlay.classList.toggle('hidden', !helpVisible);
}

function setControlsLocked(nextLocked) {
  controlsLocked = Boolean(nextLocked);
  toggleLockControlsButton.textContent = controlsLocked
    ? 'Unlock Controls (F2)'
    : 'Lock Controls (F2)';

  const lockTargets = [
    apiKeyInput,
    saveKeyButton,
    audioInputSelect,
    sourceLanguageSelect,
    targetLanguageSelect,
    refreshDevicesButton,
    testAudioFileButton,
    vadThresholdInput,
    silenceMsInput,
    maxSegmentMsInput,
    glossaryInput,
    saveGlossaryButton,
    importGlossaryButton,
    exportGlossaryButton,
    autoSaveOnStopInput
  ];

  lockTargets.forEach((element) => {
    element.disabled = controlsLocked;
  });

  localStorage.setItem('church-controls-locked', controlsLocked ? '1' : '0');
  setStatus(controlsLocked ? 'Config controls locked' : 'Config controls unlocked');
  updateModeSummary();
}

function setRunningButtonState() {
  if (running) {
    toggleRunButton.textContent = 'Stop (F8)';
    toggleRunButton.classList.add('stop');
    toggleRunButton.classList.remove('run');
  } else {
    toggleRunButton.textContent = 'Start (F8)';
    toggleRunButton.classList.add('run');
    toggleRunButton.classList.remove('stop');
  }
}

function setPresentationMode(nextMode) {
  presentationMode = Boolean(nextMode);
  document.body.classList.toggle('presentation-mode', presentationMode);
  togglePresentationButton.textContent = presentationMode
    ? 'Exit Presentation (F6)'
    : 'Presentation Mode (F6)';
  updateModeSummary();
}

function setWorshipMode(nextMode) {
  worshipMode = Boolean(nextMode);
  toggleWorshipModeButton.textContent = worshipMode
    ? 'Worship Mode On (F7)'
    : 'Worship Mode Off (F7)';

  if (worshipMode) {
    pendingSegments.length = 0;
    englishLiveEl.textContent = '';
    chineseLiveEl.textContent = '';
    setStatus('Worship mode enabled: translation is paused');
  } else if (running) {
    setStatus('Worship mode disabled: translation resumed');
    drainSegmentQueue();
  } else {
    setStatus('Worship mode disabled');
  }
  updateModeSummary();
}

function renderLines(panel, lines) {
  panel.innerHTML = '';
  lines.forEach((line) => {
    const div = document.createElement('div');
    div.className = `line ${line.warning ? 'warning' : ''}`;
    div.textContent = line.text;
    panel.appendChild(div);
  });
}

function appendEnglish(text, warning = false) {
  if (!text) return;
  englishLines.push({ text, warning });
  while (englishLines.length > MAX_LINES) englishLines.shift();
  renderLines(englishPanel, englishLines);
  syncOutputWindow();
}

function appendChinese(text, warning = false) {
  if (!text) return;
  chineseLines.push({ text, warning });
  while (chineseLines.length > MAX_LINES) chineseLines.shift();
  renderLines(chinesePanel, chineseLines);
  syncOutputWindow();
}

function getLatestChineseLine() {
  for (let i = chineseLines.length - 1; i >= 0; i -= 1) {
    if (!chineseLines[i].warning && chineseLines[i].text) {
      return chineseLines[i].text;
    }
  }
  return '';
}

function updateTranslatedHeading() {
  translatedHeadingEl.textContent = TARGET_LANGUAGE_LABELS[targetLanguageSelect.value] || 'Translation';
}

async function syncOutputWindow() {
  try {
    await invoke('push_output_caption', {
      payload: {
        englishLines: englishLines.map((line) => line.text),
        chineseLines: chineseLines.map((line) => line.text),
        englishLive: englishLiveEl.textContent || '',
        chineseLive: chineseLiveEl.textContent || '',
        modeSummary: modeSummaryEl.textContent || '',
        targetLabel: TARGET_LANGUAGE_LABELS[targetLanguageSelect.value] || targetLanguageSelect.value
      }
    });
  } catch {
    // Ignore sync errors when output window is closed.
  }
}

function clearPanels() {
  englishLines.length = 0;
  chineseLines.length = 0;
  renderLines(englishPanel, englishLines);
  renderLines(chinesePanel, chineseLines);
  englishLiveEl.textContent = '';
  chineseLiveEl.textContent = '';
  syncOutputWindow();
}

function resetSessionState() {
  pendingSegments.length = 0;
  transcriptEntries.length = 0;
  totalAudioMs = 0;
  totalSegments = 0;
  totalEnglishChars = 0;
  totalTranslatedChars = 0;
  pendingSegmentDurationMs = 0;
  clearPanels();
  setStatus('Session reset: captions, transcript, and queue cleared');
  updateModeSummary();
  updateCostSummary();
}

function arrayBufferToBase64(arrayBuffer) {
  const bytes = new Uint8Array(arrayBuffer);
  let binary = '';
  const chunkSize = 0x8000;

  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode(...chunk);
  }

  return btoa(binary);
}

function waitMs(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

async function processSegmentWithRetry(payload) {
  let lastError;

  for (let attempt = 0; attempt <= SEGMENT_MAX_RETRIES; attempt += 1) {
    try {
      return await invoke('process_segment', { payload });
    } catch (err) {
      lastError = err;
      if (attempt >= SEGMENT_MAX_RETRIES) {
        break;
      }
      const delay = RETRY_DELAYS_MS[attempt] || 900;
      setStatus(`Retrying segment (${attempt + 1}/${SEGMENT_MAX_RETRIES})...`);
      await waitMs(delay);
    }
  }

  throw lastError;
}

async function processTestAudioFile(file) {
  if (!file) return;

  setStatus(`Testing file: ${file.name}`);

  const buffer = await file.arrayBuffer();
  const payload = {
    audioBase64: arrayBufferToBase64(buffer),
    mimeType: file.type || 'audio/wav',
    durationMs: 0
  };

  try {
    const result = await processSegmentWithRetry(payload);

    if (result.english) {
      appendEnglish(result.english);
    }
    if (result.translated || result.chinese) {
      appendChinese(result.translated || result.chinese);
    }
    if (result.warning) {
      appendEnglish(`Warning: ${result.warning}`, true);
    }

    transcriptEntries.push({
      timestamp: new Date().toLocaleTimeString(),
      english: result.english || '',
      chinese: result.translated || result.chinese || ''
    });
    totalSegments += 1;
    totalEnglishChars += (result.english || '').length;
    totalTranslatedChars += (result.translated || result.chinese || '').length;
    updateCostSummary();
    setStatus(`Finished file test: ${file.name}`);
    updateModeSummary();
  } catch (err) {
    setStatus(`File test failed: ${err.message || String(err)}`);
    appendEnglish(`Warning: ${err.message || String(err)}`, true);
  } finally {
    testAudioFileInput.value = '';
  }
}

async function drainSegmentQueue() {
  if (segmentQueueRunning || !pendingSegments.length) {
    return;
  }

  segmentQueueRunning = true;
  try {
    while (running && pendingSegments.length) {
      if (worshipMode) {
        pendingSegments.length = 0;
        updateModeSummary();
        break;
      }

      const payload = pendingSegments.shift();
      const result = await processSegmentWithRetry(payload);

      if (result.english) {
        appendEnglish(result.english);
      }

      if (result.chinese) {
        appendChinese(result.chinese);
      }
      if (result.translated) {
        appendChinese(result.translated);
      }

      if (result.english || result.chinese) {
        transcriptEntries.push({
          timestamp: new Date().toLocaleTimeString(),
          english: result.english || '',
          chinese: result.translated || result.chinese || ''
        });
      }
      totalSegments += 1;
      totalAudioMs += Number(payload.durationMs || 0);
      totalEnglishChars += (result.english || '').length;
      totalTranslatedChars += (result.translated || result.chinese || '').length;
      updateCostSummary();

      if (result.warning) {
        appendEnglish(`Warning: ${result.warning}`, true);
      }

      englishLiveEl.textContent = '';
      chineseLiveEl.textContent = '';
      syncOutputWindow();
      updateModeSummary();
    }
  } catch (err) {
    appendEnglish(`Warning: ${err.message || String(err)}`, true);
    syncOutputWindow();
  } finally {
    segmentQueueRunning = false;
    updateModeSummary();
  }
}

async function loadDevices() {
  try {
    const probe = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    probe.getTracks().forEach((track) => track.stop());

    const devices = await navigator.mediaDevices.enumerateDevices();
    const audioInputs = devices.filter((d) => d.kind === 'audioinput');

    audioInputSelect.innerHTML = '';
    audioInputs.forEach((device, idx) => {
      const option = document.createElement('option');
      option.value = device.deviceId;
      option.textContent = device.label || `Input ${idx + 1}`;
      audioInputSelect.appendChild(option);
    });
  } catch (err) {
    setStatus(`Audio device access error: ${err.message}`);
  }
}

function flushRecorderChunk() {
  if (!mediaRecorder || mediaRecorder.state !== 'recording') return;
  mediaRecorder.stop();
}

function computeEnergy(dataArray) {
  let sum = 0;
  for (let i = 0; i < dataArray.length; i += 1) {
    const centered = dataArray[i] - 128;
    sum += centered * centered;
  }
  return Math.sqrt(sum / dataArray.length) / 128;
}

async function setupAudioPipeline() {
  const deviceId = audioInputSelect.value;
  mediaStream = await navigator.mediaDevices.getUserMedia({
    audio: {
      deviceId: deviceId ? { exact: deviceId } : undefined,
      echoCancellation: false,
      noiseSuppression: false,
      autoGainControl: false,
      channelCount: 1
    },
    video: false
  });

  mediaRecorder = new MediaRecorder(mediaStream, { mimeType: 'audio/webm;codecs=opus' });
  mediaRecorder.ondataavailable = (event) => {
    if (!event.data || event.data.size === 0) return;
    currentChunks.push(event.data);
  };

  mediaRecorder.onstop = async () => {
    if (!currentChunks.length) return;

    const blob = new Blob(currentChunks, { type: 'audio/webm' });
    currentChunks = [];

    if (worshipMode) {
      return;
    }

    const audioBuffer = await blob.arrayBuffer();
    pendingSegments.push({
      audioBase64: arrayBufferToBase64(audioBuffer),
      mimeType: blob.type,
      durationMs: pendingSegmentDurationMs
    });
    pendingSegmentDurationMs = 0;
    updateModeSummary();
    drainSegmentQueue();
  };

  audioContext = new AudioContext();
  const source = audioContext.createMediaStreamSource(mediaStream);
  analyser = audioContext.createAnalyser();
  analyser.fftSize = 512;
  source.connect(analyser);

  const bins = new Uint8Array(analyser.frequencyBinCount);

  const monitor = () => {
    if (!running) return;

    analyser.getByteTimeDomainData(bins);
    const energy = computeEnergy(bins);
    const threshold = Number(vadThresholdInput.value);
    const now = Date.now();

    if (energy > threshold) {
      speechDetectedAt = now;
      silenceStartedAt = 0;

      if (!recording) {
        recording = true;
        recordingStartedAt = now;
        englishLiveEl.textContent = 'Listening...';
        chineseLiveEl.textContent = 'Translating...';
        syncOutputWindow();
        if (mediaRecorder.state === 'inactive') {
          mediaRecorder.start(250);
        }
      }
    } else if (recording) {
      if (!silenceStartedAt) {
        silenceStartedAt = now;
      }

      const holdMs = Number(silenceMsInput.value);
      const spokenLongEnough = now - speechDetectedAt > 350;
      if (now - silenceStartedAt > holdMs && spokenLongEnough) {
        pendingSegmentDurationMs = Math.max(0, now - recordingStartedAt);
        recording = false;
        recordingStartedAt = 0;
        silenceStartedAt = 0;
        flushRecorderChunk();
      }
    }

    if (recording && recordingStartedAt) {
      const maxSegmentMs = Number(maxSegmentMsInput.value);
      if (now - recordingStartedAt >= maxSegmentMs) {
        pendingSegmentDurationMs = Math.max(0, now - recordingStartedAt);
        recording = false;
        recordingStartedAt = 0;
        silenceStartedAt = 0;
        flushRecorderChunk();
      }
    }

    monitorId = window.requestAnimationFrame(monitor);
  };

  monitor();
}

async function stopAudioPipeline() {
  if (monitorId) {
    window.cancelAnimationFrame(monitorId);
    monitorId = undefined;
  }

  if (recording) {
    pendingSegmentDurationMs = Math.max(0, Date.now() - recordingStartedAt);
    recording = false;
    recordingStartedAt = 0;
    flushRecorderChunk();
  }

  if (mediaStream) {
    mediaStream.getTracks().forEach((track) => track.stop());
    mediaStream = undefined;
  }

  if (audioContext) {
    await audioContext.close();
    audioContext = undefined;
  }

  mediaRecorder = undefined;
  analyser = undefined;
}

async function setRunning(nextRunning) {
  if (running === nextRunning) return;

  running = nextRunning;
  setRunningButtonState();
  await invoke('set_running', { nextRunning: running });

  if (running) {
    try {
      await setupAudioPipeline();
      setStatus('Running: capturing Korean audio and generating English + Chinese captions');
      drainSegmentQueue();
    } catch (err) {
      setStatus(`Start failed: ${err.message}`);
      running = false;
      setRunningButtonState();
      await invoke('set_running', { nextRunning: false });
    }
  } else {
    await stopAudioPipeline();
    pendingSegments.length = 0;
    englishLiveEl.textContent = '';
    chineseLiveEl.textContent = '';
    if (autoSaveOnStopInput.checked && transcriptEntries.length) {
      try {
        const saveResult = await invoke('auto_save_transcript', { entries: transcriptEntries });
        if (saveResult.ok) {
          setStatus(`Stopped and auto-saved transcript: ${saveResult.path}`);
        } else {
          setStatus(saveResult.message || 'Stopped');
        }
      } catch (err) {
        setStatus(`Stopped (auto-save failed: ${err.message || String(err)})`);
      }
    } else {
      setStatus('Stopped');
    }
    syncOutputWindow();
  }
  updateModeSummary();
}

async function syncTranslationConfig() {
  const glossary = glossaryInput.value || '';
  await invoke('set_translation_config', {
    config: {
      glossary,
      targetLanguage: targetLanguageSelect.value || 'zh-hans',
      sourceLanguage: sourceLanguageSelect.value || 'korean'
    }
  });
}

saveKeyButton.addEventListener('click', async () => {
  const apiKey = apiKeyInput.value.trim();

  try {
    const result = await invoke('config_api_key', { apiKey });
    if (result.ok) {
      setStatus('API key configured and saved securely');
    }
  } catch (err) {
    setStatus(err.message || 'Failed to configure API key');
  }
});

saveGlossaryButton.addEventListener('click', async () => {
  await syncTranslationConfig();
  localStorage.setItem('church-glossary', glossaryInput.value || '');
  setStatus('Glossary saved');
});

importGlossaryButton.addEventListener('click', async () => {
  const result = await invoke('import_glossary');
  if (result.ok && typeof result.content === 'string') {
    glossaryInput.value = result.content;
    await syncTranslationConfig();
    localStorage.setItem('church-glossary', glossaryInput.value || '');
    setStatus('Glossary imported');
  } else {
    setStatus(result.message || 'Glossary import canceled');
  }
});

exportGlossaryButton.addEventListener('click', async () => {
  const result = await invoke('export_glossary', { content: glossaryInput.value || '' });
  if (result.ok) {
    setStatus(`Glossary exported: ${result.path}`);
  } else {
    setStatus(result.message || 'Glossary export canceled');
  }
});

refreshDevicesButton.addEventListener('click', () => {
  loadDevices();
});

sourceLanguageSelect.addEventListener('change', async () => {
  await syncTranslationConfig();
  localStorage.setItem('church-source-language', sourceLanguageSelect.value || 'korean');
  setStatus(`Source language set to ${sourceLanguageSelect.value}`);
  updateModeSummary();
  updateCostSummary();
});

targetLanguageSelect.addEventListener('change', async () => {
  await syncTranslationConfig();
  localStorage.setItem('church-target-language', targetLanguageSelect.value || 'zh-hans');
  updateTranslatedHeading();
  setStatus(`Output language set to ${TARGET_LANGUAGE_LABELS[targetLanguageSelect.value] || targetLanguageSelect.value}`);
  updateModeSummary();
});

toggleRunButton.addEventListener('click', async () => {
  await setRunning(!running);
});

toggleWorshipModeButton.addEventListener('click', () => {
  setWorshipMode(!worshipMode);
});

togglePresentationButton.addEventListener('click', () => {
  setPresentationMode(!presentationMode);
});

toggleHelpButton.addEventListener('click', () => {
  setHelpVisible(!helpVisible);
});

toggleLockControlsButton.addEventListener('click', () => {
  setControlsLocked(!controlsLocked);
});

toggleOutputWindowButton.addEventListener('click', async () => {
  try {
    await invoke('toggle_output_window');
    setStatus('Toggled output window');
    await syncOutputWindow();
  } catch (err) {
    setStatus(`Output window error: ${err.message || String(err)}`);
  }
});

testAudioFileButton.addEventListener('click', () => {
  testAudioFileInput.click();
});

testAudioFileInput.addEventListener('change', async (event) => {
  const file = event.target?.files?.[0];
  await processTestAudioFile(file);
});

closeHelpButton.addEventListener('click', () => {
  setHelpVisible(false);
});

vadThresholdInput.addEventListener('input', () => {
  vadValueEl.textContent = Number(vadThresholdInput.value).toFixed(3);
  localStorage.setItem('church-vad-threshold', vadThresholdInput.value);
});

silenceMsInput.addEventListener('change', () => {
  localStorage.setItem('church-silence-ms', silenceMsInput.value);
});

maxSegmentMsInput.addEventListener('change', () => {
  localStorage.setItem('church-max-segment-ms', maxSegmentMsInput.value);
});

autoSaveOnStopInput.addEventListener('change', () => {
  localStorage.setItem('church-auto-save-on-stop', autoSaveOnStopInput.checked ? '1' : '0');
});

clearPanelsButton.addEventListener('click', () => {
  clearPanels();
  setStatus('Caption panels cleared');
});

clearTranscriptButton.addEventListener('click', () => {
  transcriptEntries.length = 0;
  setStatus('Transcript memory cleared');
  updateModeSummary();
});

resetSessionButton.addEventListener('click', () => {
  resetSessionState();
});

copyLatestChineseButton.addEventListener('click', async () => {
  const latestChinese = getLatestChineseLine();
  if (!latestChinese) {
    setStatus('No output caption available to copy');
    return;
  }

  try {
    await navigator.clipboard.writeText(latestChinese);
    setStatus('Copied latest output caption');
  } catch {
    setStatus('Clipboard permission denied');
  }
});

exportTranscriptButton.addEventListener('click', async () => {
  const result = await invoke('export_transcript', { entries: transcriptEntries });
  if (result.ok) {
    setStatus(`Transcript exported: ${result.path}`);
  } else {
    setStatus(result.message || 'Transcript export failed');
  }
});

async function boot() {
  try {
    const loaded = await invoke('load_saved_api_key');
    if (loaded.found) {
      setStatus('API key loaded from secure storage');
    }
  } catch {
    setStatus('Saved API key could not be loaded from secure storage');
  }

  await loadDevices();

  const runState = await invoke('get_running');
  running = Boolean(runState.running);
  setRunningButtonState();

  const savedVadThreshold = loadNumericSetting('church-vad-threshold', 0.04, 0.01, 0.12);
  const savedSilenceMs = loadNumericSetting('church-silence-ms', 600, 200, 3000);
  const savedMaxSegmentMs = loadNumericSetting('church-max-segment-ms', 2500, 1200, 10000);

  vadThresholdInput.value = savedVadThreshold.toString();
  silenceMsInput.value = savedSilenceMs.toString();
  maxSegmentMsInput.value = savedMaxSegmentMs.toString();
  vadValueEl.textContent = Number(vadThresholdInput.value).toFixed(3);

  const savedGlossary = localStorage.getItem('church-glossary');
  if (savedGlossary) {
    glossaryInput.value = savedGlossary;
  }

  const savedSourceLanguage = localStorage.getItem('church-source-language');
  if (savedSourceLanguage === 'english' || savedSourceLanguage === 'korean' || savedSourceLanguage === 'japanese' || savedSourceLanguage === 'chinese') {
    sourceLanguageSelect.value = savedSourceLanguage;
  }

  const savedTargetLanguage = localStorage.getItem('church-target-language');
  if (savedTargetLanguage && TARGET_LANGUAGE_LABELS[savedTargetLanguage]) {
    targetLanguageSelect.value = savedTargetLanguage;
  }

  const savedAutoSaveOnStop = localStorage.getItem('church-auto-save-on-stop');
  autoSaveOnStopInput.checked = savedAutoSaveOnStop !== '0';

  const savedControlsLocked = localStorage.getItem('church-controls-locked');
  setControlsLocked(savedControlsLocked === '1');
  updateTranslatedHeading();

  await syncTranslationConfig();
  updateModeSummary();
  updateCostSummary();

  await listen('toggle-from-hotkey', async (event) => {
    const payload = event.payload || {};
    await setRunning(Boolean(payload.running));
  });

  await listen('toggle-presentation-mode', () => {
    setPresentationMode(!presentationMode);
  });

  await listen('toggle-worship-mode', () => {
    setWorshipMode(!worshipMode);
  });

  await listen('toggle-help-overlay', () => {
    setHelpVisible(!helpVisible);
  });

  await listen('toggle-lock-controls', () => {
    setControlsLocked(!controlsLocked);
  });

  await listen('reset-session', () => {
    resetSessionState();
  });
}

boot();
