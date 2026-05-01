# QA Gate (Open Source)

This gate defines minimum quality checks before merging pull requests and before cutting a public release.

## Goals

1. No core feature regressions in live operation flows.
2. UI stays functional, aligned, and visually consistent across key screens.

## Merge Gate (every PR)

All items below must pass:

- `npm ci`
- `npm run typecheck`
- `npm run test:coverage`
- `npm run test:visual`
- Manual critical-flow smoke test (see checklist below)
- For UI changes: include before/after screenshots in the PR

## Release Gate (tags/manual release)

All merge-gate checks plus:

- `npm run build:mac` (or target-appropriate bundle build)
- `npm run dist:collect`
- `npm run release:check:all` (if signing flow is configured)

## Manual Critical-Flow Checklist

Validate these operator flows in a real app run:

1. Start/stop translation (`F8`) works and status chips update.
2. Suspend/resume translation (`F7`) works without stopping capture.
3. Translation mode toggle (`F6`) enters/exits correctly, including `Esc`.
4. Lock/unlock controls (`F2`) correctly disables/enables configuration fields.
5. Help overlay toggle (`F1`) opens and closes.
6. Reset session (`F4`) clears queue, captions, transcript, and related state.
7. Projector window opens, updates, and shows live status normally.
8. Export transcript succeeds and generated file content is valid.
9. Test audio file flow still processes and updates caption panels.

## UI Acceptance Criteria

For each modified view:

- No clipped or overlapping controls at common desktop widths.
- No broken layout at narrow/mobile width.
- Primary controls remain discoverable and keyboard/hotkey cues remain visible.
- Contrast/readability does not regress against current baseline.

## Visual Regression Baselines

Baseline snapshots are stored under `tests/visual/`.

- Update snapshots intentionally only when UI changes are expected.
- Keep snapshot updates in the same PR as the UI change.
- Review diffs for alignment, spacing, and state-label correctness before approval.
