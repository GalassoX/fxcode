import { useState } from 'react'
import { FileExplorerFile } from './file-explorer-file'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { useCurrentFolder } from 'renderer/states/currentFolder'

const chevronClasses = 'w-4 text-neutral-700'

export function FileExplorer() {
  const { files } = useCurrentFolder()

  return (
    <div className="bg-transparent border-transparent text-sm w-full text-slate-50 h-full overflow-hidden">
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
        className="flex gap-2 px-3 hover:bg-neutral-900 w-full rounded-sm truncate cursor-pointer"
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
            <FileExplorerBuilder file={child} key={`${child.path}`} />
          ))}
        </div>
      )}
    </div>
  )
}
