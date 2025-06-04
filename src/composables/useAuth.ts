import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { loginUser, registerUser } from '@/services/authService'

/**
 * User interface aligned with backend schema
 * Represents the authenticated user data structure
 */
export type User = {
  _id: string 
  firstName: string
  lastName: string
  email: string
  phone?: string
  address?: string
  role: 'admin' | 'host' | 'user'
  accountStatus?: 'active' | 'suspended' | 'deleted' | 'pending_verification'
}

/**
 * Valid account status values for validation
 */
const validStatuses = ['active', 'suspended', 'deleted', 'pending_verification'] as const

/**
 * Normalizes account status string to valid status type
 * @param status - Raw status string from backend
 * @returns Normalized status or default 'pending_verification'
 */
function normalizeStatus(status?: string): User['accountStatus'] {
  const lower = status?.toLowerCase()
  return validStatuses.includes(lower as any)
    ? (lower as User['accountStatus'])
    : 'pending_verification'
}

/**
 * Initializes user from localStorage with enhanced error handling and validation
 * Attempts to restore user session from browser storage
 * Handles both 'id' and '_id' field variations from backend
 * @returns User object if valid session exists, null otherwise
 */
function initializeUser(): User | null {
  try {
    const storedUser = localStorage.getItem('user')
    const storedToken = localStorage.getItem('token')
    
    console.log('🔍 Initializing user from localStorage:', { storedUser, hasToken: !!storedToken })
    
    // Validate that both user data and token exist
    if (!storedUser || storedUser === 'null' || !storedToken) {
      console.log('❌ No valid user or token in localStorage')
      return null
    }
    
    // Parse user data safely
    const parsedUser = JSON.parse(storedUser)
    console.log('👤 Parsed user:', parsedUser)
    
    // 🔧 NORMALIZE ID FIELD - handle both 'id' and '_id'
    const userId = parsedUser._id || parsedUser.id
    if (!userId) {
      console.warn('⚠️ User missing both _id and id fields')
      return null
    }
    
    // Create normalized user object with proper _id field and account status
    const normalizedUser: User = {
      ...parsedUser,
      _id: userId, // Ensure _id is always present
      accountStatus: normalizeStatus(parsedUser.accountStatus),
    }
    
    console.log('✅ User initialized successfully with _id:', normalizedUser._id)
    return normalizedUser
  } catch (error) {
    console.error('❌ Error initializing user:', error)
    return null
  }
}

/**
 * Global reactive user state initialized from localStorage
 * Maintains authentication state across the application
 */
const user = ref<User | null>(initializeUser())

/**
 * Authentication composable providing user management functionality
 * Handles login, registration, logout, and session management
 * @returns Object with user state and authentication methods
 */
export function useAuth() {
  const router = useRouter()

 /**
 * Authenticates user with email and password
 * Updates global user state and persists session to localStorage
 * Normalizes id field to _id for consistency
 * @param credentials - User login credentials
 * @returns Promise resolving to authenticated user
 */
async function login(credentials: { email: string; password: string }): Promise<User> {
  const { user: loggedInUser, token } = await loginUser(credentials)
  
  // 🔧 NORMALIZE ID FIELD - use type assertion to handle both formats
  const normalizedUser: User = {
    ...loggedInUser,
    _id: loggedInUser._id || (loggedInUser as any).id, // Handle both id formats safely
    accountStatus: normalizeStatus(loggedInUser.accountStatus),
  }
  
  user.value = normalizedUser
  localStorage.setItem('token', token)
  localStorage.setItem('user', JSON.stringify(normalizedUser))
  console.log('✅ User logged in and set with _id:', normalizedUser._id)
  return normalizedUser
}

/**
 * Registers new user account
 * Automatically logs in user after successful registration
 * Normalizes id field to _id for consistency
 * @param userData - New user registration data
 * @returns Promise resolving to newly created and authenticated user
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
  
  // 🔧 NORMALIZE ID FIELD - use type assertion to handle both formats
  const normalizedUser: User = {
    ...newUser,
    _id: newUser._id || (newUser as any).id, // Handle both id formats safely
    accountStatus: normalizeStatus(newUser.accountStatus),
  }
  
  user.value = normalizedUser
  localStorage.setItem('token', token)
  localStorage.setItem('user', JSON.stringify(normalizedUser))
  return normalizedUser
}
  /**
   * Logs out current user
   * Clears user state and removes session data from localStorage
   * Redirects to login page
   */
  function logout() {
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }

  /**
   * Refreshes user state from localStorage
   * Useful for recovering session after page reload or component remount
   * Re-initializes user from stored session data
   */
  function refreshUser() {
    user.value = initializeUser()
  }

  /**
   * Return authentication interface
   * Provides reactive user state and all authentication methods
   */
  return {
    user,
    login,
    register,
    logout,
    refreshUser,
  }
}