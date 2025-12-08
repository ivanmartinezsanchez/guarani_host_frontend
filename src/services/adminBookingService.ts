import axios from 'axios'

/**
 * Base API URL for backend requests.
 */
const API_URL = import.meta.env.VITE_API_BASE_URL

/**
 * Returns axios config with Authorization header using JWT from storage.
 * Priority: sessionStorage (current auth strategy), then localStorage (fallback).
 */
const getAuthHeaders = () => {
  // Try sessionStorage first (preferred)
  const tokenFromSession =
    sessionStorage.getItem('token') ||
    sessionStorage.getItem('accessToken') ||
    sessionStorage.getItem('authToken')

  // Fallback to localStorage for backward compatibility
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
 * Booking interface used for admin operations.
 * Contains extended information compared to user/host views.
 */
export interface AdminBooking {
  _id?: string
  user:
    | {
        _id: string
        firstName: string
        lastName: string
        email: string
        phone?: string
      }
    | string
  property?:
    | {
        _id: string
        title: string
        city: string
        location?: string
        pricePerNight?: number
        host?: string
      }
    | string
  tourPackage?:
    | {
        _id: string
        title: string
        duration?: number
        price?: number
        host?: string
      }
    | string
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
 * Aggregated booking statistics for the admin dashboard.
 */
export interface AdminBookingStats {
  total: number
  pending: number
  confirmed: number
  cancelled: number
  completed: number
  totalRevenue: number
  pendingPayments: number
  paidBookings: number
  properties: number
  tours: number
}

/**
 * Normalizes different possible backend response shapes
 * into a consistent AdminBooking[] array.
 */
const extractBookingsArray = (data: any): AdminBooking[] => {
  if (data?.data?.bookings && Array.isArray(data.data.bookings)) {
    return data.data.bookings
  }
  if (data?.bookings && Array.isArray(data.bookings)) {
    return data.bookings
  }
  if (Array.isArray(data?.data)) {
    return data.data
  }
  if (Array.isArray(data)) {
    return data
  }
  console.warn('⚠️ Unexpected bookings response structure:', data)
  return []
}

/**
 * Normalizes different possible backend response shapes
 * into a single AdminBooking object.
 */
const extractSingleBooking = (data: any): AdminBooking => {
  return (data?.data?.booking || data?.booking || data) as AdminBooking
}

/**
 * Fetches all bookings in the system (admin only).
 */
export const getAllBookingsForAdmin = async (): Promise<AdminBooking[]> => {
  const res = await axios.get(`${API_URL}/admin/bookings`, getAuthHeaders())
  return extractBookingsArray(res.data)
}

/**
 * Updates any booking (admin has full control).
 * Allows changing status, payment status and dates.
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
  const res = await axios.patch(
    `${API_URL}/admin/bookings/${id}`,
    updates,
    getAuthHeaders()
  )
  return extractSingleBooking(res.data)
}

/**
 * Updates only the payment status of a booking (admin only).
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
  return extractSingleBooking(res.data)
}

/**
 * Deletes any booking (admin only).
 */
export const deleteBookingByAdmin = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/admin/bookings/${id}`, getAuthHeaders())
}

/**
 * Filters bookings by a date range (admin only).
 * Dates should be ISO strings or YYYY-MM-DD.
 */
export const filterBookingsByDateRange = async (
  from: string,
  to: string
): Promise<AdminBooking[]> => {
  const res = await axios.get(
    `${API_URL}/admin/bookings/filter/date?from=${from}&to=${to}`,
    getAuthHeaders()
  )
  return extractBookingsArray(res.data)
}

/**
 * Filters bookings by booking status and/or payment status (admin only).
 */
export const filterBookingsByStatus = async (
  status?: string,
  paymentStatus?: string
): Promise<AdminBooking[]> => {
  const params = new URLSearchParams()
  if (status) params.append('status', status)
  if (paymentStatus) params.append('paymentStatus', paymentStatus)

  const res = await axios.get(
    `${API_URL}/admin/bookings/filter/status?${params.toString()}`,
    getAuthHeaders()
  )
  return extractBookingsArray(res.data)
}

/**
 * Filters bookings by type: 'property' or 'tour' (admin only).
 */
export const filterBookingsByType = async (
  type: 'property' | 'tour'
): Promise<AdminBooking[]> => {
  const res = await axios.get(
    `${API_URL}/admin/bookings/filter/type?type=${type}`,
    getAuthHeaders()
  )
  return extractBookingsArray(res.data)
}

/**
 * Exports admin bookings as a PDF file using filters.
 * Requires a backend endpoint that returns a PDF (blob) response.
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

  const res = await axios.get(
    `${API_URL}/admin/bookings/export/pdf?${params.toString()}`,
    {
      ...getAuthHeaders(),
      responseType: 'blob',
    }
  )

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
 * Fetches booking statistics for the admin dashboard.
 * If the backend endpoint is not available, statistics are computed locally
 * using the full list of bookings.
 */
export const getBookingStats = async (): Promise<AdminBookingStats> => {
  try {
    const res = await axios.get(
      `${API_URL}/admin/bookings/stats`,
      getAuthHeaders()
    )

    const stats =
      res.data?.data?.stats || res.data?.stats || (res.data as AdminBookingStats)

    return stats
  } catch (error) {
    console.warn(
      '⚠️ Failed to fetch stats from backend. Falling back to local calculation.',
      error
    )

    const bookings = await getAllBookingsForAdmin()

    const stats: AdminBookingStats = {
      total: bookings.length,
      pending: bookings.filter((b) => b.status === 'pending').length,
      confirmed: bookings.filter((b) => b.status === 'confirmed').length,
      cancelled: bookings.filter((b) => b.status === 'cancelled').length,
      completed: bookings.filter((b) => b.status === 'completed').length,
      totalRevenue: bookings
        .filter((b) => b.paymentStatus === 'paid')
        .reduce((sum, b) => sum + (b.totalPrice || 0), 0),
      pendingPayments: bookings.filter(
        (b) => b.paymentStatus === 'pending'
      ).length,
      paidBookings: bookings.filter((b) => b.paymentStatus === 'paid').length,
      properties: bookings.filter((b) => !!b.property).length,
      tours: bookings.filter((b) => !!b.tourPackage).length,
    }

    return stats
  }
}
