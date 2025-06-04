import axios from 'axios'

/**
 * Admin/Host tour management service - Requires authentication
 * Used in: AdminTourManagement, HostTourManagement
 */

const ADMIN_API_URL = `${import.meta.env.VITE_API_BASE_URL}/admin`
const HOST_API_URL = `${import.meta.env.VITE_API_BASE_URL}/host`

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
 * Tour interface - Updated to match backend model exactly
 */
export interface Tour {
  _id?: string
  title: string
  description: string
  price: number
  duration?: number                    
  maxCapacity?: number                   
  location?: string                    
  amenities?: string[]                 
  status: 'available' | 'sold_out' | 'cancelled' | 'upcoming'
  imageUrls: string[]
  host: string | { 
    _id: string
    firstName: string
    lastName: string
    email?: string
    role?: string
  }
  // Note: paymentStatus and paymentDetails are frontend-only fields
  paymentStatus?: 'pending' | 'paid' | 'failed' | 'refunded'
  paymentDetails?: string
  createdAt?: string
  updatedAt?: string
}

/**
 * Get current user info and determine if admin
 */
const getUserInfo = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  return {
    user,
    isAdmin: user.role === 'admin',
    isHost: user.role === 'host'
  }
}

/**
 * Fetch all tour packages (admin gets all, host gets only their own)
 */
export const getTours = async (): Promise<Tour[]> => {
  try {
    const { isAdmin, isHost } = getUserInfo()
    
    if (!isAdmin && !isHost) {
      throw new Error('Unauthorized: Must be admin or host')
    }
    
    const endpoint = isAdmin ? `${ADMIN_API_URL}/tour-packages` : `${HOST_API_URL}/tours`
    
    console.log(`📋 Fetching tours from: ${endpoint}`)
    console.log(`👤 User type: ${isAdmin ? 'Admin' : 'Host'}`)
    
    const res = await axios.get(endpoint, getAuthHeaders())
    
    // Backend responses:
    // Admin: { message: string, tourPackages: Tour[], pagination: {...} }
    // Host: { message: string, tours: Tour[], total: number }
    const tours = res.data.tourPackages || res.data.tours || res.data || []
    
    console.log(`✅ Fetched ${tours.length} tours successfully`)
    return tours
    
  } catch (error) {
    console.error('❌ Error fetching tours:', error)
    
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || 'No se pudieron cargar los tours'
      throw new Error(message)
    }
    
    throw new Error('No se pudieron cargar los tours')
  }
}

/**
 * Create a new tour package (admin or host)
 */
export const createTour = async (formData: FormData): Promise<Tour> => {
  try {
    const { isAdmin, isHost } = getUserInfo()
    
    if (!isAdmin && !isHost) {
      throw new Error('Unauthorized: Must be admin or host')
    }
    
    const endpoint = isAdmin
      ? `${ADMIN_API_URL}/tour-packages`
      : `${HOST_API_URL}/tours`
    
    console.log(`➕ Creating tour at: ${endpoint}`)
    console.log(`👤 User type: ${isAdmin ? 'Admin' : 'Host'}`)
    
    const res = await axios.post(endpoint, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'multipart/form-data',
      },
    })
    
    const tour = res.data.tour || res.data.tourPackage || res.data
    
    if (!tour) {
      throw new Error('No se recibió información del tour creado')
    }
    
    console.log(`✅ Tour created successfully: ${tour._id}`)
    return tour
    
  } catch (error) {
    console.error('❌ Error creating tour:', error)
    
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || 'No se pudo crear el tour'
      const errors = error.response?.data?.errors
      
      if (errors && Array.isArray(errors)) {
        throw new Error(`${message}: ${errors.join(', ')}`)
      }
      
      throw new Error(message)
    }
    
    throw new Error('No se pudo crear el tour')
  }
}

/**
 * Update an existing tour package by ID
 */
export const updateTour = async (id: string, formData: FormData): Promise<Tour> => {
  try {
    const { isAdmin, isHost } = getUserInfo()
    
    if (!isAdmin && !isHost) {
      throw new Error('Unauthorized: Must be admin or host')
    }
    
    const endpoint = isAdmin
      ? `${ADMIN_API_URL}/tour-packages/${id}`
      : `${HOST_API_URL}/tours/${id}`
    
    console.log(`🔄 Updating tour at: ${endpoint}`)
    console.log(`👤 User type: ${isAdmin ? 'Admin' : 'Host'}`)
    
    const res = await axios.patch(endpoint, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'multipart/form-data',
      },
    })
    
    const tour = res.data.tour || res.data.tourPackage || res.data
    
    if (!tour) {
      throw new Error('No se recibió información del tour actualizado')
    }
    
    console.log(`✅ Tour updated successfully: ${tour._id}`)
    return tour
    
  } catch (error) {
    console.error('❌ Error updating tour:', error)
    
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || 'No se pudo actualizar el tour'
      const errors = error.response?.data?.errors
      
      if (errors && Array.isArray(errors)) {
        throw new Error(`${message}: ${errors.join(', ')}`)
      }
      
      throw new Error(message)
    }
    
    throw new Error('No se pudo actualizar el tour')
  }
}

/**
 * Delete a tour package by ID
 */
export const deleteTour = async (id: string): Promise<void> => {
  try {
    const { isAdmin, isHost } = getUserInfo()
    
    if (!isAdmin && !isHost) {
      throw new Error('Unauthorized: Must be admin or host')
    }
    
    const endpoint = isAdmin
      ? `${ADMIN_API_URL}/tour-packages/${id}`
      : `${HOST_API_URL}/tours/${id}`
    
    console.log(`🗑️ Deleting tour at: ${endpoint}`)
    console.log(`👤 User type: ${isAdmin ? 'Admin' : 'Host'}`)
    
    await axios.delete(endpoint, getAuthHeaders())
    
    console.log(`✅ Tour deleted successfully: ${id}`)
    
  } catch (error) {
    console.error('❌ Error deleting tour:', error)
    
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || 'No se pudo eliminar el tour'
      throw new Error(message)
    }
    
    throw new Error('No se pudo eliminar el tour')
  }
}

/**
 * Get tour by ID for editing (admin/host only)
 * Currently searches through all tours since individual get endpoints aren't implemented
 */
export const getTourById = async (id: string): Promise<Tour | null> => {
  try {
    console.log(`🔍 Fetching tour by ID: ${id}`)
    
    // Get all tours and find the specific one
    const tours = await getTours()
    const tour = tours.find(tour => tour._id === id)
    
    if (tour) {
      console.log(`✅ Found tour: ${tour.title}`)
      return tour
    }
    
    console.log(`❌ Tour with ID ${id} not found`)
    return null
    
  } catch (error) {
    console.error('❌ Error fetching tour by ID:', error)
    return null
  }
}