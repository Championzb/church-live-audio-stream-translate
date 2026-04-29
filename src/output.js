const tauriCore = window.__TAURI__ && window.__TAURI__.core ? window.__TAURI__.core : null;
const tauriEvent = window.__TAURI__ && window.__TAURI__.event ? window.__TAURI__.event : null;
const invoke = tauriCore && typeof tauriCore.invoke === 'function' ? tauriCore.invoke.bind(tauriCore) : null;
const listen = tauriEvent && typeof tauriEvent.listen === 'function' ? tauriEvent.listen.bind(tauriEvent) : null;

const modeSummaryEl = document.getElementById('modeSummary');
const englishPanel = document.getElementById('englishPanel');
const chinesePanel = document.getElementById('chinesePanel');
const translatedHeadingEl = document.getElementById('translatedHeading');
const englishLiveEl = document.getElementById('englishLive');
const chineseLiveEl = document.getElementById('chineseLive');

function renderLines(panel, lines) {
  panel.innerHTML = '';
  lines.forEach((text) => {
    if (!text) return;
    const div = document.createElement('div');
    div.className = 'line';
    div.textContent = text;
    panel.appendChild(div);
  });
}

async function boot() {
  if (!listen) {
    console.error('[output] Tauri event API unavailable; output listener not attached.');
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

  await listen('output-caption', (event) => {
    const payload = event.payload || {};
    modeSummaryEl.textContent = payload.modeSummary || 'Waiting for captions...';
    translatedHeadingEl.textContent = payload.targetLabel || 'Translation';
    englishLiveEl.textContent = payload.englishLive || '';
    chineseLiveEl.textContent = payload.chineseLive || '';
    renderLines(englishPanel, payload.englishLines || []);
    renderLines(chinesePanel, payload.chineseLines || []);
    sendHeartbeat();
  });

  sendReady();
  window.setTimeout(() => {
    sendReady();
  }, 260);
}

boot();
