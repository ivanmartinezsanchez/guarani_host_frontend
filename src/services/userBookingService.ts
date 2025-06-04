/**
 * @file userBookingService.ts
 * @description Service for user booking operations (CRUD) with proper error handling and debugging
 * @created 2025-06-04
 */

import axios from 'axios'

const API_URL = import.meta.env.VITE_API_BASE_URL

/**
 * Get authorization headers with JWT token from localStorage
 * @returns Headers object with Authorization bearer token
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  if (!token) {
    console.warn('⚠️ No authentication token found')
  }
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
}

/**
 * Booking interface for user operations - CORREGIDA para coincidir con tu componente
 */
export interface Booking {
  _id?: string
  user?: { firstName: string; lastName: string; email: string } | string
  property?: { _id?: string; title: string; city: string; pricePerNight?: number } | string
  tourPackage?: { _id?: string; title: string; duration?: number; price?: number } | string
  checkIn: Date | string
  checkOut: Date | string
  guests: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  totalPrice: number
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  paymentDetails?: string
  paymentImages?: string[]
  removedPaymentImages?: string[]
  createdAt?: Date | string
  updatedAt?: Date | string
}

/**
 * Create booking data interface - EXTENDIDA
 */
export interface CreateBookingData {
  property?: string
  tourPackage?: string
  checkIn: string
  checkOut: string
  guests: number
  totalPrice: number
  paymentDetails?: string
  removedPaymentImages?: string[] // ✅ Agregado para updates
}

/**
 * Convert booking data to FormData - CORREGIDO
 */
const bookingToFormData = (
  booking: Record<string, any>,
  images: File[] = []
): FormData => {
  const formData = new FormData()

  for (const [key, value] of Object.entries(booking)) {
    if (value === undefined || value === null) continue

    if (Array.isArray(value)) {
      for (const item of value) {
        formData.append(key, String(item))
      }
    } else if (key === 'checkIn' || key === 'checkOut') {
      // Ensure ISO string for date values
      const isoDate = new Date(value).toISOString()
      formData.append(key, isoDate)
    } else {
      formData.append(key, String(value))
    }
  }

  // Append all selected images for payment evidence
  for (const file of images) {
    formData.append('paymentImages', file)
  }

  // ✅ DEBUG: Log FormData contents (corregido para TypeScript)
  if (import.meta.env.DEV) {
    console.log('📝 FormData contents:')
    // Simple approach to debug FormData without iteration issues
    console.log('📝 FormData created with images:', images.length)
    console.log('📝 Booking data keys:', Object.keys(booking))
  }

  return formData
}

/**
 * Get user's own bookings only - CON DEBUGGING MEJORADO
 */
export const getUserBookings = async (): Promise<Booking[]> => {
  try {
    console.log('🔍 Fetching user bookings from:', `${API_URL}/bookings`)
    
    const response = await axios.get(`${API_URL}/bookings`, getAuthHeaders())
    
    console.log('📋 Raw API response:', response)
    console.log('📋 Response data:', response.data)
    console.log('📋 Response status:', response.status)
    
    // 🚨 VERIFICAR MÚLTIPLES ESTRUCTURAS DE RESPUESTA POSIBLES
    let bookings: Booking[] = []
    
    if (response.data?.data?.bookings) {
      bookings = response.data.data.bookings
      console.log('📋 Found bookings in data.bookings:', bookings)
    } else if (response.data?.bookings) {
      bookings = response.data.bookings
      console.log('📋 Found bookings in root bookings:', bookings)
    } else if (Array.isArray(response.data?.data)) {
      bookings = response.data.data
      console.log('📋 Found bookings in data array:', bookings)
    } else if (Array.isArray(response.data)) {
      bookings = response.data
      console.log('📋 Found bookings in root array:', bookings)
    } else {
      console.warn('⚠️ Unexpected response structure:', response.data)
      bookings = []
    }
    
    console.log('📋 Final bookings array:', bookings)
    console.log('📋 Bookings count:', bookings.length)
    
    return bookings
    
  } catch (error: any) {
    console.error('❌ Error fetching user bookings:', error)
    console.error('❌ Error response:', error.response?.data)
    console.error('❌ Error status:', error.response?.status)
    throw error
  }
}

/**
 * Get single booking by ID (user must own it)
 */
export const getUserBookingById = async (id: string): Promise<Booking> => {
  try {
    console.log('🔍 Fetching booking by ID:', id)
    
    const response = await axios.get(`${API_URL}/bookings/${id}`, getAuthHeaders())
    
    // Handle multiple response structures
    const booking = response.data?.data?.booking || response.data?.booking || response.data
    
    console.log('📋 Single booking fetched:', booking)
    return booking
    
  } catch (error: any) {
    console.error('❌ Error fetching booking by ID:', error)
    throw error
  }
}

/**
 * Create a new booking - CON DEBUGGING COMPLETO
 */
export const createUserBooking = async (
  bookingData: CreateBookingData,
  paymentImages: File[] = []
): Promise<Booking> => {
  try {
    console.log('📝 Creating user booking with data:', bookingData)
    console.log('📝 Payment images count:', paymentImages.length)
    
    const formData = bookingToFormData(bookingData, paymentImages)
    
    const response = await axios.post(`${API_URL}/bookings`, formData, {
      ...getAuthHeaders(),
      headers: {
        ...getAuthHeaders().headers,
        'Content-Type': 'multipart/form-data'
      }
    })
    
    console.log('✅ Booking created successfully!')
    console.log('✅ Create response:', response.data)
    
    // Handle multiple response structures
    const createdBooking = response.data?.data?.booking || response.data?.booking || response.data
    
    return createdBooking
    
  } catch (error: any) {
    console.error('❌ Error creating booking:', error)
    console.error('❌ Error response:', error.response?.data)
    console.error('❌ Error status:', error.response?.status)
    throw error
  }
}

/**
 * Update user's own booking - CORREGIDO CON TIPOS CORRECTOS
 */
export const updateUserBooking = async (
  id: string,
  bookingData: Partial<CreateBookingData>, // ✅ Ahora incluye removedPaymentImages
  paymentImages: File[] = [],
  removedImages: string[] = []
): Promise<Booking> => {
  try {
    console.log('📝 Updating booking:', id)
    console.log('📝 Update data:', bookingData)
    
    // ✅ CORREGIDO: Crear updateData con tipo correcto
    const updateData: Record<string, any> = { ...bookingData }
    if (removedImages.length > 0) {
      updateData.removedPaymentImages = removedImages
    }
    
    const formData = bookingToFormData(updateData, paymentImages)
    
    const response = await axios.patch(`${API_URL}/bookings/${id}`, formData, {
      ...getAuthHeaders(),
      headers: {
        ...getAuthHeaders().headers,
        'Content-Type': 'multipart/form-data'
      }
    })
    
    console.log('✅ Booking updated successfully!')
    console.log('✅ Update response:', response.data)
    
    // Handle multiple response structures
    const updatedBooking = response.data?.data?.booking || response.data?.booking || response.data
    
    return updatedBooking
    
  } catch (error: any) {
    console.error('❌ Error updating booking:', error)
    console.error('❌ Error response:', error.response?.data)
    throw error
  }
}

/**
 * Cancel user's own booking
 */
export const cancelUserBooking = async (id: string): Promise<void> => {
  try {
    console.log('🚫 Canceling booking:', id)
    
    const response = await axios.delete(`${API_URL}/bookings/${id}`, getAuthHeaders())
    
    console.log('✅ Booking canceled successfully!')
    console.log('✅ Cancel response:', response.data)
    
  } catch (error: any) {
    console.error('❌ Error canceling booking:', error)
    console.error('❌ Error response:', error.response?.data)
    throw error
  }
}