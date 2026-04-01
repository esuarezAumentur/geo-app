import { api } from './api'

export interface Tag {
  _id: string
  name: string
  color: string
  isActive: boolean
  createdAt: string
}

export const tagsService = {
  list: () => api.get<Tag[]>('/tags').then((r) => r.data),
  get: (id: string) => api.get<Tag>(`/tags/${id}`).then((r) => r.data),
  create: (data: Partial<Tag>) => api.post<Tag>('/tags', data).then((r) => r.data),
  update: (id: string, data: Partial<Tag>) => api.put<Tag>(`/tags/${id}`, data).then((r) => r.data),
  remove: (id: string) => api.delete(`/tags/${id}`),
}
