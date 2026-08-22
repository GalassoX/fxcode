import { useEffect, useState } from 'react'
import { FileExplorerFile } from './file-explorer-file'
import { ChevronDown, ChevronRight } from 'lucide-react'

const { fs } = window

export function FileExplorer() {
  const [files, setFiles] = useState<FileTree[]>([])
  useEffect(() => {
    fs.getFiles()
      .then(setFiles)
      .catch(() => setFiles([]))
  }, [])

  return (
    <div className="mx-2 bg-transparent border-transparent text-sm w-full text-slate-50">
      {files.map(fname => (
        <FileExplorerBuilder file={fname} key={fname.name} />
      ))}
    </div>
  )
}

export function FileExplorerBuilder({ file }: { file: FileTree }) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (!file.children) {
    return <FileExplorerFile filename={file.name} path={file.path} />
  }

  const chevronClasses = 'w-4 text-neutral-700'

  return (
    <>
      <button
        className="flex gap-2 mx-3 hover:bg-neutral-900 w-full rounded-sm"
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
    </>
  )
}
