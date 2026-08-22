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
    <div className="mt-5 mx-2 bg-transparent border-transparent text-accent w-fit">
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

  const chevronClasses = 'w-4'

  return (
    <>
      <button
        className="flex text-neutral-500"
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
        <div className="ml-4">
          {file.children.map(child => (
            <FileExplorerBuilder file={child} key={file.name} />
          ))}
        </div>
      )}
    </>
  )
}
