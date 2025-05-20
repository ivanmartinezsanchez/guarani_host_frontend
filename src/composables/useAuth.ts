import { ref } from 'vue'
import { loginUser, registerUser } from '@/services/authService'

/**
 * User type aligned with backend model
 */
export type User = {
  firstName: string
  lastName: string
  email: string
  phone?: string
  address?: string
  role: 'admin' | 'host' | 'user'
  accountStatus?: 'ACTIVE' | 'SUSPENDED' | 'DELETED' | 'PENDING_VERIFICATION'
}

/**
 * Reactive user state initialized from localStorage
 */
const storedUser = localStorage.getItem('user')
const user = ref<User | null>(storedUser ? JSON.parse(storedUser) : null)

/**
 * Composable to manage authentication state
 */
export function useAuth() {
  /**
   * Log in using email and password credentials
   * @param credentials Object with email and password
   * @returns Logged-in user object
   */
  async function login(credentials: { email: string; password: string }): Promise<User> {
    const { user: loggedInUser, token } = await loginUser(credentials)
    user.value = loggedInUser
    return loggedInUser
  }

  /**
   * Register a new user
   * @param userData Full user data with password
   * @returns Registered user object
   */
  async function register(userData: {
    firstName: string
    lastName: string
    email: string
    password: string
    phone?: string
    address?: string
    role?: 'user' | 'host' | 'admin'
  }): Promise<User> {
    const { user: newUser, token } = await registerUser(userData)
    user.value = newUser
    return newUser
  }

  /**
   * Log out and clear local storage
   */
  function logout() {
    user.value = null
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  return {
    user,
    login,
    register,
    logout,
  }
}
