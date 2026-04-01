import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'viewer',
      component: () => import('../views/ViewerView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/admin',
      component: () => import('../layouts/AdminLayout.vue'),
      meta: { requiresAuth: true },
      redirect: '/admin/locations',
      children: [
        {
          path: 'locations',
          name: 'admin-locations',
          component: () => import('../views/admin/locations/LocationsList.vue'),
        },
        {
          path: 'locations/create',
          name: 'admin-locations-create',
          component: () => import('../views/admin/locations/LocationsCreate.vue'),
        },
        {
          path: 'routes',
          name: 'admin-routes',
          component: () => import('../views/admin/routes/RoutesList.vue'),
        },
        {
          path: 'routes/create',
          name: 'admin-routes-create',
          component: () => import('../views/admin/routes/RoutesCreate.vue'),
        },
        {
          path: 'models',
          name: 'admin-models',
          component: () => import('../views/admin/models/ModelsList.vue'),
        },
        {
          path: 'models/create',
          name: 'admin-models-create',
          component: () => import('../views/admin/models/ModelsCreate.vue'),
        },
        {
          path: 'tags',
          name: 'admin-tags',
          component: () => import('../views/admin/tags/TagsList.vue'),
        },
        {
          path: 'users',
          name: 'admin-users',
          component: () => import('../views/admin/users/UsersList.vue'),
        },
      ],
    },
  ],
})

router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('accessToken')

  if (to.matched.some((r) => r.meta.requiresAuth) && !token) {
    next({ name: 'login' })
  } else if (to.name === 'login' && token) {
    next({ name: 'admin-locations' })
  } else {
    next()
  }
})

export default router
