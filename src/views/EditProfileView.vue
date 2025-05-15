<template>
  <div class="max-w-2xl mx-auto p-6">
    <h1 class="text-3xl font-bold text-primary mb-6 text-center">Editar Perfil</h1>

    <form @submit.prevent="submitForm" class="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input v-model="form.firstName" type="text" placeholder="Nombre" class="input" required />
        <input v-model="form.lastName" type="text" placeholder="Apellido" class="input" required />
        <input v-model="form.phone" type="tel" placeholder="Teléfono" class="input" />
        <input v-model="form.address" type="text" placeholder="Dirección" class="input" />
      </div>

      <div class="flex justify-end gap-4">
        <router-link
          to="/profile"
          class="px-4 py-2 text-sm border rounded text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          Cancelar
        </router-link>
        <button type="submit" class="bg-primary text-white px-6 py-2 rounded hover:bg-hover transition">
          Guardar Cambios
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import Swal from 'sweetalert2'
import { updateProfileService } from '@/services/userService'

// Get current user
const { user } = useAuth()
const router = useRouter()

// Reactive form data
const form = ref({
  firstName: user.value?.firstName || '',
  lastName: user.value?.lastName || '',
  phone: user.value?.phone || '',
  address: user.value?.address || '',
})

// Submit updated profile data
const submitForm = async () => {
  try {
    const updated = await updateProfileService(form.value)
    localStorage.setItem('user', JSON.stringify(updated))
    Swal.fire('Success', 'Profile updated successfully', 'success')
    router.push('/profile')
  } catch (error) {
    console.error('Profile update failed:', error)
    Swal.fire('Error', 'Could not update profile', 'error')
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
