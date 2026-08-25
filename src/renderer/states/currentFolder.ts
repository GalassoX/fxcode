import { create } from 'zustand'

const { fs } = window

type CurrentFolderState = {
  files: FileTree[]
  setFiles: (files: FileTree[]) => void
  getFiles: () => void
}

export const useCurrentFolder = create<CurrentFolderState>(set => ({
  files: [],
  setFiles: (files: FileTree[]) => set(() => ({ files })),
  getFiles: async () => {
    try {
      const files = await fs.getFiles()
      return set(() => ({ files }))
    } catch (_e: unknown) {
      return set(() => ({ files: [] }))
    }
  },
}))
