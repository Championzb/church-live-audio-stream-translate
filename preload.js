const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('churchTranslate', {
  configApiKey: (apiKey) => ipcRenderer.invoke('config-api-key', apiKey),
  setTranslationConfig: (config) => ipcRenderer.invoke('set-translation-config', config),
  getRunning: () => ipcRenderer.invoke('get-running'),
  setRunning: (running) => ipcRenderer.invoke('set-running', running),
  submitSegment: (payload) => ipcRenderer.send('segment-ready', payload),
  onSegmentResult: (handler) => {
    const wrapped = (_event, data) => handler(data);
    ipcRenderer.on('segment-result', wrapped);
    return () => ipcRenderer.removeListener('segment-result', wrapped);
  },
  onToggleFromHotkey: (handler) => {
    const wrapped = (_event, data) => handler(data);
    ipcRenderer.on('toggle-from-hotkey', wrapped);
    return () => ipcRenderer.removeListener('toggle-from-hotkey', wrapped);
  }
});
