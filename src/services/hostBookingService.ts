import axios from 'axios'
import { bookingToFormData } from '@/utils/formDataHelpers'

const API_URL = import.meta.env.VITE_API_BASE_URL

const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
}

// ===== INTERFACES CORREGIDAS SEGÚN EL BACKEND =====

/**
 * Booking interface for host operations
 * Basada en el modelo IBooking del backend
 */
export interface Booking {
  _id?: string;
  user: string | { 
    _id?: string;
    firstName?: string;
    lastName?: string;
    email: string;
    phone?: string;
  };
  property?: string | { 
    _id?: string;
    title: string; 
    host?: string;
    city?: string;
    location?: string;
    images?: string[];
    pricePerNight?: number;
  };
  tourPackage?: string | { 
    _id?: string;
    title: string; 
    host?: string;
    duration?: number; // ✅ Esta propiedad existe en el backend
    price?: number;
  };
  checkIn: Date | string;
  checkOut: Date | string;
  guests: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  totalPrice: number; // ✅ Backend usa totalPrice, no totalAmount
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentDetails?: string;
  paymentImages?: string[];
  cancellationReason?: string;
  cancelledAt?: Date | string;
  createdAt?: Date | string; // ✅ Existe por timestamps: true
  updatedAt?: Date | string; // ✅ Existe por timestamps: true
  // Virtual properties del backend
  nights?: number;
  pricePerNight?: number;
}

// ===== FUNCIONES PRINCIPALES =====

/**
 * Get bookings for properties and tours owned by the authenticated host
 * @returns Array of bookings for host's properties and tours
 */
export const getHostBookings = async (): Promise<Booking[]> => {
  try {
    const res = await axios.get(`${API_URL}/host/bookings`, getAuthHeaders())
    return res.data.bookings || []
  } catch (error) {
    console.error('Error fetching host bookings:', error)
    throw error
  }
}

/**
 * Get single booking by ID (must belong to host's property/tour)
 * @param id - Booking ID
 * @returns Single booking object
 */
export const getHostBookingById = async (id: string): Promise<Booking> => {
  try {
    const res = await axios.get(`${API_URL}/host/bookings/${id}`, getAuthHeaders())
    return res.data.booking
  } catch (error) {
    console.error('Error fetching host booking by ID:', error)
    throw error
  }
}

/**
 * Update booking status
 * ✅ FUNCIÓN QUE FALTABA - Corregida según el backend
 * @param bookingId - ID of booking to update
 * @param status - New status value
 * @param reason - Optional reason for status change
 * @returns Updated booking object
 */
export const updateHostBookingStatus = async (
  bookingId: string, 
  status: string,
  reason?: string
): Promise<Booking> => {
  try {
    const updateData: any = { status }
    if (reason) {
      updateData.reason = reason // Backend espera 'reason', no 'statusReason'
    }

    const response = await axios.patch(
      `${API_URL}/host/bookings/${bookingId}/status`, 
      updateData, 
      getAuthHeaders()
    )
    return response.data.booking
  } catch (error) {
    console.error('Error updating host booking status:', error)
    throw error
  }
}

/**
 * Update payment status
 * ✅ FUNCIÓN QUE FALTABA - Según el backend
 * @param bookingId - ID of booking to update
 * @param paymentStatus - New payment status
 * @returns Updated booking object
 */
export const updateHostBookingPaymentStatus = async (
  bookingId: string, 
  paymentStatus: string
): Promise<Booking> => {
  try {
    const response = await axios.patch(
      `${API_URL}/host/bookings/${bookingId}/payment-status`, 
      { paymentStatus }, 
      getAuthHeaders()
    )
    return response.data.booking
  } catch (error) {
    console.error('Error updating host booking payment status:', error)
    throw error
  }
}

/**
 * Filter host bookings by various criteria
 * @param filters - Filter options
 * @returns Filtered bookings array
 */
export const filterHostBookings = async (filters: {
  paymentStatus?: string;
  bookingStatus?: string;
  from?: string;
  to?: string;
  propertyType?: 'property' | 'tour';
  page?: number;
  limit?: number;
} = {}): Promise<{ bookings: Booking[]; pagination: any }> => {
  try {
    const params = new URLSearchParams()
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value))
      }
    })

    const res = await axios.get(
      `${API_URL}/host/bookings/filter?${params.toString()}`, 
      getAuthHeaders()
    )
    
    return {
      bookings: res.data.bookings || [],
      pagination: res.data.pagination || {}
    }
  } catch (error) {
    console.error('Error filtering host bookings:', error)
    throw error
  }
}

/**
 * Export host bookings to PDF with optional filters
 * ✅ CORREGIDA según el endpoint del backend
 * @param filters - Optional filters for export
 */
export const exportHostBookingsToPDF = async (filters: { 
  paymentStatus?: string;
  bookingStatus?: string; // Corregido: backend usa 'bookingStatus'
  from?: string;
  to?: string;
} = {}) => {
  try {
    // Clean up filters - remove empty values
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value && value.trim() !== '')
    )
    
    const params = new URLSearchParams(cleanFilters).toString()
    const url = `${API_URL}/host/bookings/export/pdf${params ? `?${params}` : ''}`
    
    const res = await axios.get(url, {
      ...getAuthHeaders(),
      responseType: 'blob',
    })

    // Create download link
    const blob = new Blob([res.data], { type: 'application/pdf' })
    const downloadUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = downloadUrl
    
    // Generate filename with current date
    const now = new Date()
    const dateStr = now.toISOString().split('T')[0]
    link.setAttribute('download', `host-bookings-${dateStr}.pdf`)
    
    // Trigger download
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    // Clean up URL object
    window.URL.revokeObjectURL(downloadUrl)
  } catch (error) {
    console.error('Error exporting host bookings to PDF:', error)
    throw error
  }
}

/**
 * Get host booking summary/statistics
 * @param period - Time period for summary
 * @returns Statistics object with booking metrics
 */
export const getHostBookingStats = async (period: string = 'all') => {
  try {
    const res = await axios.get(
      `${API_URL}/host/bookings/summary?period=${period}`, 
      getAuthHeaders()
    )
    return res.data.summary
  } catch (error) {
    console.error('Error fetching host booking stats:', error)
    
    // Fallback: calculate from all bookings if stats endpoint fails
    try {
      const bookings = await getHostBookings()
      
      return {
        totalBookings: bookings.length,
        status: {
          pending: bookings.filter(b => b.status === 'pending').length,
          confirmed: bookings.filter(b => b.status === 'confirmed').length,
          cancelled: bookings.filter(b => b.status === 'cancelled').length,
          completed: bookings.filter(b => b.status === 'completed').length
        },
        payments: {
          pending: bookings.filter(b => b.paymentStatus === 'pending').length,
          paid: bookings.filter(b => b.paymentStatus === 'paid').length,
          refunded: bookings.filter(b => b.paymentStatus === 'refunded').length,
          failed: bookings.filter(b => b.paymentStatus === 'failed').length
        },
        revenue: {
          total: bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0),
          paid: bookings
            .filter(b => b.paymentStatus === 'paid')
            .reduce((sum, b) => sum + (b.totalPrice || 0), 0),
          pending: bookings
            .filter(b => b.paymentStatus === 'pending')
            .reduce((sum, b) => sum + (b.totalPrice || 0), 0)
        },
        types: {
          properties: bookings.filter(b => b.property).length,
          tours: bookings.filter(b => b.tourPackage).length
        },
        thisMonth: bookings.filter(b => {
          const created = new Date(b.createdAt || 0)
          const now = new Date()
          return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear()
        }).length,
        period,
        generatedAt: new Date()
      }
    } catch (fallbackError) {
      console.error('Error in fallback stats calculation:', fallbackError)
      throw error // Throw original error if fallback fails
    }
  }
}

// ===== UTILITY FUNCTIONS =====

/**
 * Get booking service title (property or tour title)
 * @param booking - Booking object
 * @returns Service title or fallback text
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
 * Get booking service type
 * @param booking - Booking object
 * @returns 'property', 'tour', or 'unknown'
 */
export const getBookingServiceType = (booking: Booking): 'property' | 'tour' | 'unknown' => {
  if (booking.tourPackage) return 'tour'
  if (booking.property) return 'property'
  return 'unknown'
}

/**
 * Calculate booking duration in days/nights
 * @param booking - Booking object
 * @returns Object with days and nights count
 */
export const calculateBookingDuration = (booking: Booking): { days: number; nights: number } => {
  try {
    const checkIn = new Date(booking.checkIn)
    const checkOut = new Date(booking.checkOut)
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime())
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    const nights = Math.max(0, days - 1) // nights is always days - 1
    
    return { days, nights }
  } catch (error) {
    console.error('Error calculating booking duration:', error)
    return { days: 0, nights: 0 }
  }
}

/**
 * Check if booking can be modified by host
 * @param booking - Booking object
 * @returns Boolean indicating if booking can be modified
 */
export const canModifyBooking = (booking: Booking): boolean => {
  // Hosts can typically modify bookings that aren't completed or cancelled
  return !['completed', 'cancelled'].includes(booking.status)
}

/**
 * Check if booking payment status can be updated by host
 * @param booking - Booking object
 * @returns Boolean indicating if payment status can be updated
 */
export const canUpdatePaymentStatus = (booking: Booking): boolean => {
  // Hosts can update payment status for non-refunded bookings
  return booking.paymentStatus !== 'refunded'
}