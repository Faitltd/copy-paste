# Copy Pasta

Copy Pasta is an open source clipboard manager for macOS, Windows, and Linux.

It's simple, lightweight and easy to use.

## How To Copy Pasta

`Cmd/Ctrl + Shift + V`, it's as easy as that.

## Development

Prereqs:

- Node.js + `pnpm`
- Rust toolchain (for Tauri)

Run the desktop app in dev:

```bash
pnpm install
pnpm dev
```

Build:

```bash
pnpm next-build
pnpm build:unsigned
```

`pnpm build:unsigned` skips the updater bundle so it does not require signing keys.

Signed builds (required for updater-enabled release artifacts) require setting `TAURI_PRIVATE_KEY` and optionally `TAURI_KEY_PASSWORD` before running `pnpm build`.

## Updater / Releases

- Updater configuration: `docs/updater.md`
- Release notes: `docs/release.md`

## Privacy

- Clipboard monitoring is disabled by default. Enable it in-app to start capturing.
- Clipboard history is stored locally on your machine.

## `www/` Folder

`www/` is a separate Next.js project (marketing/site). It is not used by the Tauri desktop app build.

To run it:

```bash
cd www
npm ci
npm run dev
```

Build with ❤️
