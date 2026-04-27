# Agent Instructions

These project rules apply to every coding context window/session:

1. Commit every implementation step.
   - After each completed step, create a git commit with a clear message.
   - Do not batch many unrelated steps into one commit.

2. Keep `README.md` up to date for each step when needed.
   - If a step changes user-visible behavior, setup flow, hotkeys, packaging, testing, configuration, or security handling, update `README.md` in the same step.
   - If no README update is needed, explicitly verify that the current README is still accurate before committing.

3. Prefer small, traceable changes.
   - Stage only files related to that step.
   - Keep commits easy to review and rollback.
