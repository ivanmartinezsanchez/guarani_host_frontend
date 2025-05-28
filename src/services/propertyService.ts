import axios from 'axios'

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/host`

/**
 * Returns authorization headers including the JWT token from localStorage.
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  if (!token) throw new Error('❌ No token found in localStorage')
  return {
    Authorization: `Bearer ${token}`,
  }
}

/**
 * Enum types for property status and payment status aligned with backend.
 */
export type PropertyStatus = 'available' | 'booked' | 'cancelled' | 'confirmed' | 'inactive'

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'

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
  checkIn: string       // formatted as yyyy-MM-dd
  checkOut: string      // formatted as yyyy-MM-dd
  guests: number
  amenities: string[]
  paymentStatus: PaymentStatus
  paymentDetails?: string
  status: PropertyStatus
  host: string
  imageUrls: string[]
}

/**
 * Retrieves all properties for the authenticated host.
 */
export const getProperties = async (): Promise<Property[]> => {
  const res = await axios.get(`${API_URL}/properties`, {
    headers: getAuthHeaders()
  })
  return res.data.properties
}

/**
 * Creates a new property (with images).
 */
export const createProperty = async (formData: FormData): Promise<Property> => {
  const headers = {
    ...getAuthHeaders(),
    'Content-Type': 'multipart/form-data'
  }
  const res = await axios.post(`${API_URL}/properties`, formData, { headers })
  return res.data.property
}

/**
 * Updates an existing property (with optional new images).
 */
export const updateProperty = async (id: string, formData: FormData): Promise<Property> => {
  const headers = {
    ...getAuthHeaders(),
    'Content-Type': 'multipart/form-data'
  }
  const res = await axios.patch(`${API_URL}/properties/${id}`, formData, { headers })
  return res.data.property
}

/**
 * Deletes a property by ID.
 */
export const deleteProperty = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/properties/${id}`, {
    headers: getAuthHeaders()
  })
}
