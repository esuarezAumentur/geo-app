import { createRouter, createWebHistory } from 'vue-router'
import ViewerView from '../views/ViewerView.vue'
import AdminView from '../views/AdminView.vue'
import LoginView from '../views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'viewer',
      component: ViewerView,
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminView,
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    }
  ],
})

// Validación básica de acceso para rutas protegidas
router.beforeEach((to, from, next) => {
  // En el futuro, reemplazaremos esto con un store de Pinia y un JWT real
  const isAuthenticated = localStorage.getItem('auth_token')
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    // Si intenta ir a /admin sin estar logueado, lo mandamos al /login
    next({ name: 'login' })
  } else if (to.name === 'login' && isAuthenticated) {
    // Si ya está logueado e intenta ir a /login, lo redirigimos al /admin
    next({ name: 'admin' })
  } else {
    // Permite la navegación en cualquier otro caso
    next()
  }
})

export default router
