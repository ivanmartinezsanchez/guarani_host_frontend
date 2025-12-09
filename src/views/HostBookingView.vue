<template>
  <!-- Main container with full height and background -->
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    
    <!-- ===== HEADER SECTION ===== -->
    <!-- Contains page title, navigation, and summary stats -->
    <header class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          
          <!-- Page title and back navigation -->
          <div class="flex items-center space-x-4">
            <!-- Back button to host dashboard -->
            <button
              @click="goBack"
              class="inline-flex items-center p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Go back to dashboard"
            >
              <ArrowLeftIcon class="w-5 h-5" />
            </button>
            
            <!-- Page title and description -->
            <div>
              <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                Reservas Recibidas
              </h1>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Gestiona las reservas de tus propiedades y tours
              </p>
            </div>
          </div>
          
          <!-- Summary statistics badges -->
          <div class="flex items-center gap-4 text-sm">
            <!-- Total bookings count -->
            <div class="bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-lg">
              <span class="text-blue-600 dark:text-blue-400 font-medium">
                Total: {{ filteredBookings.length }}
              </span>
            </div>
            
            <!-- Paid bookings count -->
            <div class="bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-lg">
              <span class="text-green-600 dark:text-green-400 font-medium">
                Pagadas: {{ paidCount }}
              </span>
            </div>
            
            <!-- Total revenue from paid bookings -->
            <div class="bg-purple-100 dark:bg-purple-900/30 px-3 py-1 rounded-lg">
              <span class="text-purple-600 dark:text-purple-400 font-medium">
                {{ formatCurrency(totalRevenue) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- ===== MAIN CONTENT AREA ===== -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      <!-- ===== FILTERS SECTION ===== -->
      <!-- Filter controls for payment status, booking status, and service type -->
      <section class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div class="p-6">
          <div class="flex flex-col lg:flex-row lg:items-end gap-4">
            
            <!-- Payment status filter -->
            <div class="flex-1 max-w-xs">
              <FloatingSelect
                id="payment-status-filter"
                label="Estado de Pago"
                v-model="paymentStatusFilter"
                :options="[
                  { value: '', label: 'Todos' },
                  { value: 'pending', label: 'Pendientes' },
                  { value: 'paid', label: 'Pagado' },
                  { value: 'failed', label: 'Fallido' },
                  { value: 'refunded', label: 'Reembolsado' }
                ]"
              />
            </div>
            
            <!-- Booking status filter -->
            <div class="flex-1 max-w-xs">
              <FloatingSelect
                id="booking-status-filter"
                label="Estado de Reserva"
                v-model="bookingStatusFilter"
                :options="[
                  { value: '', label: 'Todos' },
                  { value: 'pending', label: 'Pendiente' },
                  { value: 'confirmed', label: 'Confirmada' },
                  { value: 'cancelled', label: 'Cancelada' },
                  { value: 'completed', label: 'Completada' }
                ]"
              />
            </div>

            <!-- Service type filter (property vs tour) -->
            <div class="flex-1 max-w-xs">
              <FloatingSelect
                id="type-filter"
                label="Tipo de Servicio"
                v-model="typeFilter"
                :options="[
                  { value: '', label: 'Todos' },
                  { value: 'property', label: 'Propiedades' },
                  { value: 'tour', label: 'Tours' }
                ]"
              />
            </div>
            
            <!-- Action buttons: clear filters and export PDF -->
            <div class="flex gap-2">
              <!-- Clear filters button (only shown when filters are active) -->
              <button
                @click="clearFilters"
                v-if="hasActiveFilters"
                class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Limpiar
              </button>
              
              <!-- Export to PDF button with loading state -->
              <button
                @click="exportPDF"
                :disabled="isExporting"
                class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <DownloadIcon class="w-4 h-4" />
                {{ isExporting ? 'Exportando...' : 'Exportar PDF' }}
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- ===== BOOKINGS TABLE SECTION ===== -->
      <!-- Main table displaying all filtered bookings with actions -->
      <section class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div class="p-6">
          
          <!-- Loading state while fetching bookings -->
          <div v-if="isLoading" class="flex items-center justify-center py-12">
            <div class="flex items-center space-x-3">
              <div class="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent"></div>
              <span class="text-gray-600 dark:text-gray-300">Cargando reservas...</span>
            </div>
          </div>

          <!-- Bookings table (shown when bookings exist) -->
          <div v-else-if="filteredBookings.length > 0" class="overflow-x-auto">
            <div class="inline-block min-w-full align-middle">
              <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700" role="table" aria-label="Host bookings table">
                
                <!-- Table header with column definitions -->
                <thead class="bg-gray-50 dark:bg-gray-700">
                  <tr>
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
                      Huéspedes
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
                
                <!-- Table body with booking rows -->
                <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  <tr
                    v-for="booking in filteredBookings"
                    :key="booking._id"
                    class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                    :class="{
                      'bg-green-50 dark:bg-green-900/10': booking.paymentStatus === 'paid',
                      'bg-yellow-50 dark:bg-yellow-900/10': booking.status === 'pending'
                    }"
                  >
                    
                    <!-- Guest information column -->
                    <td class="px-6 py-4">
                      <div class="flex items-center space-x-3">
                        <!-- Guest avatar placeholder -->
                        <div class="flex-shrink-0">
                          <div class="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <UserIcon class="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          </div>
                        </div>
                        
                        <!-- Guest details -->
                        <div class="min-w-0 flex-1">
                          <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {{ getGuestName(booking.user) }}
                          </p>
                          <p class="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {{ getGuestEmail(booking.user) }}
                          </p>
                          <!-- Booking ID for reference -->
                          <p class="text-xs text-gray-400 dark:text-gray-500">
                            ID: {{ booking._id?.slice(-8).toUpperCase() }}
                          </p>
                        </div>
                      </div>
                    </td>

                    <!-- Service information column -->
                    <td class="px-6 py-4">
                      <!-- Service type badge -->
                      <div class="flex items-center space-x-2 mb-1">
                        <span :class="getServiceTypeBadge(booking)">
                          {{ getServiceType(booking) }}
                        </span>
                      </div>
                      <!-- Service name -->
                      <div class="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {{ getServiceName(booking) }}
                      </div>
                    </td>

                    <!-- Check-in and check-out dates -->
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900 dark:text-white">
                        <!-- Check-in date -->
                        <div class="flex items-center">
                          <CalendarIcon class="w-4 h-4 mr-1 text-gray-400" />
                          {{ formatDate(booking.checkIn) }}
                        </div>
                        <!-- Check-out date -->
                        <div class="flex items-center mt-1">
                          <ArrowRightIcon class="w-4 h-4 mr-1 text-gray-400" />
                          {{ formatDate(booking.checkOut) }}
                        </div>
                      </div>
                    </td>

                    <!-- Guest count -->
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center text-sm text-gray-900 dark:text-white">
                        <UsersIcon class="w-4 h-4 mr-1 text-gray-400" />
                        {{ booking.guests }}
                      </div>
                    </td>

                    <!-- Booking status badge -->
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span :class="getStatusBadge(booking.status)">
                        {{ getStatusLabel(booking.status) }}
                      </span>
                    </td>

                    <!-- Payment status badge -->
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

                    <!-- Action buttons column -->
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center space-x-2">
                        <!-- View details button -->
                        <button 
                          @click="viewBookingDetails(booking)" 
                          class="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors focus:outline-none focus:underline text-sm"
                          :aria-label="`View booking details for ${booking._id}`"
                        >
                          <EyeIcon class="w-4 h-4 mr-1" />
                          Ver
                        </button>
                        
                        <!-- Update payment status button (conditional) -->
                        <button 
                          v-if="canUpdatePaymentStatus(booking.paymentStatus)"
                          @click="showPaymentStatusModal(booking)" 
                          :disabled="isUpdating && selectedBookingForUpdate?._id === booking._id"
                          class="inline-flex items-center text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition-colors focus:outline-none focus:underline text-sm disabled:opacity-50"
                          :aria-label="`Update payment status for booking ${booking._id}`"
                        >
                          <CreditCardIcon class="w-4 h-4 mr-1" />
                          Pago
                        </button>
                        
                        <!-- Update booking status button (conditional) -->
                        <button 
                          v-if="canUpdateStatus(booking.status)"
                          @click="showStatusModal(booking)" 
                          :disabled="isUpdating && selectedBookingForUpdate?._id === booking._id"
                          class="inline-flex items-center text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-colors focus:outline-none focus:underline text-sm disabled:opacity-50"
                          :aria-label="`Update booking status for ${booking._id}`"
                        >
                          <EditIcon class="w-4 h-4 mr-1" />
                          Estado
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Empty state (no bookings found) -->
          <div v-else class="text-center py-12">
            <!-- Empty state icon -->
            <div class="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <CalendarIcon class="w-12 h-12 text-gray-400" />
            </div>
            
            <!-- Empty state title -->
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {{ hasActiveFilters ? 'No se encontraron reservas' : 'No tienes reservas aún' }}
            </h3>
            
            <!-- Empty state description -->
            <p class="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
              {{ hasActiveFilters 
                  ? 'Ninguna reserva coincide con los filtros actuales. Intenta cambiar los criterios de búsqueda.' 
                  : 'Cuando recibas reservas para tus propiedades y tours, aparecerán aquí.' 
              }}
            </p>
            
            <!-- Clear filters button when filters are active -->
            <button 
              v-if="hasActiveFilters"
              @click="clearFilters"
              class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Limpiar filtros
            </button>
          </div>
        </div>
      </section>
    </main>

    <!-- ===== BOOKING STATUS UPDATE MODAL ===== -->
    <!-- Modal for updating booking status with reason -->
    <div 
      v-if="showStatusUpdateModal" 
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      @click.self="closeStatusModal"
      @keydown.escape="closeStatusModal"
    >
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        <div class="p-6">
          <!-- Modal title -->
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Actualizar Estado de Reserva
          </h3>
          
          <!-- Form fields -->
          <div class="space-y-4">
            <!-- New status selection -->
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
            
            <!-- Optional reason for status change -->
            <div>
              <FloatingInput
                id="status-reason"
                label="Razón (opcional)"
                type="text"
                placeholder="Motivo del cambio de estado..."
                v-model="statusReason"
              />
            </div>
          </div>
          
          <!-- Modal action buttons -->
          <div class="flex justify-end space-x-3 mt-6">
            <!-- Cancel button -->
            <button
              @click="closeStatusModal"
              class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
            >
              Cancelar
            </button>
            
            <!-- Update button with loading state -->
            <button
              @click="updateBookingStatus"
              :disabled="isUpdating"
              class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <!-- Loading spinner -->
              <div v-if="isUpdating" class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              {{ isUpdating ? 'Actualizando...' : 'Actualizar Estado' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== PAYMENT STATUS UPDATE MODAL ===== -->
    <!-- Modal for updating payment status -->
    <div 
      v-if="showPaymentUpdateModal" 
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      @click.self="closePaymentStatusModal"
      @keydown.escape="closePaymentStatusModal"
    >
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        <div class="p-6">
          <!-- Modal title -->
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Actualizar Estado de Pago
          </h3>
          
          <!-- Form fields -->
          <div class="space-y-4">
            <!-- Payment status selection -->
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
          
          <!-- Modal action buttons -->
          <div class="flex justify-end space-x-3 mt-6">
            <!-- Cancel button -->
            <button
              @click="closePaymentStatusModal"
              class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
            >
              Cancelar
            </button>
            
            <!-- Update button with loading state -->
            <button
              @click="updatePaymentStatus"
              :disabled="isUpdating"
              class="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <!-- Loading spinner -->
              <div v-if="isUpdating" class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              {{ isUpdating ? 'Actualizando...' : 'Actualizar Pago' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== BOOKING DETAILS MODAL ===== -->
    <!-- Comprehensive modal showing all booking information -->
    <div 
      v-if="selectedBooking" 
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      @click.self="closeBookingDetails"
      @keydown.escape="closeBookingDetails"
    >
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full max-h-screen overflow-y-auto">
        <div class="p-6">
          
          <!-- Modal header -->
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
              Detalles de Reserva #{{ selectedBooking._id?.slice(-6).toUpperCase() }}
            </h3>
            
            <!-- Close button -->
            <button
              @click="closeBookingDetails"
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
            >
              <XIcon class="w-6 h-6" />
            </button>
          </div>
          
          <!-- Modal content grid -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            <!-- Guest Information section -->
            <div>
              <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-3">Información del Huésped</h4>
              <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-2">
                <p><span class="font-medium">Nombre:</span> {{ getGuestName(selectedBooking.user) }}</p>
                <p><span class="font-medium">Email:</span> {{ getGuestEmail(selectedBooking.user) }}</p>
                <p><span class="font-medium">Teléfono:</span> {{ getGuestPhone(selectedBooking.user) }}</p>
                <p><span class="font-medium">Número de huéspedes:</span> {{ selectedBooking.guests }}</p>
              </div>
            </div>

            <!-- Service Information section -->
            <div>
              <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-3">{{ getServiceType(selectedBooking) }}</h4>
              <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-2">
                <p><span class="font-medium">Nombre:</span> {{ getServiceName(selectedBooking) }}</p>
                <p v-if="getServiceLocation(selectedBooking)"><span class="font-medium">Ubicación:</span> {{ getServiceLocation(selectedBooking) }}</p>
                <p v-if="getServiceDuration(selectedBooking)"><span class="font-medium">Duración:</span> {{ getServiceDuration(selectedBooking) }}</p>
              </div>
            </div>

            <!-- Booking Details section -->
            <div>
              <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-3">Detalles de la Reserva</h4>
              <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-2">
                <p><span class="font-medium">Check-in:</span> {{ formatDate(selectedBooking.checkIn) }}</p>
                <p><span class="font-medium">Check-out:</span> {{ formatDate(selectedBooking.checkOut) }}</p>
                <p><span class="font-medium">Total:</span> {{ formatCurrency(selectedBooking.totalPrice) }}</p>
                <p><span class="font-medium">Estado:</span> <span :class="getStatusBadge(selectedBooking.status)">{{ getStatusLabel(selectedBooking.status) }}</span></p>
                <p><span class="font-medium">Pago:</span> <span :class="getPaymentStatusBadge(selectedBooking.paymentStatus)">{{ getPaymentStatusLabel(selectedBooking.paymentStatus) }}</span></p>
                <!-- ✅ FIXED: Using safe date formatting -->
                <p><span class="font-medium">Fecha de creación:</span> {{ formatCreatedAt(selectedBooking) }}</p>
                <p v-if="hasUpdatedAt(selectedBooking)"><span class="font-medium">Última actualización:</span> {{ formatUpdatedAt(selectedBooking) }}</p>
              </div>
            </div>

            <!-- Payment Images section (conditional) -->
            <div v-if="selectedBooking.paymentImages && selectedBooking.paymentImages.length > 0">
              <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-3">Comprobantes de Pago</h4>
              <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <!-- Image grid -->
                <div class="grid grid-cols-2 gap-3">
                  <div v-for="(image, index) in selectedBooking.paymentImages" :key="index" class="relative">
                    <img 
                      :src="image" 
                      :alt="`Payment proof ${index + 1}`"
                      class="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                      @click="openImageModal(image)"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Payment Details section (conditional) -->
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

    <!-- ===== PAYMENT IMAGE MODAL ===== -->
    <!-- Full-screen modal for viewing payment proof images -->
    <div 
      v-if="selectedImage" 
      class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-[60]" 
      @click="closeImageModal"
      @keydown.escape="closeImageModal"
    >
      <div class="max-w-4xl max-h-full">
        <!-- Full-size image display -->
        <img 
          :src="selectedImage" 
          alt="Payment proof document"
          class="max-w-full max-h-full object-contain rounded-lg"
        />
        
        <!-- Close button overlay -->
        <button
          @click="closeImageModal"
          class="absolute top-4 right-4 w-10 h-10 bg-white bg-opacity-20 text-white rounded-full hover:bg-opacity-30 focus:outline-none transition-colors flex items-center justify-center"
          aria-label="Close image viewer"
        >
          <XIcon class="w-6 h-6" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * HostBookingsView.vue
 * ---------------------
 * Host/landlord view - manages bookings for THEIR properties and tours
 * Uses SweetAlert2, floating inputs, and real host API services
 * 
 * Features:
 * - View all bookings for host's properties and tours
 * - Filter by payment status, booking status, and service type
 * - Update booking status and payment status
 * - Export bookings to PDF
 * - Real-time booking management with validation
 */

import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'

// Import host services with corrected functions
import { 
  getHostBookings,
  updateHostBookingStatus,      // ✅ Now exists in service
  updateHostBookingPaymentStatus, // ✅ Now exists in service
  exportHostBookingsToPDF,
  type Booking                  // ✅ Updated interface with all required properties
} from '@/services/hostBookingService'

// Import floating UI components
import FloatingInput from '@/components/ui/FloatingInput.vue'
import FloatingSelect from '@/components/ui/FloatingSelect.vue'

// Import icons from Lucide Vue Next
import {
  ArrowLeft as ArrowLeftIcon,
  Calendar as CalendarIcon,
  User as UserIcon,
  Users as UsersIcon,
  Eye as EyeIcon,
  Edit as EditIcon,
  X as XIcon,
  ArrowRight as ArrowRightIcon,
  Download as DownloadIcon,
  CreditCard as CreditCardIcon
} from 'lucide-vue-next'

// ===== ROUTER SETUP =====
const router = useRouter()

/**
 * Navigate back to host dashboard
 */
const goBack = (): void => {
  router.push('/host/dashboard')
}

// ===== REACTIVE STATE MANAGEMENT =====

/** UI state management for loading, modals, and interactions */
const isLoading = ref<boolean>(false)
const isUpdating = ref<boolean>(false)
const isExporting = ref<boolean>(false)
const showStatusUpdateModal = ref<boolean>(false)
const showPaymentUpdateModal = ref<boolean>(false)
const selectedBooking = ref<Booking | null>(null)
const selectedBookingForUpdate = ref<Booking | null>(null)
const selectedImage = ref<string | null>(null)

/** Filter state for booking list */
const paymentStatusFilter = ref<string>('')
const bookingStatusFilter = ref<string>('')
const typeFilter = ref<string>('')

/** Update modal form state */
const newStatus = ref<string>('pending')
const newPaymentStatus = ref<string>('pending')
const statusReason = ref<string>('')

/** Main booking data */
const allBookings = ref<Booking[]>([])

// ===== COMPUTED PROPERTIES =====

/**
 * Filter bookings based on applied filters and sort by creation date
 * Applies payment status, booking status, and service type filters
 */
const filteredBookings = computed<Booking[]>(() => {
  let filtered = allBookings.value

  // Apply payment status filter
  if (paymentStatusFilter.value) {
    filtered = filtered.filter(booking => booking.paymentStatus === paymentStatusFilter.value)
  }

  // Apply booking status filter
  if (bookingStatusFilter.value) {
    filtered = filtered.filter(booking => booking.status === bookingStatusFilter.value)
  }

  // Apply service type filter (property vs tour)
  if (typeFilter.value) {
    if (typeFilter.value === 'property') {
      filtered = filtered.filter(booking => booking.property && !booking.tourPackage)
    } else if (typeFilter.value === 'tour') {
      filtered = filtered.filter(booking => booking.tourPackage && !booking.property)
    }
  }

  // Sort by creation date (newest first)
  return filtered.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
})

/**
 * Count bookings with paid payment status
 */
const paidCount = computed<number>(() => {
  return filteredBookings.value.filter(booking => booking.paymentStatus === 'paid').length
})

/**
 * Check if any filters are currently active
 */
const hasActiveFilters = computed<boolean>(() => {
  return !!(paymentStatusFilter.value || bookingStatusFilter.value || typeFilter.value)
})

/**
 * Calculate total revenue from paid bookings
 */
const totalRevenue = computed<number>(() => {
  return filteredBookings.value
    .filter(booking => booking.paymentStatus === 'paid')
    .reduce((total, booking) => total + (booking.totalPrice || 0), 0)
})

// ===== LIFECYCLE HOOKS =====

/**
 * Initialize component when mounted
 * Load all host bookings on component mount
 */
onMounted(async (): Promise<void> => {
  await loadBookings()
})

// ===== DATA LOADING =====

/**
 * Load host bookings using the real API service
 * Handles loading state and error management
 */
const loadBookings = async (): Promise<void> => {
  try {
    isLoading.value = true
    const bookings = await getHostBookings()
    console.log('📦 Host bookings recibidas en loadBookings:', bookings)
    console.log('📊 Cantidad de bookings:', bookings?.length)

    allBookings.value = bookings
  } catch (error) {
    console.error('Error loading bookings:', error)
    await Swal.fire({
      icon: 'error',
      title: 'Loading Error',
      text: 'Could not load bookings. Please try again.',
      confirmButtonText: 'OK'
    })
  } finally {
    isLoading.value = false
  }
}

// ===== FILTER MANAGEMENT =====

/**
 * Clear all active filters and reset to show all bookings
 */
const clearFilters = (): void => {
  paymentStatusFilter.value = ''
  bookingStatusFilter.value = ''
  typeFilter.value = ''
}

// ===== EXPORT FUNCTIONALITY =====

/**
 * Export host bookings to PDF using the real API service
 * Applies current filters to the export
 */
const exportPDF = async (): Promise<void> => {
  try {
    isExporting.value = true
    
    // Prepare filters for export (backend expects 'bookingStatus' not 'status')
    const filters: any = {}
    if (paymentStatusFilter.value) filters.paymentStatus = paymentStatusFilter.value
    if (bookingStatusFilter.value) filters.bookingStatus = bookingStatusFilter.value // ✅ Fixed: backend uses 'bookingStatus'
    
    await exportHostBookingsToPDF(filters)

    await Swal.fire({
      icon: 'success',
      title: 'PDF Generated',
      text: 'The file has been downloaded successfully.',
      confirmButtonText: 'OK'
    })
    
  } catch (error) {
    console.error('Error exporting bookings:', error)
    await Swal.fire({
      icon: 'error',
      title: 'Export Error',
      text: 'Could not generate PDF. Please try again.',
      confirmButtonText: 'OK'
    })
  } finally {
    isExporting.value = false
  }
}

// ===== BOOKING OPERATIONS =====

/**
 * Show detailed booking information in modal
 * @param booking - Booking object to display
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
 * Show booking status update modal
 * @param booking - Booking to update
 */
const showStatusModal = (booking: Booking): void => {
  selectedBookingForUpdate.value = booking
  newStatus.value = booking.status
  statusReason.value = ''
  showStatusUpdateModal.value = true
}

/**
 * Close status update modal and reset form
 */
const closeStatusModal = (): void => {
  showStatusUpdateModal.value = false
  selectedBookingForUpdate.value = null
  newStatus.value = 'pending'
  statusReason.value = ''
}

/**
 * Show payment status update modal
 * @param booking - Booking to update payment status
 */
const showPaymentStatusModal = (booking: Booking): void => {
  selectedBookingForUpdate.value = booking
  newPaymentStatus.value = booking.paymentStatus
  showPaymentUpdateModal.value = true
}

/**
 * Close payment status update modal and reset form
 */
const closePaymentStatusModal = (): void => {
  showPaymentUpdateModal.value = false
  selectedBookingForUpdate.value = null
  newPaymentStatus.value = 'pending'
}

/**
 * Update booking status using host service
 * Includes reason parameter and proper error handling
 */
const updateBookingStatus = async (): Promise<void> => {
  if (!selectedBookingForUpdate.value?._id) return

  try {
    isUpdating.value = true
    
    // Call API with booking ID, new status, and optional reason
    await updateHostBookingStatus(
      selectedBookingForUpdate.value._id, 
      newStatus.value,
      statusReason.value || undefined  // Backend expects 'reason' parameter
    )
    
    // Update local state to reflect changes immediately
    const bookingIndex = allBookings.value.findIndex(
      b => b._id === selectedBookingForUpdate.value!._id
    )
    if (bookingIndex !== -1) {
      allBookings.value[bookingIndex].status = newStatus.value as any
      allBookings.value[bookingIndex].updatedAt = new Date()
    }

    await Swal.fire({
      icon: 'success',
      title: 'Status Updated',
      text: 'The booking status has been updated successfully.',
      confirmButtonText: 'Continue'
    })
    
    closeStatusModal()
  } catch (error) {
    console.error('Error updating booking status:', error)
    await Swal.fire({
      icon: 'error',
      title: 'Update Error',
      text: 'Could not update booking status.',
      confirmButtonText: 'OK'
    })
  } finally {
    isUpdating.value = false
  }
}

/**
 * Update payment status using host service
 * Updates both API and local state
 */
const updatePaymentStatus = async (): Promise<void> => {
  if (!selectedBookingForUpdate.value?._id) return

  try {
    isUpdating.value = true
    
    // Call API to update payment status
    await updateHostBookingPaymentStatus(
      selectedBookingForUpdate.value._id, 
      newPaymentStatus.value
    )
    
    // Update local state immediately
    const bookingIndex = allBookings.value.findIndex(
      b => b._id === selectedBookingForUpdate.value!._id
    )
    if (bookingIndex !== -1) {
      allBookings.value[bookingIndex].paymentStatus = newPaymentStatus.value as any
      allBookings.value[bookingIndex].updatedAt = new Date()
    }

    await Swal.fire({
      icon: 'success',
      title: 'Payment Updated',
      text: 'The payment status has been updated successfully.',
      confirmButtonText: 'Continue'
    })
    
    closePaymentStatusModal()
  } catch (error) {
    console.error('Error updating payment status:', error)
    await Swal.fire({
      icon: 'error',
      title: 'Update Error',
      text: 'Could not update payment status.',
      confirmButtonText: 'OK'
    })
  } finally {
    isUpdating.value = false
  }
}

// ===== IMAGE MODAL MANAGEMENT =====

/**
 * Open payment image in full-screen modal
 * @param imageUrl - URL of image to display
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

// ===== TYPE GUARDS FOR SAFE PROPERTY ACCESS =====

/**
 * Type guard to check if object has createdAt property
 * @param obj - Object to check
 * @returns Boolean indicating if createdAt exists
 */
const hasCreatedAt = (obj: any): obj is { createdAt: Date | string } => {
  return obj && obj.createdAt !== undefined && obj.createdAt !== null
}

/**
 * Type guard to check if object has updatedAt property
 * @param obj - Object to check
 * @returns Boolean indicating if updatedAt exists
 */
const hasUpdatedAt = (obj: any): obj is { updatedAt: Date | string } => {
  return obj && obj.updatedAt !== undefined && obj.updatedAt !== null
}

/**
 * Type guard to check if tourPackage is a populated object
 * @param tourPackage - Tour package to check
 * @returns Boolean indicating if it's a populated object
 */
const isTourPackageObject = (tourPackage: any): tourPackage is { title: string; duration?: number } => {
  return tourPackage && typeof tourPackage === 'object' && typeof tourPackage.title === 'string'
}

/**
 * Type guard to check if property is a populated object
 * @param property - Property to check
 * @returns Boolean indicating if it's a populated object
 */
const isPropertyObject = (property: any): property is { title: string; city?: string; location?: string } => {
  return property && typeof property === 'object' && typeof property.title === 'string'
}

/**
 * Type guard to check if user is a populated object
 * @param user - User to check
 * @returns Boolean indicating if it's a populated object
 */
const isUserObject = (user: any): user is { email: string; firstName?: string; lastName?: string; phone?: string } => {
  return user && typeof user === 'object' && typeof user.email === 'string'
}

// ===== UTILITY FUNCTIONS =====

/**
 * Format date for display with proper error handling
 * @param dateString - Date string or Date object to format
 * @returns Formatted date string in Spanish locale
 */
const formatDate = (dateString: string | Date | undefined): string => {
  if (!dateString) return 'Fecha no disponible'

  try {
    const date = new Date(dateString)
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Fecha inválida'
    }
  
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } catch (error) {
    console.error('Error formatting date:', dateString, error)
    return 'Fecha inválida'
  }
}

/**
 * Get guest name safely with fallbacks
 * @param user - User object or ID
 * @returns Formatted guest name
 */
const getGuestName = (user: any): string => {
  if (typeof user === 'string') return `ID: ${user}`
  
  if (isUserObject(user)) {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`
    }
    if (user.firstName) return user.firstName
    if (user.lastName) return user.lastName
    return user.email.split('@')[0] // Use email prefix as fallback
  }
  
  return 'Usuario desconocido'
}

/**
 * Get guest email safely
 * @param user - User object or ID
 * @returns Guest email or fallback message
 */
const getGuestEmail = (user: any): string => {
  if (typeof user === 'string') return 'Email no disponible'
  
  if (isUserObject(user)) {
    return user.email
  }
  
  return 'Email no disponible'
}

/**
 * Get guest phone safely
 * @param user - User object or ID
 * @returns Guest phone or fallback message
 */
const getGuestPhone = (user: any): string => {
  if (typeof user === 'string') return 'Teléfono no disponible'
  
  if (isUserObject(user) && user.phone) {
    return user.phone
  }
  
  return 'No especificado'
}

/**
 * Get service type (Property or Tour)
 * @param booking - Booking object
 * @returns Service type string
 */
const getServiceType = (booking: Booking): string => {
  return booking.tourPackage ? 'Tour' : 'Propiedad'
}

/**
 * Get CSS classes for service type badge
 * @param booking - Booking object
 * @returns CSS classes for styling
 */
const getServiceTypeBadge = (booking: Booking): string => {
  const base = 'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium'
  if (booking.tourPackage) {
    return `${base} bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-200`
  }
  return `${base} bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200`
}

/**
 * Get service name safely with type checking
 * @param booking - Booking object
 * @returns Service name or fallback
 */
const getServiceName = (booking: Booking): string => {
  if (booking.tourPackage) {
    if (isTourPackageObject(booking.tourPackage)) {
      return booking.tourPackage.title
    }
    return typeof booking.tourPackage === 'string' ? `Tour ID: ${booking.tourPackage}` : 'Tour sin título'
  }
  
  if (booking.property) {
    if (isPropertyObject(booking.property)) {
      return booking.property.title
    }
    return typeof booking.property === 'string' ? `Propiedad ID: ${booking.property}` : 'Propiedad sin título'
  }
  
  return 'Servicio no especificado'
}

/**
 * Get service location safely
 * @param booking - Booking object
 * @returns Service location or empty string for tours
 */
const getServiceLocation = (booking: Booking): string => {
  if (booking.property) {
    const property = booking.property
    if (isPropertyObject(property)) {
      return property.city || property.location || 'Ciudad no especificada'
    }
    return 'Ubicación no disponible'
  }
  return '' // Tours don't have fixed location
}

/**
 * Get service duration for tours - FIXED VERSION
 * @param booking - Booking object
 * @returns Duration string for tours or empty string
 */
const getServiceDuration = (booking: Booking): string => {
  if (booking.tourPackage) {
    const tour = booking.tourPackage
    // ✅ FIXED: Changed tour.duration === 'number' to typeof tour.duration === 'number'
    if (isTourPackageObject(tour) && typeof tour.duration === 'number') {
      return `${tour.duration} días`
    }
  }
  return '' // Return empty string instead of undefined
}

/**
 * Get user-friendly status label in Spanish
 * @param status - Booking status
 * @returns Spanish status label
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
 * @param status - Booking status
 * @returns CSS classes for styling
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
 * @param status - Payment status
 * @returns Spanish payment status label
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
 * @param status - Payment status
 * @returns CSS classes for styling
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
 * Check if booking status can be updated by host
 * @param status - Current booking status
 * @returns Boolean indicating if status can be updated
 */
const canUpdateStatus = (status: string): boolean => {
  return status !== 'cancelled' && status !== 'completed'
}

/**
 * Check if payment status can be updated by host
 * @param paymentStatus - Current payment status
 * @returns Boolean indicating if payment status can be updated
 */
const canUpdatePaymentStatus = (paymentStatus: string): boolean => {
  return paymentStatus !== 'refunded'
}

/**
 * Format currency for display
 * @param amount - Amount to format
 * @returns Formatted currency string
 */
const formatCurrency = (amount: number | undefined): string => {
  if (!amount) return '$0'
  return `$${amount.toLocaleString()}`
}

/**
 * Helper functions for safe date formatting in templates
 */
const formatCreatedAt = (booking: Booking): string => {
  return hasCreatedAt(booking) ? formatDate(booking.createdAt) : 'Fecha no disponible'
}

const formatUpdatedAt = (booking: Booking): string => {
  return hasUpdatedAt(booking) ? formatDate(booking.updatedAt) : 'Fecha no disponible'
}
</script>