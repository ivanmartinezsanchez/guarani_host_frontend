import axios from 'axios'

const API_URL = `${import.meta.env.VITE_API_BASE_URL}`

// Auth headers using stored token
const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
}

// Property interface aligned with backend model
export interface Property {
  _id?: string
  title: string
  description: string
  address: string
  city: string
  pricePerNight: number
  checkIn: Date
  checkOut: Date
  guests: number
  amenities: string[]
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  paymentDetails?: string
  status: 'available' | 'booked' | 'cancelled' | 'confirmed' | 'inactive'
  host: string
  imageUrls: string[]
}

/**
 * Fetch all properties for the current host
 */
export const getProperties = async (): Promise<Property[]> => {
  const res = await axios.get(`${API_URL}/host/properties`, getAuthHeaders())
  return res.data.properties
}

/**
 * Create a new property (admin or host)
 */
export const createProperty = async (property: Property): Promise<Property> => {
  const res = await axios.post(`${API_URL}/admin/properties`, property, getAuthHeaders())
  return res.data.property
}

/**
 * Update an existing property by ID
 */
export const updateProperty = async (id: string, property: Property): Promise<Property> => {
  const res = await axios.patch(`${API_URL}/admin/properties/${id}`, property, getAuthHeaders())
  return res.data.property
}

/**
 * Delete a property by ID
 */
export const deleteProperty = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/admin/properties/${id}`, getAuthHeaders())
}