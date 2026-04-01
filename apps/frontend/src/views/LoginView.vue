<template>
  <v-app>
    <v-main class="d-flex align-center justify-center" style="min-height: 100vh; background-color: #f1f5f9">
      <v-card width="400" class="pa-8" elevation="4" rounded="lg">
        <div class="text-center mb-6">
          <h2 class="text-h5 font-weight-bold">Accesos Admin</h2>
          <p class="text-body-2 text-grey mt-1">Plataforma Geo 3D - Lugo</p>
        </div>

        <v-form @submit.prevent="handleLogin">
          <v-text-field
            v-model="email"
            label="Email"
            type="email"
            variant="outlined"
            density="comfortable"
            required
            class="mb-2"
          />
          <v-text-field
            v-model="password"
            label="Contraseña"
            type="password"
            variant="outlined"
            density="comfortable"
            required
            class="mb-2"
          />
          <v-alert v-if="errorMsg" type="error" density="compact" class="mb-4">{{ errorMsg }}</v-alert>
          <v-btn type="submit" color="primary" block size="large" :loading="loading">
            Ingresar al Panel
          </v-btn>
        </v-form>

        <div class="text-center mt-6 pt-4" style="border-top: 1px solid #e2e8f0">
          <router-link to="/" class="text-primary text-decoration-none text-body-2">
            ← Volver al visor 3D
          </router-link>
        </div>
      </v-card>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMsg = ref('')

const handleLogin = async () => {
  loading.value = true
  errorMsg.value = ''
  try {
    await auth.login(email.value, password.value)
    router.push('/admin/sitios')
  } catch (err: any) {
    errorMsg.value = err?.response?.data?.message || 'Error al iniciar sesión'
  } finally {
    loading.value = false
  }
}
</script>
