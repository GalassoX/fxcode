import { DEFAULT_FILE_SVG_NAME, FILE_ICON_PATH } from 'renderer/lib/constants'
import { getLangId } from 'renderer/lib/utils'
import { useCurrentFile } from 'renderer/states/currentFile'
import { useOpenFiles } from 'renderer/states/openFiles'

type ComponentProps = {
  filename: string
  path: string
}

export function FileExplorerFile({ filename, path }: ComponentProps) {
  const { setCurrentFile } = useCurrentFile()
  const { addFile } = useOpenFiles()

  const onClickFile = () => {
    setCurrentFile(path)
    addFile({ name: filename, path })
  }

  const getIconUrl = () => {
    const extension = filename.split('.').at(-1)
    if (extension) {
      const languageId = getLangId(extension)
      if (languageId) {
        return `${FILE_ICON_PATH}/${languageId}.svg`
      }
    }

    return `${FILE_ICON_PATH}/${DEFAULT_FILE_SVG_NAME}`
  }

  return (
    <button
      className="flex gap-2 items-center px-3 w-full rounded-sm hover:bg-neutral-900 truncate"
      onClick={onClickFile}
    >
      <img alt="icon" src={getIconUrl()} />
      {filename}
    </button>
  )
}
