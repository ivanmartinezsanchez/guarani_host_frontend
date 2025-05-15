<template>
  <div class="max-w-7xl mx-auto p-6">
    <h1 class="text-3xl font-bold text-primary mb-6 text-center">Reservas Recibidas</h1>

    <!-- Export and Filters -->
    <div class="flex flex-wrap justify-between items-center gap-4 mb-4">
      <div class="flex items-center gap-2">
        <label class="text-sm">Status:</label>
        <select v-model="filter.paymentStatus" class="input text-sm">
          <option value="">Todas</option>
          <option value="pending">Pendientes</option>
          <option value="paid">Pagado</option>
          <option value="refunded">Reembolsado</option>
        </select>
      </div>
      <button
        @click="exportPDF"
        class="bg-primary hover:bg-hover text-white px-4 py-2 rounded"
      >
        Export PDF
      </button>
    </div>

    <!-- Booking Table -->
    <div class="bg-white dark:bg-gray-800 p-4 rounded shadow-md overflow-x-auto">
      <table class="min-w-full table-auto text-sm">
        <thead class="bg-gray-100 dark:bg-gray-700">
          <tr class="text-left">
            <th class="px-4 py-2">Guest</th>
            <th class="px-4 py-2">Tipo</th>
            <th class="px-4 py-2">Nombre</th>
            <th class="px-4 py-2">Fechas</th>
            <th class="px-4 py-2">Número de Personas</th>
            <th class="px-4 py-2">Status</th>
            <th class="px-4 py-2">Pago</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="booking in bookings"
            :key="booking._id"
            class="border-b dark:border-gray-600"
          >
            <td class="px-4 py-2">{{ resolveUser(booking.user) }}</td>
            <td class="px-4 py-2">{{ booking.property ? 'Property' : 'Tour' }}</td>
            <td class="px-4 py-2">{{ resolveName(booking) }}</td>
            <td class="px-4 py-2">
              {{ formatDate(booking.checkIn) }} → {{ formatDate(booking.checkOut) }}
            </td>
            <td class="px-4 py-2">{{ booking.guests }}</td>
            <td class="px-4 py-2 capitalize">{{ booking.status }}</td>
            <td class="px-4 py-2 capitalize">{{ booking.paymentStatus }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import Swal from 'sweetalert2'
import { getHostBookings, exportHostBookingsToPDF, type Booking } from '../services/hostBookingService'

const bookings = ref<Booking[]>([])
const filter = ref({ paymentStatus: '' })

// Fetch bookings on mount and when filter changes
const fetchBookings = async () => {
  try {
    const params = filter.value.paymentStatus ? { paymentStatus: filter.value.paymentStatus } : {}
    bookings.value = await getHostBookings()
    if (params.paymentStatus) {
      bookings.value = bookings.value.filter((b: Booking) => b.paymentStatus === params.paymentStatus)
    }
  } catch (err) {
    console.error('Error loading bookings:', err)
    Swal.fire('Error', 'Could not load bookings', 'error')
  }
}

onMounted(fetchBookings)
watch(() => filter.value.paymentStatus, fetchBookings)

// Export bookings to PDF
const exportPDF = async () => {
  try {
    await exportHostBookingsToPDF(filter.value)
  } catch (err) {
    console.error('Error exporting PDF:', err)
    Swal.fire('Error', 'Could not export PDF', 'error')
  }
}

const formatDate = (date: Date | string) => new Date(date).toLocaleDateString()
const resolveUser = (user: any) => typeof user === 'object' ? user.email : 'N/A'
const resolveName = (booking: Booking) =>
  typeof booking.property === 'object'
    ? booking.property.title
    : typeof booking.tourPackage === 'object'
    ? booking.tourPackage.title
    : '---'
</script>

<style scoped>
.input {
  @apply w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-900 dark:text-white;
}
.bg-primary {
  background-color: #3F51B5;
}
.text-primary {
  color: #3F51B5;
}
.hover\:bg-hover:hover {
  background-color: #303F9F;
}
</style>
