# Contributing

Thanks for your interest in contributing to Church Live Audio Translate.

## Before You Start

- Read the [Code of Conduct](./CODE_OF_CONDUCT.md).
- For security vulnerabilities, do not open a public issue.
  Use the process in [SECURITY.md](./SECURITY.md).
- Open an issue first for larger changes so we can align on direction.

## Development Setup

Requirements:

- Node.js 20+
- Rust (stable toolchain)

Install and run:

```bash
npm install
npm run start
```

Type-check frontend code:

```bash
npm run typecheck
```

Run unit tests:

```bash
npm run test:unit
```

Generate unit test coverage report:

```bash
npm run test:coverage
```

Run visual regression checks:

```bash
npm run test:visual
```

If your PR intentionally changes UI, update baselines:

```bash
npm run test:visual:update
```

## Pull Request Guidelines

- Keep changes focused and easy to review.
- Include a clear description of what changed and why.
- Reference related issues where applicable.
- Update docs (`README.md` or `/docs`) when user-facing behavior changes.
- Ensure the app still starts and key flows are verified before requesting review.
- Follow the merge gate in [docs/QA_GATE.md](./docs/QA_GATE.md).
- For UI changes, follow [docs/UI_REVIEW_RUBRIC.md](./docs/UI_REVIEW_RUBRIC.md).

## Commit Guidelines

- Use concise, descriptive commit messages.
- Prefer small commits with a single purpose.

## Areas That Need Help

- Translation quality tuning and language prompts
- UX improvements for live operator workflows
- Cross-platform packaging and release validation

Thank you for helping improve this project.
