import { api } from './api'

export interface Coordinates {
  latitude: number
  longitude: number
}

export interface PointOfInterest {
  _id: string
  name: string
  description?: string
  tagId?: { _id: string; name: string; color: string } | null
  modelId?: { _id: string; name: string } | null
  coordinates: Coordinates
  url?: string
  isActive: boolean
  isVisible: boolean
  createdAt: string
}

export interface LocationsResponse {
  data: PointOfInterest[]
  total: number
  page: number
  limit: number
}

export interface LocationFilters {
  page?: number
  limit?: number
  tag?: string
  model?: string
  visible?: string
}

export const locationsService = {
  list: (filters: LocationFilters = {}) =>
    api.get<LocationsResponse>('/locations', { params: filters }).then((r) => r.data),
  get: (id: string) => api.get<PointOfInterest>(`/locations/${id}`).then((r) => r.data),
  create: (data: Record<string, unknown>) =>
    api.post<PointOfInterest>('/locations', data).then((r) => r.data),
  update: (id: string, data: Record<string, unknown>) =>
    api.put<PointOfInterest>(`/locations/${id}`, data).then((r) => r.data),
  remove: (id: string) => api.delete(`/locations/${id}`),
}
