import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'

function resolveBaseUrl(): string {
  const raw = (import.meta.env.VITE_API_BASE_URL as string | undefined) || 'http://localhost:3000'
  if (raw.endsWith('/api')) return raw
  return `${raw.replace(/\/+$/, '')}/api`
}

export const api = axios.create({
  baseURL: resolveBaseUrl(),
  withCredentials: true,
})

function getAccessToken(): string | null {
  try {
    return localStorage.getItem('accessToken')
  } catch {
    return null
  }
}

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken()
  if (token) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  },
)
