import { create } from 'zustand'

type File = {
  name: string
  path: string
}

type NewFile = Omit<File, 'numOrder'>

type OpenFileState = {
  files: File[]
  currentFile: File | null
  prevFile: File | null
  addFile: (filePath: NewFile) => void
  removeFile: (file: File) => void
  setCurrentFile: (file: File) => void
}

export const useOpenFiles = create<OpenFileState>(set => ({
  files: [],
  currentFile: null,
  prevFile: null,
  addFile: (filePath: NewFile) =>
    set(state => ({
      files: [...state.files, filePath],
    })),
  removeFile: (file: File) =>
    set(state => {
      // TODO: Como hacer para que cuando cierres el archivo donde estas actualmente te lleve al anterior
      if (state.currentFile) {
        state.setCurrentFile(file)
      }
      return { files: state.files.filter(f => f.path !== file.path) }
    }),
  setCurrentFile: (file: File) => set(() => ({ currentFile: file })),
}))
