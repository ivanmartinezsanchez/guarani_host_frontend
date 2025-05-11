<template>
  <section class="min-h-screen flex items-center justify-center px-4 bg-gray-50 dark:bg-[#1a1a1a] transition-colors duration-300">
    <form
      @submit.prevent="handleLogin"
      class="w-full max-w-sm bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md space-y-6"
    >
      <!-- Page Title -->
      <h2 class="text-2xl font-bold text-center text-gray-800 dark:text-white tracking-tight">
        Log In
      </h2>

      <!-- Email Input -->
      <input
        v-model="email"
        type="email"
        placeholder="Email Address"
        required
        :class="inputClass"
        :style="{ borderColor: emailValid ? '' : 'red' }"
      />

      <!-- Password Input -->
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        required
        minlength="6"
        :class="inputClass"
        :style="{ borderColor: passwordValid ? '' : 'red' }"
      />

      <!-- Submit Button -->
      <button
        type="submit"
        class="w-full bg-primary hover:bg-hover text-white font-semibold py-2 px-4 rounded-md transition-colors"
      >
        Log In
      </button>

      <!-- Error Message -->
      <p v-if="loginError" class="text-red-500 text-center">Invalid credentials, please try again.</p>
    </form>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'

const { login } = useAuth()
const router = useRouter()

// Form fields
const email = ref('')
const password = ref('')
const loginError = ref(false)

// Validation states
const emailValid = ref(true)
const passwordValid = ref(true)

// Input class for styling
const inputClass = "w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-900 dark:text-white"

// Regular expressions for validation
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/

// Handle form submission
async function handleLogin() {
  // Validate email and password
  emailValid.value = emailRegex.test(email.value)
  passwordValid.value = passwordRegex.test(password.value)

  if (emailValid.value && passwordValid.value) {
    // Try to log in using the provided credentials
    try {
      await login({ email: email.value, password: password.value })
      router.push('/dashboard')  // Redirect to dashboard on success
    } catch (error) {
      loginError.value = true  // Show error message on failed login
    }
  } else {
    loginError.value = true  // Show error message for invalid input
  }
}
</script>

<style scoped>
.input {
  @apply w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-900 dark:text-white;
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
