# Security Policy

## Supported Versions

This project is currently maintained as a rolling release.
Security fixes are applied to the latest code on `main`.

## Reporting a Vulnerability

Please do not report security issues in public GitHub issues.

Use GitHub Private Vulnerability Reporting:
<https://github.com/bzhang/church-live-audio-stream-translate/security/advisories/new>

Please include:

- A clear description of the issue
- Reproduction steps or proof of concept
- Impact assessment
- Suggested mitigation (if known)

You can expect an initial response within 5 business days.

## Scope Notes

Security-sensitive areas include:

- API key handling and secure storage
- CI signing credentials and release pipelines
- Tauri command surface and file-system access
