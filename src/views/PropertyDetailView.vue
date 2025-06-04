<template>
  <section class="max-w-5xl mx-auto p-6">
    <div v-if="property" class="space-y-6">
      <h1 class="text-3xl font-bold text-primary">{{ property.title }}</h1>
      <p class="text-gray-700 dark:text-gray-300 text-lg">{{ property.city }} · {{ property.address }}</p>

      <!-- Gallery -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <img
          v-for="(img, i) in property.imageUrls"
          :key="i"
          :src="img"
          alt="Property image"
          class="w-full h-64 object-cover rounded"
        />
      </div>

      <!-- Host Info -->
      <div class="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
        <h3 class="text-lg font-semibold mb-2">Anfitrión</h3>
        <div class="flex items-center space-x-3">
          <div class="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">
            {{ property.host.firstName.charAt(0) }}{{ property.host.lastName.charAt(0) }}
          </div>
          <div>
            <p class="font-medium">{{ property.host.firstName }} {{ property.host.lastName }}</p>
            <div v-if="property.averageRating" class="flex items-center text-sm text-gray-600">
              <span class="text-yellow-500">★</span>
              <span class="ml-1">{{ property.averageRating }} ({{ property.totalReviews }} reseñas)</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Description -->
      <div>
        <h3 class="text-lg font-semibold mb-2">Descripción</h3>
        <p class="text-gray-700 dark:text-gray-300">{{ property.description }}</p>
      </div>

      <!-- Amenities -->
      <div v-if="property.amenities?.length">
        <h3 class="text-lg font-semibold mb-2">Comodidades</h3>
        <div class="flex flex-wrap gap-2">
          <span 
            v-for="amenity in property.amenities" 
            :key="amenity"
            class="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
          >
            {{ amenity }}
          </span>
        </div>
      </div>

      <!-- Details -->
      <div class="text-lg text-gray-800 dark:text-gray-200 space-y-2">
        <p><strong>Precio por Noche:</strong> €{{ property.pricePerNight?.toLocaleString() }}</p>
        <p><strong>Disponibilidad:</strong> 
          <span :class="property.status === 'available' ? 'text-green-600' : 'text-red-600'">
            {{ property.status === 'available' ? 'Disponible' : 'No disponible' }}
          </span>
        </p>
      </div>

      <!-- Booking Section - Only if available -->
      <div v-if="property.status === 'available'" class="mt-8 space-y-4">
        <h2 class="text-xl font-semibold text-primary">Reservar</h2>

        <VueDatePicker
          v-model="dateRange"
          range
          format="yyyy-MM-dd"
          :disabled-dates="bookedDates"
          placeholder="Selecciona fechas"
          class="w-full max-w-md"
        />

        <div class="mt-2 max-w-xs">
          <label for="guests" class="block text-sm font-medium mb-1 text-gray-700 dark:text-white">
            Número de huéspedes
          </label>
          <input
            id="guests"
            v-model.number="guests"
            type="number"
            min="1"
            max="10"
            class="input"
          />
        </div>

        <div v-if="totalPrice > 0" class="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <p class="text-lg font-semibold">
            Total: €{{ totalPrice.toLocaleString() }}
            <span class="text-sm text-gray-600 dark:text-gray-400">
              ({{ numberOfNights }} {{ numberOfNights === 1 ? 'noche' : 'noches' }})
            </span>
          </p>
        </div>

        <button
          :disabled="!isValidBooking"
          class="bg-primary hover:bg-hover text-white px-6 py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          @click="handleReservation"
        >
          {{ isSubmitting ? 'Procesando...' : 'Confirmar Reserva' }}
        </button>
      </div>

      <!-- Not available message -->
      <div v-else class="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <p class="text-yellow-800 dark:text-yellow-200">
          Esta propiedad no está disponible para reservas en este momento.
        </p>
      </div>
    </div>

    <div v-else-if="loading" class="text-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      <p class="mt-4 text-gray-500 dark:text-gray-400">Cargando detalles de la propiedad...</p>
    </div>

    <div v-else class="text-center py-20 text-gray-500 dark:text-gray-400">
      <h2 class="text-xl font-semibold mb-2">Propiedad no encontrada</h2>
      <p>La propiedad que buscas no existe o no está disponible.</p>
      <RouterLink 
        to="/" 
        class="inline-block mt-4 text-primary hover:underline"
      >
        Volver al inicio
      </RouterLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getPublicPropertyById, type PublicProperty } from '@/services/publicPropertyService'
import { createBooking } from '@/services/bookingService'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import Swal from 'sweetalert2'

const route = useRoute()
const router = useRouter()
const property = ref<PublicProperty | null>(null)
const loading = ref(true)
const isSubmitting = ref(false)
const dateRange = ref<[Date, Date] | null>(null)
const guests = ref(1)

// Mock booked dates - esto debería venir de la API
const bookedDates = [
  new Date('2025-06-01'),
  new Date('2025-06-05'),
  new Date('2025-06-12')
]

const isValidBooking = computed(() =>
  !!dateRange.value && 
  dateRange.value.length === 2 && 
  guests.value > 0 &&
  property.value?.status === 'available'
)

const numberOfNights = computed(() => {
  if (!dateRange.value || dateRange.value.length !== 2) return 0
  const [checkIn, checkOut] = dateRange.value
  return Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
})

const totalPrice = computed(() => {
  if (!property.value || numberOfNights.value <= 0) return 0
  return property.value.pricePerNight * numberOfNights.value
})

onMounted(async () => {
  try {
    loading.value = true
    const propertyId = route.params.id as string
    
    // Usar el servicio público en lugar del protegido
    property.value = await getPublicPropertyById(propertyId)
    
    if (!property.value) {
      console.warn('Property not found:', propertyId)
    }
  } catch (error) {
    console.error('Error fetching property:', error)
    property.value = null
  } finally {
    loading.value = false
  }
})

async function handleReservation() {
  const userStr = localStorage.getItem('user')
  if (!userStr) {
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

  if (!isValidBooking.value || !property.value || !dateRange.value) return

  const user = JSON.parse(userStr)
  const [checkIn, checkOut] = dateRange.value

  try {
    isSubmitting.value = true
    
    await createBooking({
      user: user._id,
      property: property.value._id,
      checkIn,
      checkOut,
      guests: guests.value,
      status: 'pending',
      totalPrice: totalPrice.value,
      paymentStatus: 'pending'
    })

    Swal.fire({
      title: '¡Reserva creada!',
      text: 'Tu reserva ha sido enviada con éxito. Recibirás una confirmación pronto.',
      icon: 'success'
    })
    
    // Reset form
    dateRange.value = null
    guests.value = 1
  } catch (error) {
    console.error('Booking error:', error)
    Swal.fire({
      title: 'Error',
      text: 'Hubo un error al procesar la reserva. Inténtalo de nuevo.',
      icon: 'error'
    })
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.text-primary {
  color: #4f46e5;
}
.bg-primary {
  background-color: #4f46e5;
}
.hover\:bg-hover:hover {
  background-color: #4338ca;
}
.input {
  @apply w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-900 dark:text-white;
}
</style>