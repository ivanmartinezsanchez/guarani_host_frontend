<template>
  <section class="min-h-screen flex items-center justify-center px-4 bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
    <form
      @submit.prevent="handleLogin"
      v-show="mounted"
      class="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md space-y-6 transition duration-500 ease-out transform scale-95 opacity-0"
      :class="{ 'scale-100 opacity-100': mounted }"
    >
      <h2 class="text-2xl font-bold text-center text-gray-800 dark:text-white tracking-tight">
        Iniciar Sesión
      </h2>

      <!-- Email -->
      <FloatingInput v-model="email" id="email" label="Email" type="email" required :error="!emailValid" />
      <p v-if="!emailValid" class="text-sm text-red-600">Por favor, introduce un correo electrónico válido</p>

      <!-- Password -->
      <FloatingInput v-model="password" id="password" label="Password" type="password" required :error="!passwordValid" />
      <p v-if="!passwordValid" class="text-sm text-red-600">
        La contraseña debe contener una mayúscula, una minúscula y un número
      </p>

      <!-- Submit button -->
      <button
        type="submit"
        :disabled="isLoading"
        class="w-full bg-primary hover:bg-hover text-white font-semibold py-2 px-4 rounded-md transition-colors relative"
      >
        <span v-if="!isLoading">Iniciar Sesión</span>
        <svg v-else class="w-5 h-5 animate-spin text-white absolute inset-0 m-auto" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </button>

      <!-- Redirect to register -->
      <p class="text-center text-sm text-gray-600 dark:text-gray-300 mt-2">
        ¿Aún no tienes una cuenta?
        <RouterLink to="/register" class="text-primary hover:underline">Regístrate Aquí</RouterLink>
      </p>
    </form>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import Swal from 'sweetalert2'
import FloatingInput from '@/components/ui/FloatingInput.vue'

const router = useRouter()
const { login } = useAuth()

// Form fields
const email = ref('')
const password = ref('')

// UI states
const emailValid = ref(true)
const passwordValid = ref(true)
const loginError = ref(false)
const isLoading = ref(false)
const mounted = ref(false)

// Regex rules
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/

onMounted(() => {
  mounted.value = true
})

/**
 * Handle login form submission
 */
async function handleLogin() {
  emailValid.value = emailRegex.test(email.value)
  passwordValid.value = passwordRegex.test(password.value)
  loginError.value = false

  if (emailValid.value && passwordValid.value) {
    isLoading.value = true
    try {
      const user = await login({ email: email.value, password: password.value })

      if (user.accountStatus !== 'active') {
        Swal.fire({
          icon: 'warning',
          title: 'Cuenta no activa',
          text: `Tu cuenta actualmente está "${user.accountStatus?.replace('_', ' ')}". Por favor, contacta con soporte.`,
        })
        return
      }

      // Redirect by role
      if (user.role === 'admin') {
        router.push('/admin/dashboard')
      } else if (user.role === 'host') {
        router.push('/host/dashboard')
      } else {
        router.push('/profile')
      }
    } catch (error) {
      loginError.value = true
      Swal.fire({
    icon: 'error',
    title: 'Inicio de Sesión Fallido',
    text: 'Correo electrónico o contraseña invaálido. Por favor, intente nuevamente.',
  })
    } finally {
      isLoading.value = false
    }
  } else {
    loginError.value = true
  }
}
</script>

<style scoped>
.bg-primary {
  background-color: #3F51B5;
}
.hover\:bg-hover:hover {
  background-color: #303F9F;
}
.text-primary {
  color: #3F51B5;
}
</style>

