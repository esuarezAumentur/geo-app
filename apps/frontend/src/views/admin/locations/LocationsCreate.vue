<template>
  <div>
    <h1 class="text-h5 font-weight-bold mb-4">Sitios de interes</h1>

    <v-tabs v-model="activeTab" color="primary" class="mb-4">
      <v-tab value="list" @click="$router.push('/admin/locations')">
        <v-icon start>mdi-format-list-bulleted</v-icon>
        Listar elementos
      </v-tab>
      <v-tab value="create">
        <v-icon start>mdi-plus-circle</v-icon>
        Agregar elemento
      </v-tab>
    </v-tabs>

    <v-card variant="flat" class="pa-6">
      <h2 class="text-h6 font-weight-bold mb-4">Crear un punto de interés</h2>

      <v-form @submit.prevent="handleCreate">
        <v-row>
          <v-col cols="5">
            <v-text-field
              v-model="form.name"
              label="Nombre"
              placeholder="Ingresa un nombre"
              variant="outlined"
              density="comfortable"
            />
          </v-col>
          <v-col cols="4">
            <v-select
              v-model="form.tagId"
              :items="tags"
              item-title="name"
              item-value="_id"
              label="Etiqueta"
              placeholder="Seleccione una etiqueta"
              variant="outlined"
              density="comfortable"
              clearable
            />
          </v-col>
          <v-col cols="3" class="d-flex align-center justify-end">
            <span class="mr-2 text-body-2">Crear Activo</span>
            <v-switch v-model="form.isActive" color="primary" hide-details density="compact" />
          </v-col>
        </v-row>

        <v-textarea
          v-model="form.description"
          label="Descripcion"
          placeholder="Ingrese descripcion"
          variant="outlined"
          rows="3"
          class="mb-2"
        />

        <v-row>
          <v-col cols="6">
            <v-select
              v-model="form.modelId"
              :items="models"
              item-title="name"
              item-value="_id"
              label="Seleccionar modelo"
              placeholder="Modelo"
              variant="outlined"
              density="comfortable"
              clearable
            />
            <v-text-field
              v-model="form.url"
              label="Url adjunta"
              placeholder="Ingrese la url"
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
              :latitude="form.latitude"
              :longitude="form.longitude"
              @update:latitude="form.latitude = $event"
              @update:longitude="form.longitude = $event"
            />
            <v-row class="mt-2">
              <v-col>
                <v-text-field
                  :model-value="form.latitude"
                  label="Latitud"
                  variant="outlined"
                  density="compact"
                  readonly
                />
              </v-col>
              <v-col>
                <v-text-field
                  :model-value="form.longitude"
                  label="Longitud"
                  variant="outlined"
                  density="compact"
                  readonly
                />
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <div class="d-flex justify-end mt-4">
          <v-btn type="submit" color="primary" size="large" :loading="saving">
            CREAR
          </v-btn>
        </div>
      </v-form>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { locationsService } from '@/services/locations.service'
import { tagsService, type Tag } from '@/services/tags.service'
import { modelsService, type Model3D } from '@/services/models.service'
import MapPicker from '@/components/admin/MapPicker.vue'

const router = useRouter()
const activeTab = ref('create')
const saving = ref(false)
const tags = ref<Tag[]>([])
const models = ref<Model3D[]>([])

const form = reactive({
  name: '',
  description: '',
  tagId: null as string | null,
  modelId: null as string | null,
  url: '',
  isActive: true,
  latitude: 43.0114,
  longitude: -7.5589,
})

async function handleCreate() {
  saving.value = true
  try {
    await locationsService.create({
      name: form.name,
      description: form.description,
      tagId: form.tagId || undefined,
      modelId: form.modelId || undefined,
      coordinates: { latitude: form.latitude, longitude: form.longitude },
      url: form.url || undefined,
      isActive: form.isActive,
      isVisible: true,
    })
    router.push('/admin/locations')
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  tags.value = await tagsService.list()
  const resp = await modelsService.list({ limit: 100 })
  models.value = resp.data
})
</script>
