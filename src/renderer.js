const apiKeyInput = document.getElementById('apiKey');
const saveKeyButton = document.getElementById('saveKey');
const audioInputSelect = document.getElementById('audioInput');
const refreshDevicesButton = document.getElementById('refreshDevices');
const toggleRunButton = document.getElementById('toggleRun');
const clearPanelsButton = document.getElementById('clearPanels');
const exportTranscriptButton = document.getElementById('exportTranscript');
const statusEl = document.getElementById('status');
const englishPanel = document.getElementById('englishPanel');
const chinesePanel = document.getElementById('chinesePanel');
const vadThresholdInput = document.getElementById('vadThreshold');
const vadValueEl = document.getElementById('vadValue');
const silenceMsInput = document.getElementById('silenceMs');
const glossaryInput = document.getElementById('glossary');
const saveGlossaryButton = document.getElementById('saveGlossary');

const MAX_LINES = 6;
let running = false;
let mediaStream;
let mediaRecorder;
let audioContext;
let analyser;
let monitorId;
let speechDetectedAt = 0;
let silenceStartedAt = 0;
let currentChunks = [];
let recording = false;

const englishLines = [];
const chineseLines = [];
const transcriptEntries = [];

function setStatus(text) {
  statusEl.textContent = text;
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
}

function appendChinese(text, warning = false) {
  if (!text) return;
  chineseLines.push({ text, warning });
  while (chineseLines.length > MAX_LINES) chineseLines.shift();
  renderLines(chinesePanel, chineseLines);
}

function clearPanels() {
  englishLines.length = 0;
  chineseLines.length = 0;
  renderLines(englishPanel, englishLines);
  renderLines(chinesePanel, chineseLines);
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
  mediaRecorder.ondataavailable = async (event) => {
    if (!event.data || event.data.size === 0) return;
    currentChunks.push(event.data);
  };

  mediaRecorder.onstop = async () => {
    if (!currentChunks.length) return;

    const blob = new Blob(currentChunks, { type: 'audio/webm' });
    currentChunks = [];

    const audioBuffer = await blob.arrayBuffer();

    window.churchTranslate.submitSegment({
      audioBuffer,
      mimeType: blob.type
    });
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
        recording = false;
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
    recording = false;
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
  await window.churchTranslate.setRunning(running);

  if (running) {
    try {
      await setupAudioPipeline();
      setStatus('Running: capturing Korean audio and generating English + Chinese captions');
    } catch (err) {
      setStatus(`Start failed: ${err.message}`);
      running = false;
      setRunningButtonState();
      await window.churchTranslate.setRunning(false);
    }
  } else {
    await stopAudioPipeline();
    setStatus('Stopped');
  }
}

async function syncTranslationConfig() {
  const glossary = glossaryInput.value || '';
  await window.churchTranslate.setTranslationConfig({
    glossary,
    chineseVariant: 'simplified'
  });
}

saveKeyButton.addEventListener('click', async () => {
  const apiKey = apiKeyInput.value.trim();
  const result = await window.churchTranslate.configApiKey(apiKey);
  if (result.ok) {
    localStorage.setItem('church-openai-key', apiKey);
    setStatus('API key configured');
  } else {
    setStatus(result.message || 'Failed to configure API key');
  }
});

saveGlossaryButton.addEventListener('click', async () => {
  await syncTranslationConfig();
  localStorage.setItem('church-glossary', glossaryInput.value || '');
  setStatus('Glossary saved');
});

refreshDevicesButton.addEventListener('click', () => {
  loadDevices();
});

toggleRunButton.addEventListener('click', async () => {
  await setRunning(!running);
});

vadThresholdInput.addEventListener('input', () => {
  vadValueEl.textContent = Number(vadThresholdInput.value).toFixed(3);
});

window.churchTranslate.onSegmentResult((payload) => {
  if (payload.english) {
    appendEnglish(payload.english);
  }

  if (payload.chinese) {
    appendChinese(payload.chinese);
  }

  if (payload.english || payload.chinese) {
    transcriptEntries.push({
      timestamp: new Date().toLocaleTimeString(),
      english: payload.english || '',
      chinese: payload.chinese || ''
    });
  }

  if (payload.warning) {
    appendEnglish(`Warning: ${payload.warning}`, true);
  }
});

window.churchTranslate.onToggleFromHotkey(async ({ running: nextRunning }) => {
  await setRunning(nextRunning);
});

clearPanelsButton.addEventListener('click', () => {
  clearPanels();
  setStatus('Caption panels cleared');
});

exportTranscriptButton.addEventListener('click', async () => {
  const result = await window.churchTranslate.exportTranscript({ entries: transcriptEntries });
  if (result.ok) {
    setStatus(`Transcript exported: ${result.path}`);
  } else {
    setStatus(result.message || 'Transcript export failed');
  }
});

async function boot() {
  const savedKey = localStorage.getItem('church-openai-key');
  if (savedKey) {
    apiKeyInput.value = savedKey;
    const result = await window.churchTranslate.configApiKey(savedKey);
    if (result.ok) {
      setStatus('API key loaded from local settings');
    }
  }

  await loadDevices();

  const runState = await window.churchTranslate.getRunning();
  running = Boolean(runState.running);
  setRunningButtonState();
  vadValueEl.textContent = Number(vadThresholdInput.value).toFixed(3);

  const savedGlossary = localStorage.getItem('church-glossary');
  if (savedGlossary) {
    glossaryInput.value = savedGlossary;
  }
  await syncTranslationConfig();
}

boot();
