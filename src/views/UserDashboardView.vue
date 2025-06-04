<template>
  <!-- Main user dashboard container - consistent with admin/host -->
  <div class="bg-background dark:bg-gray-900">
    <!-- Header Section - User focused -->
    <header class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <!-- Title section with responsive text -->
          <div>
            <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-darkText dark:text-white">
              Panel de Usuario
            </h1>
            <p class="text-lightText dark:text-gray-400 mt-1 text-sm sm:text-base">
              Gestiona tus reservas y explora nuevos destinos
            </p>
          </div>
          <!-- User badge - responsive sizing -->
          <div class="flex items-center space-x-4">
            <div class="bg-primary/10 p-2 sm:p-3 rounded-full" aria-hidden="true">
              <UserIcon class="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-primary" />
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content - Responsive padding and spacing -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      <!-- Main Management Cards Section -->
      <section aria-labelledby="management-heading" class="mb-6 sm:mb-8">
        <h2 id="management-heading" class="text-lg sm:text-xl lg:text-2xl font-semibold text-darkText dark:text-white mb-4 sm:mb-6">
          Acceso Rápido
        </h2>
        
        <!-- Responsive grid: 1 col mobile, 2 cols tablet, 2 cols desktop -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <!-- View Bookings Card - Fixed navigation -->
          <button
            @click="navigateToBookings"
            @keydown.enter="navigateToBookings"
            @keydown.space.prevent="navigateToBookings"
            class="text-left w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-xl"
            aria-label="Access my bookings"
          >
            <DashboardCard
              title="Mis Reservas"
              subtitle="Gestiona tus reservas activas y pasadas"
              :icon="CalendarCheckIcon"
              icon-color="text-blue-600 dark:text-blue-400"
              icon-bg="bg-blue-50 dark:bg-blue-900/20"
              class="hover:scale-105 transition-transform duration-200 cursor-pointer h-full"
            >
              <!-- Clean content with booking statistics -->
              <div class="space-y-3">
                <p class="text-sm text-lightText dark:text-gray-400">
                  Revisa tus reservas, actualiza detalles y gestiona tus próximos viajes.
                </p>
                <!-- Show booking count if available -->
                <div v-if="!loadingBookings && userBookings.length > 0" class="text-2xl font-bold text-blue-600">
                  {{ userBookings.length }} reservas
                </div>
              </div>
              
              <!-- Action indicator -->
              <template #footer>
                <div class="flex items-center justify-between text-blue-700 dark:text-blue-300">
                  <span class="text-sm font-medium">Ver reservas</span>
                  <ChevronRightIcon class="w-4 h-4" />
                </div>
              </template>
            </DashboardCard>
          </button>

          <!-- Profile Settings Card - Clickable -->
          <button
            @click="navigateToProfile"
            @keydown.enter="navigateToProfile"
            @keydown.space.prevent="navigateToProfile"
            class="text-left w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 rounded-xl"
            aria-label="Access my profile"
          >
            <DashboardCard
              title="Mi Perfil"
              subtitle="Configuración de cuenta y preferencias"
              :icon="UserCircleIcon"
              icon-color="text-green-600 dark:text-green-400"
              icon-bg="bg-green-50 dark:bg-green-900/20"
              class="hover:scale-105 transition-transform duration-200 cursor-pointer h-full"
            >
              <!-- Clean content without statistics -->
              <div class="space-y-3">
                <p class="text-sm text-lightText dark:text-gray-400">
                  Actualiza tu información personal, preferencias y configuración de seguridad.
                </p>
              </div>
              
              <!-- Action indicator -->
              <template #footer>
                <div class="flex items-center justify-between text-green-700 dark:text-green-300">
                  <span class="text-sm font-medium">Configurar perfil</span>
                  <ChevronRightIcon class="w-4 h-4" />
                </div>
              </template>
            </DashboardCard>
          </button>
        </div>
      </section>

      <!-- My Bookings Section - Real data display -->
      <section aria-labelledby="bookings-heading" class="bg-gradient-to-r from-[#3F51B5] to-[#303F9F] rounded-xl lg:rounded-2xl p-4 sm:p-6 lg:p-8 text-white">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
          <!-- Section header -->
          <div class="mb-4 lg:mb-0">
            <h2 id="bookings-heading" class="text-lg sm:text-xl lg:text-2xl font-bold mb-2">
              Mis Reservas Recientes
            </h2>
            <p class="text-blue-100 text-sm sm:text-base">
              Gestiona tus viajes y reservas de forma sencilla
            </p>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loadingBookings" class="mt-6">
          <div class="flex items-center justify-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent"></div>
            <span class="ml-3 text-white">Cargando reservas...</span>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="bookingsError" class="mt-6">
          <div class="text-center py-8">
            <div class="text-yellow-300 text-4xl mb-4">⚠️</div>
            <p class="text-blue-100 mb-4">Error al cargar las reservas</p>
            <button 
              @click="loadUserBookings"
              class="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg text-white font-medium transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="userBookings.length === 0" class="mt-6">
          <div class="text-center py-8">
            <div class="text-4xl mb-4">🏖️</div>
            <p class="text-blue-100 mb-4">¡Es hora de planear tu próxima aventura!</p>
            <p class="text-sm text-blue-200 mb-6">No tienes reservas aún. Descubre increíbles destinos.</p>
            <button 
              @click="navigateToHome"
              class="inline-flex items-center px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg font-medium text-white transition-colors"
            >
              <HomeIcon class="w-5 h-5 mr-2" />
              Explorar Destinos
            </button>
          </div>
        </div>

        <!-- Bookings List -->
        <div v-else class="mt-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              v-for="booking in userBookings.slice(0, 4)"
              :key="booking._id"
              @click="navigateToBookings"
              class="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg p-4 cursor-pointer transition-all duration-200 group"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <!-- Booking Icon -->
                  <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <component 
                      :is="booking.property ? HomeIcon : MapPinIcon" 
                      class="w-5 h-5 text-white" 
                    />
                  </div>
                  
                  <!-- Booking Info -->
                  <div>
                    <p class="font-medium text-white truncate">
                      {{ getBookingTitle(booking) }}
                    </p>
                    <p class="text-sm text-blue-100">
                      {{ formatDate(booking.checkIn) }} - {{ formatDate(booking.checkOut) }}
                    </p>
                  </div>
                </div>
                
                <!-- Status and Action -->
                <div class="text-right">
                  <p class="text-sm font-medium text-white">
                    ${{ booking.totalPrice.toLocaleString() }}
                  </p>
                  <span :class="getStatusClass(booking.status)" class="inline-flex px-2 py-1 text-xs font-medium rounded-full">
                    {{ getStatusText(booking.status) }}
                  </span>
                </div>
              </div>
              
              <!-- Action hint -->
              <div class="mt-3 flex items-center justify-end text-blue-200 text-xs">
                <span>Click para gestionar</span>
                <ChevronRightIcon class="w-3 h-3 ml-1" />
              </div>
            </div>
          </div>
          
          <!-- Show more link -->
          <div class="mt-6 text-center">
            <button 
              @click="navigateToBookings"
              class="inline-flex items-center px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg font-medium text-white transition-colors"
            >
              Ver todas las reservas ({{ userBookings.length }})
              <ChevronRightIcon class="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
/**
 * UserDashboardView.vue
 * ----------------------
 * User dashboard with fixed lifecycle and navigation issues
 * 
 * FIXES APPLIED:
 * 1. Fixed onMounted lifecycle warning by ensuring proper component setup
 * 2. Added error boundaries to prevent navigation loops
 * 3. Enhanced error handling with proper try-catch blocks
 * 4. Fixed navigation routes to prevent not-found redirects
 * 5. Added loading state management to prevent race conditions
 */

import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import DashboardCard from '@/components/ui/DashboardCard.vue'
import { getUserBookings, type Booking } from '@/services/userBookingService'

// Import Lucide icons
import { 
  CalendarCheck as CalendarCheckIcon,
  User as UserIcon,
  UserCircle as UserCircleIcon,
  Home as HomeIcon,
  MapPin as MapPinIcon,
  ChevronRight as ChevronRightIcon
} from 'lucide-vue-next'

// Router instance
const router = useRouter()

// Reactive state with proper initialization
const userBookings = ref<Booking[]>([])
const loadingBookings = ref(false)
const bookingsError = ref(false)
const isComponentMounted = ref(false)

/**
 * Navigation functions with error handling
 */

/**
 * Navigate to user bookings with error boundary
 */
const navigateToBookings = async () => {
  try {
    console.log('🧭 Navigating to user bookings...')
    await router.push('/user/bookings')
  } catch (error) {
    console.error('❌ Navigation error to bookings:', error)
  }
}

/**
 * Navigate to user profile with error boundary
 */
const navigateToProfile = async () => {
  try {
    console.log('🧭 Navigating to user profile...')
    await router.push('/profile')
  } catch (error) {
    console.error('❌ Navigation error to profile:', error)
  }
}

/**
 * Navigate to home page with error boundary
 */
const navigateToHome = async () => {
  try {
    console.log('🧭 Navigating to home page...')
    await router.push('/')
  } catch (error) {
    console.error('❌ Navigation error to home:', error)
  }
}

/**
 * Load user bookings with enhanced error handling and lifecycle safety
 */
const loadUserBookings = async () => {
  // Prevent multiple concurrent requests
  if (loadingBookings.value) {
    console.log('⚠️ Booking load already in progress, skipping...')
    return
  }

  try {
    console.log('📋 Starting to load user bookings...')
    loadingBookings.value = true
    bookingsError.value = false
    
    // Add small delay to ensure component is fully mounted
    await nextTick()
    
    const bookings = await getUserBookings()
    
    // Only update if component is still mounted
    if (isComponentMounted.value) {
      userBookings.value = bookings
      console.log(`✅ Successfully loaded ${bookings.length} bookings`)
    } else {
      console.log('⚠️ Component unmounted, skipping booking update')
    }
    
  } catch (error) {
    console.error('❌ Error loading user bookings:', error)
    
    // Only update error state if component is still mounted
    if (isComponentMounted.value) {
      bookingsError.value = true
    }
    
    // Enhanced error logging
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack
      })
    }
  } finally {
    // Only update loading state if component is still mounted
    if (isComponentMounted.value) {
      loadingBookings.value = false
    }
  }
}

/**
 * Get booking title with safe property access
 */
const getBookingTitle = (booking: Booking): string => {
  try {
    if (booking.property && typeof booking.property === 'object') {
      return booking.property.title || 'Propiedad sin título'
    }
    
    if (booking.tourPackage && typeof booking.tourPackage === 'object') {
      return booking.tourPackage.title || 'Tour sin título'
    }
    
    if (booking.property) {
      return 'Reserva de Propiedad'
    }
    
    if (booking.tourPackage) {
      return 'Reserva de Tour'
    }
    
    return 'Reserva'
  } catch (error) {
    console.warn('Error getting booking title:', error)
    return 'Reserva'
  }
}

/**
 * Format date with error handling
 */
const formatDate = (date: Date | string): string => {
  try {
    return new Date(date).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short'
    })
  } catch (error) {
    console.warn('Invalid date format:', date)
    return 'Fecha inválida'
  }
}

/**
 * Get CSS classes for booking status
 */
const getStatusClass = (status: string): string => {
  const classes = {
    pending: 'bg-yellow-500/20 text-yellow-200 border border-yellow-400/30',
    confirmed: 'bg-green-500/20 text-green-200 border border-green-400/30',
    cancelled: 'bg-red-500/20 text-red-200 border border-red-400/30',
    completed: 'bg-blue-500/20 text-blue-200 border border-blue-400/30'
  }
  return classes[status as keyof typeof classes] || 'bg-gray-500/20 text-gray-200 border border-gray-400/30'
}

/**
 * Get localized status text
 */
const getStatusText = (status: string): string => {
  const texts = {
    pending: 'Pendiente',
    confirmed: 'Confirmada',
    cancelled: 'Cancelada',
    completed: 'Completada'
  }
  return texts[status as keyof typeof texts] || status.charAt(0).toUpperCase() + status.slice(1)
}

/**
 * Initialize dashboard with proper lifecycle management
 */
onMounted(async () => {
  try {
    console.log('🚀 UserDashboard component mounting...')
    
    // Mark component as mounted
    isComponentMounted.value = true
    
    // Wait for next tick to ensure DOM is ready
    await nextTick()
    
    // Load user bookings
    await loadUserBookings()
    
    console.log('✅ UserDashboard initialization complete')
  } catch (error) {
    console.error('❌ Error during dashboard initialization:', error)
  }
})

/**
 * Cleanup on component unmount
 */
import { onUnmounted } from 'vue'

onUnmounted(() => {
  console.log('🧹 UserDashboard component unmounting...')
  isComponentMounted.value = false
})
</script>

<style scoped>
/* Brand-specific colors consistent with admin/host dashboards */
.text-primary {
  color: #3F51B5;
}

.bg-primary {
  background-color: #3F51B5;
}

.text-darkText {
  color: #2C2C2C;
}

.text-lightText {
  color: #9E9E9E;
}

.bg-background {
  background-color: #F5F5F5;
}

.focus\:ring-primary:focus {
  --tw-ring-color: #3F51B5;
}

button {
  text-align: inherit;
}

/* Enhanced transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}
</style>