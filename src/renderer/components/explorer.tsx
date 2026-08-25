import { useEffect, useState } from 'react'
import { FileExplorer } from './file-explorer'
import { ExplorerTab } from './explorer-tab'

const { fs } = window

export function Explorer() {
  const [currentFolderName, setCurrentFolderName] = useState<string>('')

  useEffect(() => {
    fs.getCurrentFolderName().then(setCurrentFolderName)
  }, [])

  return (
    <div className="w-1/3 h-full overflow-hidden border border-neutral-700 rounded-md p-2">
      <ExplorerTab
        component={<FileExplorer />}
        tabName={currentFolderName}
        visible
      />
    </div>
  )
}
