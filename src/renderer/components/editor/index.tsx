import { Editor as MonacoEditor } from '@monaco-editor/react'
import { useEffect, useState } from 'react'
import { EditorNoCode } from './no-code'
import { getLangId } from 'renderer/lib/utils'
import { EditorTabs } from './tabs'
import { useTabFiles } from 'renderer/states/openFiles'

const { fs } = window

export function Editor() {
  const [fileText, setFileText] = useState<string>('')
  const [language, setLanguage] = useState<string>('')
  const { currentFile } = useTabFiles()

  useEffect(() => {
    if (currentFile) {
      const extension = currentFile.name.split('.').at(-1)

      if (!extension) return

      const languageId = getLangId(extension)

      if (!languageId) {
        setLanguage('plain')
      } else {
        setLanguage(languageId)
      }

      fs.getFileContent(currentFile.path).then(setFileText)
    }

    return () => {}
  }, [currentFile])

  if (!currentFile) {
    return <EditorNoCode />
  }

  return (
    <div className="h-full bg-vscode-bg">
      <EditorTabs />
      <MonacoEditor
        height="100%"
        language={language}
        options={{
          minimap: {
            enabled: true,
          },
          fontSize: 14,
          automaticLayout: true,
        }}
        theme="vs-dark"
        value={fileText}
      />
    </div>
  )
}
