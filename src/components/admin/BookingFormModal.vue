<template>
    <div class="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div class="bg-white dark:bg-gray-900 rounded-xl p-6 w-full max-w-md shadow-xl relative">
        <!-- Modal title -->
        <h2 class="text-xl font-semibold mb-4 text-primary text-center">
          {{ booking._id ? 'Editar reserva' : 'Crear nueva reserva' }}
        </h2>
  
        <!-- Close button -->
        <button @click="$emit('close')" class="absolute top-2 right-2 text-gray-500 hover:text-red-600">
          ✕
        </button>
  
        <!-- Booking Form -->
        <form @submit.prevent="submitForm" class="space-y-4">
          <!-- Select User -->
          <select v-model="form.user" class="input" required>
            <option value="" disabled>Selecciona un usuario</option>
            <option v-for="u in users" :key="u._id" :value="u._id">
              {{ u.firstName }} {{ u.lastName }} ({{ u.email }})
            </option>
          </select>
  
          <!-- Select Property -->
          <select v-model="form.property" class="input" required>
            <option value="" disabled>Selecciona una propiedad</option>
            <option v-for="h in homes" :key="h._id" :value="h._id">
              {{ h.title }} - {{ h.city }}
            </option>
          </select>
  
          <input v-model="form.checkIn" type="date" class="input" required />
          <input v-model="form.checkOut" type="date" class="input" required />
          <input v-model.number="form.guests" type="number" min="1" placeholder="Número de huéspedes" class="input" required />
  
          <select v-model="form.status" class="input" required>
            <option value="pending">Pendiente</option>
            <option value="confirmed">Confirmada</option>
            <option value="cancelled">Cancelada</option>
          </select>
  
          <!-- Action buttons -->
          <div class="flex justify-end gap-4 mt-4">
            <button type="button" @click="$emit('close')" class="px-4 py-2 border rounded text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition">
              Cancelar
            </button>
            <button type="submit" class="bg-primary text-white px-6 py-2 rounded hover:bg-hover transition">
              {{ booking._id ? 'Actualizar' : 'Crear' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, watch, defineProps, defineEmits } from 'vue'
  import { createBooking, updateBooking, type Booking } from '@/services/bookingService'
  import type { User } from '@/services/userService'
  import type { Property } from '@/services/propertyService'
  import Swal from 'sweetalert2'
  
  // Props
  const props = defineProps<{
    booking: Partial<Booking>,
    users: User[],
    properties: Property[],
  }>()
  
  // Emits
  const emit = defineEmits(['close', 'saved'])
  
  // Form State
  const form = ref<Booking>({
    _id: props.booking._id,
    user: props.booking.user || '',
    home: props.booking.property || '',
    checkIn: props.booking.checkIn || '',
    checkOut: props.booking.checkOut || '',
    guests: props.booking.guests || 1,
    status: props.booking.status || 'pending',
  })
  
  // Submit Handler
  const submitForm = async () => {
    try {
      if (form.value._id) {
        await updateBooking(form.value._id, form.value)
        Swal.fire('Actualizado', 'Reserva actualizada correctamente.', 'success')
      } else {
        await createBooking(form.value)
        Swal.fire('Creada', 'Reserva creada con éxito.', 'success')
      }
      emit('saved')
    } catch (error) {
      console.error('Error al guardar reserva:', error)
      Swal.fire('Error', 'No se pudo guardar la reserva.', 'error')
    }
  }
  </script>
  
  <style scoped>
  .input {
    @apply w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-900 dark:text-white;
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
  