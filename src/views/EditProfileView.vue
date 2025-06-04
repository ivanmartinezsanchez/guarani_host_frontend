<template>
  <div class="max-w-2xl mx-auto p-6">
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-primary mb-2 text-center">Editar Perfil</h1>
      <p class="text-center text-lightText dark:text-gray-400 text-sm">
        Actualiza tu información personal
      </p>
    </div>

    <!-- Profile edit form -->
    <form
      @submit.prevent="submitForm"
      class="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
    >
      <!-- Read-only user info -->
      <div class="bg-secondary dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
        <h3 class="text-sm font-semibold text-darkText dark:text-white mb-3">
          Información de Cuenta (No editable)
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-medium text-lightText dark:text-gray-400 mb-1">
              Nombre Completo
            </label>
            <input
              :value="`${user?.firstName} ${user?.lastName}`"
              type="text"
              class="input bg-gray-100 dark:bg-gray-600 cursor-not-allowed opacity-60"
              readonly
              disabled
            />
          </div>
          <div>
            <label class="block text-xs font-medium text-lightText dark:text-gray-400 mb-1">
              Email
            </label>
            <input
              :value="user?.email"
              type="email"
              class="input bg-gray-100 dark:bg-gray-600 cursor-not-allowed opacity-60"
              readonly
              disabled
            />
          </div>
        </div>
      </div>

      <!-- Editable fields -->
      <div>
        <h3 class="text-sm font-semibold text-darkText dark:text-white mb-3">
          Información Personal (Editable)
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="phone" class="block text-xs font-medium text-darkText dark:text-white mb-1">
              Teléfono
            </label>
            <input
              id="phone"
              v-model="form.phone"
              type="tel"
              placeholder="Ej: +595 21 123456"
              class="input"
              pattern="[\+]?[0-9\s\-\(\)]+"
              title="Formato: +595 21 123456"
            />
          </div>
          <div>
            <label for="address" class="block text-xs font-medium text-darkText dark:text-white mb-1">
              Dirección
            </label>
            <input
              id="address"
              v-model="form.address"
              type="text"
              placeholder="Ej: Av. España 123, Asunción"
              class="input"
            />
          </div>
        </div>
      </div>

      <!-- Admin-only fields -->
      <div v-if="user?.role === 'admin'" class="border-t border-gray-200 dark:border-gray-600 pt-4">
        <h3 class="text-sm font-semibold text-darkText dark:text-white mb-3 flex items-center gap-2">
          <ShieldCheckIcon class="w-4 h-4 text-primary" />
          Configuración Administrativa
        </h3>
        <div class="bg-primary/5 dark:bg-primary/10 p-4 rounded-lg border border-primary/20">
          <p class="text-xs text-primary dark:text-primary mb-2">
            Como administrador, puedes editar campos adicionales
          </p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="firstName" class="block text-xs font-medium text-darkText dark:text-white mb-1">
                Nombre
              </label>
              <input
                id="firstName"
                v-model="form.firstName"
                type="text"
                placeholder="Nombre"
                class="input"
                required
              />
            </div>
            <div>
              <label for="lastName" class="block text-xs font-medium text-darkText dark:text-white mb-1">
                Apellido
              </label>
              <input
                id="lastName"
                v-model="form.lastName"
                type="text"
                placeholder="Apellido"
                class="input"
                required
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Action buttons -->
      <div class="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-600">
        <RouterLink
          to="/profile"
          class="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg text-darkText dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <XIcon class="w-4 h-4" />
          Cancelar
        </RouterLink>
        <button
          type="submit"
          :disabled="isLoading"
          class="flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <LoaderIcon v-if="isLoading" class="w-4 h-4 animate-spin" />
          <SaveIcon v-else class="w-4 h-4" />
          {{ isLoading ? 'Guardando...' : 'Guardar Cambios' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import { useAuth } from '@/composables/useAuth'
import { updateProfileService } from '@/services/userService'
import { 
  Save as SaveIcon, 
  X as XIcon, 
  ShieldCheck as ShieldCheckIcon,
  Loader2 as LoaderIcon
} from 'lucide-vue-next'

const { user } = useAuth()
const router = useRouter()
const isLoading = ref(false)

// Initialize form data with current user
const form = ref({
  firstName: user.value?.firstName || '',
  lastName: user.value?.lastName || '',
  phone: user.value?.phone || '',
  address: user.value?.address || '',
})

// Computed properties for validation
const hasChanges = computed(() => {
  if (!user.value) return false
  
  return (
    form.value.phone !== (user.value.phone || '') ||
    form.value.address !== (user.value.address || '') ||
    (user.value.role === 'admin' && (
      form.value.firstName !== user.value.firstName ||
      form.value.lastName !== user.value.lastName
    ))
  )
})

// Validate phone format
const isValidPhone = (phone: string): boolean => {
  if (!phone.trim()) return true // Optional field
  const phoneRegex = /^[\+]?[0-9\s\-\(\)]+$/
  return phoneRegex.test(phone) && phone.length >= 6
}

// Submit form and update user profile
const submitForm = async (): Promise<void> => {
  if (isLoading.value) return
  
  try {
    // Validate phone if provided
    if (form.value.phone && !isValidPhone(form.value.phone)) {
      Swal.fire({
        icon: 'warning',
        title: 'Formato Incorrecto',
        text: 'Por favor, ingresa un número de teléfono válido.',
        confirmButtonColor: '#3F51B5'
      })
      return
    }

    // Check if there are actual changes
    if (!hasChanges.value) {
      Swal.fire({
        icon: 'info',
        title: 'Sin Cambios',
        text: 'No hay modificaciones para guardar.',
        confirmButtonColor: '#3F51B5'
      })
      return
    }

    isLoading.value = true

    // Prepare data based on user role
    const updateData: any = {
      phone: form.value.phone.trim(),
      address: form.value.address.trim(),
    }

    // Only admins can edit name fields
    if (user.value?.role === 'admin') {
      updateData.firstName = form.value.firstName.trim()
      updateData.lastName = form.value.lastName.trim()
    }

    // Update profile via service
    const updatedUser = await updateProfileService(updateData)
    
    // Update global user state
    user.value = updatedUser
    localStorage.setItem('user', JSON.stringify(updatedUser))
    
    await Swal.fire({
      icon: 'success',
      title: 'Perfil Actualizado',
      text: 'Tu información se ha guardado exitosamente.',
      timer: 2000,
      showConfirmButton: false
    })
    
    router.push('/profile')
  } catch (error: any) {
    console.error('❌ Error actualizando perfil:', error)
    
    const errorMessage = error?.response?.data?.message || 
                        error?.message || 
                        'No se pudo guardar los cambios. Intenta nuevamente.'
    
    Swal.fire({
      icon: 'error',
      title: 'Error al Actualizar',
      text: errorMessage,
      confirmButtonColor: '#3F51B5'
    })
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.input {
  @apply w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-darkText dark:text-white placeholder-lightText dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors;
}

.bg-primary {
  background-color: #3F51B5;
}

.text-primary {
  color: #3F51B5;
}

.bg-primary-dark,
.hover\:bg-primary-dark:hover {
  background-color: #303F9F;
}

.focus\:ring-primary:focus {
  --tw-ring-color: #3F51B5;
}
</style>