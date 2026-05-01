## Summary

Describe what changed and why.

## Risk Review

- Potential user-visible regressions:
- Safety/rollback plan:

## Functional Validation

- [ ] `npm run typecheck`
- [ ] Manual critical-flow smoke test:
- [ ] `F8` Start/Stop
- [ ] `F7` Suspend/Resume translation
- [ ] `F6` Translation Mode enter/exit (`Esc`)
- [ ] `F2` Lock/Unlock controls
- [ ] `F1` Help overlay
- [ ] `F4` Session reset
- [ ] Projector window flow
- [ ] Transcript export flow
- [ ] Test audio file flow
- [ ] Packaging/release checks (if relevant)

## UI Validation (Required For UI Changes)

- [ ] Reviewed against `docs/UI_REVIEW_RUBRIC.md`
- [ ] Before/after screenshots attached
- [ ] No clipping/overlap at desktop width
- [ ] No layout break at narrow/mobile width
- [ ] Hotkey hints and primary controls remain visible
- [ ] `npm run test:visual` passed

## Docs and Security Checks

- [ ] `README.md` updated for user-visible changes
- [ ] `docs/QA_GATE.md` considered for any gate changes
- [ ] Security-sensitive changes reviewed
- [ ] No secrets committed
