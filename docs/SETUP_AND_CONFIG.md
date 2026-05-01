# Setup And Configuration

Use this when preparing the machine, keys, and language aids before service.

## Keys And Cost

- API key is stored in OS secure storage (Keychain/Credential Manager) with local fallback.
- Optional Admin key + Project ID enable richer OpenAI project cost visibility.
- Key update is available via masked-key control in bottom status bar.

## Language Aids (Recommended Workflow)

- Stable week-to-week terms:
  - `Settings` -> `Language Aids` -> `STT Keywords`
- Sermon-specific terms:
  - `Script` modal -> upload/paste sermon keywords each service
  - Settings now shows a dedicated `Sermon-Specific Keywords` status line and shortcut button (`Open Script Keywords`)
- Translation consistency terms:
  - `Glossary` (`EN=ZH`, one per line)
- Reference sermon text:
  - `Script` modal -> upload/paste source or target script for context

## Stable STT Keywords vs Glossary

- `Stable STT Keywords`: improves speech recognition (audio -> English transcript).
- `Glossary`: enforces preferred translation wording (English -> target language).
- They are related but not interchangeable. Keep both.

## Audio Input Options (Windows/macOS)

- USB audio interface or mixer USB output (recommended)
- Built-in microphone
- 3.5mm/line-in capture device
- Virtual loopback device for system audio capture (for example BlackHole/Loopback on macOS, VB-CABLE on Windows)

Tip: use the cleanest source possible (usually mixer AUX out via USB interface) for best recognition quality.

## Default Audio Tuning Preset

Default capture preset (when no saved override exists):

- `Tune Audio`: ON
- `VAD Threshold`: `0.050`
- `Silence Hold (ms)`: `1900`
- `Max Segment (ms)`: `12000`

## App Logs

- macOS log file: `~/Library/Logs/com.church.live.translate/app.log`
- Tail command: `tail -f ~/Library/Logs/com.church.live.translate/app.log`
- API key storage logs prefix: `[api-key-storage]`
- Project cost logs prefix: `[project-costs]`

## Packaging Installers

- macOS `.app` (stable): `npm run build:mac`
- macOS `.app` + `.dmg` (optional): `npm run build:mac:dmg`
- Windows `.msi`: `npm run build:win` (run from Windows machine or configured cross-compile toolchain)
- General bundle: `npm run build`
- Collect artifacts + checksums into `dist/`: `npm run dist:collect`

Packaging notes:
- macOS bundling requires full Xcode app (not only Command Line Tools).
- Windows distribution may require code signing depending on deployment policy.
- `dist:collect` creates `dist/SHA256SUMS.txt` for release verification.

For full release flow:
- [Distribution playbook](./DISTRIBUTION.md)
- [Signing/notarization](./SIGNING.md)
- [QA checklist](./TEST_PLAN.md)
