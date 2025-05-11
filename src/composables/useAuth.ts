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

// Define user state using reactive references
const stored = localStorage.getItem('user')
const user = ref<User | null>(stored ? JSON.parse(stored) : null)

export function useAuth() {
  // Log in function to store user in localStorage
  function login(userData: User) {
    user.value = userData
    localStorage.setItem('user', JSON.stringify(userData))
  }

  // Register function (just a mock, you'd use an API call)
  function register(userData: User) {
    user.value = userData
    localStorage.setItem('user', JSON.stringify(userData))
  }

  // Log out function to remove user from localStorage
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
