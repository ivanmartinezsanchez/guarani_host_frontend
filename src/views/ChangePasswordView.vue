<template>
  <div class="max-w-2xl mx-auto p-6">
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-primary mb-2 text-center">Cambiar Contraseña</h1>
      <p class="text-center text-lightText dark:text-gray-400 text-sm">
        Actualiza tu contraseña de forma segura
      </p>
    </div>

    <form
      @submit.prevent="submitForm"
      class="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
    >
      <!-- Current Password -->
      <div>
        <label for="currentPassword" class="block text-sm font-medium text-darkText dark:text-white mb-2">
          Contraseña Actual *
        </label>
        <div class="relative">
          <input
            id="currentPassword"
            v-model="form.currentPassword"
            :type="showCurrentPassword ? 'text' : 'password'"
            class="input pr-10"
            placeholder="Ingresa tu contraseña actual"
            required
          />
          <button
            type="button"
            @click="showCurrentPassword = !showCurrentPassword"
            class="absolute inset-y-0 right-0 pr-3 flex items-center text-lightText hover:text-darkText dark:hover:text-white transition-colors"
          >
            <EyeIcon v-if="!showCurrentPassword" class="w-5 h-5" />
            <EyeOffIcon v-else class="w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- New Password -->
      <div>
        <label for="newPassword" class="block text-sm font-medium text-darkText dark:text-white mb-2">
          Nueva Contraseña *
        </label>
        <div class="relative">
          <input
            id="newPassword"
            v-model="form.newPassword"
            :type="showNewPassword ? 'text' : 'password'"
            class="input pr-10"
            placeholder="Ingresa tu nueva contraseña"
            required
            minlength="6"
            @input="validatePassword"
          />
          <button
            type="button"
            @click="showNewPassword = !showNewPassword"
            class="absolute inset-y-0 right-0 pr-3 flex items-center text-lightText hover:text-darkText dark:hover:text-white transition-colors"
          >
            <EyeIcon v-if="!showNewPassword" class="w-5 h-5" />
            <EyeOffIcon v-else class="w-5 h-5" />
          </button>
        </div>
        
        <!-- Password strength indicator -->
        <div v-if="form.newPassword" class="mt-3">
          <div class="flex items-center gap-2 mb-2">
            <div class="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                class="h-2 rounded-full transition-all duration-300"
                :class="passwordStrengthColor"
                :style="{ width: passwordStrengthWidth }"
              ></div>
            </div>
            <span class="text-xs font-medium" :class="passwordStrengthTextColor">
              {{ passwordStrengthText }}
            </span>
          </div>
          <div class="space-y-1">
            <div class="flex items-center gap-2 text-xs">
              <CheckIcon v-if="passwordChecks.length" class="w-3 h-3 text-primary" />
              <XIcon v-else class="w-3 h-3 text-lightText" />
              <span :class="passwordChecks.length ? 'text-primary' : 'text-lightText'">
                Mínimo 6 caracteres
              </span>
            </div>
            <div class="flex items-center gap-2 text-xs">
              <CheckIcon v-if="passwordChecks.hasUppercase" class="w-3 h-3 text-primary" />
              <XIcon v-else class="w-3 h-3 text-lightText" />
              <span :class="passwordChecks.hasUppercase ? 'text-primary' : 'text-lightText'">
                Una letra mayúscula
              </span>
            </div>
            <div class="flex items-center gap-2 text-xs">
              <CheckIcon v-if="passwordChecks.hasNumber" class="w-3 h-3 text-primary" />
              <XIcon v-else class="w-3 h-3 text-lightText" />
              <span :class="passwordChecks.hasNumber ? 'text-primary' : 'text-lightText'">
                Un número
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Confirm Password -->
      <div>
        <label for="confirmPassword" class="block text-sm font-medium text-darkText dark:text-white mb-2">
          Confirmar Nueva Contraseña *
        </label>
        <div class="relative">
          <input
            id="confirmPassword"
            v-model="form.confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
            class="input pr-10"
            :class="{ 'border-red-500 focus:ring-red-500': form.confirmPassword && !passwordsMatch }"
            placeholder="Confirma tu nueva contraseña"
            required
          />
          <button
            type="button"
            @click="showConfirmPassword = !showConfirmPassword"
            class="absolute inset-y-0 right-0 pr-3 flex items-center text-lightText hover:text-darkText dark:hover:text-white transition-colors"
          >
            <EyeIcon v-if="!showConfirmPassword" class="w-5 h-5" />
            <EyeOffIcon v-else class="w-5 h-5" />
          </button>
        </div>
        <p v-if="form.confirmPassword && !passwordsMatch" class="mt-1 text-xs text-red-600 dark:text-red-400">
          Las contraseñas no coinciden
        </p>
      </div>

      <!-- Action buttons -->
      <div class="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
        <RouterLink
          to="/profile"
          class="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg text-darkText dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <XIcon class="w-4 h-4" />
          Cancelar
        </RouterLink>
        <button
          type="submit"
          :disabled="!canSubmit || isLoading"
          class="flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <LoaderIcon v-if="isLoading" class="w-4 h-4 animate-spin" />
          <LockIcon v-else class="w-4 h-4" />
          {{ isLoading ? 'Cambiando...' : 'Cambiar Contraseña' }}
        </button>
      </div>
    </form>

    <!-- Security tips -->
    <div class="mt-6 p-4 bg-secondary dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div class="flex items-start gap-3">
        <ShieldCheckIcon class="w-5 h-5 text-primary mt-0.5" />
        <div>
          <h3 class="text-sm font-medium text-darkText dark:text-white mb-2">
            Consejos de seguridad
          </h3>
          <ul class="text-xs text-lightText dark:text-gray-400 space-y-1">
            <li>• Usa una contraseña única y segura</li>
            <li>• No compartas tu contraseña con nadie</li>
            <li>• Cambia tu contraseña regularmente</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import { 
  Eye as EyeIcon, 
  EyeOff as EyeOffIcon,
  X as XIcon,
  Lock as LockIcon,
  Loader2 as LoaderIcon,
  ShieldCheck as ShieldCheckIcon,
  Check as CheckIcon
} from 'lucide-vue-next'

const router = useRouter()
const isLoading = ref(false)

// Form data
const form = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// Password visibility
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

// Password validation
const passwordChecks = computed(() => ({
  length: form.value.newPassword.length >= 6,
  hasUppercase: /[A-Z]/.test(form.value.newPassword),
  hasNumber: /\d/.test(form.value.newPassword)
}))

const passwordStrength = computed(() => {
  const checks = Object.values(passwordChecks.value)
  const score = checks.filter(Boolean).length
  return score
})

const passwordStrengthWidth = computed(() => {
  return `${(passwordStrength.value / 3) * 100}%`
})

const passwordStrengthColor = computed(() => {
  switch (passwordStrength.value) {
    case 0:
    case 1:
      return 'bg-red-500'
    case 2:
      return 'bg-yellow-500'
    case 3:
      return 'bg-primary'
    default:
      return 'bg-gray-300'
  }
})

const passwordStrengthTextColor = computed(() => {
  switch (passwordStrength.value) {
    case 0:
    case 1:
      return 'text-red-600 dark:text-red-400'
    case 2:
      return 'text-yellow-600 dark:text-yellow-400'
    case 3:
      return 'text-primary'
    default:
      return 'text-lightText'
  }
})

const passwordStrengthText = computed(() => {
  switch (passwordStrength.value) {
    case 0:
    case 1:
      return 'Débil'
    case 2:
      return 'Media'
    case 3:
      return 'Fuerte'
    default:
      return ''
  }
})

const passwordsMatch = computed(() => {
  return form.value.newPassword === form.value.confirmPassword
})

const canSubmit = computed(() => {
  return form.value.currentPassword &&
         form.value.newPassword &&
         form.value.confirmPassword &&
         passwordsMatch.value &&
         passwordStrength.value >= 2 // At least medium strength
})

const validatePassword = (): void => {
  // Additional password validation logic if needed
}

const submitForm = async (): Promise<void> => {
  if (!canSubmit.value || isLoading.value) return

  try {
    isLoading.value = true

    // Simular llamada al backend - reemplaza con tu endpoint real
    await Swal.fire({
      icon: 'info',
      title: 'Funcionalidad no implementada',
      text: 'El cambio de contraseña requiere configuración en el backend.',
      confirmButtonText: 'Entendido',
      confirmButtonColor: '#3F51B5'
    })

    // Clear form
    form.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }

    router.push('/profile')
  } catch (error: any) {
    console.error('Error changing password:', error)

    Swal.fire({
      icon: 'error',
      title: 'Error al Cambiar Contraseña',
      text: error.message || 'No se pudo cambiar la contraseña. Intenta nuevamente.',
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
</style>