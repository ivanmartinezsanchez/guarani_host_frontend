import axios from 'axios'
import { bookingToFormData } from '@/utils/formDataHelpers'

const API_URL = import.meta.env.VITE_API_BASE_URL

// Build auth header from session/local storage tokens
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
    return { headers: {} }
  }

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
}

// ===== TYPES (aligned with backend IBooking) =====

// Booking shape used in host flows
export interface Booking {
  _id?: string
  user:
    | string
    | {
        _id?: string
        firstName?: string
        lastName?: string
        email: string
        phone?: string
      }
  property?:
    | string
    | {
        _id?: string
        title: string
        host?: string
        city?: string
        location?: string
        images?: string[]
        pricePerNight?: number
      }
  tourPackage?:
    | string
    | {
        _id?: string
        title: string
        host?: string
        duration?: number
        price?: number
      }
  checkIn: Date | string
  checkOut: Date | string
  guests: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  totalPrice: number
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  paymentDetails?: string
  paymentImages?: string[]
  cancellationReason?: string
  cancelledAt?: Date | string
  createdAt?: Date | string
  updatedAt?: Date | string
  // Virtual fields
  nights?: number
  pricePerNight?: number
}

// Shape of /host/bookings API response
interface HostBookingsResponse {
  success: boolean
  message: string
  data: {
    bookings: Booking[]
    pagination: {
      current: number
      total: number
      totalCount: number
      hasNext: boolean
      hasPrev: boolean
    }
  }
}

// Shape of /host/bookings/filter response
interface FilteredBookingsResponse {
  success: boolean
  message: string
  data: {
    bookings: Booking[]
    pagination: any
    filters: Record<string, unknown>
  }
}

// Shape of single booking response
interface SingleBookingResponse {
  success: boolean
  message: string
  data: {
    booking: Booking
  }
}

// ===== MAIN API FUNCTIONS =====

/**
 * Get all bookings for the authenticated host
 */
export const getHostBookings = async (): Promise<Booking[]> => {
  const res = await axios.get<HostBookingsResponse>(
    `${API_URL}/host/bookings`,
    getAuthHeaders()
  )

  console.log('RAW RESPONSE /host/bookings:', res.data)

  return res.data?.data?.bookings ?? []
}

/**
 * Get single booking by ID (must belong to host)
 */
export const getHostBookingById = async (id: string): Promise<Booking> => {
  try {
    const res = await axios.get<SingleBookingResponse>(
      `${API_URL}/host/bookings/${id}`,
      getAuthHeaders()
    )
    return res.data?.data?.booking
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        'Error fetching host booking by ID:',
        error.response?.status,
        error.response?.data
      )
    } else {
      console.error('Error fetching host booking by ID:', error)
    }
    throw error
  }
}

/**
 * Update booking status (pending/confirmed/cancelled/completed)
 */
export const updateHostBookingStatus = async (
  bookingId: string,
  status: string,
  reason?: string
): Promise<Booking> => {
  try {
    const updateData: any = { status }
    if (reason) {
      // Backend expects "reason" field
      updateData.reason = reason
    }

    const response = await axios.patch<SingleBookingResponse>(
      `${API_URL}/host/bookings/${bookingId}/status`,
      updateData,
      getAuthHeaders()
    )

    return response.data?.data?.booking
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error(
        'Error updating booking status:',
        error.response?.status,
        error.response?.data
      )
    } else {
      console.error('Error updating booking status:', error)
    }
    throw error
  }
}

/**
 * Update booking payment status (pending/paid/failed/refunded)
 */
export const updateHostBookingPaymentStatus = async (
  bookingId: string,
  paymentStatus: string
): Promise<Booking> => {
  try {
    const response = await axios.patch<SingleBookingResponse>(
      `${API_URL}/host/bookings/${bookingId}/payment-status`,
      { paymentStatus },
      getAuthHeaders()
    )

    return response.data?.data?.booking
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error(
        'Error updating host booking payment status:',
        error.response?.status,
        error.response?.data
      )
    } else {
      console.error('Error updating host booking payment status:', error)
    }
    throw error
  }
}

/**
 * Filter host bookings by status, dates, and type
 */
export const filterHostBookings = async (
  filters: {
    paymentStatus?: string
    bookingStatus?: string
    from?: string
    to?: string
    propertyType?: 'property' | 'tour'
    page?: number
    limit?: number
  } = {}
): Promise<{ bookings: Booking[]; pagination: any }> => {
  try {
    const params = new URLSearchParams()

    // Append only non-empty filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value))
      }
    })

    const res = await axios.get<FilteredBookingsResponse>(
      `${API_URL}/host/bookings/filter?${params.toString()}`,
      getAuthHeaders()
    )

    const apiData = res.data?.data

    return {
      bookings: apiData?.bookings || [],
      pagination: apiData?.pagination || {},
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        'Error filtering host bookings:',
        error.response?.status,
        error.response?.data
      )
    } else {
      console.error('Error filtering host bookings:', error)
    }
    throw error
  }
}

/**
 * Export host bookings to PDF (with optional filters)
 */
export const exportHostBookingsToPDF = async (filters: {
  paymentStatus?: string
  bookingStatus?: string // Backend expects "bookingStatus"
  from?: string
  to?: string
} = {}) => {
  try {
    // Remove empty values from filters
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(
        ([_, value]) => typeof value === 'string' && value.trim() !== ''
      )
    )

    const params = new URLSearchParams(cleanFilters as Record<string, string>).toString()
    const url = `${API_URL}/host/bookings/export/pdf${params ? `?${params}` : ''}`

    const res = await axios.get(url, {
      ...getAuthHeaders(),
      responseType: 'blob',
    })

    // Build a Blob and trigger download
    const blob = new Blob([res.data], { type: 'application/pdf' })
    const downloadUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = downloadUrl

    const now = new Date()
    const dateStr = now.toISOString().split('T')[0]
    link.setAttribute('download', `host-bookings-${dateStr}.pdf`)

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    window.URL.revokeObjectURL(downloadUrl)
  } catch (error) {
    console.error('Error exporting host bookings to PDF:', error)
    throw error
  }
}

/**
 * Get host booking statistics (or calculate fallback)
 */
export const getHostBookingStats = async (period: string = 'all') => {
  try {
    const res = await axios.get(`${API_URL}/host/bookings/summary?period=${period}`, getAuthHeaders())

    // If backend wraps summary in data, use it
    const summary = res.data?.data?.summary ?? res.data?.summary
    return summary
  } catch (error) {
    console.error('Error fetching host booking stats:', error)

    // Fallback: compute stats from raw bookings
    try {
      const bookings = await getHostBookings()

      return {
        totalBookings: bookings.length,
        status: {
          pending: bookings.filter(b => b.status === 'pending').length,
          confirmed: bookings.filter(b => b.status === 'confirmed').length,
          cancelled: bookings.filter(b => b.status === 'cancelled').length,
          completed: bookings.filter(b => b.status === 'completed').length,
        },
        payments: {
          pending: bookings.filter(b => b.paymentStatus === 'pending').length,
          paid: bookings.filter(b => b.paymentStatus === 'paid').length,
          refunded: bookings.filter(b => b.paymentStatus === 'refunded').length,
          failed: bookings.filter(b => b.paymentStatus === 'failed').length,
        },
        revenue: {
          total: bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0),
          paid: bookings
            .filter(b => b.paymentStatus === 'paid')
            .reduce((sum, b) => sum + (b.totalPrice || 0), 0),
          pending: bookings
            .filter(b => b.paymentStatus === 'pending')
            .reduce((sum, b) => sum + (b.totalPrice || 0), 0),
        },
        types: {
          properties: bookings.filter(b => b.property).length,
          tours: bookings.filter(b => b.tourPackage).length,
        },
        thisMonth: bookings.filter(b => {
          const created = new Date(b.createdAt || 0)
          const now = new Date()
          return (
            created.getMonth() === now.getMonth() &&
            created.getFullYear() === now.getFullYear()
          )
        }).length,
        period,
        generatedAt: new Date(),
      }
    } catch (fallbackError) {
      console.error('Error in fallback stats calculation:', fallbackError)
      throw error // Re-throw original error if fallback also fails
    }
  }
}

// ===== UTILITY HELPERS =====

/**
 * Get service title (property or tour)
 */
export const getBookingServiceTitle = (booking: Booking): string => {
  if (booking.tourPackage) {
    if (typeof booking.tourPackage === 'object') {
      return booking.tourPackage.title || 'Tour sin título'
    }
    return `Tour ID: ${booking.tourPackage}`
  }

  if (booking.property) {
    if (typeof booking.property === 'object') {
      return booking.property.title || 'Propiedad sin título'
    }
    return `Propiedad ID: ${booking.property}`
  }

  return 'Servicio no especificado'
}

/**
 * Get service type: property / tour / unknown
 */
export const getBookingServiceType = (booking: Booking): 'property' | 'tour' | 'unknown' => {
  if (booking.tourPackage) return 'tour'
  if (booking.property) return 'property'
  return 'unknown'
}

/**
 * Calculate booking duration (days & nights)
 */
export const calculateBookingDuration = (
  booking: Booking
): { days: number; nights: number } => {
  try {
    const checkIn = new Date(booking.checkIn)
    const checkOut = new Date(booking.checkOut)
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime())
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    const nights = Math.max(0, days - 1) // nights = days - 1

    return { days, nights }
  } catch (error) {
    console.error('Error calculating booking duration:', error)
    return { days: 0, nights: 0 }
  }
}

/**
 * Check if host can modify booking (status-based)
 */
export const canModifyBooking = (booking: Booking): boolean => {
  // Host cannot modify completed/cancelled bookings
  return !['completed', 'cancelled'].includes(booking.status)
}

/**
 * Check if host can update payment status
 */
export const canUpdatePaymentStatus = (booking: Booking): boolean => {
  // Payment cannot be changed once refunded
  return booking.paymentStatus !== 'refunded'
}
