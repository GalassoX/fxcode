import { create } from 'zustand'

export type TabFile = {
  name: string
  path: string
  numOrder: number
}

type NewTabFile = Omit<TabFile, 'numOrder'>

type TabFilesState = {
  files: TabFile[]
  currentFile: TabFile | null
  history: string[]
  currentNumOrder: number
  addFile: (filePath: NewTabFile, isCurrent: boolean) => void
  removeFile: (file: TabFile) => void
  setCurrentFile: (file: TabFile | null) => void
}

export const useTabFiles = create<TabFilesState>(set => ({
  files: [],
  currentFile: null,
  history: [],
  currentNumOrder: 0,
  addFile: (file: NewTabFile, isCurrent: boolean) =>
    set(state => {
      const existingFile = state.files.find(f => f.path === file.path)

      if (existingFile) {
        if (!isCurrent) {
          return {}
        }

        if (state.currentFile?.path === existingFile.path) {
          return {}
        }
        return {
          currentFile: existingFile,
          history: [
            ...state.history.filter(path => path !== existingFile.path),
            existingFile.path,
          ],
        }
      }

      const newCurrentNumOrder = state.currentNumOrder + 1
      const newFile = { ...file, numOrder: newCurrentNumOrder }

      return {
        files: [...state.files, newFile],
        currentNumOrder: newCurrentNumOrder,

        ...(isCurrent
          ? {
              currentFile: newFile,
              history: [...state.history, newFile.path],
            }
          : {}),
      }
    }),
  removeFile: (file: TabFile) =>
    set(state => {
      const restOfFiles = state.files.filter(f => f.path !== file.path)
      const history = state.history.filter(path => path !== file.path)

      if (state.currentFile?.path !== file.path) {
        return { files: restOfFiles, history }
      }

      const previousPath = history.at(-1)

      const nextFile =
        restOfFiles.find(file => file.path === previousPath) ??
        restOfFiles.at(-1) ??
        null

      const newHistory = nextFile
        ? [...history.filter(path => path !== nextFile.path), nextFile.path]
        : []

      return { files: restOfFiles, history: newHistory, currentFile: nextFile }
    }),
  setCurrentFile: (file: TabFile | null) =>
    set(state => {
      if (!file) return { currentFile: null }
      if (state.currentFile?.path === file?.path) return {}

      const history = [
        ...state.history.filter(path => path !== file.path),
        file.path,
      ]

      return { currentFile: file, history }
    }),
}))
