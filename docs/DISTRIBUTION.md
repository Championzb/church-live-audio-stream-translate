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
- `src-tauri/target/release/bundle/dmg/*.dmg`
- `dist/*` + `dist/SHA256SUMS.txt`

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

- Builds macOS + Windows bundles
- Creates a **draft GitHub Release**
- Uploads build bundles as workflow artifacts

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
