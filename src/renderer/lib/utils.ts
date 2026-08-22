import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { languages } from 'monaco-editor'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getLangId(fileExtension: string): string | undefined {
  if (!fileExtension.startsWith('.')) {
    fileExtension = `.${fileExtension}`
  }

  const language = languages
    .getLanguages()
    .find(e => e.extensions?.includes(fileExtension))

  return language?.id
}
