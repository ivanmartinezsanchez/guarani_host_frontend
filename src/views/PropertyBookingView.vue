<template>
  <div class="max-w-7xl mx-auto p-6">
    <h1 class="text-3xl font-bold mb-6">Reservas de Propiedades</h1>

    <div class="bg-white dark:bg-gray-800 rounded shadow p-4 overflow-x-auto">
      <table class="min-w-full table-auto text-sm">
        <thead>
          <tr class="text-left bg-gray-100 dark:bg-gray-700">
            <th class="px-4 py-2">ID Usuario</th>
            <th class="px-4 py-2">ID Propiedad</th>
            <th class="px-4 py-2">Check-in</th>
            <th class="px-4 py-2">Check-out</th>
            <th class="px-4 py-2">Huéspedes</th>
            <th class="px-4 py-2">Estado</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="booking in homeBookings"
            :key="booking._id"
            class="border-b dark:border-gray-600"
          >
            <td class="px-4 py-2">{{ resolveUser(booking.user) }}</td>
            <td class="px-4 py-2">{{ resolveProperty(booking.property) }}</td>
            <td class="px-4 py-2">{{ formatDate(booking.checkIn) }}</td>
            <td class="px-4 py-2">{{ formatDate(booking.checkOut) }}</td>
            <td class="px-4 py-2">{{ booking.property ? resolveProperty(booking.property) : 'Sin propiedad' }}</td>
            <td class="px-4 py-2 capitalize">{{ booking.status }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { getUserBookings as getBookings } from '@/services/bookingService'

interface Booking {
  _id: string
  user: {
    firstName: string
    lastName: string
  }
  property?: {
    title: string
    city: string
  }
  tourPackage?: {
    title: string
    location: string
  }
  checkIn: Date
  checkOut: Date
  guests: number
  status: 'pending' | 'confirmed' | 'cancelled'
  totalPrice: number
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
}

const bookings = ref<Booking[]>([])

onMounted(async () => {
  try {
    bookings.value = await getBookings()
  } catch (error) {
    console.error('Error al cargar reservas:', error)
  }
})

// Filter bookings that belong to properties (not tours)
const homeBookings = computed(() =>
  bookings.value.filter((b: Booking) => b.property && !b.tourPackage)
)

// Format Date safely
function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString()
}

// Display user name or ID
function resolveUser(user: Booking['user']) {
  if (typeof user === 'string') return user
  return `${user.firstName} ${user.lastName}`
}

// Display property title or ID
function resolveProperty(property: Booking['property']) {
  if (!property) return 'Sin propiedad'
  if (typeof property === 'string') return property
  return `${property.title} - ${property.city}`
}

</script>

<style scoped>
.text-primary {
  color: #3F51B5;
}
.bg-primary {
  background-color: #3F51B5;
}
</style>
