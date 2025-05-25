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
  return res.data.tours
}

/**
 * Creates a new tour package (admin or host).
 * @param tour - Tour data object
 */
export const createTour = async (tour: Tour): Promise<Tour> => {
  const res = await axios.post(`${API_URL}/admin/tour-packages`, tour, getAuthHeaders())
  return res.data.tour
}

/**
 * Updates an existing tour by ID.
 * @param id - Tour ID
 * @param tour - Updated tour data
 */
export const updateTour = async (id: string, tour: Tour): Promise<Tour> => {
  const res = await axios.patch(`${API_URL}/admin/tour-packages/${id}`, tour, getAuthHeaders())
  return res.data.tour
}

/**
 * Deletes a tour by ID.
 * @param id - Tour ID
 */
export const deleteTour = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/admin/tour-packages/${id}`, getAuthHeaders())
}
