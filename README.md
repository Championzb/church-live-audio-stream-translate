# Church Live Audio Translate (Korean -> English -> Chinese)

Desktop subtitle app for Windows and macOS.

- Korean speech in
- English captions always shown
- Simplified Chinese captions shown in parallel
- Operator controls `Start/Stop` manually (button or `F8`) so worship songs can be skipped

## Tech choices

- Electron desktop app (cross-platform)
- Browser audio capture + simple VAD segmentation
- OpenAI Whisper translation endpoint for Korean -> English
- OpenAI text model for English -> Simplified Chinese

## Requirements

- Node.js 20+
- OpenAI API key

## Setup

```bash
npm install
npm run start
```

## First run

1. Paste OpenAI API key and click `Save Key`.
2. Select the desired audio input device.
3. Add glossary terms (optional), one term per line as `EN=ZH`, then click `Save Glossary`.
4. Adjust VAD threshold/silence hold if needed.
5. Click `Start (F8)`.

## Notes

- The app stores the API key in local browser storage for convenience.
- English captions continue even if Chinese translation temporarily fails.
- On macOS, grant microphone permission to the app when prompted.
- `F8` is registered as a global shortcut while the app is running.

## Broadcast workflow

Use this app on the subtitle display machine. The translator reads Chinese subtitles aloud into your existing broadcast system.
