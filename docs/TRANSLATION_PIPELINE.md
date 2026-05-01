# Translation Pipeline

Use this for architecture, API behavior, and latency troubleshooting.

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

## Sequence And Latency

If your markdown viewer cannot render Mermaid, use the text fallback right below.

```mermaid
sequenceDiagram
  participant FE as Frontend (VAD + Queue)
  participant BE as Tauri Backend
  participant OA as OpenAI Audio API
  participant OR as OpenAI Responses API

  FE->>FE: Capture audio and run VAD segmentation
  Note over FE: Latency hotspot 1: VAD timers and segment boundaries

  FE->>BE: invoke(process_segment, audio chunk)
  BE->>OA: POST /v1/audio/translations (whisper-1)
  OA-->>BE: English transcript
  Note over OA,BE: Latency hotspot 2: speech model inference plus network RTT

  BE->>OR: POST /v1/responses (gpt-4o-mini)
  OR-->>BE: Translated text
  Note over OR,BE: Latency hotspot 3: text model inference plus network RTT

  BE-->>FE: Return english, translated, warning
  FE->>FE: Render transcript cards and projector sync
  Note over FE: Queue wait can add delay under heavy speech
```

Text fallback:

1. Frontend captures audio and segments with VAD.
2. Frontend sends `process_segment` chunk to backend.
3. Backend calls `/v1/audio/translations` and gets English transcript.
4. Backend calls `/v1/responses` for target-language translation.
5. Backend returns `{ english, translated, warning }`.
6. Frontend renders panels and syncs projector output.

## Normal Korean -> Chinese Call Pattern (2 APIs)

1. `/v1/audio/translations` (`whisper-1`) for Korean speech -> English text
2. `/v1/responses` (`gpt-4o-mini`) for English -> Chinese

## Where Latency Is Usually Spent

1. Segmentation wait (frontend): chunk waits for silence hold or max segment boundary.
2. Audio API inference + network: often dominant for noisy or long chunks.
3. Text API inference + network: second model call adds processing time.
4. Queue backlog: sequential queue reduces burst failures but can add wait.

## Prompt Priming Notes

- STT prompt priming means sending context hints (rolling context + keywords + script hints) to improve recognition quality.
- Stable STT keywords and sermon-specific STT keywords help API 1 (speech recognition).
- Glossary helps API 2 (translation wording consistency).

## Deep Reference Notes

- Shared bottom status bar shows run state, translation state, translation-mode state, queue size.
- Hotkey pills are clickable and state-aware (Start/Stop, Suspend/Resume, and more).
- Settings page separates advanced controls from live captions.
- Translation Mode uses sticky live control bar + compact hotkey map.
- Script panel supports independent scrolling in Translation Mode.
- Segment queue is sequential with retries to reduce burst failures.
- Auto-save writes transcript files to `~/Desktop/ChurchTranslateSessions` when enabled.
