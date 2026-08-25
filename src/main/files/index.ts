import path from 'node:path'
import { Worker } from 'node:worker_threads'

export async function getFiles(cwd: string): Promise<FileTree[]> {
  return new Promise(resolve => {
    const worker = new Worker(
      path.join(__dirname, 'workers/file-tree.worker.mjs')
    )

    worker.once('message', message => {
      if (message.type === 'success') {
        resolve(message.tree)
      } else {
        console.error('Error getting files', message.error)
        resolve([])
      }

      worker.terminate()
    })

    worker.once('error', error => {
      console.error('Error getting files', error)
    })

    worker.postMessage({
      directoryPath: cwd,
    })
  })
}
