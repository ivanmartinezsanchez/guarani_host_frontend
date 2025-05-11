import axios from 'axios'

const API_URL = 'http://localhost:4000/api'

// Helper for auth headers
const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`
})

/**
 * Registers a new user
 * @param userData User registration fields
 * @returns Created user object
 */
export async function registerUser(userData: {
  firstName: string
  lastName: string
  email: string
  password: string
  phone?: string
  address?: string
}) {
  const res = await axios.post(`${API_URL}/auth/register`, userData)
  return res.data
}

/**
 * Logs in the user and stores token and user data in localStorage
 * @param credentials Object with email and password
 * @returns Authenticated user object
 */
export async function loginUser(credentials: { email: string; password: string }) {
  const res = await axios.post(`${API_URL}/auth/login`, credentials)
  const { token, user } = res.data

  localStorage.setItem('token', token)
  localStorage.setItem('user', JSON.stringify(user))

  return user
}

/**
 * Retrieves the authenticated user's profile
 * @returns User profile data
 */
export async function getUserProfile() {
  const res = await axios.get(`${API_URL}/auth/profile`, {
    headers: authHeaders()
  })
  return res.data
}

/**
 * Updates the profile of the authenticated user
 * @param updatedData Fields to update
 * @returns Updated user profile
 */
export async function updateUserProfile(updatedData: {
  firstName?: string
  lastName?: string
  phone?: string
  address?: string
}) {
  const res = await axios.put(`${API_URL}/auth/profile`, updatedData, {
    headers: authHeaders()
  })
  return res.data
}
