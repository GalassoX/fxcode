import { DEFAULT_FILE_SVG_NAME, FILE_ICON_PATH } from 'renderer/lib/constants'
import { getLangId } from 'renderer/lib/utils'
import { useTabFiles } from 'renderer/states/tabFiles'

type ComponentProps = {
  filename: string
  path: string
}

export function FileExplorerFile({ filename, path }: ComponentProps) {
  const { addFile } = useTabFiles()

  const onClickFile = () => {
    addFile({ name: filename, path }, true)
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
    // biome-ignore lint/a11y/useKeyWithClickEvents: button inner a button
    // biome-ignore lint/a11y/noStaticElementInteractions: button inner a button
    <div
      className="flex gap-2 items-center px-3 w-full rounded-sm hover:bg-neutral-900 truncate cursor-pointer"
      onClick={onClickFile}
    >
      <img alt="icon" src={getIconUrl()} />
      {filename}
    </div>
  )
}
