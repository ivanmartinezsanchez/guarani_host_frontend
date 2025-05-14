<template>
  <div class="max-w-7xl mx-auto p-6">
    <!-- Page Title -->
    <h1 class="text-3xl font-bold text-primary mb-6 text-center">Received Bookings</h1>

    <!-- Filters and Export -->
    <div class="flex flex-wrap justify-between items-center gap-4 mb-6">
      <div class="flex items-center gap-2">
        <label class="text-sm font-medium">Payment Status:</label>
        <select v-model="paymentStatus" class="input text-sm">
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>
      <div class="flex gap-2 items-center">
        <input type="date" v-model="fromDate" class="input text-sm" />
        <input type="date" v-model="toDate" class="input text-sm" />
        <button @click="exportPDF" class="bg-primary hover:bg-hover text-white px-4 py-2 rounded">
          Export PDF
        </button>
      </div>
    </div>

    <!-- Booking Table -->
    <div class="bg-white dark:bg-gray-800 p-4 rounded shadow-md overflow-x-auto">
      <table class="min-w-full table-auto text-sm">
        <thead>
          <tr class="text-left bg-gray-100 dark:bg-gray-700">
            <th class="px-4 py-2">Guest</th>
            <th class="px-4 py-2">Type</th>
            <th class="px-4 py-2">Name</th>
            <th class="px-4 py-2">Dates</th>
            <th class="px-4 py-2">Guests</th>
            <th class="px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="booking in filteredBookings"
            :key="booking._id"
            class="border-b dark:border-gray-600"
          >
            <td class="px-4 py-2">{{ resolveUserEmail(booking.user) }}</td>
            <td class="px-4 py-2">{{ booking.property ? 'Property' : 'Tour' }}</td>
            <td class="px-4 py-2">{{ resolveBookingTitle(booking) }}</td>
            <td class="px-4 py-2">{{ formatDate(booking.checkIn) }} → {{ formatDate(booking.checkOut) }}</td>
            <td class="px-4 py-2">{{ booking.guests }}</td>
            <td class="px-4 py-2 capitalize">{{ booking.status }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { getBookingsPDF, getBookings } from '@/services/hostBookingService'
import type { Booking } from '@/types/models'
import { format } from 'date-fns'
import Swal from 'sweetalert2'

// State
const allBookings = ref<Booking[]>([])
const paymentStatus = ref('')
const fromDate = ref('')
const toDate = ref('')

const user = JSON.parse(localStorage.getItem('user') || '{}')

// Fetch all bookings on mount
onMounted(async () => {
  try {
    allBookings.value = await getBookings()
  } catch (error) {
    console.error('Error loading bookings:', error)
  }
})

// Filtered bookings based on host ownership
const filteredBookings = computed(() => {
  return allBookings.value.filter(b => {
    const isMine =
      (typeof b.property !== 'string' && b.property?.host === user._id) ||
      (typeof b.tourPackage !== 'string' && b.tourPackage?.host === user._id)

    const statusMatch = paymentStatus.value ? b.paymentStatus === paymentStatus.value : true
    const dateMatch = fromDate.value && toDate.value
      ? new Date(b.checkIn) >= new Date(fromDate.value) && new Date(b.checkOut) <= new Date(toDate.value)
      : true

    return isMine && statusMatch && dateMatch
  })
})

// Resolve user email
const resolveUserEmail = (user: any): string => {
  if (!user || typeof user === 'string') return 'Unknown'
  return user.email || 'Unknown'
}

// Resolve booking title
const resolveBookingTitle = (b: Booking): string => {
  if (b.property && typeof b.property !== 'string') return b.property.title
  if (b.tourPackage && typeof b.tourPackage !== 'string') return b.tourPackage.title
  return '---'
}

// Format date
const formatDate = (d: Date | string) => format(new Date(d), 'dd MMM yyyy')

// Export bookings to PDF
async function exportPDF() {
  try {
    const blob = await getBookingsPDF({
      from: fromDate.value,
      to: toDate.value,
      paymentStatus: paymentStatus.value
    })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `host-bookings-${new Date().toISOString().split('T')[0]}.pdf`
    link.click()
  } catch (error) {
    Swal.fire('Error', 'Failed to export bookings', 'error')
  }
}
</script>

<style scoped>
.input {
  @apply px-3 py-2 rounded border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-900 dark:text-white;
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


