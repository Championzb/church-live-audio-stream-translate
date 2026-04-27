# Test Plan

This checklist helps validate Church Live Translate before each service or release.

## 1) Launch and setup

1. Run:

```bash
npm ci
npm run start
```

2. In app UI:
   - Enter OpenAI API key
   - Select audio input device
   - Select source language
   - Select output language

Expected:
- App starts without errors
- Device list is populated
- Status line updates normally

## 2) Caption pipeline smoke test

1. Click `Start (F8)`.
2. Speak 10-20 seconds into selected input.
3. Pause briefly to trigger segment flush.

Expected:
- English caption panel updates
- Output caption panel updates
- Mode summary queue rises/falls and returns near zero
- Cost summary increments from 0.00

## 3) Operator control tests

- `F7` Worship mode: translation pauses/resumes
- `F6` Presentation mode: controls hidden, large text view
- `F1` Help overlay: opens/closes
- `F2` Lock controls: configuration fields disabled/enabled
- `F4` Reset session: queue/captions/transcript/cost reset

Expected:
- Each hotkey updates state and mode summary correctly

## 4) Language coverage tests

Minimum matrix:

- Source: Korean -> Target: Simplified Chinese
- Source: English -> Target: Simplified Chinese
- Source: Korean -> Target: English
- Source: English -> Target: Traditional Chinese

Optional matrix:

- Source: Japanese or Chinese -> Target: English/Chinese

Expected:
- Output heading matches selected target language
- Output text appears in chosen target language

## 5) Transcript and output window tests

1. Click `Output Window`.
2. Speak and confirm second window mirrors captions/live status.
3. Click `Export Transcript` and save file.
4. Click `Copy Latest Output` and paste into a text editor.
5. Click `Clear Transcript`.

Expected:
- Output window mirrors main captions
- Transcript file contains timestamped EN + translated lines
- Clipboard contains latest translated caption
- Transcript memory clears without crashing

## 6) Auto-save on stop

1. Ensure `Auto-save on stop` is enabled.
2. Run short session and click `Stop`.
3. Check folder: `~/Desktop/ChurchTranslateSessions`

Expected:
- New transcript file appears
- Status line shows auto-save path

## 7) Distribution sanity checks

### macOS local

```bash
npm run build:mac
npm run dist:collect
```

Expected:
- `.app` bundle generated under `src-tauri/target/release/bundle/macos/`
- `dist/Church Live Translate.app.zip`
- `dist/SHA256SUMS.txt`

### CI release (optional)

- Trigger `.github/workflows/distribution.yml` manually or by `v*` tag.

Expected:
- Draft release created
- Artifacts uploaded for each OS target

## 8) Release preflight checks (if signing configured)

```bash
npm run release:check:mac
npm run release:check:all
```

Expected:
- Required environment variables are present

## 9) Service-day quick check (2 minutes)

1. Confirm correct audio input
2. Confirm source/target language
3. Start and speak one sentence
4. Verify both caption panels update
5. Verify output window on subtitle display
6. Keep worship mode/hotkeys ready
