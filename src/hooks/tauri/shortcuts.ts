import type { ShortcutHandler } from "@tauri-apps/api/globalShortcut"
import { useEffect } from "react"

import { isTauri } from "@/lib/tauri"

/**
 * A React hook to register global shortcuts using Tauri's globalShortcut API.
 * Internally this uses a useEffect hook, but has proper support for React.StrictMode
 * via cleaning up the effect hook, so as to maintain idempotency.
 *
 * @param shortcut The key combination string for the shortcut
 * @param shortcutHandler The handler callback when the shortcut is triggered
 */
export const useGlobalShortcut = (
  shortcut: string,
  shortcutHandler: ShortcutHandler,
) => {
  useEffect(() => {
    if (!isTauri()) return

    let ignore = false
    let registeredByUs = false

    async function registerShortcut() {
      const globalShortcut = await import("@tauri-apps/api/globalShortcut")
      const isShortcutRegistered = await globalShortcut.isRegistered(shortcut)
      if (!ignore && !isShortcutRegistered) {
        await globalShortcut.register(shortcut, shortcutHandler)
        registeredByUs = true
      }
    }

    void registerShortcut().catch((err: unknown) => {
      console.error(`Failed to register global shortcut '${shortcut}'`, err)
    })

    return () => {
      ignore = true
      if (!registeredByUs) return
      void (async () => {
        const globalShortcut = await import("@tauri-apps/api/globalShortcut")
        const isShortcutRegistered = await globalShortcut.isRegistered(shortcut)
        if (isShortcutRegistered) {
          await globalShortcut.unregister(shortcut)
        }
      })()
    }
  }, [shortcut, shortcutHandler])
}
