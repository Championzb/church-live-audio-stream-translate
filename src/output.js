const modeSummaryEl = document.getElementById('modeSummary');
const englishPanel = document.getElementById('englishPanel');
const chinesePanel = document.getElementById('chinesePanel');
const translatedHeadingEl = document.getElementById('translatedHeading');
const englishLiveEl = document.getElementById('englishLive');
const chineseLiveEl = document.getElementById('chineseLive');
const outputWindowMinimizeButton = document.getElementById('outputWindowMinimize');
const outputWindowMaximizeButton = document.getElementById('outputWindowMaximize');
const outputWindowCloseButton = document.getElementById('outputWindowClose');
const OUTPUT_SNAPSHOT_STORAGE_KEY = 'church-output-latest-snapshot';
const OUTPUT_BROADCAST_CHANNEL_NAME = 'church-output-caption';
const PROJECTOR_MAX_HISTORY_LINES = 2;
const PROJECTOR_LAUNCH_WIDTH = 1280;
const PROJECTOR_LAUNCH_HEIGHT = 720;

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
  panel.scrollTop = 0;
}

function renderLines(panel, lines) {
  panel.innerHTML = '';
  const recentLines = Array.isArray(lines)
    ? lines.filter((text) => Boolean(text)).slice(-PROJECTOR_MAX_HISTORY_LINES).reverse()
    : [];
  const previousLatest = panel.dataset.latestText || '';
  const currentLatest = recentLines[0] || '';
  const hasNewLatest = Boolean(currentLatest && currentLatest !== previousLatest);
  panel.dataset.latestText = currentLatest;

  recentLines.forEach((text, index) => {
    if (!text) return;
    const div = document.createElement('div');
    const isTopLatest = index === 0;
    const isSecondLatest = index === 1;
    div.className = `line ${isTopLatest ? 'line-latest' : ''} ${isSecondLatest ? 'line-second-latest' : ''}`;
    if (isSecondLatest && hasNewLatest) {
      div.classList.add('line-roll-back');
    }
    div.textContent = text;
    panel.appendChild(div);
  });

  // If two cards still overflow, shrink only the second-latest card.
  const secondLatest = panel.querySelector('.line-second-latest');
  if (panel.scrollHeight > panel.clientHeight && secondLatest instanceof HTMLElement) {
    secondLatest.classList.add('line-second-compact');
  }

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

function bindDragBars(invoke) {
  const currentWindow =
    window.__TAURI__
    && window.__TAURI__.window
    && typeof window.__TAURI__.window.getCurrentWindow === 'function'
      ? window.__TAURI__.window.getCurrentWindow()
      : null;
  const isNoDragTarget = (target) => {
    if (!(target instanceof Element)) return false;
    return Boolean(target.closest('button, input, select, textarea, [role="button"], [data-no-drag]'));
  };
  const toggleProjectorMaximize = async () => {
    if (invoke) {
      try {
        await invoke('control_window', { action: 'toggle_maximize_restore_launch_size' });
        return;
      } catch {
        // fall back to frontend API below
      }
    }
    if (!currentWindow) return;
    try {
      const isMaximized = typeof currentWindow.isMaximized === 'function'
        ? await currentWindow.isMaximized()
        : false;
      if (isMaximized) {
        if (typeof currentWindow.unmaximize === 'function') {
          await currentWindow.unmaximize();
        }
        const LogicalSizeCtor =
          window.__TAURI__
          && window.__TAURI__.dpi
          && window.__TAURI__.dpi.LogicalSize
            ? window.__TAURI__.dpi.LogicalSize
            : null;
        if (LogicalSizeCtor && typeof currentWindow.setSize === 'function') {
          await currentWindow.setSize(new LogicalSizeCtor(PROJECTOR_LAUNCH_WIDTH, PROJECTOR_LAUNCH_HEIGHT));
        }
      } else if (typeof currentWindow.maximize === 'function') {
        await currentWindow.maximize();
      }
    } catch {
      // ignore maximize/restore fallback failures
    }
  };
  const dragBars = Array.from(document.querySelectorAll('.window-drag-bar'));
  dragBars.forEach((bar) => {
    if (!(bar instanceof HTMLElement)) return;
    bar.addEventListener('pointerdown', async (event) => {
      if (event.button !== 0) return;
      if (isNoDragTarget(event.target)) return;
      if (event.detail > 1) return;
      if (invoke) {
        try {
          await invoke('start_dragging_window');
          return;
        } catch {
          // fallback to frontend API below
        }
      }
      if (currentWindow && typeof currentWindow.startDragging === 'function') {
        void currentWindow.startDragging();
      }
    });
    bar.addEventListener('dblclick', (event) => {
      if (isNoDragTarget(event.target)) return;
      void toggleProjectorMaximize();
    });
  });
}

function bindWindowControls(invoke) {
  if (!invoke) return;
  const runWindowAction = async (action) => {
    try {
      await invoke('control_window', { action });
    } catch {
      // ignore control errors
    }
  };
  if (outputWindowMinimizeButton) {
    outputWindowMinimizeButton.addEventListener('click', () => {
      void runWindowAction('minimize');
    });
  }
  if (outputWindowMaximizeButton) {
    outputWindowMaximizeButton.addEventListener('click', () => {
      void runWindowAction('toggle_maximize');
    });
  }
  if (outputWindowCloseButton) {
    outputWindowCloseButton.addEventListener('click', () => {
      void runWindowAction('close');
    });
  }
}

async function boot() {
  const { invoke, listen } = await resolveTauriApis();
  bindDragBars(invoke);
  bindWindowControls(invoke);
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
