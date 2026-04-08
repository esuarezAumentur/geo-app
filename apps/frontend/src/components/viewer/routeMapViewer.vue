<template>
  <div :style="{ position: 'relative', height: `${height}px`, width: '100%' }">
    <div
      ref="mapContainer"
      :style="{ height: '100%', width: '100%', borderRadius: '8px', overflow: 'hidden' }"
    />
    <div v-if="editable" style="position: absolute; top: 10px; right: 10px; z-index: 1000">
      <v-btn
        :color="addMode ? 'warning' : 'primary'"
        :prepend-icon="addMode ? 'mdi-close' : 'mdi-map-marker-plus'"
        size="small"
        elevation="2"
        @click="toggleAddMode"
      >
        {{ addMode ? 'Cancelar' : 'Agregar punto personalizado' }}
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

import markerIconUrl from 'leaflet/dist/images/marker-icon.png'
import markerIconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png'
import markerShadowUrl from 'leaflet/dist/images/marker-shadow.png'

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: markerIconUrl,
  iconRetinaUrl: markerIconRetinaUrl,
  shadowUrl: markerShadowUrl,
})

interface ViewerWaypoint {
  name: string
  latitude: number
  longitude: number
  isCustom?: boolean
}

const props = withDefaults(
  defineProps<{
    waypoints: ViewerWaypoint[]
    height?: number
    editable?: boolean
  }>(),
  {
    height: 350,
    editable: false,
  },
)

const emit = defineEmits<{
  'add-waypoint': [coords: { latitude: number; longitude: number }]
  'update-waypoint': [index: number, coords: { latitude: number; longitude: number }]
}>()

const mapContainer = ref<HTMLDivElement | null>(null)
const addMode = ref(false)
let map: L.Map | null = null
let markers: L.Marker[] = []
let polyline: L.Polyline | null = null

function getMarkerIcon(index: number, isCustom: boolean) {
  const bg = isCustom ? '#757575' : '#1976d2'
  return L.divIcon({
    html: `<div style="background:${bg};color:#fff;width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:bold;border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.4)">${index + 1}</div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
    className: '',
  })
}

function renderWaypoints() {
  if (!map) return

  markers.forEach((m) => m.remove())
  markers = []
  polyline?.remove()
  polyline = null

  if (props.waypoints.length === 0) return

  const coords: L.LatLngExpression[] = props.waypoints.map((wp) => [wp.latitude, wp.longitude])

  props.waypoints.forEach((wp, index) => {
    const isCustom = wp.isCustom ?? false
    const icon = getMarkerIcon(index, isCustom)

    const m = L.marker([wp.latitude, wp.longitude], {
      icon,
      draggable: isCustom && props.editable,
    })
      .addTo(map!)
      .bindPopup(`<strong>${wp.name}</strong>`)

    if (isCustom && props.editable) {
      m.on('dragend', () => {
        const pos = m.getLatLng()
        emit('update-waypoint', index, {
          latitude: Math.round(pos.lat * 1e6) / 1e6,
          longitude: Math.round(pos.lng * 1e6) / 1e6,
        })
      })
    }

    markers.push(m)
  })

  polyline = L.polyline(coords, { color: '#1976d2', weight: 4, dashArray: '8 6' }).addTo(map)

  const bounds = L.latLngBounds(coords)
  map.fitBounds(bounds, { padding: [40, 40] })
}

function toggleAddMode() {
  addMode.value = !addMode.value
  if (map) {
    map.getContainer().style.cursor = addMode.value ? 'crosshair' : ''
  }
}

function handleMapClick(e: L.LeafletMouseEvent) {
  if (!addMode.value) return
  const { lat, lng } = e.latlng
  emit('add-waypoint', {
    latitude: Math.round(lat * 1e6) / 1e6,
    longitude: Math.round(lng * 1e6) / 1e6,
  })
  addMode.value = false
  if (map) {
    map.getContainer().style.cursor = ''
  }
}

onMounted(() => {
  if (!mapContainer.value) return

  const center: L.LatLngExpression =
    props.waypoints.length > 0
      ? [props.waypoints[0].latitude, props.waypoints[0].longitude]
      : [43.0114, -7.5589]

  map = L.map(mapContainer.value, { center, zoom: 14 })

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
  }).addTo(map)

  map.on('click', handleMapClick)

  renderWaypoints()
})

watch(() => props.waypoints, renderWaypoints, { deep: true })

onUnmounted(() => {
  map?.remove()
  map = null
})
</script>
