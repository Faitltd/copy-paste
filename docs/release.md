# Releasing

This repo builds Copy Pasta (Tauri v1) with a Next.js frontend.

## Versioning

Tauri release/version comes from:

- `src-tauri/tauri.conf.json` -> `package.version`

Keep `package.json` version in sync if you want tags and installers to match your npm metadata.

## Updater

See `docs/updater.md`.

## GitHub Actions

The release workflow is in `.github/workflows/release.yml` and uses `tauri-apps/tauri-action`.
It runs on `workflow_dispatch` or when you push a tag matching `app-v*`.

It builds:

- macOS (universal)
- Windows
- Linux

Required secrets:

- `TAURI_PRIVATE_KEY`
- `TAURI_KEY_PASSWORD` (if your key is password protected)

Compatibility:

- Older workflows may use `TAURI_SIGNING_PRIVATE_KEY_PASSWORD`. The current workflow supports either secret name.

macOS signing/notarization secrets (required for fully automated macOS releases):

- `APPLE_CERTIFICATE` (base64-encoded `.p12`)
- `APPLE_CERTIFICATE_PASSWORD`
- `KEYCHAIN_PASSWORD`
- `APPLE_ID`
- `APPLE_PASSWORD` (app-specific password)
- `APPLE_TEAM_ID`

Windows code signing secrets (required for fully automated Windows releases):

- `WINDOWS_CERTIFICATE` (base64-encoded `.pfx` / `.p12`)
- `WINDOWS_CERTIFICATE_PASSWORD`

### Creating The Secrets

macOS `.p12`:

```bash
base64 -i "./certificate.p12" | pbcopy
```

Windows `.pfx` (on macOS/Linux):

```bash
base64 -i "./certificate.pfx"
```

## Local Build

```bash
pnpm install
pnpm next-build
pnpm build:unsigned
```

`pnpm build:unsigned` skips the updater bundle so it does not require signing keys.

For a signed (updater-enabled) build locally, set `TAURI_PRIVATE_KEY` (and optionally `TAURI_KEY_PASSWORD`) then run `pnpm build`.

## macOS Codesigning/Notarization Notes

- Production distribution on macOS typically requires codesigning and notarization.
- Tauri's GitHub Action supports signing/notarization when the appropriate secrets are configured.
- Validate the produced `.app`/`.dmg` with `codesign` and `spctl` before shipping.
