# Release Drill

1. Bump version in:
- `package.json`
- `src-tauri/tauri.conf.json`
- `src-tauri/Cargo.toml`

2. Commit the version bump.

3. Tag and push:

```bash
git tag "app-vX.Y.Z"
git push origin "app-vX.Y.Z"
```

4. Watch GitHub Actions:

- Confirm `.github/workflows/release.yml` succeeds on macOS, Windows, Linux.
- Confirm the GitHub Release is published (not draft).
- Confirm `latest.json` and `latest.json.sig` exist as release assets.

5. Validate artifacts:

- macOS: open the `.dmg`, drag app to Applications, run it.
- Windows: install via `.msi`, run it.
- Linux: run the `.AppImage` (and/or install `.deb`).

6. Validate updater:

- Install `vX.Y.(Z-1)`, then publish `vX.Y.Z`.
- Launch the older version and confirm it updates to `vX.Y.Z`.

