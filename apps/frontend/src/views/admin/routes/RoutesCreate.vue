<template>
  <div>
    <h1 class="text-h5 font-weight-bold mb-4">Rutas</h1>

    <v-tabs v-model="activeTab" color="primary" class="mb-4">
      <v-tab value="list" @click="$router.push('/admin/routes')">
        <v-icon start>mdi-format-list-bulleted</v-icon>
        Listar elementos
      </v-tab>
      <v-tab value="create">
        <v-icon start>mdi-plus-circle</v-icon>
        Agregar elemento
      </v-tab>
    </v-tabs>

    <v-card variant="flat" class="pa-6">
      <h2 class="text-h6 font-weight-bold mb-4">Crear Rutas</h2>

      <v-form @submit.prevent="handleCreate">
        <v-row>
          <v-col cols="9">
            <v-text-field
              v-model="form.name"
              label="Nombre"
              placeholder="Ingresa un nombre"
              variant="outlined"
              density="comfortable"
            />
          </v-col>
          <v-col cols="3" class="d-flex align-center justify-end">
            <span class="mr-2 text-body-2">Crear Activo</span>
            <v-switch v-model="form.isActive" color="primary" hide-details density="compact" />
          </v-col>
        </v-row>

        <v-textarea
          v-model="form.description"
          label="Descripcion"
          placeholder="Ingrese descripcion"
          variant="outlined"
          rows="3"
          class="mb-2"
        />

        <v-row>
          <v-col cols="7">
            <div class="text-subtitle-2 font-weight-medium mb-2">Puntos en el mapa</div>
            <RouteMapViewer
              :waypoints="waypointCoords"
              :height="400"
              :editable="true"
              @add-waypoint="handleAddWaypoint"
              @update-waypoint="handleUpdateWaypoint"
            />
          </v-col>
          <v-col cols="5">
            <div class="text-subtitle-2 font-weight-medium mb-1">Puntos en el mapa</div>
            <p class="text-caption text-grey mb-3">
              Seleccione los puntos de interés que componen a ruta
            </p>

            <v-select
              v-model="selectedLocation"
              :items="availableLocations"
              item-title="name"
              item-value="_id"
              label="Agregar punto de interés"
              variant="outlined"
              density="comfortable"
              @update:model-value="addPoiWaypoint"
            />

            <div v-for="(wp, index) in selectedWaypoints" :key="index" class="mb-2">
              <div class="text-caption text-grey">{{ index === 0 ? 'Desde:' : `Punto ${index}:` }}</div>
              <v-chip
                :color="wp.locationId ? 'primary' : undefined"
                :style="!wp.locationId ? 'background:#757575;color:#fff' : ''"
                :prepend-icon="wp.locationId ? undefined : 'mdi-map-marker'"
                closable
                @click:close="removeWaypoint(index)"
              >
                {{ wp.name }}
              </v-chip>
            </div>
          </v-col>
        </v-row>

        <div class="d-flex justify-end mt-4">
          <v-btn type="submit" color="primary" size="large" :loading="saving" :disabled="selectedWaypoints.length < 2">
            CREAR
          </v-btn>
        </div>
      </v-form>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { routesService, type Waypoint } from '@/services/routes.service'
import { locationsService, type PointOfInterest } from '@/services/locations.service'
import RouteMapViewer from '@/components/viewer/routeMapViewer.vue'

const router = useRouter()
const activeTab = ref('create')
const saving = ref(false)
const allLocations = ref<PointOfInterest[]>([])
const selectedWaypoints = ref<Waypoint[]>([])
const selectedLocation = ref<string | null>(null)

const form = reactive({
  name: '',
  description: '',
  isActive: true,
})

const availableLocations = computed(() =>
  allLocations.value.filter((loc) => !selectedWaypoints.value.find((w) => w.locationId === loc._id)),
)

const waypointCoords = computed(() =>
  selectedWaypoints.value.map((wp) => ({
    name: wp.name,
    latitude: wp.coordinates.latitude,
    longitude: wp.coordinates.longitude,
    isCustom: !wp.locationId,
  })),
)

function addPoiWaypoint(id: string | null) {
  if (!id) return
  const location = allLocations.value.find((s) => s._id === id)
  if (location && !selectedWaypoints.value.find((w) => w.locationId === id)) {
    selectedWaypoints.value.push({
      locationId: location._id,
      name: location.name,
      coordinates: location.coordinates,
    })
  }
  selectedLocation.value = null
}

function handleAddWaypoint(coords: { latitude: number; longitude: number }) {
  const count = selectedWaypoints.value.filter((w) => !w.locationId).length
  selectedWaypoints.value.push({
    locationId: null,
    name: `Custom point ${count + 1}`,
    coordinates: coords,
  })
}

function handleUpdateWaypoint(index: number, coords: { latitude: number; longitude: number }) {
  if (selectedWaypoints.value[index]) {
    selectedWaypoints.value[index] = {
      ...selectedWaypoints.value[index],
      coordinates: coords,
    }
  }
}

function removeWaypoint(index: number) {
  selectedWaypoints.value.splice(index, 1)
}

async function handleCreate() {
  saving.value = true
  try {
    await routesService.create({
      name: form.name,
      description: form.description,
      waypoints: selectedWaypoints.value.map(({ locationId, name, coordinates }) => ({
        locationId,
        name,
        coordinates,
      })),
      isActive: form.isActive,
    })
    router.push('/admin/routes')
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  const resp = await locationsService.list({ limit: 200 })
  allLocations.value = resp.data
})
</script>
