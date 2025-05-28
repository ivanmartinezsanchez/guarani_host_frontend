<template>
  <div class="max-w-7xl mx-auto p-6">
    <h1 class="text-3xl font-bold text-primary text-center mb-8">Panel de Gestión de Usuarios</h1>

    <!-- Top header with title and create button -->
    <div class="flex justify-between items-center flex-wrap gap-4 mb-6">
      <div class="flex items-center gap-2">
        <UsersIcon class="w-6 h-6 text-primary" />
        <h2 class="text-xl font-semibold">Lista de Usuarios</h2>
      </div>
      <button
        @click="showForm = !showForm"
        class="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded hover:bg-hover transition"
      >
        <PlusIcon class="w-5 h-5" />
        {{ showForm ? 'Close' : 'New User' }}
      </button>
    </div>

    <!-- Filter and table -->
    <div class="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md mb-6">
      <div class="flex flex-wrap justify-between items-center mb-4">
        <label class="font-medium text-sm">Filtrar por rol:</label>
        <select v-model="selectedRole" class="input max-w-xs">
          <option value="">Todos</option>
          <option value="user">Usuario</option>
          <option value="host">Anfitrión</option>
          <option value="admin">Administrador</option>
        </select>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full text-sm table-auto">
          <thead class="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th class="px-4 py-2 text-left">Nombre</th>
              <th class="px-4 py-2 text-left">Correo Electrónico</th>
              <th class="px-4 py-2 text-left">Rol</th>
              <th class="px-4 py-2 text-left">Actions</th>
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
              <td class="px-4 py-2 flex gap-2">
                <button @click="editUser(u)" class="text-blue-500 hover:text-blue-700">
                  <PencilIcon class="w-5 h-5" />
                </button>
                <button @click="confirmDelete(u._id)" class="text-red-500 hover:text-red-700">
                  <Trash2Icon class="w-5 h-5" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

   <Modal v-if="showForm" @close="resetForm">
  <template #title>{{ modalTitle }}</template>

  <form @submit.prevent="handleFormSubmit" class="space-y-4">
    <input v-model="form.firstName" type="text" placeholder="Nombre" class="input" required />
    <input v-model="form.lastName" type="text" placeholder="Apellido" class="input" required />
    <input v-model="form.email" type="email" placeholder="Correo Electrónico" class="input" required />
    <input v-model="form.phone" type="tel" placeholder="Teléfono" class="input" required />
    <input v-model="form.address" type="text" placeholder="Dirección" class="input" required />

    <select v-model="form.role" class="input" required>
      <option value="user">Usuario</option>
      <option value="host">Anfitrión</option>
      <option value="admin">Administrador</option>
    </select>

    <input
      v-if="modalTitle === 'Create User'"
      v-model="form.password"
      type="password"
      placeholder="Password"
      class="input"
      required
    />

    <div class="flex justify-end gap-2 mt-4">
      <button
        type="button"
        @click="resetForm"
        class="border px-4 py-2 rounded text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition"
      >
        Cancelar
      </button>
      <button type="submit" class="bg-primary text-white px-6 py-2 rounded hover:bg-hover transition">
        {{ modalTitle === 'Create User' ? 'Create' : 'Update' }}
      </button>
    </div>
  </form>
</Modal>


    <!-- Back to dashboard -->
    <div class="text-center mt-6">
      <RouterLink to="/admin/dashboard" class="inline-flex items-center gap-2 text-primary hover:text-hover underline">
        <ArrowLeftIcon class="w-4 h-4" /> Ir al Panel de Control
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { UsersIcon, PencilIcon, Trash2Icon, PlusIcon, ArrowLeftIcon } from "lucide-vue-next";
import Swal from "sweetalert2";
import {
  getAllUsers,
  createUser,
  updateUserById,
  deleteUserById,
  type User,
} from "@/services/userService";

const users = ref<User[]>([]);
const selectedRole = ref("");
const showForm = ref(false);
const modalTitle = ref("Create User");
const editingUserId = ref<string | null>(null);

const form = ref({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  role: "user" as "admin" | "host" | "user",
  password: "",
});

onMounted(() => loadUsers());

const loadUsers = async () => {
  users.value = await getAllUsers();
};

const filteredUsers = computed(() => {
  return selectedRole.value
    ? users.value.filter((user) => user.role === selectedRole.value)
    : users.value;
});

const editUser = (user: User) => {
  editingUserId.value = user._id;
  form.value = {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone ?? "",
    address: user.address ?? "",
    role: user.role,
    password: "",
  };
  modalTitle.value = "Edit User";
  showForm.value = true;
};

const confirmDelete = async (id: string) => {
  const result = await Swal.fire({
    title: "Delete user?",
    text: "This action cannot be undone",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete",
    confirmButtonColor: "#3F51B5",
    cancelButtonColor: "#d33",
  });

  if (result.isConfirmed) {
    await deleteUserById(id);
    await loadUsers();
    Swal.fire("Deleted", "User successfully removed", "success");
  }
};

const handleFormSubmit = async () => {
  if (!editingUserId.value) {
    if (!form.value.password) {
      Swal.fire("Error", "Password is required for new users.", "error");
      return;
    }
    await createUser(form.value);
    Swal.fire("Success", "User created", "success");
  } else {
    const { password, ...data } = form.value;
    await updateUserById(editingUserId.value, data);
    Swal.fire("Updated", "User updated", "success");
  }
  await loadUsers();
  resetForm();
};

const resetForm = () => {
  form.value = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    role: "user",
    password: "",
  };
  editingUserId.value = null;
  modalTitle.value = "Create User";
  showForm.value = false;
};
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
