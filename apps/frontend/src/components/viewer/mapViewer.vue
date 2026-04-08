<template>
  <gmp-map-3d mode="hybrid" :center="center" range="2000" tilt="75" heading="330"></gmp-map-3d>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, computed } from 'vue'

const props = defineProps<{
  apiKey: string
  latitude: string
  longitude: string
  altitude: string
  zoom: string
}>()

const center = computed(() => {
  return `${props.latitude},${props.longitude},${props.altitude}`
})

const places = [
  {
    center: { lat: 43.0033524997657, lng: -7.571028785349617, altitude: 150 },
    tilt: 60,
    heading: 330,
    range: 600,
  },
  {
    center: { lat: 43.0100885152742, lng: -7.560547184223175, altitude: 150 },
    tilt: 70,
    heading: 330,
    range: 300,
  },
]

// --- Types ---
interface TrajectoryPoint {
  center: { lat: number; lng: number; altitude: number }
  tilt: number
  heading: number
  range: number
}

interface Map3DEl extends Element {
  center: { lat: number; lng: number; altitude: number }
}

// --- Animation ---
const SPEED = 0.055 // points per millisecond (~10s for 750 points)

let running = true
let userInteracting = false
let currentIndex = 0
let lastTimestamp = 0
let animFrameId = 0
let trajectoryPoints: TrajectoryPoint[] = []
let mapElement: Map3DEl | null = null

function onPointerDown() { userInteracting = true }
function onPointerUp() { userInteracting = false }
function onWheelStart() {
  userInteracting = true
  clearTimeout(wheelEndTimer)
  wheelEndTimer = window.setTimeout(() => { userInteracting = false }, 300)
}
let wheelEndTimer = 0

function animateTrajectory(timestamp: number) {
  if (!running) return
  if (!lastTimestamp) lastTimestamp = timestamp

  const delta = timestamp - lastTimestamp
  lastTimestamp = timestamp

  currentIndex = Math.min(currentIndex + SPEED * delta, trajectoryPoints.length - 1)

  // if (!userInteracting && mapElement) {
    if (mapElement) {
    const i = Math.floor(currentIndex)
    const point = trajectoryPoints[i]!
    mapElement.center = { 
      lat: point.center.lat, 
      lng: point.center.lng, 
      altitude: 400 
    }
  }

  if (currentIndex >= trajectoryPoints.length - 1) {
    running = false
    return
  }

  animFrameId = requestAnimationFrame(animateTrajectory)
}

// --- Existing helpers (unchanged) ---
function generateIntermediatePoints(startPlace: TrajectoryPoint, endPlace: TrajectoryPoint, n: number) {
  const result: TrajectoryPoint[] = []
  result.push(startPlace)
  for (let i = 1; i <= n; i++) {
    const factor = i / (n + 1)
    const intermediate = {
      center: {
        lat: startPlace.center.lat + (endPlace.center.lat - startPlace.center.lat) * factor,
        lng: startPlace.center.lng + (endPlace.center.lng - startPlace.center.lng) * factor,
        altitude:
          startPlace.center.altitude +
          (endPlace.center.altitude - startPlace.center.altitude) * factor,
      },
      tilt: startPlace.tilt + (endPlace.tilt - startPlace.tilt) * factor,
      heading: startPlace.heading + (endPlace.heading - startPlace.heading) * factor,
      range: startPlace.range + (endPlace.range - startPlace.range) * factor,
    }
    result.push(intermediate)
  }
  result.push(endPlace)
  return result
}

function getMapElement() {
  const mapEl = document.querySelector('gmp-map-3d')
  if (!mapEl) {
    throw new Error('Map element not found')
  }
  return mapEl
}

async function useGoogleMaps() {
  if (document.querySelector('script[data-google-maps]')) {
    // @ts-expect-error Google Maps API is not typed
    const libs = await google.maps.importLibrary('maps3d')
    return libs as { Polyline3DElement: unknown; Model3DElement: unknown }
  }
  await new Promise<void>((resolve) => {
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${props.apiKey}&v=beta&libraries=maps3d`
    script.defer = true
    script.dataset.googleMaps = 'true'
    script.onload = () => resolve()
    document.head.appendChild(script)
  })
  // @ts-expect-error Google Maps API is not typed
  const libs = await google.maps.importLibrary('maps3d')
  return libs as { Polyline3DElement: unknown; Model3DElement: unknown }
}

function loadModel(Model3DElement: new (opts: Record<string, unknown>) => HTMLElement) {
  const mapEl = getMapElement()
  const model = new Model3DElement({
    src: '/lucus-augusti-puerta-mina.glb',
    position: { lat: 43.0100885152742, lng: -7.560547184223175, altitude: 0 },
    altitudeMode: 'RELATIVE_TO_GROUND',
    scale: 1.0,
    orientation: {
      heading: 45,
      tilt: 270,
      roll: 0,
    },
  })
  if (mapEl) {
    mapEl.appendChild(model)
  }
}

// --- Lifecycle ---
onMounted(async () => {
  const mapEl = getMapElement() as unknown as Map3DEl
  mapElement = mapEl

  const libs = await useGoogleMaps()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  loadModel(libs.Model3DElement as any)

  trajectoryPoints = generateIntermediatePoints(places[0]!, places[1]!, 750)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Polyline3DElement = libs.Polyline3DElement as any
  const ruta = new Polyline3DElement({
    altitudeMode: 'CLAMP_TO_GROUND',
    strokeColor: '#FF0000',
    strokeWidth: 8,
    geodesic: true,
    path: trajectoryPoints.map((point) => point.center),
  })

  mapEl.appendChild(ruta)

  mapEl.addEventListener('pointerdown', onPointerDown)
  mapEl.addEventListener('pointerup', onPointerUp)
  mapEl.addEventListener('wheel', onWheelStart)

  running = true
  currentIndex = 0
  lastTimestamp = 0
  animFrameId = requestAnimationFrame(animateTrajectory)
})

onUnmounted(() => {
  running = false
  cancelAnimationFrame(animFrameId)
  clearTimeout(wheelEndTimer)
  if (mapElement) {
    mapElement.removeEventListener('pointerdown', onPointerDown)
    mapElement.removeEventListener('pointerup', onPointerUp)
    mapElement.removeEventListener('wheel', onWheelStart)
  }
})
</script>

<style></style>
