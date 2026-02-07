import { spawnSync } from "node:child_process"

const bundlesFromPlatform = (platform) => {
  switch (platform) {
    case "darwin":
      return "app,dmg"
    case "win32":
      return "msi"
    default:
      return "appimage,deb"
  }
}

const bundles = process.env.UNSIGNED_BUNDLES ?? bundlesFromPlatform(process.platform)

const result = spawnSync(
  "pnpm",
  ["tauri", "build", "--bundles", bundles],
  {
    stdio: "inherit",
    shell: process.platform === "win32",
  },
)

process.exit(result.status ?? 1)

