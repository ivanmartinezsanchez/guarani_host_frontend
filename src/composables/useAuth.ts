import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { loginUser, registerUser } from '@/services/authService'

/**
 * User interface aligned with backend schema
 */
export type User = {
  _id: string // ✅ REQUIRED FIELD
  firstName: string
  lastName: string
  email: string
  phone?: string
  address?: string
  role: 'admin' | 'host' | 'user'
  accountStatus?: 'active' | 'suspended' | 'deleted' | 'pending_verification'
}

const validStatuses = ['active', 'suspended', 'deleted', 'pending_verification'] as const

function normalizeStatus(status?: string): User['accountStatus'] {
  const lower = status?.toLowerCase()
  return validStatuses.includes(lower as any)
    ? (lower as User['accountStatus'])
    : 'pending_verification'
}

const storedUser = localStorage.getItem('user')
const user = ref<User | null>(
  storedUser
    ? {
        ...JSON.parse(storedUser),
        accountStatus: normalizeStatus(JSON.parse(storedUser).accountStatus),
      }
    : null
)

export function useAuth() {
  const router = useRouter()

  async function login(credentials: { email: string; password: string }): Promise<User> {
    const { user: loggedInUser, token } = await loginUser(credentials)
    const normalizedUser: User = {
      ...loggedInUser,
      accountStatus: normalizeStatus(loggedInUser.accountStatus),
    }
    user.value = normalizedUser
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(normalizedUser))
    return normalizedUser
  }

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

  function logout() {
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }

  return {
    user,
    login,
    register,
    logout,
  }
}
