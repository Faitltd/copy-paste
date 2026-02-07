import type { NextPage } from "next"
import Image from "next/image"
import { useMemo, useState } from "react"

import Empty from "@/components/Empty"
import { SearchIcon } from "@/components/Icons"
import { ClipboardItem } from "@/components/TextCard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useClipboardMonitor } from "@/hooks/tauri/useClipboardMonitor"
import { isTauri } from "@/lib/tauri"
import { useClipStore } from "@/store/clips.store"

const Home: NextPage = () => {
  const { updateClips, clips } = useClipStore()
  const [query, setQuery] = useState("")

  useClipboardMonitor({ onText: updateClips })

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
        <div className="flex items-center gap-4">
          <Image src={"/icon.png"} alt={"pasta icon"} width={40} height={40} />
          <div className="flex flex-col">
            <h2 className="text-lg font-bold leading-none">Pasta</h2>
            <p className="text-sm text-gray-500 leading-none mt-2">
              {clipCountLabel} Items
            </p>
          </div>
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
      </CardHeader>
      <CardContent className="p-0 flex flex-col overflow-auto">
        <div className="flex-1 flex flex-col gap-2 px-6 items-start">
          {filteredClips.length > 0 ? (
            <div className="grid gap-2 text-sm w-full">
              {filteredClips.map((item) => (
                <ClipboardItem key={item.text} clip={item} />
              ))}
            </div>
          ) : (
            <Empty />
          )}
        </div>
      </CardContent>
      <CardFooter className="p-0">
        <footer className="flex justify-between p-4">
          <Button
            size="sm"
            className="w-full"
            variant="ghost"
            onClick={() => void handleQuit()}
          >
            Quit Pasta 🍝
          </Button>
        </footer>
      </CardFooter>
    </Card>
  )
}

export default Home
