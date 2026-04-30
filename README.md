# Church Live Audio Translate (Multi-language Input -> English -> Multi-language Output)

Desktop subtitle app for Windows and macOS using Tauri.

- Korean speech in
- English transcription is still processed internally; the main page focuses on target-language captions, while Translation Mode shows both English and target-language panels
- Configurable output language captions shown in parallel
- Source language switch supports Korean, English, Japanese, and Chinese sermons
- Configurable UI language (English / Simplified Chinese)
- Operator controls translation `Start/Stop` manually (button or `F8`)
- Translation suspend toggle pauses/resumes translation without stopping capture (`F7`)
- One-click translation mode for subtitle-focused display (`F6`)
- Header control hub shows live state chips (mode/translation state/translation mode/queue/control-lock) and always-visible hotkey pills
- Built-in help overlay for operators (button)
- Hover hints on each button to explain what it does
- Export transcript to a text file at any time
- One-tap session reset for queue + captions + transcript (`F4`)
- Optional auto-save transcript when stopping a session
- Dedicated dual-screen projector window for subtitle-only display
- Operator lock mode to prevent accidental config changes (`F2`)
- Live cost estimator (session and rough monthly estimate)
- File test mode for quick validation without live microphone input
- Upload target-language reference script before translation (used as soft context and shown in translation mode)

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
6. In the `Translation Controls` panel, adjust VAD threshold, silence hold, and max segment duration for lower latency.
7. Use the `Script` icon (`📜`) in the `Translation Controls` panel (optional), then choose `Upload Script` or `Paste Script` to load a target-language sermon script before starting.
8. Click `Start (F8)`.
9. Toggle `Suspend Translation (F7)` during songs to pause/resume translation without stopping capture controls.
10. Use `Translation Mode (F6)` for a subtitle-focused layout.
11. In translation mode, use the live bar back icon (`←`) or `Esc` to return quickly.
12. In translation mode, both English and target-language panels are shown, and the reference script appears as a side panel when a script is loaded.
13. Use `Export Transcript` if you want a saved copy after service.
14. Use `Reset Session (F4)` to clear queue/captions/transcript together between services.
15. Keep `Auto-save on stop` enabled if you want transcripts saved automatically to Desktop sessions folder.
16. Use `Projector Window` to open a second subtitle-only display for projector/monitor output.
17. Use `Lock Controls (F2)` after setup to avoid accidental config changes mid-service.
18. In `Audio Input`, choose `Test Audio File...` to pick a file as the current audio input, then click `Start (F8)` to run it through the same translation pipeline as live stream mode.

## Notes

- The app stores the API key in OS secure storage (macOS Keychain / Windows Credential Manager) and also keeps an app-local fallback copy to prevent repeated key prompts if secure storage lookup is unavailable.
- Optional OpenAI Admin Key can be entered in the same key panels and is stored securely (keyring + fallback file) for project costs API access.
- OpenAI Project ID (`proj_...`) can be entered in the same API key panels (landing + key popup) and is stored locally for cost filtering/use.
- The operator panel shows a masked API key indicator (for quick verification without exposing the full key).
- To change the API key after setup, click the masked API key box in the operator panel to open the compact popup.
- The compact key popup shows current saved API/Admin key values and includes copy buttons for quick clipboard copy.
- The selected source language is also saved locally for future sessions.
- The selected UI language is saved locally for future sessions.
- The selected UI theme is saved locally for future sessions.
- VAD threshold, silence hold, and max segment settings are saved locally.
- A concise mode summary line is shown as a shared bottom status bar (visible in both home and translation mode) with current run/translation/translation-mode state.
- The status bar also shows current queue size so operators can watch backlog.
- A persistent hotkey pill row keeps F8/F7/F6/F2/F1 actions visible for faster operator onboarding, and each pill is clickable as a quick action.
- Hotkey pills now update dynamically by state (for example Start/Stop, Suspend/Resume, Enter/Exit Mode, Lock/Unlock, Help/Close Help), including active/disabled visuals.
- Cost is shown on the masked OpenAI key tooltip. When `Project ID` is set, the app fetches real project cost from OpenAI Organization Costs API using the configured key; if unavailable (for example non-admin key), it falls back to local estimate.
- Control groups are collapsible to reduce visual crowding during operation.
- A dedicated `Settings` page keeps advanced controls separate from live captions, with a back button to return.
- The `Settings` header button is a toggle: click once to open Settings, click again to return to Live view.
- Settings includes UI language and a Theme picker (`Broadcast Clean`, `Paper Light`, `Minimal Mono`).
- OpenAI key access is available from the right side of the bottom status bar for one-click updates.
- Settings now uses a responsive structured layout with tighter width, a compact Appearance card, and a cleaner Glossary editor/action row.
- Settings includes a `Mock Mode (No API)` toggle that bypasses OpenAI segment calls and emits deterministic local EN/ZH lines for zero-cost UI testing.
- Session setup controls (`Audio Input`) plus `Settings` and `Projector Window` icon buttons stay in the header for faster access.
- Low-frequency utility controls use compact icon buttons (for example `Settings` and `Back`) with tooltips/labels for cleaner layout.
- During Translation Mode, the app switches to a sticky Live Control Bar (back icon, `Projector Window`, `Settings`, `Audio Input`, and live VAD/Silence/Max Segment tuning), while admin controls are hidden.
- Translation Mode live bar now uses a compact wrap layout so action/tuning/summary blocks stay tight and avoid large empty horizontal space.
- Translation Mode live bar also keeps a compact clickable hotkey map (F8/F7/F6/F4/F2/F1) so operators can trigger controls directly without leaving the mode.
- The Translation Mode settings card no longer duplicates start/suspend/mode/lock controls that already exist in the header hotkey strip.
- `Script` is available in the home-page `Translation Controls` panel for quick setup access.
- Translation Mode includes a dedicated live-bar back icon (`←`) to exit quickly without scrolling.
- Status/error notifications are shown as temporary bottom toast messages instead of a persistent header panel.
- Action buttons in Translation Mode auto-wrap into responsive equal-width tiles for faster click targeting on desktop and mobile.
- Utility actions are distributed for faster access: `Test Audio File...` is available directly from the `Audio Input` dropdown, `Export Transcript` is available as an icon on both transcription and translated panel headers, and `Reset Session (F4)` stays in the hotkey strip and translation-mode live bar.
- `Projector Window`, `Settings`, and `Audio Input` controls are now pinned in a dedicated top action bar to mirror VS Code/Chrome-style placement.
- The top action bar is now a slim flat strip (instead of a rounded floating panel) so it visually aligns with VS Code-style titlebar tooling.
- Top-bar `Audio Input` now uses a compact microphone icon label to reduce titlebar clutter.
- Top-bar audio picker now opens on icon click, while the selected device is shown as plain text in the titlebar (instead of a permanently visible dropdown box).
- Top-bar audio controls are now more compact, and opening the audio input menu automatically refreshes available devices.
- The bottom status bar now includes a projector health indicator (`Projector: Off / Waiting / Connected / Stale`) so operators can verify output-window link health quickly.
- Projector window now bootstraps with the latest caption snapshot from backend state, so it can render transcript content immediately even if opened after recent segments.
- Projector view is now audience-focused: both language columns keep the latest transcript at the top, keep only the most recent 2 transcript cards, highlight the latest card, and render the second-latest in a smaller/background style when space is tight.
- Projector mode summary now uses a shared-style bottom overlay status bar (`Mode | Translation | Translation Mode | Queue`) for consistency with home and translation pages.
- Main and projector windows now use native macOS window chrome (`decorations: true`) to match VS Code/Chrome behavior and keep OS-managed rounded corners/shadows.
- Custom frameless drag regions and floating window-control overlays are disabled; native macOS traffic-light controls are used instead.
- macOS windows now use titlebar overlay mode (`titleBarStyle: Overlay`, `hiddenTitle: true`) so top actions render inside the OS titlebar region, matching VS Code/Chrome-style integration.
- Projector panel columns now use shrink-safe grid tracks so long headings do not push content off-screen or clip the left panel.
- Projector bottom status bar summary is now transparent so it matches the glass style used in other pages.
- Projector status bar typography/spacing now matches the main window status bar for consistent cross-window UI.
- Native window transparency is disabled (`transparent: false`) so the OS frame paints corners cleanly and avoids black corner-fill artifacts.
- Projector window default launch size is now `1280x720` for better fit on typical screens.
- In main window, double-clicking the top titlebar area toggles maximize; restoring returns to the default launch size (`1500x920`).
- In projector window, double-clicking the top titlebar area toggles maximize; restoring returns to the default launch size (`1280x720`).
- The UI uses a modern minimal visual refresh (clean section styling, improved spacing, stronger typography, and smoother panel/button motion) while keeping operator workflow unchanged.
- Test audio files are streamed in short segments at real-time pace to mimic live ingestion behavior, and are played locally during the test so operators can judge translation latency against heard speech.
- Selecting `Test Audio File...` from `Audio Input` arms that file as the active input source; translation starts when `Start (F8)` is pressed, matching live stream control flow.
- Uploaded/pasted reference scripts are stored locally, sent as soft translation context for each segment, and can be cleared with `Clear Script`.
- In translation mode, script panel scrolling is independent from caption panel scrolling.
- In Translation Mode, the script panel header includes a `Script` icon for quick script popup access.
- The newest target-language lines are highlighted in the main panel; transcript panels auto-pin to latest lines only when already near bottom, and manual scroll-up is preserved.
- Clicking any transcript card (English or target language) now selects that paired row, applies a separate selection highlight color, and jumps both panels to the corresponding cards for side-by-side review.
- Hover a caption line in the transcription/translation panels to reveal a copy icon for quick per-line clipboard copy.
- VAD threshold can be adjusted during live streaming and takes effect immediately.
- If a target translation response is unexpectedly empty, the app now emits a language-specific non-empty fallback string instead of leaving the target panel blank.
- Auto-save writes transcripts to `~/Desktop/ChurchTranslateSessions` when enabled.
- English captions continue even if Chinese translation temporarily fails.
- On macOS, grant microphone permission to the app when prompted.
- `F8` is registered as a global shortcut while the app is running.
- `F7` toggles translation suspend/resume quickly.
- `F6` toggles translation mode (subtitle-focused layout).
- `Esc` exits translation mode quickly.
- `Delete`/`Backspace` returns from `Settings` back to the live view.
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
