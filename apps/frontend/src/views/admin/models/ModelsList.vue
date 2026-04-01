<template>
  <div>
    <h1 class="text-h5 font-weight-bold mb-4">Modelos</h1>

    <v-tabs v-model="activeTab" color="primary" class="mb-4">
      <v-tab value="list">
        <v-icon start>mdi-format-list-bulleted</v-icon>
        Listar elementos
      </v-tab>
      <v-tab value="create" @click="$router.push('/admin/models/create')">
        <v-icon start>mdi-plus-box</v-icon>
        Agregar elemento
      </v-tab>
    </v-tabs>

    <v-card variant="flat">
      <v-table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Archivo</th>
            <th>Punto de interés</th>
            <th>Modelo</th>
            <th class="text-primary">Created</th>
            <th>Accion</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="model in models" :key="model._id">
            <td>{{ model.name }}</td>
            <td>{{ model.filename || '-' }}</td>
            <td>{{ model.pointOfInterestId?.name || '-' }}</td>
            <td>
              <v-icon v-if="model.fileUrl" color="primary" size="small">mdi-checkbox-marked</v-icon>
            </td>
            <td>{{ formatDate(model.createdAt) }}</td>
            <td>
              <v-menu>
                <template #activator="{ props: menuProps }">
                  <v-btn icon="mdi-dots-vertical" variant="text" size="small" v-bind="menuProps" />
                </template>
                <v-list density="compact">
                  <v-list-item @click="viewDetail(model)">
                    <v-list-item-title>Ver detalle</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="openEdit(model)">
                    <v-list-item-title>Editar</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="confirmDelete(model)" class="text-error">
                    <v-list-item-title>Eliminar</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </td>
          </tr>
          <tr v-if="!models.length">
            <td colspan="6" class="text-center text-grey pa-4">No hay modelos registrados</td>
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

    <ModelsEditDialog v-model="editDialog" :model="editingModel" :locations="allLocations" @saved="loadModels" />

    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title>Confirmar eliminación</v-card-title>
        <v-card-text>¿Estás seguro de eliminar "{{ deletingModel?.name }}"?</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="deleteDialog = false">Cancelar</v-btn>
          <v-btn color="error" @click="deleteModel">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="detailDialog" max-width="500">
      <v-card v-if="detailModel" class="pa-4">
        <v-card-title>{{ detailModel.name }}</v-card-title>
        <v-card-text>
          <p><strong>Archivo:</strong> {{ detailModel.filename || '-' }}</p>
          <p><strong>Punto de interés:</strong> {{ detailModel.pointOfInterestId?.name || '-' }}</p>
          <p><strong>Activo:</strong> {{ detailModel.isActive ? 'Sí' : 'No' }}</p>
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
import { ref, computed, onMounted, watch } from 'vue'
import { modelsService, type Model3D } from '@/services/models.service'
import { locationsService, type PointOfInterest } from '@/services/locations.service'
import ModelsEditDialog from './ModelsEditDialog.vue'

const activeTab = ref('list')
const models = ref<Model3D[]>([])
const allLocations = ref<PointOfInterest[]>([])
const currentPage = ref(1)
const totalItems = ref(0)
const totalPages = computed(() => Math.ceil(totalItems.value / 10) || 1)

const editDialog = ref(false)
const editingModel = ref<Model3D | null>(null)
const deleteDialog = ref(false)
const deletingModel = ref<Model3D | null>(null)
const detailDialog = ref(false)
const detailModel = ref<Model3D | null>(null)

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, ' - ')
}

async function loadModels() {
  const result = await modelsService.list({ page: currentPage.value, limit: 10 })
  models.value = result.data
  totalItems.value = result.total
}

function openEdit(model: Model3D) {
  editingModel.value = JSON.parse(JSON.stringify(model))
  editDialog.value = true
}

function viewDetail(model: Model3D) {
  detailModel.value = model
  detailDialog.value = true
}

function confirmDelete(model: Model3D) {
  deletingModel.value = model
  deleteDialog.value = true
}

async function deleteModel() {
  if (!deletingModel.value) return
  await modelsService.remove(deletingModel.value._id)
  deleteDialog.value = false
  deletingModel.value = null
  loadModels()
}

watch(currentPage, loadModels)

onMounted(async () => {
  const locationsResp = await locationsService.list({ limit: 200 })
  allLocations.value = locationsResp.data
  loadModels()
})
</script>
