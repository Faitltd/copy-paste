# Updater

This app uses the built-in Tauri updater (v1) with signed update artifacts.

## How It Works

- The app checks an update feed URL (`latest.json`) configured in `src-tauri/tauri.conf.json`.
- Each release includes signed artifacts plus a `latest.json` and `latest.json.sig`.
- The app verifies signatures using the `pubkey` embedded in `src-tauri/tauri.conf.json`.

Current feed URL:

- `https://github.com/Faitltd/copy-paste/releases/latest/download/latest.json`

Note: GitHub draft releases are not visible to the updater. Publish the release for clients to see it.

Note: With updater signing enabled, `tauri build` requires `TAURI_PRIVATE_KEY` (and optionally `TAURI_KEY_PASSWORD`) or it will fail. For local packaging without signing, use `pnpm build:unsigned` (skips the updater bundle).

## Generating Signing Keys

Generate a keypair locally (do not commit the private key):

```bash
pnpm tauri signer generate
```

For CI-friendly generation:

```bash
pnpm tauri signer generate --ci -p "<PASSWORD>" -w "./tauri-signing.key"
```

The command prints a `pubkey` value. Put that in `src-tauri/tauri.conf.json` under `tauri.updater.pubkey`.

## GitHub Secrets

The release workflow expects:

- `TAURI_PRIVATE_KEY`: the private key contents (not a path)
- `TAURI_KEY_PASSWORD`: private key password (if you used one)

Compatibility:

- Older workflows may use `TAURI_SIGNING_PRIVATE_KEY_PASSWORD`. The current workflow supports either secret name.

## Local Verification (Optional)

You can sign any file and inspect the generated `.sig`:

```bash
pnpm tauri signer sign -k "./tauri-signing.key" -p "<PASSWORD>" "./path/to/file"
```
