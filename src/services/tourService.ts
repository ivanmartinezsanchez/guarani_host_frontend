import axios from 'axios'

const API_URL = `${import.meta.env.VITE_API_BASE_URL}`

const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
}

// Tour interface aligned with backend model
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
 * Get all tour packages for the current host
 */
export const getTours = async (): Promise<Tour[]> => {
  const res = await axios.get(`${API_URL}/host/tours`, getAuthHeaders())
  return res.data.tours
}

/**
 * Create a new tour package (admin or host)
 */
export const createTour = async (tour: Tour): Promise<Tour> => {
  const res = await axios.post(`${API_URL}/admin/tour-packages`, tour, getAuthHeaders())
  return res.data.tour
}

/**
 * Update an existing tour package by ID
 */
export const updateTour = async (id: string, tour: Tour): Promise<Tour> => {
  const res = await axios.patch(`${API_URL}/admin/tour-packages/${id}`, tour, getAuthHeaders())
  return res.data.tour
}

/**
 * Delete a tour package by ID
 */
export const deleteTour = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/admin/tour-packages/${id}`, getAuthHeaders())
}