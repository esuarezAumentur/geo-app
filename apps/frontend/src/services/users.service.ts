import { api } from './api'

export interface User {
  _id: string
  name?: string
  email: string
  role: string
  isActive: boolean
  createdAt: string
}

export const usersService = {
  list: () => api.get<User[]>('/users').then((r) => r.data),
  get: (id: string) => api.get<User>(`/users/${id}`).then((r) => r.data),
  create: (data: Record<string, unknown>) => api.post('/users', data).then((r) => r.data),
  update: (id: string, data: Record<string, unknown>) =>
    api.put<User>(`/users/${id}`, data).then((r) => r.data),
  remove: (id: string) => api.delete(`/users/${id}`),
}
