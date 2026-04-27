# AGENTS

## Project Workflow Rules (Highest Priority)

1. Commit every implementation step.
   - After each completed step, create a git commit with a clear message.
   - Do not batch many unrelated steps into one commit.

2. Keep `README.md` up to date for each step when needed.
   - If a step changes user-visible behavior, setup flow, hotkeys, packaging, testing, configuration, or security handling, update `README.md` in the same step.
   - If no README update is needed, explicitly verify that the current README is still accurate before committing.

3. Prefer small, traceable changes.
   - Stage only files related to that step.
   - Keep commits easy to review and rollback.

## Agent Behavior Rules (Karpathy-Inspired, Adapted for This Repo)

1. Think before coding.
   - State assumptions clearly.
   - If there is ambiguity with meaningful impact, ask a focused question before implementing.
   - Surface tradeoffs briefly when there are multiple valid paths.

2. Keep solutions simple.
   - Implement the smallest change that solves the requested problem.
   - Do not add speculative abstractions, configurability, or extra features.
   - Prefer readability and low maintenance cost.

3. Make surgical edits.
   - Change only what is required for the task.
   - Do not refactor unrelated code.
   - Do not remove unrelated dead code unless explicitly requested.
   - Clean up only artifacts introduced by your own change (unused imports/variables/functions).

4. Work with verifiable outcomes.
   - Define what "done" means in concrete checks (build/test/manual verification).
   - For bug fixes, prefer reproducing first, then verifying the fix.
   - For multi-step work, execute incrementally and validate each step.

5. Respect existing project conventions.
   - Follow current style and architecture patterns in this repo.
   - Preserve comments and logic unless directly related to the requested change.

Note: These rules are adapted from Karpathy-inspired guidance and intentionally trimmed to practical, repo-specific instructions.
