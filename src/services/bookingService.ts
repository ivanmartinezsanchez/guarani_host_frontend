import axios from 'axios'
import type { Property } from './propertyService'
import type { Tour } from './tourService'
import type { User } from './userService'

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/bookings`

/**
 * Returns authorization headers using the token from localStorage.
 */
const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`
})

/**
 * Booking interface definition aligned with backend.
 */
export interface Booking {
  _id?: string
  user: User | string
  property?: Property | string
  tourPackage?: Tour | string
  checkIn: Date
  checkOut: Date
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  guests: number
  totalPrice: number
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  paymentDetails?: string
  paymentImages?: string[]
}

/**
 * Get all bookings
 */
export const getBookings = async (): Promise<Booking[]> => {
  const res = await axios.get(API_URL, { headers: authHeaders() })
  return res.data.bookings
}

/**
 * Create a new booking
 */
export const createBooking = async (booking: Booking): Promise<Booking> => {
  const res = await axios.post(API_URL, booking, { headers: authHeaders() })
  return res.data.booking
}

/**
 * Update a booking
 */
export const updateBooking = async (id: string, booking: Booking): Promise<Booking> => {
  const res = await axios.patch(`${API_URL}/${id}`, booking, { headers: authHeaders() })
  return res.data.booking
}

/**
 * Delete a booking
 */
export const deleteBooking = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`, { headers: authHeaders() })
}