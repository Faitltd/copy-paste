# Production Readiness TODO

- [x] Persist clipboard history locally (Zustand + local storage).
- [x] Add tray menu actions (Show/Hide, Quit).
- [x] Run lint/typecheck now that build ignores are removed.
- [x] Define CSP and reduce Tauri allowlist to least privilege.
- [x] Tighten CSP for production (remove dev allowances like `unsafe-eval`/localhost).
- [x] Add privacy controls (consent + pause/resume monitoring).
- [x] Configure updater endpoints and signing verification.
- [x] Add crash reporting and structured logs.
- [x] Implement long-list performance (virtualized list).
- [x] Add release hardening docs (codesigning, notarization, CI packaging).
- [x] Repo cleanup: document or remove `www/` if not used.
