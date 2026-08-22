import { useEffect } from 'react'
import { Editor } from 'renderer/components/editor'
import { FileExplorer } from 'renderer/components/file-explorer'

// The "App" comes from the context bridge in preload/index.ts
const { App } = window

export function MainScreen() {
  useEffect(() => {
    // check the console on dev tools
    App.sayHelloFromBridge()
  }, [])

  return (
    <main className="flex justify-center h-screen bg-background overflow-x-hidden overflow-y-hidden">
      <div className="w-1/3 overflow-scroll">
        <FileExplorer />
      </div>

      <div className="w-2/3">
        <Editor />
      </div>
    </main>
  )
}
