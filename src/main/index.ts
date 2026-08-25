import { app, type BrowserWindow, ipcMain } from 'electron'

import { makeAppWithSingleInstanceLock } from 'lib/electron-app/factories/app/instance'
import { makeAppSetup } from 'lib/electron-app/factories/app/setup'
import { loadReactDevtools } from 'lib/electron-app/utils'
import { ENVIRONMENT, IPC_EVENTS } from 'shared/constants'
import { MainWindow } from './windows/main'
import { waitFor } from 'shared/utils'

import fs from 'node:fs/promises'
import path from 'node:path'
import { getFiles } from './files'

const cwd = process.cwd()

makeAppWithSingleInstanceLock(async () => {
  await app.whenReady()
  const window = await makeAppSetup(MainWindow)

  if (ENVIRONMENT.IS_DEV) {
    await loadReactDevtools()
    /* This trick is necessary to get the new
      React Developer Tools working at app initial load.
      Otherwise, it only works on manual reload.
    */
    window.webContents.once('devtools-opened', async () => {
      await waitFor(1000)
      window.webContents.reload()
    })
  }

  watchFolder(window, cwd)
})

async function watchFolder(window: BrowserWindow, path: string) {
  const watcher = fs.watch(path)
  let timeout: NodeJS.Timeout | null = null
  for await (const _event of watcher) {
    if (timeout) clearTimeout(timeout)

    timeout = setTimeout(async () => {
      const newFiles = await getFiles(cwd)
      window.webContents.send(IPC_EVENTS.FS_ON_CWD_CHANGE, newFiles)
    }, 100)
  }
}

ipcMain.handle(IPC_EVENTS.FS_GET_FILES, async (): Promise<FileTree[]> => {
  return getFiles(cwd)
})

ipcMain.handle(IPC_EVENTS.FS_GET_FILE_CONTENT, async (_, filePath) => {
  return await fs.readFile(filePath, 'utf-8')
})

ipcMain.handle(IPC_EVENTS.FS_GET_CURRENT_FOLDER_NAME, () => {
  return path.basename(cwd)
})
