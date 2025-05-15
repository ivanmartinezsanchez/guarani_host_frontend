import axios from 'axios'

const API_URL = `${import.meta.env.VITE_API_BASE_URL}`

const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
}

// ================== INTERFACES ==================

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled'
export type PaymentStatus = 'pending' | 'paid' | 'refunded'

export interface Booking {
  _id?: string
  user: string | {
    _id: string
    email: string
    firstName: string
    lastName: string
  }
  property?: string | {
    _id?: string
    title: string
    city: string
    host: string
  }
  tourPackage?: string | {
    _id?: string
    title: string
    host: string
  }
  checkIn: Date
  checkOut: Date
  guests: number
  totalPrice: number
  status: BookingStatus
  paymentStatus: PaymentStatus
  paymentDetails?: string
  paymentImages?: string[]
}

// ================== HOST BOOKING SERVICE ==================

/**
 * Fetch all bookings related to the current host
 */
export const getHostBookings = async (): Promise<Booking[]> => {
  const res = await axios.get(`${API_URL}/host/bookings`, getAuthHeaders())
  return res.data.bookings
}

/**
 * Export host bookings to PDF with optional filters
 * @param from optional start date
 * @param to optional end date
 * @param paymentStatus optional payment filter
 */
export const exportHostBookingsToPDF = async (
  from?: string,
  to?: string,
  paymentStatus?: PaymentStatus
): Promise<Blob> => {
  const params = new URLSearchParams()
  if (from && to) {
    params.append('from', from)
    params.append('to', to)
  }
  if (paymentStatus) {
    params.append('paymentStatus', paymentStatus)
  }

  const res = await axios.get(`${API_URL}/host/bookings/export/pdf?${params.toString()}`, {
    ...getAuthHeaders(),
    responseType: 'blob'
  })

  return res.data
}
