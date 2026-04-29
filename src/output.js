const modeSummaryEl = document.getElementById('modeSummary');
const englishPanel = document.getElementById('englishPanel');
const chinesePanel = document.getElementById('chinesePanel');
const translatedHeadingEl = document.getElementById('translatedHeading');
const englishLiveEl = document.getElementById('englishLive');
const chineseLiveEl = document.getElementById('chineseLive');
const OUTPUT_SNAPSHOT_STORAGE_KEY = 'church-output-latest-snapshot';
const OUTPUT_BROADCAST_CHANNEL_NAME = 'church-output-caption';
const PROJECTOR_MAX_HISTORY_LINES = 6;

async function resolveTauriApis(maxWaitMs = 5000) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < maxWaitMs) {
    const tauri = window.__TAURI__;
    const core = tauri && tauri.core;
    const event = tauri && tauri.event;
    const invoke = core && typeof core.invoke === 'function' ? core.invoke.bind(core) : null;
    const listen = event && typeof event.listen === 'function' ? event.listen.bind(event) : null;
    if (invoke || listen) {
      return { invoke, listen };
    }
    await new Promise((resolve) => window.setTimeout(resolve, 80));
  }
  return { invoke: null, listen: null };
}

function pinPanelToLatest(panel) {
  panel.scrollTop = panel.scrollHeight;
}

function renderLines(panel, lines) {
  panel.innerHTML = '';
  const recentLines = Array.isArray(lines)
    ? lines.filter((text) => Boolean(text)).slice(-PROJECTOR_MAX_HISTORY_LINES)
    : [];
  recentLines.forEach((text) => {
    if (!text) return;
    const div = document.createElement('div');
    div.className = 'line';
    div.textContent = text;
    panel.appendChild(div);
  });
  pinPanelToLatest(panel);
}

function applyCaptionPayload(payload) {
  const data = payload || {};
  modeSummaryEl.textContent = data.modeSummary || 'Waiting for captions...';
  translatedHeadingEl.textContent = data.targetLabel || 'Translation';
  englishLiveEl.textContent = data.englishLive || '';
  chineseLiveEl.textContent = data.chineseLive || '';
  renderLines(englishPanel, data.englishLines || []);
  renderLines(chinesePanel, data.chineseLines || []);
  window.requestAnimationFrame(() => {
    pinPanelToLatest(englishPanel);
    pinPanelToLatest(chinesePanel);
  });
}

window.__applyOutputCaption = applyCaptionPayload;

function applySnapshotFromStorage() {
  try {
    const raw = localStorage.getItem(OUTPUT_SNAPSHOT_STORAGE_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return false;
    applyCaptionPayload(parsed);
    return true;
  } catch {
    return false;
  }
}

async function boot() {
  const { invoke, listen } = await resolveTauriApis();
  if (!invoke && !listen) {
    console.error('[output] Tauri APIs unavailable; output listener and bootstrap fetch not attached.');
    return;
  }

  let lastHeartbeatAt = 0;
  const sendHeartbeat = () => {
    if (!invoke) return;
    const now = Date.now();
    if (now - lastHeartbeatAt < 450) return;
    lastHeartbeatAt = now;
    void invoke('notify_output_window_state', { state: 'rendered' });
  };
  const sendReady = () => {
    if (!invoke) return;
    void invoke('notify_output_window_state', { state: 'ready' });
  };
  const fetchLatestSnapshot = async () => {
    if (!invoke) return;
    try {
      const latestPayload = await invoke('get_latest_output_caption');
      if (latestPayload) {
        applyCaptionPayload(latestPayload);
        sendHeartbeat();
      }
    } catch {
      // ignore snapshot fetch errors
    }
  };

  if (listen) {
    await listen('output-caption', (event) => {
      const payload = event.payload || {};
      applyCaptionPayload(payload);
      sendHeartbeat();
    });
  }

  try {
    const channel = new BroadcastChannel(OUTPUT_BROADCAST_CHANNEL_NAME);
    channel.onmessage = (event) => {
      if (!event || !event.data) return;
      applyCaptionPayload(event.data);
      sendHeartbeat();
    };
  } catch {
    // ignore unsupported BroadcastChannel
  }

  await fetchLatestSnapshot();
  applySnapshotFromStorage();
  window.setTimeout(() => {
    void fetchLatestSnapshot();
    applySnapshotFromStorage();
  }, 180);
  window.setTimeout(() => {
    void fetchLatestSnapshot();
    applySnapshotFromStorage();
  }, 520);
  window.setInterval(() => {
    void fetchLatestSnapshot();
    applySnapshotFromStorage();
  }, 1200);

  sendReady();
  window.setTimeout(() => {
    sendReady();
  }, 260);
}

boot();
