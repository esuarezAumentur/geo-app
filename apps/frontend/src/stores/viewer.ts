import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useViewerStore = defineStore('viewer', () => {
  // Estado: Coordenadas del punto de interés actual
  const currentPOI = ref({
    longitude: -74.006, // Ejemplo: NYC
    latitude: 40.7128,
    height: 1000
  })

  // Acción: Actualizar posición (para que los Overlays reaccionen)
  function setCameraLocation(coords: { longitude: number; latitude: number; height: number }) {
    currentPOI.value = coords
  }

  return { currentPOI, setCameraLocation }
})