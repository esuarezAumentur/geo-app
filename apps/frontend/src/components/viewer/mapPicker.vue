<template>
  <div ref="mapContainer" :style="{ height: `${height}px`, width: '100%', borderRadius: '8px', overflow: 'hidden' }" />
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix default marker icons (Leaflet asset issue with bundlers)
import markerIconUrl from 'leaflet/dist/images/marker-icon.png'
import markerIconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png'
import markerShadowUrl from 'leaflet/dist/images/marker-shadow.png'

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: markerIconUrl,
  iconRetinaUrl: markerIconRetinaUrl,
  shadowUrl: markerShadowUrl,
})

const props = withDefaults(
  defineProps<{
    latitude: number
    longitude: number
    height?: number
  }>(),
  {
    height: 300,
  },
)

const emit = defineEmits<{
  'update:latitude': [value: number]
  'update:longitude': [value: number]
}>()

const mapContainer = ref<HTMLDivElement | null>(null)
let map: L.Map | null = null
let marker: L.Marker | null = null

function setMarker(lat: number, lng: number) {
  if (!map) return
  if (marker) {
    marker.setLatLng([lat, lng])
  } else {
    marker = L.marker([lat, lng], { draggable: true }).addTo(map)
    marker.on('dragend', () => {
      const pos = marker!.getLatLng()
      emit('update:latitude', Math.round(pos.lat * 1e6) / 1e6)
      emit('update:longitude', Math.round(pos.lng * 1e6) / 1e6)
    })
  }
}

onMounted(() => {
  if (!mapContainer.value) return

  map = L.map(mapContainer.value, {
    center: [props.latitude, props.longitude],
    zoom: 15,
  })

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
  }).addTo(map)

  setMarker(props.latitude, props.longitude)

  map.on('click', (e: L.LeafletMouseEvent) => {
    const { lat, lng } = e.latlng
    setMarker(lat, lng)
    emit('update:latitude', Math.round(lat * 1e6) / 1e6)
    emit('update:longitude', Math.round(lng * 1e6) / 1e6)
  })
})

watch(
  () => [props.latitude, props.longitude] as [number, number],
  ([lat, lng]) => {
    if (marker) {
      const current = marker.getLatLng()
      // Only reposition if the parent changed coordinates (not from our own emit)
      if (Math.abs(current.lat - lat) > 1e-7 || Math.abs(current.lng - lng) > 1e-7) {
        setMarker(lat, lng)
        map?.setView([lat, lng])
      }
    }
  },
)

onUnmounted(() => {
  map?.remove()
  map = null
  marker = null
})
</script>
