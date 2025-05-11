import axios from 'axios'

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/admin/users`

/**
 * User interface aligned with backend model
 */
export interface User {
  _id: string
  firstName: string
  lastName: string
  email: string
  password: string 
  role: 'admin' | 'host' | 'user'
  phone?: string
  address?: string
  accountStatus: 'ACTIVE' | 'SUSPENDED' | 'DELETED' | 'PENDING_VERIFICATION' 
}

/**
 * Auth headers with Bearer token
 */
const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`
})

/**
 * Get all users (admin only)
 */
export const getAllUsers = async (): Promise<User[]> => {
  const response = await axios.get(API_URL, { headers: authHeaders() })
  return response.data
}

/**
 * Create a new user (admin only)
 */
export const createUser = async (userData: {
  firstName: string
  lastName: string
  email: string
  password: string
  role: 'admin' | 'host' | 'user'
  phone?: string
  address?: string
}) => {
  const response = await axios.post(API_URL, userData, { headers: authHeaders() })
  return response.data
}

/**
 * Update a user by ID (admin only)
 */
export const updateUserById = async (
  userId: string,
  updatedData: Partial<Omit<User, '_id' | 'createdAt' | 'email'>>
) => {
  const response = await axios.patch(`${API_URL}/${userId}`, updatedData, { headers: authHeaders() })
  return response.data
}

/**
 * Delete a user by ID (admin only)
 */
export const deleteUserById = async (userId: string): Promise<void> => {
  await axios.delete(`${API_URL}/${userId}`, { headers: authHeaders() })
}