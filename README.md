# Church Live Audio Translate (Korean -> English -> Chinese)

Desktop subtitle app for Windows and macOS using Tauri.

- Korean speech in
- English captions always shown
- Simplified Chinese captions shown in parallel
- Operator controls `Start/Stop` manually (button or `F8`) so worship songs can be skipped
- Export transcript to a text file at any time

## Tech choices

- Tauri desktop app (cross-platform, lighter runtime)
- Browser audio capture + simple VAD segmentation
- OpenAI Whisper translation endpoint for Korean -> English
- OpenAI text model for English -> Simplified Chinese
- Sequential segment queue to avoid API burst issues during fast speech

## Requirements

- Node.js 20+
- Rust toolchain (stable)
- OpenAI API key

## Setup

```bash
npm install
npm run start
```

## First run

1. Paste OpenAI API key and click `Save Key`.
2. Select the desired audio input device.
3. Add glossary terms (optional), one term per line as `EN=ZH`, then click `Save Glossary` (or use Import/Export).
4. Adjust VAD threshold, silence hold, and max segment duration for lower latency.
5. Click `Start (F8)`.
6. Use `Export Transcript` if you want a saved copy after service.

## Notes

- The app stores the API key in local browser storage for convenience.
- English captions continue even if Chinese translation temporarily fails.
- On macOS, grant microphone permission to the app when prompted.
- `F8` is registered as a global shortcut while the app is running.
- The live line under each caption panel shows recording/translation progress between segment updates.

## Broadcast workflow

Use this app on the subtitle display machine. The translator reads Chinese subtitles aloud into your existing broadcast system.

## Audio input options (Windows/macOS)

- USB audio interface or mixer USB output (recommended)
- Built-in microphone
- 3.5mm/line-in capture device
- Virtual loopback device for system audio capture (e.g. BlackHole/Loopback on macOS, VB-CABLE on Windows)

Tip: choose the cleanest source possible (usually mixer AUX out via USB interface) for best Korean-to-English quality.

## Packaging installers

- macOS `.app` and `.dmg`: `npm run build:mac`
- Windows `.msi`: `npm run build:win` (run from Windows machine or properly configured cross-compile toolchain)
- General bundle: `npm run build`

Packaging notes:
- macOS bundling requires the full Xcode app (not only Command Line Tools).
- Windows distribution may require code signing depending on deployment policy.
