import axios from 'axios'

const API_URL = 'http://localhost:4000/api/auth'

/**
 * Authorization headers with JWT token from localStorage
 */
const authHeaders = () => {
  const token = localStorage.getItem('token')
  if (!token) throw new Error('❌ No token found in localStorage')
  return { Authorization: `Bearer ${token}` }
}

/**
 * User interface aligned with backend
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
 * Log in a user with email and password
 * Stores token and user info in localStorage
 * @param credentials - login data
 * @returns token and user object
 */
export async function loginUser(credentials: {
  email: string
  password: string
}): Promise<{ user: User; token: string }> {
  try {
    // Clean whitespace
    const cleanEmail = credentials.email.trim()
    const cleanPassword = credentials.password.trim()

    console.log('📤 Sending login credentials:', {
      email: cleanEmail,
      password: cleanPassword,
    })

    const response = await axios.post(`${API_URL}/login`, {
      email: cleanEmail,
      password: cleanPassword,
    })

    // ✅ Extract token and user from response
    const { token, user } = response.data

    // ✅ Store session data
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))

    console.log('✅ Login successful')
    console.log('🧩 Token saved:', token)
    console.log('👤 User stored:', user)

    return { token, user }
  } catch (error: any) {
    console.error('❌ loginUser error:', error)
    const message =
      error?.response?.data?.message ||
      error?.message ||
      'Login failed. Please try again.'
    throw new Error(message)
  }
}

/**
 * Register a new user
 * @param userData - registration form fields
 * @returns token and user object
 */
export async function registerUser(userData: {
  firstName: string
  lastName: string
  email: string
  password: string
  phone?: string
  address?: string
  role?: 'user' | 'host' | 'admin'
}): Promise<{ user: User; token: string }> {
  const response = await axios.post(`${API_URL}/register`, userData)
  const { token, user } = response.data

  localStorage.setItem('token', token)
  localStorage.setItem('user', JSON.stringify(user))

  return { token, user }
}

/**
 * Get the profile of the currently authenticated user
 * @returns user object
 */
export async function getUserProfile(): Promise<User> {
  const response = await axios.get(`${API_URL}/profile`, {
    headers: authHeaders(),
  })
  return response.data
}

/**
 * Update the authenticated user's profile
 * @param updatedData - partial user fields to update
 * @returns updated user object
 */
export async function updateUserProfile(updatedData: {
  firstName?: string
  lastName?: string
  phone?: string
  address?: string
}): Promise<User> {
  const response = await axios.put(`${API_URL}/profile`, updatedData, {
    headers: authHeaders(),
  })
  return response.data
}
