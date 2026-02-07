import { create } from "zustand"
import { createJSONStorage, persist, type PersistStorage } from "zustand/middleware"

export interface Clip {
  text: string
  time: string
}
export interface ClipsStore {
  clips: Clip[]
  updateClips: (clip: string) => void
  removeClip: (clipText: string) => void
}

const MAX_CLIPS = 200
type ClipStorePersist = Pick<ClipsStore, "clips">

const noop = () => undefined

const createNoopStorage = (): PersistStorage<ClipStorePersist> => ({
  getItem: () => null,
  setItem: noop,
  removeItem: noop,
})

const getBrowserStorage = () =>
  createJSONStorage<ClipStorePersist>(() => localStorage)

const clipStorage: PersistStorage<ClipStorePersist> =
  typeof window !== "undefined"
    ? getBrowserStorage() ?? createNoopStorage()
    : createNoopStorage()

const initialState: ClipsStore = {
  clips: [],
  updateClips: noop,
  removeClip: noop,
}
export const useClipStore = create<ClipsStore>()(
  persist(
    (set) => ({
      ...initialState,
      updateClips: (clipText) => {
        set((state) => {
          if (!clipText) return state

          const now = new Date().toISOString()
          const existingIndex = state.clips.findIndex((clip) => clip.text === clipText)

          if (existingIndex !== -1) {
            const updatedClip = { ...state.clips[existingIndex], time: now }
            const nextClips = [
              updatedClip,
              ...state.clips.filter((_, index) => index !== existingIndex),
            ]
            return { clips: nextClips }
          }

          const nextClips = [{ text: clipText, time: now }, ...state.clips]
          if (nextClips.length > MAX_CLIPS) {
            nextClips.length = MAX_CLIPS
          }
          return { clips: nextClips }
        })
      },
      removeClip: (clipText) => {
        set((state) => ({
          clips: state.clips.filter((clip) => clip.text !== clipText),
        }))
      },
    }),
    {
      name: "pasta-clips",
      storage: clipStorage,
      partialize: (state) => ({ clips: state.clips }),
    },
  ),
)
