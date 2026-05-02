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

Speech pipeline note:
- Development builds now use a shorter native app/menu process label (`church-live-translate`) to avoid overly long macOS app-menu entries.
- macOS app menu labels are now explicitly branded (`About/Hide/Quit Church Live Translate`) so menu text stays polished even when the internal binary name is short.
- macOS `About` dialog metadata is now polished with branded naming, short version display, copyright, and credits text.
- macOS `About` dialog now uses the high-resolution app logo for clearer icon rendering.
- Windows now uses the same branded About metadata and menu naming pattern (`Church Live Translate`) for cross-platform consistency with macOS.
- For non-English source audio (Korean/Japanese/Chinese), the app transcribes in the source language first using `/v1/audio/transcriptions` with an explicit language code, then translates directly from source text to the selected target language.
- The backend applies source-transcript quality gates (language mismatch / low-confidence segment mix) and skips weak segments instead of forwarding likely hallucinated text.
- Rolling context is maintained separately for source-language transcript text and translated output context to keep chunk-to-chunk quality stable.
- Built-in consistency rules are always on for Korean -> Chinese output (anchor and polarity checks); no user rule setup is required.
- In Translation Mode, use the `Source` toggle next to the Chinese panel download button to show/hide the source-language caption panel; active highlight indicates the panel is visible. The source panel header also includes a close icon (`✕`) for quick hide. Main page layout remains unchanged.
- Main window focuses on the target-language panel. The source panel is shown in Translation Mode and controlled by the `Source` toggle next to the target panel download button; active highlight indicates the source panel is visible.
- When the source panel is hidden in Translation Mode, the reference script panel keeps a stable width while only the target panel expands.
- Source panel labels now follow the selected source language (instead of always showing `English`).
- Projector window now includes the same `Source` show/hide behavior (default hidden), and the target panel expands when source is hidden.
- In Translation Mode, panel folding now uses a class-driven grid layout: when Source is hidden, Target expands while the Script panel keeps a stable width when present.
- Entering Translation Mode now defaults to Source collapsed, so Target and Script stay side-by-side for comparison; when Source is expanded, all three panels are side-by-side.
- Translation Mode panels now initialize to fit within the visible screen height on first load, with each panel scrolling internally for transcript comparison.
- Projector source heading now follows the selected source language (for example, `Korean`).
- Test audio picker accepts audio files only; non-audio selections are rejected with a status warning.
- Test audio picker now uses a native audio-filtered dialog first (with web/runtime fallback validation if needed).
- `Auto-save on stop` is configured in the `Settings` page, and you can choose a custom save folder (default remains `~/Desktop/ChurchTranslateSessions`).
- `ASR Confidence Guard` preset is configurable in `Settings` (`Strict`, `Balanced`, `Permissive`) to control how aggressively low-confidence source segments are skipped.
- Settings page information architecture update: `Appearance` now contains visual preferences only, while runtime controls (`ASR Confidence Guard`, `Tune Audio`, `Mock Mode`, `Auto-save on stop`) live under `Runtime & Audio`.
- Settings page cards now use a non-overlapping responsive layout: `Appearance` and `Runtime & Audio` align side-by-side on wide screens, while `Language Aids` spans full width below.
- Light themes refreshed for a more professional look: `Paper Light` now uses a clean slate-blue palette, and `Minimal Mono` uses a neutral editorial grayscale with blue focus/selection accents.
- Dark default theme refreshed with a tighter navy/cyan broadcast palette for better depth, focus visibility, and transcript readability.
- Dark theme further tuned to a premium midnight-blue profile with calmer surfaces, clearer sky-blue interaction highlights, and amber status contrast.
- UI iconography now uses inline SVG controls (instead of emoji-style icons) for consistent professional rendering across platforms.
- Accessibility improvements: added keyboard `Skip to main content` navigation and stronger visible focus states for interactive controls.
- Added a compact live observability strip in the header with queue depth, average render latency, skipped-segment count, and current engine mode (`Live API` vs `Mock`).
- Settings page hierarchy polish: added concise section subtitles and runtime state chips (`On`/`Off`) for `Mock Mode` and `Auto-save on stop` for faster scanning.
- Added `Transcript Density` setting (`Comfortable` / `Compact`) to tune side-by-side transcript readability; preference persists across sessions and applies in Translation Mode.
- Default transcript density is now adaptive on first launch: widths `<=1600px` start in `Compact`, wider screens start in `Comfortable` (and users can still override in Settings).
- Empty states are now action-oriented: reference script panel includes quick `Upload/Paste` actions, and glossary/STT keyword empty states include one-click `Paste & Add`.
- Key async actions now show loading states and temporary button lock (for example save keys, start/stop, import/export, paste script/keywords, auto-save folder pick, transcript export) to prevent duplicate clicks.
- Settings now include a sticky section context navigator (`Appearance`, `Runtime & Audio`, `Language Aids`) that highlights the active section and supports one-click jump scrolling.
- Observability strip now includes health tiers with guidance tooltips (`Good`, `Elevated`, `High`) for queue depth, average latency, skipped segments, and engine mode.
- `Runtime Preset` is now available in `Runtime & Audio` (`Low Latency`, `Balanced`, `High Accuracy`); selecting a preset updates `VAD Threshold`, `Silence Hold`, and `Max Segment` together, while manual tuning is tracked as `Custom`.
- `Runtime Preset` now includes an inline helper description in Settings so operators can quickly choose between low-latency, balanced, and high-accuracy behavior.
- Stable STT keywords now use a chip editor: paste one/multi-line terms to add in batch, keep source + target aliases (for example, `그리스도 (基督)`), and remove terms with one click.
- Glossary terms now use the same chip editor pattern: paste one/multi-line `source=target` terms, add in batch, remove by chip, and keep import/export compatibility.
- Sermon STT keywords still auto-normalize pasted/scripted entries into a single-line list for transmission.
- Whisper STT prompt hints automatically strip parenthetical target-language aliases and send only source-side terms for recognition priming.

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
- Visual regression tests (desktop baseline): `npm run test:visual`

## Open Source Project Docs

- License: [Apache-2.0](./LICENSE)
- Contributing: [CONTRIBUTING.md](./CONTRIBUTING.md)
- Code of Conduct: [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)
- Security Policy: [SECURITY.md](./SECURITY.md)
- Support: [SUPPORT.md](./SUPPORT.md)
