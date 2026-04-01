<template>
  <v-dialog :model-value="modelValue" max-width="800" @update:model-value="$emit('update:modelValue', $event)">
    <v-card v-if="localModel" class="pa-6">
      <h2 class="text-h6 font-weight-bold mb-4">Editar Modelo</h2>

      <v-form @submit.prevent="handleSave">
        <v-row>
          <v-col cols="8">
            <v-text-field
              v-model="localModel.name"
              label="Nombre"
              variant="outlined"
              density="comfortable"
            />
          </v-col>
          <v-col cols="4" class="d-flex align-center justify-end">
            <span class="mr-2 text-body-2">Crear Activo</span>
            <v-switch v-model="localModel.isActive" color="primary" hide-details density="compact" />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="5">
            <div class="text-subtitle-2 font-weight-medium mb-1">Subir un modelo</div>
            <p class="text-caption text-grey mb-3">
              Ingrese el modelo que desea agregar al sistema. Este debe de cumplir con: .gltf .glb (Maximo de 100 MB)
            </p>
            <v-card
              variant="outlined"
              class="d-flex flex-column align-center justify-center pa-8"
              style="min-height: 200px; border-style: dashed; cursor: pointer"
              @click="triggerFileInput"
              @dragover.prevent
              @drop.prevent="onDrop"
            >
              <template v-if="!newFile && !localModel.filename">
                <v-icon size="48" color="primary">mdi-cloud-upload</v-icon>
                <p class="text-body-2 mt-2">
                  <span class="text-primary font-weight-medium">Click para adjuntar</span> o haga arrastre y suelte
                </p>
              </template>
              <template v-else-if="newFile">
                <v-icon size="48" color="success">mdi-check-circle</v-icon>
                <p class="text-body-2 mt-2">{{ newFile.name }}</p>
              </template>
              <template v-else>
                <v-icon size="48" color="success">mdi-check-circle</v-icon>
                <p class="text-body-2 mt-2">{{ localModel.filename }}</p>
              </template>
            </v-card>
            <input ref="fileInput" type="file" accept=".gltf,.glb" hidden @change="onFileSelected" />
          </v-col>
          <v-col cols="7">
            <div class="text-subtitle-1 font-weight-bold mb-2">Previsualización:</div>
            <v-select
              v-model="localPointOfInterestId"
              :items="locations"
              item-title="name"
              item-value="_id"
              label="Agregar modelo a un punto de interés"
              variant="outlined"
              density="comfortable"
              clearable
              class="mb-2"
            />
            <v-card variant="outlined" class="d-flex align-center justify-center" style="height: 250px">
              <span class="text-grey text-caption">Previsualización 3D disponible en próxima fase</span>
            </v-card>
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
import { modelsService, type Model3D } from '@/services/models.service'
import { storageService } from '@/services/storage.service'
import type { PointOfInterest } from '@/services/locations.service'

const props = defineProps<{
  modelValue: boolean
  model: Model3D | null
  locations: PointOfInterest[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  saved: []
}>()

const saving = ref(false)
const localModel = ref<Model3D | null>(null)
const localPointOfInterestId = ref<string | null>(null)
const newFile = ref<File | null>(null)
const fileInput = ref<HTMLInputElement>()

watch(
  () => props.model,
  (m) => {
    if (m) {
      localModel.value = JSON.parse(JSON.stringify(m))
      localPointOfInterestId.value = m.pointOfInterestId?._id ?? null
      newFile.value = null
    }
  },
  { immediate: true },
)

function triggerFileInput() {
  fileInput.value?.click()
}

function onFileSelected(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.item(0)
  if (file) newFile.value = file
}

function onDrop(e: DragEvent) {
  const file = e.dataTransfer?.files[0]
  if (file && (file.name.endsWith('.gltf') || file.name.endsWith('.glb'))) {
    newFile.value = file
  }
}

async function handleSave() {
  if (!localModel.value) return
  saving.value = true
  try {
    const updateData: Record<string, unknown> = {
      name: localModel.value.name,
      isActive: localModel.value.isActive,
      pointOfInterestId: localPointOfInterestId.value || null,
    }

    if (newFile.value) {
      const uploaded = await storageService.upload(newFile.value)
      updateData.fileUrl = uploaded.url
      updateData.filename = uploaded.filename
    }

    await modelsService.update(localModel.value._id, updateData)
    emit('update:modelValue', false)
    emit('saved')
  } finally {
    saving.value = false
  }
}
</script>
