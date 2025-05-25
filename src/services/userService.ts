import axios from 'axios'

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/admin/users`

/**
 * User type definition aligned with backend model.
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
  accountStatus?: 'active' | 'suspended' | 'deleted' | 'pending_verification'
}

/**
 * Helper to construct authorization headers using the JWT token from localStorage.
 * Throws error if token is missing.
 */
const authHeaders = () => {
  const token = localStorage.getItem('token')
  if (!token) throw new Error('❌ No token found in localStorage')
  return { Authorization: `Bearer ${token}` }
}

/**
 * Fetches the list of all users (accessible by admin only).
 * @returns Array of User objects.
 */
export const getAllUsers = async (): Promise<User[]> => {
  const response = await axios.get(API_URL, { headers: authHeaders() })
  return response.data
}

/**
 * Create a new user (admin only).
 * @param userData Object with user details.
 * @returns Created user object.
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
 * Update a user by ID (admin only).
 * @param userId User ID.
 * @param updatedData Fields to update in the user's profile.
 * @returns Updated user object.
 */
export const updateUserById = async (
  userId: string,
  updatedData: Partial<Omit<User, '_id' | 'createdAt' | 'email'>>
) => {
  const response = await axios.patch(`${API_URL}/${userId}`, updatedData, { headers: authHeaders() })
  return response.data
}

/**
 * Delete a user by ID (admin only).
 * @param userId User ID.
 */
export const deleteUserById = async (userId: string): Promise<void> => {
  await axios.delete(`${API_URL}/${userId}`, { headers: authHeaders() })
}

/**
 * Update the current user's profile (for logged-in user)
 * @param data Partial user data
 * @returns Updated user
 */
export const updateProfileService = async (data: Partial<User>) => {
  const response = await axios.patch(`${import.meta.env.VITE_API_BASE_URL}/users/profile`, data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  })
  return response.data.user
}