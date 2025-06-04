<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header Section -->
    <header class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <!-- Page title and navigation -->
          <div class="flex items-center space-x-4">
            <button
              @click="goBack"
              class="inline-flex items-center p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Volver al dashboard"
            >
              <ArrowLeftIcon class="w-5 h-5" />
            </button>
            <div>
              <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                Gestión de Reservas - Admin
              </h1>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Administra todas las reservas del sistema
              </p>
            </div>
          </div>
          
          <!-- Stats summary and export -->
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-3 text-sm">
              <div class="bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-lg">
                <span class="text-blue-600 dark:text-blue-400 font-medium">
                  Total: {{ filteredBookings.length }}
                </span>
              </div>
              <div class="bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-lg">
                <span class="text-green-600 dark:text-green-400 font-medium">
                  Confirmadas: {{ confirmedCount }}
                </span>
              </div>
              <div class="bg-purple-100 dark:bg-purple-900/30 px-3 py-1 rounded-lg">
                <span class="text-purple-600 dark:text-purple-400 font-medium">
                  {{ formatCurrency(getTotalRevenue) }}
                </span>
              </div>
            </div>
            <button
              @click="exportToPDF"
              :disabled="isExporting"
              class="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <DownloadIcon class="w-4 h-4" />
              {{ isExporting ? 'Exportando...' : 'Exportar PDF' }}
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <!-- Filter Controls -->
      <section class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div class="p-6">
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
                Filtros de Búsqueda
              </h2>
              <button
                @click="clearAllFilters"
                v-if="hasActiveFilters"
                class="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline focus:outline-none"
              >
                Limpiar filtros
              </button>
            </div>
            
            <!-- Filter Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
              <!-- Booking Type Filter -->
              <div>
                <FloatingSelect
                  id="type-filter"
                  label="Tipo"
                  v-model="typeFilter"
                  :options="[
                    { value: '', label: 'Todos' },
                    { value: 'property', label: 'Propiedades' },
                    { value: 'tour', label: 'Tours' }
                  ]"
                />
              </div>
              
              <!-- Status Filter -->
              <div>
                <FloatingSelect
                  id="status-filter"
                  label="Estado"
                  v-model="statusFilter"
                  :options="[
                    { value: '', label: 'Todos' },
                    { value: 'pending', label: 'Pendiente' },
                    { value: 'confirmed', label: 'Confirmada' },
                    { value: 'cancelled', label: 'Cancelada' },
                    { value: 'completed', label: 'Completada' }
                  ]"
                />
              </div>

              <!-- Payment Status Filter -->
              <div>
                <FloatingSelect
                  id="payment-filter"
                  label="Pago"
                  v-model="paymentStatusFilter"
                  :options="[
                    { value: '', label: 'Todos' },
                    { value: 'pending', label: 'Pendiente' },
                    { value: 'paid', label: 'Pagado' },
                    { value: 'failed', label: 'Fallido' },
                    { value: 'refunded', label: 'Reembolsado' }
                  ]"
                />
              </div>
              
              <!-- Date Range Filter -->
              <div>
                <FloatingInput
                  id="start-date"
                  label="Fecha inicio"
                  type="date"
                  v-model="dateRange.start"
                />
              </div>
              
              <div>
                <FloatingInput
                  id="end-date"
                  label="Fecha fin"
                  type="date"
                  v-model="dateRange.end"
                />
              </div>
              
              <!-- Guest Search -->
              <div>
                <FloatingInput
                  id="guest-search"
                  label="Buscar huésped"
                  type="text"
                  placeholder="Nombre o email..."
                  v-model="guestSearch"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Bookings Table Section -->
      <section class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div class="p-6">
          <!-- Loading state -->
          <div v-if="isLoading" class="flex items-center justify-center py-12">
            <div class="flex items-center space-x-3">
              <div class="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent"></div>
              <span class="text-gray-600 dark:text-gray-300">Cargando reservas...</span>
            </div>
          </div>

          <!-- Bookings table -->
          <div v-else-if="filteredBookings.length > 0" class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700" role="table">
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Reserva
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Huésped
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Servicio
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Fechas
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Estado
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Pago
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Total
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr
                  v-for="booking in filteredBookings"
                  :key="booking._id"
                  class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                >
                  <!-- Booking info -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">
                      #{{ booking._id?.slice(-6).toUpperCase() }}
                    </div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                      {{ formatDateDisplay(booking.createdAt) }}
                    </div>
                    <div class="flex items-center mt-1">
                      <span :class="getBookingTypeBadge(booking)">
                        {{ getBookingType(booking) }}
                      </span>
                    </div>
                  </td>

                  <!-- Guest info -->
                  <td class="px-6 py-4">
                    <div class="flex items-center space-x-3">
                      <div class="flex-shrink-0">
                        <div class="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <UserIcon class="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                      </div>
                      <div class="min-w-0 flex-1">
                        <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {{ getGuestName(booking.user) }}
                        </p>
                        <p class="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {{ getGuestEmail(booking.user) }}
                        </p>
                        <p class="text-xs text-gray-400 dark:text-gray-500">
                          {{ booking.guests }} huésped{{ booking.guests > 1 ? 's' : '' }}
                        </p>
                      </div>
                    </div>
                  </td>

                  <!-- Service info -->
                  <td class="px-6 py-4">
                    <div class="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {{ getServiceTitle(booking) }}
                    </div>
                    <div class="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {{ getServiceLocation(booking) }}
                    </div>
                  </td>

                  <!-- Dates -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900 dark:text-white">
                      <div class="flex items-center">
                        <CalendarIcon class="w-4 h-4 mr-1 text-gray-400" />
                        {{ formatDateDisplay(booking.checkIn) }}
                      </div>
                      <div class="flex items-center mt-1">
                        <ArrowRightIcon class="w-4 h-4 mr-1 text-gray-400" />
                        {{ formatDateDisplay(booking.checkOut) }}
                      </div>
                    </div>
                    <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {{ calculateDuration(booking) }}
                    </div>
                  </td>

                  <!-- Status badge -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="getStatusBadge(booking.status)">
                      {{ getStatusLabel(booking.status) }}
                    </span>
                  </td>

                  <!-- Payment status -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="getPaymentStatusBadge(booking.paymentStatus)">
                      {{ getPaymentStatusLabel(booking.paymentStatus) }}
                    </span>
                  </td>

                  <!-- Total amount -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ formatCurrency(booking.totalPrice) }}
                    </div>
                  </td>

                  <!-- Action buttons -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center space-x-2">
                      <button 
                        @click="viewBookingDetails(booking)" 
                        class="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors focus:outline-none focus:underline text-sm"
                        :aria-label="`Ver detalles de reserva ${booking._id}`"
                      >
                        <EyeIcon class="w-4 h-4 mr-1" />
                        Ver
                      </button>
                      <button 
                        v-if="canUpdatePaymentStatus(booking.paymentStatus)"
                        @click="showPaymentStatusModal(booking)" 
                        class="inline-flex items-center text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition-colors focus:outline-none focus:underline text-sm"
                        :aria-label="`Actualizar pago de reserva ${booking._id}`"
                      >
                        <CreditCardIcon class="w-4 h-4 mr-1" />
                        Pago
                      </button>
                      <button 
                        v-if="canUpdateStatus(booking.status)"
                        @click="showStatusModal(booking)" 
                        class="inline-flex items-center text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-colors focus:outline-none focus:underline text-sm"
                        :aria-label="`Actualizar estado de reserva ${booking._id}`"
                      >
                        <EditIcon class="w-4 h-4 mr-1" />
                        Estado
                      </button>
                      <button 
                        @click="confirmDeleteBooking(booking)" 
                        class="inline-flex items-center text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors focus:outline-none focus:underline text-sm"
                        :aria-label="`Eliminar reserva ${booking._id}`"
                      >
                        <TrashIcon class="w-4 h-4 mr-1" />
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Empty state -->
          <div v-else class="text-center py-12">
            <div class="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <CalendarIcon class="w-12 h-12 text-gray-400" />
            </div>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No se encontraron reservas
            </h3>
            <p class="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
              {{ hasActiveFilters ? 'Ninguna reserva coincide con los filtros actuales.' : 'No hay reservas registradas en el sistema.' }}
            </p>
          </div>
        </div>
      </section>
    </main>

    <!-- Status Update Modal -->
    <div v-if="showStatusUpdateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        <div class="p-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Actualizar Estado de Reserva
          </h3>
          <div class="space-y-4">
            <div>
              <FloatingSelect
                id="new-status"
                label="Nuevo Estado"
                v-model="newStatus"
                :options="[
                  { value: 'pending', label: 'Pendiente' },
                  { value: 'confirmed', label: 'Confirmada' },
                  { value: 'cancelled', label: 'Cancelada' },
                  { value: 'completed', label: 'Completada' }
                ]"
              />
            </div>
          </div>
          <div class="flex justify-end space-x-3 mt-6">
            <button
              @click="closeStatusModal"
              class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
            >
              Cancelar
            </button>
            <button
              @click="updateBookingStatus"
              :disabled="isUpdating"
              class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <div v-if="isUpdating" class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              {{ isUpdating ? 'Actualizando...' : 'Actualizar Estado' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Payment Status Update Modal -->
    <div v-if="showPaymentUpdateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        <div class="p-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Actualizar Estado de Pago
          </h3>
          <div class="space-y-4">
            <div>
              <FloatingSelect
                id="new-payment-status"
                label="Nuevo Estado de Pago"
                v-model="newPaymentStatus"
                :options="[
                  { value: 'pending', label: 'Pendiente' },
                  { value: 'paid', label: 'Pagado' },
                  { value: 'failed', label: 'Fallido' },
                  { value: 'refunded', label: 'Reembolsado' }
                ]"
              />
            </div>
          </div>
          <div class="flex justify-end space-x-3 mt-6">
            <button
              @click="closePaymentStatusModal"
              class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
            >
              Cancelar
            </button>
            <button
              @click="updatePaymentStatus"
              :disabled="isUpdating"
              class="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <div v-if="isUpdating" class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              {{ isUpdating ? 'Actualizando...' : 'Actualizar Pago' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Booking Details Modal -->
    <div v-if="selectedBooking" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full max-h-screen overflow-y-auto">
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
              Detalles de Reserva #{{ selectedBooking._id?.slice(-6).toUpperCase() }}
            </h3>
            <button
              @click="closeBookingDetails"
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
            >
              <XIcon class="w-6 h-6" />
            </button>
          </div>
          
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Guest Information -->
            <div>
              <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-3">Información del Huésped</h4>
              <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-2">
                <p><span class="font-medium">Nombre:</span> {{ getGuestName(selectedBooking.user) }}</p>
                <p><span class="font-medium">Email:</span> {{ getGuestEmail(selectedBooking.user) }}</p>
                <p><span class="font-medium">Número de huéspedes:</span> {{ selectedBooking.guests }}</p>
              </div>
            </div>

            <!-- Service Information -->
            <div>
              <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-3">{{ getBookingType(selectedBooking) }}</h4>
              <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-2">
                <p><span class="font-medium">Título:</span> {{ getServiceTitle(selectedBooking) }}</p>
                <p><span class="font-medium">Ubicación:</span> {{ getServiceLocation(selectedBooking) }}</p>
                <p v-if="getServiceDuration(selectedBooking)"><span class="font-medium">Duración:</span> {{ getServiceDuration(selectedBooking) }}</p>
              </div>
            </div>

            <!-- Booking Details -->
            <div>
              <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-3">Detalles de la Reserva</h4>
              <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-2">
                <p><span class="font-medium">Check-in:</span> {{ formatDateDisplay(selectedBooking.checkIn) }}</p>
                <p><span class="font-medium">Check-out:</span> {{ formatDateDisplay(selectedBooking.checkOut) }}</p>
                <p><span class="font-medium">{{ getBookingType(selectedBooking) === 'Tour' ? 'Duración' : 'Noches' }}:</span> {{ calculateDuration(selectedBooking) }}</p>
                <p><span class="font-medium">Total:</span> {{ formatCurrency(selectedBooking.totalPrice) }}</p>
                <p><span class="font-medium">Estado:</span> <span :class="getStatusBadge(selectedBooking.status)">{{ getStatusLabel(selectedBooking.status) }}</span></p>
                <p><span class="font-medium">Pago:</span> <span :class="getPaymentStatusBadge(selectedBooking.paymentStatus)">{{ getPaymentStatusLabel(selectedBooking.paymentStatus) }}</span></p>
                <p><span class="font-medium">Fecha de creación:</span> {{ formatDateDisplay(selectedBooking.createdAt) }}</p>
              </div>
            </div>

            <!-- Payment Images -->
            <div v-if="selectedBooking.paymentImages && selectedBooking.paymentImages.length > 0">
              <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-3">Comprobantes de Pago</h4>
              <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div class="grid grid-cols-2 gap-3">
                  <div v-for="(image, index) in selectedBooking.paymentImages" :key="index" class="relative">
                    <img 
                      :src="image" 
                      :alt="`Comprobante ${index + 1}`"
                      class="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-80"
                      @click="openImageModal(image)"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Payment Details -->
            <div v-if="selectedBooking.paymentDetails" class="lg:col-span-2">
              <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-3">Detalles de Pago</h4>
              <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <p>{{ selectedBooking.paymentDetails }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Image Modal -->
    <div v-if="selectedImage" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-[60]" @click="closeImageModal">
      <div class="max-w-4xl max-h-full">
        <img 
          :src="selectedImage" 
          alt="Comprobante de pago"
          class="max-w-full max-h-full object-contain rounded-lg"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
/**
 * AdminBookingsView.vue
 * ----------------------
 * Vista completa para administradores - gestiona TODAS las reservas del sistema
 * Usa SweetAlert2, inputs flotantes y servicios admin reales
 */

import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'

// Import admin services
import { 
  getAllBookingsForAdmin, 
  updateBookingByAdmin,
  updateBookingPaymentStatusAdmin,
  deleteBookingByAdmin,
  exportAdminBookingsToPDF,
  type AdminBooking
} from '@/services/adminBookingService'

// Import floating components
import FloatingInput from '@/components/ui/FloatingInput.vue'
import FloatingSelect from '@/components/ui/FloatingSelect.vue'

// Import helpers
import { formatDate } from '@/utils/formDataHelpers'

// Icons from Lucide Vue Next
import {
  ArrowLeft as ArrowLeftIcon,
  Calendar as CalendarIcon,
  User as UserIcon,
  Eye as EyeIcon,
  Edit as EditIcon,
  X as XIcon,
  ArrowRight as ArrowRightIcon,
  Download as DownloadIcon,
  CreditCard as CreditCardIcon,
  Trash as TrashIcon
} from 'lucide-vue-next'

// ===== TYPES =====
type Booking = AdminBooking

// ===== ROUTER =====
const router = useRouter()

const goBack = (): void => {
  router.push('/admin/dashboard')
}

// ===== REACTIVE STATE =====

/** UI state management */
const isLoading = ref<boolean>(false)
const isUpdating = ref<boolean>(false)
const isExporting = ref<boolean>(false)
const showStatusUpdateModal = ref<boolean>(false)
const showPaymentUpdateModal = ref<boolean>(false)
const selectedBooking = ref<Booking | null>(null)
const selectedBookingForUpdate = ref<Booking | null>(null)
const selectedImage = ref<string | null>(null)

/** Filter state */
const typeFilter = ref<string>('')
const statusFilter = ref<string>('')
const paymentStatusFilter = ref<string>('')
const guestSearch = ref<string>('')
const dateRange = ref<{
  start: string
  end: string
}>({
  start: '',
  end: ''
})

/** Update modal state */
const newStatus = ref<string>('pending')
const newPaymentStatus = ref<string>('pending')

/** Data */
const allBookings = ref<Booking[]>([])

// ===== COMPUTED PROPERTIES =====

/**
 * Filter bookings based on applied filters
 */
const filteredBookings = computed<Booking[]>(() => {
  if (!Array.isArray(allBookings.value)) {
    console.warn('allBookings.value is not an array:', allBookings.value)
    return []
  }

  let filtered = allBookings.value

  // Type filter (property vs tour)
  if (typeFilter.value) {
    if (typeFilter.value === 'property') {
      filtered = filtered.filter(booking => booking.property && !booking.tourPackage)
    } else if (typeFilter.value === 'tour') {
      filtered = filtered.filter(booking => booking.tourPackage && !booking.property)
    }
  }

  // Status filter
  if (statusFilter.value) {
    filtered = filtered.filter(booking => booking.status === statusFilter.value)
  }

  // Payment status filter
  if (paymentStatusFilter.value) {
    filtered = filtered.filter(booking => booking.paymentStatus === paymentStatusFilter.value)
  }

  // Guest search
  if (guestSearch.value.trim()) {
    const searchTerm = guestSearch.value.toLowerCase().trim()
    filtered = filtered.filter(booking => {
      const user = booking.user
      if (typeof user === 'object') {
        const fullName = `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase()
        const email = user.email.toLowerCase()
        return fullName.includes(searchTerm) || email.includes(searchTerm)
      }
      return false
    })
  }

  // Date range filter
  if (dateRange.value.start) {
    filtered = filtered.filter(booking => 
      new Date(booking.checkIn) >= new Date(dateRange.value.start)
    )
  }
  if (dateRange.value.end) {
    filtered = filtered.filter(booking => 
      new Date(booking.checkOut) <= new Date(dateRange.value.end)
    )
  }

  return filtered.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
})

/**
 * Count confirmed bookings
 */
const confirmedCount = computed<number>(() => {
  return filteredBookings.value.filter(booking => booking.status === 'confirmed').length
})

/**
 * Check if any filters are currently active
 */
const hasActiveFilters = computed<boolean>(() => {
  return !!(typeFilter.value || 
           statusFilter.value || 
           paymentStatusFilter.value ||
           guestSearch.value.trim() || 
           dateRange.value.start || 
           dateRange.value.end)
})

/**
 * Get total revenue from filtered bookings
 */
const getTotalRevenue = computed<number>(() => {
  return filteredBookings.value
    .filter(booking => booking.paymentStatus === 'paid')
    .reduce((total, booking) => total + (booking.totalPrice || 0), 0)
})

// ===== LIFECYCLE HOOKS =====

/**
 * Initialize component on mount
 */
onMounted(async (): Promise<void> => {
  await loadBookings()
})

// ===== DATA LOADING =====

/**
 * Load all bookings using admin service
 */
const loadBookings = async (): Promise<void> => {
  try {
    isLoading.value = true
    const bookings = await getAllBookingsForAdmin()
    
    // ✅ Verificar que bookings sea un array
    if (Array.isArray(bookings)) {
      allBookings.value = bookings
    } else {
      console.error('Bookings is not an array:', bookings)
      allBookings.value = []
    }
    
  } catch (error) {
    console.error('Error loading bookings:', error)
    // ✅ Asegurar array vacío en caso de error
    allBookings.value = []
    
    await Swal.fire({
      icon: 'error',
      title: 'Error de Carga',
      text: 'No se pudieron cargar las reservas. Inténtalo de nuevo.',
      confirmButtonText: 'OK'
    })
  } finally {
    isLoading.value = false
  }
}

// ===== FILTER MANAGEMENT =====

/**
 * Clear all active filters
 */
const clearAllFilters = (): void => {
  typeFilter.value = ''
  statusFilter.value = ''
  paymentStatusFilter.value = ''
  guestSearch.value = ''
  dateRange.value = {
    start: '',
    end: ''
  }
}

// ===== EXPORT FUNCTIONALITY =====

/**
 * Export bookings to PDF using admin service
 */
const exportToPDF = async (): Promise<void> => {
  try {
    isExporting.value = true
    
    const filters: any = {}
    if (paymentStatusFilter.value) filters.paymentStatus = paymentStatusFilter.value
    if (statusFilter.value) filters.status = statusFilter.value
    if (dateRange.value.start) filters.from = dateRange.value.start
    if (dateRange.value.end) filters.to = dateRange.value.end
    if (typeFilter.value) filters.type = typeFilter.value
    
    await exportAdminBookingsToPDF(filters)

    await Swal.fire({
      icon: 'success',
      title: 'PDF Generado',
      text: 'El archivo se ha descargado exitosamente.',
      confirmButtonText: 'OK'
    })
    
  } catch (error) {
    console.error('Error exporting bookings:', error)
    await Swal.fire({
      icon: 'error',
      title: 'Error al Exportar',
      text: 'No se pudo generar el PDF. Inténtalo de nuevo.',
      confirmButtonText: 'OK'
    })
  } finally {
    isExporting.value = false
  }
}

// ===== BOOKING OPERATIONS =====

/**
 * View detailed booking information
 */
const viewBookingDetails = (booking: Booking): void => {
  selectedBooking.value = booking
}

/**
 * Close booking details modal
 */
const closeBookingDetails = (): void => {
  selectedBooking.value = null
}

/**
 * Show status update modal
 */
const showStatusModal = (booking: Booking): void => {
  selectedBookingForUpdate.value = booking
  newStatus.value = booking.status
  showStatusUpdateModal.value = true
}

/**
 * Close status update modal
 */
const closeStatusModal = (): void => {
  showStatusUpdateModal.value = false
  selectedBookingForUpdate.value = null
  newStatus.value = 'pending'
}

/**
 * Show payment status update modal
 */
const showPaymentStatusModal = (booking: Booking): void => {
  selectedBookingForUpdate.value = booking
  newPaymentStatus.value = booking.paymentStatus
  showPaymentUpdateModal.value = true
}

/**
 * Close payment status update modal
 */
const closePaymentStatusModal = (): void => {
  showPaymentUpdateModal.value = false
  selectedBookingForUpdate.value = null
  newPaymentStatus.value = 'pending'
}

/**
 * Update booking status using admin service with SweetAlert
 */
const updateBookingStatus = async (): Promise<void> => {
  if (!selectedBookingForUpdate.value?._id) return

  try {
    isUpdating.value = true
    
    await updateBookingByAdmin(selectedBookingForUpdate.value._id, {
      status: newStatus.value
    })
    
    // Update local state
    const bookingIndex = allBookings.value.findIndex(
      b => b._id === selectedBookingForUpdate.value!._id
    )
    if (bookingIndex !== -1) {
      allBookings.value[bookingIndex].status = newStatus.value as any
      allBookings.value[bookingIndex].updatedAt = new Date()
    }

    await Swal.fire({
      icon: 'success',
      title: 'Estado Actualizado',
      text: 'El estado de la reserva se ha actualizado exitosamente.',
      confirmButtonText: 'Continuar'
    })
    
    closeStatusModal()
  } catch (error) {
    console.error('Error updating booking status:', error)
    await Swal.fire({
      icon: 'error',
      title: 'Error al Actualizar',
      text: 'No se pudo actualizar el estado de la reserva.',
      confirmButtonText: 'OK'
    })
  } finally {
    isUpdating.value = false
  }
}

/**
 * Update payment status using admin service with SweetAlert
 */
const updatePaymentStatus = async (): Promise<void> => {
  if (!selectedBookingForUpdate.value?._id) return

  try {
    isUpdating.value = true
    
    await updateBookingPaymentStatusAdmin(
      selectedBookingForUpdate.value._id, 
      newPaymentStatus.value
    )
    
    // Update local state
    const bookingIndex = allBookings.value.findIndex(
      b => b._id === selectedBookingForUpdate.value!._id
    )
    if (bookingIndex !== -1) {
      allBookings.value[bookingIndex].paymentStatus = newPaymentStatus.value as any
      allBookings.value[bookingIndex].updatedAt = new Date()
    }

    await Swal.fire({
      icon: 'success',
      title: 'Pago Actualizado',
      text: 'El estado de pago se ha actualizado exitosamente.',
      confirmButtonText: 'Continuar'
    })
    
    closePaymentStatusModal()
  } catch (error) {
    console.error('Error updating payment status:', error)
    await Swal.fire({
      icon: 'error',
      title: 'Error al Actualizar',
      text: 'No se pudo actualizar el estado de pago.',
      confirmButtonText: 'OK'
    })
  } finally {
    isUpdating.value = false
  }
}

/**
 * Confirm and delete booking with SweetAlert
 */
const confirmDeleteBooking = async (booking: Booking): Promise<void> => {
  if (!booking._id) return

  const result = await Swal.fire({
    title: "¿Eliminar Reserva?",
    text: `Esta acción eliminará permanentemente la reserva #${booking._id.slice(-6).toUpperCase()}`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dc2626",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar"
  })

  if (result.isConfirmed) {
    try {
      await deleteBookingByAdmin(booking._id)
      
      // Remove from local state
      allBookings.value = allBookings.value.filter(b => b._id !== booking._id)
      
      await Swal.fire({
        icon: 'success',
        title: 'Reserva Eliminada',
        text: 'La reserva se ha eliminado exitosamente.',
        confirmButtonText: 'Continuar'
      })
    } catch (error) {
      console.error('Error deleting booking:', error)
      await Swal.fire({
        icon: 'error',
        title: 'Error al Eliminar',
        text: 'No se pudo eliminar la reserva. Inténtalo de nuevo.',
        confirmButtonText: 'OK'
      })
    }
  }
}

// ===== IMAGE MODAL =====

/**
 * Open image in modal
 */
const openImageModal = (imageUrl: string): void => {
  selectedImage.value = imageUrl
}

/**
 * Close image modal
 */
const closeImageModal = (): void => {
  selectedImage.value = null
}

// ===== UTILITY FUNCTIONS =====

/**
 * Format date for display using helper
 */
const formatDateDisplay = (dateString: string | Date | undefined): string => {
  if (!dateString) return ''
  return formatDate(dateString)
}

/**
 * Calculate duration between dates or get tour duration
 */
const calculateDuration = (booking: Booking): string => {
  if (booking.tourPackage) {
    const tour = booking.tourPackage
    if (typeof tour === 'object' && tour.duration) {
      return `${tour.duration} días`
    }
    return 'Ver detalles'
  }
  
  // For properties, calculate nights
  if (!booking.checkIn || !booking.checkOut) return ''
  const start = new Date(booking.checkIn)
  const end = new Date(booking.checkOut)
  const diffTime = Math.abs(end.getTime() - start.getTime())
  const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return `${nights} noche${nights > 1 ? 's' : ''}`
}

/**
 * Get guest name safely
 */
const getGuestName = (user: any): string => {
  if (typeof user === 'string') return `ID: ${user}`
  if (user?.firstName && user?.lastName) {
    return `${user.firstName} ${user.lastName}`
  }
  return user?.email || 'Usuario desconocido'
}

/**
 * Get guest email safely
 */
const getGuestEmail = (user: any): string => {
  if (typeof user === 'string') return 'Email no disponible'
  return user?.email || 'Email no disponible'
}

/**
 * Get booking type (Property or Tour)
 */
const getBookingType = (booking: Booking): string => {
  return booking.tourPackage ? 'Tour' : 'Propiedad'
}

/**
 * Get booking type badge classes
 */
const getBookingTypeBadge = (booking: Booking): string => {
  const base = 'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium'
  if (booking.tourPackage) {
    return `${base} bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-200`
  }
  return `${base} bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200`
}

/**
 * Get service title safely
 */
const getServiceTitle = (booking: Booking): string => {
  if (booking.tourPackage) {
    const tour = booking.tourPackage
    return typeof tour === 'string' ? `Tour ID: ${tour}` : tour.title
  }
  if (booking.property) {
    const property = booking.property
    return typeof property === 'string' ? `Propiedad ID: ${property}` : property.title
  }
  return 'Servicio no especificado'
}

/**
 * Get service location safely
 */
const getServiceLocation = (booking: Booking): string => {
  if (booking.property) {
    const property = booking.property
    if (typeof property === 'object') {
      return property.city || (property as any).location || 'Ciudad no especificada'
    }
    return 'Ubicación no disponible'
  }
  return 'Tour'
}

/**
 * Get service duration (for tours in details)
 */
const getServiceDuration = (booking: Booking): string => {
  if (booking.tourPackage) {
    const tour = booking.tourPackage
    if (typeof tour === 'object' && tour.duration) {
      return `${tour.duration} días`
    }
  }
  return ''
}

/**
 * Get user-friendly status label in Spanish
 */
const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    'pending': 'Pendiente',
    'confirmed': 'Confirmada',
    'cancelled': 'Cancelada',
    'completed': 'Completada'
  }
  return labels[status] || status
}

/**
 * Get CSS classes for status badges
 */
const getStatusBadge = (status: string): string => {
  const base = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium'
  const colors: Record<string, string> = {
    'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200',
    'confirmed': 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200',
    'cancelled': 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200',
    'completed': 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200'
  }
  return `${base} ${colors[status] || colors.pending}`
}

/**
 * Get user-friendly payment status label in Spanish
 */
const getPaymentStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    'pending': 'Pendiente',
    'paid': 'Pagado',
    'failed': 'Fallido',
    'refunded': 'Reembolsado'
  }
  return labels[status] || status
}

/**
 * Get CSS classes for payment status badges
 */
const getPaymentStatusBadge = (status: string): string => {
  const base = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium'
  const colors: Record<string, string> = {
    'pending': 'bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-200',
    'paid': 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200',
    'failed': 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200',
    'refunded': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
  }
  return `${base} ${colors[status] || colors.pending}`
}

/**
 * Check if booking status can be updated
 */
const canUpdateStatus = (status: string): boolean => {
  return status !== 'cancelled' && status !== 'completed'
}

/**
 * Check if payment status can be updated
 */
const canUpdatePaymentStatus = (paymentStatus: string): boolean => {
  return paymentStatus !== 'refunded'
}

/**
 * Format currency for display
 */
const formatCurrency = (amount: number | undefined): string => {
  if (!amount) return '$0'
  return `$${amount.toLocaleString()}`
}
</script>

<style scoped>
/* Custom transitions for modals */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Ensure tables are responsive */
@media (max-width: 768px) {
  .overflow-x-auto {
    scrollbar-width: thin;
  }
}

/* Custom scrollbar for webkit browsers */
.overflow-x-auto::-webkit-scrollbar {
  height: 6px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Dark mode scrollbar */
.dark .overflow-x-auto::-webkit-scrollbar-track {
  background: #374151;
}

.dark .overflow-x-auto::-webkit-scrollbar-thumb {
  background: #6b7280;
}

.dark .overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* Loading spinner animation */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Responsive table improvements */
@media (max-width: 640px) {
  table {
    font-size: 0.875rem;
  }
  
  th, td {
    padding: 0.5rem 0.75rem;
  }
}
</style>