<template>
  <div class="max-w-7xl mx-auto p-4 sm:p-6">
    <!-- Page Header -->
    <header class="mb-8">
      <div class="flex items-center space-x-4 mb-2">
        <button
          @click="goBack"
          class="inline-flex items-center p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <ArrowLeft class="w-5 h-5" />
        </button>
        <div>          
          <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Mis Reservas
          </h1>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Gestiona todas tus reservas de propiedades y tours
          </p>
        </div>
      </div>
    </header>

    <!-- Simple Filters -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="relative">
          <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar reservas..."
            class="w-full h-10 pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
        
        <select
          v-model="statusFilter"
          class="w-full h-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        >
          <option value="">Todos los Estados</option>
          <option value="pending">Pendiente</option>
          <option value="confirmed">Confirmada</option>
          <option value="cancelled">Cancelada</option>
          <option value="completed">Completada</option>
        </select>

        <button
          @click="fetchBookings"
          :disabled="loading"
          class="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          <RefreshCw class="w-4 h-4" :class="{ 'animate-spin': loading }" />
          Actualizar
        </button>
      </div>
    </div>

    <!-- Bookings List -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-3">
            <div class="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Calendar class="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            Lista de Reservas
          </h2>
          <div class="text-sm text-gray-500 dark:text-gray-400">
            {{ filteredBookings.length }} reserva{{ filteredBookings.length !== 1 ? "s" : "" }}
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading && bookings.length === 0" class="p-12 text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p class="text-gray-600 dark:text-gray-300">Cargando reservas...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="p-12 text-center">
        <div class="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
          <AlertCircle class="w-8 h-8 text-red-400" />
        </div>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Error al cargar las reservas</h3>
        <p class="text-gray-500 dark:text-gray-400 mb-4">{{ error }}</p>
        <button
          @click="fetchBookings"
          class="inline-flex items-center px-6 py-3 bg-blue-600 border border-transparent rounded-lg shadow-sm text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          Reintentar
        </button>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredBookings.length === 0 && bookings.length === 0" class="p-12 text-center">
        <div class="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
          <MapPin class="w-8 h-8 text-gray-400" />
        </div>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">¡Es hora de planear tu próxima aventura!</h3>
        <p class="text-gray-500 dark:text-gray-400 mb-6">No tienes reservas aún. Descubre increíbles destinos y experiencias.</p>
        <button
          @click="goHome"
          class="inline-flex items-center px-6 py-3 bg-blue-600 border border-transparent rounded-lg shadow-sm text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          <Plus class="w-5 h-5 mr-2" />
          Explorar Destinos
        </button>
      </div>

      <!-- No Results State -->
      <div v-else-if="filteredBookings.length === 0" class="p-12 text-center">
        <div class="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
          <Search class="w-8 h-8 text-gray-400" />
        </div>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No se encontraron reservas</h3>
        <p class="text-gray-500 dark:text-gray-400 mb-6">No hay reservas que coincidan con los filtros actuales.</p>
        <button
          @click="clearFilters"
          class="inline-flex items-center px-6 py-3 bg-blue-600 border border-transparent rounded-lg shadow-sm text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          Limpiar Filtros
        </button>
      </div>

      <!-- Desktop Table -->
      <div v-else class="hidden lg:block overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Reserva</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Fechas</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Total</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Estado</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="booking in filteredBookings" :key="booking._id" class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
              <!-- Booking info with image -->
              <td class="px-6 py-4">
                <div class="flex items-center space-x-4">
                  <div class="flex-shrink-0">
                    <img
                      v-if="getBookingImage(booking)"
                      :src="getBookingImage(booking)"
                      :alt="`Imagen de ${getBookingTitle(booking)}`"
                      class="h-12 w-12 rounded-lg object-cover border border-gray-200 dark:border-gray-600"
                    />
                    <div
                      v-else
                      class="h-12 w-12 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center border border-gray-200 dark:border-gray-600"
                    >
                      <span class="text-white text-lg">{{ booking.property ? '🏠' : '🗺️' }}</span>
                    </div>
                  </div>
                  <div class="min-w-0 flex-1">
                    <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ getBookingTitle(booking) }}</p>
                    <p class="text-sm text-gray-500 dark:text-gray-400 truncate">
                      <span :class="booking.property ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'" 
                            class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mr-2">
                        {{ booking.property ? 'Propiedad' : 'Tour' }}
                      </span>
                      {{ getBookingLocation(booking) }}
                    </p>
                  </div>
                </div>
              </td>

              <!-- Dates -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900 dark:text-white">{{ formatDate(booking.checkIn) }}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">{{ formatDate(booking.checkOut) }}</div>
                <div class="text-xs text-gray-400 dark:text-gray-500">{{ calculateNights(booking.checkIn, booking.checkOut) }} noches</div>
              </td>

              <!-- Price -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900 dark:text-white">${{ booking.totalPrice?.toLocaleString() }}</div>
                <div class="text-xs text-gray-500 dark:text-gray-400">${{ (booking.totalPrice / calculateNights(booking.checkIn, booking.checkOut)).toFixed(0) }}/noche</div>
              </td>

              <!-- Status -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusBadge(booking.status)">{{ getStatusLabel(booking.status) }}</span>
              </td>

              <!-- Actions -->
              <td class="px-6 py-4 whitespace-nowrap text-right">
                <div class="flex justify-end space-x-2">
                  <button
                    @click="toggleDetails(booking._id!)"
                    class="inline-flex items-center p-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                    title="Ver detalles"
                  >
                    <Eye class="w-4 h-4" />
                  </button>
                  
                  <button
                    v-if="canEditBooking(booking)"
                    @click="handleEditBooking(booking)"
                    class="inline-flex items-center p-2 text-yellow-600 hover:text-yellow-700 dark:text-yellow-400 dark:hover:text-yellow-300 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    title="Editar reserva"
                  >
                    <Edit2 class="w-4 h-4" />
                  </button>
                  
                  <button
                    v-if="canDeleteBooking(booking)"
                    @click="handleDeleteBooking(booking)"
                    class="inline-flex items-center p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                    title="Eliminar reserva"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>

            <!-- Expanded Details -->
            <tr v-for="booking in filteredBookings.filter(b => expandedBooking === b._id)" :key="`${booking._id}-details`">
              <td colspan="5" class="px-6 py-4 bg-gray-50 dark:bg-gray-700">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-3">Detalles de la Reserva</h4>
                    <dl class="space-y-2 text-sm">
                      <div class="flex justify-between">
                        <dt class="text-gray-500 dark:text-gray-400">ID:</dt>
                        <dd class="text-gray-900 dark:text-white font-mono text-xs">{{ booking._id }}</dd>
                      </div>
                      <div class="flex justify-between">
                        <dt class="text-gray-500 dark:text-gray-400">Huéspedes:</dt>
                        <dd class="text-gray-900 dark:text-white">{{ booking.guests }}</dd>
                      </div>
                      <div class="flex justify-between">
                        <dt class="text-gray-500 dark:text-gray-400">Estado de Pago:</dt>
                        <dd><span :class="getPaymentStatusBadge(booking.paymentStatus || 'pending')">{{ getPaymentStatusLabel(booking.paymentStatus || 'pending') }}</span></dd>
                      </div>
                      <div class="flex justify-between">
                        <dt class="text-gray-500 dark:text-gray-400">Creada:</dt>
                        <dd class="text-gray-900 dark:text-white">{{ formatDate(booking.createdAt) }}</dd>
                      </div>
                    </dl>
                  </div>
                  
                  <div v-if="booking.paymentDetails || (booking.paymentImages && booking.paymentImages.length > 0)">
                    <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-3">Información de Pago</h4>
                    <p v-if="booking.paymentDetails" class="text-sm text-gray-600 dark:text-gray-400 mb-3">{{ booking.paymentDetails }}</p>
                    <div v-if="booking.paymentImages && booking.paymentImages.length > 0" class="flex space-x-2">
                      <img
                        v-for="(image, index) in booking.paymentImages"
                        :key="index"
                        :src="image"
                        :alt="`Comprobante ${index + 1}`"
                        @click="viewImage(image)"
                        class="w-16 h-16 object-cover rounded border border-gray-300 dark:border-gray-600 cursor-pointer hover:opacity-80 transition-opacity"
                      />
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile Cards -->
      <div class="lg:hidden divide-y divide-gray-200 dark:divide-gray-700">
        <div v-for="booking in filteredBookings" :key="booking._id" class="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center space-x-4">
              <img
                v-if="getBookingImage(booking)"
                :src="getBookingImage(booking)"
                :alt="`Imagen de ${getBookingTitle(booking)}`"
                class="h-12 w-12 rounded-lg object-cover border border-gray-200 dark:border-gray-600"
              />
              <div
                v-else
                class="h-12 w-12 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center"
              >
                <span class="text-white text-lg">{{ booking.property ? '🏠' : '🗺️' }}</span>
              </div>
              <div>
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">{{ getBookingTitle(booking) }}</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  <span :class="booking.property ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'" 
                        class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mr-2">
                    {{ booking.property ? 'Propiedad' : 'Tour' }}
                  </span>
                  {{ getBookingLocation(booking) }}
                </p>
              </div>
            </div>
            <div class="flex space-x-2">
              <button @click="toggleDetails(booking._id!)" class="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg" title="Ver detalles">
                <Eye class="w-5 h-5" />
              </button>
              <button v-if="canEditBooking(booking)" @click="handleEditBooking(booking)" class="p-2 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg" title="Editar">
                <Edit2 class="w-5 h-5" />
              </button>
              <button v-if="canDeleteBooking(booking)" @click="handleDeleteBooking(booking)" class="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg" title="Eliminar">
                <Trash2 class="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Fechas:</span>
              <p class="text-sm text-gray-900 dark:text-white">{{ formatDate(booking.checkIn) }} - {{ formatDate(booking.checkOut) }}</p>
            </div>
            <div>
              <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Total:</span>
              <p class="text-sm text-gray-900 dark:text-white">${{ booking.totalPrice?.toLocaleString() }}</p>
            </div>
            <div>
              <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Estado:</span>
              <span :class="getStatusBadge(booking.status)">{{ getStatusLabel(booking.status) }}</span>
            </div>
            <div>
              <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Huéspedes:</span>
              <p class="text-sm text-gray-900 dark:text-white">{{ booking.guests }}</p>
            </div>
          </div>

          <!-- Expanded Details Mobile -->
          <div v-if="expandedBooking === booking._id" class="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div class="space-y-4">
              <div>
                <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-2">Información Adicional</h4>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-gray-500 dark:text-gray-400">ID:</span>
                    <span class="text-gray-900 dark:text-white font-mono text-xs">{{ booking._id }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-500 dark:text-gray-400">Estado de Pago:</span>
                    <span :class="getPaymentStatusBadge(booking.paymentStatus || 'pending')">{{ getPaymentStatusLabel(booking.paymentStatus || 'pending') }}</span>
                  </div>
                </div>
              </div>
              
              <div v-if="booking.paymentDetails">
                <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-2">Detalles de Pago</h4>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ booking.paymentDetails }}</p>
              </div>

              <div v-if="booking.paymentImages && booking.paymentImages.length > 0">
                <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-2">Comprobantes</h4>
                <div class="flex space-x-2">
                  <img
                    v-for="(image, index) in booking.paymentImages"
                    :key="index"
                    :src="image"
                    :alt="`Comprobante ${index + 1}`"
                    @click="viewImage(image)"
                    class="w-16 h-16 object-cover rounded border cursor-pointer hover:opacity-80"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Image Viewer Modal -->
    <div v-if="viewingImage" class="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4" @click="viewingImage = null">
      <div class="relative max-w-4xl max-h-full">
        <img :src="viewingImage" alt="Comprobante de pago" class="max-w-full max-h-full object-contain rounded-lg" />
        <button @click="viewingImage = null" class="absolute top-4 right-4 w-10 h-10 bg-white bg-opacity-20 text-white rounded-full hover:bg-opacity-30">
          <X class="w-6 h-6 mx-auto" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import { 
  getUserBookings, 
  updateUserBooking, 
  cancelUserBooking, 
  type Booking 
} from '@/services/userBookingService'

// Icons
import {
  ArrowLeft, Search, RefreshCw, Calendar, Eye, Edit2, Trash2, 
  Plus, MapPin, AlertCircle, X
} from 'lucide-vue-next'

// Types
interface PropertyInfo {
  _id?: string
  title: string
  city: string
  imageUrls?: string[]
}

interface TourInfo {
  _id?: string
  title: string
  imageUrls?: string[]
}

// Router
const router = useRouter()
const goBack = () => router.push('/dashboard')
const goHome = () => router.push('/')

// State
const bookings = ref<Booking[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const searchQuery = ref('')
const statusFilter = ref('')
const expandedBooking = ref<string | null>(null)
const viewingImage = ref<string | null>(null)

// Computed
const filteredBookings = computed(() => {
  let filtered = bookings.value

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(booking => {
      const title = getBookingTitle(booking).toLowerCase()
      const location = getBookingLocation(booking).toLowerCase()
      return title.includes(query) || location.includes(query)
    })
  }

  if (statusFilter.value) {
    filtered = filtered.filter(b => b.status === statusFilter.value)
  }

  return filtered
})

// Functions
const fetchBookings = async () => {
  try {
    loading.value = true
    error.value = null
    console.log('🔍 Fetching bookings...')
    
    const result = await getUserBookings()
    bookings.value = result
    console.log('✅ Loaded', result.length, 'bookings')
  } catch (err: any) {
    console.error('❌ Error loading bookings:', err)
    error.value = err.response?.data?.message || 'Error al cargar las reservas'
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Error al cargar las reservas'
    })
  } finally {
    loading.value = false
  }
}

const clearFilters = () => {
  searchQuery.value = ''
  statusFilter.value = ''
}

const toggleDetails = (id: string) => {
  expandedBooking.value = expandedBooking.value === id ? null : id
}

const canEditBooking = (booking: Booking): boolean => {
  return ['pending', 'confirmed'].includes(booking.status)
}

const canDeleteBooking = (booking: Booking): boolean => {
  return ['pending', 'confirmed'].includes(booking.status)
}

const handleEditBooking = async (booking: Booking) => {
  const { value: formValues } = await Swal.fire({
    title: 'Editar Reserva',
    html: `
      <div class="space-y-4 text-left">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
            <input id="checkIn" type="date" value="${new Date(booking.checkIn).toISOString().split('T')[0]}" class="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
            <input id="checkOut" type="date" value="${new Date(booking.checkOut).toISOString().split('T')[0]}" class="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Huéspedes</label>
          <select id="guests" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
            ${Array.from({length: 20}, (_, i) => `<option value="${i+1}" ${booking.guests === i+1 ? 'selected' : ''}>${i+1} ${i === 0 ? 'huésped' : 'huéspedes'}</option>`).join('')}
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Detalles de Pago</label>
          <textarea id="paymentDetails" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="Información adicional sobre el pago...">${booking.paymentDetails || ''}</textarea>
        </div>
      </div>
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: 'Actualizar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#3b82f6',
    cancelButtonColor: '#6b7280',
    preConfirm: () => {
      const checkIn = (document.getElementById('checkIn') as HTMLInputElement).value
      const checkOut = (document.getElementById('checkOut') as HTMLInputElement).value
      const guests = parseInt((document.getElementById('guests') as HTMLSelectElement).value)
      const paymentDetails = (document.getElementById('paymentDetails') as HTMLTextAreaElement).value

      if (!checkIn || !checkOut || guests < 1) {
        Swal.showValidationMessage('Por favor completa todos los campos requeridos')
        return false
      }

      if (new Date(checkOut) <= new Date(checkIn)) {
        Swal.showValidationMessage('La fecha de check-out debe ser posterior al check-in')
        return false
      }

      return { checkIn, checkOut, guests, paymentDetails }
    }
  })

  if (formValues && booking._id) {
    try {
      console.log('📝 Updating booking:', booking._id, formValues)
      await updateUserBooking(booking._id, formValues, [])
      
      await Swal.fire({
        icon: 'success',
        title: '¡Éxito!',
        text: 'Reserva actualizada correctamente',
        timer: 2000,
        showConfirmButton: false
      })
      
      // Reload bookings
      await fetchBookings()
    } catch (error: any) {
      console.error('❌ Error updating booking:', error)
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Error al actualizar la reserva'
      })
    }
  }
}

const handleDeleteBooking = async (booking: Booking) => {
  const result = await Swal.fire({
    title: '¿Eliminar Reserva?',
    html: `¿Estás seguro de que deseas eliminar la reserva para <strong>"${getBookingTitle(booking)}"</strong>?<br><br><small class="text-gray-500">Esta acción no se puede deshacer.</small>`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  })

  if (result.isConfirmed && booking._id) {
    try {
      console.log('🗑️ Deleting booking:', booking._id)
      await cancelUserBooking(booking._id)
      
      await Swal.fire({
        icon: 'success',
        title: '¡Eliminada!',
        text: 'La reserva ha sido eliminada correctamente',
        timer: 2000,
        showConfirmButton: false
      })
      
      // Reload bookings
      await fetchBookings()
    } catch (error: any) {
      console.error('❌ Error deleting booking:', error)
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Error al eliminar la reserva'
      })
    }
  }
}

const viewImage = (imageSrc: string) => {
  viewingImage.value = imageSrc
}

// Utility functions
const getBookingTitle = (booking: Booking): string => {
  try {
    if (booking.property && typeof booking.property === 'object') {
      return (booking.property as PropertyInfo).title || 'Propiedad'
    }
    if (booking.tourPackage && typeof booking.tourPackage === 'object') {
      return (booking.tourPackage as TourInfo).title || 'Tour'
    }
    return 'Reserva'
  } catch (error) {
    console.warn('Error getting booking title:', error)
    return 'Reserva'
  }
}

const getBookingLocation = (booking: Booking): string => {
  try {
    if (booking.property && typeof booking.property === 'object') {
      return (booking.property as PropertyInfo).city || ''
    }
    return ''
  } catch (error) {
    console.warn('Error getting booking location:', error)
    return ''
  }
}

const getBookingImage = (booking: Booking): string | undefined => {
  try {
    if (booking.property && typeof booking.property === 'object') {
      const property = booking.property as PropertyInfo
      return property.imageUrls && property.imageUrls.length > 0 ? property.imageUrls[0] : undefined
    }
    if (booking.tourPackage && typeof booking.tourPackage === 'object') {
      const tour = booking.tourPackage as TourInfo
      return tour.imageUrls && tour.imageUrls.length > 0 ? tour.imageUrls[0] : undefined
    }
    return undefined
  } catch (error) {
    console.warn('Error getting booking image:', error)
    return undefined
  }
}

const calculateNights = (checkIn: string | Date, checkOut: string | Date): number => {
  try {
    const start = new Date(checkIn)
    const end = new Date(checkOut)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  } catch (error) {
    console.warn('Error calculating nights:', error)
    return 0
  }
}

const formatDate = (date: Date | string | undefined): string => {
  try {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } catch (error) {
    console.warn('Error formatting date:', error)
    return 'N/A'
  }
}

const getStatusLabel = (status: string): string => {
  const labels = {
    pending: 'Pendiente',
    confirmed: 'Confirmada',
    cancelled: 'Cancelada',
    completed: 'Completada'
  }
  return labels[status as keyof typeof labels] || status
}

const getStatusBadge = (status: string): string => {
  const base = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
  const colors = {
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200",
    confirmed: "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200",
    cancelled: "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200",
    completed: "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200"
  }
  return `${base} ${colors[status as keyof typeof colors] || colors.pending}`
}

const getPaymentStatusLabel = (status: string): string => {
  const labels = {
    pending: 'Pendiente',
    paid: 'Pagado',
    failed: 'Fallido',
    refunded: 'Reembolsado'
  }
  return labels[status as keyof typeof labels] || status
}

const getPaymentStatusBadge = (status: string): string => {
  const base = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
  const colors = {
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200",
    paid: "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200",
    failed: "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200",
    refunded: "bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-200"
  }
  return `${base} ${colors[status as keyof typeof colors] || colors.pending}`
}

// Initialize on mount
onMounted(async () => {
  console.log('🚀 UserBookingView mounted')
  await fetchBookings()
})
</script>

<style scoped>
.transition-colors {
  transition-property: color, background-color, border-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* SweetAlert2 custom styles */
:global(.swal2-html-container) {
  overflow: visible !important;
}

:global(.swal2-popup) {
  width: 32rem !important;
  max-width: 90vw !important;
}

@media (max-width: 640px) {
  :global(.swal2-popup) {
    width: 95vw !important;
    margin: 1rem !important;
  }
}
</style>