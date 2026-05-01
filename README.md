# Church Live Audio Translate (Multi-language Input -> English -> Multi-language Output)

Desktop subtitle app for Windows and macOS using Tauri.

## Installation (From GitHub Releases)

1. Open the repository Releases page on GitHub.
2. Download the installer for your OS from the latest release assets.

### macOS (`.app.zip`)

1. Download `*.app.zip`.
2. Unzip it.
3. Drag the `.app` into `Applications`.
4. First launch: right-click the app -> `Open` -> confirm `Open`.

### Windows (`.msi`)

1. Download `*.msi`.
2. Run the installer.
3. If SmartScreen appears: `More info` -> `Run anyway`.

If no release assets are visible yet, no release has been published for that version.
In that case, use the source setup path below until a release is published.

## Start Here (By Role)

- Service operator (run live captions): [Operator Guide](./docs/OPERATOR_GUIDE.md)
- Church admin / setup owner (keys, language aids, audio setup, Tune Audio processing toggle): [Setup And Configuration](./docs/SETUP_AND_CONFIG.md)
- Developer / maintainer (architecture, APIs, latency): [Translation Pipeline](./docs/TRANSLATION_PIPELINE.md)
- Sermon prep helper prompt (Korean script -> Chinese script + STT keywords): [Script Prep Prompt](./docs/SCRIPT_PREP_PROMPT.md)

## Core Docs

- [Operator Guide](./docs/OPERATOR_GUIDE.md)
- [Setup And Configuration](./docs/SETUP_AND_CONFIG.md)
- [Translation Pipeline](./docs/TRANSLATION_PIPELINE.md)
- [Script Prep Prompt](./docs/SCRIPT_PREP_PROMPT.md)

Default audio capture preset for new sessions:
- `Tune Audio` ON, `VAD Threshold` `0.050`, `Silence Hold` `1900ms`, `Max Segment` `12000ms`.

Speech pipeline note:
- For non-English source audio (Korean/Japanese/Chinese), the app now transcribes in the source language first using `/v1/audio/transcriptions` with an explicit language code, then translates source text to English, then to the selected target language.

Script modal keyword tools now show both sermon keyword term count and the full loaded keyword list.

## Release / QA Docs

- Distribution playbook: [docs/DISTRIBUTION.md](./docs/DISTRIBUTION.md)
- Signing and notarization: [docs/SIGNING.md](./docs/SIGNING.md)
- QA checklist: [docs/TEST_PLAN.md](./docs/TEST_PLAN.md)
- QA merge/release gate: [docs/QA_GATE.md](./docs/QA_GATE.md)
- UI review rubric: [docs/UI_REVIEW_RUBRIC.md](./docs/UI_REVIEW_RUBRIC.md)
- Automated version bump workflow: `.github/workflows/release-version.yml`

## Automated Test Commands

- Typecheck: `npm run typecheck`
- Unit tests: `npm run test:unit`
- Unit test coverage report: `npm run test:coverage`
- Visual regression tests: `npm run test:visual`

## Open Source Project Docs

- License: [Apache-2.0](./LICENSE)
- Contributing: [CONTRIBUTING.md](./CONTRIBUTING.md)
- Code of Conduct: [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)
- Security Policy: [SECURITY.md](./SECURITY.md)
- Support: [SUPPORT.md](./SUPPORT.md)
