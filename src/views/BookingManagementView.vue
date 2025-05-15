<template>
  <div class="max-w-7xl mx-auto p-6">
    <h1 class="text-3xl font-bold text-primary mb-8 text-center">Gestión de Reservas</h1>

    <!-- Filter bar -->
    <div class="flex flex-wrap justify-between items-center gap-4 mb-6">
      <div class="flex items-center gap-2">
        <CalendarCheckIcon class="w-6 h-6 text-primary" />
        <h2 class="text-xl font-semibold">Lista de reservas</h2>
      </div>
      <div class="flex gap-2 items-center">
        <select v-model="selectedStatus" class="input text-sm">
          <option value="">Todos los estados</option>
          <option value="pending">Pendiente</option>
          <option value="confirmed">Confirmada</option>
          <option value="cancelled">Cancelada</option>
        </select>
        <button @click="openModal" class="bg-primary hover:bg-hover text-white px-4 py-2 rounded flex items-center gap-1">
          <PlusIcon class="w-5 h-5" /> Agregar
        </button>
      </div>
    </div>

    <!-- Mobile view -->
    <div class="grid gap-4 sm:hidden">
      <div v-for="booking in filteredBookings" :key="booking._id" class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md space-y-2">
        <div class="font-semibold">{{ resolveUserName(booking.user) }}</div>
        <div class="text-sm text-gray-500 dark:text-gray-300">{{ resolvePropertyTitle(booking.property) }}</div>
        <div class="text-sm">Check-in: {{ formatDate(booking.checkIn) }}</div>
        <div class="text-sm">Check-out: {{ formatDate(booking.checkOut) }}</div>
        <div>
          <span :class="statusBadge(booking.status)" class="text-xs font-semibold px-2 py-1 rounded">
            {{ booking.status }}
          </span>
        </div>
        <div class="flex gap-3 mt-2">
          <button @click="editBooking(booking)" class="text-blue-500 hover:text-blue-700"><PencilIcon class="w-5 h-5" /></button>
          <button @click="confirmDelete(booking._id!)" class="text-red-500 hover:text-red-700"><Trash2Icon class="w-5 h-5" /></button>
        </div>
      </div>
    </div>

    <!-- Desktop table view -->
    <div class="hidden sm:block bg-white dark:bg-gray-800 p-4 rounded shadow-md">
      <table class="min-w-full table-auto text-sm">
        <thead class="bg-gray-100 dark:bg-gray-700">
          <tr>
            <th class="px-4 py-2 text-left">Usuario</th>
            <th class="px-4 py-2 text-left">Propiedad</th>
            <th class="px-4 py-2 text-left">Check-in</th>
            <th class="px-4 py-2 text-left">Check-out</th>
            <th class="px-4 py-2 text-left">Estado</th>
            <th class="px-4 py-2 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="booking in filteredBookings" :key="booking._id" class="border-b dark:border-gray-600">
            <td class="px-4 py-2">{{ resolveUserName(booking.user) }}</td>
            <td class="px-4 py-2">{{ resolvePropertyTitle(booking.property) }}</td>
            <td class="px-4 py-2">{{ formatDate(booking.checkIn) }}</td>
            <td class="px-4 py-2">{{ formatDate(booking.checkOut) }}</td>
            <td class="px-4 py-2">
              <span :class="statusBadge(booking.status)" class="text-xs font-semibold px-2 py-1 rounded">
                {{ booking.status }}
              </span>
            </td>
            <td class="px-4 py-2 flex gap-2">
              <button @click="editBooking(booking)" class="text-blue-500 hover:text-blue-700"><PencilIcon class="w-5 h-5" /></button>
              <button @click="confirmDelete(booking._id!)" class="text-red-500 hover:text-red-700"><Trash2Icon class="w-5 h-5" /></button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Booking Modal -->
    <BookingFormModal
      v-if="showModal"
      :booking="selectedBooking || {}"
      :users="users"
      :properties="properties"
      @saved="handleSave"
      @close="showModal = false"
    />
     <!-- Back to dashboard -->
    <div class="text-center mt-10">
      <RouterLink to="/admin/dashboard" class="inline-flex items-center gap-2 text-primary underline hover:text-hover">
        <ArrowLeftIcon class="w-4 h-4" /> Ir al Panel de Control
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { CalendarCheckIcon, PencilIcon, Trash2Icon, PlusIcon } from 'lucide-vue-next'
import Swal from 'sweetalert2'
import { format } from 'date-fns'

import { getBookings, deleteBooking, type Booking } from '@/services/bookingService'
import { getAllUsers, type User } from '@/services/userService'
import { getProperties, type Property } from '@/services/propertyService'
import BookingFormModal from '@/components/admin/BookingFormModal.vue'

// Reactive state
const bookings = ref<Booking[]>([])
const users = ref<User[]>([])
const properties = ref<Property[]>([])
const selectedBooking = ref<Partial<Booking>>({})
const selectedStatus = ref('')
const showModal = ref(false)

// Lifecycle
onMounted(async () => {
  await Promise.all([loadBookings(), loadUsers(), loadProperties()])
})

// Loaders
const loadBookings = async () => bookings.value = await getBookings()
const loadUsers = async () => users.value = await getAllUsers()
const loadProperties = async () => properties.value = await getProperties()

// Filters
const filteredBookings = computed(() =>
  selectedStatus.value
    ? bookings.value.filter(b => b.status === selectedStatus.value)
    : bookings.value
)

// Formatters
const resolveUserName = (user: string | User | undefined): string => {
  if (!user) return 'Desconocido'
  if (typeof user === 'string') {
    const match = users.value.find(u => u._id === user)
    return match ? `${match.firstName} ${match.lastName}` : 'Desconocido'
  }
  return `${user.firstName} ${user.lastName}`
}

const resolvePropertyTitle = (property: string | Property | undefined): string => {
  if (!property) return 'Desconocido'
  if (typeof property === 'string') {
    const match = properties.value.find(p => p._id === property)
    return match ? `${match.title} - ${match.city}` : 'Desconocido'
  }
  return `${property.title} - ${property.city}`
}

const formatDate = (date: Date | string) => format(new Date(date), 'dd MMM yyyy')

const statusBadge = (status: string) => ({
  pending: 'bg-yellow-200 text-yellow-800',
  confirmed: 'bg-green-200 text-green-800',
  cancelled: 'bg-red-200 text-red-800'
}[status] || 'bg-gray-200 text-gray-800')

// Modal handlers
const editBooking = (booking: Booking) => {
  selectedBooking.value = { ...booking }
  showModal.value = true
}

const openModal = () => {
  selectedBooking.value = {}
  showModal.value = true
}

const confirmDelete = async (id: string) => {
  const result = await Swal.fire({
    title: '¿Eliminar reserva?',
    text: 'Esta acción no se puede deshacer',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3F51B5',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, eliminar'
  })
  if (result.isConfirmed) {
    await deleteBooking(id)
    await loadBookings()
    Swal.fire('Eliminado', 'La reserva ha sido eliminada.', 'success')
  }
}

const handleSave = async () => {
  await loadBookings()
  showModal.value = false
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
