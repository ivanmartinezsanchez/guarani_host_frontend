<template>
  <section class="max-w-5xl mx-auto p-6">
    <div v-if="tour" class="space-y-6">
      <!-- Title and description -->
      <h1 class="text-3xl font-bold text-primary">{{ tour.title }}</h1>
      <p class="text-gray-700 dark:text-gray-300 text-lg">{{ tour.description }}</p>

      <!-- Gallery -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <img
          v-for="(img, i) in tour.imageUrls"
          :key="i"
          :src="img"
          alt="Tour image"
          class="w-full h-64 object-cover rounded"
        />
      </div>

      <!-- Details -->
      <div class="text-lg text-gray-800 dark:text-gray-200 space-y-2">
        <p><strong>Precio:</strong> ${{ tour.price }}</p>
        <p>
          <strong>Status:</strong>
          <span
            :class="{
              'text-green-500': tour.status === 'available',
              'text-red-500': tour.status === 'sold out',
              'text-yellow-500': tour.status === 'upcoming',
              'text-gray-500': tour.status === 'cancelled'
            }"
          >
            {{
              tour.status === 'available' ? 'Disponible' :
              tour.status === 'sold out' ? 'Agotado' :
              tour.status === 'upcoming' ? 'Próximamente' : 'Cancelado'
            }}
          </span>
        </p>
        <p>
          <strong>Estado del Pago:</strong>
          <span
            :class="{
              'text-green-500': tour.paymentStatus === 'paid',
              'text-yellow-500': tour.paymentStatus === 'pending',
              'text-red-500': tour.paymentStatus === 'failed',
              'text-gray-500': tour.paymentStatus === 'refunded'
            }"
          >
            {{
              tour.paymentStatus === 'paid' ? 'Pagado' :
              tour.paymentStatus === 'pending' ? 'Pendiente' :
              tour.paymentStatus === 'failed' ? 'Fallido' : 'Reembolsado'
            }}
          </span>
        </p>
      </div>

      <!-- Reservation -->
      <div class="mt-8 space-y-4">
        <h2 class="text-xl font-semibold text-primary">Reserva este Tour</h2>

        <VueDatePicker
          v-model="dateRange"
          range
          format="yyyy-MM-dd"
          :disabled-dates="bookedDates"
          placeholder="Selecciona un rango de fechas"
          class="w-full max-w-md"
        />

        <!-- Guest input -->
        <div class="mt-2 max-w-xs">
          <label for="guests" class="block text-sm font-medium mb-1 text-gray-700 dark:text-white">
            Número de Personas
          </label>
          <input
            id="guests"
            v-model.number="guests"
            type="number"
            min="1"
            class="input"
          />
        </div>

        <!-- Confirm button -->
        <button
          :disabled="!isValidBooking"
          class="bg-primary hover:bg-hover text-white px-6 py-2 rounded-full transition disabled:opacity-50"
          @click="handleReservation"
        >
          Confirmar Reserva
        </button>
      </div>
    </div>

    <div v-else class="text-center py-20 text-gray-500 dark:text-gray-400">
      Cargando detalles del Tour...
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getTours, type Tour } from '@/services/tourService'
import { createBooking } from '@/services/bookingService'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import Swal from 'sweetalert2'

const route = useRoute()
const router = useRouter()
const tour = ref<Tour | null>(null)
const dateRange = ref<[Date, Date] | null>(null)
const guests = ref(1)

const bookedDates = [
  new Date('2025-06-02'),
  new Date('2025-06-08'),
  new Date('2025-06-14')
]

const isValidBooking = computed(() =>
  !!dateRange.value && dateRange.value.length === 2 && guests.value > 0
)

onMounted(async () => {
  try {
    const allTours = await getTours()
    tour.value = allTours.find(t => t._id === (route.params.id as string)) || null
  } catch (error) {
    console.error('Error al cargar el tour:', error)
  }
})

async function handleReservation() {
  const userStr = localStorage.getItem('user')
  if (!userStr) {
    Swal.fire('Debes iniciar sesión', 'Inicia sesión para hacer una reserva.', 'warning')
    router.push('/login')
    return
  }

  const user = JSON.parse(userStr)
  const [checkIn, checkOut] = dateRange.value!

  try {
    await createBooking({
      user: user._id,
      tourPackage: tour.value!._id!,
      checkIn,
      checkOut,
      guests: guests.value,
      status: 'pending',
      totalPrice: tour.value!.price * guests.value,
      paymentStatus: 'pending'
    })

    Swal.fire('Reserva enviada', 'Tu reserva ha sido procesada con éxito.', 'success')
    dateRange.value = null
    guests.value = 1
  } catch (error) {
    console.error('Booking error:', error)
    Swal.fire('Error', 'Hubo un problema con la reserva.', 'error')
  }
}
</script>

<style lang="postcss" scoped>
.text-primary {
  color: #3f51b5;
}
.bg-primary {
  background-color: #3f51b5;
}
.hover\:bg-hover:hover {
  background-color: #303f9f;
}
.input {
  @apply w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-900 dark:text-white;
}
</style>
