import type { UnlistenFn } from "@tauri-apps/api/event"
import debounce from "lodash/debounce"
import { useEffect } from "react"

import { isTauri } from "@/lib/tauri"

interface ClipboardMonitorOptions {
  onText: (text: string) => void
  shortcut?: string
  debounceMs?: number
}

interface ClipboardApi {
  onTextUpdate?: (handler: (text: string) => void) => Promise<UnlistenFn>
  startListening?: () => Promise<unknown>
  stopListening?: () => Promise<void>
}

type ClipboardModule = ClipboardApi | { default: ClipboardApi }

const isStopListener = (value: unknown): value is () => Promise<void> =>
  typeof value === "function"

export const useClipboardMonitor = ({
  onText,
  shortcut = "CommandOrControl+Shift+V",
  debounceMs = 300,
}: ClipboardMonitorOptions) => {
  useEffect(() => {
    if (!isTauri()) return

    let unlistenTextUpdate: UnlistenFn | null = null
    let stopListening: (() => Promise<void>) | null = null
    let unregisterShortcut: (() => Promise<void>) | null = null
    let disposed = false
    const isDisposed = () => disposed

    const debouncedOnText = debounce((text: string) => {
      if (!isDisposed()) {
        onText(text)
      }
    }, debounceMs)

    const setup = async () => {
      const [{ appWindow }, globalShortcutModule, clipboardModule] = await Promise.all([
        import("@tauri-apps/api/window"),
        import("@tauri-apps/api/globalShortcut"),
        import("tauri-plugin-clipboard-api"),
      ])

      if (isDisposed()) return

      if (shortcut) {
        const isShortcutRegistered = await globalShortcutModule.isRegistered(shortcut)
        if (!isShortcutRegistered) {
          const handleShortcut = () => {
            void appWindow.show()
            void appWindow.unminimize()
            void appWindow.setFocus()
          }
          await globalShortcutModule.register(shortcut, handleShortcut)
        }
        unregisterShortcut = async () => {
          const isRegistered = await globalShortcutModule.isRegistered(shortcut)
          if (isRegistered) {
            await globalShortcutModule.unregister(shortcut)
          }
        }
      }

      if (isDisposed()) return

      const clipboardModuleTyped = clipboardModule as ClipboardModule
      const clipboard =
        "default" in clipboardModuleTyped
          ? clipboardModuleTyped.default
          : clipboardModuleTyped

      if (clipboard.onTextUpdate) {
        unlistenTextUpdate = await clipboard.onTextUpdate((text) => {
          debouncedOnText(text)
        })
      }

      if (clipboard.startListening) {
        const result = await clipboard.startListening()
        if (isStopListener(result)) {
          stopListening = result
        } else if (clipboard.stopListening) {
          stopListening = clipboard.stopListening
        }
      }
    }

    void setup().catch((err: unknown) => {
      console.error("Failed to initialize clipboard monitor", err)
    })

    return () => {
      disposed = true
      debouncedOnText.cancel()
      if (unlistenTextUpdate) {
        unlistenTextUpdate()
      }
      if (stopListening) {
        void stopListening()
      }
      if (unregisterShortcut) {
        void unregisterShortcut()
      }
    }
  }, [debounceMs, onText, shortcut])
}
