import { type TabFile, useTabFiles } from 'renderer/states/tabFiles'
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs'
import { X } from 'lucide-react'
import { getLangId } from 'renderer/lib/utils'
import { DEFAULT_FILE_SVG_NAME, FILE_ICON_PATH } from 'renderer/lib/constants'
import type { MouseEvent } from 'react'

export function EditorTabs() {
  const { files, currentFile, removeFile, setCurrentFile } = useTabFiles()

  const getIconUrl = (filename: string) => {
    const extension = filename.split('.').at(-1)
    if (extension) {
      const languageId = getLangId(extension)
      if (languageId) {
        return `${FILE_ICON_PATH}/${languageId}.svg`
      }
    }

    return `${FILE_ICON_PATH}/${DEFAULT_FILE_SVG_NAME}`
  }

  const closeFile = (e: MouseEvent, file: TabFile) => {
    e.stopPropagation()
    removeFile(file)
  }

  return (
    <Tabs value={currentFile?.path}>
      <TabsList className="bg-vscode-bg">
        {files.map(file => (
          <TabsTrigger
            className="w-fit"
            key={file.path}
            onClick={() => setCurrentFile(file)}
            value={file.path}
          >
            <img alt="tabicon" src={getIconUrl(file.name)} />
            {file.name}
            {/** biome-ignore lint/a11y/noStaticElementInteractions: button inner a button */}
            {/** biome-ignore lint/a11y/useKeyWithClickEvents: button inner a button */}
            <span
              className="hover:bg-neutral-700 rounded-xs"
              onClick={e => closeFile(e, file)}
            >
              <X />
            </span>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
