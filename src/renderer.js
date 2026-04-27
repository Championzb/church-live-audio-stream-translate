"use strict";
const { invoke } = window.__TAURI__.core;
const { listen } = window.__TAURI__.event;
const landingPage = document.getElementById('landingPage');
const mainPage = document.getElementById('mainPage');
const landingTitleEl = document.getElementById('landingTitle');
const landingSubtitleEl = document.getElementById('landingSubtitle');
const landingStatusEl = document.getElementById('landingStatus');
const apiKeyInput = document.getElementById('apiKey');
const saveKeyButton = document.getElementById('saveKey');
const maskedApiKeyEl = document.getElementById('maskedApiKey');
const apiKeyModal = document.getElementById('apiKeyModal');
const apiKeyModalTitleEl = document.getElementById('apiKeyModalTitle');
const apiKeyModalSubtitleEl = document.getElementById('apiKeyModalSubtitle');
const labelMainApiKeyEl = document.getElementById('labelMainApiKey');
const mainApiKeyInput = document.getElementById('mainApiKeyInput');
const saveMainApiKeyButton = document.getElementById('saveMainApiKey');
const cancelMainApiKeyButton = document.getElementById('cancelMainApiKey');
const uiLanguageSelect = document.getElementById('uiLanguage');
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
const labelApiKeyEl = document.getElementById('labelApiKey');
const labelUiLanguageEl = document.getElementById('labelUiLanguage');
const labelAudioInputEl = document.getElementById('labelAudioInput');
const labelSourceLanguageEl = document.getElementById('labelSourceLanguage');
const labelTargetLanguageEl = document.getElementById('labelTargetLanguage');
const labelVadThresholdEl = document.getElementById('labelVadThreshold');
const labelSilenceMsEl = document.getElementById('labelSilenceMs');
const labelMaxSegmentMsEl = document.getElementById('labelMaxSegmentMs');
const labelGlossaryEl = document.getElementById('labelGlossary');
const labelAutoSaveOnStopEl = document.getElementById('labelAutoSaveOnStop');
const englishHeadingEl = document.getElementById('englishHeading');
const helpTitleEl = document.getElementById('helpTitle');
const helpF8El = document.getElementById('helpF8');
const helpF7El = document.getElementById('helpF7');
const helpF6El = document.getElementById('helpF6');
const helpF2El = document.getElementById('helpF2');
const helpF4El = document.getElementById('helpF4');
const helpF1El = document.getElementById('helpF1');
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
let lastPresentationToggleAt = 0;
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
const UI_TEXT = {
    en: {
        'landing.title': 'Connect OpenAI API Key',
        'landing.subtitle': 'Enter your key once to continue. It is stored securely in your OS keychain/credential manager.',
        'label.apiKey': 'OpenAI API Key',
        'label.uiLanguage': 'UI Language',
        'label.audioInput': 'Audio Input',
        'label.sourceLanguage': 'Source Language',
        'label.targetLanguage': 'Output Language',
        'label.vadThreshold': 'VAD Threshold',
        'label.silenceMs': 'Silence Hold (ms)',
        'label.maxSegmentMs': 'Max Segment (ms)',
        'label.glossary': 'Glossary (one term per line, EN=ZH)',
        'label.autoSaveOnStop': 'Auto-save on stop',
        'heading.english': 'English',
        'button.saveKey': 'Save Key',
        'button.refresh': 'Refresh',
        'button.start': 'Start (F8)',
        'button.stop': 'Stop (F8)',
        'button.worshipOn': 'Worship Mode On (F7)',
        'button.worshipOff': 'Worship Mode Off (F7)',
        'button.presentationOn': 'Exit Presentation (F6)',
        'button.presentationOff': 'Presentation Mode (F6)',
        'button.help': 'Help (F1)',
        'button.lockOn': 'Unlock Controls (F2)',
        'button.lockOff': 'Lock Controls (F2)',
        'button.outputWindow': 'Output Window',
        'button.testAudioFile': 'Test Audio File',
        'button.clearCaptions': 'Clear Captions',
        'button.clearTranscript': 'Clear Transcript',
        'button.resetSession': 'Reset Session (F4)',
        'button.copyLatestOutput': 'Copy Latest Output',
        'button.exportTranscript': 'Export Transcript',
        'button.saveGlossary': 'Save Glossary',
        'button.import': 'Import',
        'button.export': 'Export',
        'button.close': 'Close',
        'button.cancel': 'Cancel',
        'apiKey.masked': 'OpenAI Key: {masked}',
        'apiKey.hidden': 'OpenAI Key: hidden',
        'modal.apiKeyTitle': 'Update OpenAI API Key',
        'modal.apiKeySubtitle': 'Enter a new key and save it to secure storage.',
        'tooltip.saveKey': 'Save API key to secure OS storage (Keychain/Credential Manager).',
        'tooltip.refresh': 'Refresh and re-detect available audio input devices.',
        'tooltip.start': 'Start live capture and translation (F8).',
        'tooltip.stop': 'Stop live capture and translation (F8).',
        'tooltip.worshipOn': 'Worship mode is ON: translation is paused for songs. Click to resume translation (F7).',
        'tooltip.worshipOff': 'Worship mode is OFF: translation is active. Click to pause translation for songs (F7).',
        'tooltip.presentationOn': 'Exit presentation mode and show operator controls (F6).',
        'tooltip.presentationOff': 'Enter presentation mode for large subtitle display (F6).',
        'tooltip.help': 'Show or hide the hotkey/help overlay (F1).',
        'tooltip.lockOn': 'Unlock configuration controls to allow editing (F2).',
        'tooltip.lockOff': 'Lock configuration controls to avoid accidental changes (F2).',
        'tooltip.outputWindow': 'Open or close the subtitle-only output window for a second screen.',
        'tooltip.testAudioFile': 'Run one audio file through the same translation pipeline for testing.',
        'tooltip.clearCaptions': 'Clear current English and output caption panels only.',
        'tooltip.clearTranscript': 'Clear transcript memory without clearing current caption panels.',
        'tooltip.resetSession': 'Reset queue, captions, transcript, and cost/session counters (F4).',
        'tooltip.copyLatestOutput': 'Copy the latest translated output caption line to clipboard.',
        'tooltip.exportTranscript': 'Export the current transcript entries to a text file.',
        'tooltip.saveGlossary': 'Save current glossary text for translation prompts.',
        'tooltip.import': 'Import glossary content from a text file.',
        'tooltip.export': 'Export glossary content to a text file.',
        'tooltip.close': 'Close the help panel.',
        'help.title': 'Quick Controls',
        'help.f8': '<strong>F8</strong>: Start/Stop translation',
        'help.f7': '<strong>F7</strong>: Toggle worship mode',
        'help.f6': '<strong>F6</strong>: Toggle presentation mode',
        'help.f2': '<strong>F2</strong>: Lock/unlock config controls',
        'help.f4': '<strong>F4</strong>: Reset captions + transcript + queue',
        'help.f1': '<strong>F1</strong>: Toggle this help panel',
        'status.idle': 'Idle',
        'status.controlsLocked': 'Config controls locked',
        'status.controlsUnlocked': 'Config controls unlocked',
        'status.worshipEnabled': 'Worship mode enabled: translation is paused',
        'status.worshipDisabledRunning': 'Worship mode disabled: translation resumed',
        'status.worshipDisabled': 'Worship mode disabled',
        'status.sessionReset': 'Session reset: captions, transcript, and queue cleared',
        'status.retryingSegment': 'Retrying segment ({attempt}/{max})...',
        'status.testingFile': 'Testing file: {name}',
        'status.fileTestFinished': 'Finished file test: {name}',
        'status.fileTestFailed': 'File test failed: {error}',
        'status.audioDeviceAccessError': 'Audio device access error: {error}',
        'status.running': 'Running: capturing {source} audio and generating English + {target} captions',
        'status.startFailed': 'Start failed: {error}',
        'status.autoSaved': 'Stopped and auto-saved transcript: {path}',
        'status.stopped': 'Stopped',
        'status.autoSaveFailed': 'Stopped (auto-save failed: {error})',
        'status.apiKeySaved': 'API key configured and saved securely',
        'status.apiKeyFailed': 'Failed to configure API key',
        'status.apiKeyRequired': 'Enter your OpenAI API key to continue',
        'status.glossarySaved': 'Glossary saved',
        'status.glossaryImported': 'Glossary imported',
        'status.glossaryImportCanceled': 'Glossary import canceled',
        'status.glossaryExported': 'Glossary exported: {path}',
        'status.glossaryExportCanceled': 'Glossary export canceled',
        'status.sourceSet': 'Source language set to {source}',
        'status.outputSet': 'Output language set to {target}',
        'status.outputWindowToggled': 'Toggled output window',
        'status.outputWindowError': 'Output window error: {error}',
        'status.captionsCleared': 'Caption panels cleared',
        'status.transcriptCleared': 'Transcript memory cleared',
        'status.noOutputToCopy': 'No output caption available to copy',
        'status.copyDone': 'Copied latest output caption',
        'status.clipboardDenied': 'Clipboard permission denied',
        'status.transcriptExported': 'Transcript exported: {path}',
        'status.transcriptExportFailed': 'Transcript export failed',
        'status.apiKeyLoaded': 'API key loaded from secure storage',
        'status.apiKeyLoadFailed': 'Saved API key could not be loaded from secure storage',
        'status.listening': 'Listening...',
        'status.translating': 'Translating...',
        'status.warning': 'Warning: {warning}',
        'mode.running': 'running',
        'mode.stopped': 'stopped',
        'mode.on': 'on',
        'mode.off': 'off',
        'mode.queueProcessing': 'processing',
        'mode.summary': 'Mode: {mode} | Source: {source} | Target: {target} | Worship: {worship} | Presentation: {presentation} | Queue: {queue}',
        'cost.summary': 'Cost estimate: session {session} USD | month {month} USD',
        'ui.en': 'English',
        'ui.zh-hans': 'Simplified Chinese',
        'source.korean': '{language} (translate to English)',
        'source.english': '{language} (direct transcription)',
        'source.japanese': '{language}',
        'source.chinese': '{language}',
        'device.default': 'System Default',
        'device.input': 'Input {index}'
    },
    'zh-hans': {
        'landing.title': '连接 OpenAI API 密钥',
        'landing.subtitle': '请输入一次密钥后继续。密钥将安全存储在系统钥匙串/凭据管理器中。',
        'label.apiKey': 'OpenAI API 密钥',
        'label.uiLanguage': '界面语言',
        'label.audioInput': '音频输入',
        'label.sourceLanguage': '源语言',
        'label.targetLanguage': '输出语言',
        'label.vadThreshold': 'VAD 阈值',
        'label.silenceMs': '静音保持（毫秒）',
        'label.maxSegmentMs': '最长片段（毫秒）',
        'label.glossary': '术语表（每行一个，EN=ZH）',
        'label.autoSaveOnStop': '停止时自动保存',
        'heading.english': '英文',
        'button.saveKey': '保存密钥',
        'button.refresh': '刷新',
        'button.start': '开始（F8）',
        'button.stop': '停止（F8）',
        'button.worshipOn': '敬拜模式开启（F7）',
        'button.worshipOff': '敬拜模式关闭（F7）',
        'button.presentationOn': '退出投屏模式（F6）',
        'button.presentationOff': '投屏模式（F6）',
        'button.help': '帮助（F1）',
        'button.lockOn': '解锁控制项（F2）',
        'button.lockOff': '锁定控制项（F2）',
        'button.outputWindow': '输出窗口',
        'button.testAudioFile': '测试音频文件',
        'button.clearCaptions': '清除字幕',
        'button.clearTranscript': '清除转录',
        'button.resetSession': '重置会话（F4）',
        'button.copyLatestOutput': '复制最新输出',
        'button.exportTranscript': '导出转录',
        'button.saveGlossary': '保存术语表',
        'button.import': '导入',
        'button.export': '导出',
        'button.close': '关闭',
        'button.cancel': '取消',
        'apiKey.masked': 'OpenAI 密钥：{masked}',
        'apiKey.hidden': 'OpenAI 密钥：隐藏',
        'modal.apiKeyTitle': '更新 OpenAI API 密钥',
        'modal.apiKeySubtitle': '输入新密钥并保存到系统安全存储。',
        'tooltip.saveKey': '将 API 密钥保存到系统安全存储（钥匙串/凭据管理器）。',
        'tooltip.refresh': '刷新并重新检测可用音频输入设备。',
        'tooltip.start': '开始实时采集和翻译（F8）。',
        'tooltip.stop': '停止实时采集和翻译（F8）。',
        'tooltip.worshipOn': '敬拜模式已开启：翻译暂停（适合诗歌时段）。点击可恢复翻译（F7）。',
        'tooltip.worshipOff': '敬拜模式已关闭：翻译进行中。点击可在诗歌时段暂停翻译（F7）。',
        'tooltip.presentationOn': '退出投屏模式并显示操作控制（F6）。',
        'tooltip.presentationOff': '进入投屏模式以显示大字幕（F6）。',
        'tooltip.help': '显示或隐藏快捷键帮助面板（F1）。',
        'tooltip.lockOn': '解锁配置控件以允许修改（F2）。',
        'tooltip.lockOff': '锁定配置控件，避免误操作（F2）。',
        'tooltip.outputWindow': '打开或关闭仅字幕输出窗口（用于第二屏）。',
        'tooltip.testAudioFile': '用音频文件走同一翻译流程进行测试。',
        'tooltip.clearCaptions': '仅清空当前英文和输出字幕面板。',
        'tooltip.clearTranscript': '清空转录内存，但不清空当前字幕面板。',
        'tooltip.resetSession': '重置队列、字幕、转录以及会话/费用计数（F4）。',
        'tooltip.copyLatestOutput': '复制最新一行输出字幕到剪贴板。',
        'tooltip.exportTranscript': '将当前转录条目导出为文本文件。',
        'tooltip.saveGlossary': '保存当前术语表内容用于翻译提示。',
        'tooltip.import': '从文本文件导入术语表。',
        'tooltip.export': '将术语表导出到文本文件。',
        'tooltip.close': '关闭帮助面板。',
        'help.title': '快捷控制',
        'help.f8': '<strong>F8</strong>：开始/停止翻译',
        'help.f7': '<strong>F7</strong>：切换敬拜模式',
        'help.f6': '<strong>F6</strong>：切换投屏模式',
        'help.f2': '<strong>F2</strong>：锁定/解锁配置',
        'help.f4': '<strong>F4</strong>：重置字幕 + 转录 + 队列',
        'help.f1': '<strong>F1</strong>：切换帮助面板',
        'status.idle': '空闲',
        'status.controlsLocked': '配置控件已锁定',
        'status.controlsUnlocked': '配置控件已解锁',
        'status.worshipEnabled': '已开启敬拜模式：翻译已暂停',
        'status.worshipDisabledRunning': '已关闭敬拜模式：翻译已恢复',
        'status.worshipDisabled': '已关闭敬拜模式',
        'status.sessionReset': '会话已重置：字幕、转录和队列已清空',
        'status.retryingSegment': '正在重试片段（{attempt}/{max}）...',
        'status.testingFile': '正在测试文件：{name}',
        'status.fileTestFinished': '文件测试完成：{name}',
        'status.fileTestFailed': '文件测试失败：{error}',
        'status.audioDeviceAccessError': '音频设备访问错误：{error}',
        'status.running': '运行中：采集{source}音频，生成英文与{target}字幕',
        'status.startFailed': '启动失败：{error}',
        'status.autoSaved': '已停止并自动保存转录：{path}',
        'status.stopped': '已停止',
        'status.autoSaveFailed': '已停止（自动保存失败：{error}）',
        'status.apiKeySaved': 'API 密钥已配置并安全保存',
        'status.apiKeyFailed': '配置 API 密钥失败',
        'status.apiKeyRequired': '请输入 OpenAI API 密钥后继续',
        'status.glossarySaved': '术语表已保存',
        'status.glossaryImported': '术语表已导入',
        'status.glossaryImportCanceled': '已取消术语表导入',
        'status.glossaryExported': '术语表已导出：{path}',
        'status.glossaryExportCanceled': '已取消术语表导出',
        'status.sourceSet': '源语言已设置为 {source}',
        'status.outputSet': '输出语言已设置为 {target}',
        'status.outputWindowToggled': '已切换输出窗口',
        'status.outputWindowError': '输出窗口错误：{error}',
        'status.captionsCleared': '字幕面板已清空',
        'status.transcriptCleared': '转录内存已清空',
        'status.noOutputToCopy': '没有可复制的输出字幕',
        'status.copyDone': '已复制最新输出字幕',
        'status.clipboardDenied': '剪贴板权限被拒绝',
        'status.transcriptExported': '转录已导出：{path}',
        'status.transcriptExportFailed': '转录导出失败',
        'status.apiKeyLoaded': '已从安全存储加载 API 密钥',
        'status.apiKeyLoadFailed': '无法从安全存储加载已保存的 API 密钥',
        'status.listening': '正在聆听...',
        'status.translating': '正在翻译...',
        'status.warning': '警告：{warning}',
        'mode.running': '运行中',
        'mode.stopped': '已停止',
        'mode.on': '开',
        'mode.off': '关',
        'mode.queueProcessing': '处理中',
        'mode.summary': '模式：{mode} | 源语言：{source} | 目标语言：{target} | 敬拜：{worship} | 投屏：{presentation} | 队列：{queue}',
        'cost.summary': '费用估算：本场 {session} 美元 | 每月 {month} 美元',
        'ui.en': 'English',
        'ui.zh-hans': '简体中文',
        'source.korean': '{language}（先翻译为英文）',
        'source.english': '{language}（直接转录）',
        'source.japanese': '{language}',
        'source.chinese': '{language}',
        'device.default': '系统默认',
        'device.input': '输入 {index}'
    }
};
const LANGUAGE_DISPLAY = {
    en: {
        korean: 'Korean',
        english: 'English',
        japanese: 'Japanese',
        chinese: 'Chinese',
        'zh-hans': 'Simplified Chinese',
        'zh-hant': 'Traditional Chinese',
        spanish: 'Spanish'
    },
    'zh-hans': {
        korean: '韩语',
        english: '英语',
        japanese: '日语',
        chinese: '中文',
        'zh-hans': '简体中文',
        'zh-hant': '繁体中文',
        spanish: '西班牙语'
    }
};
const SUPPORTED_UI_LANGUAGES = ['en', 'zh-hans'];
let uiLanguage = 'en';
let mainInitialized = false;
function loadNumericSetting(key, fallback, minValue, maxValue) {
    const raw = localStorage.getItem(key);
    if (!raw)
        return fallback;
    const value = Number(raw);
    if (Number.isNaN(value))
        return fallback;
    if (value < minValue || value > maxValue)
        return fallback;
    return value;
}
function getUiLanguage() {
    if (SUPPORTED_UI_LANGUAGES.includes(uiLanguageSelect.value)) {
        return uiLanguageSelect.value;
    }
    return 'en';
}
function t(key, values = {}) {
    const language = UI_TEXT[uiLanguage] ? uiLanguage : 'en';
    const fallbackText = UI_TEXT.en[key] || key;
    let text = UI_TEXT[language][key] || fallbackText;
    Object.entries(values).forEach(([name, value]) => {
        text = text.replaceAll(`{${name}}`, String(value));
    });
    return text;
}
function languageName(code) {
    const labels = LANGUAGE_DISPLAY[uiLanguage] || LANGUAGE_DISPLAY.en;
    return labels[code] || code;
}
function setStatus(text) {
    statusEl.textContent = text;
    if (landingStatusEl) {
        landingStatusEl.textContent = text;
    }
}
function setStatusKey(key, values = {}) {
    setStatus(t(key, values));
}
function maskApiKey(rawApiKey) {
    const trimmed = (rawApiKey || '').trim();
    if (!trimmed)
        return 'hidden';
    if (trimmed.length <= 8) {
        return `${trimmed.slice(0, 2)}***`;
    }
    return `${trimmed.slice(0, 3)}***${trimmed.slice(-4)}`;
}
function setMaskedApiKey(masked) {
    if (!maskedApiKeyEl)
        return;
    if (!masked || masked === 'hidden') {
        maskedApiKeyEl.textContent = t('apiKey.hidden');
        return;
    }
    maskedApiKeyEl.textContent = t('apiKey.masked', { masked });
}
function showLandingPage() {
    landingPage.classList.remove('hidden');
    mainPage.classList.add('hidden');
}
function showMainPage() {
    landingPage.classList.add('hidden');
    mainPage.classList.remove('hidden');
}
function setApiKeyModalVisible(nextVisible) {
    const visible = Boolean(nextVisible);
    apiKeyModal.classList.toggle('hidden', !visible);
    if (visible) {
        mainApiKeyInput.value = '';
        mainApiKeyInput.focus();
    }
    else {
        mainApiKeyInput.value = '';
    }
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
    const inputCost = (estimatedInputTokens / 1000000) * TRANSLATION_INPUT_COST_PER_1M;
    const outputCost = (estimatedOutputTokens / 1000000) * TRANSLATION_OUTPUT_COST_PER_1M;
    return inputCost + outputCost;
}
function updateCostSummary() {
    const minutes = totalAudioMs / 60000;
    const sessionSttCost = minutes * sttRatePerMinute();
    const sessionTranslationCost = estimateTranslationCostUsd();
    const sessionTotal = sessionSttCost + sessionTranslationCost;
    const estimatedMonth = sessionTotal * 4;
    costSummaryEl.textContent = t('cost.summary', {
        session: sessionTotal.toFixed(2),
        month: estimatedMonth.toFixed(2)
    });
}
function updateModeSummary() {
    const queueText = segmentQueueRunning
        ? `${pendingSegments.length} (${t('mode.queueProcessing')})`
        : `${pendingSegments.length}`;
    modeSummaryEl.textContent = t('mode.summary', {
        mode: running ? t('mode.running') : t('mode.stopped'),
        source: languageName(sourceLanguageSelect.value || 'korean'),
        target: languageName(targetLanguageSelect.value || 'zh-hans'),
        worship: worshipMode ? t('mode.on') : t('mode.off'),
        presentation: presentationMode ? t('mode.on') : t('mode.off'),
        queue: queueText
    });
    syncOutputWindow();
}
function setHelpVisible(nextVisible) {
    helpVisible = Boolean(nextVisible);
    helpOverlay.classList.toggle('hidden', !helpVisible);
}
function setControlsLocked(nextLocked) {
    controlsLocked = Boolean(nextLocked);
    toggleLockControlsButton.textContent = controlsLocked ? t('button.lockOn') : t('button.lockOff');
    toggleLockControlsButton.title = controlsLocked ? t('tooltip.lockOn') : t('tooltip.lockOff');
    const lockTargets = [
        maskedApiKeyEl,
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
    setStatusKey(controlsLocked ? 'status.controlsLocked' : 'status.controlsUnlocked');
    updateModeSummary();
}
function setRunningButtonState() {
    if (running) {
        toggleRunButton.textContent = t('button.stop');
        toggleRunButton.classList.add('stop');
        toggleRunButton.classList.remove('run');
    }
    else {
        toggleRunButton.textContent = t('button.start');
        toggleRunButton.classList.add('run');
        toggleRunButton.classList.remove('stop');
    }
    toggleRunButton.title = running ? t('tooltip.stop') : t('tooltip.start');
}
function refreshToggleButtonLabels() {
    setRunningButtonState();
    toggleWorshipModeButton.textContent = worshipMode ? t('button.worshipOn') : t('button.worshipOff');
    togglePresentationButton.textContent = presentationMode ? t('button.presentationOn') : t('button.presentationOff');
    toggleLockControlsButton.textContent = controlsLocked ? t('button.lockOn') : t('button.lockOff');
    toggleRunButton.title = running ? t('tooltip.stop') : t('tooltip.start');
    toggleWorshipModeButton.title = worshipMode ? t('tooltip.worshipOn') : t('tooltip.worshipOff');
    togglePresentationButton.title = presentationMode ? t('tooltip.presentationOn') : t('tooltip.presentationOff');
    toggleLockControlsButton.title = controlsLocked ? t('tooltip.lockOn') : t('tooltip.lockOff');
}
function setStaticButtonTooltips() {
    saveKeyButton.title = t('tooltip.saveKey');
    refreshDevicesButton.title = t('tooltip.refresh');
    toggleHelpButton.title = t('tooltip.help');
    toggleOutputWindowButton.title = t('tooltip.outputWindow');
    testAudioFileButton.title = t('tooltip.testAudioFile');
    clearPanelsButton.title = t('tooltip.clearCaptions');
    clearTranscriptButton.title = t('tooltip.clearTranscript');
    resetSessionButton.title = t('tooltip.resetSession');
    copyLatestChineseButton.title = t('tooltip.copyLatestOutput');
    exportTranscriptButton.title = t('tooltip.exportTranscript');
    saveGlossaryButton.title = t('tooltip.saveGlossary');
    importGlossaryButton.title = t('tooltip.import');
    exportGlossaryButton.title = t('tooltip.export');
    closeHelpButton.title = t('tooltip.close');
}
function setPresentationMode(nextMode) {
    presentationMode = Boolean(nextMode);
    document.body.classList.toggle('presentation-mode', presentationMode);
    togglePresentationButton.textContent = presentationMode ? t('button.presentationOn') : t('button.presentationOff');
    togglePresentationButton.title = presentationMode ? t('tooltip.presentationOn') : t('tooltip.presentationOff');
    updateModeSummary();
}
function togglePresentationModeDebounced() {
    const now = Date.now();
    if (now - lastPresentationToggleAt < 350) {
        return;
    }
    lastPresentationToggleAt = now;
    setPresentationMode(!presentationMode);
}
function setWorshipMode(nextMode) {
    worshipMode = Boolean(nextMode);
    toggleWorshipModeButton.textContent = worshipMode ? t('button.worshipOn') : t('button.worshipOff');
    toggleWorshipModeButton.title = worshipMode ? t('tooltip.worshipOn') : t('tooltip.worshipOff');
    if (worshipMode) {
        pendingSegments.length = 0;
        englishLiveEl.textContent = '';
        chineseLiveEl.textContent = '';
        setStatusKey('status.worshipEnabled');
    }
    else if (running) {
        setStatusKey('status.worshipDisabledRunning');
        drainSegmentQueue();
    }
    else {
        setStatusKey('status.worshipDisabled');
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
    if (!text)
        return;
    englishLines.push({ text, warning });
    while (englishLines.length > MAX_LINES)
        englishLines.shift();
    renderLines(englishPanel, englishLines);
    syncOutputWindow();
}
function appendChinese(text, warning = false) {
    if (!text)
        return;
    chineseLines.push({ text, warning });
    while (chineseLines.length > MAX_LINES)
        chineseLines.shift();
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
    translatedHeadingEl.textContent = languageName(targetLanguageSelect.value || 'zh-hans');
}
function updateSourceLanguageOptionLabels() {
    const labels = {
        korean: t('source.korean', { language: languageName('korean') }),
        english: t('source.english', { language: languageName('english') }),
        japanese: t('source.japanese', { language: languageName('japanese') }),
        chinese: t('source.chinese', { language: languageName('chinese') })
    };
    Array.from(sourceLanguageSelect.options).forEach((option) => {
        if (labels[option.value]) {
            option.textContent = labels[option.value];
        }
    });
}
function updateTargetLanguageOptionLabels() {
    Array.from(targetLanguageSelect.options).forEach((option) => {
        option.textContent = languageName(option.value);
    });
}
function applyUiLanguage() {
    uiLanguage = getUiLanguage();
    localStorage.setItem('church-ui-language', uiLanguage);
    document.documentElement.lang = uiLanguage === 'zh-hans' ? 'zh-CN' : 'en';
    landingTitleEl.textContent = t('landing.title');
    landingSubtitleEl.textContent = t('landing.subtitle');
    labelApiKeyEl.textContent = t('label.apiKey');
    labelUiLanguageEl.textContent = t('label.uiLanguage');
    labelAudioInputEl.textContent = t('label.audioInput');
    labelSourceLanguageEl.textContent = t('label.sourceLanguage');
    labelTargetLanguageEl.textContent = t('label.targetLanguage');
    labelVadThresholdEl.textContent = t('label.vadThreshold');
    labelSilenceMsEl.textContent = t('label.silenceMs');
    labelMaxSegmentMsEl.textContent = t('label.maxSegmentMs');
    labelGlossaryEl.textContent = t('label.glossary');
    labelAutoSaveOnStopEl.textContent = t('label.autoSaveOnStop');
    englishHeadingEl.textContent = t('heading.english');
    saveKeyButton.textContent = t('button.saveKey');
    saveMainApiKeyButton.textContent = t('button.saveKey');
    cancelMainApiKeyButton.textContent = t('button.cancel');
    refreshDevicesButton.textContent = t('button.refresh');
    toggleHelpButton.textContent = t('button.help');
    toggleOutputWindowButton.textContent = t('button.outputWindow');
    testAudioFileButton.textContent = t('button.testAudioFile');
    clearPanelsButton.textContent = t('button.clearCaptions');
    clearTranscriptButton.textContent = t('button.clearTranscript');
    resetSessionButton.textContent = t('button.resetSession');
    copyLatestChineseButton.textContent = t('button.copyLatestOutput');
    exportTranscriptButton.textContent = t('button.exportTranscript');
    saveGlossaryButton.textContent = t('button.saveGlossary');
    importGlossaryButton.textContent = t('button.import');
    exportGlossaryButton.textContent = t('button.export');
    closeHelpButton.textContent = t('button.close');
    apiKeyModalTitleEl.textContent = t('modal.apiKeyTitle');
    apiKeyModalSubtitleEl.textContent = t('modal.apiKeySubtitle');
    labelMainApiKeyEl.textContent = t('label.apiKey');
    helpTitleEl.textContent = t('help.title');
    helpF8El.innerHTML = t('help.f8');
    helpF7El.innerHTML = t('help.f7');
    helpF6El.innerHTML = t('help.f6');
    helpF2El.innerHTML = t('help.f2');
    helpF4El.innerHTML = t('help.f4');
    helpF1El.innerHTML = t('help.f1');
    Array.from(uiLanguageSelect.options).forEach((option) => {
        option.textContent = t(`ui.${option.value}`);
    });
    Array.from(audioInputSelect.options).forEach((option) => {
        if (option.value === '') {
            option.textContent = t('device.default');
        }
    });
    updateSourceLanguageOptionLabels();
    updateTargetLanguageOptionLabels();
    updateTranslatedHeading();
    setStaticButtonTooltips();
    refreshToggleButtonLabels();
    updateModeSummary();
    updateCostSummary();
    setMaskedApiKey(localStorage.getItem('church-masked-api-key') || 'hidden');
    if (!statusEl.textContent || statusEl.textContent.trim() === '') {
        setStatusKey('status.idle');
    }
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
                targetLabel: languageName(targetLanguageSelect.value || 'zh-hans')
            }
        });
    }
    catch {
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
    setStatusKey('status.sessionReset');
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
        }
        catch (err) {
            lastError = err;
            if (attempt >= SEGMENT_MAX_RETRIES) {
                break;
            }
            const delay = RETRY_DELAYS_MS[attempt] || 900;
            setStatusKey('status.retryingSegment', { attempt: attempt + 1, max: SEGMENT_MAX_RETRIES });
            await waitMs(delay);
        }
    }
    throw lastError;
}
async function processTestAudioFile(file) {
    if (!file)
        return;
    setStatusKey('status.testingFile', { name: file.name });
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
            appendEnglish(t('status.warning', { warning: result.warning }), true);
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
        setStatusKey('status.fileTestFinished', { name: file.name });
        updateModeSummary();
    }
    catch (err) {
        const error = err.message || String(err);
        setStatusKey('status.fileTestFailed', { error });
        appendEnglish(t('status.warning', { warning: error }), true);
    }
    finally {
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
                appendEnglish(t('status.warning', { warning: result.warning }), true);
            }
            englishLiveEl.textContent = '';
            chineseLiveEl.textContent = '';
            syncOutputWindow();
            updateModeSummary();
        }
    }
    catch (err) {
        appendEnglish(t('status.warning', { warning: err.message || String(err) }), true);
        syncOutputWindow();
    }
    finally {
        segmentQueueRunning = false;
        updateModeSummary();
    }
}
async function loadDevices() {
    const previousValue = audioInputSelect.value;
    audioInputSelect.innerHTML = '';
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = t('device.default');
    audioInputSelect.appendChild(defaultOption);
    let permissionError = null;
    try {
        const probe = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        probe.getTracks().forEach((track) => track.stop());
    }
    catch (err) {
        permissionError = err;
    }
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioInputs = devices.filter((d) => d.kind === 'audioinput');
        audioInputs.forEach((device, idx) => {
            const option = document.createElement('option');
            option.value = device.deviceId;
            option.textContent = device.label || t('device.input', { index: idx + 1 });
            audioInputSelect.appendChild(option);
        });
        if (previousValue) {
            audioInputSelect.value = previousValue;
            if (audioInputSelect.value !== previousValue) {
                audioInputSelect.value = '';
            }
        }
    }
    catch (err) {
        setStatusKey('status.audioDeviceAccessError', { error: err.message || String(err) });
        return;
    }
    if (permissionError) {
        setStatusKey('status.audioDeviceAccessError', { error: permissionError.message || String(permissionError) });
    }
}
function flushRecorderChunk() {
    if (!mediaRecorder || mediaRecorder.state !== 'recording')
        return;
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
        if (!event.data || event.data.size === 0)
            return;
        currentChunks.push(event.data);
    };
    mediaRecorder.onstop = async () => {
        if (!currentChunks.length)
            return;
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
        if (!running)
            return;
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
                englishLiveEl.textContent = t('status.listening');
                chineseLiveEl.textContent = t('status.translating');
                syncOutputWindow();
                if (mediaRecorder.state === 'inactive') {
                    mediaRecorder.start(250);
                }
            }
        }
        else if (recording) {
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
    if (running === nextRunning)
        return;
    running = nextRunning;
    setRunningButtonState();
    await invoke('set_running', { nextRunning: running });
    if (running) {
        try {
            await setupAudioPipeline();
            setStatusKey('status.running', {
                source: languageName(sourceLanguageSelect.value || 'korean'),
                target: languageName(targetLanguageSelect.value || 'zh-hans')
            });
            drainSegmentQueue();
        }
        catch (err) {
            setStatusKey('status.startFailed', { error: err.message || String(err) });
            running = false;
            setRunningButtonState();
            await invoke('set_running', { nextRunning: false });
        }
    }
    else {
        await stopAudioPipeline();
        pendingSegments.length = 0;
        englishLiveEl.textContent = '';
        chineseLiveEl.textContent = '';
        if (autoSaveOnStopInput.checked && transcriptEntries.length) {
            try {
                const saveResult = await invoke('auto_save_transcript', { entries: transcriptEntries });
                if (saveResult.ok) {
                    setStatusKey('status.autoSaved', { path: saveResult.path });
                }
                else {
                    setStatus(saveResult.message || t('status.stopped'));
                }
            }
            catch (err) {
                setStatusKey('status.autoSaveFailed', { error: err.message || String(err) });
            }
        }
        else {
            setStatusKey('status.stopped');
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
async function ensureMainInitialized() {
    if (mainInitialized)
        return;
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
    if (savedTargetLanguage && LANGUAGE_DISPLAY.en[savedTargetLanguage]) {
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
        togglePresentationModeDebounced();
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
    mainInitialized = true;
}
async function persistApiKey(apiKey, options = {}) {
    const shouldEnterMain = Boolean(options.enterMain);
    if (!apiKey) {
        setStatusKey('status.apiKeyRequired');
        return false;
    }
    try {
        const result = await invoke('config_api_key', { apiKey });
        if (result.ok) {
            const masked = result.maskedKey || maskApiKey(apiKey);
            localStorage.setItem('church-masked-api-key', masked);
            setMaskedApiKey(masked);
            apiKeyInput.value = '';
            if (shouldEnterMain) {
                await ensureMainInitialized();
                showMainPage();
            }
            setStatusKey('status.apiKeySaved');
            return true;
        }
    }
    catch (err) {
        setStatus(err.message || t('status.apiKeyFailed'));
    }
    return false;
}
saveKeyButton.addEventListener('click', async () => {
    const apiKey = apiKeyInput.value.trim();
    await persistApiKey(apiKey, { enterMain: true });
});
maskedApiKeyEl.addEventListener('click', () => {
    setApiKeyModalVisible(true);
});
saveMainApiKeyButton.addEventListener('click', async () => {
    const apiKey = mainApiKeyInput.value.trim();
    const saved = await persistApiKey(apiKey);
    if (saved) {
        setApiKeyModalVisible(false);
    }
});
cancelMainApiKeyButton.addEventListener('click', () => {
    setApiKeyModalVisible(false);
});
apiKeyModal.addEventListener('click', (event) => {
    if (event.target === apiKeyModal) {
        setApiKeyModalVisible(false);
    }
});
mainApiKeyInput.addEventListener('keydown', async (event) => {
    if (event.key !== 'Enter')
        return;
    const apiKey = mainApiKeyInput.value.trim();
    const saved = await persistApiKey(apiKey);
    if (saved) {
        setApiKeyModalVisible(false);
    }
});
saveGlossaryButton.addEventListener('click', async () => {
    await syncTranslationConfig();
    localStorage.setItem('church-glossary', glossaryInput.value || '');
    setStatusKey('status.glossarySaved');
});
importGlossaryButton.addEventListener('click', async () => {
    const result = await invoke('import_glossary');
    if (result.ok && typeof result.content === 'string') {
        glossaryInput.value = result.content;
        await syncTranslationConfig();
        localStorage.setItem('church-glossary', glossaryInput.value || '');
        setStatusKey('status.glossaryImported');
    }
    else {
        setStatus(result.message || t('status.glossaryImportCanceled'));
    }
});
exportGlossaryButton.addEventListener('click', async () => {
    const result = await invoke('export_glossary', { content: glossaryInput.value || '' });
    if (result.ok) {
        setStatusKey('status.glossaryExported', { path: result.path });
    }
    else {
        setStatus(result.message || t('status.glossaryExportCanceled'));
    }
});
refreshDevicesButton.addEventListener('click', () => {
    loadDevices();
});
uiLanguageSelect.addEventListener('change', () => {
    applyUiLanguage();
});
sourceLanguageSelect.addEventListener('change', async () => {
    await syncTranslationConfig();
    localStorage.setItem('church-source-language', sourceLanguageSelect.value || 'korean');
    setStatusKey('status.sourceSet', { source: languageName(sourceLanguageSelect.value || 'korean') });
    updateModeSummary();
    updateCostSummary();
});
targetLanguageSelect.addEventListener('change', async () => {
    await syncTranslationConfig();
    localStorage.setItem('church-target-language', targetLanguageSelect.value || 'zh-hans');
    updateTranslatedHeading();
    setStatusKey('status.outputSet', { target: languageName(targetLanguageSelect.value || 'zh-hans') });
    updateModeSummary();
});
toggleRunButton.addEventListener('click', async () => {
    await setRunning(!running);
});
toggleWorshipModeButton.addEventListener('click', () => {
    setWorshipMode(!worshipMode);
});
togglePresentationButton.addEventListener('click', () => {
    togglePresentationModeDebounced();
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
        setStatusKey('status.outputWindowToggled');
        await syncOutputWindow();
    }
    catch (err) {
        setStatusKey('status.outputWindowError', { error: err.message || String(err) });
    }
});
testAudioFileButton.addEventListener('click', () => {
    testAudioFileInput.click();
});
testAudioFileInput.addEventListener('change', async (event) => {
    const input = event.target;
    const file = input?.files?.[0];
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
    setStatusKey('status.captionsCleared');
});
clearTranscriptButton.addEventListener('click', () => {
    transcriptEntries.length = 0;
    setStatusKey('status.transcriptCleared');
    updateModeSummary();
});
resetSessionButton.addEventListener('click', () => {
    resetSessionState();
});
copyLatestChineseButton.addEventListener('click', async () => {
    const latestChinese = getLatestChineseLine();
    if (!latestChinese) {
        setStatusKey('status.noOutputToCopy');
        return;
    }
    try {
        await navigator.clipboard.writeText(latestChinese);
        setStatusKey('status.copyDone');
    }
    catch {
        setStatusKey('status.clipboardDenied');
    }
});
exportTranscriptButton.addEventListener('click', async () => {
    const result = await invoke('export_transcript', { entries: transcriptEntries });
    if (result.ok) {
        setStatusKey('status.transcriptExported', { path: result.path });
    }
    else {
        setStatus(result.message || t('status.transcriptExportFailed'));
    }
});
async function boot() {
    const savedUiLanguage = localStorage.getItem('church-ui-language');
    if (savedUiLanguage && SUPPORTED_UI_LANGUAGES.includes(savedUiLanguage)) {
        uiLanguageSelect.value = savedUiLanguage;
    }
    else {
        uiLanguageSelect.value = 'en';
    }
    uiLanguage = getUiLanguage();
    applyUiLanguage();
    try {
        const loaded = await invoke('load_saved_api_key');
        if (loaded.found) {
            const masked = loaded.maskedKey || localStorage.getItem('church-masked-api-key') || 'hidden';
            localStorage.setItem('church-masked-api-key', masked);
            setMaskedApiKey(masked);
            await ensureMainInitialized();
            showMainPage();
            setStatusKey('status.apiKeyLoaded');
        }
        else {
            showLandingPage();
            localStorage.removeItem('church-masked-api-key');
            setMaskedApiKey('hidden');
            setStatusKey('status.apiKeyRequired');
        }
    }
    catch {
        showLandingPage();
        localStorage.removeItem('church-masked-api-key');
        setMaskedApiKey('hidden');
        setStatusKey('status.apiKeyLoadFailed');
    }
}
window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !apiKeyModal.classList.contains('hidden')) {
        setApiKeyModalVisible(false);
        return;
    }
    if (event.key === 'Escape' && presentationMode) {
        setPresentationMode(false);
    }
});
boot();
