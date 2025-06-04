import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

/**
 * Returns authorization headers using JWT token from localStorage
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
 * Booking interface
 */
export interface BookingData {
  user: string
  property?: string      // Para propiedades
  tourPackage?: string   // Para tours
  checkIn: Date
  checkOut: Date
  guests: number
  status: 'pending' | 'confirmed' | 'cancelled'
  totalPrice: number
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
}

/**
 * Create a new booking (requires authentication)
 */
export const createBooking = async (bookingData: BookingData) => {
  try {
    console.log('📋 Creating booking:', bookingData)
    
    // Verificar que el usuario esté autenticado
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('Usuario no autenticado')
    }
    
    // Convertir dates a strings para envío
    const dataToSend = {
      ...bookingData,
      checkIn: bookingData.checkIn.toISOString(),
      checkOut: bookingData.checkOut.toISOString()
    }
    
    console.log('📤 Sending booking data:', dataToSend)
    
    // Usar el endpoint correcto después de corregir el backend
    const endpoint = `${API_BASE_URL}/bookings`
    console.log(`🔄 Creating booking at: ${endpoint}`)
    
    const res = await axios.post(endpoint, dataToSend, getAuthHeaders())
    
    console.log('✅ Booking created successfully:', res.data)
    return res.data.booking || res.data
    
  } catch (error) {
    console.error('❌ Booking error:', error)
    
    if (axios.isAxiosError(error)) {
      const status = error.response?.status
      const message = error.response?.data?.message || 'Error al crear la reserva'
      
      // Logs detallados para debug
      console.error('❌ Status:', status)
      console.error('❌ Response data:', error.response?.data)
      console.error('❌ Request URL:', error.config?.url)
      
      if (status === 404) {
        throw new Error('Endpoint de reservas no encontrado. Verifica las rutas del backend.')
      } else if (status === 401) {
        throw new Error('No autorizado. Verifica tu token de autenticación.')
      } else if (status === 400) {
        throw new Error(`Datos inválidos: ${message}`)
      }
      
      throw new Error(message)
    }
    
    throw error
  }
}

/**
 * Get user's bookings
 */
export const getUserBookings = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/user/bookings`, getAuthHeaders())
    return res.data.bookings || []
  } catch (error) {
    console.error('❌ Error fetching user bookings:', error)
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || 'Error al cargar las reservas'
      throw new Error(message)
    }
    throw error
  }
}

/**
 * Cancel a booking
 */
export const cancelBooking = async (bookingId: string) => {
  try {
    const res = await axios.patch(
      `${API_BASE_URL}/user/bookings/${bookingId}`,
      { status: 'cancelled' },
      getAuthHeaders()
    )
    return res.data.booking || res.data
  } catch (error) {
    console.error('❌ Error cancelling booking:', error)
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || 'Error al cancelar la reserva'
      throw new Error(message)
    }
    throw error
  }
}