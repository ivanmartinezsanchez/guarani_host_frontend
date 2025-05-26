import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { loginUser, registerUser } from '@/services/authService'

/**
 * User type aligned with the backend model.
 */
export type User = {
  firstName: string
  lastName: string
  email: string
  phone?: string
  address?: string
  role: 'admin' | 'host' | 'user'
  accountStatus?: 'active' | 'suspended' | 'deleted' | 'pending_verification'
}

/**
 * Valid status values from AccountStatus enum (backend)
 */
const validStatuses = ['active', 'suspended', 'deleted', 'pending_verification'] as const

/**
 * Normalize a string to match allowed accountStatus values
 */
function normalizeStatus(status?: string): User['accountStatus'] {
  const lower = status?.toLowerCase()
  return validStatuses.includes(lower as any)
    ? (lower as User['accountStatus'])
    : 'pending_verification'
}

/**
 * Reactive state: user is initialized from localStorage if available
 */
const storedUser = localStorage.getItem('user')
const user = ref<User | null>(
  storedUser
    ? {
        ...JSON.parse(storedUser),
        accountStatus: normalizeStatus(JSON.parse(storedUser).accountStatus),
      }
    : null
)

/**
 * Auth composable that handles login, registration, and logout logic
 */
export function useAuth() {
  const router = useRouter()

  /**
   * Log in with credentials, update state and localStorage
   */
  async function login(credentials: { email: string; password: string }): Promise<User> {
    try {
      const { user: loggedInUser, token } = await loginUser(credentials)

      const normalizedUser: User = {
        ...loggedInUser,
        accountStatus: normalizeStatus(loggedInUser.accountStatus),
      }

      user.value = normalizedUser
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(normalizedUser))

      return normalizedUser
    } catch (error) {
      console.error('❌ Login failed:', error)
      throw error
    }
  }

  /**
   * Register a new user and store session in localStorage
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

    const normalizedUser: User = {
      ...newUser,
      accountStatus: normalizeStatus(newUser.accountStatus),
    }

    user.value = normalizedUser
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(normalizedUser))

    return normalizedUser
  }

  /**
   * Clear session and redirect to login
   */
  function logout() {
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    console.log('👋 User logged out')
    router.push('/login')
  }

  return {
    user,
    login,
    register,
    logout,
  }
}
