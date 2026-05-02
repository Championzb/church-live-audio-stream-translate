# Church Live Audio Translate (Audio -> Source Transcript -> Target Translation)

Desktop subtitle app for Windows and macOS using Tauri.

English | [简体中文](./README.zh-CN.md)

Documentation hub: [docs/README.md](./docs/README.md)

## What This App Does

- Captures live sermon audio from your selected input device.
- Produces source-language transcript + target-language translation in near real-time.
- Supports Korean, English, Japanese, and Chinese as source input.
- Supports Simplified Chinese, Traditional Chinese, Korean, Japanese, Spanish, and English as target output.
- Provides an optional projector window for audience display.
- Includes glossary + keyword aids to improve church-term consistency.

## Typical Usage Cases

- Church services needing live translated captions for multilingual congregations.
- Bilingual ministry teams where one operator manages audio input and translation output.
- Small teams that want local control over workflow and prompt tuning.
- Services that need source transcript visibility for reviewers while audience sees target language.

## Key Benefits

- Target-first live UI designed for service operations.
- Source-aware pipeline (`Audio -> Source -> Target`) to reduce pivot-language drift.
- Source/target toggle controls for both main translation view and projector view.
- Script + sermon keyword workflow for weekly prep and terminology consistency.
- Open-source and self-hosted workflow flexibility.

## Limitations vs Commercial Live Audio Translation Platforms

- No guaranteed SLA, uptime contract, or managed support desk.
- More operator setup responsibility (audio routing, keys, quality tuning, service-day checks).
- Fewer enterprise features out of the box (team admin console, analytics dashboards, compliance bundles).
- Quality depends more on local environment and operator tuning than fully managed platforms.
- Release cadence and long-term maintenance depend on this project/community, not a commercial roadmap commitment.

## Is This The Right Tool For You?

Use this project if you want:
- Strong control over translation workflow and church-specific term tuning.
- A practical operator UI with projector support for live services.
- Open-source flexibility over turnkey managed platform features.

Consider a commercial platform if you need:
- Formal support/SLA requirements.
- Minimal setup overhead for non-technical teams.
- Enterprise governance/compliance/reporting features from day one.

## Installation (From GitHub Releases)

1. Open the repository Releases page on GitHub.
2. Download the installer for your OS from the latest release assets.

### macOS (`.app.zip`)

1. Download `*.app.zip`.
2. Unzip it.
3. Drag the `.app` into `Applications`.
4. First launch: right-click the app -> `Open` -> confirm `Open`.

If macOS shows “app is damaged and can’t be opened”, remove quarantine attributes and retry:

```bash
xattr -dr com.apple.quarantine "/Applications/Church Live Translate.app"
open "/Applications/Church Live Translate.app"
```

### Windows (`.msi`)

1. Download `*.msi`.
2. Run the installer.
3. If SmartScreen appears: `More info` -> `Run anyway`.

If no release assets are visible yet, no release has been published for that version.
In that case, use the source setup path below until a release is published.

## Run From Source (Developer Setup)

Requirements:

- Node.js 20+
- Rust stable toolchain
- OpenAI API key

Run:

```bash
npm install
npm run start
```

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

Pipeline and behavior summary:
- Non-English source audio uses source-language transcription first, then source -> target translation.
- Source-transcript quality guards skip weak segments to reduce hallucinated output.
- Separate rolling context is maintained for source transcript and target translation.
- Korean -> Chinese has built-in consistency checks by default.

For technical details and latency notes, see [Translation Pipeline](./docs/TRANSLATION_PIPELINE.md).
For operator-facing controls and UI workflows, see [Operator Guide](./docs/OPERATOR_GUIDE.md) and [Setup And Configuration](./docs/SETUP_AND_CONFIG.md).

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
- Visual regression tests (desktop baseline): `npm run test:visual`

## Open Source Project Docs

- License: [Apache-2.0](./LICENSE)
- Contributing: [CONTRIBUTING.md](./CONTRIBUTING.md)
- Code of Conduct: [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)
- Security Policy: [SECURITY.md](./SECURITY.md)
- Support: [SUPPORT.md](./SUPPORT.md)
