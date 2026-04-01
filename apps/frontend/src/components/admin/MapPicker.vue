<template>
  <div ref="mapContainer" :style="{ width: '100%', height: height + 'px' }" />
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const props = withDefaults(
  defineProps<{
    latitude?: number
    longitude?: number
    height?: number
    readonly?: boolean
  }>(),
  {
    latitude: 43.0114,
    longitude: -7.5589,
    height: 350,
    readonly: false,
  },
)

const emit = defineEmits<{
  'update:latitude': [value: number]
  'update:longitude': [value: number]
}>()

const mapContainer = ref<HTMLElement>()
let map: L.Map | null = null
let marker: L.Marker | null = null

const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

function placeMarker(lat: number, lng: number) {
  if (!map) return
  if (marker) {
    marker.setLatLng([lat, lng])
  } else {
    marker = L.marker([lat, lng], { icon: defaultIcon }).addTo(map)
  }
}

onMounted(() => {
  if (!mapContainer.value) return

  map = L.map(mapContainer.value).setView([props.latitude, props.longitude], 13)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map)

  if (props.latitude && props.longitude) {
    placeMarker(props.latitude, props.longitude)
  }

  if (!props.readonly) {
    map.on('click', (e: L.LeafletMouseEvent) => {
      placeMarker(e.latlng.lat, e.latlng.lng)
      emit('update:latitude', e.latlng.lat)
      emit('update:longitude', e.latlng.lng)
    })
  }
})

watch(
  () => [props.latitude, props.longitude],
  ([lat, lng]) => {
    if (lat && lng && map) {
      placeMarker(lat, lng)
      map.setView([lat, lng], map.getZoom())
    }
  },
)

onBeforeUnmount(() => {
  map?.remove()
  map = null
})
</script>
