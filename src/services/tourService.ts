import axios from 'axios'

const API_URL = `${import.meta.env.VITE_API_BASE_URL}`

/**
 * Returns authorization headers using JWT token from localStorage.
 * Throws if token is missing.
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  if (!token) throw new Error('❌ No token found in localStorage')
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
}

/**
 * Tour interface aligned with backend model.
 */
export interface Tour {
  _id?: string
  title: string
  description: string
  price: number
  status: 'available' | 'sold out' | 'cancelled' | 'upcoming'
  imageUrls: string[]
  host: string
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  paymentDetails?: string
  createdBy?: string
}

/**
 * Retrieves all tours created by the current host.
 */
export const getTours = async (): Promise<Tour[]> => {
  const res = await axios.get(`${API_URL}/host/tours`, getAuthHeaders())
  return res.data.tourPackages
}

/**
 * Creates a new tour package (admin or host).
 */
export const createTour = async (tour: Tour): Promise<Tour> => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const isAdmin = user.role === 'admin'

  const endpoint = isAdmin
    ? `${API_URL}/admin/tour-packages`
    : `${API_URL}/host/tours`

  const res = await axios.post(endpoint, tour, getAuthHeaders())
  return res.data.tourPackage
}

/**
 * Updates an existing tour by ID.
 */
export const updateTour = async (id: string, tour: Tour): Promise<Tour> => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const isAdmin = user.role === 'admin'

  const endpoint = isAdmin
    ? `${API_URL}/admin/tour-packages/${id}`
    : `${API_URL}/host/tours/${id}`

  const res = await axios.patch(endpoint, tour, getAuthHeaders())
  return res.data.tourPackage
}

/**
 * Deletes a tour by ID.
 */
export const deleteTour = async (id: string): Promise<void> => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const isAdmin = user.role === 'admin'

  const endpoint = isAdmin
    ? `${API_URL}/admin/tour-packages/${id}`
    : `${API_URL}/host/tours/${id}`

  await axios.delete(endpoint, getAuthHeaders())
}
