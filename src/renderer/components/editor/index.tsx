import { Editor as MonacoEditor } from '@monaco-editor/react'
import { useEffect, useState } from 'react'
import { useCurrentFile } from 'renderer/states/currentFile'
import { EditorNoCode } from './no-code'
import * as monaco from 'monaco-editor'

const { fs } = window

export function Editor() {
  const [fileText, setFileText] = useState<string>('')
  const [language, setLanguage] = useState<string>('')
  const { filePath } = useCurrentFile()

  useEffect(() => {
    if (filePath) {
      const extension = filePath.split('.').at(-1)

      if (!extension) return

      const language = Object.values(monaco.languages.getLanguages()).find(e =>
        e.extensions?.includes(`.${extension}`)
      )

      if (!language) {
        setLanguage('plain')
      } else {
        setLanguage(language.id)
      }

      fs.getFileContent(filePath).then(setFileText)
    }

    return () => {}
  }, [filePath])

  if (filePath === '') {
    return <EditorNoCode />
  }

  return (
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
  )
}
