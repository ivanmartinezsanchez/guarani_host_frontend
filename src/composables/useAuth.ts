import { ref } from 'vue'

// User type definition
export type User = {
  firstName: string
  lastName: string
  email: string
  password?: string  
  phone?: string
  address?: string
   role: 'admin' | 'host' | 'user'
}

// Recuperar del localStorage al iniciar
const stored = localStorage.getItem('user')
const user = ref<User | null>(stored ? JSON.parse(stored) : null)

export function useAuth() {
  // Simular login
  function login(userData: User) {
    user.value = userData
    localStorage.setItem('user', JSON.stringify(userData))
  }

  // Simular registro
  function register(userData: User) {
    user.value = userData
    localStorage.setItem('user', JSON.stringify(userData))
  }

  function logout() {
    user.value = null
    localStorage.removeItem('user')
  }

  return {
    user,
    login,
    register,
    logout
  }
}
