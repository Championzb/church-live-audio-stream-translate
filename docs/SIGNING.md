# Signing and Notarization Guide

This project can be distributed unsigned for internal use, but signed builds are strongly recommended for public deployment.

## macOS signing + notarization (recommended)

Set these GitHub repository secrets for CI:

- `APPLE_CERTIFICATE` (base64-encoded `.p12` certificate)
- `APPLE_CERTIFICATE_PASSWORD`
- `APPLE_SIGNING_IDENTITY` (for example: `Developer ID Application: Your Org (TEAMID)`)
- `APPLE_ID`
- `APPLE_PASSWORD` (app-specific password)
- `APPLE_TEAM_ID`

How to prepare certificate secret locally:

```bash
base64 -i developer-id.p12 | pbcopy
```

Then paste clipboard into `APPLE_CERTIFICATE` secret.

## Windows signing (recommended)

For full Windows code signing, use a trusted code-signing certificate and sign the generated `.msi` in CI or in a secure signing machine.

Suggested secrets (if you implement signtool/codesign step):

- `WINDOWS_CERTIFICATE` (base64 `.pfx`)
- `WINDOWS_CERTIFICATE_PASSWORD`

## Tauri updater signature (optional)

If you add in-app updater support later, define:

- `TAURI_SIGNING_PRIVATE_KEY`
- `TAURI_SIGNING_PRIVATE_KEY_PASSWORD`

These are not the same as OS code-signing certificates.

## Security notes

- Never commit certificates or private keys.
- Store secrets only in CI secret stores.
- Rotate credentials periodically and after team changes.
