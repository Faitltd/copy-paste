import type { NextPage } from "next"
import Image from "next/image"
import { useCallback, useMemo, useState } from "react"

import { ClipList } from "@/components/ClipList"
import Empty from "@/components/Empty"
import { SearchIcon } from "@/components/Icons"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useGlobalShortcut } from "@/hooks/tauri/shortcuts"
import { useClipboardMonitor } from "@/hooks/tauri/useClipboardMonitor"
import { isTauri } from "@/lib/tauri"
import { useClipStore } from "@/store/clips.store"

const Home: NextPage = () => {
  const { updateClips, clips, monitorEnabled, toggleMonitorEnabled } = useClipStore()
  const [query, setQuery] = useState("")

  const showApp = useCallback(() => {
    void (async () => {
      if (!isTauri()) return
      const { appWindow } = await import("@tauri-apps/api/window")
      await appWindow.show()
      await appWindow.unminimize()
      await appWindow.setFocus()
    })()
  }, [])

  useGlobalShortcut("CommandOrControl+Shift+V", showApp)
  useClipboardMonitor({ enabled: monitorEnabled, onText: updateClips })

  const filteredClips = useMemo(() => {
    const trimmedQuery = query.trim()
    if (!trimmedQuery) return clips
    const normalizedQuery = trimmedQuery.toLowerCase()
    return clips.filter((clip) => clip.text.toLowerCase().includes(normalizedQuery))
  }, [clips, query])

  const clipCountLabel = query.trim()
    ? `${String(filteredClips.length)}/${String(clips.length)}`
    : String(clips.length)

  const handleQuit = async () => {
    if (!isTauri()) return
    const { exit } = await import("@tauri-apps/api/process")
    await exit(0)
  }

  return (
    <Card className="w-full h-screen max-w-sm mx-auto grid flex-col">
      <CardHeader className="px-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Image src={"/icon.png"} alt={"copy pasta icon"} width={40} height={40} />
            <div className="flex flex-col">
              <h2 className="text-lg font-bold leading-none">Copy Pasta</h2>
              <p className="text-sm text-gray-500 leading-none mt-2">
                {clipCountLabel} Items
              </p>
            </div>
          </div>
          <Button
            size="sm"
            type="button"
            variant={monitorEnabled ? "secondary" : "default"}
            onClick={() => {
              toggleMonitorEnabled()
            }}
          >
            {monitorEnabled ? "Pause" : "Enable"}
          </Button>
        </div>
        <div className="flex items-center gap-2 rounded-lg px-3 py-4">
          <SearchIcon className="w-4 h-4 text-muted" />
          <Input
            className="w-full text-sm"
            placeholder="Search the clipboard"
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
            }}
          />
        </div>
        {!monitorEnabled ? (
          <div className="w-full rounded-md bg-amber-50 p-2 text-xs text-amber-900">
            Clipboard monitoring is paused. Enable it to capture new clips.
          </div>
        ) : null}
      </CardHeader>
      <CardContent className="flex flex-col overflow-hidden p-0">
        {filteredClips.length > 0 ? <ClipList clips={filteredClips} /> : <Empty />}
      </CardContent>
      <CardFooter className="p-0">
        <footer className="flex justify-between p-4">
          <Button
            size="sm"
            className="w-full"
            variant="ghost"
            onClick={() => void handleQuit()}
          >
            Quit Copy Pasta
          </Button>
        </footer>
      </CardFooter>
    </Card>
  )
}

export default Home
