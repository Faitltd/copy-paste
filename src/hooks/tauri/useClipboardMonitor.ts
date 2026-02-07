import type { UnlistenFn } from "@tauri-apps/api/event"
import debounce from "lodash/debounce"
import { useEffect } from "react"

import { isTauri } from "@/lib/tauri"

interface ClipboardMonitorOptions {
  enabled?: boolean
  onText: (text: string) => void
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
  enabled = true,
  onText,
  debounceMs = 300,
}: ClipboardMonitorOptions) => {
  useEffect(() => {
    if (!enabled) return
    if (!isTauri()) return

    let unlistenTextUpdate: UnlistenFn | null = null
    let stopListening: (() => Promise<void>) | null = null
    let disposed = false

    const debouncedOnText = debounce((text: string) => {
      if (!disposed) {
        onText(text)
      }
    }, debounceMs)

    const setup = async () => {
      const clipboardModule =
        (await import("tauri-plugin-clipboard-api")) as ClipboardModule

      if (disposed) return

      const clipboard =
        "default" in clipboardModule ? clipboardModule.default : clipboardModule

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
    }
  }, [debounceMs, enabled, onText])
}
