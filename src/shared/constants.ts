export const ENVIRONMENT = {
  IS_DEV: process.env.NODE_ENV === 'development',
}

export const PLATFORM = {
  IS_MAC: process.platform === 'darwin',
  IS_WINDOWS: process.platform === 'win32',
  IS_LINUX: process.platform === 'linux',
}

export const IPC_EVENTS = {
  FS_GET_FILES: 'fs.getFiles',
  FS_GET_FILE_CONTENT: 'fs.getFileContent',
} as const
