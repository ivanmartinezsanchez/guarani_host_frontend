<template>
  <div class="max-w-2xl mx-auto p-6">
    <h1 class="text-3xl font-bold text-primary mb-6 text-center">Editar Perfil</h1>

    <!-- Profile edit form -->
    <form
      @submit.prevent="submitForm"
      class="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow"
    >
      <!-- Input fields -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          v-model="form.firstName"
          type="text"
          placeholder="Nombre"
          class="input"
          required
        />
        <input
          v-model="form.lastName"
          type="text"
          placeholder="Apellido"
          class="input"
          required
        />
        <input
          v-model="form.phone"
          type="tel"
          placeholder="Teléfono"
          class="input"
        />
        <input
          v-model="form.address"
          type="text"
          placeholder="Dirección"
          class="input"
        />
      </div>

      <!-- Action buttons -->
      <div class="flex justify-end gap-4">
        <RouterLink
          to="/profile"
          class="flex items-center gap-2 px-4 py-2 text-sm border rounded text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <XIcon class="w-4 h-4" />
          Cancelar
        </RouterLink>
        <button
          type="submit"
          class="flex items-center gap-2 bg-primary text-white px-6 py-2 rounded hover:bg-hover transition"
        >
          <SaveIcon class="w-5 h-5" />
          Guardar Cambios
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
/**
 * EditProfileView.vue
 * - Allows authenticated users (any role) to edit personal data
 * - Uses PATCH /api/users/profile to persist changes
 * - Includes icons and feedback with SweetAlert
 */

import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import { useAuth } from '@/composables/useAuth'
import { updateProfileService } from '@/services/userService'
import { Save as SaveIcon, X as XIcon } from 'lucide-vue-next'

const { user } = useAuth()
const router = useRouter()

// Initialize form data with current user
const form = ref({
  firstName: user.value?.firstName || '',
  lastName: user.value?.lastName || '',
  phone: user.value?.phone || '',
  address: user.value?.address || '',
})

// Submit form and update user profile
const submitForm = async () => {
  try {
    const updatedUser = await updateProfileService(form.value)
    localStorage.setItem('user', JSON.stringify(updatedUser))
    Swal.fire({
      icon: 'success',
      title: 'Perfil Actualizado',
      text: 'Tu infromación se ha guardado exitosamente.',
    })
    router.push('/profile')
  } catch (error) {
    console.error('❌ Error actualizando perfil:', error)
    Swal.fire({
      icon: 'error',
      title: 'Actualización Fallida',
      text: 'No se pudo guardar los cambios. Intente luego nuevamente.',
    })
  }
}
</script>

<style scoped>
.input {
  @apply w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-900 dark:text-white;
}

.bg-primary {
  background-color: #3F51B5;
}
.text-primary {
  color: #3F51B5;
}
.hover\:bg-hover:hover {
  background-color: #303F9F;
}
</style>
