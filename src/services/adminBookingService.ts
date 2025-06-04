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

// Booking interface for admin operations (más completa que host/user)
export interface AdminBooking {
  _id?: string
  user: { 
    _id: string
    firstName: string
    lastName: string
    email: string
    phone?: string
  } | string
  property?: { 
    _id: string
    title: string
    city: string
    location?: string
    pricePerNight?: number
    host?: string
  } | string
  tourPackage?: { 
    _id: string
    title: string
    duration?: number
    price?: number
    host?: string
  } | string
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
}

/**
 * Get all bookings in the system (admin only)
 */
export const getAllBookingsForAdmin = async (): Promise<AdminBooking[]> => {
  const res = await axios.get(`${API_URL}/admin/bookings`, getAuthHeaders())
  return res.data.data.bookings || []
}

/**
 * Update any booking (admin has full control)
 */
export const updateBookingByAdmin = async (
  id: string, 
  updates: {
    status?: string
    paymentStatus?: string
    checkIn?: string
    checkOut?: string
  }
): Promise<AdminBooking> => {
  const res = await axios.patch(`${API_URL}/admin/bookings/${id}`, updates, getAuthHeaders())
  return res.data.booking
}

/**
 * Update only payment status of any booking (admin only)
 */
export const updateBookingPaymentStatusAdmin = async (
  id: string, 
  paymentStatus: string
): Promise<AdminBooking> => {
  const res = await axios.patch(
    `${API_URL}/admin/bookings/${id}/payment-status`, 
    { paymentStatus }, 
    getAuthHeaders()
  )
  return res.data.booking
}

/**
 * Delete any booking (admin only)
 */
export const deleteBookingByAdmin = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/admin/bookings/${id}`, getAuthHeaders())
}

/**
 * Filter bookings by date range (admin only)
 */
export const filterBookingsByDateRange = async (
  from: string, 
  to: string
): Promise<AdminBooking[]> => {
  const res = await axios.get(
    `${API_URL}/admin/bookings/filter/date?from=${from}&to=${to}`, 
    getAuthHeaders()
  )
  return res.data.bookings
}

/**
 * Filter bookings by status (admin only)
 */
export const filterBookingsByStatus = async (
  status?: string, 
  paymentStatus?: string
): Promise<AdminBooking[]> => {
  const params = new URLSearchParams()
  if (status) params.append('status', status)
  if (paymentStatus) params.append('paymentStatus', paymentStatus)
  
  const res = await axios.get(
    `${API_URL}/admin/bookings/filter/status?${params}`, 
    getAuthHeaders()
  )
  return res.data.bookings
}

/**
 * Filter bookings by type: property or tour (admin only)
 */
export const filterBookingsByType = async (
  type: 'property' | 'tour'
): Promise<AdminBooking[]> => {
  const res = await axios.get(
    `${API_URL}/admin/bookings/filter/type?type=${type}`, 
    getAuthHeaders()
  )
  return res.data.bookings
}

/**
 * Export admin bookings to PDF (you'll need to implement this endpoint)
 * Based on the pattern from host service
 */
export const exportAdminBookingsToPDF = async (filters: { 
  status?: string
  paymentStatus?: string
  from?: string
  to?: string
  type?: string
}) => {
  const params = new URLSearchParams()
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.append(key, value)
  })
  
  const res = await axios.get(`${API_URL}/admin/bookings/export/pdf?${params}`, {
    ...getAuthHeaders(),
    responseType: 'blob',
  })
  
  const url = window.URL.createObjectURL(new Blob([res.data]))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', `admin-bookings-${Date.now()}.pdf`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

/**
 * Get booking statistics (admin dashboard)
 * You might want to implement this endpoint in your backend
 */
export const getBookingStats = async () => {
  try {
    const res = await axios.get(`${API_URL}/admin/bookings/stats`, getAuthHeaders())
    return res.data.stats
  } catch (error) {
    // Fallback: calculate from all bookings
    const bookings = await getAllBookingsForAdmin()
    
    return {
      total: bookings.length,
      pending: bookings.filter(b => b.status === 'pending').length,
      confirmed: bookings.filter(b => b.status === 'confirmed').length,
      cancelled: bookings.filter(b => b.status === 'cancelled').length,
      completed: bookings.filter(b => b.status === 'completed').length,
      totalRevenue: bookings
        .filter(b => b.paymentStatus === 'paid')
        .reduce((sum, b) => sum + (b.totalPrice || 0), 0),
      pendingPayments: bookings.filter(b => b.paymentStatus === 'pending').length,
      paidBookings: bookings.filter(b => b.paymentStatus === 'paid').length,
      properties: bookings.filter(b => b.property).length,
      tours: bookings.filter(b => b.tourPackage).length
    }
  }
}