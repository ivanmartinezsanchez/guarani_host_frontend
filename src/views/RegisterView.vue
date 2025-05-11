<template>
  <section class="min-h-screen flex items-center justify-center px-4 bg-gray-50 dark:bg-[#1a1a1a] transition-colors duration-300">
    <form
      @submit.prevent="handleRegister"
      class="w-full max-w-lg bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md space-y-5"
    >
      <!-- Page Title -->
      <h2 class="text-2xl font-bold text-center text-gray-800 dark:text-white tracking-tight">
        Crear una cuenta
      </h2>

      <!-- Name Inputs (First and Last Name) -->
      <div class="grid md:grid-cols-2 gap-4">
        <input
          v-model="firstName"
          type="text"
          placeholder="Nombre"
          required
          class="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-900 dark:text-white"
        />

        <input
          v-model="lastName"
          type="text"
          placeholder="Apellido"
          required
          class="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-900 dark:text-white"
        />
      </div>

      <!-- Email and Phone Inputs -->
      <input
        v-model="email"
        type="email"
        placeholder="Correo Electrónico"
        required
        :class="inputClass"
        :style="{ borderColor: emailValid ? '' : 'red' }"
      />

      <input
        v-model="phone"
        type="tel"
        placeholder="Teléfono"
        required
        :class="inputClass"
      />

      <!-- Address Input -->
      <input
        v-model="address"
        type="text"
        placeholder="Dirección"
        class="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-900 dark:text-white"
      />

      <!-- Password Input -->
      <input
        v-model="password"
        type="password"
        placeholder="Contraseña (min. 8 caracteres)"
        required
        minlength="8"
        :class="inputClass"
        :style="{ borderColor: passwordValid ? '' : 'red' }"
      />

      <!-- Submit Button -->
      <button
        type="submit"
        class="w-full bg-primary hover:bg-hover text-white font-semibold py-2 px-4 rounded-md transition-colors"
      >
        Registrarse
      </button>
    </form>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'

const { register } = useAuth()
const router = useRouter()

// User model fields
const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const phone = ref('')
const address = ref('')

// Validation states
const emailValid = ref(true)
const passwordValid = ref(true)

// Input class definition (shared for all inputs)
const inputClass = "w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-900 dark:text-white"

// Regular expressions for validations
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/

// Handle form submission
function handleRegister() {
  // Validate email
  emailValid.value = emailRegex.test(email.value)
  
  // Validate password
  passwordValid.value = passwordRegex.test(password.value)

  // Check if all required fields are valid
  if (
    firstName.value.trim() &&
    lastName.value.trim() &&
    emailValid.value &&
    passwordValid.value
  ) {
    register({
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      role: 'user',
      phone: phone.value,
      address: address.value
    })
    alert('Registro exitoso. Bienvenido!')
    router.push('/login')
  } else {
    alert('Por favor, rellene todos los campos correctamente.')
  }
}
</script>

<style scoped>
/* Custom input class with Tailwind CSS */
.input {
  @apply w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-900 dark:text-white;
}

/* Primary background color */
.bg-primary {
  background-color: #3F51B5;
}

/* Primary text color */
.text-primary {
  color: #3F51B5;
}

/* Hover effect for primary elements */
.hover\:bg-hover:hover {
  background-color: #303F9F;
}
</style>

