import { api } from './api'

export interface Waypoint {
  _id?: string
  locationId?: string | null
  name: string
  coordinates: { latitude: number; longitude: number }
}

export interface Route {
  _id: string
  name: string
  description?: string
  waypoints: Waypoint[]
  isActive: boolean
  createdAt: string
}

export interface RoutesResponse {
  data: Route[]
  total: number
  page: number
  limit: number
}

export interface RoutePayload {
  name: string
  description?: string
  waypoints: Omit<Waypoint, '_id'>[]
  isActive?: boolean
}

export const routesService = {
  list: (params: { page?: number; limit?: number } = {}) =>
    api.get<RoutesResponse>('/routes', { params }).then((r) => r.data),
  get: (id: string) => api.get<Route>(`/routes/${id}`).then((r) => r.data),
  create: (data: RoutePayload) => api.post<Route>('/routes', data).then((r) => r.data),
  update: (id: string, data: Partial<RoutePayload>) =>
    api.put<Route>(`/routes/${id}`, data).then((r) => r.data),
  remove: (id: string) => api.delete(`/routes/${id}`),
}
