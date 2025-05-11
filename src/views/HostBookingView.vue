<template>
    <div class="max-w-7xl mx-auto p-6">
      <h1 class="text-3xl font-bold text-primary mb-6">Reservas Recibidas</h1>
  
      <div class="bg-white dark:bg-gray-800 p-4 rounded shadow-md overflow-x-auto">
        <table class="min-w-full table-auto text-sm">
          <thead>
            <tr class="text-left bg-gray-100 dark:bg-gray-700">
              <th class="px-4 py-2">Huésped</th>
              <th class="px-4 py-2">Tipo</th>
              <th class="px-4 py-2">Nombre</th>
              <th class="px-4 py-2">Fechas</th>
              <th class="px-4 py-2">Huéspedes</th>
              <th class="px-4 py-2">Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="booking in hostBookings"
              :key="booking._id"
              class="border-b dark:border-gray-600"
            >
              <td class="px-4 py-2">{{ booking.user?.email || 'Sin datos' }}</td>
              <td class="px-4 py-2">
                {{ booking.home ? 'Propiedad' : 'Tour' }}
              </td>
              <td class="px-4 py-2">
                {{ booking.home?.title || booking.tour?.title || '---' }}
              </td>
              <td class="px-4 py-2">
                {{ booking.checkIn }} → {{ booking.checkOut }}
              </td>
              <td class="px-4 py-2">{{ booking.guests }}</td>
              <td class="px-4 py-2 capitalize">{{ booking.status }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { getBookings } from '@/services/bookingService'
  import type { Booking } from '@/services/bookingService'
  
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const allBookings = ref<Booking[]>([])
  const hostBookings = ref<Booking[]>([])
  
  onMounted(async () => {
    try {
      const bookings = await getBookings()
      // Filtramos las reservas que correspondan a propiedades o tours creados por el host
      hostBookings.value = bookings.filter(b =>
        b.home?.owner === user._id || b.tour?.createdBy === user._id
      )
    } catch (error) {
      console.error('Error al obtener reservas:', error)
    }
  })
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
  </style>
  