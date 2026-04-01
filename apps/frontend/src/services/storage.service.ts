import { api } from './api'

export interface UploadResult {
  url: string
  filename: string
  originalName: string
  mimeType: string
  size: number
}

export const storageService = {
  upload: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return api
      .post<UploadResult>('/storage/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data)
  },
}
