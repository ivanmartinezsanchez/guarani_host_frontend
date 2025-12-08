<template>
  <section class="max-w-5xl mx-auto p-6">
    <div v-if="property" class="space-y-6">
      <h1 class="text-3xl font-bold text-primary">
        {{ property.title }}
      </h1>

      <p class="text-gray-700 dark:text-gray-300 text-lg">
        {{ property.city }} · {{ property.address }}
      </p>

      <!-- Image gallery -->
      <div
        v-if="property.imageUrls?.length"
        class="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        <img
          v-for="(img, i) in property.imageUrls"
          :key="i"
          :src="img"
          alt="Property image"
          class="w-full h-64 object-cover rounded"
        />
      </div>

      <!-- Host box (safe initials) -->
      <div
        v-if="property.host"
        class="bg-gray-50 dark:bg-gray-800 rounded-xl p-6"
      >
        <h3 class="text-lg font-semibold mb-2">Anfitrión</h3>
        <div class="flex items-center space-x-3">
          <div
            class="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold"
          >
            {{ (property.host.firstName || '').charAt(0)
            }}{{ (property.host.lastName || '').charAt(0) }}
          </div>
          <div>
            <p class="font-medium">
              {{ property.host.firstName || 'N/A' }}
              {{ property.host.lastName || '' }}
            </p>
            <div
              v-if="property.averageRating"
              class="flex items-center text-sm text-gray-600"
            >
              <span class="text-yellow-500">★</span>
              <span class="ml-1">
                {{ property.averageRating }} ({{ property.totalReviews }}
                reseñas)
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Description -->
      <div v-if="property.description">
        <h3 class="text-lg font-semibold mb-2">Descripción</h3>
        <p class="text-gray-700 dark:text-gray-300">
          {{ property.description }}
        </p>
      </div>

      <!-- Amenities with icons + labels -->
      <div v-if="property.amenities?.length">
        <h3 class="text-lg font-semibold mb-2">Comodidades</h3>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="amenityId in property.amenities"
            :key="amenityId"
            class="inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-100 rounded-full text-sm"
          >
            <component
              v-if="getAmenityDefinition(amenityId).icon"
              :is="getAmenityDefinition(amenityId).icon"
              class="w-3 h-3 mr-1"
            />
            {{ getAmenityDefinition(amenityId).label }}
          </span>
        </div>
      </div>

      <!-- Basic details -->
      <div class="text-lg text-gray-800 dark:text-gray-200 space-y-2">
        <p>
          <strong>Precio por Noche:</strong>
          €{{ property.pricePerNight?.toLocaleString() || 'N/A' }}
        </p>

        <p v-if="property.guests !== undefined">
          <strong>Capacidad máxima:</strong>
          {{ property.guests }} huésped{{ property.guests === 1 ? '' : 'es' }}
        </p>

        <p>
          <strong>Disponibilidad:</strong>
          <span
            :class="
              property.status === 'available'
                ? 'text-green-600'
                : 'text-red-600'
            "
          >
            {{
              property.status === 'available'
                ? 'Disponible'
                : 'No disponible'
            }}
          </span>
        </p>
      </div>

      <!-- Booking form – only if property is available -->
      <div
        v-if="property.status === 'available'"
        class="mt-8 space-y-4"
      >
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
          <label
            for="guests"
            class="block text-sm font-medium mb-1 text-gray-700 dark:text-white"
          >
            Número de huéspedes
          </label>
          <input
            id="guests"
            v-model.number="guests"
            type="number"
            min="1"
            :max="maxGuests"
            class="input"
          />
          <p
            v-if="property?.guests"
            class="mt-1 text-xs text-gray-500 dark:text-gray-400"
          >
            Máximo {{ property.guests }} huésped{{
              property.guests === 1 ? '' : 'es'
            }}.
          </p>
        </div>

        <div
          v-if="totalPrice > 0"
          class="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg"
        >
          <p class="text-lg font-semibold">
            Total: €{{ totalPrice.toLocaleString() }}
            <span
              class="text-sm text-gray-600 dark:text-gray-400"
            >
              ({{ numberOfNights }}
              {{ numberOfNights === 1 ? 'noche' : 'noches' }})
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
      <div
        v-else
        class="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg"
      >
        <p class="text-yellow-800 dark:text-yellow-200">
          Esta propiedad no está disponible para reservas en este momento.
        </p>
      </div>
    </div>

    <!-- Loading state -->
    <div v-else-if="loading" class="text-center py-20">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"
      ></div>
      <p class="mt-4 text-gray-500 dark:text-gray-400">
        Cargando detalles de la propiedad...
      </p>
    </div>

    <!-- Not found state -->
    <div v-else class="text-center py-20 text-gray-500 dark:text-gray-400">
      <h2 class="text-xl font-semibold mb-2">
        Propiedad no encontrada
      </h2>
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
import {
  Wifi,
  Car,
  Coffee,
  Tv,
  Waves,
  Dumbbell,
  UtensilsCrossed,
  WashingMachine,
  AirVent,
  Shield,
  TreePine,
  Thermometer,
  ParkingCircle,
  Baby,
  Cigarette,
  Dog,
  Accessibility,
} from 'lucide-vue-next'
import {
  getPublicPropertyById,
  type PublicProperty,
} from '@/services/publicPropertyService'
import { createBooking } from '@/services/bookingService'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import Swal from 'sweetalert2'

const route = useRoute()
const router = useRouter()

// Reactive state for property and UI
const property = ref<PublicProperty | null>(null)
const loading = ref(true)
const isSubmitting = ref(false)
const dateRange = ref<[Date, Date] | null>(null)
const guests = ref(1)

// Maximum guests allowed in the booking form
const maxGuests = computed(() => property.value?.guests ?? 10)

/**
 * Amenity configuration used on the public details page.
 * Maps amenity IDs from the DB to human labels and icons.
 */
const AMENITY_CONFIG: Record<string, { label: string; icon: any }> = {
  wifi: { label: 'WiFi', icon: Wifi },
  parking: { label: 'Estacionamiento', icon: Car },
  kitchen: { label: 'Cocina', icon: Coffee },
  tv: { label: 'TV', icon: Tv },
  pool: { label: 'Piscina', icon: Waves },
  gym: { label: 'Gimnasio', icon: Dumbbell },
  restaurant: { label: 'Restaurante', icon: UtensilsCrossed },
  laundry: { label: 'Lavandería', icon: WashingMachine },
  air_conditioning: { label: 'Aire Acondicionado', icon: AirVent },
  security: { label: 'Seguridad 24/7', icon: Shield },
  garden: { label: 'Jardín', icon: TreePine },
  heating: { label: 'Calefacción', icon: Thermometer },
  valet_parking: { label: 'Valet Parking', icon: ParkingCircle },
  baby_friendly: { label: 'Apto para Bebés', icon: Baby },
  smoking_allowed: { label: 'Permitido Fumar', icon: Cigarette },
  pet_friendly: { label: 'Acepta Mascotas', icon: Dog },
  accessible: { label: 'Accesible', icon: Accessibility },
}

/**
 * Returns amenity definition (label + icon) for a given ID.
 * Falls back to raw ID text when unknown.
 */
const getAmenityDefinition = (id: string) => {
  return AMENITY_CONFIG[id] ?? { label: id, icon: null }
}

// Temporary mock: booked dates should eventually come from API
const bookedDates = [
  new Date('2025-06-01'),
  new Date('2025-06-05'),
  new Date('2025-06-12'),
]

// Booking validation
const isValidBooking = computed(
  () =>
    !!dateRange.value &&
    dateRange.value.length === 2 &&
    guests.value > 0 &&
    guests.value <= maxGuests.value &&
    property.value?.status === 'available',
)

// Number of nights between selected dates
const numberOfNights = computed(() => {
  if (!dateRange.value || dateRange.value.length !== 2) return 0
  const [checkIn, checkOut] = dateRange.value
  return Math.ceil(
    (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24),
  )
})

// Total price for the selected stay
const totalPrice = computed(() => {
  if (!property.value || numberOfNights.value <= 0) return 0
  return property.value.pricePerNight * numberOfNights.value
})

// Load property details on mount
onMounted(async () => {
  try {
    loading.value = true
    const propertyId = route.params.id as string

    console.log('🏠 Loading property with ID:', propertyId)

    property.value = await getPublicPropertyById(propertyId)

    if (!property.value) {
      console.warn('❌ Property not found:', propertyId)
    } else {
      console.log('✅ Property loaded successfully:', property.value.title)
    }
  } catch (error) {
    console.error('❌ Error fetching property:', error)
    property.value = null
  } finally {
    loading.value = false
  }
})

/* ---------------- SUBMIT RESERVATION ---------------- */
async function handleReservation() {
  // Read logged-in user from sessionStorage (same place as login)
  const userStr = sessionStorage.getItem('user')

  // If not logged in, show modal and redirect to login only if confirmed
  if (!userStr) {
    const result = await Swal.fire({
      title: 'Inicia sesión',
      text: 'Debes iniciar sesión para reservar.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Iniciar sesión',
      cancelButtonText: 'Cancelar',
    })

    if (result.isConfirmed) {
      await router.push('/login')
    }

    // Important: stop here if user is not authenticated
    return
  }

  // Validate form one more time on submit
  if (!isValidBooking.value || !property.value || !dateRange.value) {
    await Swal.fire(
      'Datos incompletos',
      'Selecciona fechas válidas y número de huéspedes.',
      'warning',
    )
    return
  }

  const user = JSON.parse(userStr) as { _id: string }
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
      paymentStatus: 'pending',
    })

    await Swal.fire(
      '¡Reserva creada!',
      'Tu reserva fue enviada correctamente.',
      'success',
    )

    // Reset booking state after success
    dateRange.value = null
    guests.value = 1
  } catch (err) {
    console.error('Booking failed:', err)
    await Swal.fire(
      'Error',
      'No se pudo crear la reserva. Inténtalo de nuevo.',
      'error',
    )
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
