# Branch Protection

Recommended GitHub settings for `main`:

- Require status checks to pass before merging.
- Require pull request reviews before merging.
- Dismiss stale pull request approvals when new commits are pushed.
- Require conversation resolution before merging.
- Do not allow bypassing the above settings.
- Restrict who can push to matching branches (optional, but recommended).

Required checks (suggested):

- `CI / Frontend`
- `CI / Marketing (www)`
- `CI / Rust Lint (src-tauri)`
- `CI / Rust Check (macos-latest)`
- `CI / Rust Check (ubuntu-22.04)`
- `CI / Rust Check (windows-latest)`
