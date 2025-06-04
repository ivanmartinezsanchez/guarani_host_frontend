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
  _id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  address?: string
  role: 'admin' | 'host' | 'user'
  accountStatus?: 'active' | 'suspended' | 'deleted' | 'pending_verification'
}

export async function loginUser(credentials: {
  email: string
  password: string
}): Promise<{ user: User; token: string }> {
  try {
    const cleanEmail = credentials.email.trim()
    const cleanPassword = credentials.password.trim()

    const response = await axios.post(`${API_URL}/login`, {
      email: cleanEmail,
      password: cleanPassword,
    })

    const { token, user } = response.data
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    return { token, user }
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      'Login failed. Please try again.'
    throw new Error(message)
  }
}

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

export async function getUserProfile(): Promise<User> {
  const response = await axios.get(`${API_URL}/profile`, {
    headers: authHeaders(),
  })
  return response.data
}

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
