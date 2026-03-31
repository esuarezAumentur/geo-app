<template>
  <div class="admin-layout">
    <aside class="sidebar">
      <div class="logo">
        <h2>🛠️ Backoffice</h2>
        <span class="badge">Admin</span>
      </div>
      
      <nav>
        <ul>
          <li><router-link to="/admin" class="active">Dashboard</router-link></li>
          <li><a href="#">Gestión de Visores</a></li>
          <li><a href="#">Puntos de Interés (POI)</a></li>
          <li><a href="#">Usuarios y Roles</a></li>
        </ul>
      </nav>
      
      <button @click="logout" class="logout-btn">
        Cerrar Sesión
      </button>
    </aside>
    
    <main class="content">
      <header>
        <div>
          <h1>Panel de Administración</h1>
          <p class="subtitle">Bienvenido al sistema de gestión de la plataforma geo.</p>
        </div>
        <router-link to="/" class="view-map-btn">Ver Visor 3D</router-link>
      </header>
      
      <div class="dashboard-cards">
        <div class="card">
          <h3>Visores Activos</h3>
          <p class="number">4</p>
        </div>
        <div class="card">
          <h3>Puntos de Interés Registrados</h3>
          <p class="number">32</p>
        </div>
        <div class="card">
          <h3>Usuarios del Sistema</h3>
          <p class="number">12</p>
        </div>
      </div>
      
      <div class="recent-activity">
        <h3>Actividad Reciente</h3>
        <p>No hay actividad para mostrar hoy.</p>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const logout = () => {
  // Simulamos un cerrado de sesión limpiando el storage
  localStorage.removeItem('auth_token')
  router.push('/login')
}
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
}

.sidebar {
  width: 260px;
  background-color: #1e293b;
  color: white;
  padding: 24px;
  display: flex;
  flex-direction: column;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 40px;
}

.logo h2 {
  margin: 0;
  font-size: 1.4rem;
}

.badge {
  background-color: #3b82f6;
  color: white;
  font-size: 0.7rem;
  padding: 3px 8px;
  border-radius: 12px;
  font-weight: bold;
}

.sidebar ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar li {
  margin-bottom: 15px;
}

.sidebar a {
  color: #94a3b8;
  text-decoration: none;
  font-weight: 500;
  display: block;
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.2s;
}

.sidebar a:hover,
.sidebar a.active {
  color: white;
  background-color: #334155;
}

.logout-btn {
  margin-top: auto;
  background-color: transparent;
  color: #ef4444;
  border: 1px solid #ef4444;
  padding: 12px;
  cursor: pointer;
  border-radius: 6px;
  font-weight: bold;
  transition: all 0.2s;
}

.logout-btn:hover {
  background-color: #ef4444;
  color: white;
}

.content {
  flex: 1;
  padding: 40px;
  background-color: #f8fafc;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
}

header h1 {
  margin: 0 0 5px 0;
  color: #0f172a;
}

.subtitle {
  margin: 0;
  color: #64748b;
}

.view-map-btn {
  background-color: #42b883;
  color: white;
  text-decoration: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: bold;
  box-shadow: 0 2px 4px rgba(66, 184, 131, 0.3);
}

.dashboard-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.card h3 {
  margin-top: 0;
  color: #64748b;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.card .number {
  font-size: 2.5rem;
  margin: 10px 0 0 0;
  color: #0f172a;
  font-weight: 800;
}

.recent-activity {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.recent-activity h3 {
  margin-top: 0;
  color: #0f172a;
}

.recent-activity p {
  color: #64748b;
}
</style>
