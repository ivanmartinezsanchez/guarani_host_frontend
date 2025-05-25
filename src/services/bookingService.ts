import axios from 'axios'
import type { Property } from './propertyService'
import type { Tour } from './tourService'
import type { User } from './userService'

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/bookings`

/**
 * Returns authorization headers using the token from localStorage.
 * Throws an error if token is not available.
 */
const authHeaders = () => {
  const token = localStorage.getItem('token')
  if (!token) throw new Error('❌ No token found in localStorage')
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
}

/**
 * Booking interface aligned with backend model.
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
 * Fetches all bookings (admin or host depending on role).
 */
export const getBookings = async (): Promise<Booking[]> => {
  const res = await axios.get(API_URL, authHeaders())
  return res.data.bookings
}

/**
 * Creates a new booking (user, host or admin).
 * @param booking - Booking data to send
 */
export const createBooking = async (booking: Booking): Promise<Booking> => {
  const res = await axios.post(API_URL, booking, authHeaders())
  return res.data.booking
}

/**
 * Updates a booking by ID.
 * @param id - Booking ID to update
 * @param booking - Updated booking data
 */
export const updateBooking = async (id: string, booking: Booking): Promise<Booking> => {
  const res = await axios.patch(`${API_URL}/${id}`, booking, authHeaders())
  return res.data.booking
}

/**
 * Deletes a booking by ID.
 * @param id - Booking ID to delete
 */
export const deleteBooking = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`, authHeaders())
} 
