const { listen } = window.__TAURI__.event;

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
  await listen('output-caption', (event) => {
    const payload = event.payload || {};
    modeSummaryEl.textContent = payload.modeSummary || 'Waiting for captions...';
    translatedHeadingEl.textContent = payload.targetLabel || 'Translation';
    englishLiveEl.textContent = payload.englishLive || '';
    chineseLiveEl.textContent = payload.chineseLive || '';
    renderLines(englishPanel, payload.englishLines || []);
    renderLines(chinesePanel, payload.chineseLines || []);
  });
}

boot();
