<template>
  <div>
    <h1 class="text-h5 font-weight-bold mb-4">Rutas</h1>

    <v-tabs v-model="activeTab" color="primary" class="mb-4">
      <v-tab value="list">
        <v-icon start>mdi-format-list-bulleted</v-icon>
        Listar elementos
      </v-tab>
      <v-tab value="create" @click="$router.push('/admin/routes/create')">
        <v-icon start>mdi-plus-box</v-icon>
        Agregar elemento
      </v-tab>
    </v-tabs>

    <v-card variant="flat">
      <v-table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripcion</th>
            <th>Inicio</th>
            <th>Fin</th>
            <th class="text-primary">Created</th>
            <th>Accion</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="route in routes" :key="route._id">
            <td>{{ route.name }}</td>
            <td class="text-truncate" style="max-width: 250px">{{ route.description }}</td>
            <td>{{ route.waypoints[0]?.name || '-' }}</td>
            <td>{{ route.waypoints[route.waypoints.length - 1]?.name || '-' }}</td>
            <td>{{ formatDate(route.createdAt) }}</td>
            <td>
              <v-menu>
                <template #activator="{ props: menuProps }">
                  <v-btn icon="mdi-dots-vertical" variant="text" size="small" v-bind="menuProps" />
                </template>
                <v-list density="compact">
                  <v-list-item @click="viewDetail(route)">
                    <v-list-item-title>Ver detalle</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="openEdit(route)">
                    <v-list-item-title>Editar</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="confirmDelete(route)" class="text-error">
                    <v-list-item-title>Eliminar</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </td>
          </tr>
          <tr v-if="!routes.length">
            <td colspan="6" class="text-center text-grey pa-4">No hay rutas registradas</td>
          </tr>
        </tbody>
      </v-table>

      <div class="d-flex justify-center pa-4">
        <v-pagination
          v-model="currentPage"
          :length="totalPages"
          :total-visible="5"
          density="compact"
          rounded
        />
      </div>
    </v-card>

    <RoutesEditDialog v-model="editDialog" :route="editingRoute" :locations="allLocations" @saved="loadRoutes" />

    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title>Confirmar eliminación</v-card-title>
        <v-card-text>¿Estás seguro de eliminar "{{ deletingRoute?.name }}"?</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="deleteDialog = false">Cancelar</v-btn>
          <v-btn color="error" @click="deleteRoute">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="detailDialog" max-width="600">
      <v-card v-if="detailRoute" class="pa-4">
        <v-card-title>{{ detailRoute.name }}</v-card-title>
        <v-card-text>
          <p><strong>Descripción:</strong> {{ detailRoute.description || '-' }}</p>
          <p><strong>Activo:</strong> {{ detailRoute.isActive ? 'Sí' : 'No' }}</p>
          <p class="font-weight-medium mt-2">Waypoints:</p>
          <v-chip
            v-for="(wp, i) in detailRoute.waypoints"
            :key="wp._id"
            class="mr-1 mb-1"
            color="primary"
            size="small"
          >
            {{ i === 0 ? 'Desde' : `Punto ${i}` }}: {{ wp.name }}
          </v-chip>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="detailDialog = false">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { routesService, type Route } from '@/services/routes.service'
import { locationsService, type PointOfInterest } from '@/services/locations.service'
import RoutesEditDialog from './RoutesEditDialog.vue'

const activeTab = ref('list')
const routes = ref<Route[]>([])
const allLocations = ref<PointOfInterest[]>([])
const currentPage = ref(1)
const totalItems = ref(0)
const totalPages = computed(() => Math.ceil(totalItems.value / 10) || 1)

const editDialog = ref(false)
const editingRoute = ref<Route | null>(null)
const deleteDialog = ref(false)
const deletingRoute = ref<Route | null>(null)
const detailDialog = ref(false)
const detailRoute = ref<Route | null>(null)

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, ' - ')
}

async function loadRoutes() {
  const result = await routesService.list({ page: currentPage.value, limit: 10 })
  routes.value = result.data
  totalItems.value = result.total
}

function openEdit(route: Route) {
  editingRoute.value = JSON.parse(JSON.stringify(route))
  editDialog.value = true
}

function viewDetail(route: Route) {
  detailRoute.value = route
  detailDialog.value = true
}

function confirmDelete(route: Route) {
  deletingRoute.value = route
  deleteDialog.value = true
}

async function deleteRoute() {
  if (!deletingRoute.value) return
  await routesService.remove(deletingRoute.value._id)
  deleteDialog.value = false
  deletingRoute.value = null
  loadRoutes()
}

watch(currentPage, loadRoutes)

onMounted(async () => {
  const locationsResp = await locationsService.list({ limit: 200 })
  allLocations.value = locationsResp.data
  loadRoutes()
})
</script>
