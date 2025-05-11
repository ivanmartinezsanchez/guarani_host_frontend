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

      <!-- Details -->
      <div class="text-lg text-gray-800 dark:text-gray-200 space-y-2">
        <p><strong>Price per night:</strong> ${{ property.pricePerNight }}</p>
        <p><strong>Availability:</strong> {{ property.status === 'available' ? 'Available' : 'Unavailable' }}</p>
      </div>

      <!-- Booking -->
      <div class="mt-8 space-y-4">
        <h2 class="text-xl font-semibold text-primary">Reserve Dates</h2>

        <VueDatePicker
          v-model="dateRange"
          range
          format="yyyy-MM-dd"
          :disabled-dates="bookedDates"
          placeholder="Select a date range"
          class="w-full max-w-md"
        />

        <div class="mt-2 max-w-xs">
          <label for="guests" class="block text-sm font-medium mb-1 text-gray-700 dark:text-white">
            Number of guests
          </label>
          <input
            id="guests"
            v-model.number="guests"
            type="number"
            min="1"
            class="input"
          />
        </div>

        <button
          :disabled="!isValidBooking"
          class="bg-primary hover:bg-hover text-white px-6 py-2 rounded-full transition disabled:opacity-50"
          @click="handleReservation"
        >
          Confirm Booking
        </button>
      </div>
    </div>

    <div v-else class="text-center py-20 text-gray-500 dark:text-gray-400">
      Loading property details...
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getProperties, type Property } from '@/services/propertyService'
import { createBooking } from '@/services/bookingService'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import Swal from 'sweetalert2'

const route = useRoute()
const router = useRouter()
const property = ref<Property | null>(null)
const dateRange = ref<[Date, Date] | null>(null)
const guests = ref(1)

const bookedDates = [
  new Date('2025-06-01'),
  new Date('2025-06-05'),
  new Date('2025-06-12')
]

const isValidBooking = computed(() =>
  !!dateRange.value && dateRange.value.length === 2 && guests.value > 0
)

onMounted(async () => {
  try {
    const allProperties = await getProperties()
    property.value = allProperties.find(p => p._id === route.params.id) || null
  } catch (error) {
    console.error('Error fetching property:', error)
  }
})

async function handleReservation() {
  const userStr = localStorage.getItem('user')
  if (!userStr) {
    Swal.fire('Inicia sesión', 'Debes iniciar sesión para reservar.', 'warning')
    router.push('/login')
    return
  }

  const user = JSON.parse(userStr)
  const [checkIn, checkOut] = dateRange.value!

  try {
    await createBooking({
      user: user._id,
      property: property.value!._id!,
      checkIn,
      checkOut,
      guests: guests.value,
      status: 'pending',
      totalPrice: property.value!.pricePerNight * guests.value,
      paymentStatus: 'pending'
    })

    Swal.fire('Reserva creada', 'Tu reserva ha sido enviada con éxito.', 'success')
    dateRange.value = null
    guests.value = 1
  } catch (error) {
    console.error('Booking error:', error)
    Swal.fire('Error', 'Hubo un error al procesar la reserva.', 'error')
  }
}
</script>

<style scoped>
.text-primary {
  color: #3F51B5;
}
.bg-primary {
  background-color: #3F51B5;
}
.hover\:bg-hover:hover {
  background-color: #303F9F;
}
.input {
  @apply w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-900 dark:text-white;
}
</style>
