import axios from 'axios'

/**
 * Admin/Host property management service - Requires authentication
 * Used in: AdminPropertyManagement, HostPropertyManagement
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
 * Property status enum aligned with backend
 */
export type PropertyStatus = 'AVAILABLE' | 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE'

/**
 * Property interface for admin/host management
 */
export interface Property {
  _id?: string
  title: string
  description?: string
  address: string
  city: string
  state?: string
  country?: string
  postalCode?: string
  latitude?: number
  longitude?: number
  pricePerNight: number
  guests: number
  bedrooms?: number
  bathrooms?: number
  amenities?: string[]
  status: PropertyStatus
  imageUrls: string[]
  host: string | {
    _id: string
    firstName: string
    lastName: string
    email: string
  }
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
    isAdmin: user.role === 'admin'
  }
}

/**
 * Retrieves all properties for admin/host management
 */
export const getProperties = async (): Promise<Property[]> => {
  try {
    const { isAdmin } = getUserInfo()
    const endpoint = isAdmin ? `${ADMIN_API_URL}/properties` : `${HOST_API_URL}/properties`
    
    const res = await axios.get(endpoint, getAuthHeaders())
    
    console.log('✅ getProperties response:', res.data)
    return res.data.properties || res.data || []
  } catch (error) {
    console.error('❌ Error fetching properties:', error)
    throw new Error('No se pudieron cargar las propiedades')
  }
}

/**
 * Creates a new property (admin creates for a host, host creates for themselves)
 */
export const createProperty = async (formData: FormData): Promise<Property> => {
  try {
    const { isAdmin } = getUserInfo()
    const endpoint = isAdmin ? `${ADMIN_API_URL}/properties` : `${HOST_API_URL}/properties`
    
    console.log('🚀 Creating property with FormData')
    console.log('🎯 Endpoint:', endpoint)
    console.log('👤 Is Admin:', isAdmin)
    
    // Log FormData contents para debugging - sin usar entries()
    console.log('📦 FormData being sent to server')
    
    const res = await axios.post(endpoint, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'multipart/form-data',
      },
    })
    
    console.log('✅ createProperty response:', res.data)
    return res.data.property || res.data
  } catch (error: any) {
    console.error('❌ Error creating property:', error)
    
    // Información detallada del error
    if (error.response) {
      console.error('📋 Response status:', error.response.status)
      console.error('📋 Response headers:', error.response.headers)
      console.error('📋 Response data:', error.response.data)
      
      // Mostrar mensaje específico del servidor si existe
      const serverMessage = error.response.data?.message || error.response.data?.error
      if (serverMessage) {
        console.error('🔴 Server message:', serverMessage)
        throw new Error(`Error del servidor: ${serverMessage}`)
      }
    } else if (error.request) {
      console.error('📋 Request made but no response:', error.request)
      throw new Error('No se recibió respuesta del servidor')
    } else {
      console.error('📋 Error setting up request:', error.message)
    }
    
    throw new Error('No se pudo crear la propiedad')
  }
}
/**
 * Updates an existing property
 */
export const updateProperty = async (id: string, formData: FormData): Promise<Property> => {
  try {
    const { isAdmin } = getUserInfo()
    const endpoint = isAdmin 
      ? `${ADMIN_API_URL}/properties/${id}` 
      : `${HOST_API_URL}/properties/${id}`
    
    console.log('🔄 Updating property with ID:', id)
    
    const res = await axios.patch(endpoint, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'multipart/form-data',
      },
    })
    
    console.log('✅ updateProperty response:', res.data)
    return res.data.property || res.data
  } catch (error) {
    console.error('❌ Error updating property:', error)
    throw new Error('No se pudo actualizar la propiedad')
  }
}

/**
 * Deletes a property by ID
 */
export const deleteProperty = async (id: string): Promise<void> => {
  try {
    const { isAdmin } = getUserInfo()
    const endpoint = isAdmin 
      ? `${ADMIN_API_URL}/properties/${id}` 
      : `${HOST_API_URL}/properties/${id}`
    
    console.log('🗑️ Deleting property with ID:', id)
    
    await axios.delete(endpoint, getAuthHeaders())
    
    console.log('✅ Property deleted successfully')
  } catch (error) {
    console.error('❌ Error deleting property:', error)
    throw new Error('No se pudo eliminar la propiedad')
  }
}

/**
 * Get property by ID for editing (admin/host only)
 */
export const getPropertyById = async (id: string): Promise<Property | null> => {
  try {
    const { isAdmin } = getUserInfo()
    const endpoint = isAdmin 
      ? `${ADMIN_API_URL}/properties/${id}` 
      : `${HOST_API_URL}/properties/${id}`
    
    const res = await axios.get(endpoint, getAuthHeaders())
    return res.data.property || res.data || null
  } catch (error) {
    console.error('❌ Error fetching property by ID:', error)
    return null
  }
}