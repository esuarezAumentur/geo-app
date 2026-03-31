import axios, { type AxiosRequestConfig, type AxiosResponse, type AxiosError } from 'axios'

function resolveBaseUrl(): string {
  const raw = (import.meta.env.VITE_API_BASE_URL as string | undefined) || 'http://localhost:3000'
  // Si ya viene con /api al final, lo dejamos; si no, lo añadimos
  if (raw.endsWith('/api')) return raw
  return `${raw.replace(/\/+$/, '')}/api`
}

export const api = axios.create({
  baseURL: resolveBaseUrl(),
  withCredentials: true,
})

// Lee el access token (por ejemplo guardado después de /login)
function getAccessToken(): string | null {
  try {
    return localStorage.getItem('accessToken')
  } catch {
    return null
  }
}

api.interceptors.request.use((config: AxiosRequestConfig) => {
  const token = getAccessToken()
  if (token) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Aquí podríamos limpiar sesión o redirigir a login
      console.warn('Sesión no válida o expirada')
    }
    return Promise.reject(error)
  },
)

