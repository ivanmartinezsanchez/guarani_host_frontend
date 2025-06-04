<template>
  <main class="min-h-screen bg-white dark:bg-gray-900">
    <!-- Header -->
    <section class="bg-gradient-to-r from-primary to-primary-dark text-white py-16">
      <div class="max-w-7xl mx-auto px-6">
        <h1 class="text-4xl font-bold mb-4">Resultados de búsqueda</h1>
        <div class="flex flex-wrap gap-4 text-sm">
          <span v-if="searchParams.checkIn">📅 Llegada: {{ formatDate(searchParams.checkIn) }}</span>
          <span v-if="searchParams.checkOut">📅 Salida: {{ formatDate(searchParams.checkOut) }}</span>
          <span>👥 {{ searchParams.guests }} huésped{{ searchParams.guests > 1 ? 'es' : '' }}</span>
        </div>
      </div>
    </section>

    <!-- Search Results -->
    <section class="py-16 max-w-7xl mx-auto px-6">
      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-16">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span class="ml-3 text-gray-600 dark:text-gray-400">Buscando propiedades...</span>
      </div>

      <!-- Results -->
      <div v-else-if="properties.length > 0">
        <h2 class="text-2xl font-semibold text-darkText dark:text-white mb-6">
          {{ properties.length }} propiedad{{ properties.length > 1 ? 'es' : '' }} encontrada{{ properties.length > 1 ? 's' : '' }}
        </h2>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div
            v-for="property in properties"
            :key="property._id"
            class="group cursor-pointer"
            @click="viewProperty(property._id)"
          >
            <div class="relative overflow-hidden rounded-xl mb-3">
              <img
                :src="property.imageUrls?.[0] || fallbackImage"
                :alt="`${property.title} en ${property.city}`"
                class="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                @error="handleImageError"
              />
              <button 
                class="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white rounded-full transition-colors"
                @click.stop="toggleFavorite(property._id)"
              >
                <HeartIcon class="w-5 h-5 text-gray-600" />
              </button>
            </div>
            
            <div class="space-y-1">
              <div class="flex items-center justify-between">
                <h3 class="font-semibold text-darkText dark:text-white truncate">
                  {{ property.title }}
                </h3>
                <div class="flex items-center gap-1" v-if="property.averageRating">
                  <StarIcon class="w-4 h-4 text-yellow-400 fill-current" />
                  <span class="text-sm text-gray-600 dark:text-gray-400">
                    {{ property.averageRating.toFixed(1) }}
                  </span>
                </div>
              </div>
              <p class="text-lightText dark:text-gray-400 text-sm">
                {{ property.city }}
              </p>
              <p class="text-darkText dark:text-white font-semibold">
                {{ formatPrice(property.pricePerNight) }} 
                <span class="font-normal text-lightText dark:text-gray-400">por noche</span>
              </p>
              <p class="text-xs text-lightText dark:text-gray-400">
                Hasta {{ property.guests }} huéspedes
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- No Results -->
      <div v-else class="text-center py-16">
        <SearchIcon class="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <h3 class="text-xl font-semibold text-darkText dark:text-white mb-2">
          No se encontraron propiedades
        </h3>
        <p class="text-lightText dark:text-gray-400 mb-6">
          Intenta cambiar las fechas o el número de huéspedes
        </p>
        <RouterLink
          to="/"
          class="inline-block bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
        >
          Volver al inicio
        </RouterLink>
      </div>

      <!-- Debug Info (Solo en desarrollo) -->
      <div 
        v-if="isDevelopment" 
        class="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg"
      >
        <h4 class="font-bold text-sm mb-2">🔍 Debug Búsqueda:</h4>
        <div class="text-xs space-y-1">
          <p><strong>URL:</strong> {{ $route.fullPath }}</p>
          <p><strong>Query:</strong> {{ JSON.stringify($route.query) }}</p>
          <p><strong>Search Params:</strong> {{ JSON.stringify(searchParams) }}</p>
          <p><strong>Properties Found:</strong> {{ properties.length }}</p>
          <p><strong>Loading:</strong> {{ loading ? 'Sí' : 'No' }}</p>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { SearchIcon, HeartIcon, StarIcon } from 'lucide-vue-next'
import { searchProperties, type PublicProperty } from '@/services/publicPropertyService'

// Interfaces
interface SearchParams {
  checkIn?: string
  checkOut?: string
  guests: number
  city?: string
}

// Reactive data
const route = useRoute()
const router = useRouter()
const properties = ref<PublicProperty[]>([])
const loading = ref<boolean>(false)

// Environment check
const isDevelopment = computed<boolean>(() => {
  return import.meta.env.MODE === 'development' || import.meta.env.DEV
})

// Fallback image
const fallbackImage: string = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80'

// Extract search parameters from route
const searchParams = computed<SearchParams>(() => {
  return {
    checkIn: route.query.checkIn as string || undefined,
    checkOut: route.query.checkOut as string || undefined,
    guests: parseInt(route.query.guests as string) || 1,
    city: route.query.city as string || undefined
  }
})

/**
 * Perform search based on current parameters
 */
const performSearch = async (): Promise<void> => {
  try {
    loading.value = true
    console.log('🔍 Performing search with params:', searchParams.value)
    
    // Call search API
    const results = await searchProperties(searchParams.value)
    properties.value = results
    
    console.log('✅ Search completed:', results.length, 'properties found')
  } catch (error) {
    console.error('❌ Search error:', error)
    properties.value = []
  } finally {
    loading.value = false
  }
}

/**
 * Navigate to property detail page
 */
const viewProperty = (id: string): void => {
  router.push(`/property/${id}`)
}

/**
 * Toggle favorite (placeholder)
 */
const toggleFavorite = (id: string): void => {
  console.log('Toggle favorite for property:', id)
  // TODO: Implement favorites API call
}

/**
 * Format date for display
 */
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long'
  })
}

/**
 * Format price for display
 */
const formatPrice = (price: number): string => {
  if (price >= 1000000) {
    return `₲${(price / 1000000).toFixed(1)}M`
  } else if (price >= 1000) {
    return `₲${(price / 1000).toFixed(0)}K`
  } else {
    return `₲${price.toLocaleString('es-PY')}`
  }
}

/**
 * Handle image loading errors
 */
const handleImageError = (event: Event): void => {
  const target = event.target as HTMLImageElement
  target.src = fallbackImage
}

/**
 * Initialize search on mount
 */
onMounted((): void => {
  console.log('🚀 SearchView mounted')
  console.log('📋 Route query:', route.query)
  console.log('🎯 Search params:', searchParams.value)
  
  performSearch()
})
</script>

<style scoped>
/* Primary brand colors */
.text-primary {
  color: #3F51B5;
}

.bg-primary {
  background-color: #3F51B5;
}

.bg-primary-dark {
  background-color: #303F9F;
}

.hover\:bg-primary-dark:hover {
  background-color: #303F9F;
}

/* Custom text colors */
.text-darkText {
  color: #2C2C2C;
}

.text-lightText {
  color: #9E9E9E;
}
</style>