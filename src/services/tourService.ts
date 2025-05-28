// src/services/tourService.ts

import axios from 'axios'

const API_URL = `${import.meta.env.VITE_API_BASE_URL}`

/**
 * Returns authorization headers using JWT token from localStorage.
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
}

/**
 * Fetch all tour packages created by the current host.
 */
export const getTours = async (): Promise<Tour[]> => {
  const res = await axios.get(`${API_URL}/host/tours`, getAuthHeaders())
  return res.data.tourPackages
}

/**
 * Create a new tour package (admin or host), including image upload.
 * Uses FormData to support file transfer to backend.
 * 
 * @param tour - Partial tour data (title, description, etc.)
 * @param files - Array of image files to upload
 * @returns Created tour object
 */
export const createTour = async (
  tour: Partial<Tour>,
  files: File[]
): Promise<Tour> => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const isAdmin = user.role === 'admin'

  const endpoint = isAdmin
    ? `${API_URL}/admin/tour-packages`
    : `${API_URL}/host/tours`

  const formData = new FormData()
  formData.append('title', tour.title || '')
  formData.append('description', tour.description || '')
  formData.append('price', String(tour.price ?? 0))
  formData.append('status', tour.status || 'available')
  formData.append('paymentDetails', tour.paymentDetails || '')

  files.forEach(file => {
    formData.append('images', file)
  })

  const token = localStorage.getItem('token')
  if (!token) throw new Error('❌ No token found in localStorage')

  const res = await axios.post(endpoint, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  })

  return res.data.tour || res.data.tourPackage
}

/**
 * Update an existing tour package by ID.
 * 
 * @param id - Tour ID
 * @param tour - Tour object with updated values
 * @returns Updated tour
 */
export const updateTour = async (
  id: string,
  tour: Tour
): Promise<Tour> => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const isAdmin = user.role === 'admin'

  const endpoint = isAdmin
    ? `${API_URL}/admin/tour-packages/${id}`
    : `${API_URL}/host/tours/${id}`

  const res = await axios.patch(endpoint, tour, getAuthHeaders())
  return res.data.tour || res.data.tourPackage
}

/**
 * Delete a tour package by ID.
 * 
 * @param id - Tour ID to delete
 */
export const deleteTour = async (id: string): Promise<void> => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const isAdmin = user.role === 'admin'

  const endpoint = isAdmin
    ? `${API_URL}/admin/tour-packages/${id}`
    : `${API_URL}/host/tours/${id}`

  await axios.delete(endpoint, getAuthHeaders())
}
