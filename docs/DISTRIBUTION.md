# Distribution Guide

This guide explains how to package and publish installers for Church Live Translate.

## 1) Local macOS build

```bash
npm ci
npm run build:mac
npm run dist:collect
```

Expected local outputs:

- `src-tauri/target/release/bundle/macos/*.app`
- `dist/*.app.zip` + `dist/SHA256SUMS.txt`

Optional DMG build:

```bash
npm run build:mac:dmg
```

## 2) Local Windows build

Run on a Windows machine:

```powershell
npm ci
npm run build:win
npm run dist:collect
```

Expected output:

- `src-tauri/target/release/bundle/msi/*.msi`
- `dist/*` + `dist/SHA256SUMS.txt`

## 3) CI release build (recommended)

The workflow `.github/workflows/distribution.yml` can be triggered in two ways:

- Push a tag like `v0.3.0`
- Manual run from GitHub Actions (`workflow_dispatch`)

CI behavior:

- Builds macOS `.app` + Windows `.msi` bundles
- Creates a **draft GitHub Release**
- Uploads build bundles as workflow artifacts
- Includes unsigned installation steps directly in release body

## 4) Suggested release checklist

1. Confirm app version in `package.json` and `src-tauri/tauri.conf.json`.
2. Run `cargo check --manifest-path src-tauri/Cargo.toml`.
3. Run `npm run build` on target OS (or CI tag build).
4. Run `npm run dist:collect` and keep `SHA256SUMS.txt`.
5. Smoke test installer on a clean machine.
6. Publish release notes.

## 5) Signing notes

- macOS: code signing and notarization are recommended for public distribution.
- Windows: Authenticode signing is recommended to reduce SmartScreen warnings.
- Detailed secret/setup instructions: `docs/SIGNING.md`.

## 6) Preflight checks

Before creating signed builds, validate environment variables:

```bash
npm run release:check:mac
npm run release:check:all
```
