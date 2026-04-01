<template>
  <div ref="mapContainer" :style="{ width: '100%', height: height + 'px' }" />
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface WaypointCoord {
  name: string
  latitude: number
  longitude: number
}

const props = withDefaults(
  defineProps<{
    waypoints?: WaypointCoord[]
    height?: number
  }>(),
  {
    waypoints: () => [],
    height: 400,
  },
)

const mapContainer = ref<HTMLElement>()
let map: L.Map | null = null
let markersLayer: L.LayerGroup | null = null
let polyline: L.Polyline | null = null

const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

function updateMap() {
  if (!map || !markersLayer) return
  markersLayer.clearLayers()
  if (polyline) {
    polyline.remove()
    polyline = null
  }

  const coords: L.LatLngExpression[] = []
  props.waypoints.forEach((wp) => {
    const latlng: L.LatLngTuple = [wp.latitude, wp.longitude]
    coords.push(latlng)
    L.marker(latlng, { icon: defaultIcon }).bindPopup(wp.name).addTo(markersLayer!)
  })

  if (coords.length >= 2) {
    polyline = L.polyline(coords, { color: '#1976D2', weight: 3 }).addTo(map)
    map.fitBounds(polyline.getBounds(), { padding: [30, 30] })
  } else if (coords.length === 1) {
    map.setView(coords[0], 13)
  }
}

onMounted(() => {
  if (!mapContainer.value) return

  map = L.map(mapContainer.value).setView([43.0114, -7.5589], 13)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map)

  markersLayer = L.layerGroup().addTo(map)
  updateMap()
})

watch(() => props.waypoints, updateMap, { deep: true })

onBeforeUnmount(() => {
  map?.remove()
  map = null
})
</script>
