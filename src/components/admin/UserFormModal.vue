<template>
  <Modal :model-value="visible" @update:modelValue="$emit('close')">
    <!-- Modal header with icon and dynamic title -->
    <template #title>
      <div class="flex items-center gap-2 justify-center relative">
        <UsersIcon class="w-6 h-6 text-primary" />
        <span>{{ isEditMode ? 'Editar Usuario' : 'Nuevo Usuario' }}</span>
        <!-- Close modal button -->
        <button
          @click="$emit('close')"
          class="absolute right-0 top-0 text-gray-500 hover:text-red-600 transition"
          aria-label="Cerrar modal"
        >
          ×
        </button>
      </div>
    </template>

    <!-- Formulario de usuario -->
    <form @submit.prevent="handleSubmit" class="space-y-4 text-gray-800 dark:text-white">
      <!-- First name input -->
      <FloatingInput v-model="localForm.firstName" id="firstName" label="Nombre" required />
      <!-- Last name input -->
      <FloatingInput v-model="localForm.lastName" id="lastName" label="Apellido" required />
      <!-- Email input -->
      <FloatingInput v-model="localForm.email" id="email" label="Correo Electrónico" type="email" required />
      <!-- Phone input -->
      <FloatingInput v-model="localForm.phone" id="phone" label="Teléfono" type="tel" required />
      <!-- Address input -->
      <FloatingInput v-model="localForm.address" id="address" label="Dirección" required />

      <!-- User role selection -->
      <div>
        <label for="role" class="block mb-1 font-medium text-sm">Rol</label>
        <select
          id="role"
          v-model="localForm.role"
          class="input"
          required
        >
          <option value="user">Usuario</option>
          <option value="host">Anfitrión</option>
          <option value="admin">Administrador</option>
        </select>
      </div>

      <!-- Password only for new user -->
      <FloatingInput
        v-if="!isEditMode"
        v-model="localForm.password"
        id="password"
        label="Contraseña"
        type="password"
        required
      />

      <!-- Action buttons -->
      <div class="flex justify-end gap-2 pt-4">
        <button
          type="button"
          @click="$emit('close')"
          class="border px-4 py-2 rounded text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          Cancelar
        </button>
        <button type="submit" class="bg-primary text-white px-6 py-2 rounded hover:bg-hover transition">
          {{ isEditMode ? 'Actualizar' : 'Crear' }}
        </button>
      </div>
    </form>
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { User } from '@/services/userService'
import FloatingInput from '@/components/ui/FloatingInput.vue'
import { UsersIcon } from 'lucide-vue-next'

// Props: visibility and optional user to edit
const props = defineProps<{
  visible: boolean
  user?: Partial<User>
}>()

// Emit events to parent (submit and close)
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', data: Partial<User>): void
}>()

// Local form state initialized for new user
const localForm = ref<Partial<User & { password?: string }>>({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  role: 'user',
  password: '',
})

// Update local form when editing a user
watch(
  () => props.user,
  (newUser) => {
    localForm.value = {
      firstName: newUser?.firstName ?? '',
      lastName: newUser?.lastName ?? '',
      email: newUser?.email ?? '',
      phone: newUser?.phone ?? '',
      address: newUser?.address ?? '',
      role: newUser?.role ?? 'user',
    }
  },
  { immediate: true }
)

// Computed property to detect edit mode
const isEditMode = computed(() => !!props.user?._id)

// Emit form submission to parent
const handleSubmit = () => {
  emit('submit', localForm.value)
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
