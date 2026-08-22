/// <reference types="vite/client" />

interface FileTree {
  name: string
  path: string
  type: 'file' | 'directory'
  children?: FileTree[]
}