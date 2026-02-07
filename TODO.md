# Production Readiness TODO

- [x] Persist clipboard history locally (Zustand + local storage).
- [x] Add tray menu actions (Show/Hide, Quit).
- [x] Run lint/typecheck now that build ignores are removed.
- [x] Define CSP and reduce Tauri allowlist to least privilege.
- [ ] Tighten CSP for production (remove dev allowances like `unsafe-eval`/localhost).
- [x] Add privacy controls (consent + pause/resume monitoring).
- [ ] Configure updater endpoints and signing verification.
- [ ] Add crash reporting and structured logs.
- [ ] Implement long-list performance (virtualized list).
- [ ] Add release hardening docs (codesigning, notarization, CI packaging).
- [ ] Repo cleanup: document or remove `www/` if not used.
