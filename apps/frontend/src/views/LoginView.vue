<template>
  <div class="login-container">
    <div class="login-box">
      <div class="header">
        <h2>🔒 Accesos Admin</h2>
        <p class="subtitle">Plataforma Geo 3D - Lugo</p>
      </div>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label>Usuario / Email</label>
          <input v-model="email" type="text" placeholder="" required />
        </div>

        <div class="form-group">
          <label>Contraseña</label>
          <input v-model="password" type="password" placeholder="••••••••" required />
        </div>

        <button type="submit" class="login-btn">Ingresar al Backoffice</button>
      </form>

      <div class="footer">
        <router-link to="/" class="back-link">← Volver al visor 3D</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const password = ref('')

const handleLogin = () => {
  // Simulación de login. Acepta cualquier credencial.
  console.log('Iniciando sesión con:', email.value)

  // Guardamos un token "ficticio" en el localStorage
  localStorage.setItem('auth_token', 'jwt_simulator_token_9823489234')

  // Redirigimos a la ruta protegida
  router.push('/admin')
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f1f5f9;
  font-family: 'Inter', sans-serif;
}

.login-box {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 380px;
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.header h2 {
  margin: 0 0 5px 0;
  color: #0f172a;
}

.subtitle {
  color: #64748b;
  margin: 0;
  font-size: 0.95rem;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #334155;
  font-weight: 600;
  font-size: 0.9rem;
}

.form-group input {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  box-sizing: border-box;
  font-family: inherit;
  transition: border-color 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.login-btn {
  width: 100%;
  padding: 14px;
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  margin-top: 10px;
  transition: background-color 0.2s;
}

.login-btn:hover {
  background-color: #33a06f;
}

.footer {
  margin-top: 30px;
  text-align: center;
  border-top: 1px solid #e2e8f0;
  padding-top: 20px;
}

.back-link {
  color: #3b82f6;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
}

.back-link:hover {
  text-decoration: underline;
}
</style>
