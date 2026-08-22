import { create } from 'zustand'

type CurrentFile = {
  filePath: string
  setCurrentFile: (filePath: string) => void
}

export const useCurrentFile = create<CurrentFile>(set => ({
  filePath: '',
  setCurrentFile: (filePath: string) => set(() => ({ filePath })),
}))
