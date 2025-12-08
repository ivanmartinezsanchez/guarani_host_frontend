<template>
  <main class="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
    <!-- Hero Section with Search Bar -->
    <section 
      class="relative h-[60vh] flex items-center justify-center bg-gradient-to-br from-primary to-primary-dark"
      role="banner"
      aria-labelledby="hero-title"
    >
      <!-- Background overlay for better text readability -->
      <div class="absolute inset-0 bg-black/20"></div>
      
      <!-- Hero content container -->
      <div class="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center text-white">
        <!-- Brand title -->
        <h1 
          id="hero-title"
          class="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 sm:mb-6"
        >
          GuaraníHost
        </h1>
        
        <!-- Tagline -->
        <p class="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-white/90">
          Descubre Paraguay auténtico
        </p>
        
        <!-- Search Form -->
        <form 
          @submit.prevent="handleSearch"
          class="max-w-4xl mx-auto bg-white rounded-full shadow-2xl p-2"
          role="search"
          aria-label="Buscar alojamientos"
        >
          <div class="grid grid-cols-1 md:grid-cols-4 gap-2">
            <!-- Check-in Date Input -->
            <div class="px-4 sm:px-6 py-3 sm:py-4 text-left">
              <label 
                for="checkin-input"
                class="block text-xs font-semibold text-gray-800 mb-1"
              >
                Llegada
              </label>
              <input 
                id="checkin-input"
                v-model="filters.checkIn" 
                type="date" 
                :min="today"
                class="w-full text-gray-600 bg-transparent border-none outline-none text-sm focus:ring-2 focus:ring-primary/20 rounded"
                aria-describedby="checkin-help"
              />
              <span id="checkin-help" class="sr-only">
                Selecciona la fecha de llegada
              </span>
            </div>
            
            <!-- Check-out Date Input -->
            <div class="px-4 sm:px-6 py-3 sm:py-4 text-left md:border-l border-gray-200">
              <label 
                for="checkout-input"
                class="block text-xs font-semibold text-gray-800 mb-1"
              >
                Salida
              </label>
              <input 
                id="checkout-input"
                v-model="filters.checkOut" 
                type="date" 
                :min="filters.checkIn || today"
                class="w-full text-gray-600 bg-transparent border-none outline-none text-sm focus:ring-2 focus:ring-primary/20 rounded"
                aria-describedby="checkout-help"
              />
              <span id="checkout-help" class="sr-only">
                Selecciona la fecha de salida
              </span>
            </div>
            
            <!-- Guests Input -->
            <div class="px-4 sm:px-6 py-3 sm:py-4 text-left md:border-l border-gray-200">
              <label 
                for="guests-input"
                class="block text-xs font-semibold text-gray-800 mb-1"
              >
                Huéspedes
              </label>
              <input 
                id="guests-input"
                v-model.number="filters.guests" 
                type="number" 
                min="1" 
                max="20"
                placeholder="Agregar huéspedes" 
                class="w-full text-gray-600 bg-transparent border-none outline-none text-sm placeholder-gray-400 focus:ring-2 focus:ring-primary/20 rounded"
                aria-describedby="guests-help"
              />
              <span id="guests-help" class="sr-only">
                Número de huéspedes (máximo 20)
              </span>
            </div>
            
            <!-- Search Button -->
            <div class="px-2 py-2">
              <button 
                type="submit"
                :disabled="isSearching"
                class="bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full px-6 sm:px-8 py-3 font-semibold transition-all duration-200 w-full focus:outline-none focus:ring-4 focus:ring-primary/30"
                :aria-label="isSearching ? 'Buscando alojamientos...' : 'Buscar alojamientos'"
              >
                <SearchIcon class="w-4 h-4 sm:w-5 sm:h-5 inline mr-2" aria-hidden="true" />
                {{ isSearching ? 'Buscando...' : 'Buscar' }}
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>

    <!-- Featured Properties Section -->
    <section 
      class="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6"
      aria-labelledby="properties-title"
    >
      <!-- Section Header -->
      <header class="mb-8 sm:mb-12">
        <h2 
          id="properties-title"
          class="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-300"
        >
          Alojamientos disponibles
        </h2>
        <p class="text-gray-600 dark:text-gray-400 transition-colors duration-300">
          Propiedades verificadas por nuestros anfitriones
        </p>
      </header>
      
      <!-- Loading State -->
      <div 
        v-if="loadingProperties" 
        class="flex items-center justify-center py-12 sm:py-16"
        role="status"
        aria-live="polite"
      >
        <div 
          class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"
          aria-hidden="true"
        ></div>
        <span class="ml-3 text-gray-600 dark:text-gray-400">
          Cargando propiedades...
        </span>
      </div>

      <!-- Properties Grid -->
      <div 
        v-else-if="properties.length > 0" 
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
        role="list"
        aria-label="Lista de propiedades disponibles"
      >
        <article
          v-for="property in displayedProperties"
          :key="property._id"
          class="group cursor-pointer focus-within:ring-2 focus-within:ring-primary/50 rounded-xl transition-all duration-300"
          role="listitem"
          @click="viewProperty(property._id)"
          @keydown.enter="viewProperty(property._id)"
          @keydown.space.prevent="viewProperty(property._id)"
          tabindex="0"
          :aria-label="`Ver detalles de ${property.title} en ${property.city}`"
        >
          <!-- Property Image -->
          <div class="relative overflow-hidden rounded-xl mb-3">
            <img
              :src="property.imageUrls?.[0] || fallbackImage"
              :alt="`Imagen de ${property.title} en ${property.city}`"
              class="w-full h-48 sm:h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
              @error="handleImageError"
            />
            
            <!-- Favorite Button -->
            <button 
              class="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
              :aria-label="`${user ? 'Agregar a' : 'Inicia sesión para agregar'} ${property.title} a favoritos`"
              @click.stop="toggleFavorite(property._id)"
              @keydown.enter.stop="toggleFavorite(property._id)"
              @keydown.space.stop.prevent="toggleFavorite(property._id)"
            >
              <HeartIcon class="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-300" aria-hidden="true" />
            </button>
          </div>
          
          <!-- Property Details -->
          <div class="space-y-1">
            <!-- Title and Rating -->
            <div class="flex items-center justify-between gap-2">
              <h3 class="font-semibold text-darkText dark:text-white truncate text-sm sm:text-base transition-colors duration-300">
                {{ property.title }}
              </h3>
              <div 
                v-if="property.averageRating"
                class="flex items-center gap-1 flex-shrink-0"
                :aria-label="`Calificación: ${property.averageRating.toFixed(1)} de 5 estrellas`"
              >
                <StarIcon class="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" aria-hidden="true" />
                <span class="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  {{ property.averageRating.toFixed(1) }}
                </span>
              </div>
            </div>
            
            <!-- Location -->
            <p class="text-lightText dark:text-gray-400 text-xs sm:text-sm transition-colors duration-300">
              {{ property.city }}
            </p>
            
            <!-- Price -->
            <p class="text-darkText dark:text-white font-semibold text-sm sm:text-base transition-colors duration-300">
              {{ getPropertyPrice(property) }} 
              <span class="font-normal text-lightText dark:text-gray-400">por noche</span>
            </p>
            
            <!-- Guest Capacity -->
            <p class="text-xs text-lightText dark:text-gray-400 transition-colors duration-300">
              Hasta {{ property.guests }} huésped{{ property.guests > 1 ? 'es' : '' }}
            </p>
          </div>
        </article>
      </div>
      
      <!-- Empty State for Properties -->
      <div 
        v-else 
        class="text-center py-12 sm:py-16"
        role="status"
        aria-live="polite"
      >
        <HomeIcon class="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-gray-400 dark:text-gray-500" aria-hidden="true" />
        <h3 class="text-lg sm:text-xl font-semibold text-darkText dark:text-white mb-2 transition-colors duration-300">
          No hay propiedades disponibles
        </h3>
        <p class="text-lightText dark:text-gray-400 transition-colors duration-300">
          Pronto tendremos nuevos alojamientos disponibles
        </p>
      </div>

      <!-- Show More Properties Button -->
      <div class="text-center mt-8 sm:mt-12" v-if="properties.length > 8">
        <button
          @click="toggleShowAllProperties"
          class="border border-darkText dark:border-white text-darkText dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 font-semibold py-3 px-6 sm:px-8 rounded-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary/30"
          :aria-expanded="showAllProperties"
          :aria-label="showAllProperties ? 'Mostrar menos propiedades' : `Mostrar ${properties.length - 8} propiedades adicionales`"
        >
          {{ showAllProperties ? 'Ver menos' : `Mostrar más (${properties.length - 8} restantes)` }}
        </button>
      </div>
    </section>

    <!-- Experiences/Tours Section -->
    <section 
      class="py-12 sm:py-16 bg-background dark:bg-gray-800 transition-colors duration-300"
      aria-labelledby="tours-title"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6">
        <!-- Section Header -->
        <header class="mb-8 sm:mb-12">
          <h2 
            id="tours-title"
            class="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-300"
          >
            Experiencias locales
          </h2>
          <p class="text-gray-700 dark:text-gray-300 transition-colors duration-300">
            Tours y actividades con guías especializados
          </p>
        </header>
        
        <!-- Loading State -->
        <div 
          v-if="loadingTours" 
          class="flex items-center justify-center py-12 sm:py-16"
          role="status"
          aria-live="polite"
        >
          <div 
            class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"
            aria-hidden="true"
          ></div>
          <span class="ml-3 text-gray-600 dark:text-gray-400">
            Cargando tours...
          </span>
        </div>

        <!-- Tours Grid -->
        <div 
          v-else-if="tours.length > 0" 
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          role="list"
          aria-label="Lista de tours disponibles"
        >
          <article
            v-for="tour in displayedTours"
            :key="tour._id"
            class="group cursor-pointer focus-within:ring-2 focus-within:ring-primary/50 rounded-xl transition-all duration-300"
            role="listitem"
            @click="viewTour(tour._id)"
            @keydown.enter="viewTour(tour._id)"
            @keydown.space.prevent="viewTour(tour._id)"
            tabindex="0"
            :aria-label="`Ver detalles del tour ${tour.title}`"
          >
            <!-- Tour Image -->
            <div class="relative overflow-hidden rounded-xl mb-3">
              <img
                :src="tour.imageUrls?.[0] || fallbackTour"
                :alt="`Imagen del tour ${tour.title}`"
                class="w-full h-56 sm:h-72 object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
                @error="handleImageError"
              />
              
              <!-- Status Badge -->
              <div class="absolute top-3 left-3">
                <span 
                  :class="{
                    'bg-green-500': tour.status === 'available',
                    'bg-red-500': tour.status === 'sold_out',
                    'bg-yellow-500': tour.status === 'upcoming',
                    'bg-gray-500': tour.status === 'cancelled'
                  }"
                  class="px-2 py-1 text-xs font-medium text-white rounded-full"
                  :aria-label="`Estado del tour: ${getStatusLabel(tour.status)}`"
                >
                  {{ getStatusLabel(tour.status) }}
                </span>
              </div>
            </div>
            
            <!-- Tour Details -->
            <div class="space-y-1">
              <!-- Title -->
              <h3 class="font-semibold text-gray-900 dark:text-white text-sm sm:text-base transition-colors duration-300">
                {{ tour.title }}
              </h3>
              
              <!-- Description -->
              <p class="text-gray-700 dark:text-gray-300 text-xs sm:text-sm line-clamp-2 transition-colors duration-300">
                {{ tour.description }}
              </p>
              
              <!-- Price and Rating -->
              <div class="flex items-center justify-between gap-2">
                <p class="font-semibold text-gray-900 dark:text-white text-sm sm:text-base transition-colors duration-300">
                  {{ getTourPrice(tour) }}
                  <span class="font-normal text-gray-600 dark:text-gray-300">por persona</span>
                </p>
                
                <div 
                  v-if="tour.averageRating"
                  class="flex items-center gap-1 flex-shrink-0"
                  :aria-label="`Calificación: ${tour.averageRating.toFixed(1)} de 5 estrellas`"
                >
                  <StarIcon class="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" aria-hidden="true" />
                  <span class="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    {{ tour.averageRating.toFixed(1) }}
                  </span>
                </div>
              </div>
              
              <!-- Host Information -->
              <div class="flex items-center text-xs mt-2 transition-colors duration-300">
                <span class="text-gray-700 dark:text-gray-300">
                  Por {{ getHostName(tour) }}
                </span>
              </div>
            </div>
          </article>
        </div>

        <!-- Empty State for Tours -->
        <div 
          v-else 
          class="text-center py-12 sm:py-16"
          role="status"
          aria-live="polite"
        >
          <MapIcon class="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-gray-400 dark:text-gray-500" aria-hidden="true" />
          <h3 class="text-lg sm:text-xl font-semibold text-darkText dark:text-white mb-2 transition-colors duration-300">
            No hay tours disponibles
          </h3>
          <p class="text-lightText dark:text-gray-400 transition-colors duration-300">
            Pronto tendremos nuevas experiencias disponibles
          </p>
        </div>

        <!-- Show More Tours Button -->
        <div class="text-center mt-8 sm:mt-12" v-if="tours.length > 6">
          <button
            @click="toggleShowAllTours"
            class="border border-darkText dark:border-white text-darkText dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 font-semibold py-3 px-6 sm:px-8 rounded-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary/30"
            :aria-expanded="showAllTours"
            :aria-label="showAllTours ? 'Mostrar menos tours' : `Mostrar ${tours.length - 6} tours adicionales`"
          >
            {{ showAllTours ? 'Ver menos' : `Mostrar más tours (${tours.length - 6} restantes)` }}
          </button>
        </div>
      </div>
    </section>

    <!-- Call to Action Section -->
    <section 
      class="py-16 sm:py-20 bg-gradient-to-r from-primary to-primary-dark text-white"
      aria-labelledby="cta-title"
    >
      <div class="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <h2 
          id="cta-title"
          class="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6"
        >
          ¿Tienes una propiedad?
        </h2>
        <p class="text-lg sm:text-xl mb-6 sm:mb-8 text-white/90">
          Contacta con nuestro equipo para ser parte de GuaraníHost
        </p>
        <RouterLink
          to="/contact"
          class="inline-block bg-white text-primary hover:bg-gray-50 font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-white/30"
          aria-label="Ir a la página de contacto para unirse como host"
        >
          ¡Contáctanos!
        </RouterLink>
      </div>
    </section>

    <!-- Login Modal -->
    <div 
      v-if="showLoginModal" 
      class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 transition-opacity duration-300" 
      @click="closeLoginModal"
      @keydown.escape="closeLoginModal"
      role="dialog" 
      aria-labelledby="modal-title"
      aria-modal="true"
    >
      <div 
        class="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 max-w-md w-full transition-colors duration-300" 
        @click.stop
        role="document"
      >
        <div class="text-center">
          <h3 
            id="modal-title" 
            class="text-xl sm:text-2xl font-semibold text-darkText dark:text-white mb-4 transition-colors duration-300"
          >
            Inicia sesión o regístrate
          </h3>
          <p class="text-lightText dark:text-gray-400 mb-6 sm:mb-8 transition-colors duration-300">
            Para continuar con tu reserva
          </p>
          <div class="space-y-4">
            <RouterLink
              to="/register"
              class="block w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-primary/30"
              @click="closeLoginModal"
              aria-label="Ir a la página de registro"
            >
              Registrarse
            </RouterLink>
            <RouterLink
              to="/login"
              class="block w-full border border-gray-300 dark:border-gray-600 text-darkText dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors duración-200 focus:outline-none focus:ring-4 focus:ring-primary/30"
              @click="closeLoginModal"
              aria-label="Ir a la página de inicio de sesión"
            >
              Iniciar sesión
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { 
  SearchIcon, 
  HeartIcon, 
  StarIcon,
  HomeIcon,
  MapIcon
} from 'lucide-vue-next'
import { useAuth } from '@/composables/useAuth'
import { getFeaturedProperties, type PublicProperty } from '@/services/publicPropertyService'
import { getFeaturedTours, type PublicTour } from '@/services/publicTourService'

/**
 * Simple type that describes the search form fields.
 */
interface SearchFilters {
  checkIn: string
  checkOut: string
  guests: number
}

const router = useRouter()
const { user } = useAuth()

// Core reactive collections for homepage content
const properties = ref<PublicProperty[]>([])
const tours = ref<PublicTour[]>([])
const loadingProperties = ref<boolean>(false)
const loadingTours = ref<boolean>(false)

// UI state flags
const showAllProperties = ref<boolean>(false)
const showAllTours = ref<boolean>(false)
const showLoginModal = ref<boolean>(false)
const isSearching = ref<boolean>(false)

// Fallback images for broken URLs
const fallbackImage: string = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80'
const fallbackTour: string = 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80'

// Search filters default values
const filters = ref<SearchFilters>({
  checkIn: '',
  checkOut: '',
  guests: 1,
})

/**
 * Gets today's date in YYYY-MM-DD format, used as min value for date inputs.
 */
const today = computed<string>(() => {
  return new Date().toISOString().split('T')[0]
})

/**
 * Limits the initial number of displayed properties to improve performance.
 */
const displayedProperties = computed<PublicProperty[]>(() => {
  return showAllProperties.value ? properties.value : properties.value.slice(0, 8)
})

/**
 * Limits the initial number of displayed tours to improve performance.
 */
const displayedTours = computed<PublicTour[]>(() => {
  return showAllTours.value ? tours.value : tours.value.slice(0, 6)
})

/**
 * Loads featured properties from the public API.
 */
const loadFeaturedProperties = async (): Promise<void> => {
  try {
    loadingProperties.value = true
    properties.value = await getFeaturedProperties()
    console.log('✅ Properties loaded:', properties.value.length)
  } catch (error) {
    console.error('❌ Error loading featured properties:', error)
  } finally {
    loadingProperties.value = false
  }
}

/**
 * Loads featured tours from the public API.
 */
const loadFeaturedTours = async (): Promise<void> => {
  try {
    loadingTours.value = true
    tours.value = await getFeaturedTours()
    console.log('✅ Tours loaded:', tours.value.length)
  } catch (error) {
    console.error('❌ Error loading featured tours:', error)
  } finally {
    loadingTours.value = false
  }
}

/**
 * Handles the search form submission and redirects to the search page.
 * Includes basic client-side validation for date ranges.
 */
const handleSearch = async (): Promise<void> => {
  try {
    isSearching.value = true
    
    if (filters.value.checkIn && filters.value.checkOut) {
      const checkInDate = new Date(filters.value.checkIn)
      const checkOutDate = new Date(filters.value.checkOut)
      const todayDate = new Date()
      todayDate.setHours(0, 0, 0, 0)
      
      // Prevent past check-in dates
      if (checkInDate < todayDate) {
        alert('La fecha de llegada no puede ser en el pasado')
        return
      }
      
      // Ensure check-out date is strictly after check-in date
      if (checkOutDate <= checkInDate) {
        alert('La fecha de salida debe ser después de la fecha de llegada')
        return
      }
    }
    
    const searchParams: Record<string, string | number> = {
      guests: filters.value.guests
    }
    
    if (filters.value.checkIn) {
      searchParams.checkIn = filters.value.checkIn
    }
    
    if (filters.value.checkOut) {
      searchParams.checkOut = filters.value.checkOut
    }
    
    await router.push({
      path: '/search',
      query: searchParams
    })
    
  } catch (error: any) {
    console.error('❌ Search error:', error)
    alert('Error en la búsqueda: ' + (error?.message || 'Error desconocido'))
  } finally {
    isSearching.value = false
  }
}

/**
 * Redirects the user to a property detail page.
 */
const viewProperty = (id: string): void => {
  router.push(`/property/${id}`)
}

/**
 * Redirects the user to a tour detail page.
 */
const viewTour = (id: string): void => {
  router.push(`/tour/${id}`)
}

/**
 * Handles the favorite button.
 * If the user is not authenticated, it shows the login/register modal.
 */
const toggleFavorite = (id: string): void => {
  if (!user.value) {
    showLoginModal.value = true
    return
  }
  
  console.log('Toggle favorite for property:', id)
  // TODO: connect with favorites API when available
}

/**
 * Toggles between initial and full list of properties.
 */
const toggleShowAllProperties = (): void => {
  showAllProperties.value = !showAllProperties.value
}

/**
 * Toggles between initial and full list of tours.
 */
const toggleShowAllTours = (): void => {
  showAllTours.value = !showAllTours.value
}

/**
 * Closes the login/register modal.
 */
const closeLoginModal = (): void => {
  showLoginModal.value = false
}

/**
 * Helper to format a raw numeric price in USD (used across the view).
 */
const formatPrice = (price: number): string => {
  const numericPrice =
    typeof price === 'number' ? price : Number(price)

  if (!Number.isFinite(numericPrice)) {
    // Fallback when data is corrupted or missing
    return 'Consultar'
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numericPrice)
}

/**
 * Returns a safe label for a property price.
 * - If price is valid → formatted USD value.
 * - If price is invalid / missing → "Consultar".
 */
const getPropertyPrice = (property: PublicProperty): string => {
  const raw = (property as any)?.pricePerNight
  const n = typeof raw === 'number' ? raw : Number(raw)
  if (!Number.isFinite(n) || n <= 0) {
    return 'Consultar'
  }
  return formatPrice(n)
}

/**
 * Returns a safe label for a tour price.
 * - If price is valid → formatted USD value.
 * - If price is invalid / missing → "Consultar".
 */
const getTourPrice = (tour: PublicTour): string => {
  const raw = (tour as any)?.price
  const n = typeof raw === 'number' ? raw : Number(raw)
  if (!Number.isFinite(n) || n <= 0) {
    return 'Consultar'
  }
  return formatPrice(n)
}

/**
 * Returns a localized Spanish label for a given tour status code.
 */
const getStatusLabel = (status: string): string => {
  const statusMap: Record<string, string> = {
    'available': 'Disponible',
    'sold_out': 'Agotado',
    'upcoming': 'Próximamente',
    'cancelled': 'Cancelado'
  }
  return statusMap[status] || status
}

/**
 * Returns a safe, user-friendly host name for a tour.
 * - If firstName/lastName exist, it returns the full name.
 * - If not, it falls back to "guía local" so the UI is never empty.
 */
const getHostName = (tour: PublicTour): string => {
  const first = tour.host?.firstName?.trim() || ''
  const last = tour.host?.lastName?.trim() || ''
  const fullName = [first, last].filter(Boolean).join(' ')
  return fullName || 'guía local'
}

/**
 * Replaces broken images with generic fallback photos for a better UX.
 */
const handleImageError = (event: Event): void => {
  const target = event.target as HTMLImageElement
  if (target.src.includes('tour') || target.alt.includes('tour')) {
    target.src = fallbackTour
  } else {
    target.src = fallbackImage
  }
}

/**
 * Initial data load for homepage.
 * Properties and tours are fetched in parallel for better performance.
 */
onMounted(async (): Promise<void> => {
  console.log('🚀 Loading homepage data...')
  
  await Promise.all([
    loadFeaturedProperties(),
    loadFeaturedTours()
  ])
  
  console.log('✅ Homepage data loaded successfully')
  console.log(
    '💰 Tours price debug:',
    tours.value.map(t => ({
      title: t.title,
      price: t.price,
      host: t.host
    }))
  )
})
</script>

<style scoped>
/* Primary brand colors using CSS custom properties for consistency */
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

/* Custom semantic color classes for better maintainability */
.text-darkText {
  color: #2C2C2C;
}

/* Ensure dark text is visible in dark mode */
.dark .text-darkText {
  color: #ffffff;
}

.text-lightText {
  color: #9E9E9E;
}

/* Ensure light text has proper contrast in dark mode */
.dark .text-lightText {
  color: #9CA3AF;
}

.bg-background {
  background-color: #F5F5F5;
}

/* Utility class for truncating text to 2 lines */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Dark mode color adjustments */

.bg-background {
  background-color: #F5F5F5;
}

/* Screen reader only content for accessibility */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
