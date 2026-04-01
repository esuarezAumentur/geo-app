import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '@/services/api'

interface User {
  id: string
  name?: string
  email: string
  role: string
}

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref<string | null>(localStorage.getItem('accessToken'))
  const user = ref<User | null>(null)

  const isAuthenticated = computed(() => !!accessToken.value)

  async function login(email: string, password: string) {
    const { data } = await api.post('/auth/login', { email, password })
    accessToken.value = data.accessToken
    localStorage.setItem('accessToken', data.accessToken)
    if (data.refreshToken) {
      localStorage.setItem('refreshToken', data.refreshToken)
    }
    user.value = data.user ?? null
  }

  async function refreshSession() {
    const refreshToken = localStorage.getItem('refreshToken')
    if (!refreshToken) return logout()

    try {
      const { data } = await api.post('/auth/refresh', { refreshToken })
      accessToken.value = data.accessToken
      localStorage.setItem('accessToken', data.accessToken)
    } catch {
      logout()
    }
  }

  function logout() {
    accessToken.value = null
    user.value = null
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  }

  return { accessToken, user, isAuthenticated, login, refreshSession, logout }
})
