import { useOpenFiles } from 'renderer/states/openFiles'
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs'
import { useCurrentFile } from 'renderer/states/currentFile'
import { X } from 'lucide-react'
import { getLangId } from 'renderer/lib/utils'
import { DEFAULT_FILE_SVG_NAME, FILE_ICON_PATH } from 'renderer/lib/constants'

export function EditorTabs() {
  const { files, removeFile } = useOpenFiles()
  const { filePath, setCurrentFile } = useCurrentFile()

  const updateCurrentFile = (file: string) => {
    setCurrentFile(file)
  }

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

  return (
    <Tabs value={filePath}>
      <TabsList className="bg-vscode-bg">
        {files.map(file => (
          <TabsTrigger
            className="w-fit"
            key={file.path}
            onClick={() => updateCurrentFile(file.path)}
            value={file.path}
          >
            <img alt="tabicon" src={getIconUrl(file.name)} />
            {file.name}
            <button
              className="hover:bg-neutral-700 rounded-xs"
              onClick={() => removeFile(file)}
            >
              <X />
            </button>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
