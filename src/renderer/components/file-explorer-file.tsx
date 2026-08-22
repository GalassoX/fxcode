import { useCurrentFile } from 'renderer/states/currentFile'

type ComponentProps = {
  filename: string
  path: string
}

export function FileExplorerFile({ filename, path }: ComponentProps) {
  const { setCurrentFile } = useCurrentFile()

  const onClickFile = () => {
    setCurrentFile(path)
  }

  return (
    <button
      className="w-full rounded-sm hover:bg-neutral-900 text-left text-slate-50"
      onClick={onClickFile}
    >
      {filename}
    </button>
  )
}
