# Church Live Audio Translate (Multi-language Input -> English -> Multi-language Output)

Desktop subtitle app for Windows and macOS using Tauri.

## Table of contents

- [Open source project docs](#open-source-project-docs)
- [Who should read what](#who-should-read-what)
- [At a glance](#at-a-glance)
- [Operator quick start](#operator-quick-start)
- [Operator hotkeys](#operator-hotkeys)
- [Setup and configuration](#setup-and-configuration)
- [Developer setup](#developer-setup)
- [Project structure](#project-structure)
- [Deep reference notes](#deep-reference-notes)
- [Translation sequence and latency](#translation-sequence-and-latency)
- [App logs (for distributed troubleshooting)](#app-logs-for-distributed-troubleshooting)
- [Prompt template: Korean source -> Chinese script + STT keywords](#prompt-template-korean-source---chinese-script--stt-keywords)
- [Broadcast workflow](#broadcast-workflow)
- [Audio input options (Windows/macOS)](#audio-input-options-windowsmacos)
- [Packaging installers](#packaging-installers)

## Open source project docs

- License: [Apache-2.0](./LICENSE)
- Contributing guide: [CONTRIBUTING.md](./CONTRIBUTING.md)
- Code of conduct: [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)
- Security policy: [SECURITY.md](./SECURITY.md)
- Support guide: [SUPPORT.md](./SUPPORT.md)

## Who Should Read What

- **Service operator (run the app during worship):** read `Operator quick start` and `Operator hotkeys`.
- **Church admin / setup owner (keys, projector, language aids):** read `Setup and configuration`.
- **Developer / maintainer:** read `Developer setup`, `Project structure`, and `Translation sequence and latency`.

## At A Glance

- Multi-language sermon input: Korean, English, Japanese, Chinese.
- Primary flow: speech -> English (internal) -> target language captions.
- Target-language-first operator UI with optional Translation Mode (`F6`) showing English + target panels.
- Built-in live controls: start/stop (`F8`), suspend (`F7`), lock (`F2`), reset (`F4`), help (`F1`).
- Projector window for subtitle-only second-screen output.
- Language aids:
  - `Glossary` for translation consistency (`EN=ZH`).
  - stable `STT Keywords` (settings).
  - sermon-specific keywords (Script modal upload/paste/clear).

## Operator Quick Start

1. Open app, enter OpenAI key once, click `Save Key`.
2. Choose `Audio Input`, source language, target language.
3. Optional: load reference script and sermon keywords from `Script` modal.
4. Optional: tune `VAD Threshold`, `Silence Hold`, `Max Segment`.
5. Press `Start` (`F8`).
6. Use `Suspend` (`F7`) during songs/prayer if needed.
7. Use `Translation Mode` (`F6`) for subtitle-focused layout.
8. Open `Projector Window` for audience output.
9. Export transcript or rely on auto-save on stop.

## Operator Hotkeys

- `F8`: Start/Stop
- `F7`: Suspend/Resume translation
- `F6`: Toggle Translation Mode
- `F4`: Reset session
- `F2`: Lock/Unlock controls
- `F1`: Show/Hide help
- `Esc`: Exit Translation Mode

## Setup And Configuration

### Keys and project cost

- API key is stored in OS secure storage (Keychain/Credential Manager) with local fallback.
- Optional Admin key + Project ID enable richer OpenAI project cost visibility.
- Key update is available via masked-key control in bottom status bar.

### Language aids (recommended workflow)

- Stable week-to-week terms:
  - put in `Settings` -> `Language Aids` -> `STT Keywords`.
- Sermon-specific terms:
  - use Script modal -> `Upload/Paste Sermon Keywords` each service.
- Translation consistency terms:
  - use `Glossary` (`EN=ZH`, one per line).
- Reference sermon text:
  - upload/paste script in Script modal for translation context.

### Live tuning defaults (Korean-optimized)

- `VAD Threshold`: `0.04`
- `Silence Hold`: `1500ms`
- `Max Segment`: `15000ms`

## Developer Setup

### Requirements

- Node.js 20+
- Rust stable toolchain
- OpenAI API key

### Run locally

```bash
npm install
npm run start
```

### Verify frontend types

```bash
npm run typecheck
```

## Project Structure

- `src/`: frontend UI (HTML/CSS/TypeScript), audio capture, VAD, queue, caption rendering.
- `src-tauri/`: Rust backend (Tauri commands, API calls, storage, packaging).
- `AGENTS.md`: repository-level agent guidance.

## Deep Reference Notes

Use this section for detailed behavior and edge-case notes.

- Shared bottom status bar shows run state, translation state, translation-mode state, queue size.
- Hotkey pills are clickable and state-aware (Start/Stop, Suspend/Resume, etc.).
- Settings page separates advanced controls from live captions.
- Translation Mode uses sticky live control bar + compact hotkey map.
- Script panel supports independent scrolling in Translation Mode.
- Transcript cards support per-line copy, row selection, and delay badge (`Delay: N ms`).
- Segment queue is sequential with retries to reduce burst failures.
- STT prompt priming combines rolling context, keywords, and script-derived hints.
- Translation prompt is reference-anchored to script/glossary context.
- Auto-save writes transcript files to `~/Desktop/ChurchTranslateSessions` when enabled.

## Translation sequence and latency

```mermaid
sequenceDiagram
  participant FE as "Frontend (VAD + Queue)"
  participant BE as "Tauri Backend"
  participant OA as "OpenAI Audio API"
  participant OR as "OpenAI Responses API"

  FE->>FE: "Capture audio + VAD segmentation"
  Note over FE: "Latency hotspot #1: VAD timers<br/>Silence Hold + Max Segment govern when a chunk can be sent."

  FE->>BE: "invoke(process_segment, audio chunk)"
  BE->>OA: "POST /v1/audio/translations (whisper-1)<br/>with STT prompt priming"
  OA-->>BE: "English transcript"
  Note over OA,BE: "Latency hotspot #2: speech model inference + network RTT"

  BE->>OR: "POST /v1/responses (gpt-4o-mini)<br/>English -> target language"
  OR-->>BE: "Translated text"
  Note over OR,BE: "Latency hotspot #3: text model inference + network RTT"

  BE-->>FE: "{ english, translated, warning }"
  FE->>FE: "Render transcript cards + projector sync"
  Note over FE: "Small local cost; queue wait can add delay under heavy speech."
```

### Normal Korean -> Chinese call pattern (2 API calls)

1. Audio translation call: `/v1/audio/translations` (`whisper-1`) for Korean speech -> English text
2. Text translation call: `/v1/responses` (`gpt-4o-mini`) for English -> Chinese

### Where latency is usually spent

1. **Segmentation wait (frontend):** chunk must wait for silence hold or max segment boundary.
2. **Audio API inference + network:** first OpenAI call usually dominates under noisy/long chunks.
3. **Text API inference + network:** second OpenAI call adds additional model time.
4. **Queue backlog:** sequential queue prevents burst failures but can add wait during fast speech.

## App logs (for distributed troubleshooting)

- macOS log file: `~/Library/Logs/com.church.live.translate/app.log`
- Quick tail command:
  - `tail -f ~/Library/Logs/com.church.live.translate/app.log`
- API key storage diagnostics are logged with prefix: `[api-key-storage]`
- Project cost fetch diagnostics (request/decode errors, totals) are logged with prefix: `[project-costs]`

## Prompt template: Korean source -> Chinese script + STT keywords

Use this template when preparing sermon content from DOCX/PDF-extracted Korean text:

```text
You are an expert theological translator and live-STT preparation assistant for church sermons.

I will provide a Korean sermon source document (extracted from DOCX/PDF).  
Your job is to produce:
1) A full Chinese translated script that preserves structure and readability.
2) STT keyword lists (stable + sermon-specific) for live speech recognition priming.

IMPORTANT OUTPUT RULES
- Do NOT output everything in one JSON object.
- Preserve script structure in Markdown (headings, paragraph breaks, lists, scripture blocks).
- Then output keywords as strict JSON in a second section.
- Do NOT add commentary outside the required two sections.

TRANSLATION REQUIREMENTS
- Translate the FULL content (no summarization, no omissions).
- Target language: Simplified Chinese (zh-hans).
- Keep theological meaning faithful and natural for church context.
- Preserve names, places, Bible references, and doctrinal terms accurately.
- For scripture passages, use standard Chinese Bible-style wording where possible.
- Keep section boundaries and flow aligned with source.
- If source includes stage cues or speaker notes, preserve them clearly.
- Keep punctuation and paragraphing readable for live reading/projector use.

STT KEYWORD REQUIREMENTS
Create two deduplicated keyword lists:
1) stt_keywords_stable
- Recurring church terms likely reused week to week.
- Examples: Bible books, core doctrinal terms, recurring ministry vocabulary.

2) stt_keywords_sermon_specific
- Terms unique to this sermon/day.
- Examples: person names, place names, event names, unusual theological terms, key phrases.

Keyword formatting rules:
- Prefer English forms when possible (best for STT priming in this pipeline).
- Keep each keyword concise (1-4 words when possible).
- No duplicates (case-insensitive).
- Max 80 items per list.
- Keep only practical, high-value terms.

STRICT OUTPUT FORMAT (exactly two sections)

[SECTION 1: CHINESE_SCRIPT_MARKDOWN]
(Full translated script in Markdown, preserving structure. No JSON here.)

[SECTION 2: STT_KEYWORDS_JSON]
```json
{
  "stt_keywords_stable": ["..."],
  "stt_keywords_sermon_specific": ["..."]
}
```

SOURCE KOREAN TEXT:
<<<PASTE_EXTRACTED_KOREAN_TEXT_HERE>>>
```

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
