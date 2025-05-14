<template>
  <section
    class="min-h-screen flex items-center justify-center px-4 bg-gray-50 dark:bg-gray-950 transition-colors duration-300"
  >
    <form
      @submit.prevent="handleRegister"
      v-show="mounted"
      class="w-full max-w-lg bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md space-y-5 transition duration-500 ease-out transform scale-95 opacity-0"
      :class="{ 'scale-100 opacity-100': mounted }"
    >
      <!-- Page Title -->
      <h2 class="text-2xl font-bold text-center text-gray-800 dark:text-white tracking-tight">
        Crear Cuenta
      </h2>

      <!-- First and Last Name -->
      <div class="grid md:grid-cols-2 gap-4">
        <FloatingInput
          v-model="firstName"
          id="firstName"
          label="Nombre"
          type="text"
          required
        />
        <FloatingInput
          v-model="lastName"
          id="lastName"
          label="Apellido"
          type="text"
          required
        />
      </div>

      <!-- Email -->
      <FloatingInput
        v-model="email"
        id="email"
        label="Correo Electrónico"
        type="email"
        required
        :error="!emailValid"
      />
      <p v-if="!emailValid" class="text-sm text-red-600">
        Por favor, introduce un correo electrónico válido.
      </p>

      <!-- Phone -->
      <FloatingInput
        v-model="phone"
        id="phone"
        label="Teléfono"
        type="tel"
        required
      />

      <!-- Address -->
      <FloatingInput
        v-model="address"
        id="address"
        label="Dirección"
        type="text"
        required
      />

      <!-- Password -->
      <FloatingInput
        v-model="password"
        id="password"
        label="Contraseña"
        type="password"
        required
        :error="!passwordValid"
      />
      <p v-if="!passwordValid" class="text-sm text-red-600">
        La contraseña debe contener una mayúscula, una minúscula y un número.
      </p>

      <!-- Submit Button -->
      <button
        type="submit"
        :disabled="isLoading"
        class="w-full bg-primary hover:bg-hover text-white font-semibold py-2 px-4 rounded-md transition-colors relative"
      >
        <span v-if="!isLoading">Registrarse</span>
        <svg
          v-else
          class="w-5 h-5 animate-spin text-white absolute inset-0 m-auto"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          ></path>
        </svg>
      </button>

      <!-- Redirect to login -->
      <p class="text-center text-sm text-gray-600 dark:text-gray-300 mt-2">
        ¿Ya tienes una cuenta?
        <RouterLink to="/login" class="text-primary hover:underline">
          Inicia Sesión Aquí
        </RouterLink>
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

// Auth composable and router
const { register } = useAuth()
const router = useRouter()

// Form fields
const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const phone = ref('')
const address = ref('')

// UI state
const emailValid = ref(true)
const passwordValid = ref(true)
const isLoading = ref(false)
const mounted = ref(false)

// Regex for validation
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/

onMounted(() => {
  mounted.value = true
})

/**
 * Handle user registration with validation and SweetAlert feedback
 */
async function handleRegister() {
  emailValid.value = emailRegex.test(email.value)
  passwordValid.value = passwordRegex.test(password.value)

  if (
    firstName.value.trim() &&
    lastName.value.trim() &&
    emailValid.value &&
    passwordValid.value &&
    phone.value.trim() &&
    address.value.trim()
  ) {
    isLoading.value = true
    try {
      await register({
        firstName: firstName.value,
        lastName: lastName.value,
        email: email.value,
        password: password.value,
        phone: phone.value,
        address: address.value,
        role: 'user' 
      })

      Swal.fire({
        icon: 'success',
        title: 'Registro exitoso!',
        text: 'Puedes iniciar sesión.',
        timer: 2000,
        showConfirmButton: false,
      })

      router.push('/login')
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Registro fallido',
        text: 'Por favor, inténtalo de nuevo.',
      })
    } finally {
      isLoading.value = false
    }
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Formulario inválido',
      text: 'Por favor, introduce todos los campos correctamente.',
    })
  }
}
</script>

<style scoped>
.bg-primary {
  background-color: #3f51b5;
}
.hover\:bg-hover:hover {
  background-color: #303f9f;
}
.text-primary {
  color: #3f51b5;
}
</style>
