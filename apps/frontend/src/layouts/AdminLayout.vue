<template>
  <v-app>
    <v-navigation-drawer permanent width="220" color="white" border="r">
      <div class="pa-4 d-flex align-center ga-2">
        <v-avatar size="36" color="primary">
          <span class="text-white text-body-2 font-weight-bold">
            {{ userInitials }}
          </span>
        </v-avatar>
        <!-- <div>
          <div class="text-body-2 font-weight-medium">{{ userName }}</div>
          <v-icon size="x-small" icon="mdi-chevron-down" />
        </div> -->
      </div>

      <v-list density="compact" nav class="mt-2">
        <v-list-item
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          :prepend-icon="item.icon"
          :title="item.title"
          rounded="lg"
          color="primary"
        />
      </v-list>

      <template #append>
        <div class="pa-4 text-caption text-grey">Version 1.0.0.11</div>
      </template>
    </v-navigation-drawer>

    <v-app-bar flat color="white" border="b" density="compact">
      <!-- <v-text-field
        placeholder="Quick search"
        prepend-inner-icon="mdi-magnify"
        variant="solo-filled"
        flat
        density="compact"
        hide-details
        class="mx-4"
        style="max-width: 300px"
      />
      <v-spacer />
      <v-btn icon="mdi-account-circle" variant="text" size="small" /> -->
    </v-app-bar>

    <v-main class="bg-grey-lighten-4">
      <div class="pa-6">
        <router-view />
      </div>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

const navItems = [
  { title: 'Sitios de interes', icon: 'mdi-map-marker', to: '/admin/locations' },
  { title: 'Rutas', icon: 'mdi-routes', to: '/admin/routes' },
  { title: 'Modelos', icon: 'mdi-cube-outline', to: '/admin/models' },
  { title: 'Etiquetas', icon: 'mdi-tag-outline', to: '/admin/tags' },
]

const userName = computed(() => auth.user?.name || auth.user?.email || 'Admin')
const userInitials = computed(() => {
  const name = userName.value
  return name.substring(0, 2).toUpperCase()
})
</script>
