import axios from 'axios'

/**
 * Public API service for tours - No authentication required
 * Used in: HomeView, SearchResults, TourDetails (public facing)
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

/**
 * Public tour interface - EXACTA para TourDetail.vue
 */
export interface PublicTour {
  _id: string
  title: string
  description: string
  price: number
  // Campos opcionales del modelo TourPackage
  duration?: number
  maxCapacity?: number  
  location?: string
  amenities: string[] // Array siempre presente
  status: 'available' | 'sold_out' | 'cancelled' | 'upcoming'
  imageUrls: string[]
  host: {
    _id: string
    firstName: string
    lastName: string
    email: string
  }
  // Campos adicionales del backend
  averageRating?: number
  totalReviews?: number
  createdAt: string
  updatedAt?: string
  pricePerHour?: number | null
}

/**
 * Tour filters interface
 */
export interface TourFilters {
  page?: number
  limit?: number
  status?: string
  minPrice?: number
  maxPrice?: number
  sortBy?: 'price' | 'rating' | 'newest'
  sortOrder?: 'asc' | 'desc'
}

/**
 * Fetches all public tours (available only) for home page
 */
export const getPublicTours = async (filters: TourFilters = {}): Promise<{
  tours: PublicTour[]
  total: number
  page: number
  limit: number
}> => {
  try {
    const params = new URLSearchParams()
    
    if (filters.minPrice) params.append('minPrice', filters.minPrice.toString())
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString())
    if (filters.sortBy) params.append('sortBy', filters.sortBy)
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder)
    if (filters.page) params.append('page', filters.page.toString())
    if (filters.limit) params.append('limit', filters.limit.toString())
    
    // Llamada exacta a tu endpoint
    const url = `${API_BASE_URL}/tours/public${params.toString() ? `?${params.toString()}` : ''}`
    console.log('🎯 Calling tours URL:', url)
    
    const res = await axios.get(url)
    console.log('🎯 Tours response:', res.data)
    
    // Tu backend devuelve { message, tours }
    const tours = res.data.tours || []
    
    return {
      tours,
      total: tours.length,
      page: 1,
      limit: tours.length
    }
  } catch (error) {
    console.error('❌ Failed to fetch public tours:', error)
    return {
      tours: [],
      total: 0,
      page: 1,
      limit: 12
    }
  }
}

/**
 * Fetches featured tours for home page (first 6 available tours)
 */
export const getFeaturedTours = async (): Promise<PublicTour[]> => {
  try {
    const response = await getPublicTours({ 
      limit: 6, 
      sortBy: 'newest', 
      sortOrder: 'desc' 
    })
    return response.tours
  } catch (error) {
    console.error('❌ Error fetching featured tours:', error)
    return []
  }
}

/**
 * Fetches details of a single public tour by its ID
 */
export const getPublicTourById = async (id: string): Promise<PublicTour | null> => {
  try {
    // Como tu backend público no tiene endpoint individual,
    // obtenemos todos los tours y buscamos el específico
    const response = await getPublicTours()
    const tour = response.tours.find(tour => tour._id === id) || null
    
    if (tour) {
      console.log('✅ Found tour:', tour.title)
    } else {
      console.log('❌ Tour not found with ID:', id)
    }
    
    return tour
  } catch (error) {
    console.error('❌ Failed to fetch tour by ID:', error)
    return null
  }
}

/**
 * Searches tours using a keyword and optional filters
 */
export const searchTours = async (
  searchTerm: string,
  filters: TourFilters = {}
): Promise<{
  tours: PublicTour[]
  total: number
}> => {
  try {
    const params = new URLSearchParams()
    params.append('search', searchTerm)
    
    if (filters.minPrice) params.append('minPrice', filters.minPrice.toString())
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString())
    
    // Si tu backend no tiene endpoint de búsqueda, filtramos en frontend
    const allTours = await getPublicTours()
    const filteredTours = allTours.tours.filter(tour => 
      tour.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tour.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    
    return {
      tours: filteredTours,
      total: filteredTours.length
    }
  } catch (error) {
    console.error('❌ Failed to search tours:', error)
    return {
      tours: [],
      total: 0
    }
  }
}