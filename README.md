# Pasta

Pasta is an open source clipboard manager for Mac (currently).

It's simple, lightweight and easy to use.

## How To Pasta

`cmd + Shift + V` , it's as easy as that.

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
pnpm build
```

## Updater / Releases

- Updater configuration: `docs/updater.md`
- Release notes: `docs/release.md`

## `www/` Folder

`www/` is a separate Next.js project (marketing/site). It is not used by the Tauri desktop app build.

To run it:

```bash
cd www
npm ci
npm run dev
```

Build with ❤️
