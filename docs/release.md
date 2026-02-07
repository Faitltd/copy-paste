# Releasing

This repo builds a Tauri (v1) desktop app with a Next.js frontend.

## Versioning

Tauri release/version comes from:

- `src-tauri/tauri.conf.json` -> `package.version`

Keep `package.json` version in sync if you want tags and installers to match your npm metadata.

## Updater

See `docs/updater.md`.

## GitHub Actions

The release workflow is in `.github/workflows/release.yml` and uses `tauri-apps/tauri-action`.
It runs on `workflow_dispatch` or when you push a tag matching `app-v*`.

Required secrets:

- `TAURI_PRIVATE_KEY`
- `TAURI_KEY_PASSWORD` (if your key is password protected)

Compatibility:

- Older workflows may use `TAURI_SIGNING_PRIVATE_KEY_PASSWORD`. The current workflow supports either secret name.

Recommended (macOS signing/notarization) secrets:

- Apple Developer signing certificate + password (names depend on how you wire the action)
- Apple notarization API credentials (key id/issuer id/private key)

## Local Build

```bash
pnpm install
pnpm next-build
pnpm tauri build
```

## macOS Codesigning/Notarization Notes

- Production distribution on macOS typically requires codesigning and notarization.
- Tauri's GitHub Action supports signing/notarization when the appropriate secrets are configured.
- Validate the produced `.app`/`.dmg` with `codesign` and `spctl` before shipping.
