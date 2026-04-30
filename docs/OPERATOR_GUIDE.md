# Operator Guide

Use this during live worship translation.

## At A Glance

- Multi-language sermon input: Korean, English, Japanese, Chinese.
- Primary flow: speech -> English (internal) -> target language captions.
- Target-language-first UI with optional Translation Mode (`F6`) showing English + target panels.
- Built-in controls: start/stop (`F8`), suspend (`F7`), lock (`F2`), reset (`F4`), help (`F1`).
- Projector window for subtitle-only second-screen output.

## Quick Start

1. Open app, enter OpenAI key once, click `Save Key`.
2. Choose `Audio Input`, source language, target language.
3. Optional: load reference script and sermon keywords from `Script` modal.
4. Optional: tune `VAD Threshold`, `Silence Hold`, `Max Segment`.
5. Press `Start` (`F8`).
6. Use `Suspend` (`F7`) during songs/prayer if needed.
7. Use `Translation Mode` (`F6`) for subtitle-focused layout.
8. Open `Projector Window` for audience output.
9. Export transcript or rely on auto-save on stop.

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
