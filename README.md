# Church Live Audio Translate (Multi-language Input -> English -> Multi-language Output)

Desktop subtitle app for Windows and macOS using Tauri.

## Start Here (By Role)

- Service operator (run live captions): [Operator Guide](./docs/OPERATOR_GUIDE.md)
- Church admin / setup owner (keys, language aids, audio setup): [Setup And Configuration](./docs/SETUP_AND_CONFIG.md)
- Developer / maintainer (architecture, APIs, latency): [Translation Pipeline](./docs/TRANSLATION_PIPELINE.md)
- Sermon prep helper prompt (Korean script -> Chinese script + STT keywords): [Script Prep Prompt](./docs/SCRIPT_PREP_PROMPT.md)

## Core Docs

- [Operator Guide](./docs/OPERATOR_GUIDE.md)
- [Setup And Configuration](./docs/SETUP_AND_CONFIG.md)
- [Translation Pipeline](./docs/TRANSLATION_PIPELINE.md)
- [Script Prep Prompt](./docs/SCRIPT_PREP_PROMPT.md)

## Release / QA Docs

- Distribution playbook: [docs/DISTRIBUTION.md](./docs/DISTRIBUTION.md)
- Signing and notarization: [docs/SIGNING.md](./docs/SIGNING.md)
- QA checklist: [docs/TEST_PLAN.md](./docs/TEST_PLAN.md)
- QA merge/release gate: [docs/QA_GATE.md](./docs/QA_GATE.md)
- UI review rubric: [docs/UI_REVIEW_RUBRIC.md](./docs/UI_REVIEW_RUBRIC.md)

## Automated Test Commands

- Typecheck: `npm run typecheck`
- Unit tests: `npm run test:unit`
- Unit test coverage report: `npm run test:coverage`
- Visual regression tests: `npm run test:visual`

## Open Source Project Docs

- License: [Apache-2.0](./LICENSE)
- Contributing: [CONTRIBUTING.md](./CONTRIBUTING.md)
- Code of Conduct: [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)
- Security Policy: [SECURITY.md](./SECURITY.md)
- Support: [SUPPORT.md](./SUPPORT.md)
