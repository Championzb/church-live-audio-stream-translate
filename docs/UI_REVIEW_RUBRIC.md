# UI Review Rubric

Use this rubric for any pull request that changes user interface behavior, layout, or styling.

## Required PR Evidence

The PR must include:

- Before/after screenshots for desktop and narrow/mobile width
- Visual regression result (`npm run test:visual`) passing in CI or attached in PR notes
- A short explanation of what changed and why it improves operator workflow

## Functional Acceptance

Reviewers should verify critical controls still work:

- `F8` Start/Stop
- `F7` Suspend/Resume translation
- `F6` Translation Mode enter/exit (and `Esc` exit)
- `F2` Lock/Unlock controls
- `F1` Help overlay toggle
- `F4` Session reset
- Projector window open/update behavior
- Transcript export flow

## Layout and Visual Acceptance

Approve only if all are true:

- No clipped, hidden, or overlapping controls at common desktop widths
- No obvious layout break at narrow/mobile width
- Control alignment and spacing are consistent with surrounding UI
- Visual hierarchy is clear (title > section > controls > helper text)
- Disabled, active, loading, and error states are distinguishable

## Usability and Accessibility Acceptance

Approve only if all are true:

- Primary controls remain discoverable in the expected locations
- Hotkey hints remain visible and accurate
- Icon/button hit targets remain practical for mouse and trackpad use
- Contrast/readability does not regress in live-service environments

## Regression Guard

- If visual snapshot diffs include unrelated screens/areas, request clarification or split changes.
- If broad snapshot churn appears without explanation, request changes.

## Reviewer Decision Rule

- Approve only when all required evidence is present and all checklist sections pass.
- Request changes when any item is missing, unclear, or regressed.
