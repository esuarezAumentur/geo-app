<template>
  <v-dialog :model-value="modelValue" max-width="900" @update:model-value="$emit('update:modelValue', $event)">
    <v-card v-if="localRoute" class="pa-6">
      <h2 class="text-h6 font-weight-bold mb-4">Editar Rutas</h2>

      <v-form @submit.prevent="handleSave">
        <v-row>
          <v-col cols="9">
            <v-text-field
              v-model="localRoute.name"
              label="Nombre"
              variant="outlined"
              density="comfortable"
            />
          </v-col>
          <v-col cols="3" class="d-flex align-center justify-end">
            <span class="mr-2 text-body-2">Activo</span>
            <v-switch v-model="localRoute.isActive" color="primary" hide-details density="compact" />
          </v-col>
        </v-row>

        <v-textarea
          v-model="localRoute.description"
          label="Descripcion"
          variant="outlined"
          rows="3"
          class="mb-2"
        />

        <v-row>
          <v-col cols="7">
            <div class="text-subtitle-2 font-weight-medium mb-2">Puntos en el mapa</div>
            <RouteMapViewer
              :waypoints="waypointCoords"
              :height="350"
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

            <div v-for="(wp, index) in localWaypoints" :key="index" class="mb-2">
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

        <div class="d-flex justify-end ga-2 mt-4">
          <v-btn variant="outlined" @click="$emit('update:modelValue', false)">CANCELAR</v-btn>
          <v-btn type="submit" color="primary" :loading="saving" :disabled="localWaypoints.length < 2">ACEPTAR</v-btn>
        </div>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { routesService, type Route, type Waypoint } from '@/services/routes.service'
import type { PointOfInterest } from '@/services/locations.service'
import RouteMapViewer from '@/components/viewer/routeMapViewer.vue'

const props = defineProps<{
  modelValue: boolean
  route: Route | null
  locations: PointOfInterest[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  saved: []
}>()

const saving = ref(false)
const localRoute = ref<Route | null>(null)
const localWaypoints = ref<Waypoint[]>([])
const selectedLocation = ref<string | null>(null)

const availableLocations = computed(() =>
  props.locations.filter((loc) => !localWaypoints.value.find((w) => w.locationId === loc._id)),
)

const waypointCoords = computed(() =>
  localWaypoints.value.map((wp) => ({
    name: wp.name,
    latitude: wp.coordinates.latitude,
    longitude: wp.coordinates.longitude,
    isCustom: !wp.locationId,
  })),
)

watch(
  () => props.route,
  (r) => {
    if (r) {
      localRoute.value = JSON.parse(JSON.stringify(r))
      localWaypoints.value = r.waypoints.map((wp) => ({ ...wp }))
    }
  },
  { immediate: true },
)

function addPoiWaypoint(id: string | null) {
  if (!id) return
  const location = props.locations.find((s) => s._id === id)
  if (location && !localWaypoints.value.find((w) => w.locationId === id)) {
    localWaypoints.value.push({
      locationId: location._id,
      name: location.name,
      coordinates: location.coordinates,
    })
  }
  selectedLocation.value = null
}

function handleAddWaypoint(coords: { latitude: number; longitude: number }) {
  const count = localWaypoints.value.filter((w) => !w.locationId).length
  localWaypoints.value.push({
    locationId: null,
    name: `Custom point ${count + 1}`,
    coordinates: coords,
  })
}

function handleUpdateWaypoint(index: number, coords: { latitude: number; longitude: number }) {
  if (localWaypoints.value[index]) {
    localWaypoints.value[index] = {
      ...localWaypoints.value[index],
      coordinates: coords,
    }
  }
}

function removeWaypoint(index: number) {
  localWaypoints.value.splice(index, 1)
}

async function handleSave() {
  if (!localRoute.value) return
  saving.value = true
  try {
    await routesService.update(localRoute.value._id, {
      name: localRoute.value.name,
      description: localRoute.value.description,
      waypoints: localWaypoints.value.map(({ locationId, name, coordinates }) => ({
        locationId,
        name,
        coordinates,
      })),
      isActive: localRoute.value.isActive,
    })
    emit('update:modelValue', false)
    emit('saved')
  } finally {
    saving.value = false
  }
}
</script>
