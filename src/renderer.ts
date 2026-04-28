declare interface Window {
  __TAURI__: any;
}

const { invoke } = window.__TAURI__.core;
const { listen } = window.__TAURI__.event;

const landingPage = document.getElementById('landingPage') as any;
const mainPage = document.getElementById('mainPage') as any;
const landingTitleEl = document.getElementById('landingTitle') as any;
const landingSubtitleEl = document.getElementById('landingSubtitle') as any;
const landingStatusEl = document.getElementById('landingStatus') as any;
const apiKeyInput = document.getElementById('apiKey') as any;
const adminApiKeyInput = document.getElementById('adminApiKey') as any;
const projectIdInput = document.getElementById('projectId') as any;
const saveKeyButton = document.getElementById('saveKey') as any;
const maskedApiKeyEl = document.getElementById('maskedApiKey') as any;
const apiKeyModal = document.getElementById('apiKeyModal') as any;
const apiKeyModalTitleEl = document.getElementById('apiKeyModalTitle') as any;
const apiKeyModalSubtitleEl = document.getElementById('apiKeyModalSubtitle') as any;
const labelMainApiKeyEl = document.getElementById('labelMainApiKey') as any;
const labelMainAdminApiKeyEl = document.getElementById('labelMainAdminApiKey') as any;
const labelMainProjectIdEl = document.getElementById('labelMainProjectId') as any;
const mainApiKeyInput = document.getElementById('mainApiKeyInput') as any;
const mainAdminApiKeyInput = document.getElementById('mainAdminApiKeyInput') as any;
const mainProjectIdInput = document.getElementById('mainProjectIdInput') as any;
const copyMainApiKeyButton = document.getElementById('copyMainApiKey') as any;
const copyMainAdminApiKeyButton = document.getElementById('copyMainAdminApiKey') as any;
const saveMainApiKeyButton = document.getElementById('saveMainApiKey') as any;
const cancelMainApiKeyButton = document.getElementById('cancelMainApiKey') as any;
const openSettingsPageButton = document.getElementById('openSettingsPage') as any;
const backToLivePageButton = document.getElementById('backToLivePage') as any;
const settingsHeadingEl = document.getElementById('settingsHeading') as any;
const appearanceSummaryEl = document.getElementById('appearanceSummary') as any;
const liveWorkspaceEl = document.getElementById('liveWorkspace') as any;
const translationLiveBarEl = document.getElementById('translationLiveBar') as any;
const liveExitTranslationModeButton = document.getElementById('liveExitTranslationMode') as any;
const liveToggleRunButton = document.getElementById('liveToggleRun') as any;
const liveOpenScriptManagerButton = document.getElementById('liveOpenScriptManager') as any;
const liveToggleWorshipModeButton = document.getElementById('liveToggleWorshipMode') as any;
const liveToggleHelpButton = document.getElementById('liveToggleHelp') as any;
const liveResetSessionButton = document.getElementById('liveResetSession') as any;
const liveVadThresholdInput = document.getElementById('liveVadThreshold') as any;
const liveVadValueEl = document.getElementById('liveVadValue') as any;
const liveModeSummaryEl = document.getElementById('liveModeSummary') as any;
const settingsPageEl = document.getElementById('settingsPage') as any;
const uiLanguageSelect = document.getElementById('uiLanguage') as any;
const themeSelect = document.getElementById('themeSelect') as any;
const audioInputSelect = document.getElementById('audioInput') as any;
const sourceLanguageSelect = document.getElementById('sourceLanguage') as any;
const targetLanguageSelect = document.getElementById('targetLanguage') as any;
const refreshDevicesButton = document.getElementById('refreshDevices') as any;
const toggleRunButton = document.getElementById('toggleRun') as any;
const toggleWorshipModeButton = document.getElementById('toggleWorshipMode') as any;
const togglePresentationButton = document.getElementById('togglePresentation') as any;
const toggleHelpButton = document.getElementById('toggleHelp') as any;
const toggleLockControlsButton = document.getElementById('toggleLockControls') as any;
const toggleOutputWindowButton = document.getElementById('toggleOutputWindow') as any;
const testAudioFileButton = document.getElementById('testAudioFile') as any;
const testAudioFileInput = document.getElementById('testAudioFileInput') as any;
const openScriptManagerButton = document.getElementById('openScriptManager') as any;
const uploadReferenceScriptButton = document.getElementById('uploadReferenceScript') as any;
const pasteReferenceScriptButton = document.getElementById('pasteReferenceScript') as any;
const referenceScriptInput = document.getElementById('referenceScriptInput') as any;
const clearReferenceScriptButton = document.getElementById('clearReferenceScript') as any;
const scriptModal = document.getElementById('scriptModal') as any;
const scriptModalTitleEl = document.getElementById('scriptModalTitle') as any;
const scriptModalSubtitleEl = document.getElementById('scriptModalSubtitle') as any;
const closeScriptModalButton = document.getElementById('closeScriptModal') as any;
const resetSessionButton = document.getElementById('resetSession') as any;
const copyLatestChineseButton = document.getElementById('copyLatestChinese') as any;
const exportTranscriptButton = document.getElementById('exportTranscript') as any;
const statusEl = document.getElementById('status') as any;
const statusToastEl = document.getElementById('statusToast') as any;
const modeSummaryEl = document.getElementById('modeSummary') as any;
const englishPanel = document.getElementById('englishPanel') as any;
const chinesePanel = document.getElementById('chinesePanel') as any;
const translatedHeadingEl = document.getElementById('translatedHeading') as any;
const englishLiveEl = document.getElementById('englishLive') as any;
const chineseLiveEl = document.getElementById('chineseLive') as any;
const scriptReferenceCardEl = document.getElementById('scriptReferenceCard') as any;
const referenceScriptHeadingEl = document.getElementById('referenceScriptHeading') as any;
const referenceScriptMetaEl = document.getElementById('referenceScriptMeta') as any;
const referenceScriptContentEl = document.getElementById('referenceScriptContent') as any;
const vadThresholdInput = document.getElementById('vadThreshold') as any;
const vadValueEl = document.getElementById('vadValue') as any;
const silenceMsInput = document.getElementById('silenceMs') as any;
const maxSegmentMsInput = document.getElementById('maxSegmentMs') as any;
const glossaryInput = document.getElementById('glossary') as any;
const saveGlossaryButton = document.getElementById('saveGlossary') as any;
const importGlossaryButton = document.getElementById('importGlossary') as any;
const exportGlossaryButton = document.getElementById('exportGlossary') as any;
const autoSaveOnStopInput = document.getElementById('autoSaveOnStop') as any;
const helpOverlay = document.getElementById('helpOverlay') as any;
const closeHelpButton = document.getElementById('closeHelp') as any;
const labelApiKeyEl = document.getElementById('labelApiKey') as any;
const labelAdminApiKeyEl = document.getElementById('labelAdminApiKey') as any;
const labelProjectIdEl = document.getElementById('labelProjectId') as any;
const labelUiLanguageEl = document.getElementById('labelUiLanguage') as any;
const labelAudioInputEl = document.getElementById('labelAudioInput') as any;
const labelThemeEl = document.getElementById('labelTheme') as any;
const labelSourceLanguageEl = document.getElementById('labelSourceLanguage') as any;
const labelTargetLanguageEl = document.getElementById('labelTargetLanguage') as any;
const labelVadThresholdEl = document.getElementById('labelVadThreshold') as any;
const labelLiveVadThresholdEl = document.getElementById('labelLiveVadThreshold') as any;
const labelSilenceMsEl = document.getElementById('labelSilenceMs') as any;
const labelMaxSegmentMsEl = document.getElementById('labelMaxSegmentMs') as any;
const labelGlossaryEl = document.getElementById('labelGlossary') as any;
const labelAutoSaveOnStopEl = document.getElementById('labelAutoSaveOnStop') as any;
const englishHeadingEl = document.getElementById('englishHeading') as any;
const helpTitleEl = document.getElementById('helpTitle') as any;
const helpF8El = document.getElementById('helpF8') as any;
const helpF7El = document.getElementById('helpF7') as any;
const helpF6El = document.getElementById('helpF6') as any;
const helpF2El = document.getElementById('helpF2') as any;
const helpF4El = document.getElementById('helpF4') as any;
const helpF1El = document.getElementById('helpF1') as any;

const MAX_LINES = 200;
const SEGMENT_MAX_RETRIES = 2;
const RETRY_DELAYS_MS = [300, 700];
const TEST_FILE_SEGMENT_MS = 12000;
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

const pairedLines = [];
const transcriptEntries = [];
const pendingSegments = [];
let segmentQueueRunning = false;
let totalAudioMs = 0;
let totalSegments = 0;
let totalEnglishChars = 0;
let totalTranslatedChars = 0;
let pendingSegmentDurationMs = 0;
let testStreamActive = false;
let lineSequence = 0;
let activePairLineId = 0;

const UI_TEXT = {
  en: {
    'landing.title': 'Connect OpenAI API Key',
    'landing.subtitle': 'Enter your key once to continue. It is stored securely in your OS keychain/credential manager.',
    'label.apiKey': 'OpenAI API Key',
    'label.adminApiKey': 'OpenAI Admin Key',
    'label.projectId': 'Project ID',
    'label.uiLanguage': 'UI Language',
    'label.audioInput': 'Audio Input',
    'label.theme': 'Theme',
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
    'button.presentationOn': 'Exit Translation Mode (F6)',
    'button.presentationOff': 'Translation Mode (F6)',
    'button.help': 'Help (F1)',
    'button.lockOn': 'Unlock Controls (F2)',
    'button.lockOff': 'Lock Controls (F2)',
    'button.outputWindow': 'Projector Window',
    'button.testAudioFile': 'Test Audio File',
    'button.scriptManager': 'Script',
    'button.uploadScript': 'Upload Script',
    'button.pasteScript': 'Paste Script',
    'button.clearScript': 'Clear Script',
    'button.resetSession': 'Reset Session (F4)',
    'button.copyLatestOutput': 'Copy Latest Output',
    'button.exportTranscript': 'Export Transcript',
    'button.saveGlossary': 'Save Glossary',
    'button.import': 'Import',
    'button.export': 'Export',
    'button.close': 'Close',
    'button.cancel': 'Cancel',
    'button.settings': 'Settings',
    'button.back': 'Back',
    'heading.settings': 'Settings',
    'heading.appearance': 'Appearance',
    'heading.referenceScript': 'Reference Script',
    'apiKey.masked': 'OpenAI Key: {masked}',
    'apiKey.hidden': 'OpenAI Key: hidden',
    'modal.apiKeyTitle': 'Update OpenAI API Key',
    'modal.apiKeySubtitle': 'Enter API/Admin key or update project ID, then save.',
    'modal.scriptTitle': 'Reference Script',
    'modal.scriptSubtitle': 'Upload or paste script text, then clear it when needed.',
    'tooltip.saveKey': 'Save API key to secure OS storage (Keychain/Credential Manager).',
    'tooltip.refresh': 'Refresh and re-detect available audio input devices.',
    'tooltip.start': 'Start live capture and translation (F8).',
    'tooltip.stop': 'Stop live capture and translation (F8).',
    'tooltip.worshipOn': 'Worship mode is ON: translation is paused for songs. Click to resume translation (F7).',
    'tooltip.worshipOff': 'Worship mode is OFF: translation is active. Click to pause translation for songs (F7).',
    'tooltip.presentationOn': 'Exit translation mode and return to standard layout (F6 or Esc).',
    'tooltip.presentationOff': 'Enter translation mode with a larger subtitle-focused layout (F6).',
    'tooltip.help': 'Show or hide the hotkey/help overlay.',
    'tooltip.lockOn': 'Unlock configuration controls to allow editing (F2).',
    'tooltip.lockOff': 'Lock configuration controls to avoid accidental changes (F2).',
    'tooltip.outputWindow': 'Open or close the subtitle-only projector window for a second screen.',
    'tooltip.settings': 'Open settings page.',
    'tooltip.back': 'Return to live translation view.',
    'tooltip.testAudioFile': 'Run one audio file through the same translation pipeline for testing.',
    'tooltip.scriptManager': 'Open script tools (upload, paste, clear).',
    'tooltip.uploadScript': 'Upload target-language script text to guide translation and display in translation mode.',
    'tooltip.pasteScript': 'Paste target-language script text directly from clipboard.',
    'tooltip.clearScript': 'Clear the uploaded reference script from this session.',
    'tooltip.resetSession': 'Reset queue, captions, transcript, and cost/session counters (F4).',
    'tooltip.copyLatestOutput': 'Copy the latest translated output caption line to clipboard.',
    'tooltip.exportTranscript': 'Export the current transcript entries to a text file.',
    'tooltip.saveGlossary': 'Save current glossary text for translation prompts.',
    'tooltip.import': 'Import glossary content from a text file.',
    'tooltip.export': 'Export glossary content to a text file.',
    'tooltip.close': 'Close the help panel.',
    'tooltip.copyKey': 'Copy this key value to clipboard.',
    'help.title': 'Quick Controls',
    'help.f8': '<strong>F8</strong>: Start/Stop translation',
    'help.f7': '<strong>F7</strong>: Toggle worship mode',
    'help.f6': '<strong>F6</strong>: Toggle translation mode',
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
    'status.scriptLoaded': 'Reference script loaded: {lines} lines',
    'status.scriptLoadFailed': 'Failed to load script file: {error}',
    'status.scriptPasted': 'Reference script pasted: {lines} lines',
    'status.scriptPasteFailed': 'Failed to paste script from clipboard: {error}',
    'status.scriptClipboardEmpty': 'Clipboard has no script text',
    'status.scriptCleared': 'Reference script cleared',
    'status.noScriptToClear': 'No reference script is loaded',
    'status.testAudioPlaybackBlocked': 'Test audio playback was blocked by the browser. Streaming test still continues.',
    'status.audioDeviceAccessError': 'Audio device access error: {error}',
    'status.running': 'Running: capturing {source} audio and generating English + {target} captions',
    'status.startFailed': 'Start failed: {error}',
    'status.autoSaved': 'Stopped and auto-saved transcript: {path}',
    'status.stopped': 'Stopped',
    'status.autoSaveFailed': 'Stopped (auto-save failed: {error})',
    'status.apiKeySaved': 'API key configured and saved securely',
    'status.adminApiKeySaved': 'Admin key saved securely',
    'status.apiKeyCopied': 'OpenAI API key copied',
    'status.adminApiKeyCopied': 'OpenAI admin key copied',
    'status.projectIdSaved': 'Project ID saved',
    'status.themeSet': 'Theme changed to {theme}',
    'status.apiKeyFailed': 'Failed to configure API key',
    'status.apiKeyRequired': 'Enter your OpenAI API key to continue',
    'status.glossarySaved': 'Glossary saved',
    'status.glossaryImported': 'Glossary imported',
    'status.glossaryImportCanceled': 'Glossary import canceled',
    'status.glossaryExported': 'Glossary exported: {path}',
    'status.glossaryExportCanceled': 'Glossary export canceled',
    'status.sourceSet': 'Source language set to {source}',
    'status.outputSet': 'Output language set to {target}',
    'status.outputWindowToggled': 'Toggled projector window',
    'status.outputWindowError': 'Projector window error: {error}',
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
    'script.empty': 'No reference script loaded. Upload target-language script before translation for quick reference in translation mode.',
    'script.metaNone': 'No reference script loaded.',
    'script.metaLoaded': 'Loaded script: {lines} lines',
    'mode.running': 'running',
    'mode.stopped': 'stopped',
    'mode.on': 'on',
    'mode.off': 'off',
    'mode.queueProcessing': 'processing',
    'mode.summary':
      'Mode: {mode} | Worship: {worship} | Translation Mode: {presentation} | Queue: {queue}',
    'cost.summary': 'Cost estimate: session {session} USD | month {month} USD',
    'cost.project': 'Project: {projectId}',
    'cost.realSummary': 'Real cost: today {today} {currency} | month {month} {currency}',
    'cost.realLoading': 'Loading real cost from OpenAI billing API...',
    'cost.realUnavailable': 'Real cost unavailable: {reason}',
    'ui.en': 'English',
    'ui.zh-hans': 'Simplified Chinese',
    'theme.broadcast-clean': 'Broadcast Clean',
    'theme.paper-light': 'Paper Light',
    'theme.minimal-mono': 'Minimal Mono',
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
    'label.adminApiKey': 'OpenAI 管理员密钥',
    'label.projectId': 'Project ID',
    'label.uiLanguage': '界面语言',
    'label.audioInput': '音频输入',
    'label.theme': '主题',
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
    'button.presentationOn': '退出翻译模式（F6）',
    'button.presentationOff': '翻译模式（F6）',
    'button.help': '帮助（F1）',
    'button.lockOn': '解锁控制项（F2）',
    'button.lockOff': '锁定控制项（F2）',
    'button.outputWindow': '投影窗口',
    'button.testAudioFile': '测试音频文件',
    'button.scriptManager': '讲稿',
    'button.uploadScript': '上传讲稿',
    'button.pasteScript': '粘贴讲稿',
    'button.clearScript': '清除讲稿',
    'button.resetSession': '重置会话（F4）',
    'button.copyLatestOutput': '复制最新输出',
    'button.exportTranscript': '导出转录',
    'button.saveGlossary': '保存术语表',
    'button.import': '导入',
    'button.export': '导出',
    'button.close': '关闭',
    'button.cancel': '取消',
    'button.settings': '设置',
    'button.back': '返回',
    'heading.settings': '设置',
    'heading.appearance': '外观',
    'heading.referenceScript': '参考讲稿',
    'apiKey.masked': 'OpenAI 密钥：{masked}',
    'apiKey.hidden': 'OpenAI 密钥：隐藏',
    'modal.apiKeyTitle': '更新 OpenAI API 密钥',
    'modal.apiKeySubtitle': '输入 API/管理员密钥或更新 Project ID，然后保存。',
    'modal.scriptTitle': '参考讲稿',
    'modal.scriptSubtitle': '可上传或从剪贴板粘贴讲稿文本，需要时可清除。',
    'tooltip.saveKey': '将 API 密钥保存到系统安全存储（钥匙串/凭据管理器）。',
    'tooltip.refresh': '刷新并重新检测可用音频输入设备。',
    'tooltip.start': '开始实时采集和翻译（F8）。',
    'tooltip.stop': '停止实时采集和翻译（F8）。',
    'tooltip.worshipOn': '敬拜模式已开启：翻译暂停（适合诗歌时段）。点击可恢复翻译（F7）。',
    'tooltip.worshipOff': '敬拜模式已关闭：翻译进行中。点击可在诗歌时段暂停翻译（F7）。',
    'tooltip.presentationOn': '退出翻译模式并返回标准布局（F6 或 Esc）。',
    'tooltip.presentationOff': '进入翻译模式并使用更大的字幕布局（F6）。',
    'tooltip.help': '显示或隐藏快捷键帮助面板。',
    'tooltip.lockOn': '解锁配置控件以允许修改（F2）。',
    'tooltip.lockOff': '锁定配置控件，避免误操作（F2）。',
    'tooltip.outputWindow': '打开或关闭仅字幕投影窗口（用于第二屏）。',
    'tooltip.settings': '打开设置页面。',
    'tooltip.back': '返回实时翻译页面。',
    'tooltip.testAudioFile': '用音频文件走同一翻译流程进行测试。',
    'tooltip.scriptManager': '打开讲稿工具（上传、粘贴、清除）。',
    'tooltip.uploadScript': '上传目标语言讲稿文本，用于辅助翻译并在翻译模式中滚动查看。',
    'tooltip.pasteScript': '从剪贴板直接粘贴目标语言讲稿文本。',
    'tooltip.clearScript': '清除当前会话中的参考讲稿。',
    'tooltip.resetSession': '重置队列、字幕、转录以及会话/费用计数（F4）。',
    'tooltip.copyLatestOutput': '复制最新一行输出字幕到剪贴板。',
    'tooltip.exportTranscript': '将当前转录条目导出为文本文件。',
    'tooltip.saveGlossary': '保存当前术语表内容用于翻译提示。',
    'tooltip.import': '从文本文件导入术语表。',
    'tooltip.export': '将术语表导出到文本文件。',
    'tooltip.close': '关闭帮助面板。',
    'tooltip.copyKey': '复制该密钥到剪贴板。',
    'help.title': '快捷控制',
    'help.f8': '<strong>F8</strong>：开始/停止翻译',
    'help.f7': '<strong>F7</strong>：切换敬拜模式',
    'help.f6': '<strong>F6</strong>：切换翻译模式',
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
    'status.scriptLoaded': '参考讲稿已加载：{lines} 行',
    'status.scriptLoadFailed': '加载讲稿文件失败：{error}',
    'status.scriptPasted': '参考讲稿已粘贴：{lines} 行',
    'status.scriptPasteFailed': '从剪贴板粘贴讲稿失败：{error}',
    'status.scriptClipboardEmpty': '剪贴板中没有可用讲稿文本',
    'status.scriptCleared': '参考讲稿已清除',
    'status.noScriptToClear': '当前没有已加载的参考讲稿',
    'status.testAudioPlaybackBlocked': '浏览器阻止了测试音频播放，流式测试仍会继续。',
    'status.audioDeviceAccessError': '音频设备访问错误：{error}',
    'status.running': '运行中：采集{source}音频，生成英文与{target}字幕',
    'status.startFailed': '启动失败：{error}',
    'status.autoSaved': '已停止并自动保存转录：{path}',
    'status.stopped': '已停止',
    'status.autoSaveFailed': '已停止（自动保存失败：{error}）',
    'status.apiKeySaved': 'API 密钥已配置并安全保存',
    'status.adminApiKeySaved': '管理员密钥已安全保存',
    'status.apiKeyCopied': '已复制 OpenAI API 密钥',
    'status.adminApiKeyCopied': '已复制 OpenAI 管理员密钥',
    'status.projectIdSaved': 'Project ID 已保存',
    'status.themeSet': '主题已切换为 {theme}',
    'status.apiKeyFailed': '配置 API 密钥失败',
    'status.apiKeyRequired': '请输入 OpenAI API 密钥后继续',
    'status.glossarySaved': '术语表已保存',
    'status.glossaryImported': '术语表已导入',
    'status.glossaryImportCanceled': '已取消术语表导入',
    'status.glossaryExported': '术语表已导出：{path}',
    'status.glossaryExportCanceled': '已取消术语表导出',
    'status.sourceSet': '源语言已设置为 {source}',
    'status.outputSet': '输出语言已设置为 {target}',
    'status.outputWindowToggled': '已切换投影窗口',
    'status.outputWindowError': '投影窗口错误：{error}',
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
    'script.empty': '尚未加载参考讲稿。建议在翻译前上传目标语言讲稿，便于翻译模式中随时查看。',
    'script.metaNone': '尚未加载参考讲稿。',
    'script.metaLoaded': '已加载讲稿：{lines} 行',
    'mode.running': '运行中',
    'mode.stopped': '已停止',
    'mode.on': '开',
    'mode.off': '关',
    'mode.queueProcessing': '处理中',
    'mode.summary':
      '模式：{mode} | 敬拜：{worship} | 翻译模式：{presentation} | 队列：{queue}',
    'cost.summary': '费用估算：本场 {session} 美元 | 每月 {month} 美元',
    'cost.project': 'Project：{projectId}',
    'cost.realSummary': '真实费用：今日 {today} {currency} | 本月 {month} {currency}',
    'cost.realLoading': '正在从 OpenAI 计费 API 获取真实费用...',
    'cost.realUnavailable': '真实费用不可用：{reason}',
    'ui.en': 'English',
    'ui.zh-hans': '简体中文',
    'theme.broadcast-clean': '投屏高对比',
    'theme.paper-light': '浅色纸面',
    'theme.minimal-mono': '极简单色',
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
const SUPPORTED_UI_THEMES = ['broadcast-clean', 'paper-light', 'minimal-mono'];
const PROJECT_ID_STORAGE_KEY = 'church-openai-project-id';
const UI_THEME_STORAGE_KEY = 'church-ui-theme';
const REFERENCE_SCRIPT_STORAGE_KEY = 'church-reference-script';
const REAL_COST_REFRESH_MS = 5 * 60 * 1000;
let uiLanguage = 'en';
let mainInitialized = false;
let mainView = 'live';
let statusHideTimer = 0;
let realCostFetchInFlight = false;
let lastRealCostFetchAt = 0;
let cachedRealCostProjectId = '';
let cachedRealCostToday = 0;
let cachedRealCostMonth = 0;
let cachedRealCostCurrency = 'USD';
let cachedRealCostError = '';
let hasConfiguredApiKey = false;
let hasConfiguredAdminKey = false;
let referenceScriptText = '';

function loadNumericSetting(key, fallback, minValue, maxValue) {
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  const value = Number(raw);
  if (Number.isNaN(value)) return fallback;
  if (value < minValue || value > maxValue) return fallback;
  return value;
}

function getUiLanguage() {
  if (SUPPORTED_UI_LANGUAGES.includes(uiLanguageSelect.value)) {
    return uiLanguageSelect.value;
  }
  return 'en';
}

function applyTheme(theme: any) {
  const normalizedTheme = SUPPORTED_UI_THEMES.includes(theme) ? theme : 'broadcast-clean';
  themeSelect.value = normalizedTheme;
  document.body.setAttribute('data-theme', normalizedTheme);
  localStorage.setItem(UI_THEME_STORAGE_KEY, normalizedTheme);
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

function setIconButton(button: HTMLElement, icon: string, label: string) {
  button.textContent = icon;
  button.setAttribute('aria-label', label);
}

function languageName(code) {
  const labels = LANGUAGE_DISPLAY[uiLanguage] || LANGUAGE_DISPLAY.en;
  return labels[code] || code;
}

function countScriptLines(content) {
  if (!content) return 0;
  return content.split(/\r?\n/).filter((line) => line.trim().length > 0).length;
}

function updateReferenceScriptUi() {
  const hasScript = Boolean(referenceScriptText);
  document.body.classList.toggle('has-reference-script', hasScript);
  scriptReferenceCardEl.classList.toggle('has-script', hasScript);
  referenceScriptContentEl.textContent = hasScript ? referenceScriptText : t('script.empty');
  referenceScriptMetaEl.textContent = hasScript
    ? t('script.metaLoaded', { lines: countScriptLines(referenceScriptText) })
    : t('script.metaNone');
  clearReferenceScriptButton.disabled = controlsLocked || !hasScript;
}

function setReferenceScript(rawScriptText, options: { persist?: boolean } = {}) {
  const normalized = String(rawScriptText || '').replace(/\r\n/g, '\n').trim();
  referenceScriptText = normalized;
  if (options.persist !== false) {
    if (normalized) {
      localStorage.setItem(REFERENCE_SCRIPT_STORAGE_KEY, normalized);
    } else {
      localStorage.removeItem(REFERENCE_SCRIPT_STORAGE_KEY);
    }
  }
  updateReferenceScriptUi();
}

function setStatus(text) {
  statusEl.textContent = text;
  statusToastEl.classList.remove('hidden');
  if (statusHideTimer) {
    window.clearTimeout(statusHideTimer);
  }
  statusHideTimer = window.setTimeout(() => {
    statusToastEl.classList.add('hidden');
  }, 4200);
  if (landingStatusEl) {
    landingStatusEl.textContent = text;
  }
}

function setStatusKey(key, values = {}) {
  setStatus(t(key, values));
}

function maskApiKey(rawApiKey) {
  const trimmed = (rawApiKey || '').trim();
  if (!trimmed) return 'hidden';
  if (trimmed.length <= 8) {
    return `${trimmed.slice(0, 2)}***`;
  }
  return `${trimmed.slice(0, 3)}***${trimmed.slice(-4)}`;
}

function setMaskedApiKey(masked) {
  if (!maskedApiKeyEl) return;
  if (!masked || masked === 'hidden') {
    maskedApiKeyEl.textContent = t('apiKey.hidden');
    return;
  }
  maskedApiKeyEl.textContent = t('apiKey.masked', { masked });
}

function normalizeProjectId(rawProjectId: any) {
  return (rawProjectId || '').trim();
}

function formatCostError(rawError: any) {
  const text = String(rawError || 'unknown error').replace(/\s+/g, ' ').trim();
  if (text.length <= 120) return text;
  return `${text.slice(0, 117)}...`;
}

function syncProjectIdInputs(rawProjectId: any) {
  const projectId = normalizeProjectId(rawProjectId);
  projectIdInput.value = projectId;
  mainProjectIdInput.value = projectId;
}

function saveProjectId(rawProjectId: any) {
  const projectId = normalizeProjectId(rawProjectId);
  if (projectId) {
    localStorage.setItem(PROJECT_ID_STORAGE_KEY, projectId);
  } else {
    localStorage.removeItem(PROJECT_ID_STORAGE_KEY);
  }
  syncProjectIdInputs(projectId);
  cachedRealCostProjectId = '';
  cachedRealCostError = '';
  lastRealCostFetchAt = 0;
  updateCostSummary();
  return projectId;
}

async function refreshRealProjectCosts(force = false) {
  if (!hasConfiguredApiKey && !hasConfiguredAdminKey) return;
  const projectId = normalizeProjectId(localStorage.getItem(PROJECT_ID_STORAGE_KEY));
  if (!projectId) return;
  if (realCostFetchInFlight) return;
  if (
    !force &&
    cachedRealCostProjectId === projectId &&
    Date.now() - lastRealCostFetchAt < REAL_COST_REFRESH_MS
  ) {
    return;
  }

  realCostFetchInFlight = true;
  try {
    const result = await invoke('fetch_project_costs', { projectId });
    cachedRealCostProjectId = projectId;
    cachedRealCostToday = Number(result.todayCost || 0);
    cachedRealCostMonth = Number(result.monthCost || 0);
    cachedRealCostCurrency = String(result.currency || 'USD').toUpperCase();
    cachedRealCostError = '';
    lastRealCostFetchAt = Date.now();
  } catch (error) {
    cachedRealCostProjectId = projectId;
    cachedRealCostError = formatCostError((error && error.message) || String(error) || 'unknown error');
    lastRealCostFetchAt = Date.now();
  } finally {
    realCostFetchInFlight = false;
    updateCostSummary();
  }
}

function showLandingPage() {
  landingPage.classList.remove('hidden');
  mainPage.classList.add('hidden');
}

function showMainPage() {
  landingPage.classList.add('hidden');
  mainPage.classList.remove('hidden');
}

function setMainView(nextView) {
  mainView = nextView === 'settings' ? 'settings' : 'live';
  const showLive = mainView === 'live';
  liveWorkspaceEl.classList.toggle('hidden', !showLive);
  settingsPageEl.classList.toggle('hidden', showLive);
}

function setApiKeyModalVisible(nextVisible) {
  const visible = Boolean(nextVisible);
  apiKeyModal.classList.toggle('hidden', !visible);
  if (visible) {
    mainProjectIdInput.value = normalizeProjectId(localStorage.getItem(PROJECT_ID_STORAGE_KEY));
    mainApiKeyInput.focus();
    void loadSavedKeysForUpdatePanel();
  } else {
    mainApiKeyInput.value = '';
    mainAdminApiKeyInput.value = '';
  }
}

function setScriptModalVisible(nextVisible) {
  const visible = Boolean(nextVisible);
  scriptModal.classList.toggle('hidden', !visible);
  if (visible) {
    closeScriptModalButton.focus();
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
  const costSummaryText = t('cost.summary', {
    session: sessionTotal.toFixed(2),
    month: estimatedMonth.toFixed(2)
  });
  const projectId = normalizeProjectId(localStorage.getItem(PROJECT_ID_STORAGE_KEY));
  if (projectId) {
    if (cachedRealCostProjectId === projectId && !cachedRealCostError) {
      maskedApiKeyEl.title = `${t('cost.realSummary', {
        today: cachedRealCostToday.toFixed(2),
        month: cachedRealCostMonth.toFixed(2),
        currency: cachedRealCostCurrency
      })}\n${t('cost.project', { projectId })}`;
    } else if (cachedRealCostProjectId === projectId && cachedRealCostError) {
      maskedApiKeyEl.title = `${costSummaryText}\n${t('cost.realUnavailable', {
        reason: cachedRealCostError
      })}\n${t('cost.project', { projectId })}`;
    } else {
      maskedApiKeyEl.title = `${costSummaryText}\n${t('cost.realLoading')}\n${t('cost.project', {
        projectId
      })}`;
    }
    void refreshRealProjectCosts();
    return;
  }
  maskedApiKeyEl.title = costSummaryText;
}

function updateModeSummary() {
  const queueText = segmentQueueRunning
    ? `${pendingSegments.length} (${t('mode.queueProcessing')})`
    : `${pendingSegments.length}`;
  const summaryText = t('mode.summary', {
    mode: running ? t('mode.running') : t('mode.stopped'),
    worship: worshipMode ? t('mode.on') : t('mode.off'),
    presentation: presentationMode ? t('mode.on') : t('mode.off'),
    queue: queueText
  });
  modeSummaryEl.textContent = summaryText;
  liveModeSummaryEl.textContent = summaryText;
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
    openSettingsPageButton,
    backToLivePageButton,
    audioInputSelect,
    themeSelect,
    sourceLanguageSelect,
    targetLanguageSelect,
    refreshDevicesButton,
    testAudioFileButton,
    openScriptManagerButton,
    uploadReferenceScriptButton,
    pasteReferenceScriptButton,
    vadThresholdInput,
    liveVadThresholdInput,
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
  updateReferenceScriptUi();
  setStatusKey(controlsLocked ? 'status.controlsLocked' : 'status.controlsUnlocked');
  updateModeSummary();
}

function setRunningButtonState() {
  if (running) {
    toggleRunButton.textContent = t('button.stop');
    toggleRunButton.classList.add('stop');
    toggleRunButton.classList.remove('run');
    liveToggleRunButton.textContent = t('button.stop');
    liveToggleRunButton.classList.add('stop');
    liveToggleRunButton.classList.remove('run');
  } else {
    toggleRunButton.textContent = t('button.start');
    toggleRunButton.classList.add('run');
    toggleRunButton.classList.remove('stop');
    liveToggleRunButton.textContent = t('button.start');
    liveToggleRunButton.classList.add('run');
    liveToggleRunButton.classList.remove('stop');
  }
  toggleRunButton.title = running ? t('tooltip.stop') : t('tooltip.start');
  liveToggleRunButton.title = running ? t('tooltip.stop') : t('tooltip.start');
}

function refreshToggleButtonLabels() {
  setRunningButtonState();
  toggleWorshipModeButton.textContent = worshipMode ? t('button.worshipOn') : t('button.worshipOff');
  liveToggleWorshipModeButton.textContent = worshipMode ? t('button.worshipOn') : t('button.worshipOff');
  togglePresentationButton.textContent = presentationMode ? t('button.presentationOn') : t('button.presentationOff');
  toggleLockControlsButton.textContent = controlsLocked ? t('button.lockOn') : t('button.lockOff');
  toggleRunButton.title = running ? t('tooltip.stop') : t('tooltip.start');
  liveToggleRunButton.title = running ? t('tooltip.stop') : t('tooltip.start');
  toggleWorshipModeButton.title = worshipMode ? t('tooltip.worshipOn') : t('tooltip.worshipOff');
  liveToggleWorshipModeButton.title = worshipMode ? t('tooltip.worshipOn') : t('tooltip.worshipOff');
  togglePresentationButton.title = presentationMode ? t('tooltip.presentationOn') : t('tooltip.presentationOff');
  toggleLockControlsButton.title = controlsLocked ? t('tooltip.lockOn') : t('tooltip.lockOff');
}

function setStaticButtonTooltips() {
  saveKeyButton.title = t('tooltip.saveKey');
  openSettingsPageButton.title = t('tooltip.settings');
  backToLivePageButton.title = t('tooltip.back');
  liveExitTranslationModeButton.title = t('tooltip.presentationOn');
  refreshDevicesButton.title = t('tooltip.refresh');
  toggleHelpButton.title = t('tooltip.help');
  liveToggleHelpButton.title = t('tooltip.help');
  toggleOutputWindowButton.title = t('tooltip.outputWindow');
  testAudioFileButton.title = t('tooltip.testAudioFile');
  openScriptManagerButton.title = t('tooltip.scriptManager');
  liveOpenScriptManagerButton.title = t('tooltip.scriptManager');
  uploadReferenceScriptButton.title = t('tooltip.uploadScript');
  pasteReferenceScriptButton.title = t('tooltip.pasteScript');
  clearReferenceScriptButton.title = t('tooltip.clearScript');
  resetSessionButton.title = t('tooltip.resetSession');
  liveResetSessionButton.title = t('tooltip.resetSession');
  copyLatestChineseButton.title = t('tooltip.copyLatestOutput');
  exportTranscriptButton.title = t('tooltip.exportTranscript');
  saveGlossaryButton.title = t('tooltip.saveGlossary');
  importGlossaryButton.title = t('tooltip.import');
  exportGlossaryButton.title = t('tooltip.export');
  closeHelpButton.title = t('tooltip.close');
  closeScriptModalButton.title = t('tooltip.close');
  copyMainApiKeyButton.title = t('tooltip.copyKey');
  copyMainAdminApiKeyButton.title = t('tooltip.copyKey');
}

function setPresentationMode(nextMode) {
  presentationMode = Boolean(nextMode);
  document.body.classList.toggle('presentation-mode', presentationMode);
  translationLiveBarEl.classList.toggle('hidden', !presentationMode);
  togglePresentationButton.textContent = presentationMode ? t('button.presentationOn') : t('button.presentationOff');
  togglePresentationButton.title = presentationMode ? t('tooltip.presentationOn') : t('tooltip.presentationOff');
  if (presentationMode) {
    renderPanels(activePairLineId);
  }
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
  liveToggleWorshipModeButton.textContent = worshipMode ? t('button.worshipOn') : t('button.worshipOff');
  toggleWorshipModeButton.title = worshipMode ? t('tooltip.worshipOn') : t('tooltip.worshipOff');
  liveToggleWorshipModeButton.title = worshipMode ? t('tooltip.worshipOn') : t('tooltip.worshipOff');

  if (worshipMode) {
    pendingSegments.length = 0;
    clearCurrentLiveTranslation();
    setStatusKey('status.worshipEnabled');
  } else if (running) {
    setStatusKey('status.worshipDisabledRunning');
    drainSegmentQueue();
  } else {
    setStatusKey('status.worshipDisabled');
  }
  updateModeSummary();
}

function buildLineCard(text, warning, isActive) {
  const div = document.createElement('div');
  const empty = !text;
  div.className = `line ${warning ? 'warning' : ''} ${isActive ? 'active-current' : ''} ${empty ? 'empty' : ''}`;
  div.textContent = empty ? ' ' : text;
  return div;
}

function normalizePairedCardHeights() {
  const englishCards = Array.from(englishPanel.querySelectorAll('.line'));
  const chineseCards = Array.from(chinesePanel.querySelectorAll('.line'));
  const rowCount = Math.max(englishCards.length, chineseCards.length);

  for (let i = 0; i < rowCount; i += 1) {
    const leftCard = englishCards[i];
    const rightCard = chineseCards[i];
    if (!(leftCard instanceof HTMLElement) || !(rightCard instanceof HTMLElement)) {
      continue;
    }
    leftCard.style.height = '';
    rightCard.style.height = '';
    const rowHeight = Math.max(leftCard.offsetHeight, rightCard.offsetHeight);
    leftCard.style.height = `${rowHeight}px`;
    rightCard.style.height = `${rowHeight}px`;
  }
}

function alignPresentationPanels() {
  if (!presentationMode) return;
  const englishActive = englishPanel.querySelector('.active-current');
  const chineseActive = chinesePanel.querySelector('.active-current');
  if (!(englishActive instanceof HTMLElement) || !(chineseActive instanceof HTMLElement)) {
    return;
  }

  const targetRatio = 0.56;
  const targetYEnglish = englishPanel.clientHeight * targetRatio;
  const targetYChinese = chinesePanel.clientHeight * targetRatio;
  const englishCenter = englishActive.offsetTop + englishActive.offsetHeight / 2;
  const chineseCenter = chineseActive.offsetTop + chineseActive.offsetHeight / 2;

  englishPanel.scrollTop = Math.max(
    0,
    Math.min(englishCenter - targetYEnglish, englishPanel.scrollHeight - englishPanel.clientHeight)
  );
  chinesePanel.scrollTop = Math.max(
    0,
    Math.min(chineseCenter - targetYChinese, chinesePanel.scrollHeight - chinesePanel.clientHeight)
  );
}

function pinPanelsToLatest() {
  englishPanel.scrollTop = englishPanel.scrollHeight;
  chinesePanel.scrollTop = chinesePanel.scrollHeight;
}

function renderPanels(activeLineId = 0) {
  englishPanel.innerHTML = '';
  chinesePanel.innerHTML = '';

  pairedLines.forEach((line) => {
    const isActive = line.id === activeLineId;
    const englishCard = buildLineCard(line.englishText, line.englishWarning, isActive);
    const chineseCard = buildLineCard(line.chineseText, line.chineseWarning, isActive);
    englishPanel.appendChild(englishCard);
    chinesePanel.appendChild(chineseCard);
  });

  normalizePairedCardHeights();
  pinPanelsToLatest();
  window.requestAnimationFrame(() => {
    pinPanelsToLatest();
  });
  if (presentationMode) {
    window.requestAnimationFrame(() => {
      pinPanelsToLatest();
    });
  }
}

function appendPairedLine(
  englishText,
  chineseText,
  options: { englishWarning?: boolean; chineseWarning?: boolean; highlight?: boolean } = {}
) {
  if (!englishText && !chineseText) return;
  const entry = {
    id: ++lineSequence,
    englishText: englishText || '',
    chineseText: chineseText || '',
    englishWarning: Boolean(options.englishWarning),
    chineseWarning: Boolean(options.chineseWarning)
  };
  pairedLines.push(entry);
  while (pairedLines.length > MAX_LINES) pairedLines.shift();
  if (options.highlight !== false && !entry.englishWarning && !entry.chineseWarning) {
    activePairLineId = entry.id;
  }
  renderPanels(activePairLineId);
  syncOutputWindow();
}

function setLiveLine(element, text, mode = 'idle') {
  element.textContent = text || '';
  element.classList.toggle('active', mode === 'active' && Boolean(text));
  element.classList.toggle('status', mode === 'status' && Boolean(text));
}

function setCurrentLiveStatus(englishText, translatedText) {
  setLiveLine(englishLiveEl, englishText, 'status');
  setLiveLine(chineseLiveEl, translatedText, 'status');
}

function clearCurrentLiveTranslation() {
  setLiveLine(englishLiveEl, '', 'idle');
  setLiveLine(chineseLiveEl, '', 'idle');
}

function getLatestChineseLine() {
  for (let i = pairedLines.length - 1; i >= 0; i -= 1) {
    if (!pairedLines[i].chineseWarning && pairedLines[i].chineseText) {
      return pairedLines[i].chineseText;
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

  Array.from(sourceLanguageSelect.options).forEach((option: any) => {
    if (labels[option.value]) {
      option.textContent = labels[option.value];
    }
  });
}

function updateTargetLanguageOptionLabels() {
  Array.from(targetLanguageSelect.options).forEach((option: any) => {
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
  labelAdminApiKeyEl.textContent = t('label.adminApiKey');
  labelProjectIdEl.textContent = t('label.projectId');
  labelUiLanguageEl.textContent = t('label.uiLanguage');
  labelAudioInputEl.textContent = t('label.audioInput');
  labelThemeEl.textContent = t('label.theme');
  labelSourceLanguageEl.textContent = t('label.sourceLanguage');
  labelTargetLanguageEl.textContent = t('label.targetLanguage');
  labelVadThresholdEl.textContent = t('label.vadThreshold');
  labelLiveVadThresholdEl.textContent = t('label.vadThreshold');
  labelSilenceMsEl.textContent = t('label.silenceMs');
  labelMaxSegmentMsEl.textContent = t('label.maxSegmentMs');
  labelGlossaryEl.textContent = t('label.glossary');
  labelAutoSaveOnStopEl.textContent = t('label.autoSaveOnStop');

  englishHeadingEl.textContent = t('heading.english');
  saveKeyButton.textContent = t('button.saveKey');
  saveMainApiKeyButton.textContent = t('button.saveKey');
  cancelMainApiKeyButton.textContent = t('button.cancel');
  setIconButton(openSettingsPageButton, '⚙', t('button.settings'));
  setIconButton(backToLivePageButton, '←', t('button.back'));
  setIconButton(liveExitTranslationModeButton, '←', t('button.presentationOn'));
  settingsHeadingEl.textContent = t('heading.settings');
  appearanceSummaryEl.textContent = t('heading.appearance');
  referenceScriptHeadingEl.textContent = t('heading.referenceScript');
  setIconButton(refreshDevicesButton, '↻', t('button.refresh'));
  toggleHelpButton.textContent = t('button.help');
  liveToggleHelpButton.textContent = t('button.help');
  toggleOutputWindowButton.textContent = t('button.outputWindow');
  testAudioFileButton.textContent = t('button.testAudioFile');
  openScriptManagerButton.textContent = t('button.scriptManager');
  liveOpenScriptManagerButton.textContent = t('button.scriptManager');
  uploadReferenceScriptButton.textContent = t('button.uploadScript');
  pasteReferenceScriptButton.textContent = t('button.pasteScript');
  clearReferenceScriptButton.textContent = t('button.clearScript');
  resetSessionButton.textContent = t('button.resetSession');
  liveResetSessionButton.textContent = t('button.resetSession');
  copyLatestChineseButton.textContent = t('button.copyLatestOutput');
  exportTranscriptButton.textContent = t('button.exportTranscript');
  saveGlossaryButton.textContent = t('button.saveGlossary');
  importGlossaryButton.textContent = t('button.import');
  exportGlossaryButton.textContent = t('button.export');
  closeHelpButton.textContent = t('button.close');
  closeScriptModalButton.textContent = t('button.close');
  apiKeyModalTitleEl.textContent = t('modal.apiKeyTitle');
  apiKeyModalSubtitleEl.textContent = t('modal.apiKeySubtitle');
  scriptModalTitleEl.textContent = t('modal.scriptTitle');
  scriptModalSubtitleEl.textContent = t('modal.scriptSubtitle');
  labelMainApiKeyEl.textContent = t('label.apiKey');
  labelMainAdminApiKeyEl.textContent = t('label.adminApiKey');
  labelMainProjectIdEl.textContent = t('label.projectId');

  helpTitleEl.textContent = t('help.title');
  helpF8El.innerHTML = t('help.f8');
  helpF7El.innerHTML = t('help.f7');
  helpF6El.innerHTML = t('help.f6');
  helpF2El.innerHTML = t('help.f2');
  helpF4El.innerHTML = t('help.f4');
  helpF1El.innerHTML = t('help.f1');

  Array.from(uiLanguageSelect.options).forEach((option: any) => {
    option.textContent = t(`ui.${option.value}`);
  });
  Array.from(themeSelect.options).forEach((option: any) => {
    option.textContent = t(`theme.${option.value}`);
  });
  Array.from(audioInputSelect.options).forEach((option: any) => {
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
  syncProjectIdInputs(localStorage.getItem(PROJECT_ID_STORAGE_KEY));
  setMaskedApiKey(localStorage.getItem('church-masked-api-key') || 'hidden');
  updateReferenceScriptUi();

}

async function syncOutputWindow() {
  try {
    await invoke('push_output_caption', {
      payload: {
        englishLines: pairedLines.map((line) => line.englishText).filter(Boolean),
        chineseLines: pairedLines.map((line) => line.chineseText).filter(Boolean),
        englishLive: englishLiveEl.textContent || '',
        chineseLive: chineseLiveEl.textContent || '',
        modeSummary: modeSummaryEl.textContent || '',
        targetLabel: languageName(targetLanguageSelect.value || 'zh-hans')
      }
    });
  } catch {
    // Ignore sync errors when output window is closed.
  }
}

function clearPanels() {
  pairedLines.length = 0;
  activePairLineId = 0;
  renderPanels(activePairLineId);
  clearCurrentLiveTranslation();
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

function bytesToBase64(bytes) {
  let binary = '';
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode(...chunk);
  }
  return btoa(binary);
}

function encodeMonoPcm16Wav(decodedBuffer, startSample, endSample) {
  const safeStart = Math.max(0, Math.min(startSample, decodedBuffer.length));
  const safeEnd = Math.max(safeStart, Math.min(endSample, decodedBuffer.length));
  const sampleCount = Math.max(1, safeEnd - safeStart);
  const sampleRate = decodedBuffer.sampleRate;
  const channelCount = decodedBuffer.numberOfChannels || 1;
  const bytesPerSample = 2;
  const dataLength = sampleCount * bytesPerSample;
  const buffer = new ArrayBuffer(44 + dataLength);
  const view = new DataView(buffer);
  const pcm = new Int16Array(buffer, 44, sampleCount);

  const writeAscii = (offset, text) => {
    for (let i = 0; i < text.length; i += 1) {
      view.setUint8(offset + i, text.charCodeAt(i));
    }
  };

  writeAscii(0, 'RIFF');
  view.setUint32(4, 36 + dataLength, true);
  writeAscii(8, 'WAVE');
  writeAscii(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * bytesPerSample, true);
  view.setUint16(32, bytesPerSample, true);
  view.setUint16(34, 16, true);
  writeAscii(36, 'data');
  view.setUint32(40, dataLength, true);

  const channels = [];
  for (let ch = 0; ch < channelCount; ch += 1) {
    channels.push(decodedBuffer.getChannelData(ch));
  }

  for (let i = 0; i < sampleCount; i += 1) {
    let mixed = 0;
    for (let ch = 0; ch < channelCount; ch += 1) {
      mixed += channels[ch][safeStart + i] || 0;
    }
    mixed /= channelCount;
    const clipped = Math.max(-1, Math.min(1, mixed));
    pcm[i] = clipped < 0 ? clipped * 0x8000 : clipped * 0x7fff;
  }

  return new Uint8Array(buffer);
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
      setStatusKey('status.retryingSegment', { attempt: attempt + 1, max: SEGMENT_MAX_RETRIES });
      await waitMs(delay);
    }
  }

  throw lastError;
}

async function processTestAudioFile(file) {
  if (!file) return;
  if (testStreamActive) {
    setStatus('Test audio stream is already running.');
    return;
  }

  testStreamActive = true;
  setStatusKey('status.testingFile', { name: file.name });

  const buffer = await file.arrayBuffer();
  const playbackUrl = URL.createObjectURL(file);
  const playbackAudio = new Audio(playbackUrl);
  playbackAudio.preload = 'auto';

  try {
    try {
      await playbackAudio.play();
    } catch {
      setStatusKey('status.testAudioPlaybackBlocked');
    }

    const audioContextForTest = new AudioContext();
    const decoded = await audioContextForTest.decodeAudioData(buffer.slice(0));
    await audioContextForTest.close();

    const totalSamples = decoded.length;
    const segmentSamples = Math.max(1, Math.floor((TEST_FILE_SEGMENT_MS / 1000) * decoded.sampleRate));
    const totalSegmentsForFile = Math.max(1, Math.ceil(totalSamples / segmentSamples));

    for (let i = 0; i < totalSegmentsForFile; i += 1) {
      const startSample = i * segmentSamples;
      const endSample = Math.min(totalSamples, startSample + segmentSamples);
      const durationMs = Math.round(((endSample - startSample) / decoded.sampleRate) * 1000);
      const wavBytes = encodeMonoPcm16Wav(decoded, startSample, endSample);
      const payload = {
        audio_base64: bytesToBase64(wavBytes),
        mime_type: 'audio/wav',
        durationMs
      };
      pendingSegments.push(payload);
      updateModeSummary();
      drainSegmentQueue();
      if (i < totalSegmentsForFile - 1) {
        await waitMs(Math.max(120, durationMs));
      }
    }

    while (pendingSegments.length || segmentQueueRunning) {
      await waitMs(120);
    }
    setStatusKey('status.fileTestFinished', { name: file.name });
    updateModeSummary();
  } catch (err) {
    const error = err.message || String(err);
    setStatusKey('status.fileTestFailed', { error });
    appendPairedLine(t('status.warning', { warning: error }), '', { englishWarning: true, highlight: false });
  } finally {
    playbackAudio.pause();
    playbackAudio.src = '';
    URL.revokeObjectURL(playbackUrl);
    testStreamActive = false;
    testAudioFileInput.value = '';
  }
}

async function processReferenceScriptFile(file) {
  if (!file) return;
  try {
    const content = await file.text();
    setReferenceScript(content);
    await syncTranslationConfig();
    setStatusKey('status.scriptLoaded', { lines: countScriptLines(referenceScriptText) });
  } catch (err) {
    setStatusKey('status.scriptLoadFailed', { error: (err && err.message) || String(err) });
  } finally {
    referenceScriptInput.value = '';
  }
}

async function pasteReferenceScriptFromClipboard() {
  try {
    const content = await navigator.clipboard.readText();
    if (!content || !content.trim()) {
      setStatusKey('status.scriptClipboardEmpty');
      return;
    }
    setReferenceScript(content);
    await syncTranslationConfig();
    setStatusKey('status.scriptPasted', { lines: countScriptLines(referenceScriptText) });
  } catch (err) {
    setStatusKey('status.scriptPasteFailed', { error: (err && err.message) || String(err) });
  }
}

async function drainSegmentQueue() {
  if (segmentQueueRunning || !pendingSegments.length) {
    return;
  }

  segmentQueueRunning = true;
  try {
    while ((running || testStreamActive) && pendingSegments.length) {
      if (worshipMode) {
        pendingSegments.length = 0;
        updateModeSummary();
        break;
      }

      const payload = pendingSegments.shift();
      const result = await processSegmentWithRetry(payload);
      const translatedText = result.translated || result.chinese || '';
      appendPairedLine(result.english || '', translatedText);

      if (result.english || translatedText) {
        transcriptEntries.push({
          timestamp: new Date().toLocaleTimeString(),
          english: result.english || '',
          chinese: translatedText
        });
      }
      totalSegments += 1;
      totalAudioMs += Number(payload.durationMs || 0);
      totalEnglishChars += (result.english || '').length;
      totalTranslatedChars += (result.translated || result.chinese || '').length;
      updateCostSummary();

      if (result.warning) {
        const isTargetTranslationWarning = String(result.warning).startsWith('Target translation');
        const warningText = t('status.warning', { warning: result.warning });
        if (!isTargetTranslationWarning) {
          appendPairedLine(warningText, '', { englishWarning: true, highlight: false });
        }
        if (!translatedText) {
          appendPairedLine('', warningText, { chineseWarning: true, highlight: false });
        }
      }

      clearCurrentLiveTranslation();
      syncOutputWindow();
      updateModeSummary();
    }
  } catch (err) {
    appendPairedLine(t('status.warning', { warning: err.message || String(err) }), '', {
      englishWarning: true,
      highlight: false
    });
    syncOutputWindow();
  } finally {
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
  } catch (err) {
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
  } catch (err) {
    setStatusKey('status.audioDeviceAccessError', { error: err.message || String(err) });
    return;
  }

  if (permissionError) {
    setStatusKey('status.audioDeviceAccessError', { error: permissionError.message || String(permissionError) });
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
      audio_base64: arrayBufferToBase64(audioBuffer),
      mime_type: blob.type,
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
        setCurrentLiveStatus(t('status.listening'), t('status.translating'));
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
      setStatusKey('status.running', {
        source: languageName(sourceLanguageSelect.value || 'korean'),
        target: languageName(targetLanguageSelect.value || 'zh-hans')
      });
      drainSegmentQueue();
    } catch (err) {
      setStatusKey('status.startFailed', { error: err.message || String(err) });
      running = false;
      setRunningButtonState();
      await invoke('set_running', { nextRunning: false });
    }
  } else {
    await stopAudioPipeline();
    pendingSegments.length = 0;
    clearCurrentLiveTranslation();
    if (autoSaveOnStopInput.checked && transcriptEntries.length) {
      try {
        const saveResult = await invoke('auto_save_transcript', { entries: transcriptEntries });
        if (saveResult.ok) {
          setStatusKey('status.autoSaved', { path: saveResult.path });
        } else {
          setStatus(saveResult.message || t('status.stopped'));
        }
      } catch (err) {
        setStatusKey('status.autoSaveFailed', { error: err.message || String(err) });
      }
    } else {
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
      reference_script: referenceScriptText,
      target_language: targetLanguageSelect.value || 'zh-hans',
      source_language: sourceLanguageSelect.value || 'korean'
    }
  });
}

async function ensureMainInitialized() {
  if (mainInitialized) return;

  await loadDevices();

  const runState = await invoke('get_running');
  running = Boolean(runState.running);
  setRunningButtonState();

  const savedVadThreshold = loadNumericSetting('church-vad-threshold', 0.04, 0.01, 0.12);
  const savedSilenceMs = loadNumericSetting('church-silence-ms', 600, 200, 3000);
  const savedMaxSegmentMs = loadNumericSetting('church-max-segment-ms', 2500, 1200, 10000);

  vadThresholdInput.value = savedVadThreshold.toString();
  liveVadThresholdInput.value = savedVadThreshold.toString();
  silenceMsInput.value = savedSilenceMs.toString();
  maxSegmentMsInput.value = savedMaxSegmentMs.toString();
  vadValueEl.textContent = Number(vadThresholdInput.value).toFixed(3);
  liveVadValueEl.textContent = Number(vadThresholdInput.value).toFixed(3);

  const savedGlossary = localStorage.getItem('church-glossary');
  if (savedGlossary) {
    glossaryInput.value = savedGlossary;
  }
  setReferenceScript(localStorage.getItem(REFERENCE_SCRIPT_STORAGE_KEY) || '', { persist: false });

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

async function persistApiKey(apiKey, options: any = {}) {
  const shouldEnterMain = Boolean(options.enterMain);
  if (!apiKey) {
    setStatusKey('status.apiKeyRequired');
    return false;
  }

  try {
    const result = await invoke('config_api_key', { apiKey });
    if (result.ok) {
      const masked = result.maskedKey || maskApiKey(apiKey);
      hasConfiguredApiKey = true;
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
  } catch (err) {
    setStatus(err.message || t('status.apiKeyFailed'));
  }
  return false;
}

async function persistAdminApiKey(adminApiKey) {
  const trimmed = (adminApiKey || '').trim();
  if (!trimmed) {
    return true;
  }
  try {
    const result = await invoke('config_admin_api_key', { adminApiKey: trimmed });
    if (result.ok) {
      hasConfiguredAdminKey = true;
      adminApiKeyInput.value = '';
      mainAdminApiKeyInput.value = '';
      setStatusKey('status.adminApiKeySaved');
      return true;
    }
  } catch (err) {
    setStatus(err.message || t('status.apiKeyFailed'));
  }
  return false;
}

async function loadSavedKeysForUpdatePanel() {
  try {
    const payload = await invoke('load_saved_raw_keys_for_update_panel');
    mainApiKeyInput.value = (payload && payload.apiKey) || '';
    mainAdminApiKeyInput.value = (payload && payload.adminApiKey) || '';
  } catch {
    // Keep current in-memory values if loading from secure storage fails.
  }
}

async function copyTextToClipboard(text, successStatusKey) {
  if (!text || !String(text).trim()) {
    setStatusKey('status.apiKeyRequired');
    return;
  }
  try {
    await navigator.clipboard.writeText(String(text));
    setStatusKey(successStatusKey);
  } catch {
    setStatusKey('status.clipboardDenied');
  }
}

saveKeyButton.addEventListener('click', async () => {
  const apiKey = apiKeyInput.value.trim();
  const adminApiKey = adminApiKeyInput.value.trim();
  saveProjectId(projectIdInput.value);
  const adminSaved = await persistAdminApiKey(adminApiKey);
  if (!adminSaved) return;
  const saved = await persistApiKey(apiKey, { enterMain: true });
  if (saved) {
    void refreshRealProjectCosts(true);
  }
});

maskedApiKeyEl.addEventListener('click', () => {
  setApiKeyModalVisible(true);
});

async function saveApiKeyModalChanges() {
  const apiKey = mainApiKeyInput.value.trim();
  const adminApiKey = mainAdminApiKeyInput.value.trim();
  saveProjectId(mainProjectIdInput.value);
  const adminSaved = await persistAdminApiKey(adminApiKey);
  if (!adminSaved) return;
  if (!apiKey) {
    if (adminApiKey) {
      setStatusKey('status.adminApiKeySaved');
    } else {
      setStatusKey('status.projectIdSaved');
    }
    setApiKeyModalVisible(false);
    void refreshRealProjectCosts(true);
    return;
  }
  const saved = await persistApiKey(apiKey);
  if (saved) {
    setApiKeyModalVisible(false);
    void refreshRealProjectCosts(true);
  }
}

saveMainApiKeyButton.addEventListener('click', async () => {
  await saveApiKeyModalChanges();
});

openSettingsPageButton.addEventListener('click', () => {
  setMainView('settings');
});

backToLivePageButton.addEventListener('click', () => {
  setMainView('live');
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
  if (event.key !== 'Enter') return;
  await saveApiKeyModalChanges();
});

mainAdminApiKeyInput.addEventListener('keydown', async (event) => {
  if (event.key !== 'Enter') return;
  await saveApiKeyModalChanges();
});

copyMainApiKeyButton.addEventListener('click', async () => {
  await copyTextToClipboard(mainApiKeyInput.value, 'status.apiKeyCopied');
});

copyMainAdminApiKeyButton.addEventListener('click', async () => {
  await copyTextToClipboard(mainAdminApiKeyInput.value, 'status.adminApiKeyCopied');
});

mainProjectIdInput.addEventListener('keydown', async (event) => {
  if (event.key !== 'Enter') return;
  await saveApiKeyModalChanges();
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
  } else {
    setStatus(result.message || t('status.glossaryImportCanceled'));
  }
});

exportGlossaryButton.addEventListener('click', async () => {
  const result = await invoke('export_glossary', { content: glossaryInput.value || '' });
  if (result.ok) {
    setStatusKey('status.glossaryExported', { path: result.path });
  } else {
    setStatus(result.message || t('status.glossaryExportCanceled'));
  }
});

refreshDevicesButton.addEventListener('click', () => {
  loadDevices();
});

uiLanguageSelect.addEventListener('change', () => {
  applyUiLanguage();
});

themeSelect.addEventListener('change', () => {
  applyTheme(themeSelect.value);
  setStatusKey('status.themeSet', { theme: t(`theme.${themeSelect.value}`) });
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

liveToggleRunButton.addEventListener('click', async () => {
  await setRunning(!running);
});

toggleWorshipModeButton.addEventListener('click', () => {
  setWorshipMode(!worshipMode);
});

liveToggleWorshipModeButton.addEventListener('click', () => {
  setWorshipMode(!worshipMode);
});

togglePresentationButton.addEventListener('click', () => {
  togglePresentationModeDebounced();
});

liveExitTranslationModeButton.addEventListener('click', () => {
  setPresentationMode(false);
});

toggleHelpButton.addEventListener('click', () => {
  setHelpVisible(!helpVisible);
});

liveToggleHelpButton.addEventListener('click', () => {
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
  } catch (err) {
    setStatusKey('status.outputWindowError', { error: err.message || String(err) });
  }
});

testAudioFileButton.addEventListener('click', () => {
  testAudioFileInput.click();
});

openScriptManagerButton.addEventListener('click', () => {
  setScriptModalVisible(true);
});

liveOpenScriptManagerButton.addEventListener('click', () => {
  setScriptModalVisible(true);
});

uploadReferenceScriptButton.addEventListener('click', () => {
  referenceScriptInput.click();
});

pasteReferenceScriptButton.addEventListener('click', async () => {
  await pasteReferenceScriptFromClipboard();
});

clearReferenceScriptButton.addEventListener('click', async () => {
  if (!referenceScriptText) {
    setStatusKey('status.noScriptToClear');
    return;
  }
  setReferenceScript('');
  await syncTranslationConfig();
  setStatusKey('status.scriptCleared');
});

closeScriptModalButton.addEventListener('click', () => {
  setScriptModalVisible(false);
});

scriptModal.addEventListener('click', (event) => {
  if (event.target === scriptModal) {
    setScriptModalVisible(false);
  }
});

testAudioFileInput.addEventListener('change', async (event) => {
  const input = event.target as HTMLInputElement | null;
  const file = input?.files?.[0];
  await processTestAudioFile(file);
});

referenceScriptInput.addEventListener('change', async (event) => {
  const input = event.target as HTMLInputElement | null;
  const file = input?.files?.[0];
  await processReferenceScriptFile(file);
});

closeHelpButton.addEventListener('click', () => {
  setHelpVisible(false);
});

vadThresholdInput.addEventListener('input', () => {
  const value = Number(vadThresholdInput.value).toFixed(3);
  vadValueEl.textContent = value;
  liveVadThresholdInput.value = vadThresholdInput.value;
  liveVadValueEl.textContent = value;
  localStorage.setItem('church-vad-threshold', vadThresholdInput.value);
});

liveVadThresholdInput.addEventListener('input', () => {
  const value = Number(liveVadThresholdInput.value).toFixed(3);
  liveVadValueEl.textContent = value;
  vadThresholdInput.value = liveVadThresholdInput.value;
  vadValueEl.textContent = value;
  localStorage.setItem('church-vad-threshold', liveVadThresholdInput.value);
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

resetSessionButton.addEventListener('click', () => {
  resetSessionState();
});

liveResetSessionButton.addEventListener('click', () => {
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
  } catch {
    setStatusKey('status.clipboardDenied');
  }
});

exportTranscriptButton.addEventListener('click', async () => {
  const result = await invoke('export_transcript', { entries: transcriptEntries });
  if (result.ok) {
    setStatusKey('status.transcriptExported', { path: result.path });
  } else {
    setStatus(result.message || t('status.transcriptExportFailed'));
  }
});

async function loadSavedAdminApiKeyIfAvailable() {
  try {
    const loadedAdmin = await invoke('load_saved_admin_api_key');
    hasConfiguredAdminKey = Boolean(loadedAdmin && loadedAdmin.found);
    if (hasConfiguredAdminKey) {
      console.info('[api-key-storage] Admin API key loaded from saved storage');
    }
  } catch {
    hasConfiguredAdminKey = false;
  }
}

async function boot() {
  const savedTheme = localStorage.getItem(UI_THEME_STORAGE_KEY);
  applyTheme(savedTheme);
  const savedUiLanguage = localStorage.getItem('church-ui-language');
  if (savedUiLanguage && SUPPORTED_UI_LANGUAGES.includes(savedUiLanguage)) {
    uiLanguageSelect.value = savedUiLanguage;
  } else {
    uiLanguageSelect.value = 'en';
  }
  uiLanguage = getUiLanguage();
  applyUiLanguage();
  setMainView('live');
  await loadSavedAdminApiKeyIfAvailable();

  try {
    const loaded = await invoke('load_saved_api_key');
    if (loaded.found) {
      hasConfiguredApiKey = true;
      const masked = loaded.maskedKey || localStorage.getItem('church-masked-api-key') || 'hidden';
      localStorage.setItem('church-masked-api-key', masked);
      setMaskedApiKey(masked);
      await ensureMainInitialized();
      showMainPage();
      void refreshRealProjectCosts(true);
      console.info('[api-key-storage] API key loaded from saved storage');
    } else {
      hasConfiguredApiKey = false;
      showLandingPage();
      localStorage.removeItem('church-masked-api-key');
      setMaskedApiKey('hidden');
      setStatusKey('status.apiKeyRequired');
    }
  } catch {
    hasConfiguredApiKey = false;
    showLandingPage();
    localStorage.removeItem('church-masked-api-key');
    setMaskedApiKey('hidden');
    setStatusKey('status.apiKeyLoadFailed');
  }
}

window.addEventListener('keydown', (event) => {
  const target = event.target as any;
  const isEditableTarget = Boolean(
    target && (
      target.tagName === 'INPUT'
      || target.tagName === 'TEXTAREA'
      || target.tagName === 'SELECT'
      || target.isContentEditable
    )
  );
  if (
    (event.key === 'Delete' || event.key === 'Backspace')
    && mainView === 'settings'
    && apiKeyModal.classList.contains('hidden')
    && scriptModal.classList.contains('hidden')
    && !isEditableTarget
  ) {
    event.preventDefault();
    setMainView('live');
    return;
  }
  if (event.key === 'Escape' && !apiKeyModal.classList.contains('hidden')) {
    setApiKeyModalVisible(false);
    return;
  }
  if (event.key === 'Escape' && !scriptModal.classList.contains('hidden')) {
    setScriptModalVisible(false);
    return;
  }
  if (event.key === 'Escape' && presentationMode) {
    setPresentationMode(false);
  }
});

window.addEventListener('resize', () => {
  if (!pairedLines.length) return;
  renderPanels(activePairLineId);
});

boot();
