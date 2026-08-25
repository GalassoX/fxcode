import { Editor as MonacoEditor, type OnMount } from '@monaco-editor/react'
import { useEffect, useState } from 'react'
import { EditorNoCode } from './no-code'
import { getLangId } from 'renderer/lib/utils'
import { EditorTabs } from './tabs'
import { useTabFiles } from 'renderer/states/tabFiles'
import type { editor } from 'monaco-editor'

const { fs } = window

export function Editor() {
  const [fileText, setFileText] = useState<string>('')
  const [language, setLanguage] = useState<string>('')
  const { currentFile } = useTabFiles()

  const editorOptions: editor.IStandaloneEditorConstructionOptions = {
    minimap: {
      enabled: true,
    },
    fontSize: 14,
  }

  useEffect(() => {
    if (currentFile) {
      const extension = currentFile.name.split('.').at(-1)

      if (!extension) return

      const languageId = getLangId(extension)

      if (!languageId) {
        setLanguage('plaintext')
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

  const handleEditorMount: OnMount = (editor, monaco) => {
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2022,
      module: monaco.languages.typescript.ModuleKind.ESNext,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,

      jsx: monaco.languages.typescript.JsxEmit.ReactJSX,

      allowJs: true,
      allowSyntheticDefaultImports: true,
      esModuleInterop: true,
      strict: true,
      noEmit: true,
    })
  }

  return (
    <div className="h-full bg-vscode-bg">
      <EditorTabs />
      <MonacoEditor
        height="100%"
        language={language}
        onMount={handleEditorMount}
        options={editorOptions}
        path={currentFile.path}
        theme="vs-dark"
        value={fileText}
      />
    </div>
  )
}
