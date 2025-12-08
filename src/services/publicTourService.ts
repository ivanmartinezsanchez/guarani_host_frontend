import axios from 'axios'

/**
 * Public API service for tours - No authentication required.
 * Used in: HomeView, SearchResults, TourDetails (public facing).
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

/**
 * Public tour interface aligned with the TourDetail.vue view.
 * - price is always treated as a number (USD).
 * - host is required at the type level (domain rule).
 */
export interface PublicTour {
  _id: string
  title: string
  description: string
  price: number

  // Optional fields from the TourPackage model
  duration?: number
  maxCapacity?: number
  location?: string
  amenities: string[]
  status: 'available' | 'sold_out' | 'cancelled' | 'upcoming'
  imageUrls: string[]

  // Host information – required by business rules
  host: {
    _id: string
    firstName: string
    lastName: string
    email: string
  }

  // Extra fields returned by the backend or derived on the frontend
  hostInitials?: string
  averageRating?: number
  totalReviews?: number
  createdAt: string
  updatedAt?: string
  pricePerHour?: number | null
}

/**
 * Tour filters interface used for public listing/search.
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
 * Safely normalizes raw API tour data to the PublicTour shape.
 * - Ensures price is numeric.
 * - Ensures host is a non-null object with string fields.
 * - Computes host initials without risking runtime errors.
 */
const normalizePublicTour = (raw: any): PublicTour => {
  // Normalize price as a number. If invalid, fall back to 0.
  const numericPrice =
    typeof raw.price === 'number'
      ? raw.price
      : Number(raw.price)

  const safePrice = Number.isFinite(numericPrice) ? numericPrice : 0

  // Normalize host object (domain rule: host should always exist)
  const rawHost = raw.host || {}

  const firstName =
    typeof rawHost.firstName === 'string' ? rawHost.firstName : ''
  const lastName =
    typeof rawHost.lastName === 'string' ? rawHost.lastName : ''
  const email =
    typeof rawHost.email === 'string' ? rawHost.email : ''

  const host = {
    _id: String(rawHost._id || ''),
    firstName,
    lastName,
    email,
  }

  // Compute initials safely – never calls charAt on undefined
  const firstInitial = firstName ? firstName[0] : ''
  const lastInitial = lastName ? lastName[0] : ''
  const initials = (firstInitial + lastInitial) || 'GH'

  return {
    ...raw,
    price: safePrice,
    host,
    hostInitials: initials,
  }
}

/**
 * Fetches all public tours (available only) for the home page.
 * The backend endpoint returns:
 * {
 *   message: string,
 *   tours: TourPackage[],
 *   total: number,
 *   page: number,
 *   limit: number
 * }
 */
export const getPublicTours = async (
  filters: TourFilters = {}
): Promise<{
  tours: PublicTour[]
  total: number
  page: number
  limit: number
}> => {
  try {
    const params = new URLSearchParams()

    if (filters.minPrice != null) params.append('minPrice', filters.minPrice.toString())
    if (filters.maxPrice != null) params.append('maxPrice', filters.maxPrice.toString())
    if (filters.sortBy) params.append('sortBy', filters.sortBy)
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder)
    if (filters.page) params.append('page', filters.page.toString())
    if (filters.limit) params.append('limit', filters.limit.toString())

    const url = `${API_BASE_URL}/tours/public${
      params.toString() ? `?${params.toString()}` : ''
    }`
    console.log('🎯 Calling tours URL:', url)

    const res = await axios.get(url)
    console.log('🎯 Tours response:', res.data)

    // Backend returns { message, tours, total, page, limit }
    const toursFromApi: any[] = res.data.tours || []
    const total: number = res.data.total ?? toursFromApi.length
    const page: number = res.data.page ?? 1
    const limit: number = res.data.limit ?? toursFromApi.length

    // Normalize every tour to a safe, typed object
    const tours: PublicTour[] = toursFromApi.map(normalizePublicTour)

    return {
      tours,
      total,
      page,
      limit,
    }
  } catch (error) {
    console.error('❌ Failed to fetch public tours:', error)
    return {
      tours: [],
      total: 0,
      page: 1,
      limit: 12,
    }
  }
}

/**
 * Fetches featured tours for the home page
 * (first N available tours ordered by newest).
 */
export const getFeaturedTours = async (): Promise<PublicTour[]> => {
  try {
    const response = await getPublicTours({
      limit: 6,
      sortBy: 'newest',
      sortOrder: 'desc',
    })
    return response.tours
  } catch (error) {
    console.error('❌ Error fetching featured tours:', error)
    return []
  }
}

/**
 * Fetches details of a single public tour by its ID.
 * NOTE: there is no dedicated public endpoint for a single tour,
 * so we fetch all tours and search the one we need on the frontend.
 */
export const getPublicTourById = async (
  id: string
): Promise<PublicTour | null> => {
  try {
    const response = await getPublicTours()
    const tour = response.tours.find((tour) => tour._id === id) || null

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
 * Searches tours using a keyword and optional filters.
 * If the backend does not expose a dedicated search endpoint,
 * the filtering is done on the frontend.
 */
export const searchTours = async (
  searchTerm: string,
  filters: TourFilters = {}
): Promise<{
  tours: PublicTour[]
  total: number
}> => {
  try {
    // We could send query params to backend in the future,
    // for now we reuse the full public list.
    const allTours = await getPublicTours(filters)

    const lower = searchTerm.toLowerCase()

    const filteredTours = allTours.tours.filter((tour) =>
      [
        tour.title.toLowerCase(),
        tour.description.toLowerCase(),
      ].some((field) => field.includes(lower))
    )

    return {
      tours: filteredTours,
      total: filteredTours.length,
    }
  } catch (error) {
    console.error('❌ Failed to search tours:', error)
    return {
      tours: [],
      total: 0,
    }
  }
}
