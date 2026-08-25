import { contextBridge, ipcRenderer } from 'electron'
import { IPC_EVENTS } from 'shared/constants'

declare global {
  interface Window {
    App: typeof API
    fs: typeof fs
  }
}

const API = {
  sayHelloFromBridge: () => console.log('\nHello from bridgeAPI! 👋\n\n'),
  username: process.env.USER,
}

contextBridge.exposeInMainWorld('App', API)

const fs = {
  getFiles: (): Promise<FileTree[]> =>
    ipcRenderer.invoke(IPC_EVENTS.FS_GET_FILES),
  getFileContent: (filename: string) =>
    ipcRenderer.invoke(IPC_EVENTS.FS_GET_FILE_CONTENT, filename),
  getCurrentFolderName: (): Promise<string> =>
    ipcRenderer.invoke(IPC_EVENTS.FS_GET_CURRENT_FOLDER_NAME),
  onCwdChange: (callback: (newFiles: FileTree[]) => void) => {
    const c = (_event: Electron.IpcRendererEvent, newFiles: FileTree[]) =>
      callback(newFiles)

    ipcRenderer.on(IPC_EVENTS.FS_ON_CWD_CHANGE, c)

    return () => {
      ipcRenderer.removeListener(IPC_EVENTS.FS_ON_CWD_CHANGE, c)
    }
  },
}
contextBridge.exposeInMainWorld('fs', fs)
