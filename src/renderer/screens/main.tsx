import { useEffect } from 'react'
import { Editor } from 'renderer/components/editor'
import { Explorer } from 'renderer/components/explorer'
import { useCurrentFolder } from 'renderer/states/currentFolder'

const { fs } = window

export function MainScreen() {
  const { getFiles, setFiles } = useCurrentFolder()
  useEffect(() => {
    getFiles()

    const unsubscriber = fs.onCwdChange(onCwdChange)

    return () => {
      unsubscriber()
    }
  }, [])

  const onCwdChange = (newFiles: FileTree[]) => {
    setFiles(newFiles)
  }

  return (
    <main className="flex justify-center h-screen overflow-hidden bg-background">
      <Explorer />

      <div className="w-2/3 h-full overflow-hidden">
        <Editor />
      </div>
    </main>
  )
}
