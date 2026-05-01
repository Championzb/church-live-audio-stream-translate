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
const translationControlsSummaryEl = document.getElementById('translationControlsSummary') as any;
const languageAidsSummaryEl = document.getElementById('languageAidsSummary') as any;
const liveWorkspaceEl = document.getElementById('liveWorkspace') as any;
const translationLiveBarEl = document.getElementById('translationLiveBar') as any;
const liveExitTranslationModeButton = document.getElementById('liveExitTranslationMode') as any;
const liveToggleOutputWindowButton = document.getElementById('liveToggleOutputWindow') as any;
const liveOpenSettingsPageButton = document.getElementById('liveOpenSettingsPage') as any;
const liveAudioInputValueEl = document.getElementById('liveAudioInputValue') as any;
const liveAudioInputMenuEl = document.getElementById('liveAudioInputMenu') as any;
const liveAudioInputSelect = document.getElementById('liveAudioInput') as any;
const liveVadThresholdInput = document.getElementById('liveVadThreshold') as any;
const liveVadValueEl = document.getElementById('liveVadValue') as any;
const liveSilenceMsInput = document.getElementById('liveSilenceMs') as any;
const liveMaxSegmentMsInput = document.getElementById('liveMaxSegmentMs') as any;
const liveHotkeyF8El = document.getElementById('liveHotkeyF8') as any;
const liveHotkeyF7El = document.getElementById('liveHotkeyF7') as any;
const liveHotkeyF6El = document.getElementById('liveHotkeyF6') as any;
const liveHotkeyF4El = document.getElementById('liveHotkeyF4') as any;
const liveHotkeyF2El = document.getElementById('liveHotkeyF2') as any;
const liveHotkeyF1El = document.getElementById('liveHotkeyF1') as any;
const settingsPageEl = document.getElementById('settingsPage') as any;
const uiLanguageSelect = document.getElementById('uiLanguage') as any;
const themeSelect = document.getElementById('themeSelect') as any;
const mockModeInput = document.getElementById('mockMode') as any;
const tuneAudioInput = document.getElementById('tuneAudio') as any;
const audioInputValueEl = document.getElementById('audioInputValue') as any;
const audioInputMenuEl = document.getElementById('audioInputMenu') as any;
const audioInputSelect = document.getElementById('audioInput') as any;
const sourceLanguageSelect = document.getElementById('sourceLanguage') as any;
const targetLanguageSelect = document.getElementById('targetLanguage') as any;
const toggleRunButton = document.getElementById('toggleRun') as any;
const toggleWorshipModeButton = document.getElementById('toggleWorshipMode') as any;
const togglePresentationButton = document.getElementById('togglePresentation') as any;
const toggleHelpButton = document.getElementById('toggleHelp') as any;
const toggleLockControlsButton = document.getElementById('toggleLockControls') as any;
const toggleOutputWindowButton = document.getElementById('toggleOutputWindow') as any;
const openScriptManagerButton = document.getElementById('openScriptManager') as any;
const scriptPanelOpenScriptManagerButton = document.getElementById('scriptPanelOpenScriptManager') as any;
const testAudioFileInput = document.getElementById('testAudioFileInput') as any;
const uploadReferenceScriptButton = document.getElementById('uploadReferenceScript') as any;
const pasteReferenceScriptButton = document.getElementById('pasteReferenceScript') as any;
const referenceScriptInput = document.getElementById('referenceScriptInput') as any;
const clearReferenceScriptButton = document.getElementById('clearReferenceScript') as any;
const uploadSermonKeywordsButton = document.getElementById('uploadSermonKeywords') as any;
const pasteSermonKeywordsButton = document.getElementById('pasteSermonKeywords') as any;
const clearSermonKeywordsButton = document.getElementById('clearSermonKeywords') as any;
const sermonKeywordsInput = document.getElementById('sermonKeywordsInput') as any;
const sermonKeywordsMetaEl = document.getElementById('sermonKeywordsMeta') as any;
const sermonKeywordsListEl = document.getElementById('sermonKeywordsList') as any;
const scriptActionsLabelEl = document.getElementById('scriptActionsLabel') as any;
const keywordActionsLabelEl = document.getElementById('keywordActionsLabel') as any;
const labelSermonKeywordsListEl = document.getElementById('labelSermonKeywordsList') as any;
const scriptModal = document.getElementById('scriptModal') as any;
const scriptModalTitleEl = document.getElementById('scriptModalTitle') as any;
const scriptModalSubtitleEl = document.getElementById('scriptModalSubtitle') as any;
const closeScriptModalButton = document.getElementById('closeScriptModal') as any;
const resetSessionButton = document.getElementById('resetSession') as any;
const exportTranscriptButton = document.getElementById('exportTranscript') as any;
const exportTranscriptTranslatedButton = document.getElementById('exportTranscriptTranslated') as any;
const statusEl = document.getElementById('status') as any;
const statusToastEl = document.getElementById('statusToast') as any;
const modeSummaryEl = document.getElementById('modeSummary') as any;
const mockModeIndicatorEl = document.getElementById('mockModeIndicator') as any;
const projectorStatusIndicatorEl = document.getElementById('projectorStatusIndicator') as any;
const chipModeLabelEl = document.getElementById('chipModeLabel') as any;
const chipWorshipLabelEl = document.getElementById('chipWorshipLabel') as any;
const chipPresentationLabelEl = document.getElementById('chipPresentationLabel') as any;
const chipQueueLabelEl = document.getElementById('chipQueueLabel') as any;
const chipLockLabelEl = document.getElementById('chipLockLabel') as any;
const chipModeValueEl = document.getElementById('chipModeValue') as any;
const chipWorshipValueEl = document.getElementById('chipWorshipValue') as any;
const chipPresentationValueEl = document.getElementById('chipPresentationValue') as any;
const chipQueueValueEl = document.getElementById('chipQueueValue') as any;
const chipLockValueEl = document.getElementById('chipLockValue') as any;
const hintF8El = document.getElementById('hintF8') as any;
const hintF7El = document.getElementById('hintF7') as any;
const hintF6El = document.getElementById('hintF6') as any;
const hintF2El = document.getElementById('hintF2') as any;
const hintF1El = document.getElementById('hintF1') as any;
const windowMinimizeButton = document.getElementById('windowMinimize') as any;
const windowMaximizeButton = document.getElementById('windowMaximize') as any;
const windowCloseButton = document.getElementById('windowClose') as any;
const englishPanel = document.getElementById('englishPanel') as any;
const chinesePanel = document.getElementById('chinesePanel') as any;
const sourceCaptionCardEl = document.getElementById('sourceCaptionCard') as any;
const toggleSourcePanelHeaderButton = document.getElementById('toggleSourcePanelHeader') as any;
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
const sttKeywordsInput = document.getElementById('sttKeywords') as any;
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
const labelLiveAudioInputEl = document.getElementById('labelLiveAudioInput') as any;
const labelThemeEl = document.getElementById('labelTheme') as any;
const labelMockModeEl = document.getElementById('labelMockMode') as any;
const labelTuneAudioEl = document.getElementById('labelTuneAudio') as any;
const labelSourceLanguageEl = document.getElementById('labelSourceLanguage') as any;
const labelTargetLanguageEl = document.getElementById('labelTargetLanguage') as any;
const labelVadThresholdEl = document.getElementById('labelVadThreshold') as any;
const labelLiveVadThresholdEl = document.getElementById('labelLiveVadThreshold') as any;
const labelLiveSilenceMsEl = document.getElementById('labelLiveSilenceMs') as any;
const labelLiveMaxSegmentMsEl = document.getElementById('labelLiveMaxSegmentMs') as any;
const labelSilenceMsEl = document.getElementById('labelSilenceMs') as any;
const labelMaxSegmentMsEl = document.getElementById('labelMaxSegmentMs') as any;
const segmentationHelpToggleEl = document.getElementById('segmentationHelpToggle') as any;
const liveSegmentationHelpToggleEl = document.getElementById('liveSegmentationHelpToggle') as any;
const vadHelpTextEl = document.getElementById('vadHelpText') as any;
const silenceHelpTextEl = document.getElementById('silenceHelpText') as any;
const maxSegmentHelpTextEl = document.getElementById('maxSegmentHelpText') as any;
const liveVadHelpTextEl = document.getElementById('liveVadHelpText') as any;
const liveSilenceHelpTextEl = document.getElementById('liveSilenceHelpText') as any;
const liveMaxSegmentHelpTextEl = document.getElementById('liveMaxSegmentHelpText') as any;
const labelGlossaryEl = document.getElementById('labelGlossary') as any;
const labelSttKeywordsEl = document.getElementById('labelSttKeywords') as any;
const sttKeywordsHintEl = document.getElementById('sttKeywordsHint') as any;
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
const TEST_AUDIO_PICKER_VALUE = '__pick_test_audio_file__';
const TEST_AUDIO_INPUT_VALUE = '__test_audio_file__';
const SOURCE_PANEL_COLLAPSED_STORAGE_KEY = 'church-source-panel-collapsed';
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
let pendingSegmentEndedAtMs = 0;
let testStreamActive = false;
let selectedTestAudioFile: File | null = null;
let lastNonPickerAudioInputValue = '';
let lineSequence = 0;
let activePairLineId = 0;
let selectedPairLineId = 0;
let transcriptPanelsAutoPin = true;
let mockModeEnabled = false;
let tuneAudioEnabled = false;
let outputWindowOpen = false;
let outputWindowReady = false;
let lastOutputHeartbeatAt = 0;
let projectorStateTimerId = 0;
let outputBroadcastChannel: BroadcastChannel | null = null;
let sourcePanelCollapsed = true;

const PROJECTOR_STALE_MS = 7000;
const PROJECTOR_STATE_POLL_MS = 2500;
const OUTPUT_BROADCAST_CHANNEL_NAME = 'church-output-caption';

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
    'label.mockMode': 'Mock Mode (No API)',
    'label.tuneAudio': 'Tune Audio (Echo/Noise/Auto Gain)',
    'label.sourceLanguage': 'Source Language',
    'label.targetLanguage': 'Output Language',
    'label.vadThreshold': 'VAD Threshold',
    'label.silenceMs': 'Silence Hold (ms)',
    'label.maxSegmentMs': 'Max Segment (ms)',
    'help.vadThreshold': 'VAD Threshold: lower catches quieter speech but may trigger on noise.',
    'help.silenceMs': 'Silence Hold: how long silence must last before ending a segment.',
    'help.maxSegmentMs': 'Max Segment: hard cap on segment length for latency control.',
    'label.glossary': 'Glossary (one term per line, EN=ZH)',
    'label.sttKeywords': 'Stable STT Keywords (English terms, comma or newline separated)',
    'label.scriptActions': 'Script',
    'label.keywordActions': 'Keywords',
    'label.sermonKeywordsList': 'Loaded Keyword List',
    'hint.sttKeywords': 'Stable week-to-week speech-recognition priming. Sermon-specific keywords are managed in the Script modal.',
    'label.autoSaveOnStop': 'Auto-save on stop',
    'heading.english': 'English',
    'button.saveKey': 'Save Key',
    'button.refresh': 'Refresh',
    'button.start': 'Start (F8)',
    'button.stop': 'Stop (F8)',
    'button.startShort': 'Start',
    'button.stopShort': 'Stop',
    'button.worshipOn': 'Resume Translation (F7)',
    'button.worshipOff': 'Suspend Translation (F7)',
    'button.worshipOnShort': 'Resume',
    'button.worshipOffShort': 'Suspend',
    'button.presentationOn': 'Exit Translation Mode (F6)',
    'button.presentationOff': 'Translation Mode (F6)',
    'button.help': 'Help (F1)',
    'button.helpShort': 'Help',
    'button.lockOn': 'Unlock Controls (F2)',
    'button.lockOff': 'Lock Controls (F2)',
    'button.outputWindow': 'Projector Window',
    'button.scriptManager': 'Script',
    'button.uploadScript': 'Upload Script',
    'button.pasteScript': 'Paste Script',
    'button.clearScript': 'Clear Script',
    'button.uploadSermonKeywords': 'Upload Sermon Keywords',
    'button.pasteSermonKeywords': 'Paste Sermon Keywords',
    'button.clearSermonKeywords': 'Clear Sermon Keywords',
    'button.resetSession': 'Reset Session (F4)',
    'button.resetSessionShort': 'Reset',
    'button.copyLine': 'Copy line',
    'button.exportTranscript': 'Export Transcript',
    'button.saveGlossary': 'Save Glossary',
    'button.saveLanguageAids': 'Save Language Aids',
    'button.import': 'Import',
    'button.export': 'Export',
    'button.close': 'Close',
    'button.cancel': 'Cancel',
    'button.settings': 'Settings',
    'button.back': 'Back',
    'heading.settings': 'Settings',
    'heading.appearance': 'Appearance',
    'heading.translationControls': 'Translation Controls',
    'heading.languageAids': 'Language Aids',
    'heading.referenceScript': 'Reference Script',
    'apiKey.masked': 'OpenAI Key: {masked}',
    'apiKey.hidden': 'OpenAI Key: hidden',
    'modal.apiKeyTitle': 'Update OpenAI API Key',
    'modal.apiKeySubtitle': 'Enter API/Admin key or update project ID, then save.',
    'modal.scriptTitle': 'Reference Script',
    'modal.scriptSubtitle': 'Upload or paste script text and sermon keywords, then clear when needed.',
    'tooltip.saveKey': 'Save API key to secure OS storage (Keychain/Credential Manager).',
    'tooltip.refresh': 'Refresh and re-detect available audio input devices.',
    'tooltip.start': 'Start live capture and translation (F8).',
    'tooltip.stop': 'Stop live capture and translation (F8).',
    'tooltip.worshipOn': 'Translation is suspended. Click to resume translation (F7).',
    'tooltip.worshipOff': 'Translation is active. Click to suspend translation without stopping capture (F7).',
    'tooltip.presentationOn': 'Exit translation mode and return to standard layout (F6 or Esc).',
    'tooltip.presentationOff': 'Enter translation mode with a larger subtitle-focused layout (F6).',
    'tooltip.help': 'Show or hide the hotkey/help overlay.',
    'tooltip.lockOn': 'Unlock configuration controls to allow editing (F2).',
    'tooltip.lockOff': 'Lock configuration controls to avoid accidental changes (F2).',
    'tooltip.outputWindow': 'Open or close the subtitle-only projector window for a second screen.',
    'tooltip.settings': 'Open settings page.',
    'tooltip.back': 'Return to live translation view.',
    'tooltip.scriptManager': 'Open script tools (upload, paste, clear).',
    'tooltip.uploadScript': 'Upload target-language script text to guide translation and display in translation mode.',
    'tooltip.pasteScript': 'Paste target-language script text directly from clipboard.',
    'tooltip.clearScript': 'Clear the uploaded reference script from this session.',
    'tooltip.uploadSermonKeywords': 'Upload a sermon-specific keyword list for STT priming.',
    'tooltip.pasteSermonKeywords': 'Paste a sermon-specific keyword list from clipboard.',
    'tooltip.clearSermonKeywords': 'Clear sermon-specific STT keywords.',
    'tooltip.resetSession': 'Reset queue, captions, transcript, and cost/session counters (F4).',
    'tooltip.copyLine': 'Copy this caption line.',
    'tooltip.exportTranscript': 'Export the current transcript entries to a text file.',
    'tooltip.saveGlossary': 'Save current glossary text for translation prompts.',
    'tooltip.import': 'Import glossary content from a text file.',
    'tooltip.export': 'Export glossary content to a text file.',
    'tooltip.close': 'Close the help panel.',
    'tooltip.copyKey': 'Copy this key value to clipboard.',
    'tooltip.segmentationHelp': 'Show or hide quick explanations for VAD Threshold, Silence Hold, and Max Segment.',
    'tooltip.vadThreshold': 'Audio level needed to count as speech. Lower is more sensitive; higher filters noise more aggressively.',
    'tooltip.silenceMs': 'How long silence must continue before the app closes the current segment.',
    'tooltip.maxSegmentMs': 'Maximum segment duration before force-splitting, even if speech continues.',
    'tooltip.sourcePanelExpand': 'Expand source transcript panel.',
    'tooltip.sourcePanelCollapse': 'Collapse source transcript panel.',
    'button.sourcePanel': 'Source',
    'help.title': 'Quick Controls',
    'help.f8': '<strong>F8</strong>: Start/Stop translation',
    'help.f7': '<strong>F7</strong>: Suspend/Resume translation',
    'help.f6': '<strong>F6</strong>: Toggle translation mode',
    'help.f2': '<strong>F2</strong>: Lock/unlock config controls',
    'help.f4': '<strong>F4</strong>: Reset captions + transcript + queue',
    'help.f1': '<strong>F1</strong>: Toggle this help panel',
    'chip.mode': 'Status',
    'chip.worship': 'Translation',
    'chip.translation': 'Translation',
    'chip.queue': 'Queue',
    'chip.controls': 'Controls',
    'meta.delay': 'Delay',
    'chip.locked': 'Locked',
    'chip.unlocked': 'Unlocked',
    'hint.f8.start': 'Start',
    'hint.f8.stop': 'Stop',
    'hint.f7.suspend': 'Suspend',
    'hint.f7.resume': 'Resume',
    'hint.f6.enter': 'Translation Mode',
    'hint.f6.exit': 'Exit Mode',
    'hint.f2.lock': 'Lock',
    'hint.f2.unlock': 'Unlock',
    'hint.f1.open': 'Help',
    'hint.f1.close': 'Close Help',
    'status.idle': 'Idle',
    'status.controlsLocked': 'Config controls locked',
    'status.controlsUnlocked': 'Config controls unlocked',
    'status.worshipEnabled': 'Translation suspended',
    'status.worshipDisabledRunning': 'Translation resumed',
    'status.worshipDisabled': 'Translation state reset',
    'status.sessionReset': 'Session reset: captions, transcript, and queue cleared',
    'status.retryingSegment': 'Retrying segment ({attempt}/{max})...',
    'status.testingFile': 'Testing file: {name}',
    'status.fileTestFinished': 'Finished file test: {name}',
    'status.fileTestFailed': 'File test failed: {error}',
    'status.testAudioSelected': 'Test audio input selected: {name}. Press Start (F8) to run.',
    'status.testAudioMissing': 'Select a test audio file before pressing Start (F8).',
    'status.testAudioPickerBlocked': 'Unable to open test audio file picker. Please retry and check file access permissions.',
    'status.scriptLoaded': 'Reference script loaded: {lines} lines',
    'status.scriptLoadFailed': 'Failed to load script file: {error}',
    'status.scriptPasted': 'Reference script pasted: {lines} lines',
    'status.scriptPasteFailed': 'Failed to paste script from clipboard: {error}',
    'status.scriptClipboardEmpty': 'Clipboard has no script text',
    'status.scriptCleared': 'Reference script cleared',
    'status.sermonKeywordsLoaded': 'Sermon keywords loaded: {terms} terms',
    'status.sermonKeywordsLoadFailed': 'Failed to load sermon keywords file: {error}',
    'status.sermonKeywordsPasted': 'Sermon keywords pasted: {terms} terms',
    'status.sermonKeywordsPasteFailed': 'Failed to paste sermon keywords from clipboard: {error}',
    'status.sermonKeywordsClipboardEmpty': 'Clipboard has no sermon keywords text',
    'status.sermonKeywordsCleared': 'Sermon keywords cleared',
    'status.noSermonKeywordsToClear': 'No sermon keywords are loaded',
    'sermonKeywords.metaNone': 'No sermon keywords loaded.',
    'sermonKeywords.metaLoaded': 'Sermon keywords loaded: {terms} terms',
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
    'status.audioTuningEnabled': 'Audio tuning enabled (echo cancellation, noise suppression, auto gain)',
    'status.audioTuningDisabled': 'Audio tuning disabled (raw microphone capture)',
    'status.apiKeyFailed': 'Failed to configure API key',
    'status.apiKeyRequired': 'Enter your OpenAI API key to continue',
    'status.glossarySaved': 'Glossary saved',
    'status.languageAidsSaved': 'Language aids saved',
    'status.glossaryImported': 'Glossary imported',
    'status.glossaryImportCanceled': 'Glossary import canceled',
    'status.glossaryExported': 'Glossary exported: {path}',
    'status.glossaryExportCanceled': 'Glossary export canceled',
    'status.sourceSet': 'Source language set to {source}',
    'status.outputSet': 'Output language set to {target}',
    'status.outputWindowToggled': 'Toggled projector window',
    'status.outputWindowError': 'Projector window error: {error}',
    'status.lineCopied': 'Caption line copied',
    'status.clipboardDenied': 'Clipboard permission denied',
    'status.transcriptExported': 'Transcript exported: {path}',
    'status.transcriptExportFailed': 'Transcript export failed',
    'status.apiKeyLoaded': 'API key loaded from secure storage',
    'status.apiKeyLoadFailed': 'Saved API key could not be loaded from secure storage',
    'status.listening': 'Listening...',
    'status.translating': 'Translating...',
    'status.warning': 'Warning: {warning}',
    'status.mockModeEnabled': 'Mock mode enabled: local fake translation is active',
    'status.mockModeDisabled': 'Mock mode disabled: real API translation restored',
    'script.empty': 'No reference script loaded. Upload target-language script before translation for quick reference in translation mode.',
    'script.metaNone': 'No reference script loaded.',
    'script.metaLoaded': 'Loaded script: {lines} lines',
    'mode.running': 'running',
    'mode.stopped': 'stopped',
    'mode.active': 'active',
    'mode.suspended': 'suspended',
    'mode.on': 'on',
    'mode.off': 'off',
    'mode.queueProcessing': 'processing',
    'mode.mockBadge': 'Mock Mode',
    'projector.state.off': 'Projector: Off',
    'projector.state.waiting': 'Projector: Waiting',
    'projector.state.connected': 'Projector: Connected',
    'projector.state.stale': 'Projector: Stale',
    'mode.summary':
      'Status: {mode} | Translation: {translation} | Translation Mode: {presentation} | Queue: {queue}',
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
    'device.testAudioPicker': 'Test Audio File...',
    'device.input': 'Input {index}',
    'device.testAudioInput': 'Test Audio: {name}'
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
    'label.mockMode': '模拟模式（不调用 API）',
    'label.tuneAudio': '音频调优（回声/降噪/自动增益）',
    'label.sourceLanguage': '源语言',
    'label.targetLanguage': '输出语言',
    'label.vadThreshold': 'VAD 阈值',
    'label.silenceMs': '静音保持（毫秒）',
    'label.maxSegmentMs': '最长片段（毫秒）',
    'help.vadThreshold': 'VAD 阈值：越低越容易捕捉轻声，也更可能被噪声触发。',
    'help.silenceMs': '静音保持：静音持续多久后才结束当前片段。',
    'help.maxSegmentMs': '最长片段：即使一直在说话，超过该时长也会强制切段。',
    'label.glossary': '术语表（每行一个，EN=ZH）',
    'label.sttKeywords': '稳定 STT 关键词（英文术语，逗号或换行分隔）',
    'label.scriptActions': '讲稿',
    'label.keywordActions': '关键词',
    'label.sermonKeywordsList': '已加载关键词列表',
    'hint.sttKeywords': '用于每周稳定语音识别预热。讲道专用关键词请在讲稿面板中管理。',
    'label.autoSaveOnStop': '停止时自动保存',
    'heading.english': '英文',
    'button.saveKey': '保存密钥',
    'button.refresh': '刷新',
    'button.start': '开始（F8）',
    'button.stop': '停止（F8）',
    'button.startShort': '开始',
    'button.stopShort': '停止',
    'button.worshipOn': '恢复翻译（F7）',
    'button.worshipOff': '暂停翻译（F7）',
    'button.worshipOnShort': '恢复',
    'button.worshipOffShort': '暂停',
    'button.presentationOn': '退出翻译模式（F6）',
    'button.presentationOff': '翻译模式（F6）',
    'button.help': '帮助（F1）',
    'button.helpShort': '帮助',
    'button.lockOn': '解锁控制项（F2）',
    'button.lockOff': '锁定控制项（F2）',
    'button.outputWindow': '投影窗口',
    'button.scriptManager': '讲稿',
    'button.uploadScript': '上传讲稿',
    'button.pasteScript': '粘贴讲稿',
    'button.clearScript': '清除讲稿',
    'button.uploadSermonKeywords': '上传讲道关键词',
    'button.pasteSermonKeywords': '粘贴讲道关键词',
    'button.clearSermonKeywords': '清除讲道关键词',
    'button.resetSession': '重置会话（F4）',
    'button.resetSessionShort': '重置',
    'button.copyLine': '复制本行',
    'button.exportTranscript': '导出转录',
    'button.saveGlossary': '保存术语表',
    'button.saveLanguageAids': '保存语言辅助',
    'button.import': '导入',
    'button.export': '导出',
    'button.close': '关闭',
    'button.cancel': '取消',
    'button.settings': '设置',
    'button.back': '返回',
    'heading.settings': '设置',
    'heading.appearance': '外观',
    'heading.translationControls': '翻译控制',
    'heading.languageAids': '语言辅助',
    'heading.referenceScript': '参考讲稿',
    'apiKey.masked': 'OpenAI 密钥：{masked}',
    'apiKey.hidden': 'OpenAI 密钥：隐藏',
    'modal.apiKeyTitle': '更新 OpenAI API 密钥',
    'modal.apiKeySubtitle': '输入 API/管理员密钥或更新 Project ID，然后保存。',
    'modal.scriptTitle': '参考讲稿',
    'modal.scriptSubtitle': '可上传或粘贴讲稿文本与讲道关键词，需要时可清除。',
    'tooltip.saveKey': '将 API 密钥保存到系统安全存储（钥匙串/凭据管理器）。',
    'tooltip.refresh': '刷新并重新检测可用音频输入设备。',
    'tooltip.start': '开始实时采集和翻译（F8）。',
    'tooltip.stop': '停止实时采集和翻译（F8）。',
    'tooltip.worshipOn': '翻译已暂停。点击恢复翻译（F7）。',
    'tooltip.worshipOff': '翻译进行中。点击暂停翻译且不停止采集（F7）。',
    'tooltip.presentationOn': '退出翻译模式并返回标准布局（F6 或 Esc）。',
    'tooltip.presentationOff': '进入翻译模式并使用更大的字幕布局（F6）。',
    'tooltip.help': '显示或隐藏快捷键帮助面板。',
    'tooltip.lockOn': '解锁配置控件以允许修改（F2）。',
    'tooltip.lockOff': '锁定配置控件，避免误操作（F2）。',
    'tooltip.outputWindow': '打开或关闭仅字幕投影窗口（用于第二屏）。',
    'tooltip.settings': '打开设置页面。',
    'tooltip.back': '返回实时翻译页面。',
    'tooltip.scriptManager': '打开讲稿工具（上传、粘贴、清除）。',
    'tooltip.uploadScript': '上传目标语言讲稿文本，用于辅助翻译并在翻译模式中滚动查看。',
    'tooltip.pasteScript': '从剪贴板直接粘贴目标语言讲稿文本。',
    'tooltip.clearScript': '清除当前会话中的参考讲稿。',
    'tooltip.uploadSermonKeywords': '上传用于 STT 预热的讲道专用关键词列表。',
    'tooltip.pasteSermonKeywords': '从剪贴板粘贴讲道专用关键词列表。',
    'tooltip.clearSermonKeywords': '清除讲道专用 STT 关键词。',
    'tooltip.resetSession': '重置队列、字幕、转录以及会话/费用计数（F4）。',
    'tooltip.copyLine': '复制这一行字幕。',
    'tooltip.exportTranscript': '将当前转录条目导出为文本文件。',
    'tooltip.saveGlossary': '保存当前术语表内容用于翻译提示。',
    'tooltip.import': '从文本文件导入术语表。',
    'tooltip.export': '将术语表导出到文本文件。',
    'tooltip.close': '关闭帮助面板。',
    'tooltip.copyKey': '复制该密钥到剪贴板。',
    'tooltip.segmentationHelp': '显示或隐藏 VAD 阈值、静音保持和最长片段的快速说明。',
    'tooltip.vadThreshold': '判定为语音所需的音量能量。值越低越敏感；值越高越能更积极过滤噪声。',
    'tooltip.silenceMs': '静音持续达到该时长后，应用会结束当前语音片段。',
    'tooltip.maxSegmentMs': '片段最大时长。即使持续说话，到达该时长也会强制切分。',
    'tooltip.sourcePanelExpand': '展开源语言转录面板。',
    'tooltip.sourcePanelCollapse': '收起源语言转录面板。',
    'button.sourcePanel': '源文',
    'help.title': '快捷控制',
    'help.f8': '<strong>F8</strong>：开始/停止翻译',
    'help.f7': '<strong>F7</strong>：暂停/恢复翻译',
    'help.f6': '<strong>F6</strong>：切换翻译模式',
    'help.f2': '<strong>F2</strong>：锁定/解锁配置',
    'help.f4': '<strong>F4</strong>：重置字幕 + 转录 + 队列',
    'help.f1': '<strong>F1</strong>：切换帮助面板',
    'chip.mode': '状态',
    'chip.worship': '翻译',
    'chip.translation': '翻译',
    'chip.queue': '队列',
    'chip.controls': '控制',
    'meta.delay': '延迟',
    'chip.locked': '已锁定',
    'chip.unlocked': '未锁定',
    'hint.f8.start': '开始',
    'hint.f8.stop': '停止',
    'hint.f7.suspend': '暂停',
    'hint.f7.resume': '恢复',
    'hint.f6.enter': '翻译模式',
    'hint.f6.exit': '退出模式',
    'hint.f2.lock': '锁定',
    'hint.f2.unlock': '解锁',
    'hint.f1.open': '帮助',
    'hint.f1.close': '关闭帮助',
    'status.idle': '空闲',
    'status.controlsLocked': '配置控件已锁定',
    'status.controlsUnlocked': '配置控件已解锁',
    'status.worshipEnabled': '翻译已暂停',
    'status.worshipDisabledRunning': '翻译已恢复',
    'status.worshipDisabled': '翻译状态已重置',
    'status.sessionReset': '会话已重置：字幕、转录和队列已清空',
    'status.retryingSegment': '正在重试片段（{attempt}/{max}）...',
    'status.testingFile': '正在测试文件：{name}',
    'status.fileTestFinished': '文件测试完成：{name}',
    'status.fileTestFailed': '文件测试失败：{error}',
    'status.testAudioSelected': '测试音频输入已选择：{name}。按开始（F8）运行。',
    'status.testAudioMissing': '请先选择测试音频文件，再按开始（F8）。',
    'status.testAudioPickerBlocked': '无法打开测试音频文件选择器。请重试并检查文件访问权限。',
    'status.scriptLoaded': '参考讲稿已加载：{lines} 行',
    'status.scriptLoadFailed': '加载讲稿文件失败：{error}',
    'status.scriptPasted': '参考讲稿已粘贴：{lines} 行',
    'status.scriptPasteFailed': '从剪贴板粘贴讲稿失败：{error}',
    'status.scriptClipboardEmpty': '剪贴板中没有可用讲稿文本',
    'status.scriptCleared': '参考讲稿已清除',
    'status.sermonKeywordsLoaded': '讲道关键词已加载：{terms} 个',
    'status.sermonKeywordsLoadFailed': '加载讲道关键词文件失败：{error}',
    'status.sermonKeywordsPasted': '讲道关键词已粘贴：{terms} 个',
    'status.sermonKeywordsPasteFailed': '从剪贴板粘贴讲道关键词失败：{error}',
    'status.sermonKeywordsClipboardEmpty': '剪贴板中没有讲道关键词文本',
    'status.sermonKeywordsCleared': '讲道关键词已清除',
    'status.noSermonKeywordsToClear': '当前未加载讲道关键词',
    'sermonKeywords.metaNone': '未加载讲道关键词。',
    'sermonKeywords.metaLoaded': '已加载讲道关键词：{terms} 个',
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
    'status.audioTuningEnabled': '已启用音频调优（回声消除、降噪、自动增益）',
    'status.audioTuningDisabled': '已关闭音频调优（原始麦克风采集）',
    'status.apiKeyFailed': '配置 API 密钥失败',
    'status.apiKeyRequired': '请输入 OpenAI API 密钥后继续',
    'status.glossarySaved': '术语表已保存',
    'status.languageAidsSaved': '语言辅助已保存',
    'status.glossaryImported': '术语表已导入',
    'status.glossaryImportCanceled': '已取消术语表导入',
    'status.glossaryExported': '术语表已导出：{path}',
    'status.glossaryExportCanceled': '已取消术语表导出',
    'status.sourceSet': '源语言已设置为 {source}',
    'status.outputSet': '输出语言已设置为 {target}',
    'status.outputWindowToggled': '已切换投影窗口',
    'status.outputWindowError': '投影窗口错误：{error}',
    'status.lineCopied': '已复制字幕行',
    'status.clipboardDenied': '剪贴板权限被拒绝',
    'status.transcriptExported': '转录已导出：{path}',
    'status.transcriptExportFailed': '转录导出失败',
    'status.apiKeyLoaded': '已从安全存储加载 API 密钥',
    'status.apiKeyLoadFailed': '无法从安全存储加载已保存的 API 密钥',
    'status.listening': '正在聆听...',
    'status.translating': '正在翻译...',
    'status.warning': '警告：{warning}',
    'status.mockModeEnabled': '模拟模式已开启：使用本地假翻译',
    'status.mockModeDisabled': '模拟模式已关闭：恢复真实 API 翻译',
    'script.empty': '尚未加载参考讲稿。建议在翻译前上传目标语言讲稿，便于翻译模式中随时查看。',
    'script.metaNone': '尚未加载参考讲稿。',
    'script.metaLoaded': '已加载讲稿：{lines} 行',
    'mode.running': '运行中',
    'mode.stopped': '已停止',
    'mode.active': '进行中',
    'mode.suspended': '已暂停',
    'mode.on': '开',
    'mode.off': '关',
    'mode.queueProcessing': '处理中',
    'mode.mockBadge': '模拟模式',
    'projector.state.off': '投影：关闭',
    'projector.state.waiting': '投影：等待中',
    'projector.state.connected': '投影：已连接',
    'projector.state.stale': '投影：无响应',
    'mode.summary':
      '状态：{mode} | 翻译：{translation} | 翻译模式：{presentation} | 队列：{queue}',
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
    'device.testAudioPicker': '测试音频文件...',
    'device.input': '输入 {index}',
    'device.testAudioInput': '测试音频：{name}'
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
const MOCK_MODE_STORAGE_KEY = 'church-mock-mode';
const OUTPUT_SNAPSHOT_STORAGE_KEY = 'church-output-latest-snapshot';
const REAL_COST_REFRESH_MS = 5 * 60 * 1000;
const DEFAULT_TUNE_AUDIO_ENABLED = true;
const DEFAULT_VAD_THRESHOLD = 0.05;
const DEFAULT_SILENCE_MS = 1900;
const DEFAULT_MAX_SEGMENT_MS = 12000;
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
let sermonKeywordsText = '';

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

function bindMainTitlebarDragFallback() {
  const titlebar = document.querySelector('.titlebar-actions');
  if (!(titlebar instanceof HTMLElement)) return;
  const isNoDragTarget = (target: EventTarget | null) => {
    if (!(target instanceof Element)) return false;
    return Boolean(target.closest('button, input, select, textarea, [role="button"], [data-no-drag], .control-pill, .audio-input-menu'));
  };
  titlebar.addEventListener('pointerdown', async (event) => {
    if (event.button !== 0) return;
    if (event.detail > 1) return;
    if (isNoDragTarget(event.target)) return;
    try {
      await invoke('start_dragging_window');
    } catch {
      // keep native drag-region behavior as fallback
    }
  });
}

function bindWindowControls() {
  const runWindowAction = async (action) => {
    try {
      await invoke('control_window', { action });
    } catch {
      // Ignore control errors on unsupported platforms.
    }
  };
  if (windowMinimizeButton) {
    windowMinimizeButton.addEventListener('click', () => {
      void runWindowAction('minimize');
    });
  }
  if (windowMaximizeButton) {
    windowMaximizeButton.addEventListener('click', () => {
      void runWindowAction('toggle_maximize');
    });
  }
  if (windowCloseButton) {
    windowCloseButton.addEventListener('click', () => {
      void runWindowAction('close');
    });
  }
}

function languageName(code) {
  const labels = LANGUAGE_DISPLAY[uiLanguage] || LANGUAGE_DISPLAY.en;
  return labels[code] || code;
}

function countScriptLines(content) {
  if (!content) return 0;
  return content.split(/\r?\n/).filter((line) => line.trim().length > 0).length;
}

function countKeywordTerms(content: string) {
  if (!content) return 0;
  const tokens = content
    .split(/[\n,;]+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 0);
  return tokens.length;
}

function formatKeywordList(content: string) {
  if (!content) return t('sermonKeywords.metaNone');
  const tokens = content
    .split(/[\n,;]+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 0);
  if (!tokens.length) return t('sermonKeywords.metaNone');
  return tokens.join('\n');
}

function updateSermonKeywordsUi() {
  const hasKeywords = Boolean(sermonKeywordsText.trim());
  const terms = countKeywordTerms(sermonKeywordsText);
  const metaText = hasKeywords
    ? t('sermonKeywords.metaLoaded', { terms })
    : t('sermonKeywords.metaNone');
  sermonKeywordsMetaEl.textContent = metaText;
  sermonKeywordsListEl.textContent = formatKeywordList(sermonKeywordsText);
  clearSermonKeywordsButton.disabled = controlsLocked || !hasKeywords;
}

function setSermonKeywords(rawKeywordsText) {
  sermonKeywordsText = String(rawKeywordsText || '').replace(/\r\n/g, '\n').trim();
  updateSermonKeywordsUi();
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
  const translationState = !running
    ? t('mode.stopped')
    : worshipMode
      ? t('mode.suspended')
      : t('mode.active');
  const summaryText = t('mode.summary', {
    mode: running ? t('mode.running') : t('mode.stopped'),
    translation: translationState,
    presentation: presentationMode ? t('mode.on') : t('mode.off'),
    queue: queueText
  });
  modeSummaryEl.textContent = summaryText;
  chipModeValueEl.textContent = running ? t('mode.running') : t('mode.stopped');
  chipModeValueEl.dataset.state = running ? 'running' : 'stopped';
  chipWorshipValueEl.textContent = translationState;
  chipWorshipValueEl.dataset.state = !running ? 'stopped' : worshipMode ? 'suspended' : 'running';
  chipPresentationValueEl.textContent = presentationMode ? t('mode.on') : t('mode.off');
  chipPresentationValueEl.dataset.state = presentationMode ? 'on' : 'off';
  chipQueueValueEl.textContent = queueText;
  chipQueueValueEl.dataset.state = segmentQueueRunning ? 'processing' : 'idle';
  chipLockValueEl.textContent = controlsLocked ? t('chip.locked') : t('chip.unlocked');
  chipLockValueEl.dataset.state = controlsLocked ? 'locked' : 'unlocked';
  updateMockModeIndicator();
  updateProjectorIndicator();
  syncOutputWindow();
}

function updateMockModeIndicator() {
  if (!mockModeIndicatorEl) {
    return;
  }
  mockModeIndicatorEl.textContent = t('mode.mockBadge');
  mockModeIndicatorEl.classList.toggle('hidden', !mockModeEnabled);
}

function projectorStateKey() {
  if (!outputWindowOpen) return 'off';
  if (!outputWindowReady) return 'waiting';
  return Date.now() - lastOutputHeartbeatAt > PROJECTOR_STALE_MS ? 'stale' : 'connected';
}

function updateProjectorIndicator() {
  if (!projectorStatusIndicatorEl) return;
  const state = projectorStateKey();
  projectorStatusIndicatorEl.dataset.state = state;
  projectorStatusIndicatorEl.textContent = t(`projector.state.${state}`);
}

function getOutputBroadcastChannel() {
  if (outputBroadcastChannel) {
    return outputBroadcastChannel;
  }
  try {
    outputBroadcastChannel = new BroadcastChannel(OUTPUT_BROADCAST_CHANNEL_NAME);
  } catch {
    outputBroadcastChannel = null;
  }
  return outputBroadcastChannel;
}

async function refreshProjectorOpenState() {
  try {
    const openNow = Boolean(await invoke('is_output_window_open'));
    outputWindowOpen = openNow;
    if (!openNow) {
      outputWindowReady = false;
      lastOutputHeartbeatAt = 0;
    }
    updateProjectorIndicator();
  } catch {
    // keep last known state
  }
}

function setHelpVisible(nextVisible) {
  helpVisible = Boolean(nextVisible);
  helpOverlay.classList.toggle('hidden', !helpVisible);
  updateHotkeyPills();
}

function setSourcePanelCollapsed(collapsed: boolean, options: { persist?: boolean } = {}) {
  sourcePanelCollapsed = Boolean(collapsed);
  const appliedCollapsed = presentationMode && sourcePanelCollapsed;
  document.body.classList.toggle('source-panel-collapsed', appliedCollapsed);
  sourceCaptionCardEl.classList.toggle('is-collapsed', appliedCollapsed);
  if (toggleSourcePanelHeaderButton) {
    toggleSourcePanelHeaderButton.textContent = t('button.sourcePanel');
    toggleSourcePanelHeaderButton.title = appliedCollapsed
      ? t('tooltip.sourcePanelExpand')
      : t('tooltip.sourcePanelCollapse');
    toggleSourcePanelHeaderButton.setAttribute(
      'aria-label',
      appliedCollapsed ? t('tooltip.sourcePanelExpand') : t('tooltip.sourcePanelCollapse')
    );
    toggleSourcePanelHeaderButton.setAttribute('aria-expanded', appliedCollapsed ? 'false' : 'true');
    toggleSourcePanelHeaderButton.disabled = !presentationMode;
    toggleSourcePanelHeaderButton.classList.toggle('is-active', !appliedCollapsed);
  }
  if (options.persist !== false) {
    localStorage.setItem(SOURCE_PANEL_COLLAPSED_STORAGE_KEY, sourcePanelCollapsed ? '1' : '0');
  }
}

function setControlsLocked(nextLocked) {
  controlsLocked = Boolean(nextLocked);
  if (toggleLockControlsButton) {
    toggleLockControlsButton.textContent = controlsLocked ? t('button.lockOn') : t('button.lockOff');
    toggleLockControlsButton.title = controlsLocked ? t('tooltip.lockOn') : t('tooltip.lockOff');
  }

  const lockTargets = [
    maskedApiKeyEl,
    openSettingsPageButton,
    liveOpenSettingsPageButton,
    backToLivePageButton,
    audioInputSelect,
    liveAudioInputSelect,
    themeSelect,
    mockModeInput,
    tuneAudioInput,
    sourceLanguageSelect,
    targetLanguageSelect,
    openScriptManagerButton,
    scriptPanelOpenScriptManagerButton,
    uploadReferenceScriptButton,
    pasteReferenceScriptButton,
    uploadSermonKeywordsButton,
    pasteSermonKeywordsButton,
    vadThresholdInput,
    liveVadThresholdInput,
    silenceMsInput,
    liveSilenceMsInput,
    maxSegmentMsInput,
    liveMaxSegmentMsInput,
    glossaryInput,
    sttKeywordsInput,
    saveGlossaryButton,
    importGlossaryButton,
    exportGlossaryButton,
    autoSaveOnStopInput,
    clearSermonKeywordsButton
  ];

  lockTargets.forEach((element) => {
    element.disabled = controlsLocked;
  });

  localStorage.setItem('church-controls-locked', controlsLocked ? '1' : '0');
  updateReferenceScriptUi();
  updateSermonKeywordsUi();
  setStatusKey(controlsLocked ? 'status.controlsLocked' : 'status.controlsUnlocked');
  updateHotkeyPills();
  updateModeSummary();
}

function hasSelectOption(selectEl: any, value: string) {
  return Array.from(selectEl?.options || []).some((option: any) => option.value === value);
}

function getSelectedAudioInputLabel(selectEl: any) {
  const selectedOption = selectEl?.selectedOptions?.[0] || null;
  if (!selectedOption) return t('device.default');
  return selectedOption.textContent || t('device.default');
}

function syncAudioInputMenuSizes() {
  const optionCount = Math.max(2, Math.min(6, (audioInputSelect?.options?.length || 0)));
  if (audioInputSelect) {
    audioInputSelect.size = optionCount;
  }
  if (liveAudioInputSelect) {
    liveAudioInputSelect.size = optionCount;
  }
}

function updateAudioInputDisplayValues() {
  const displayText = getSelectedAudioInputLabel(audioInputSelect);
  if (audioInputValueEl) {
    audioInputValueEl.textContent = displayText;
  }
  if (liveAudioInputValueEl) {
    liveAudioInputValueEl.textContent = displayText;
  }
}

function setAudioInputMenuOpen(mode: 'main' | 'live', open: boolean) {
  const targetMenu = mode === 'live' ? liveAudioInputMenuEl : audioInputMenuEl;
  const otherMenu = mode === 'live' ? audioInputMenuEl : liveAudioInputMenuEl;
  if (otherMenu) {
    otherMenu.classList.add('hidden');
  }
  if (!targetMenu) return;
  targetMenu.classList.toggle('hidden', !open);
}

function closeAudioInputMenus() {
  setAudioInputMenuOpen('main', false);
  setAudioInputMenuOpen('live', false);
}

function syncLiveAudioInputMirror() {
  if (!liveAudioInputSelect) return;
  liveAudioInputSelect.innerHTML = audioInputSelect.innerHTML;
  const selectedValue = audioInputSelect.value || '';
  if (selectedValue && hasSelectOption(liveAudioInputSelect, selectedValue)) {
    liveAudioInputSelect.value = selectedValue;
    updateAudioInputDisplayValues();
    return;
  }
  liveAudioInputSelect.value = '';
  updateAudioInputDisplayValues();
  syncAudioInputMenuSizes();
}

function setAudioInputSelection(selectedValue: string) {
  const nextValue = selectedValue || '';
  if (nextValue && hasSelectOption(audioInputSelect, nextValue)) {
    audioInputSelect.value = nextValue;
  } else {
    audioInputSelect.value = '';
  }
  if (audioInputSelect.value && audioInputSelect.value !== TEST_AUDIO_PICKER_VALUE) {
    lastNonPickerAudioInputValue = audioInputSelect.value;
  }
  syncLiveAudioInputMirror();
  updateAudioInputDisplayValues();
}

function handleAudioInputSelection(selectedValue: string) {
  const nextValue = selectedValue || '';
  if (nextValue === TEST_AUDIO_PICKER_VALUE) {
    openTestAudioFilePicker(lastNonPickerAudioInputValue || '');
    syncLiveAudioInputMirror();
    updateAudioInputDisplayValues();
    return;
  }
  setAudioInputSelection(nextValue);
}

function setRunningButtonState() {
  if (running) {
    if (toggleRunButton) {
      toggleRunButton.textContent = t('button.stop');
      toggleRunButton.classList.add('stop');
      toggleRunButton.classList.remove('run');
    }
  } else {
    if (toggleRunButton) {
      toggleRunButton.textContent = t('button.start');
      toggleRunButton.classList.add('run');
      toggleRunButton.classList.remove('stop');
    }
  }
  if (toggleRunButton) {
    toggleRunButton.title = running ? t('tooltip.stop') : t('tooltip.start');
  }
  setSuspendButtonState();
}

function setSuspendButtonState() {
  if (toggleWorshipModeButton) {
    toggleWorshipModeButton.textContent = worshipMode ? t('button.worshipOn') : t('button.worshipOff');
  }
  if (toggleWorshipModeButton) {
    toggleWorshipModeButton.title = worshipMode ? t('tooltip.worshipOn') : t('tooltip.worshipOff');
  }
  const canToggleSuspend = running || worshipMode;
  if (toggleWorshipModeButton) {
    toggleWorshipModeButton.disabled = !canToggleSuspend;
  }
  updateHotkeyPills();
}

function setHotkeyPill(button: any, hotkey: string, label: string, options: any = {}) {
  button.innerHTML = `<kbd>${hotkey}</kbd> ${label}`;
  button.title = options.title || '';
  button.disabled = Boolean(options.disabled);
  button.classList.toggle('is-active', Boolean(options.active));
  button.dataset.state = options.state || '';
  if (typeof options.pressed === 'boolean') {
    button.setAttribute('aria-pressed', options.pressed ? 'true' : 'false');
  } else {
    button.removeAttribute('aria-pressed');
  }
}

function updateHotkeyPills() {
  setHotkeyPill(hintF8El, 'F8', running ? t('hint.f8.stop') : t('hint.f8.start'), {
    title: running ? t('tooltip.stop') : t('tooltip.start'),
    state: running ? 'danger' : 'run'
  });
  setHotkeyPill(liveHotkeyF8El, 'F8', running ? t('hint.f8.stop') : t('hint.f8.start'), {
    title: running ? t('tooltip.stop') : t('tooltip.start'),
    state: running ? 'danger' : 'run'
  });

  const canToggleSuspend = running || worshipMode;
  setHotkeyPill(hintF7El, 'F7', worshipMode ? t('hint.f7.resume') : t('hint.f7.suspend'), {
    title: worshipMode ? t('tooltip.worshipOn') : t('tooltip.worshipOff'),
    active: worshipMode,
    pressed: worshipMode,
    disabled: !canToggleSuspend,
    state: worshipMode ? 'suspended' : running ? 'active' : 'idle'
  });
  setHotkeyPill(liveHotkeyF7El, 'F7', worshipMode ? t('hint.f7.resume') : t('hint.f7.suspend'), {
    title: worshipMode ? t('tooltip.worshipOn') : t('tooltip.worshipOff'),
    active: worshipMode,
    pressed: worshipMode,
    disabled: !canToggleSuspend,
    state: worshipMode ? 'suspended' : running ? 'active' : 'idle'
  });

  setHotkeyPill(hintF6El, 'F6', t('hint.f6.enter'), {
    title: presentationMode ? t('tooltip.presentationOn') : t('tooltip.presentationOff'),
    active: presentationMode,
    pressed: presentationMode,
    state: presentationMode ? 'active' : 'idle'
  });
  setHotkeyPill(liveHotkeyF6El, 'F6', t('hint.f6.enter'), {
    title: presentationMode ? t('tooltip.presentationOn') : t('tooltip.presentationOff'),
    active: presentationMode,
    pressed: presentationMode,
    state: presentationMode ? 'active' : 'idle'
  });

  setHotkeyPill(hintF2El, 'F2', controlsLocked ? t('hint.f2.unlock') : t('hint.f2.lock'), {
    title: controlsLocked ? t('tooltip.lockOn') : t('tooltip.lockOff'),
    active: controlsLocked,
    pressed: controlsLocked,
    state: controlsLocked ? 'locked' : 'idle'
  });
  setHotkeyPill(liveHotkeyF2El, 'F2', controlsLocked ? t('hint.f2.unlock') : t('hint.f2.lock'), {
    title: controlsLocked ? t('tooltip.lockOn') : t('tooltip.lockOff'),
    active: controlsLocked,
    pressed: controlsLocked,
    state: controlsLocked ? 'locked' : 'idle'
  });

  setHotkeyPill(hintF1El, 'F1', helpVisible ? t('hint.f1.close') : t('hint.f1.open'), {
    title: t('tooltip.help'),
    active: helpVisible,
    pressed: helpVisible,
    state: helpVisible ? 'active' : 'idle'
  });
  setHotkeyPill(liveHotkeyF1El, 'F1', helpVisible ? t('hint.f1.close') : t('hint.f1.open'), {
    title: t('tooltip.help'),
    active: helpVisible,
    pressed: helpVisible,
    state: helpVisible ? 'active' : 'idle'
  });
  setHotkeyPill(liveHotkeyF4El, 'F4', t('button.resetSessionShort'), {
    title: t('tooltip.resetSession'),
    state: 'idle'
  });
}

function refreshToggleButtonLabels() {
  setRunningButtonState();
  setSuspendButtonState();
  if (togglePresentationButton) {
    togglePresentationButton.textContent = presentationMode ? t('button.presentationOn') : t('button.presentationOff');
  }
  if (toggleLockControlsButton) {
    toggleLockControlsButton.textContent = controlsLocked ? t('button.lockOn') : t('button.lockOff');
  }
  if (toggleRunButton) {
    toggleRunButton.title = running ? t('tooltip.stop') : t('tooltip.start');
  }
  if (togglePresentationButton) {
    togglePresentationButton.title = presentationMode ? t('tooltip.presentationOn') : t('tooltip.presentationOff');
  }
  if (toggleLockControlsButton) {
    toggleLockControlsButton.title = controlsLocked ? t('tooltip.lockOn') : t('tooltip.lockOff');
  }
  setSourcePanelCollapsed(sourceCaptionCardEl.classList.contains('is-collapsed'), { persist: false });
  updateHotkeyPills();
}

function setStaticButtonTooltips() {
  saveKeyButton.title = t('tooltip.saveKey');
  openSettingsPageButton.title = t('tooltip.settings');
  liveOpenSettingsPageButton.title = t('tooltip.settings');
  backToLivePageButton.title = t('tooltip.back');
  liveExitTranslationModeButton.title = t('tooltip.presentationOn');
  if (toggleHelpButton) {
    toggleHelpButton.title = t('tooltip.help');
  }
  toggleOutputWindowButton.title = t('tooltip.outputWindow');
  liveToggleOutputWindowButton.title = t('tooltip.outputWindow');
  openScriptManagerButton.title = t('tooltip.scriptManager');
  scriptPanelOpenScriptManagerButton.title = t('tooltip.scriptManager');
  segmentationHelpToggleEl.title = t('tooltip.segmentationHelp');
  segmentationHelpToggleEl.setAttribute('aria-label', t('tooltip.segmentationHelp'));
  liveSegmentationHelpToggleEl.title = t('tooltip.segmentationHelp');
  liveSegmentationHelpToggleEl.setAttribute('aria-label', t('tooltip.segmentationHelp'));
  labelVadThresholdEl.title = t('tooltip.vadThreshold');
  labelLiveVadThresholdEl.title = t('tooltip.vadThreshold');
  labelSilenceMsEl.title = t('tooltip.silenceMs');
  labelLiveSilenceMsEl.title = t('tooltip.silenceMs');
  labelMaxSegmentMsEl.title = t('tooltip.maxSegmentMs');
  labelLiveMaxSegmentMsEl.title = t('tooltip.maxSegmentMs');
  uploadReferenceScriptButton.title = t('tooltip.uploadScript');
  pasteReferenceScriptButton.title = t('tooltip.pasteScript');
  clearReferenceScriptButton.title = t('tooltip.clearScript');
  uploadSermonKeywordsButton.title = t('tooltip.uploadSermonKeywords');
  pasteSermonKeywordsButton.title = t('tooltip.pasteSermonKeywords');
  clearSermonKeywordsButton.title = t('tooltip.clearSermonKeywords');
  resetSessionButton.title = t('tooltip.resetSession');
  exportTranscriptButton.title = t('tooltip.exportTranscript');
  exportTranscriptTranslatedButton.title = t('tooltip.exportTranscript');
  setSourcePanelCollapsed(sourceCaptionCardEl.classList.contains('is-collapsed'), { persist: false });
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
  setSourcePanelCollapsed(sourcePanelCollapsed, { persist: false });
  if (togglePresentationButton) {
    togglePresentationButton.textContent = presentationMode ? t('button.presentationOn') : t('button.presentationOff');
    togglePresentationButton.title = presentationMode ? t('tooltip.presentationOn') : t('tooltip.presentationOff');
  }
  if (presentationMode) {
    renderPanels(activePairLineId, selectedPairLineId);
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

function setWorshipMode(nextMode, options: { silentStatus?: boolean } = {}) {
  if (nextMode && !running) {
    return;
  }
  worshipMode = Boolean(nextMode);
  setSuspendButtonState();

  if (worshipMode) {
    pendingSegments.length = 0;
    clearCurrentLiveTranslation();
    if (!options.silentStatus) {
      setStatusKey('status.worshipEnabled');
    }
  } else if (running) {
    drainSegmentQueue();
    if (!options.silentStatus) {
      setStatusKey('status.worshipDisabledRunning');
    }
  } else if (!options.silentStatus) {
      setStatusKey('status.worshipDisabled');
  }
  updateModeSummary();
}

function toggleSuspendMode() {
  if (!running && !worshipMode) return;
  setWorshipMode(!worshipMode);
}

function centerCardInPanel(panelEl: HTMLElement, cardEl: HTMLElement) {
  const targetRatio = presentationMode ? 0.52 : 0.4;
  const targetY = panelEl.clientHeight * targetRatio;
  const cardCenter = cardEl.offsetTop + cardEl.offsetHeight / 2;
  panelEl.scrollTop = Math.max(0, Math.min(cardCenter - targetY, panelEl.scrollHeight - panelEl.clientHeight));
}

function scrollToPairedLine(lineId: number) {
  if (!lineId) return;
  const englishCard = englishPanel.querySelector(`.line[data-line-id="${lineId}"]`);
  const chineseCard = chinesePanel.querySelector(`.line[data-line-id="${lineId}"]`);
  if (englishCard instanceof HTMLElement) {
    centerCardInPanel(englishPanel, englishCard);
  }
  if (chineseCard instanceof HTMLElement) {
    centerCardInPanel(chinesePanel, chineseCard);
  }
}

function selectPairedLine(lineId: number) {
  if (!lineId) return;
  selectedPairLineId = lineId;
  transcriptPanelsAutoPin = false;
  renderPanels(activePairLineId, selectedPairLineId);
  window.requestAnimationFrame(() => {
    scrollToPairedLine(lineId);
  });
}

function formatDelayText(delayMs) {
  const rounded = Math.max(0, Math.round(Number(delayMs) || 0));
  return `${t('meta.delay')}: ${rounded} ms`;
}

function buildLineCard(text, warning, isActive, isSelected, lineId, delayMs = 0) {
  const div = document.createElement('div');
  const empty = !text;
  div.className = `line ${warning ? 'warning' : ''} ${isActive ? 'active-current' : ''} ${isSelected ? 'active-selected' : ''} ${empty ? 'empty' : ''}`;
  if (!warning && lineId) {
    div.dataset.lineId = String(lineId);
    div.addEventListener('click', () => {
      selectPairedLine(lineId);
    });
  }
  if (empty) {
    div.textContent = ' ';
    return div;
  }

  const textEl = document.createElement('span');
  textEl.className = 'line-text';
  textEl.textContent = text;
  div.appendChild(textEl);

  if (!warning && delayMs > 0) {
    const delayEl = document.createElement('span');
    delayEl.className = 'line-meta line-delay';
    delayEl.textContent = formatDelayText(delayMs);
    div.appendChild(delayEl);
  }

  const copyButton = document.createElement('button');
  copyButton.type = 'button';
  copyButton.className = 'line-copy-btn';
  copyButton.textContent = '⧉';
  copyButton.setAttribute('aria-label', t('button.copyLine'));
  copyButton.title = t('tooltip.copyLine');
  copyButton.addEventListener('click', async (event) => {
    event.stopPropagation();
    await copyTextToClipboard(text, 'status.lineCopied');
  });
  div.appendChild(copyButton);

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
    leftCard.style.minHeight = '';
    rightCard.style.minHeight = '';
    const rowHeight = Math.max(leftCard.offsetHeight, rightCard.offsetHeight);
    leftCard.style.minHeight = `${rowHeight}px`;
    rightCard.style.minHeight = `${rowHeight}px`;
  }
}

function clearPairedCardHeights() {
  const englishCards = Array.from(englishPanel.querySelectorAll('.line'));
  const chineseCards = Array.from(chinesePanel.querySelectorAll('.line'));
  [...englishCards, ...chineseCards].forEach((card) => {
    if (!(card instanceof HTMLElement)) return;
    card.style.height = '';
    card.style.minHeight = '';
  });
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

function isPanelNearBottom(panelEl: HTMLElement) {
  const remaining = panelEl.scrollHeight - panelEl.clientHeight - panelEl.scrollTop;
  return remaining <= 48;
}

function updateTranscriptAutoPinState() {
  transcriptPanelsAutoPin = isPanelNearBottom(englishPanel) && isPanelNearBottom(chinesePanel);
}

function renderPanels(activeLineId = 0, selectedLineId = 0) {
  if (selectedLineId && !pairedLines.some((line) => line.id === selectedLineId)) {
    selectedPairLineId = 0;
    selectedLineId = 0;
  }
  englishPanel.innerHTML = '';
  chinesePanel.innerHTML = '';

  pairedLines.forEach((line) => {
    const isActive = line.id === activeLineId;
    const isSelected = line.id === selectedLineId;
    const englishCard = buildLineCard(line.englishText, line.englishWarning, isActive, isSelected, line.id, line.delayMs);
    const chineseCard = buildLineCard(line.chineseText, line.chineseWarning, isActive, isSelected, line.id, line.delayMs);
    englishPanel.appendChild(englishCard);
    chinesePanel.appendChild(chineseCard);
  });

  if (!presentationMode) {
    normalizePairedCardHeights();
  } else {
    clearPairedCardHeights();
  }
  if (transcriptPanelsAutoPin) {
    pinPanelsToLatest();
    window.requestAnimationFrame(() => {
      pinPanelsToLatest();
    });
  } else if (selectedLineId) {
    window.requestAnimationFrame(() => {
      scrollToPairedLine(selectedLineId);
    });
  }
}

function appendPairedLine(
  englishText,
  chineseText,
  options: { englishWarning?: boolean; chineseWarning?: boolean; highlight?: boolean; delayMs?: number } = {}
) {
  if (!englishText && !chineseText) return;
  const entry = {
    id: ++lineSequence,
    englishText: englishText || '',
    chineseText: chineseText || '',
    englishWarning: Boolean(options.englishWarning),
    chineseWarning: Boolean(options.chineseWarning),
    delayMs: Math.max(0, Math.round(Number(options.delayMs) || 0))
  };
  pairedLines.push(entry);
  while (pairedLines.length > MAX_LINES) pairedLines.shift();
  if (options.highlight !== false && !entry.englishWarning && !entry.chineseWarning) {
    activePairLineId = entry.id;
  }
  renderPanels(activePairLineId, selectedPairLineId);
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
  labelLiveAudioInputEl.textContent = t('label.audioInput');
  labelThemeEl.textContent = t('label.theme');
  labelMockModeEl.textContent = t('label.mockMode');
  labelTuneAudioEl.textContent = t('label.tuneAudio');
  labelSourceLanguageEl.textContent = t('label.sourceLanguage');
  labelTargetLanguageEl.textContent = t('label.targetLanguage');
  labelVadThresholdEl.textContent = t('label.vadThreshold');
  labelLiveVadThresholdEl.textContent = t('label.vadThreshold');
  labelLiveSilenceMsEl.textContent = t('label.silenceMs');
  labelLiveMaxSegmentMsEl.textContent = t('label.maxSegmentMs');
  labelSilenceMsEl.textContent = t('label.silenceMs');
  labelMaxSegmentMsEl.textContent = t('label.maxSegmentMs');
  vadHelpTextEl.textContent = t('help.vadThreshold');
  silenceHelpTextEl.textContent = t('help.silenceMs');
  maxSegmentHelpTextEl.textContent = t('help.maxSegmentMs');
  liveVadHelpTextEl.textContent = t('help.vadThreshold');
  liveSilenceHelpTextEl.textContent = t('help.silenceMs');
  liveMaxSegmentHelpTextEl.textContent = t('help.maxSegmentMs');
  labelGlossaryEl.textContent = t('label.glossary');
  labelSttKeywordsEl.textContent = t('label.sttKeywords');
  sttKeywordsHintEl.textContent = t('hint.sttKeywords');
  labelSermonKeywordsListEl.textContent = t('label.sermonKeywordsList');
  labelAutoSaveOnStopEl.textContent = t('label.autoSaveOnStop');

  englishHeadingEl.textContent = t('heading.english');
  saveKeyButton.textContent = t('button.saveKey');
  saveMainApiKeyButton.textContent = t('button.saveKey');
  cancelMainApiKeyButton.textContent = t('button.cancel');
  setIconButton(openSettingsPageButton, '⚙', t('button.settings'));
  setIconButton(liveOpenSettingsPageButton, '⚙', t('button.settings'));
  setIconButton(toggleOutputWindowButton, '🖥', t('button.outputWindow'));
  setIconButton(liveToggleOutputWindowButton, '🖥', t('button.outputWindow'));
  setIconButton(backToLivePageButton, '←', t('button.back'));
  setIconButton(liveExitTranslationModeButton, '←', t('button.presentationOn'));
  settingsHeadingEl.textContent = t('heading.settings');
  appearanceSummaryEl.textContent = t('heading.appearance');
  translationControlsSummaryEl.textContent = t('heading.translationControls');
  languageAidsSummaryEl.textContent = t('heading.languageAids');
  referenceScriptHeadingEl.textContent = t('heading.referenceScript');
  if (toggleHelpButton) {
    toggleHelpButton.textContent = t('button.help');
  }
  setIconButton(openScriptManagerButton, '📜', t('button.scriptManager'));
  setIconButton(scriptPanelOpenScriptManagerButton, '📜', t('button.scriptManager'));
  setIconButton(uploadReferenceScriptButton, '⬆', t('button.uploadScript'));
  setIconButton(pasteReferenceScriptButton, '📋', t('button.pasteScript'));
  setIconButton(clearReferenceScriptButton, '❌', t('button.clearScript'));
  setIconButton(uploadSermonKeywordsButton, '⬆', t('button.uploadSermonKeywords'));
  setIconButton(pasteSermonKeywordsButton, '📋', t('button.pasteSermonKeywords'));
  setIconButton(clearSermonKeywordsButton, '❌', t('button.clearSermonKeywords'));
  scriptActionsLabelEl.textContent = t('label.scriptActions');
  keywordActionsLabelEl.textContent = t('label.keywordActions');
  resetSessionButton.textContent = t('button.resetSession');
  setIconButton(exportTranscriptButton, '⇩', t('button.exportTranscript'));
  setIconButton(exportTranscriptTranslatedButton, '⇩', t('button.exportTranscript'));
  saveGlossaryButton.textContent = t('button.saveLanguageAids');
  importGlossaryButton.textContent = t('button.import');
  exportGlossaryButton.textContent = t('button.export');
  closeHelpButton.textContent = t('button.close');
  setIconButton(closeScriptModalButton, '✕', t('button.close'));
  apiKeyModalTitleEl.textContent = t('modal.apiKeyTitle');
  apiKeyModalSubtitleEl.textContent = t('modal.apiKeySubtitle');
  scriptModalTitleEl.textContent = t('modal.scriptTitle');
  scriptModalSubtitleEl.textContent = t('modal.scriptSubtitle');
  updateSermonKeywordsUi();
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
  chipModeLabelEl.textContent = t('chip.mode');
  chipWorshipLabelEl.textContent = t('chip.worship');
  chipPresentationLabelEl.textContent = t('chip.translation');
  chipQueueLabelEl.textContent = t('chip.queue');
  chipLockLabelEl.textContent = t('chip.controls');
  mockModeIndicatorEl.textContent = t('mode.mockBadge');
  updateProjectorIndicator();
  Array.from(uiLanguageSelect.options).forEach((option: any) => {
    option.textContent = t(`ui.${option.value}`);
  });
  Array.from(themeSelect.options).forEach((option: any) => {
    option.textContent = t(`theme.${option.value}`);
  });
  Array.from(audioInputSelect.options).forEach((option: any) => {
    if (option.value === '') {
      option.textContent = t('device.default');
    } else if (option.value === TEST_AUDIO_PICKER_VALUE) {
      option.textContent = t('device.testAudioPicker');
    }
  });
  syncTestAudioInputOption();
  syncLiveAudioInputMirror();
  syncAudioInputMenuSizes();

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
  const payload = {
    englishLines: pairedLines.map((line) => line.englishText).filter(Boolean),
    chineseLines: pairedLines.map((line) => line.chineseText).filter(Boolean),
    englishLive: englishLiveEl.textContent || '',
    chineseLive: chineseLiveEl.textContent || '',
    modeSummary: modeSummaryEl.textContent || '',
    targetLabel: languageName(targetLanguageSelect.value || 'zh-hans')
  };
  try {
    localStorage.setItem(OUTPUT_SNAPSHOT_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // ignore storage errors
  }
  const channel = getOutputBroadcastChannel();
  if (channel) {
    try {
      channel.postMessage(payload);
    } catch {
      // ignore broadcast errors
    }
  }

  try {
    const result = await invoke('push_output_caption', {
      payload
    });
    if (result && result.delivered) {
      outputWindowOpen = true;
      outputWindowReady = true;
      lastOutputHeartbeatAt = Date.now();
      updateProjectorIndicator();
    }
  } catch {
    // Ignore sync errors when output window is closed.
  }
}

function clearPanels() {
  pairedLines.length = 0;
  activePairLineId = 0;
  selectedPairLineId = 0;
  transcriptPanelsAutoPin = true;
  renderPanels(activePairLineId, selectedPairLineId);
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

function hashSeedText(seedText: string) {
  let hash = 0;
  for (let i = 0; i < seedText.length; i += 1) {
    hash = (hash * 31 + seedText.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function createDeterministicRng(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function sampleDeterministic<T>(items: T[], rand: () => number) {
  const index = Math.floor(rand() * items.length);
  return items[Math.max(0, Math.min(index, items.length - 1))];
}

const MOCK_ENGLISH_OPENERS = [
  'Mock: We are testing subtitle cadence and readability in a dynamic live-like flow.',
  'Mock: This segment simulates sermon pacing with pauses, emphasis, and denser vocabulary.',
  'Mock: Live rendering test begins with a mixed-length paragraph to stretch the card layout.',
  'Mock: A new sample line checks how quickly transcript cards adapt as content grows.'
];

const MOCK_ENGLISH_DETAILS = [
  'The panel should keep clear spacing while text wraps naturally.',
  'Operators should compare paired cards without losing context.',
  'This sentence is slightly longer to simulate natural variation.',
  'Spoken delivery often changes pace and sentence length.',
  'Highlight and selection should stay stable during updates.',
  'Scroll behavior should remain predictable as cards grow.',
  'This sample helps test alignment between both language panels.',
  'The goal is realistic variation, not extreme length differences.'
];

const MOCK_ENGLISH_CLOSERS = [
  'Please keep this deterministic so each test run is comparable.',
  'The goal is realistic diversity without introducing random instability between sessions.',
  'This closes the sample with a calm ending similar to spoken teaching cadence.',
  'Use this as a stress case for wrapping, spacing, and scroll behavior.'
];

const MOCK_CHINESE_LINES = [
  '模拟：用于测试排版与滚动稳定性。',
  '模拟：检查高亮、对齐与同步体验。',
  '模拟：英文可略长，中文适度精简。',
  '模拟：验证换行与卡片高度表现。',
  '模拟：保持可读性与节奏变化。',
  '模拟：用于比对双语面板卡片。'
];

function buildMockSegmentResult(payload: any) {
  const audioSeed = String(payload?.audio_base64 || '').slice(0, 512);
  const seedText = `${payload?.durationMs || 0}:${audioSeed}`;
  const rand = createDeterministicRng(hashSeedText(seedText));
  const detailCount = 1 + Math.floor(rand() * 3); // 1..3 detail sentences, moderate variety
  const englishParts = [sampleDeterministic(MOCK_ENGLISH_OPENERS, rand)];
  for (let i = 0; i < detailCount; i += 1) {
    englishParts.push(sampleDeterministic(MOCK_ENGLISH_DETAILS, rand));
  }
  if (rand() < 0.72) {
    englishParts.push(sampleDeterministic(MOCK_ENGLISH_CLOSERS, rand));
  }
  const englishText = englishParts.join(' ');

  // Keep EN/ZH line counts varied but closer (same, -1, or -2 lines).
  const englishSentenceCount = englishParts.length;
  const deltaRoll = rand();
  const lineDelta = deltaRoll < 0.38 ? 0 : deltaRoll < 0.82 ? 1 : 2;
  const chineseCount = Math.max(1, englishSentenceCount - lineDelta);
  const chineseParts = [];
  for (let i = 0; i < chineseCount; i += 1) {
    chineseParts.push(sampleDeterministic(MOCK_CHINESE_LINES, rand));
  }
  const chineseText = chineseParts.join('');

  return {
    english: englishText,
    translated: chineseText,
    chinese: chineseText,
    warning: ''
  };
}

async function processSegmentWithRetry(payload) {
  if (mockModeEnabled) {
    return buildMockSegmentResult(payload);
  }

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
      if (!running) {
        break;
      }
      const startSample = i * segmentSamples;
      const endSample = Math.min(totalSamples, startSample + segmentSamples);
      const durationMs = Math.round(((endSample - startSample) / decoded.sampleRate) * 1000);
      const wavBytes = encodeMonoPcm16Wav(decoded, startSample, endSample);
      const payload = {
        audio_base64: bytesToBase64(wavBytes),
        mime_type: 'audio/wav',
        durationMs,
        segmentEndedAtMs: Date.now()
      };
      pendingSegments.push(payload);
      updateModeSummary();
      drainSegmentQueue();
      if (i < totalSegmentsForFile - 1) {
        await waitMs(Math.max(120, durationMs));
      }
    }

    while (running && (pendingSegments.length || segmentQueueRunning)) {
      await waitMs(120);
    }
    if (running) {
      setStatusKey('status.fileTestFinished', { name: file.name });
    }
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

function syncTestAudioInputOption() {
  const existingPickerOption = audioInputSelect.querySelector(`option[value="${TEST_AUDIO_PICKER_VALUE}"]`) as HTMLOptionElement | null;
  if (existingPickerOption) {
    existingPickerOption.textContent = t('device.testAudioPicker');
  } else {
    const pickerOption = document.createElement('option');
    pickerOption.value = TEST_AUDIO_PICKER_VALUE;
    pickerOption.textContent = t('device.testAudioPicker');
    audioInputSelect.appendChild(pickerOption);
  }

  const existingOption = audioInputSelect.querySelector(`option[value="${TEST_AUDIO_INPUT_VALUE}"]`) as HTMLOptionElement | null;
  if (!selectedTestAudioFile) {
    if (existingOption) {
      existingOption.remove();
    }
    if (audioInputSelect.value === TEST_AUDIO_INPUT_VALUE) {
      audioInputSelect.value = '';
    }
    syncLiveAudioInputMirror();
    return;
  }

  const option = existingOption || document.createElement('option');
  option.value = TEST_AUDIO_INPUT_VALUE;
  option.textContent = t('device.testAudioInput', { name: selectedTestAudioFile.name });
  if (!existingOption) {
    audioInputSelect.appendChild(option);
  }
  syncLiveAudioInputMirror();
  syncAudioInputMenuSizes();
}

function setSelectedTestAudioFile(file: File | null) {
  selectedTestAudioFile = file;
  syncTestAudioInputOption();
  if (selectedTestAudioFile) {
    setAudioInputSelection(TEST_AUDIO_INPUT_VALUE);
    setStatusKey('status.testAudioSelected', { name: selectedTestAudioFile.name });
  }
}

function openTestAudioFilePicker(restoreValue = '') {
  const restoreSelection = () => {
    if (audioInputSelect.value === TEST_AUDIO_PICKER_VALUE || liveAudioInputSelect.value === TEST_AUDIO_PICKER_VALUE) {
      setAudioInputSelection(restoreValue);
    }
  };

  try {
    if (typeof testAudioFileInput.showPicker === 'function') {
      testAudioFileInput.showPicker();
    } else {
      testAudioFileInput.click();
    }
  } catch {
    try {
      testAudioFileInput.click();
    } catch {
      setStatusKey('status.testAudioPickerBlocked');
    }
  } finally {
    window.setTimeout(restoreSelection, 0);
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

async function processSermonKeywordsFile(file) {
  if (!file) return;
  try {
    const content = await file.text();
    setSermonKeywords(content);
    await syncTranslationConfig();
    setStatusKey('status.sermonKeywordsLoaded', { terms: countKeywordTerms(sermonKeywordsText) });
  } catch (err) {
    setStatusKey('status.sermonKeywordsLoadFailed', { error: (err && err.message) || String(err) });
  } finally {
    sermonKeywordsInput.value = '';
  }
}

async function pasteSermonKeywordsFromClipboard() {
  try {
    const content = await navigator.clipboard.readText();
    if (!content || !content.trim()) {
      setStatusKey('status.sermonKeywordsClipboardEmpty');
      return;
    }
    setSermonKeywords(content);
    await syncTranslationConfig();
    setStatusKey('status.sermonKeywordsPasted', { terms: countKeywordTerms(sermonKeywordsText) });
  } catch (err) {
    setStatusKey('status.sermonKeywordsPasteFailed', { error: (err && err.message) || String(err) });
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
      const segmentEndedAtMs = Number(payload.segmentEndedAtMs || Date.now());
      const renderDelayMs = Math.max(0, Date.now() - segmentEndedAtMs);
      appendPairedLine(result.english || '', translatedText, { delayMs: renderDelayMs });

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
  syncTestAudioInputOption();

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
    if (previousValue === TEST_AUDIO_INPUT_VALUE && selectedTestAudioFile) {
      audioInputSelect.value = TEST_AUDIO_INPUT_VALUE;
    }
    if (audioInputSelect.value && audioInputSelect.value !== TEST_AUDIO_PICKER_VALUE) {
      lastNonPickerAudioInputValue = audioInputSelect.value;
    }
  } catch (err) {
    syncTestAudioInputOption();
    setStatusKey('status.audioDeviceAccessError', { error: err.message || String(err) });
    return;
  }

  if (permissionError) {
    setStatusKey('status.audioDeviceAccessError', { error: permissionError.message || String(permissionError) });
  }
  syncLiveAudioInputMirror();
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
      echoCancellation: tuneAudioEnabled,
      noiseSuppression: tuneAudioEnabled,
      autoGainControl: tuneAudioEnabled,
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
      pendingSegmentDurationMs = 0;
      pendingSegmentEndedAtMs = 0;
      return;
    }

    const audioBuffer = await blob.arrayBuffer();
    pendingSegments.push({
      audio_base64: arrayBufferToBase64(audioBuffer),
      mime_type: blob.type,
      durationMs: pendingSegmentDurationMs,
      segmentEndedAtMs: pendingSegmentEndedAtMs || Date.now()
    });
    pendingSegmentDurationMs = 0;
    pendingSegmentEndedAtMs = 0;
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
        pendingSegmentEndedAtMs = now;
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
        pendingSegmentEndedAtMs = now;
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
    pendingSegmentEndedAtMs = Date.now();
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
    setWorshipMode(false, { silentStatus: true });
    try {
      if (audioInputSelect.value === TEST_AUDIO_INPUT_VALUE) {
        if (!selectedTestAudioFile) {
          throw new Error(t('status.testAudioMissing'));
        }
        setStatusKey('status.running', {
          source: languageName(sourceLanguageSelect.value || 'korean'),
          target: languageName(targetLanguageSelect.value || 'zh-hans')
        });
        drainSegmentQueue();
        await processTestAudioFile(selectedTestAudioFile);
        if (running) {
          await setRunning(false);
          return;
        }
      } else {
        await setupAudioPipeline();
        setStatusKey('status.running', {
          source: languageName(sourceLanguageSelect.value || 'korean'),
          target: languageName(targetLanguageSelect.value || 'zh-hans')
        });
        drainSegmentQueue();
      }
    } catch (err) {
      setStatusKey('status.startFailed', { error: err.message || String(err) });
      running = false;
      setRunningButtonState();
      await invoke('set_running', { nextRunning: false });
    }
  } else {
    setWorshipMode(false, { silentStatus: true });
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
  const stt_keywords = sttKeywordsInput.value || '';
  await invoke('set_translation_config', {
    config: {
      glossary,
      stt_keywords,
      sermon_stt_keywords: sermonKeywordsText,
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

  const savedVadThreshold = loadNumericSetting('church-vad-threshold', DEFAULT_VAD_THRESHOLD, 0.01, 0.12);
  const savedSilenceMs = loadNumericSetting('church-silence-ms', DEFAULT_SILENCE_MS, 200, 3000);
  const savedMaxSegmentMs = loadNumericSetting('church-max-segment-ms', DEFAULT_MAX_SEGMENT_MS, 1200, 25000);

  vadThresholdInput.value = savedVadThreshold.toString();
  liveVadThresholdInput.value = savedVadThreshold.toString();
  silenceMsInput.value = savedSilenceMs.toString();
  liveSilenceMsInput.value = savedSilenceMs.toString();
  maxSegmentMsInput.value = savedMaxSegmentMs.toString();
  liveMaxSegmentMsInput.value = savedMaxSegmentMs.toString();
  vadValueEl.textContent = Number(vadThresholdInput.value).toFixed(3);
  liveVadValueEl.textContent = Number(vadThresholdInput.value).toFixed(3);

  const savedGlossary = localStorage.getItem('church-glossary');
  if (savedGlossary) {
    glossaryInput.value = savedGlossary;
  }
  const savedSttKeywords = localStorage.getItem('church-stt-keywords');
  if (savedSttKeywords) {
    sttKeywordsInput.value = savedSttKeywords;
  }
  setReferenceScript(localStorage.getItem(REFERENCE_SCRIPT_STORAGE_KEY) || '', { persist: false });
  setSermonKeywords('');

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

  const savedMockMode = localStorage.getItem(MOCK_MODE_STORAGE_KEY);
  mockModeEnabled = savedMockMode === '1';
  mockModeInput.checked = mockModeEnabled;
  const savedTuneAudio = localStorage.getItem('church-tune-audio');
  tuneAudioEnabled = savedTuneAudio ? savedTuneAudio === '1' : DEFAULT_TUNE_AUDIO_ENABLED;
  tuneAudioInput.checked = tuneAudioEnabled;

  const savedControlsLocked = localStorage.getItem('church-controls-locked');
  setControlsLocked(savedControlsLocked === '1');
  const savedSourcePanelCollapsed = localStorage.getItem(SOURCE_PANEL_COLLAPSED_STORAGE_KEY);
  sourcePanelCollapsed = savedSourcePanelCollapsed !== '0';
  setSourcePanelCollapsed(sourcePanelCollapsed, { persist: false });
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
    toggleSuspendMode();
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

  await listen('output-window-state', (event) => {
    const payload = event.payload || {};
    const state = typeof payload.state === 'string' ? payload.state : '';
    if (state === 'ready' || state === 'rendered') {
      outputWindowOpen = true;
      outputWindowReady = true;
      lastOutputHeartbeatAt = Date.now();
      updateProjectorIndicator();
    }
  });

  await listen('output-ready', () => {
    outputWindowOpen = true;
    outputWindowReady = true;
    lastOutputHeartbeatAt = Date.now();
    updateProjectorIndicator();
  });

  await listen('output-caption-rendered', () => {
    outputWindowOpen = true;
    outputWindowReady = true;
    lastOutputHeartbeatAt = Date.now();
    updateProjectorIndicator();
  });

  await refreshProjectorOpenState();
  if (projectorStateTimerId) {
    window.clearInterval(projectorStateTimerId);
  }
  projectorStateTimerId = window.setInterval(() => {
    void refreshProjectorOpenState();
    if (outputWindowOpen) {
      void syncOutputWindow();
    }
  }, PROJECTOR_STATE_POLL_MS);

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
  setMainView(mainView === 'settings' ? 'live' : 'settings');
});

liveOpenSettingsPageButton.addEventListener('click', () => {
  setMainView(mainView === 'settings' ? 'live' : 'settings');
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
  localStorage.setItem('church-stt-keywords', sttKeywordsInput.value || '');
  setStatusKey('status.languageAidsSaved');
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

labelAudioInputEl.addEventListener('click', async () => {
  if (controlsLocked) return;
  await loadDevices();
  const nextOpen = audioInputMenuEl.classList.contains('hidden');
  setAudioInputMenuOpen('main', nextOpen);
});

labelLiveAudioInputEl.addEventListener('click', async () => {
  if (controlsLocked) return;
  await loadDevices();
  const nextOpen = liveAudioInputMenuEl.classList.contains('hidden');
  setAudioInputMenuOpen('live', nextOpen);
});

labelAudioInputEl.addEventListener('keydown', async (event: KeyboardEvent) => {
  if (controlsLocked) return;
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    await loadDevices();
    const nextOpen = audioInputMenuEl.classList.contains('hidden');
    setAudioInputMenuOpen('main', nextOpen);
  }
});

labelLiveAudioInputEl.addEventListener('keydown', async (event: KeyboardEvent) => {
  if (controlsLocked) return;
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    await loadDevices();
    const nextOpen = liveAudioInputMenuEl.classList.contains('hidden');
    setAudioInputMenuOpen('live', nextOpen);
  }
});

audioInputSelect.addEventListener('change', () => {
  handleAudioInputSelection(audioInputSelect.value || '');
  closeAudioInputMenus();
});

liveAudioInputSelect.addEventListener('change', () => {
  handleAudioInputSelection(liveAudioInputSelect.value || '');
  closeAudioInputMenus();
});

document.addEventListener('pointerdown', (event) => {
  const target = event.target as Node | null;
  if (!target) return;
  const inMainGroup = audioInputMenuEl?.parentElement?.contains(target);
  const inLiveGroup = liveAudioInputMenuEl?.parentElement?.contains(target);
  if (!inMainGroup && !inLiveGroup) {
    closeAudioInputMenus();
  }
});

uiLanguageSelect.addEventListener('change', () => {
  applyUiLanguage();
});

themeSelect.addEventListener('change', () => {
  applyTheme(themeSelect.value);
  setStatusKey('status.themeSet', { theme: t(`theme.${themeSelect.value}`) });
});

mockModeInput.addEventListener('change', () => {
  mockModeEnabled = Boolean(mockModeInput.checked);
  localStorage.setItem(MOCK_MODE_STORAGE_KEY, mockModeEnabled ? '1' : '0');
  updateModeSummary();
  setStatusKey(mockModeEnabled ? 'status.mockModeEnabled' : 'status.mockModeDisabled');
});

tuneAudioInput.addEventListener('change', () => {
  tuneAudioEnabled = Boolean(tuneAudioInput.checked);
  localStorage.setItem('church-tune-audio', tuneAudioEnabled ? '1' : '0');
  setStatusKey(tuneAudioEnabled ? 'status.audioTuningEnabled' : 'status.audioTuningDisabled');
});

sourceLanguageSelect.addEventListener('change', async () => {
  await syncTranslationConfig();
  localStorage.setItem('church-source-language', sourceLanguageSelect.value || 'korean');
  setStatusKey('status.sourceSet', { source: languageName(sourceLanguageSelect.value || 'korean') });
  updateModeSummary();
  updateCostSummary();
});

if (toggleSourcePanelHeaderButton) {
  toggleSourcePanelHeaderButton.addEventListener('click', () => {
    if (!presentationMode) return;
    setSourcePanelCollapsed(!sourcePanelCollapsed);
  });
}

targetLanguageSelect.addEventListener('change', async () => {
  await syncTranslationConfig();
  localStorage.setItem('church-target-language', targetLanguageSelect.value || 'zh-hans');
  updateTranslatedHeading();
  setStatusKey('status.outputSet', { target: languageName(targetLanguageSelect.value || 'zh-hans') });
  updateModeSummary();
});

if (toggleRunButton) {
  toggleRunButton.addEventListener('click', async () => {
    await setRunning(!running);
  });
}

if (toggleWorshipModeButton) {
  toggleWorshipModeButton.addEventListener('click', () => {
    toggleSuspendMode();
  });
}

if (togglePresentationButton) {
  togglePresentationButton.addEventListener('click', () => {
    togglePresentationModeDebounced();
  });
}

liveExitTranslationModeButton.addEventListener('click', () => {
  setPresentationMode(false);
});

if (toggleHelpButton) {
  toggleHelpButton.addEventListener('click', () => {
    setHelpVisible(!helpVisible);
  });
}

hintF8El.addEventListener('click', async () => {
  await setRunning(!running);
});

hintF7El.addEventListener('click', () => {
  toggleSuspendMode();
});

hintF6El.addEventListener('click', () => {
  togglePresentationModeDebounced();
});

hintF2El.addEventListener('click', () => {
  setControlsLocked(!controlsLocked);
});

hintF1El.addEventListener('click', () => {
  setHelpVisible(!helpVisible);
});

liveHotkeyF8El.addEventListener('click', async () => {
  await setRunning(!running);
});

liveHotkeyF7El.addEventListener('click', () => {
  toggleSuspendMode();
});

liveHotkeyF6El.addEventListener('click', () => {
  togglePresentationModeDebounced();
});

liveHotkeyF4El.addEventListener('click', () => {
  resetSessionState();
});

liveHotkeyF2El.addEventListener('click', () => {
  setControlsLocked(!controlsLocked);
});

liveHotkeyF1El.addEventListener('click', () => {
  setHelpVisible(!helpVisible);
});

if (toggleLockControlsButton) {
  toggleLockControlsButton.addEventListener('click', () => {
    setControlsLocked(!controlsLocked);
  });
}

async function toggleOutputWindow() {
  try {
    await invoke('toggle_output_window');
    setStatusKey('status.outputWindowToggled');
    await refreshProjectorOpenState();
    if (outputWindowOpen) {
      outputWindowReady = false;
      lastOutputHeartbeatAt = 0;
      updateProjectorIndicator();
    }
    await syncOutputWindow();
    // New output window can miss early emits while listeners initialize.
    // Replay snapshot for a short period so projector reliably hydrates even
    // when opened after mock/test playback has already gone quiet.
    const replayDelaysMs = [180, 420, 850, 1400, 2200, 3200];
    replayDelaysMs.forEach((delayMs) => {
      window.setTimeout(() => {
        void syncOutputWindow();
      }, delayMs);
    });
  } catch (err) {
    outputWindowOpen = false;
    outputWindowReady = false;
    lastOutputHeartbeatAt = 0;
    updateProjectorIndicator();
    setStatusKey('status.outputWindowError', { error: err.message || String(err) });
  }
}

toggleOutputWindowButton.addEventListener('click', async () => {
  await toggleOutputWindow();
});

liveToggleOutputWindowButton.addEventListener('click', async () => {
  await toggleOutputWindow();
});

openScriptManagerButton.addEventListener('click', () => {
  setScriptModalVisible(true);
});

scriptPanelOpenScriptManagerButton.addEventListener('click', () => {
  setScriptModalVisible(true);
});

uploadReferenceScriptButton.addEventListener('click', () => {
  referenceScriptInput.click();
});

pasteReferenceScriptButton.addEventListener('click', async () => {
  await pasteReferenceScriptFromClipboard();
});

uploadSermonKeywordsButton.addEventListener('click', () => {
  sermonKeywordsInput.click();
});

pasteSermonKeywordsButton.addEventListener('click', async () => {
  await pasteSermonKeywordsFromClipboard();
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

clearSermonKeywordsButton.addEventListener('click', async () => {
  if (!sermonKeywordsText) {
    setStatusKey('status.noSermonKeywordsToClear');
    return;
  }
  setSermonKeywords('');
  await syncTranslationConfig();
  setStatusKey('status.sermonKeywordsCleared');
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
  if (!file) {
    testAudioFileInput.value = '';
    setAudioInputSelection(lastNonPickerAudioInputValue || '');
    return;
  }
  setSelectedTestAudioFile(file);
  testAudioFileInput.value = '';
});

referenceScriptInput.addEventListener('change', async (event) => {
  const input = event.target as HTMLInputElement | null;
  const file = input?.files?.[0];
  await processReferenceScriptFile(file);
});

sermonKeywordsInput.addEventListener('change', async (event) => {
  const input = event.target as HTMLInputElement | null;
  const file = input?.files?.[0];
  await processSermonKeywordsFile(file);
});

closeHelpButton.addEventListener('click', () => {
  setHelpVisible(false);
});

englishPanel.addEventListener('scroll', () => {
  updateTranscriptAutoPinState();
});

chinesePanel.addEventListener('scroll', () => {
  updateTranscriptAutoPinState();
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
  liveSilenceMsInput.value = silenceMsInput.value;
  localStorage.setItem('church-silence-ms', silenceMsInput.value);
});

liveSilenceMsInput.addEventListener('change', () => {
  silenceMsInput.value = liveSilenceMsInput.value;
  localStorage.setItem('church-silence-ms', liveSilenceMsInput.value);
});

maxSegmentMsInput.addEventListener('change', () => {
  liveMaxSegmentMsInput.value = maxSegmentMsInput.value;
  localStorage.setItem('church-max-segment-ms', maxSegmentMsInput.value);
});

liveMaxSegmentMsInput.addEventListener('change', () => {
  maxSegmentMsInput.value = liveMaxSegmentMsInput.value;
  localStorage.setItem('church-max-segment-ms', liveMaxSegmentMsInput.value);
});

autoSaveOnStopInput.addEventListener('change', () => {
  localStorage.setItem('church-auto-save-on-stop', autoSaveOnStopInput.checked ? '1' : '0');
});

resetSessionButton.addEventListener('click', () => {
  resetSessionState();
});

exportTranscriptButton.addEventListener('click', async () => {
  const result = await invoke('export_transcript', { entries: transcriptEntries });
  if (result.ok) {
    setStatusKey('status.transcriptExported', { path: result.path });
  } else {
    setStatus(result.message || t('status.transcriptExportFailed'));
  }
});

exportTranscriptTranslatedButton.addEventListener('click', async () => {
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
  bindMainTitlebarDragFallback();
  bindWindowControls();
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
  renderPanels(activePairLineId, selectedPairLineId);
});

boot();
