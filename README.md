# Church Live Audio Translate (Multi-language Input -> English -> Multi-language Output)

Desktop subtitle app for Windows and macOS using Tauri.

- Korean speech in
- English captions always shown
- Configurable output language captions shown in parallel
- Source language switch supports Korean, English, Japanese, and Chinese sermons
- Configurable UI language (English / Simplified Chinese)
- Operator controls `Start/Stop` manually (button or `F8`) so worship songs can be skipped
- Worship mode quick toggle pauses translation without stopping the app (`F7`)
- One-click presentation mode for full-screen subtitle display (`F6`)
- Built-in help overlay for operators (`F1`)
- Hover hints on each button to explain what it does
- Export transcript to a text file at any time
- Clear transcript memory without clearing on-screen captions
- One-tap session reset for queue + captions + transcript (`F4`)
- One-click copy for the latest output caption line
- Optional auto-save transcript when stopping a session
- Dedicated dual-screen output window for subtitle-only display
- Operator lock mode to prevent accidental config changes (`F2`)
- Live cost estimator (session and rough monthly estimate)
- File test mode for quick validation without live microphone input

## Tech choices

- Tauri desktop app (cross-platform, lighter runtime)
- Browser audio capture + simple VAD segmentation
- OpenAI Whisper translation endpoint for Korean -> English
- OpenAI text model for English -> Simplified Chinese
- Sequential segment queue to avoid API burst issues during fast speech

## Project structure

- `src/`: frontend UI (HTML/CSS/TypeScript), audio capture, VAD, caption rendering
- `src-tauri/`: native Rust backend (Tauri commands, hotkey integration, file dialogs, app packaging)
- `AGENTS.md`: repository-level agent instructions, including commit-per-step workflow and Karpathy-inspired guidance

## Requirements

- Node.js 20+
- Rust toolchain (stable)
- OpenAI API key

## Setup

```bash
npm install
npm run start
```

Frontend TypeScript:

```bash
npm run typecheck
```

## First run

1. On the landing page, paste OpenAI API key and click `Save Key`.
2. If a key is already saved in secure storage, the app opens directly to the main page.
3. Select the desired audio input device, source language, and output language.
4. Set `UI Language` to English or Simplified Chinese for operator controls.
5. Add glossary terms (optional), one term per line as `EN=ZH`, then click `Save Glossary` (or use Import/Export).
6. Adjust VAD threshold, silence hold, and max segment duration for lower latency.
7. Click `Start (F8)`.
8. Toggle `Worship Mode (F7)` during songs to pause translation without stopping capture controls.
9. Use `Presentation Mode (F6)` on the subtitle monitor when operator controls are no longer needed on screen.
10. Use `Export Transcript` if you want a saved copy after service.
11. Use `Clear Transcript` if you want to reset transcript memory before the next segment/session.
12. Use `Reset Session (F4)` to clear queue/captions/transcript together between services.
13. Keep `Auto-save on stop` enabled if you want transcripts saved automatically to Desktop sessions folder.
14. Use `Output Window` to open a second subtitle-only display for projector/monitor output.
15. Use `Lock Controls (F2)` after setup to avoid accidental config changes mid-service.
16. Use `Test Audio File` to run one audio file through the same translation pipeline.

## Notes

- The app stores the API key in OS secure storage (macOS Keychain / Windows Credential Manager) and also keeps an app-local fallback copy to prevent repeated key prompts if secure storage lookup is unavailable.
- Optional OpenAI Admin Key can be entered in the same key panels and is stored securely (keyring + fallback file) for project costs API access.
- OpenAI Project ID (`proj_...`) can be entered in the same API key panels (landing + key popup) and is stored locally for cost filtering/use.
- The main page header shows a masked API key indicator (for quick verification without exposing the full key).
- To change the API key after setup, click the masked API key box in the main page header to open the compact popup.
- The compact key popup shows current saved API/Admin key values and includes copy buttons for quick clipboard copy.
- The selected source language is also saved locally for future sessions.
- The selected UI language is saved locally for future sessions.
- VAD threshold, silence hold, and max segment settings are saved locally.
- A live mode summary line shows current run/worship/presentation state.
- The mode summary also shows current queue size so operators can watch backlog.
- Cost is shown on the masked OpenAI key tooltip. When `Project ID` is set, the app fetches real project cost from OpenAI Organization Costs API using the configured key; if unavailable (for example non-admin key), it falls back to local estimate.
- Control groups are collapsible to reduce visual crowding during operation.
- A dedicated `Settings` page keeps advanced controls separate from live captions, with a back button to return.
- Session setup controls (`Audio Input`, `Refresh`) and the `Settings` button are in the header for faster access.
- Status/error notifications are shown as temporary bottom toast messages instead of a persistent header panel.
- Test audio files are streamed in short segments at real-time pace to mimic live ingestion behavior, and are played locally during the test so operators can judge translation latency against heard speech.
- The newest English and target-language transcript lines are highlighted directly in each panel, with auto-scroll pinned to the latest bottom lines during translation.
- If a target translation response is unexpectedly empty, the app now emits a language-specific non-empty fallback string instead of leaving the target panel blank.
- Auto-save writes transcripts to `~/Desktop/ChurchTranslateSessions` when enabled.
- English captions continue even if Chinese translation temporarily fails.
- On macOS, grant microphone permission to the app when prompted.
- `F8` is registered as a global shortcut while the app is running.
- `F7` toggles worship mode (pause/resume translation quickly).
- `F6` toggles presentation mode (hides controls and enlarges subtitle text).
- `Esc` exits presentation mode quickly.
- `F1` toggles the on-screen hotkey help overlay.
- `F4` resets current session state (queued segments, captions, transcript).
- `F2` locks or unlocks configuration controls.
- The live line under each caption panel shows recording/translation progress between segment updates.
- Caption panels keep a longer rolling history and auto-scroll to the latest line.
- Korean mode uses translation to English first; English mode uses direct transcription for lower overhead.
- Japanese/Chinese input first transcribes source speech, then converts to English before final output translation.
- Korean mode includes an automatic fallback path if Whisper translation fails temporarily.
- Segment processing retries automatically on transient API/network errors.
- Cost summary estimates STT + translation spend from processed audio/text.

## App logs (for distributed troubleshooting)

- macOS log file: `~/Library/Logs/com.church.live.translate/app.log`
- Quick tail command:
  - `tail -f ~/Library/Logs/com.church.live.translate/app.log`
- API key storage diagnostics are logged with prefix: `[api-key-storage]`
- Project cost fetch diagnostics (request/decode errors, totals) are logged with prefix: `[project-costs]`

## Broadcast workflow

Use this app on the subtitle display machine. The translator reads Chinese subtitles aloud into your existing broadcast system.

## Audio input options (Windows/macOS)

- USB audio interface or mixer USB output (recommended)
- Built-in microphone
- 3.5mm/line-in capture device
- Virtual loopback device for system audio capture (e.g. BlackHole/Loopback on macOS, VB-CABLE on Windows)

Tip: choose the cleanest source possible (usually mixer AUX out via USB interface) for best Korean-to-English quality.

## Packaging installers

- macOS `.app` (stable): `npm run build:mac`
- macOS `.app` + `.dmg` (optional): `npm run build:mac:dmg`
- Windows `.msi`: `npm run build:win` (run from Windows machine or properly configured cross-compile toolchain)
- General bundle: `npm run build`
- Collect local artifacts + checksums into `dist/`: `npm run dist:collect`
- CI distribution workflow: `.github/workflows/distribution.yml` (manual run or `v*` tags)
- Full release playbook: `docs/DISTRIBUTION.md`
- Signing/notarization setup: `docs/SIGNING.md`
- QA checklist: `docs/TEST_PLAN.md`

Packaging notes:
- macOS bundling requires the full Xcode app (not only Command Line Tools).
- Windows distribution may require code signing depending on deployment policy.
- GitHub Actions workflow creates draft releases and also uploads bundle artifacts for each OS.
- `dist:collect` creates `dist/SHA256SUMS.txt` for release verification (macOS `.app` is zipped before hashing).
- Validate signing env before release: `npm run release:check:mac` or `npm run release:check:all`.

### Unsigned install steps

#### macOS (`.app.zip`)

1. Download release `.app.zip`.
2. Unzip and drag `.app` into `Applications`.
3. First run: right-click app -> `Open` -> confirm `Open`.

#### Windows (`.msi`)

1. Download release `.msi`.
2. Double-click installer and complete setup.
3. If SmartScreen appears: click `More info` -> `Run anyway`.
