import axios from 'axios'

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/host`

/**
 * Returns authorization headers including the JWT token from localStorage.
 * Throws an error if the token is missing.
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
 * Property interface matching backend schema.
 */
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
 * Retrieves all properties owned by the currently authenticated host.
 */
export const getProperties = async (): Promise<Property[]> => {
  const token = localStorage.getItem('token')
  if (!token) return [] // Prevent execution if not authenticated

  const res = await axios.get(`${API_URL}/properties`, getAuthHeaders())
  return res.data.properties
}

/**
 * Creates a new property using FormData.
 * Requires multipart/form-data for image uploads.
 */
export const createProperty = async (formData: FormData): Promise<Property> => {
  const res = await axios.post(`${API_URL}/properties`, formData, {
    ...getAuthHeaders(),
    headers: {
      ...getAuthHeaders().headers,
      'Content-Type': 'multipart/form-data',
    },
  })
  return res.data.property
}

/**
 * Updates an existing property by ID using FormData.
 */
export const updateProperty = async (id: string, formData: FormData): Promise<Property> => {
  const res = await axios.patch(`${API_URL}/properties/${id}`, formData, {
    ...getAuthHeaders(),
    headers: {
      ...getAuthHeaders().headers,
      'Content-Type': 'multipart/form-data',
    },
  })
  return res.data.property
}

/**
 * Deletes a property by its unique ID.
 */
export const deleteProperty = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/properties/${id}`, getAuthHeaders())
}