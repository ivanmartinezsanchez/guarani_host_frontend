<template>
  <main class="min-h-screen bg-white dark:bg-gray-900">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      <p class="mt-4 text-gray-500 dark:text-gray-400 ml-4">Cargando detalles del tour...</p>
    </div>

    <!-- Tour Not Found -->
    <div v-else-if="!tour" class="text-center py-20 text-gray-500 dark:text-gray-400">
      <div class="max-w-md mx-auto">
        <h2 class="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Tour no encontrado</h2>
        <p class="mb-6">El tour que buscas no existe o no está disponible.</p>
        <RouterLink 
          to="/" 
          class="inline-block bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg transition-colors"
        >
          Volver al inicio
        </RouterLink>
      </div>
    </div>

    <!-- Tour Details -->
    <section v-else class="max-w-5xl mx-auto p-6">
      <div class="space-y-6">
        <!-- Breadcrumb -->
        <nav class="flex text-sm text-gray-600 dark:text-gray-400">
          <RouterLink to="/" class="hover:text-primary">Inicio</RouterLink>
          <span class="mx-2">/</span>
          <RouterLink to="/#tours" class="hover:text-primary">Tours</RouterLink>
          <span class="mx-2">/</span>
          <span class="text-gray-800 dark:text-white">{{ tour.title }}</span>
        </nav>

        <!-- Title and Status -->
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 class="text-3xl font-bold text-primary">{{ tour.title }}</h1>
            <p class="text-gray-700 dark:text-gray-300 text-lg mt-2">{{ tour.description }}</p>
          </div>
          
          <!-- Status Badge -->
          <div class="flex-shrink-0">
            <span 
              :class="{
                'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200': tour.status === 'available',
                'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200': tour.status === 'sold_out',
                'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200': tour.status === 'upcoming',
                'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200': tour.status === 'cancelled'
              }"
              class="px-3 py-1 rounded-full text-sm font-medium"
            >
              {{
                tour.status === 'available' ? 'Disponible' :
                tour.status === 'sold_out' ? 'Agotado' :
                tour.status === 'upcoming' ? 'Próximamente' : 'Cancelado'
              }}
            </span>
          </div>
        </div>

        <!-- Image Gallery -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <img
            v-for="(img, i) in tour.imageUrls"
            :key="i"
            :src="img"
            :alt="`${tour.title} - Imagen ${i + 1}`"
            class="w-full h-64 object-cover rounded-lg hover:shadow-lg transition-shadow cursor-pointer"
            @click="openImageModal(img)"
            @error="handleImageError"
          />
        </div>

        <!-- Tour Info Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Left Column - Tour Details -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Host Information -->
            <div class="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
              <h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Guía del Tour</h3>
              <div class="flex items-center space-x-4">
                <div class="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {{ tour.host.firstName.charAt(0) }}{{ tour.host.lastName.charAt(0) }}
                </div>
                <div>
                  <p class="font-medium text-gray-800 dark:text-white">
                    {{ tour.host.firstName }} {{ tour.host.lastName }}
                  </p>
                  <div v-if="tour.averageRating" class="flex items-center text-sm text-gray-600 dark:text-gray-400 mt-1">
                    <span class="text-yellow-500 mr-1">★</span>
                    <span>{{ tour.averageRating.toFixed(1) }}</span>
                    <span class="mx-1">•</span>
                    <span>{{ tour.totalReviews }} {{ tour.totalReviews === 1 ? 'reseña' : 'reseñas' }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Tour Details -->
            <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Detalles del Tour</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div class="flex items-center text-gray-600 dark:text-gray-400">
                  <span class="font-medium text-gray-800 dark:text-white">Precio:</span>
                  <span class="ml-2 text-lg font-semibold text-primary">{{ formatPrice(tour.price) }}</span>
                  <span class="ml-1 text-gray-500">por persona</span>
                </div>
                <div v-if="tour.duration" class="flex items-center text-gray-600 dark:text-gray-400">
                  <span class="font-medium text-gray-800 dark:text-white">Duración:</span>
                  <span class="ml-2">{{ tour.duration }} {{ tour.duration === 1 ? 'día' : 'días' }}</span>
                </div>
                <div v-if="tour.maxCapacity" class="flex items-center text-gray-600 dark:text-gray-400">
                  <span class="font-medium text-gray-800 dark:text-white">Capacidad máxima:</span>
                  <span class="ml-2">{{ tour.maxCapacity }} personas</span>
                </div>
                <div v-if="tour.location" class="flex items-center text-gray-600 dark:text-gray-400">
                  <span class="font-medium text-gray-800 dark:text-white">Ubicación:</span>
                  <span class="ml-2">{{ tour.location }}</span>
                </div>
              </div>
            </div>

            <!-- Amenities/Includes -->
            <div v-if="tour.amenities && tour.amenities.length > 0" class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Qué incluye</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div 
                  v-for="amenity in tour.amenities" 
                  :key="amenity"
                  class="flex items-center text-gray-600 dark:text-gray-400"
                >
                  <span class="text-green-500 mr-2">✓</span>
                  <span>{{ amenity }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column - Booking Card -->
          <div class="lg:col-span-1">
            <div class="sticky top-6">
              <!-- Booking Card -->
              <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <h2 class="text-xl font-semibold text-primary mb-6">Reservar este Tour</h2>

                <!-- Only show booking form if available -->
                <div v-if="tour.status === 'available'">
                  <!-- Date Picker -->
                  <div class="mb-4">
                    <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      Fecha del tour
                    </label>
                    <VueDatePicker
                      v-model="selectedDate"
                      :disabled-dates="bookedDates"
                      :min-date="new Date()"
                      placeholder="Selecciona una fecha"
                      format="dd/MM/yyyy"
                      class="w-full"
                    />
                  </div>

                  <!-- Number of Guests -->
                  <div class="mb-6">
                    <label for="guests" class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      Número de Personas
                    </label>
                    <input
                      id="guests"
                      v-model.number="guests"
                      type="number"
                      min="1"
                      :max="tour.maxCapacity || 20"
                      class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                    />
                    <p v-if="tour.maxCapacity" class="text-xs text-gray-500 mt-1">
                      Máximo {{ tour.maxCapacity }} personas
                    </p>
                  </div>

                  <!-- Price Calculation -->
                  <div v-if="totalPrice > 0" class="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div class="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <span>{{ formatPrice(tour.price) }} × {{ guests }} {{ guests === 1 ? 'persona' : 'personas' }}</span>
                      <span>{{ formatPrice(tour.price * guests) }}</span>
                    </div>
                    <div class="flex justify-between items-center font-semibold text-lg text-gray-800 dark:text-white pt-2 border-t border-gray-200 dark:border-gray-600">
                      <span>Total</span>
                      <span class="text-primary">{{ formatPrice(totalPrice) }}</span>
                    </div>
                  </div>

                  <!-- Book Button -->
                  <button
                    :disabled="!isValidBooking || isSubmitting"
                    class="w-full bg-primary hover:bg-primary-dark text-white px-6 py-4 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                    @click="handleReservation"
                  >
                    {{ isSubmitting ? 'Procesando...' : 'Confirmar Reserva' }}
                  </button>

                  <p class="text-xs text-gray-500 dark:text-gray-400 text-center mt-3">
                    No se te cobrará hasta confirmar la reserva
                  </p>
                </div>

                <!-- Not Available Message -->
                <div v-else class="text-center">
                  <div class="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <p class="text-yellow-800 dark:text-yellow-200 font-medium">
                      {{
                        tour.status === 'sold_out' ? 'Tour agotado' :
                        tour.status === 'upcoming' ? 'Próximamente disponible' :
                        'Tour no disponible'
                      }}
                    </p>
                    <p class="text-yellow-600 dark:text-yellow-300 text-sm mt-1">
                      {{
                        tour.status === 'sold_out' ? 'No hay cupos disponibles para este tour.' :
                        tour.status === 'upcoming' ? 'Este tour estará disponible pronto.' :
                        'Este tour ha sido cancelado.'
                      }}
                    </p>
                  </div>
                  
                  <RouterLink 
                    to="/" 
                    class="block w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white px-6 py-3 rounded-lg font-medium transition mt-4 text-center"
                  >
                    Ver otros tours
                  </RouterLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Image Modal -->
    <div 
      v-if="selectedImage" 
      class="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50" 
      @click="closeImageModal"
    >
      <div class="relative max-w-4xl max-h-full">
        <img
          :src="selectedImage"
          :alt="tour?.title"
          class="max-w-full max-h-full object-contain rounded-lg"
          @click.stop
        />
        <button
          class="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/70 transition"
          @click="closeImageModal"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { getPublicTourById, type PublicTour } from '@/services/publicTourService'
import { createBooking } from '@/services/bookingService'
import { useAuth } from '@/composables/useAuth'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import Swal from 'sweetalert2'

const route = useRoute()
const router = useRouter()
const { user } = useAuth()

// Reactive data
const tour = ref<PublicTour | null>(null)
const loading = ref(true)
const isSubmitting = ref(false)
const selectedDate = ref<Date | null>(null)
const guests = ref(1)
const selectedImage = ref<string | null>(null)

// Mock booked dates - en producción esto vendría de la API
const bookedDates = [
  new Date('2025-06-02'),
  new Date('2025-06-08'),
  new Date('2025-06-14'),
  new Date('2025-06-20')
]

// Computed properties
const isValidBooking = computed(() =>
  !!selectedDate.value && 
  guests.value > 0 && 
  tour.value?.status === 'available' &&
  (!tour.value?.maxCapacity || guests.value <= tour.value.maxCapacity)
)

const totalPrice = computed(() => {
  if (!tour.value || !guests.value) return 0
  return tour.value.price * guests.value
})

/**
 * Load tour data
 */
onMounted(async () => {
  try {
    loading.value = true
    const tourId = route.params.id as string
    
    console.log('🔍 Loading tour:', tourId)
    tour.value = await getPublicTourById(tourId)
    
    if (!tour.value) {
      console.warn('❌ Tour not found:', tourId)
    } else {
      console.log('✅ Tour loaded:', tour.value.title)
    }
  } catch (error) {
    console.error('❌ Error fetching tour:', error)
    tour.value = null
  } finally {
    loading.value = false
  }
})

/**
 * Handle tour reservation
 */
const handleReservation = async () => {
  // Check if user is logged in
  if (!user.value) {
    Swal.fire({
      title: 'Inicia sesión',
      text: 'Debes iniciar sesión para realizar una reserva.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Iniciar sesión',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        router.push('/login')
      }
    })
    return
  }

  if (!isValidBooking.value || !tour.value || !selectedDate.value) {
    console.warn('❌ Invalid booking data')
    return
  }

  try {
    isSubmitting.value = true
    
    // One day tour, different hours
    const tourDate = new Date(selectedDate.value)
    const checkOutDate = new Date(selectedDate.value)
    
    // Set times so checkOut be after checkIn same day
    tourDate.setHours(9, 0, 0, 0)     // CheckIn: 9:00 AM
    checkOutDate.setHours(18, 0, 0, 0) // CheckOut: 6:00 PM same day
    
    // Create booking
    await createBooking({
      user: user.value._id,
      tourPackage: tour.value._id,
      checkIn: tourDate,
      checkOut: checkOutDate, // Same day for single-day tours
      guests: guests.value,
      status: 'pending',
      totalPrice: totalPrice.value,
      paymentStatus: 'pending'
    })

    Swal.fire({
      title: '¡Reserva creada!',
      text: 'Tu reserva ha sido enviada con éxito. Recibirás una confirmación pronto.',
      icon: 'success'
    }).then(() => {
      // Reset form
      selectedDate.value = null
      guests.value = 1
    })
    
  } catch (error) {
    console.error('❌ Booking error:', error)
    Swal.fire({
      title: 'Error',
      text: 'Hubo un error al procesar la reserva. Inténtalo de nuevo.',
      icon: 'error'
    })
  } finally {
    isSubmitting.value = false
  }
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
 * Handle image errors
 */
const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.src = 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80'
}

/**
 * Image modal functions
 */
const openImageModal = (imageUrl: string) => {
  selectedImage.value = imageUrl
}

const closeImageModal = () => {
  selectedImage.value = null
}
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

/* Responsive adjustments */
@media (max-width: 768px) {
  .sticky {
    position: relative;
    top: 0;
  }
}
</style>