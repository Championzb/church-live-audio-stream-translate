# Operator Guide

Use this during live worship translation.

Related docs:
- Setup and machine prep: [SETUP_AND_CONFIG.md](./SETUP_AND_CONFIG.md)
- Service-day checks: [TEST_PLAN.md](./TEST_PLAN.md)

## At A Glance

- Multi-language sermon input: Korean, English, Japanese, Chinese.
- Primary flow: speech -> source transcript -> target language captions.
- Target-language-first UI with optional Translation Mode (`F6`) showing source + target panels.
- Built-in controls: start/stop (`F8`), suspend (`F7`), lock (`F2`), reset (`F4`), help (`F1`).
- Projector window for subtitle-only second-screen output.

## Quick Start

1. Open app, enter OpenAI key once, select `STT Provider` (`OpenAI` or `Groq`), then click `Save Key`.
2. If you selected `Groq`, also enter a Groq API key before saving.
3. Choose `Audio Input`, source language, target language.
4. Optional: load reference script and sermon keywords from `Script` modal.
5. Optional: tune `VAD Threshold`, `Silence Hold`, `Max Segment`.
6. Press `Start` (`F8`).
7. Use `Suspend` (`F7`) during songs/prayer if needed.
8. Use `Translation Mode` (`F6`) for subtitle-focused layout.
9. Open `Projector Window` for audience output.
10. Export transcript or rely on auto-save on stop (folder from `Settings`, default `~/Desktop/ChurchTranslateSessions`).

## Hotkeys

- `F8`: Start/Stop
- `F7`: Suspend/Resume translation
- `F6`: Toggle Translation Mode
- `F4`: Reset session
- `F2`: Lock/Unlock controls
- `F1`: Show/Hide help
- `Esc`: Exit Translation Mode

## Live Controls Reference

- `VAD Threshold`: Speech sensitivity threshold. Lower catches quieter speech, but can trigger on noise.
- `Silence Hold (ms)`: How long silence must continue before the current segment ends.
- `Max Segment (ms)`: Hard cap for one segment length, even if speech continues.

Recommended Korean defaults:
- `VAD Threshold`: `0.04`
- `Silence Hold`: `1500`
- `Max Segment`: `15000`

## Transcript Cards

- Per-card delay badge (`Delay: N ms`) shows capture-to-render latency.
- Each row supports copy/select for quick reuse.

## Broadcast Workflow

Use this app on the subtitle display machine. The translator reads Chinese subtitles aloud into your existing broadcast system.
