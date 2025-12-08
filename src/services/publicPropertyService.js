import axios from 'axios';
/**
 * Public API service for properties - No authentication required
 * Used in: HomeView, SearchResults, PropertyDetails (public facing)
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
/**
 * Fetches all public properties (available only) for home page
 */
export const getPublicProperties = async (filters = {}) => {
    try {
        const params = new URLSearchParams();
        if (filters.city)
            params.append('city', filters.city);
        if (filters.minPrice)
            params.append('minPrice', filters.minPrice.toString());
        if (filters.maxPrice)
            params.append('maxPrice', filters.maxPrice.toString());
        if (filters.guests)
            params.append('guests', filters.guests.toString());
        if (filters.amenities?.length)
            params.append('amenities', filters.amenities.join(','));
        if (filters.sortBy)
            params.append('sortBy', filters.sortBy);
        if (filters.sortOrder)
            params.append('sortOrder', filters.sortOrder);
        if (filters.page)
            params.append('page', filters.page.toString());
        if (filters.limit)
            params.append('limit', filters.limit.toString());
        // 🔧 URL CORREGIDA: /properties/public (no /public/properties)
        const url = `${API_BASE_URL}/properties/public${params.toString() ? `?${params.toString()}` : ''}`;
        console.log('🏠 Calling properties URL:', url);
        const res = await axios.get(url);
        console.log('🏠 Properties response:', res.data);
        return {
            properties: res.data.properties || [],
            total: res.data.total || res.data.properties?.length || 0,
            page: res.data.page || 1,
            limit: res.data.limit || 12
        };
    }
    catch (error) {
        console.error('❌ Failed to fetch public properties:', error);
        if (axios.isAxiosError(error)) {
            console.error('Status:', error.response?.status);
            console.error('URL:', error.config?.url);
            console.error('Response:', error.response?.data);
        }
        return {
            properties: [],
            total: 0,
            page: 1,
            limit: 12
        };
    }
};
/**
 * Fetches featured properties for home page (first 8 available properties)
 */
export const getFeaturedProperties = async () => {
    try {
        const response = await getPublicProperties({
            limit: 8,
            sortBy: 'newest',
            sortOrder: 'desc'
        });
        return response.properties;
    }
    catch (error) {
        console.error('❌ Error fetching featured properties:', error);
        return [];
    }
};
/**
 * Fetches details of a single public property by its ID
 */
export const getPublicPropertyById = async (id) => {
    try {
        // Como no tienes endpoint individual, buscar en la lista completa
        const response = await getPublicProperties();
        return response.properties.find(property => property._id === id) || null;
    }
    catch (error) {
        console.error('❌ Failed to fetch property by ID:', error);
        return null;
    }
};
/**
 * Searches properties using filters and optional search term
 */
export const searchProperties = async (searchParams) => {
    try {
        // Como no tienes endpoint de búsqueda específico, usar filtros en getPublicProperties
        const filters = {};
        if (searchParams.city)
            filters.city = searchParams.city;
        if (searchParams.minPrice)
            filters.minPrice = searchParams.minPrice;
        if (searchParams.maxPrice)
            filters.maxPrice = searchParams.maxPrice;
        if (searchParams.guests)
            filters.guests = searchParams.guests;
        const response = await getPublicProperties(filters);
        return response.properties;
    }
    catch (error) {
        console.error('❌ Failed to search properties:', error);
        return [];
    }
};
/**
 * Fetches the list of available cities from the backend
 */
export const getAvailableCities = async () => {
    try {
        // Extraer ciudades de las propiedades existentes
        const response = await getPublicProperties();
        const cities = [...new Set(response.properties.map(p => p.city))];
        return cities;
    }
    catch (error) {
        console.error('❌ Failed to fetch available cities:', error);
        return [];
    }
};
/**
 * Fetches the list of popular amenities from the backend
 */
export const getPopularAmenities = async () => {
    try {
        // Extraer amenities de las propiedades existentes
        const response = await getPublicProperties();
        const allAmenities = response.properties.flatMap(p => p.amenities);
        const uniqueAmenities = [...new Set(allAmenities)];
        return uniqueAmenities;
    }
    catch (error) {
        console.error('❌ Failed to fetch amenities:', error);
        return [];
    }
};
//# sourceMappingURL=publicPropertyService.js.map