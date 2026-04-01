import { api } from './api'

export interface Model3D {
  _id: string
  name: string
  fileUrl?: string
  filename?: string
  pointOfInterestId?: { _id: string; name: string } | null
  isActive: boolean
  createdAt: string
}

export interface ModelsResponse {
  data: Model3D[]
  total: number
  page: number
  limit: number
}

export const modelsService = {
  list: (params: { page?: number; limit?: number } = {}) =>
    api.get<ModelsResponse>('/models', { params }).then((r) => r.data),
  get: (id: string) => api.get<Model3D>(`/models/${id}`).then((r) => r.data),
  create: (data: Record<string, unknown>) => api.post<Model3D>('/models', data).then((r) => r.data),
  update: (id: string, data: Record<string, unknown>) =>
    api.put<Model3D>(`/models/${id}`, data).then((r) => r.data),
  remove: (id: string) => api.delete(`/models/${id}`),
}
