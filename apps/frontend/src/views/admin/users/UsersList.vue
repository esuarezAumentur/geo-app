<template>
  <div>
    <h1 class="text-h5 font-weight-bold mb-4">Usuarios</h1>

    <v-row>
      <v-col cols="8">
        <v-card variant="flat">
          <v-table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Activo</th>
                <th class="text-primary">Created</th>
                <th>Accion</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user._id">
                <td>{{ user.name || '-' }}</td>
                <td>{{ user.email }}</td>
                <td>
                  <v-chip
                    :color="user.role === 'admin' ? 'error' : user.role === 'editor' ? 'warning' : 'info'"
                    size="small"
                    label
                  >
                    {{ user.role }}
                  </v-chip>
                </td>
                <td>
                  <v-icon :color="user.isActive ? 'success' : 'grey'" size="small">
                    {{ user.isActive ? 'mdi-check-circle' : 'mdi-close-circle' }}
                  </v-icon>
                </td>
                <td>{{ formatDate(user.createdAt) }}</td>
                <td>
                  <v-btn icon="mdi-pencil" variant="text" size="small" @click="openEdit(user)" />
                  <v-btn icon="mdi-delete" variant="text" size="small" color="error" @click="confirmDelete(user)" />
                </td>
              </tr>
              <tr v-if="!users.length">
                <td colspan="6" class="text-center text-grey pa-4">No hay usuarios registrados</td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </v-col>

      <v-col cols="4">
        <v-card variant="flat" class="pa-4">
          <h3 class="text-subtitle-1 font-weight-bold mb-3">
            {{ editing ? 'Editar usuario' : 'Crear usuario' }}
          </h3>

          <v-form @submit.prevent="handleSubmit">
            <v-text-field
              v-model="form.name"
              label="Nombre"
              variant="outlined"
              density="comfortable"
              class="mb-2"
            />
            <v-text-field
              v-model="form.email"
              label="Email"
              type="email"
              variant="outlined"
              density="comfortable"
              class="mb-2"
              :disabled="!!editing"
            />
            <v-text-field
              v-if="!editing"
              v-model="form.password"
              label="Contraseña"
              type="password"
              variant="outlined"
              density="comfortable"
              class="mb-2"
            />
            <v-select
              v-model="form.role"
              :items="['admin', 'editor', 'viewer']"
              label="Rol"
              variant="outlined"
              density="comfortable"
              class="mb-2"
            />
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
        <v-card-text>¿Estás seguro de eliminar "{{ deletingUser?.email }}"?</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="deleteDialog = false">Cancelar</v-btn>
          <v-btn color="error" @click="deleteUser">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { usersService, type User } from '@/services/users.service'

const users = ref<User[]>([])
const editing = ref<string | null>(null)
const saving = ref(false)
const deleteDialog = ref(false)
const deletingUser = ref<User | null>(null)

const form = reactive({
  name: '',
  email: '',
  password: '',
  role: 'viewer' as string,
  isActive: true,
})

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, ' - ')
}

async function loadUsers() {
  users.value = await usersService.list()
}

function openEdit(user: User) {
  editing.value = user._id
  form.name = user.name || ''
  form.email = user.email
  form.role = user.role
  form.isActive = user.isActive
  form.password = ''
}

function cancelEdit() {
  editing.value = null
  form.name = ''
  form.email = ''
  form.password = ''
  form.role = 'viewer'
  form.isActive = true
}

async function handleSubmit() {
  saving.value = true
  try {
    if (editing.value) {
      await usersService.update(editing.value, {
        name: form.name,
        role: form.role,
        isActive: form.isActive,
      })
    } else {
      await usersService.create({
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      })
    }
    cancelEdit()
    loadUsers()
  } finally {
    saving.value = false
  }
}

function confirmDelete(user: User) {
  deletingUser.value = user
  deleteDialog.value = true
}

async function deleteUser() {
  if (!deletingUser.value) return
  await usersService.remove(deletingUser.value._id)
  deleteDialog.value = false
  deletingUser.value = null
  loadUsers()
}

onMounted(loadUsers)
</script>
