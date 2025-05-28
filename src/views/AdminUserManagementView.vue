<template>
  <div class="max-w-7xl mx-auto p-6">
    <!-- Main title -->
    <h1 class="text-3xl font-bold text-primary text-center mb-8">Panel de Gestión de Usuarios</h1>

    <!-- Header with icon and create button -->
    <div class="flex justify-between items-center flex-wrap gap-4 mb-6">
      <div class="flex items-center gap-2">
        <UsersIcon class="w-6 h-6 text-primary" />
        <h2 class="text-xl font-semibold">Lista de Usuarios</h2>
      </div>
      <button
        @click="openCreateUser"
        class="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded hover:bg-hover transition"
      >
        <PlusIcon class="w-5 h-5" />
        Nuevo Usuario
      </button>
    </div>

    <!-- Filters: Role and Account Status -->
    <div class="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md mb-6 space-y-4">
      <div class="flex flex-wrap items-center gap-4">
        <!-- Role filter -->
        <div>
          <label class="block text-sm font-medium">Filtrar por Rol:</label>
          <select v-model="selectedRole" class="input">
            <option value="">Todos</option>
            <option value="user">Usuario</option>
            <option value="host">Anfitrión</option>
            <option value="admin">Administrador</option>
          </select>
        </div>

        <!-- Account Status filter -->
        <div>
          <label class="block text-sm font-medium">Filtrar por Estado de Cuenta:</label>
          <select v-model="selectedStatus" class="input">
            <option value="">Todos</option>
            <option value="ACTIVE">Activo</option>
            <option value="SUSPENDED">Suspendido</option>
            <option value="DELETED">Eliminado</option>
            <option value="PENDING_VERIFICATION">Pendiente</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Users table -->
    <div class="overflow-x-auto">
      <table class="min-w-full table-auto text-sm bg-white dark:bg-gray-800 rounded-xl shadow-md">
        <thead class="bg-gray-100 dark:bg-gray-700">
          <tr>
            <th class="px-4 py-2 text-left">Nombre</th>
            <th class="px-4 py-2 text-left">Correo</th>
            <th class="px-4 py-2 text-left">Rol</th>
            <th class="px-4 py-2 text-left">Estado</th>
            <th class="px-4 py-2 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="u in filteredUsers"
            :key="u._id"
            class="border-b dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            <td class="px-4 py-2">{{ u.firstName }} {{ u.lastName }}</td>
            <td class="px-4 py-2">{{ u.email }}</td>
            <td class="px-4 py-2 capitalize">{{ u.role }}</td>
            <td class="px-4 py-2">
              <span
                class="inline-block px-2 py-1 text-xs font-medium rounded-full"
                :class="badgeClass(u.accountStatus)"
              >
                {{ u.accountStatus }}
              </span>
            </td>
            <td class="px-4 py-2 flex gap-2">
              <!-- Edit button -->
              <button @click="editUser(u)" class="text-blue-500 hover:text-blue-700">
                <PencilIcon class="w-5 h-5" />
              </button>
              <!-- Delete button -->
              <button @click="confirmDelete(u._id)" class="text-red-500 hover:text-red-700">
                <Trash2Icon class="w-5 h-5" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal for user form -->
    <UserFormModal
      :visible="showForm"
      :user="editingUser"
      @close="resetForm"
      @submit="handleUserSubmit"
    />

    <!-- Back to dashboard -->
    <div class="text-center mt-6">
      <RouterLink to="/admin/dashboard" class="inline-flex items-center gap-2 text-primary hover:text-hover underline">
        <ArrowLeftIcon class="w-4 h-4" /> Volver al Panel de Control
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
/* ========== Imports ========== */
import { ref, computed, onMounted } from 'vue'
import Swal from 'sweetalert2'
import {
  UsersIcon,
  PencilIcon,
  Trash2Icon,
  PlusIcon,
  ArrowLeftIcon,
} from 'lucide-vue-next'
import UserFormModal from '@/components/admin/UserFormModal.vue'
import {
  getAllUsers,
  createUser,
  updateUserById,
  deleteUserById,
  type User,
} from '@/services/userService'

/* ========== State ========== */
const users = ref<User[]>([])
const selectedRole = ref('')
const selectedStatus = ref('')
const showForm = ref(false)
const editingUser = ref<User | null>(null)

/* ========== Lifecycle ========== */
onMounted(() => loadUsers())

/* ========== Functions ========== */
const loadUsers = async () => {
  users.value = await getAllUsers()
}

const filteredUsers = computed(() => {
  return users.value.filter((u) => {
    const matchRole = selectedRole.value ? u.role === selectedRole.value : true
    const matchStatus = selectedStatus.value ? u.accountStatus === selectedStatus.value : true
    return matchRole && matchStatus
  })
})

const openCreateUser = () => {
  editingUser.value = null
  showForm.value = true
}

const editUser = (user: User) => {
  editingUser.value = user
  showForm.value = true
}

const confirmDelete = async (id: string) => {
  const result = await Swal.fire({
    title: 'Eliminar usuario?',
    text: 'Esta acción no se puede deshacer.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    confirmButtonColor: '#3F51B5',
    cancelButtonColor: '#d33',
  })

  if (result.isConfirmed) {
    await deleteUserById(id)
    await loadUsers()
    Swal.fire('Eliminado', 'Usuario eliminado con éxito', 'success')
  }
}

const handleUserSubmit = async (data: Partial<User>) => {
  if (editingUser.value) {
    await updateUserById(editingUser.value._id, data)
    Swal.fire('Actualizado', 'Usuario actualizado con éxito', 'success')
  } else {
    if (!data.password) {
      Swal.fire('Error', 'La contraseña es obligatoria para nuevos usuarios.', 'error')
      return
    }
    await createUser(data)
    Swal.fire('Creado', 'Usuario creado con éxito', 'success')
  }
  await loadUsers()
  resetForm()
}

const resetForm = () => {
  editingUser.value = null
  showForm.value = false
}

const badgeClass = (status: string) => {
  switch (status) {
    case 'ACTIVE':
      return 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-white'
    case 'SUSPENDED':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-white'
    case 'DELETED':
      return 'bg-red-100 text-red-800 dark:bg-red-700 dark:text-white'
    case 'PENDING_VERIFICATION':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-white'
    default:
      return ''
  }
}
</script>

<style scoped>
.input {
  @apply w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-900 dark:text-white;
}
.bg-primary {
  background-color: #3f51b5;
}
.text-primary {
  color: #3f51b5;
}
.hover\:bg-hover:hover {
  background-color: #303f9f;
}
</style>
