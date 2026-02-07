import { formatDistanceToNow } from "date-fns"
import type { FC } from "react"
import toast from "react-hot-toast"

import { ClipboardIcon, TrashIcon } from "@/components/Icons"
import { isTauri } from "@/lib/tauri"
import { type Clip, useClipStore } from "@/store/clips.store"

import { Button } from "./ui/button"

interface ClipboardItemProps {
  clip: Clip
}

interface ClipboardApi {
  writeText: (text: string) => Promise<void>
}

type ClipboardModule = ClipboardApi | { default: ClipboardApi }

export const ClipboardItem: FC<ClipboardItemProps> = ({ clip }) => {
  const { removeClip } = useClipStore()

  const addToClipboard = async () => {
    if (!isTauri()) return
    try {
      const clipboardModule =
        (await import("tauri-plugin-clipboard-api")) as ClipboardModule
      const clipboard =
        "default" in clipboardModule ? clipboardModule.default : clipboardModule
      await clipboard.writeText(clip.text)
      toast.success("Added to Clipboard")
    } catch (error: unknown) {
      console.error("Failed to write to clipboard", error)
      toast.error("Failed to copy to clipboard")
    }
  }

  return (
    <div className="flex items-center gap-2 rounded-md bg-gray-100 p-2 hover:bg-gray-200 dark:bg-gray-800">
      <Button
        size="sm"
        type="button"
        variant="ghost"
        onClick={() => void addToClipboard()}
      >
        <ClipboardIcon className="h-6 w-6 rounded-md text-muted" />
      </Button>
      <div className="flex-1 grid gap-1">
        <div className="text-xs">
          {formatDistanceToNow(new Date(clip.time), { addSuffix: true })}
        </div>
        <div className="truncate">{clip.text}</div>
      </div>
      <Button
        size="sm"
        type="button"
        variant="ghost"
        onClick={() => {
          removeClip(clip.text)
          toast.success("Removed from Clipboard")
        }}
      >
        <TrashIcon className="w-4 h-4" />
        <span className="sr-only">Delete</span>
      </Button>
    </div>
  )
}
