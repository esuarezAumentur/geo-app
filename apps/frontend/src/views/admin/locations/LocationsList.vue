<template>
  <div>
    <h1 class="text-h5 font-weight-bold mb-4">Sitios de interes</h1>

    <v-tabs v-model="activeTab" color="primary" class="mb-4">
      <v-tab value="list">
        <v-icon start>mdi-format-list-bulleted</v-icon>
        Listar elementos
      </v-tab>
      <v-tab value="create" @click="$router.push('/admin/locations/create')">
        <v-icon start>mdi-plus-box</v-icon>
        Agregar elemento
      </v-tab>
    </v-tabs>

    <v-row>
      <v-col cols="3">
        <v-card variant="flat" class="pa-4">
          <h3 class="text-subtitle-1 font-weight-bold mb-3">Filtro</h3>

          <div class="mb-4">
            <div class="text-subtitle-2 font-weight-medium mb-2">Etiquetas</div>
            <v-checkbox
              v-for="tag in tags"
              :key="tag._id"
              v-model="selectedTags"
              :value="tag._id"
              :label="tag.name"
              density="compact"
              hide-details
              color="primary"
            />
          </div>

          <div class="mb-4">
            <div class="text-subtitle-2 font-weight-medium mb-2">Modelo</div>
            <v-checkbox
              v-model="filterModel"
              label="Con modelo"
              density="compact"
              hide-details
              color="primary"
            />
            <v-checkbox
              v-model="filterNoModel"
              label="Sin modelo"
              density="compact"
              hide-details
            />
          </div>

          <div class="mb-4">
            <div class="text-subtitle-2 font-weight-medium mb-2">Visibilidad</div>
            <v-checkbox
              v-model="filterVisible"
              label="Visible"
              density="compact"
              hide-details
              color="primary"
            />
            <v-checkbox
              v-model="filterNotVisible"
              label="No visible"
              density="compact"
              hide-details
            />
          </div>

          <v-btn variant="outlined" block @click="clearFilters">Limpiar</v-btn>
        </v-card>
      </v-col>

      <v-col cols="9">
        <v-card variant="flat">
          <v-table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Descripcion</th>
                <th>Etiqueta</th>
                <th>Modelo</th>
                <th class="text-primary">Created</th>
                <th>Accion</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="location in locations" :key="location._id">
                <td>{{ location.name }}</td>
                <td class="text-truncate" style="max-width: 200px">{{ location.description }}</td>
                <td>
                  <v-chip
                    v-if="location.tagId"
                    :color="location.tagId.color"
                    size="small"
                    label
                  >
                    {{ location.tagId.name }}
                  </v-chip>
                </td>
                <td>
                  <v-icon v-if="location.modelId" color="primary" size="small">mdi-checkbox-marked</v-icon>
                </td>
                <td>{{ formatDate(location.createdAt) }}</td>
                <td>
                  <v-menu>
                    <template #activator="{ props: menuProps }">
                      <v-btn icon="mdi-dots-vertical" variant="text" size="small" v-bind="menuProps" />
                    </template>
                    <v-list density="compact">
                      <v-list-item @click="viewDetail(location)">
                        <v-list-item-title>Ver detalle</v-list-item-title>
                      </v-list-item>
                      <v-list-item @click="openEdit(location)">
                        <v-list-item-title>Editar</v-list-item-title>
                      </v-list-item>
                      <v-list-item @click="confirmDelete(location)" class="text-error">
                        <v-list-item-title>Eliminar</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </td>
              </tr>
              <tr v-if="!locations.length">
                <td colspan="6" class="text-center text-grey pa-4">No hay sitios registrados</td>
              </tr>
            </tbody>
          </v-table>

          <div class="d-flex justify-center pa-4">
            <v-pagination
              v-model="currentPage"
              :length="totalPages"
              :total-visible="5"
              density="compact"
              rounded
            />
          </div>
        </v-card>
      </v-col>
    </v-row>

    <LocationsEditDialog
      v-model="editDialog"
      :location="editingLocation"
      :tags="tags"
      :models="models"
      @saved="loadLocations"
    />

    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title>Confirmar eliminación</v-card-title>
        <v-card-text>¿Estás seguro de eliminar "{{ deletingLocation?.name }}"?</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="deleteDialog = false">Cancelar</v-btn>
          <v-btn color="error" @click="deleteLocation">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="detailDialog" max-width="600">
      <v-card v-if="detailLocation">
        <v-card-title>{{ detailLocation.name }}</v-card-title>
        <v-card-text>
          <p><strong>Descripción:</strong> {{ detailLocation.description || '-' }}</p>
          <p><strong>Etiqueta:</strong> {{ detailLocation.tagId?.name || '-' }}</p>
          <p><strong>Modelo:</strong> {{ detailLocation.modelId?.name || 'Sin modelo' }}</p>
          <p><strong>Coordenadas:</strong> {{ detailLocation.coordinates.latitude }}, {{ detailLocation.coordinates.longitude }}</p>
          <p><strong>URL:</strong> {{ detailLocation.url || '-' }}</p>
          <p><strong>Activo:</strong> {{ detailLocation.isActive ? 'Sí' : 'No' }}</p>
          <p><strong>Visible:</strong> {{ detailLocation.isVisible ? 'Sí' : 'No' }}</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="detailDialog = false">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { locationsService, type PointOfInterest } from '@/services/locations.service'
import { tagsService, type Tag } from '@/services/tags.service'
import { modelsService, type Model3D } from '@/services/models.service'
import LocationsEditDialog from './LocationsEditDialog.vue'

const activeTab = ref('list')
const locations = ref<PointOfInterest[]>([])
const tags = ref<Tag[]>([])
const models = ref<Model3D[]>([])
const currentPage = ref(1)
const totalItems = ref(0)
const totalPages = computed(() => Math.ceil(totalItems.value / 10) || 1)

const selectedTags = ref<string[]>([])
const filterModel = ref(false)
const filterNoModel = ref(false)
const filterVisible = ref(false)
const filterNotVisible = ref(false)

const editDialog = ref(false)
const editingLocation = ref<PointOfInterest | null>(null)
const deleteDialog = ref(false)
const deletingLocation = ref<PointOfInterest | null>(null)
const detailDialog = ref(false)
const detailLocation = ref<PointOfInterest | null>(null)

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, ' - ')
}

async function loadLocations() {
  const filters: Record<string, unknown> = { page: currentPage.value, limit: 10 }
  if (selectedTags.value.length === 1) filters.tag = selectedTags.value[0]
  if (filterModel.value && !filterNoModel.value) filters.model = 'true'
  if (filterNoModel.value && !filterModel.value) filters.model = 'false'
  if (filterVisible.value && !filterNotVisible.value) filters.visible = 'true'
  if (filterNotVisible.value && !filterVisible.value) filters.visible = 'false'

  const result = await locationsService.list(filters as any)
  locations.value = result.data
  totalItems.value = result.total
}

function clearFilters() {
  selectedTags.value = []
  filterModel.value = false
  filterNoModel.value = false
  filterVisible.value = false
  filterNotVisible.value = false
  currentPage.value = 1
}

function openEdit(location: PointOfInterest) {
  editingLocation.value = { ...location }
  editDialog.value = true
}

function viewDetail(location: PointOfInterest) {
  detailLocation.value = location
  detailDialog.value = true
}

function confirmDelete(location: PointOfInterest) {
  deletingLocation.value = location
  deleteDialog.value = true
}

async function deleteLocation() {
  if (!deletingLocation.value) return
  await locationsService.remove(deletingLocation.value._id)
  deleteDialog.value = false
  deletingLocation.value = null
  loadLocations()
}

watch([currentPage, selectedTags, filterModel, filterNoModel, filterVisible, filterNotVisible], () => {
  loadLocations()
})

onMounted(async () => {
  tags.value = await tagsService.list()
  const modelsResp = await modelsService.list({ limit: 100 })
  models.value = modelsResp.data
  loadLocations()
})
</script>
