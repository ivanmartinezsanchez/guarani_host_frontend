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
              <td class="px-4 py-2">{{ booking.user }}</td>
              <td class="px-4 py-2">{{ booking.home }}</td>
              <td class="px-4 py-2">{{ formatDate(booking.checkIn) }}</td>
              <td class="px-4 py-2">{{ formatDate(booking.checkOut) }}</td>
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
  import { getBookings, type Booking } from '@/services/bookingService'
  
  const bookings = ref<Booking[]>([])
  
  const homeBookings = computed(() =>
    bookings.value.filter(b => b.home && !b.tour)
  )
  
  onMounted(async () => {
    try {
      bookings.value = await getBookings()
    } catch (error) {
      console.error('Error al cargar reservas:', error)
    }
  })
  
  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString()
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
  