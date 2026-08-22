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
  cwd: 'import.meta.filename',
}

contextBridge.exposeInMainWorld('App', API)

const fs = {
  getFiles: (): Promise<FileTree[]> =>
    ipcRenderer.invoke(IPC_EVENTS.FS_GET_FILES),
  getFileContent: (filename: string) =>
    ipcRenderer.invoke(IPC_EVENTS.FS_GET_FILE_CONTENT, filename),
}
contextBridge.exposeInMainWorld('fs', fs)
