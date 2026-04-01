<template>
  <div>
    <h1 class="text-h5 font-weight-bold mb-4">Modelos</h1>

    <v-tabs v-model="activeTab" color="primary" class="mb-4">
      <v-tab value="list" @click="$router.push('/admin/models')">
        <v-icon start>mdi-format-list-bulleted</v-icon>
        Listar elementos
      </v-tab>
      <v-tab value="create">
        <v-icon start>mdi-plus-circle</v-icon>
        Agregar elemento
      </v-tab>
    </v-tabs>

    <v-card variant="flat" class="pa-6">
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

      <v-row>
        <v-col cols="5">
          <div class="text-subtitle-2 font-weight-medium mb-1">Subir un modelo</div>
          <p class="text-caption text-grey mb-3">
            Ingrese el modelo que desea agregar al sistema. Este debe de cumplir con: .gltf .glb (Maximo de 100 MB)
          </p>

          <v-card
            variant="outlined"
            class="d-flex flex-column align-center justify-center pa-8"
            style="min-height: 250px; border-style: dashed; cursor: pointer"
            @click="triggerFileInput"
            @dragover.prevent
            @drop.prevent="onDrop"
          >
            <template v-if="!selectedFile">
              <v-icon size="48" color="primary">mdi-cloud-upload</v-icon>
              <p class="text-body-2 mt-2">
                <span class="text-primary font-weight-medium">Click para adjuntar</span> o haga arrastre y suelte
              </p>
              <p class="text-caption text-grey">.gltf .glb (Maximo de 100 MB)</p>
            </template>
            <template v-else>
              <v-icon size="48" color="success">mdi-check-circle</v-icon>
              <p class="text-body-2 mt-2">{{ selectedFile.name }}</p>
              <p class="text-caption text-grey">{{ (selectedFile.size / 1024 / 1024).toFixed(2) }} MB</p>
              <v-btn size="small" variant="text" color="error" class="mt-1" @click.stop="removeFile">
                Quitar
              </v-btn>
            </template>
          </v-card>

          <input ref="fileInput" type="file" accept=".gltf,.glb" hidden @change="onFileSelected" />
        </v-col>
        <v-col cols="7">
          <div class="text-subtitle-1 font-weight-bold mb-2">Previsualización:</div>
          <v-select
            v-model="form.pointOfInterestId"
            :items="locations"
            item-title="name"
            item-value="_id"
            label="Agregar modelo a un punto de interés"
            variant="outlined"
            density="comfortable"
            clearable
            class="mb-2"
          />
          <v-card variant="outlined" class="d-flex align-center justify-center" style="height: 300px">
            <span class="text-grey text-caption">Previsualización 3D disponible en próxima fase</span>
          </v-card>
        </v-col>
      </v-row>

      <div class="d-flex justify-end mt-6">
        <v-btn color="primary" size="large" :loading="saving" @click="handleCreate">
          CREAR
        </v-btn>
      </div>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { modelsService } from '@/services/models.service'
import { locationsService, type PointOfInterest } from '@/services/locations.service'
import { storageService } from '@/services/storage.service'

const router = useRouter()
const activeTab = ref('create')
const saving = ref(false)
const locations = ref<PointOfInterest[]>([])
const selectedFile = ref<File | null>(null)
const fileInput = ref<HTMLInputElement>()

const form = reactive({
  name: '',
  isActive: true,
  pointOfInterestId: null as string | null,
})

function triggerFileInput() {
  fileInput.value?.click()
}

function onFileSelected(e: Event) {
  const input = e.target as HTMLInputElement
  if (input.files?.length) {
    selectedFile.value = input.files[0]
  }
}

function onDrop(e: DragEvent) {
  const file = e.dataTransfer?.files[0]
  if (file && (file.name.endsWith('.gltf') || file.name.endsWith('.glb'))) {
    selectedFile.value = file
  }
}

function removeFile() {
  selectedFile.value = null
  if (fileInput.value) fileInput.value.value = ''
}

async function handleCreate() {
  saving.value = true
  try {
    let fileUrl: string | undefined
    let filename: string | undefined

    if (selectedFile.value) {
      const uploaded = await storageService.upload(selectedFile.value)
      fileUrl = uploaded.url
      filename = uploaded.filename
    }

    await modelsService.create({
      name: form.name,
      fileUrl,
      filename,
      pointOfInterestId: form.pointOfInterestId || undefined,
      isActive: form.isActive,
    })
    router.push('/admin/models')
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  const resp = await locationsService.list({ limit: 200 })
  locations.value = resp.data
})
</script>
