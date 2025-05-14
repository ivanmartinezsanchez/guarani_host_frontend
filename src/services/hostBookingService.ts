import axios from 'axios'

// Base API URL from environment variables
const API_URL = `${import.meta.env.VITE_API_BASE_URL}`

/**
 * Get authorization headers from localStorage
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
}

/**
 * Booking interface aligned with backend schema
 */
export interface Booking {
  _id: string
  user: {
    _id: string
    email: string
    firstName?: string
    lastName?: string
    role: 'admin' | 'host' | 'user'
  }
  property?: {
    _id: string
    title: string
    host: string
  } | string
  tourPackage?: {
    _id: string
    title: string
    host: string
  } | string
  checkIn: Date
  checkOut: Date
  status: 'pending' | 'confirmed' | 'cancelled'
  guests: number
  paymentStatus: 'pending' | 'paid' | 'refunded'
  paymentDetails?: string
  paymentImages?: string[]
}

/**
 * Get all bookings related to the current host (by properties or tours)
 * @returns List of bookings for the host
 */
export const getHostBookings = async (): Promise<Booking[]> => {
  const res = await axios.get(`${API_URL}/host/bookings`, getAuthHeaders())
  return res.data.bookings
}

/**
 * Export filtered host bookings as PDF
 * @param filters Object with optional query parameters (from, to, paymentStatus)
 * @returns A Blob containing the PDF file
 */
export const getBookingsPDF = async (filters: {
  from?: string
  to?: string
  paymentStatus?: string
}): Promise<Blob> => {
  const params = new URLSearchParams(filters).toString()
  const res = await axios.get(`${API_URL}/host/bookings/export/pdf?${params}`, {
    ...getAuthHeaders(),
    responseType: 'blob',
  })
  return res.data
}
