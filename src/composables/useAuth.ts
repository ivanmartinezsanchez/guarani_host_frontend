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
 * Valid account status values from backend enum.
 */
const validStatuses = ['active', 'suspended', 'deleted', 'pending_verification'] as const

/**
 * Normalize and safely cast a status string to the correct enum type.
 */
function normalizeStatus(status?: string): User['accountStatus'] {
  const lower = status?.toLowerCase()
  return validStatuses.includes(lower as any)
    ? (lower as User['accountStatus'])
    : 'pending_verification'
}

/**
 * Reactive user state initialized from localStorage on app start.
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
 * Composable to manage authentication state: login, register, logout.
 */
export function useAuth() {
  const router = useRouter()

  /**
   * Log in using email and password.
   * Normalizes accountStatus and persists token + user in localStorage.
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
   * Register a new user.
   * Normalizes accountStatus and persists token + user in localStorage.
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
   * Logout by clearing localStorage and resetting state.
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


