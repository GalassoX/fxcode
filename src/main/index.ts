import { app, ipcMain } from 'electron'

import { makeAppWithSingleInstanceLock } from 'lib/electron-app/factories/app/instance'
import { makeAppSetup } from 'lib/electron-app/factories/app/setup'
import { loadReactDevtools } from 'lib/electron-app/utils'
import { ENVIRONMENT, IPC_EVENTS } from 'shared/constants'
import { MainWindow } from './windows/main'
import { waitFor } from 'shared/utils'

import fs from 'node:fs/promises'
import path from 'node:path'
import type { Dirent } from 'node:fs'

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
})

async function readDirectory(directoryPath: string): Promise<FileTree[]> {
  const entries = await fs.readdir(directoryPath, {
    withFileTypes: true,
  })

  entries.sort((a: Dirent<string>, b: Dirent<string>) => {
    if (a.isDirectory() && !b.isDirectory()) return -1

    if (!a.isDirectory() && b.isDirectory()) return 1

    return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
  })

  const result: FileTree[] = []

  for (const entry of entries) {
    const fullPath = path.join(directoryPath, entry.name)

    if (entry.isDirectory()) {
      const children = await readDirectory(fullPath)

      result.push({
        name: entry.name,
        path: fullPath,
        type: 'directory',
        children,
      })
    } else {
      result.push({
        name: entry.name,
        path: fullPath,
        type: 'file',
      })
    }
  }

  return result
}

ipcMain.handle(IPC_EVENTS.FS_GET_FILES, async (): Promise<FileTree[]> => {
  return await readDirectory(process.cwd())
})

ipcMain.handle(IPC_EVENTS.FS_GET_FILE_CONTENT, async (_, filePath) => {
  return await fs.readFile(filePath, 'utf-8')
})

ipcMain.handle(IPC_EVENTS.FS_GET_CURRENT_FOLDER_NAME, () => {
  return path.basename(process.cwd())
})
