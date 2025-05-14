<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
    <div class="w-full max-w-md bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
      <!-- Page title -->
      <h1 class="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
        Inicia sesión
      </h1>

      <!-- Login form -->
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Correo Electrónico</label>
          <input
            id="email"
            v-model="email"
            :class="[inputClass, !emailValid ? 'border-red-500' : '']"
            type="email"
            placeholder="you@example.com"
            required
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Contaseña</label>
          <input
            id="password"
            v-model="password"
            :class="[inputClass, !passwordValid ? 'border-red-500' : '']"
            type="password"
            placeholder="••••••••"
            required
          />
        </div>

        <!-- Error message -->
        <p v-if="loginError" class="text-sm text-red-600 text-center">
          ❗ Credenciales inválidas o cuenta inactiva
        </p>

        <!-- Submit button -->
        <button type="submit" class="w-full bg-primary hover:bg-hover text-white py-2 px-4 rounded transition">
          Iniciar Sesión
        </button>
      </form>

      <!-- Redirect to register -->
      <p class="text-center text-sm text-gray-600 dark:text-gray-300 mt-4">
        ¿Aún no tienes una cuenta?
        <RouterLink to="/register" class="text-primary hover:underline">Regístrate Aquí</RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import Swal from 'sweetalert2'

// Access login method and router instance
const { login } = useAuth()
const router = useRouter()

// Form fields
const email = ref('')
const password = ref('')

// Validation states
const emailValid = ref(true)
const passwordValid = ref(true)
const loginError = ref(false)

// Input field class (reusable)
const inputClass =
  'w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-900 dark:text-white'

// Regex validation rules
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/

/**
 * Handle login form submission
 */
async function handleLogin() {
  // Reset validation
  emailValid.value = emailRegex.test(email.value)
  passwordValid.value = passwordRegex.test(password.value)
  loginError.value = false

  if (emailValid.value && passwordValid.value) {
    try {
      // Perform login using composable
      const user = await login({ email: email.value, password: password.value })

      // Optional: Check account status
      if (user.accountStatus !== 'active') {
        Swal.fire({
          icon: 'warning',
          title: 'Account Not Active',
          text: `Your account is currently "${user.accountStatus?.replace('_', ' ')}". Please contact support or wait for approval.`,
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
    }
  } else {
    loginError.value = true
  }
}
</script>

<style scoped>
/* Primary button and hover */
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
