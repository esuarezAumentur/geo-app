<template>
  <v-dialog :model-value="modelValue" max-width="900" @update:model-value="$emit('update:modelValue', $event)">
    <v-card v-if="localLocation" class="pa-6">
      <h2 class="text-h6 font-weight-bold mb-4">Editar un punto de interés</h2>

      <v-form @submit.prevent="handleSave">
        <v-row>
          <v-col cols="5">
            <v-text-field
              v-model="localLocation.name"
              label="Nombre"
              variant="outlined"
              density="comfortable"
            />
          </v-col>
          <v-col cols="4">
            <v-select
              v-model="localTagId"
              :items="tags"
              item-title="name"
              item-value="_id"
              label="Etiqueta"
              variant="outlined"
              density="comfortable"
              clearable
            />
          </v-col>
          <v-col cols="3" class="d-flex align-center justify-end">
            <span class="mr-2 text-body-2">Activo</span>
            <v-switch v-model="localLocation.isActive" color="primary" hide-details density="compact" />
          </v-col>
        </v-row>

        <v-textarea
          v-model="localLocation.description"
          label="Descripcion"
          variant="outlined"
          rows="3"
          class="mb-2"
        />

        <v-row>
          <v-col cols="6">
            <v-select
              v-model="localModelId"
              :items="models"
              item-title="name"
              item-value="_id"
              label="Seleccionar modelo"
              variant="outlined"
              density="comfortable"
              clearable
            />
            <v-text-field
              v-model="localLocation.url"
              label="Url adjunta"
              variant="outlined"
              density="comfortable"
            />
          </v-col>
          <v-col cols="6">
            <div class="text-subtitle-2 font-weight-medium mb-1">Posicion en el mapa</div>
            <p class="text-caption text-grey mb-2">
              Seleccione en el mapa el lugar donde quiere que este ubicado el punto de interés
            </p>
            <MapPicker
              :latitude="localLocation.coordinates.latitude"
              :longitude="localLocation.coordinates.longitude"
              :height="280"
              @update:latitude="localLocation.coordinates.latitude = $event"
              @update:longitude="localLocation.coordinates.longitude = $event"
            />
            <v-row class="mt-2">
              <v-col>
                <v-text-field
                  :model-value="localLocation.coordinates.latitude"
                  label="Latitud"
                  variant="outlined"
                  density="compact"
                  readonly
                />
              </v-col>
              <v-col>
                <v-text-field
                  :model-value="localLocation.coordinates.longitude"
                  label="Longitud"
                  variant="outlined"
                  density="compact"
                  readonly
                />
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <div class="d-flex justify-end ga-2 mt-4">
          <v-btn variant="outlined" @click="$emit('update:modelValue', false)">CANCELAR</v-btn>
          <v-btn type="submit" color="primary" :loading="saving">ACEPTAR</v-btn>
        </div>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { locationsService, type PointOfInterest } from '@/services/locations.service'
import type { Tag } from '@/services/tags.service'
import type { Model3D } from '@/services/models.service'
import MapPicker from '@/components/admin/MapPicker.vue'

const props = defineProps<{
  modelValue: boolean
  location: PointOfInterest | null
  tags: Tag[]
  models: Model3D[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  saved: []
}>()

const saving = ref(false)
const localLocation = ref<PointOfInterest | null>(null)
const localTagId = ref<string | null>(null)
const localModelId = ref<string | null>(null)

watch(
  () => props.location,
  (s) => {
    if (s) {
      localLocation.value = JSON.parse(JSON.stringify(s))
      localTagId.value = s.tagId?._id ?? null
      localModelId.value = s.modelId?._id ?? null
    }
  },
  { immediate: true },
)

async function handleSave() {
  if (!localLocation.value) return
  saving.value = true
  try {
    await locationsService.update(localLocation.value._id, {
      name: localLocation.value.name,
      description: localLocation.value.description,
      tagId: localTagId.value || undefined,
      modelId: localModelId.value || null,
      coordinates: localLocation.value.coordinates,
      url: localLocation.value.url || undefined,
      isActive: localLocation.value.isActive,
      isVisible: localLocation.value.isVisible,
    })
    emit('update:modelValue', false)
    emit('saved')
  } finally {
    saving.value = false
  }
}
</script>
