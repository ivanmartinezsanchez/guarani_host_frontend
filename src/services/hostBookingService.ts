import axios from 'axios'

const API_URL = import.meta.env.VITE_API_BASE_URL

const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
}

// Booking type aligned with backend
export interface Booking {
  _id?: string
  user: { email: string } | string
  property?: { title: string; host?: string } | string
  tourPackage?: { title: string; host?: string } | string
  checkIn: Date | string
  checkOut: Date | string
  guests: number
  status: 'pending' | 'confirmed' | 'cancelled'
  totalPrice: number
  paymentStatus: 'pending' | 'paid' | 'refunded'
  paymentDetails?: string
  paymentImages?: string[]
}

/**
 * Fetch host bookings (properties or tours owned by host)
 */
export const getHostBookings = async (): Promise<Booking[]> => {
  const res = await axios.get(`${API_URL}/host/bookings`, getAuthHeaders())
  return res.data.bookings
}

/**
 * Export host bookings to PDF with optional filters
 */
export const exportHostBookingsToPDF = async (filters: { paymentStatus?: string }) => {
  const params = new URLSearchParams(filters).toString()
  const res = await axios.get(`${API_URL}/host/bookings/export/pdf?${params}`, {
    ...getAuthHeaders(),
    responseType: 'blob',
  })

  const url = window.URL.createObjectURL(new Blob([res.data]))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', 'host-bookings.pdf')
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
