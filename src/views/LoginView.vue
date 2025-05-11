<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '@/composables/useAuth'  // Import the composable
import { useRouter } from 'vue-router'

const { login } = useAuth()  // Access the login method from composable
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
      const user = await login({ email: email.value, password: password.value })  // Call login function
      if (user.role === 'admin') {
        router.push('/admin/dashboard')  // Redirect to admin dashboard
      } else if (user.role === 'host') {
        router.push('/host/dashboard')  // Redirect to host dashboard
      } else {
        router.push('/profile')  // Default redirect
      }
    } catch (error) {
      loginError.value = true  // Show error message on failed login
    }
  } else {
    loginError.value = true  // Show error message for invalid input
  }
}
</script>
