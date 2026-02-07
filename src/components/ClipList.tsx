import { useVirtualizer } from "@tanstack/react-virtual"
import { useRef } from "react"

import { ClipboardItem } from "@/components/TextCard"
import type { Clip } from "@/store/clips.store"

interface ClipListProps {
  clips: Clip[]
}

const ESTIMATED_ROW_HEIGHT_PX = 72

export const ClipList = ({ clips }: ClipListProps) => {
  const parentRef = useRef<HTMLDivElement>(null)

  const rowVirtualizer = useVirtualizer({
    count: clips.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ESTIMATED_ROW_HEIGHT_PX,
    overscan: 8,
  })

  return (
    <div ref={parentRef} className="flex-1 overflow-auto px-6">
      <div
        className="relative w-full"
        style={{ height: rowVirtualizer.getTotalSize() }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const clip = clips[virtualRow.index]
          return (
            <div
              key={clip.text}
              className="absolute left-0 top-0 w-full pb-2"
              style={{ transform: `translateY(${String(virtualRow.start)}px)` }}
            >
              <ClipboardItem clip={clip} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
