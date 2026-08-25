import type { Dirent } from 'node:fs'
import fs from 'node:fs/promises'
import path from 'node:path'
import { parentPort } from 'node:worker_threads'

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

parentPort?.on('message', async ({ directoryPath }) => {
  try {
    const tree = await readDirectory(directoryPath)

    parentPort?.postMessage({
      type: 'success',
      tree,
    })
  } catch (error) {
    parentPort?.postMessage({
      type: 'error',
      error: error instanceof Error ? error.message : String(error),
    })
  }
})
