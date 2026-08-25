import { useEffect } from 'react'
import { Editor } from 'renderer/components/editor'
import { Explorer } from 'renderer/components/explorer'
import { Header } from 'renderer/components/header'
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
    <main className="max-h-screen h-screen flex flex-col overflow-hidden bg-background">
      <Header />
      <div className="flex flex-1 min-h-0 justify-center overflow-hidden gap-1 px-2 pb-2">
        <Explorer />

        <div className="w-2/3 h-full overflow-hidden border border-neutral-700 rounded-md">
          <Editor />
        </div>
      </div>
    </main>
  )
}
