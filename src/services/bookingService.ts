import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

/**
 * Returns axios config with Authorization header using JWT token.
 * The token is looked up first in sessionStorage and then in localStorage
 * to stay compatible with the current auth strategy.
 */
const getAuthHeaders = () => {
  const tokenFromSession =
    sessionStorage.getItem('token') ||
    sessionStorage.getItem('accessToken') ||
    sessionStorage.getItem('authToken')

  const tokenFromLocal =
    localStorage.getItem('token') ||
    localStorage.getItem('accessToken') ||
    localStorage.getItem('authToken')

  const token = tokenFromSession || tokenFromLocal

  if (!token) {
    console.warn('⚠️ No authentication token found in sessionStorage/localStorage')
    return { headers: {} as Record<string, string> }
  }

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
}

/**
 * Booking payload used when creating a new booking.
 * It supports both property bookings and tour bookings.
 */
export interface BookingData {
  user: string
  property?: string      // For property bookings
  tourPackage?: string   // For tour / experience bookings
  checkIn: Date
  checkOut: Date
  guests: number
  status: 'pending' | 'confirmed' | 'cancelled'
  totalPrice: number
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
}

/**
 * Creates a new booking (requires authentication).
 * This function is used from both property detail and tour detail views.
 */
export const createBooking = async (bookingData: BookingData) => {
  try {
    // ✅ Use the same auth helper that checks sessionStorage + localStorage
    const authConfig = getAuthHeaders()
    const authHeader = (authConfig.headers as any)?.Authorization

    // If there is no Authorization header, the user is not authenticated
    if (!authHeader) {
      throw new Error('Usuario no autenticado')
    }

    // Convert Date objects to ISO strings before sending them to the backend
    const dataToSend = {
      ...bookingData,
      checkIn: bookingData.checkIn.toISOString(),
      checkOut: bookingData.checkOut.toISOString(),
    }

    const endpoint = `${API_BASE_URL}/bookings`
    console.log(`🔄 Creating booking at: ${endpoint}`)

    const res = await axios.post(endpoint, dataToSend, authConfig)

    // Normalize possible response shapes
    return res.data.booking || res.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status
      const message =
        error.response?.data?.message || 'Error al crear la reserva'

      if (status === 404) {
        throw new Error(
          'Endpoint de reservas no encontrado. Verifica las rutas del backend.'
        )
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
 * Fetches bookings that belong to the currently authenticated user.
 */
export const getUserBookings = async () => {
  try {
    const res = await axios.get(
      `${API_BASE_URL}/user/bookings`,
      getAuthHeaders()
    )
    return res.data.bookings || []
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message || 'Error al cargar las reservas'
      throw new Error(message)
    }
    throw error
  }
}

/**
 * Cancels a booking that belongs to the current user.
 * Only the booking status is updated to "cancelled".
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
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message || 'Error al cancelar la reserva'
      throw new Error(message)
    }
    throw error
  }
}
