<template>
  <div>
    <h1 class="text-h5 font-weight-bold mb-4">Etiquetas</h1>

    <v-tabs v-model="activeTab" color="primary" class="mb-4">
      <v-tab value="list">
        <v-icon start>mdi-format-list-bulleted</v-icon>
        Listar elementos
      </v-tab>
      <v-tab value="create">
        <v-icon start>mdi-plus-box</v-icon>
        Agregar elemento
      </v-tab>
    </v-tabs>

    <!-- List tab -->
    <v-row v-if="activeTab === 'list'">
      <v-col cols="3">
        <v-card variant="flat" class="pa-4">
          <h3 class="text-subtitle-1 font-weight-bold mb-3">Filtro</h3>

          <div class="mb-4">
            <div class="text-subtitle-2 font-weight-medium mb-2">Actividad</div>
            <v-checkbox
              v-model="filterActive"
              label="Activo"
              density="compact"
              hide-details
              color="primary"
            />
            <v-checkbox
              v-model="filterInactive"
              label="No activo"
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
                <th>Color</th>
                <th>Activo</th>
                <th class="text-primary">Created</th>
                <th>Accion</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="tag in filteredTags" :key="tag._id">
                <td>
                  <v-chip :color="tag.color" size="small" label>{{ tag.name }}</v-chip>
                </td>
                <td>
                  <div class="d-flex align-center ga-2">
                    <div :style="{ width: '20px', height: '20px', borderRadius: '4px', background: tag.color }" />
                    {{ tag.color }}
                  </div>
                </td>
                <td>
                  <v-icon :color="tag.isActive ? 'success' : 'grey'" size="small">
                    {{ tag.isActive ? 'mdi-check-circle' : 'mdi-close-circle' }}
                  </v-icon>
                </td>
                <td>{{ formatDate(tag.createdAt) }}</td>
                <td>
                  <v-menu>
                    <template #activator="{ props: menuProps }">
                      <v-btn icon="mdi-dots-vertical" variant="text" size="small" v-bind="menuProps" />
                    </template>
                    <v-list density="compact">
                      <v-list-item @click="openEdit(tag)">
                        <v-list-item-title>Editar</v-list-item-title>
                      </v-list-item>
                      <v-list-item class="text-error" @click="confirmDelete(tag)">
                        <v-list-item-title>Eliminar</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </td>
              </tr>
              <tr v-if="!filteredTags.length">
                <td colspan="5" class="text-center text-grey pa-4">No hay etiquetas registradas</td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </v-col>
    </v-row>

    <!-- Create tab -->
    <v-card v-if="activeTab === 'create'" variant="flat" class="pa-6">
      <h2 class="text-h6 font-weight-bold mb-4">Crear etiqueta</h2>

      <v-form @submit.prevent="handleCreate">
        <v-row>
          <v-col cols="6">
            <v-text-field
              v-model="createForm.name"
              label="Nombre"
              placeholder="Ingresa un nombre"
              variant="outlined"
              density="comfortable"
            />

            <v-text-field
              :model-value="createForm.color"
              label="Color seleccionado"
              variant="outlined"
              density="comfortable"
              readonly
            >
              <template #prepend-inner>
                <div :style="{ width: '20px', height: '20px', borderRadius: '4px', background: createForm.color, flexShrink: 0 }" />
              </template>
            </v-text-field>

            <div class="d-flex align-center ga-2 mb-4">
              <span class="text-body-2">Crear Activo</span>
              <v-switch v-model="createForm.isActive" color="primary" hide-details density="compact" />
            </div>

            <div class="d-flex justify-end mt-4">
              <v-btn type="submit" color="primary" size="large" :loading="saving">
                CREAR
              </v-btn>
            </div>
          </v-col>

          <v-col cols="6">
            <div class="text-subtitle-2 mb-2">Seleccionar color</div>
            <v-color-picker v-model="createForm.color" mode="hex" width="100%" />
          </v-col>
        </v-row>
      </v-form>
    </v-card>

    <!-- Edit dialog -->
    <v-dialog v-model="editDialog" max-width="600">
      <v-card v-if="editForm" class="pa-6">
        <h2 class="text-h6 font-weight-bold mb-4">Editar etiqueta</h2>

        <v-form @submit.prevent="handleUpdate">
          <v-row>
            <v-col cols="6">
              <v-text-field
                v-model="editForm.name"
                label="Nombre"
                variant="outlined"
                density="comfortable"
              />

              <v-text-field
                :model-value="editForm.color"
                label="Color seleccionado"
                variant="outlined"
                density="comfortable"
                readonly
              >
                <template #prepend-inner>
                  <div :style="{ width: '20px', height: '20px', borderRadius: '4px', background: editForm.color, flexShrink: 0 }" />
                </template>
              </v-text-field>

              <div class="d-flex align-center ga-2 mb-4">
                <span class="text-body-2">Activo</span>
                <v-switch v-model="editForm.isActive" color="primary" hide-details density="compact" />
              </div>
            </v-col>

            <v-col cols="6">
              <div class="text-subtitle-2 mb-2">Seleccionar color</div>
              <v-color-picker v-model="editForm.color" mode="hex" width="100%" />
            </v-col>
          </v-row>

          <div class="d-flex justify-end ga-2 mt-4">
            <v-btn variant="outlined" @click="editDialog = false">CANCELAR</v-btn>
            <v-btn type="submit" color="primary" :loading="saving">ACEPTAR</v-btn>
          </div>
        </v-form>
      </v-card>
    </v-dialog>

    <!-- Delete confirmation dialog -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title>Confirmar eliminación</v-card-title>
        <v-card-text>¿Estás seguro de eliminar "{{ deletingTag?.name }}"?</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="deleteDialog = false">Cancelar</v-btn>
          <v-btn color="error" @click="handleDelete">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { tagsService, type Tag } from '@/services/tags.service'

const activeTab = ref('list')
const tags = ref<Tag[]>([])
const saving = ref(false)

const filterActive = ref(false)
const filterInactive = ref(false)

const filteredTags = computed(() => {
  if (!filterActive.value && !filterInactive.value) return tags.value
  return tags.value.filter((tag) => {
    if (filterActive.value && filterInactive.value) return true
    if (filterActive.value) return tag.isActive
    if (filterInactive.value) return !tag.isActive
    return true
  })
})

function clearFilters() {
  filterActive.value = false
  filterInactive.value = false
}

const createForm = reactive({
  name: '',
  color: '#1976D2',
  isActive: true,
})

const editDialog = ref(false)
const editForm = ref<{ name: string; color: string; isActive: boolean } | null>(null)
const editingId = ref<string | null>(null)

const deleteDialog = ref(false)
const deletingTag = ref<Tag | null>(null)

function formatDate(d: string) {
  return new Date(d)
    .toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
    .replace(/\//g, ' - ')
}

async function loadTags() {
  tags.value = await tagsService.list()
}

async function handleCreate() {
  saving.value = true
  try {
    await tagsService.create({ name: createForm.name, color: createForm.color, isActive: createForm.isActive })
    createForm.name = ''
    createForm.color = '#1976D2'
    createForm.isActive = true
    activeTab.value = 'list'
    await loadTags()
  } finally {
    saving.value = false
  }
}

function openEdit(tag: Tag) {
  editingId.value = tag._id
  editForm.value = { name: tag.name, color: tag.color, isActive: tag.isActive }
  editDialog.value = true
}

async function handleUpdate() {
  if (!editingId.value || !editForm.value) return
  saving.value = true
  try {
    await tagsService.update(editingId.value, {
      name: editForm.value.name,
      color: editForm.value.color,
      isActive: editForm.value.isActive,
    })
    editDialog.value = false
    editingId.value = null
    editForm.value = null
    await loadTags()
  } finally {
    saving.value = false
  }
}

function confirmDelete(tag: Tag) {
  deletingTag.value = tag
  deleteDialog.value = true
}

async function handleDelete() {
  if (!deletingTag.value) return
  await tagsService.remove(deletingTag.value._id)
  deleteDialog.value = false
  deletingTag.value = null
  await loadTags()
}

onMounted(loadTags)
</script>
