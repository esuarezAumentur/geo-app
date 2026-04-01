<template>
  <div>
    <h1 class="text-h5 font-weight-bold mb-4">Etiquetas</h1>

    <v-row>
      <v-col cols="8">
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
              <tr v-for="tag in tags" :key="tag._id">
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
                  <v-btn icon="mdi-pencil" variant="text" size="small" @click="openEdit(tag)" />
                  <v-btn icon="mdi-delete" variant="text" size="small" color="error" @click="confirmDelete(tag)" />
                </td>
              </tr>
              <tr v-if="!tags.length">
                <td colspan="5" class="text-center text-grey pa-4">No hay etiquetas registradas</td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </v-col>

      <v-col cols="4">
        <v-card variant="flat" class="pa-4">
          <h3 class="text-subtitle-1 font-weight-bold mb-3">
            {{ editing ? 'Editar etiqueta' : 'Crear etiqueta' }}
          </h3>

          <v-form @submit.prevent="handleSubmit">
            <v-text-field
              v-model="form.name"
              label="Nombre"
              variant="outlined"
              density="comfortable"
              class="mb-2"
            />

            <div class="text-subtitle-2 mb-1">Color</div>
            <v-color-picker v-model="form.color" mode="hex" hide-inputs class="mb-4" />

            <v-switch v-model="form.isActive" label="Activo" color="primary" hide-details class="mb-4" />

            <div class="d-flex ga-2">
              <v-btn v-if="editing" variant="outlined" @click="cancelEdit">Cancelar</v-btn>
              <v-btn type="submit" color="primary" :loading="saving" block>
                {{ editing ? 'Actualizar' : 'Crear' }}
              </v-btn>
            </div>
          </v-form>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title>Confirmar eliminación</v-card-title>
        <v-card-text>¿Estás seguro de eliminar "{{ deletingTag?.name }}"?</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="deleteDialog = false">Cancelar</v-btn>
          <v-btn color="error" @click="deleteTag">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { tagsService, type Tag } from '@/services/tags.service'

const tags = ref<Tag[]>([])
const editing = ref<string | null>(null)
const saving = ref(false)
const deleteDialog = ref(false)
const deletingTag = ref<Tag | null>(null)

const form = reactive({
  name: '',
  color: '#1976D2',
  isActive: true,
})

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, ' - ')
}

async function loadTags() {
  tags.value = await tagsService.list()
}

function openEdit(tag: Tag) {
  editing.value = tag._id
  form.name = tag.name
  form.color = tag.color
  form.isActive = tag.isActive
}

function cancelEdit() {
  editing.value = null
  form.name = ''
  form.color = '#1976D2'
  form.isActive = true
}

async function handleSubmit() {
  saving.value = true
  try {
    if (editing.value) {
      await tagsService.update(editing.value, { name: form.name, color: form.color, isActive: form.isActive })
    } else {
      await tagsService.create({ name: form.name, color: form.color, isActive: form.isActive })
    }
    cancelEdit()
    loadTags()
  } finally {
    saving.value = false
  }
}

function confirmDelete(tag: Tag) {
  deletingTag.value = tag
  deleteDialog.value = true
}

async function deleteTag() {
  if (!deletingTag.value) return
  await tagsService.remove(deletingTag.value._id)
  deleteDialog.value = false
  deletingTag.value = null
  loadTags()
}

onMounted(loadTags)
</script>
