import axios from 'axios'

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/host`

/**
 * Get auth headers using the JWT token
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
 * Property model aligned with backend
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
 * Fetch all properties owned by the authenticated host
 */
export const getProperties = async (): Promise<Property[]> => {
  const res = await axios.get(`${API_URL}/properties`, getAuthHeaders())
  return res.data.properties
}

/**
 * Create a new property (host)
 * @param formData FormData with fields and images
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
 * Update a property (host)
 * @param id Property ID
 * @param formData FormData with updated fields and images
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
 * Delete a property by ID (host)
 */
export const deleteProperty = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/properties/${id}`, getAuthHeaders())
}
