import axios from 'axios'

/**
 * Host tour management service - Host-specific authentication
 * Used in: HostTourManagement
 */

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
 * Tour interface - matches your backend model
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
  createdAt?: string
  updatedAt?: string
}

/**
 * Fetch all host's tour packages
 */
export const getHostTours = async (): Promise<Tour[]> => {
  try {
    console.log(`📋 Fetching host tours from: ${HOST_API_URL}/tours`)
    
    const res = await axios.get(`${HOST_API_URL}/tours`, getAuthHeaders())
    
    // Backend response: { message: string, tours: Tour[], total: number }
    const tours = res.data.tours || res.data || []
    
    console.log(`✅ Fetched ${tours.length} host tours successfully`)
    return tours
    
  } catch (error) {
    console.error('❌ Error fetching host tours:', error)
    
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || 'No se pudieron cargar los tours'
      throw new Error(message)
    }
    
    throw new Error('No se pudieron cargar los tours')
  }
}

/**
 * Create a new tour package
 */
export const createHostTour = async (formData: FormData): Promise<Tour> => {
  try {
    console.log(`➕ Creating host tour at: ${HOST_API_URL}/tours`)
    
    const res = await axios.post(`${HOST_API_URL}/tours`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'multipart/form-data',
      },
    })
    
    const tour = res.data.tour || res.data
    
    if (!tour) {
      throw new Error('No se recibió información del tour creado')
    }
    
    console.log(`✅ Host tour created successfully: ${tour._id}`)
    return tour
    
  } catch (error) {
    console.error('❌ Error creating host tour:', error)
    
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
export const updateHostTour = async (id: string, formData: FormData): Promise<Tour> => {
  try {
    console.log(`🔄 Updating host tour at: ${HOST_API_URL}/tours/${id}`)
    
    const res = await axios.patch(`${HOST_API_URL}/tours/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'multipart/form-data',
      },
    })
    
    const tour = res.data.tour || res.data
    
    if (!tour) {
      throw new Error('No se recibió información del tour actualizado')
    }
    
    console.log(`✅ Host tour updated successfully: ${tour._id}`)
    return tour
    
  } catch (error) {
    console.error('❌ Error updating host tour:', error)
    
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || 'No se pudo actualizar el tour'
      throw new Error(message)
    }
    
    throw new Error('No se pudo actualizar el tour')
  }
}

/**
 * Delete a tour package by ID
 */
export const deleteHostTour = async (id: string): Promise<void> => {
  try {
    console.log(`🗑️ Deleting host tour at: ${HOST_API_URL}/tours/${id}`)
    
    await axios.delete(`${HOST_API_URL}/tours/${id}`, getAuthHeaders())
    
    console.log(`✅ Host tour deleted successfully: ${id}`)
    
  } catch (error) {
    console.error('❌ Error deleting host tour:', error)
    
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || 'No se pudo eliminar el tour'
      throw new Error(message)
    }
    
    throw new Error('No se pudo eliminar el tour')
  }
}