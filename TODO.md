# Production Readiness TODO

## Done

- [x] Persist clipboard history locally (Zustand + local storage).
- [x] Add tray menu actions (Show/Hide, Quit).
- [x] Add privacy controls (consent + pause/resume monitoring, default off).
- [x] Define CSP and reduce Tauri allowlist to least privilege.
- [x] Tighten CSP for production (remove dev allowances like `unsafe-eval`/localhost).
- [x] Configure updater endpoints and signing verification.
- [x] Add structured logs (Rust log plugin + JS error forwarding).
- [x] Implement long-list performance (virtualized list).
- [x] Repo cleanup: document `www/` (separate marketing Next app).
- [x] Align versions across `package.json`, `src-tauri/Cargo.toml`, and `src-tauri/tauri.conf.json`.
- [x] Remove unused files and placeholders (unused CSS, autostart plugin).
- [x] Add CI workflow (`pnpm lint/tsc/next-build` + `cargo fmt/clippy/check`).
- [x] Harden release workflow (manual/tag trigger, pinned tauri-action, frozen lockfile, published releases).
- [x] Rename app branding to "Copy Pasta" (UI, configs, docs, `www/`).
- [x] Update app icon (orange macaroni noodle).

## Still Needed (Before Shipping)

- [x] Confirm licensing/copyright and update `LICENSE` and package metadata accordingly.
- [x] Configure macOS signing + notarization in `.github/workflows/release.yml`.
- [x] Decide supported platforms (macOS + Windows + Linux) and update release matrix accordingly.
- [x] Fill in Tauri bundle metadata in `src-tauri/tauri.conf.json` (descriptions, copyright).
- [ ] Add branch protection rules in GitHub (require CI checks, disallow direct pushes to `main`). See `docs/branch-protection.md`.
- [ ] Run a release drill (manual), then confirm:
- [ ] Release artifacts install and run on macOS, Windows, and Linux.
- [ ] Updater works end-to-end using `latest.json` from GitHub Releases.
- [x] Document the release drill steps. See `docs/release-drill.md`.
- [x] Add a short privacy note (README or in-app) describing clipboard capture and where data is stored.
