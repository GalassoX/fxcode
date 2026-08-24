import { useEffect, useState } from 'react'
import { FileExplorerFile } from './file-explorer-file'
import { ChevronDown, ChevronRight, FilePlus } from 'lucide-react'

const { fs } = window

const chevronClasses = 'w-4 text-neutral-700'

export function FileExplorer() {
  const [files, setFiles] = useState<FileTree[]>([])
  const [currentFolderName, setCurrentFolderName] = useState<string>('')
  const [isExpanded, setIsExpanded] = useState(false)
  useEffect(() => {
    fs.getCurrentFolderName().then(setCurrentFolderName)
    fs.getFiles()
      .then(setFiles)
      .catch(() => setFiles([]))
  }, [])

  return (
    <div className="bg-transparent border-transparent text-sm w-full text-slate-50 h-full overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="flex w-full">
          <button
            className="flex gap-2 hover:bg-neutral-900 w-full rounded-sm"
            onClick={() => setIsExpanded(s => !s)}
          >
            {isExpanded ? (
              <ChevronDown className={chevronClasses} />
            ) : (
              <ChevronRight className={chevronClasses} />
            )}
            <span>{currentFolderName}</span>
          </button>
        </div>
        <div>
          <FilePlus className="w-4" />
        </div>
      </div>
      <div className="h-full overflow-y-auto rounded-xl shadow-lg scrollbar-gutter-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-button]:hidden [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-neutral-700/50 [&::-webkit-scrollbar-thumb]:rounded-full">
        {files.map(fname => (
          <FileExplorerBuilder file={fname} key={fname.name} />
        ))}
      </div>
    </div>
  )
}

export function FileExplorerBuilder({ file }: { file: FileTree }) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (!file.children) {
    return <FileExplorerFile filename={file.name} path={file.path} />
  }

  return (
    <div className="w-full">
      <button
        className="flex gap-2 px-3 hover:bg-neutral-900 w-full rounded-sm"
        onClick={() => setIsExpanded(s => !s)}
      >
        {isExpanded ? (
          <ChevronDown className={chevronClasses} />
        ) : (
          <ChevronRight className={chevronClasses} />
        )}
        <p>{file.name}</p>
      </button>
      {isExpanded && (
        <div className="border-l ml-4">
          {file.children.map(child => (
            <FileExplorerBuilder file={child} key={file.name} />
          ))}
        </div>
      )}
    </div>
  )
}
