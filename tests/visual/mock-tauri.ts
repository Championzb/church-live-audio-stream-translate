export const installVisualTauriMock = () => {
  const getVisualMode = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('visualMode') || 'landing';
  };

  const state = {
    mode: getVisualMode(),
    running: false,
    outputWindowOpen: false,
  };
  const eventListeners = new Map<string, Set<(payload: unknown) => void>>();

  const mockListen = async (eventName: string, handler: (event: { payload: unknown }) => void) => {
    if (!eventListeners.has(eventName)) {
      eventListeners.set(eventName, new Set());
    }
    const wrapped = (payload: unknown) => handler({ payload });
    eventListeners.get(eventName)?.add(wrapped);
    return () => {
      eventListeners.get(eventName)?.delete(wrapped);
    };
  };

  (window as Window & { __TAURI__?: unknown }).__TAURI__ = {
    core: {
      invoke: async (command: string, args?: Record<string, unknown>) => {
        switch (command) {
          case 'load_saved_api_key':
            return state.mode === 'landing' ? { found: false, maskedKey: '' } : { found: true, maskedKey: 'sk-****test' };
          case 'load_saved_admin_api_key':
            return { found: false };
          case 'load_saved_raw_keys_for_update_panel':
            return {
              api_key: state.mode === 'landing' ? '' : 'sk-visual-test',
              admin_api_key: '',
              project_id: 'proj_visual',
            };
          case 'config_api_key':
          case 'config_admin_api_key':
            return { ok: true };
          case 'get_running':
            return state.running;
          case 'set_running':
            state.running = Boolean(args?.nextRunning);
            return { ok: true };
          case 'set_translation_config':
            return { ok: true };
          case 'fetch_project_costs':
            return { todayCost: 0, monthCost: 0, currency: 'USD' };
          case 'import_glossary':
            return { content: 'Grace=恩典\nFaith=信心' };
          case 'export_glossary':
            return { ok: true };
          case 'is_output_window_open':
            return state.outputWindowOpen;
          case 'toggle_output_window':
            state.outputWindowOpen = !state.outputWindowOpen;
            return { open: state.outputWindowOpen };
          case 'push_output_caption':
            return { ok: true };
          case 'process_segment':
            return {
              english_text: 'Grace and peace be with you.',
              translated_text: '愿恩典与平安与你同在。',
            };
          case 'export_transcript':
            return { ok: true, path: '/tmp/visual-transcript.txt' };
          case 'auto_save_transcript':
            return { ok: true, path: '/tmp/auto-save-visual.txt' };
          case 'start_dragging_window':
          case 'control_window':
            return { ok: true };
          default:
            return { ok: true };
        }
      },
    },
    event: {
      listen: mockListen,
    },
  };

  Object.defineProperty(navigator, 'mediaDevices', {
    configurable: true,
    value: {
      enumerateDevices: async () => [
        { deviceId: 'visual-default', kind: 'audioinput', label: 'Visual Mic', groupId: 'g1' },
      ],
      getUserMedia: async () => {
        throw new Error('Visual tests do not open live media streams.');
      },
    },
  });

  const css = document.createElement('style');
  css.textContent = `
    *,
    *::before,
    *::after {
      transition-duration: 0s !important;
      animation-duration: 0s !important;
      caret-color: transparent !important;
    }
  `;
  document.documentElement.appendChild(css);
};
