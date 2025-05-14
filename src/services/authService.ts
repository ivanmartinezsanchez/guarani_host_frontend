import axios from 'axios'

const API_URL = 'http://localhost:4000/api/auth'  // Backend URL for authentication

// Helper to get auth headers with JWT token
const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`
})

/**
 * Logs in the user and stores token and user data in localStorage.
 * @param credentials Object containing email and password.
 * @returns User object after successful login.
 */
export async function loginUser(credentials: { email: string; password: string }) {
  const response = await axios.post(`${API_URL}/login`, credentials)
  const { token, user } = response.data

  // Store the token and user data in localStorage
  localStorage.setItem('token', token)
  localStorage.setItem('user', JSON.stringify(user))

  return user
}

/**
 * Registers a new user and stores user data.
 * @param userData Object containing user details (email, password, etc.)
 * @returns Created user object.
 */
export async function registerUser(userData: {
  firstName: string
  lastName: string
  email: string
  password: string
  phone?: string
  address?: string
  role?: 'user' | 'host' | 'admin'
}) {
  const response = await axios.post(`${API_URL}/register`, userData)
  return response.data
}

/**
 * Retrieves the authenticated user's profile.
 * @returns User profile data.
 */
export async function getUserProfile() {
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
}) {
  const response = await axios.put(`${API_URL}/profile`, updatedData, { headers: authHeaders() })
  return response.data
}
