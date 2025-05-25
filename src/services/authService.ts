import axios from 'axios'

const API_URL = 'http://localhost:4000/api/auth' 
// Helper to get auth headers with JWT token
const authHeaders = () => {
  const token = localStorage.getItem('token')
  if (!token) throw new Error('❌ No token found in localStorage')
  return { Authorization: `Bearer ${token}` }
}

/**
 * User type aligned with backend model.
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
 * Logs in the user and stores token and user data in localStorage.
 * @param credentials Object containing email and password.
 * @returns Object containing user and token.
 */
export async function loginUser(credentials: {
  email: string
  password: string
}): Promise<{ user: User; token: string }> {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials)
    const { token, user } = response.data

    // Persist session in localStorage
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))

    console.log('✅ Login successful')
    console.log('🧩 Token saved:', token)
    console.log('👤 User stored:', user)

    return { token, user }
  } catch (error: any) {
    console.error('❌ loginUser error:', error)

    // Extract backend error message or fallback to generic
    const message =
      error?.response?.data?.message ||
      error?.message ||
      'Login failed. Please try again.'

    throw new Error(message)
  }
}

/**
 * Registers a new user and stores user data.
 * @param userData Object containing user details (email, password, etc.)
 * @returns Object containing user and token.
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
 * Retrieves the authenticated user's profile.
 * @returns User profile data.
 */
export async function getUserProfile(): Promise<User> {
  const response = await axios.get(`${API_URL}/profile`, { headers: authHeaders() })
  return response.data
}

/**
 * Updates the profile of the authenticated user.
 * @param updatedData Fields to update in the user's profile.
 * @returns Updated user profile.
 */
export async function updateUserProfile(updatedData: {
  firstName?: string
  lastName?: string
  phone?: string
  address?: string
}): Promise<User> {
  const response = await axios.put(`${API_URL}/profile`, updatedData, { headers: authHeaders() })
  return response.data
}
