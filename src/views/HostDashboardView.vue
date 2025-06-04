<template>
  <!-- Main host dashboard container - adaptive height, not full screen -->
  <div class="bg-background dark:bg-gray-900">
    <!-- Header Section - Host focused -->
    <header class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <!-- Title section with responsive text -->
          <div>
            <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-darkText dark:text-white">
              Panel de Control del Anfitrión
            </h1>
            <p class="text-lightText dark:text-gray-400 mt-1 text-sm sm:text-base">
              Gestiona tus propiedades, tours y reservas
            </p>
          </div>
          <!-- Host badge - responsive sizing -->
          <div class="flex items-center space-x-4">
            <div class="bg-primary/10 p-2 sm:p-3 rounded-full" aria-hidden="true">
              <UserCheckIcon class="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-primary" />
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content - Responsive padding and spacing -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      <!-- Main Management Cards Section -->
      <section aria-labelledby="management-heading" class="mb-6 sm:mb-8">
        <h2 id="management-heading" class="text-lg sm:text-xl lg:text-2xl font-semibold text-darkText dark:text-white mb-4 sm:mb-6">
          Gestión Principal
        </h2>
        
        <!-- Responsive grid: 1 col mobile, 2 cols tablet, 3 cols desktop -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <!-- Property Management Card - Clickable -->
          <button
            @click="navigateToProperties"
            @keydown.enter="navigateToProperties"
            @keydown.space.prevent="navigateToProperties"
            class="text-left w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 rounded-xl"
            aria-label="Acceder a gestión de mis propiedades"
          >
            <DashboardCard
              title="Mis Propiedades"
              subtitle="Gestiona tus alojamientos y disponibilidad"
              :icon="HomeIcon"
              icon-color="text-green-600 dark:text-green-400"
              icon-bg="bg-green-50 dark:bg-green-900/20"
              class="hover:scale-105 transition-transform duration-200 cursor-pointer h-full"
            >
              <!-- Clean content without statistics -->
              <div class="space-y-3">
                <p class="text-sm text-lightText dark:text-gray-400">
                  Administra tus propiedades, actualiza información, precios y configura disponibilidad.
                </p>
              </div>
              
              <!-- Action indicator -->
              <template #footer>
                <div class="flex items-center justify-between text-green-700 dark:text-green-300">
                  <span class="text-sm font-medium">Ver propiedades</span>
                  <ChevronRightIcon class="w-4 h-4" />
                </div>
              </template>
            </DashboardCard>
          </button>

          <!-- Tours Management Card - Clickable -->
          <button
            @click="navigateToTours"
            @keydown.enter="navigateToTours"
            @keydown.space.prevent="navigateToTours"
            class="text-left w-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 rounded-xl"
            aria-label="Acceder a gestión de mis tours"
          >
            <DashboardCard
              title="Mis Tours y Experiencias"
              subtitle="Crea y administra tus paquetes turísticos"
              :icon="MapPinIcon"
              icon-color="text-purple-600 dark:text-purple-400"
              icon-bg="bg-purple-50 dark:bg-purple-900/20"
              class="hover:scale-105 transition-transform duration-200 cursor-pointer h-full"
            >
              <!-- Clean content without statistics -->
              <div class="space-y-3">
                <p class="text-sm text-lightText dark:text-gray-400">
                  Diseña experiencias únicas, define itinerarios y gestiona tus ofertas turísticas.
                </p>
              </div>
              
              <!-- Action indicator -->
              <template #footer>
                <div class="flex items-center justify-between text-purple-700 dark:text-purple-300">
                  <span class="text-sm font-medium">Administrar tours</span>
                  <ChevronRightIcon class="w-4 h-4" />
                </div>
              </template>
            </DashboardCard>
          </button>

          <!-- Bookings Management Card - Clickable -->
          <button
            @click="navigateToBookings"
            @keydown.enter="navigateToBookings"
            @keydown.space.prevent="navigateToBookings"
            class="text-left w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-xl"
            aria-label="Acceder a gestión de mis reservas"
          >
            <DashboardCard
              title="Mis Reservas"
              subtitle="Monitorea y gestiona todas tus reservas"
              :icon="CalendarIcon"
              icon-color="text-blue-600 dark:text-blue-400"
              icon-bg="bg-blue-50 dark:bg-blue-900/20"
              class="hover:scale-105 transition-transform duration-200 cursor-pointer h-full"
            >
              <!-- Clean content without statistics -->
              <div class="space-y-3">
                <p class="text-sm text-lightText dark:text-gray-400">
                  Revisa reservas pendientes, confirma disponibilidad y gestiona cancelaciones.
                </p>
              </div>
              
              <!-- Action indicator -->
              <template #footer>
                <div class="flex items-center justify-between text-blue-700 dark:text-blue-300">
                  <span class="text-sm font-medium">Ver reservas</span>
                  <ChevronRightIcon class="w-4 h-4" />
                </div>
              </template>
            </DashboardCard>
          </button>
        </div>
      </section>

      <!-- Host Tools Section - Responsive and accessible -->
      <section aria-labelledby="tools-heading" class="bg-gradient-to-r from-[#3F51B5] to-[#303F9F] rounded-xl lg:rounded-2xl p-4 sm:p-6 lg:p-8 text-white">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
          <!-- Section header -->
          <div class="mb-4 lg:mb-0">
            <h2 id="tools-heading" class="text-lg sm:text-xl lg:text-2xl font-bold mb-2">
              Herramientas del Anfitrión
            </h2>
            <p class="text-blue-100 text-sm sm:text-base">
              Acceso rápido a configuraciones y herramientas de gestión
            </p>
          </div>
          
          <!-- Tools grid - Responsive 2 cols mobile and desktop -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <!-- Financial Reports Tool -->
            <button 
              @click="navigateToFinancials"
              class="bg-white/20 hover:bg-white/30 focus:bg-white/30 backdrop-blur-sm rounded-lg lg:rounded-xl p-3 sm:p-4 transition-all duration-200 text-center group focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-label="Ver reportes financieros"
            >
              <DollarSignIcon class="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-2 group-hover:scale-110 group-focus:scale-110 transition-transform" />
              <span class="text-xs sm:text-sm font-medium">Finanzas</span>
            </button>
            
            <!-- Help & Support Tool -->
            <button 
              @click="navigateToSupport"
              class="bg-white/20 hover:bg-white/30 focus:bg-white/30 backdrop-blur-sm rounded-lg lg:rounded-xl p-3 sm:p-4 transition-all duration-200 text-center group focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-label="Acceder a ayuda y soporte"
            >
              <HelpCircleIcon class="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-2 group-hover:scale-110 group-focus:scale-110 transition-transform" />
              <span class="text-xs sm:text-sm font-medium">Ayuda</span>
            </button>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
/**
 * HostDashboardView.vue
 * ---------------------
 * Host dashboard with navigation for property and booking management
 * 
 * Features:
 * - Fully responsive design (mobile-first approach)
 * - WCAG 2.1 AA accessibility compliance
 * - Clickable cards for navigation
 * - Keyboard navigation support
 * - No statistics or counters - clean descriptive content
 * - Host-specific tools and navigation
 * - Vue Router integration ready
 * 
 * Navigation Structure:
 * - Properties: /host/properties
 * - Tours: /host/tours
 * - Bookings: /host/bookings
 * - Financials: /host/financials
 * - Support: /host/support
 * 
 * Responsive Breakpoints:
 * - Mobile: < 640px (1 column)
 * - Tablet: 640px - 1024px (2 columns)
 * - Desktop: > 1024px (3 columns)
 */

import { useRouter } from 'vue-router'

// Import icon components from lucide-vue-next
import { 
  Home as HomeIcon,
  MapPin as MapPinIcon,
  Calendar as CalendarIcon,
  UserCheck as UserCheckIcon,
  DollarSign as DollarSignIcon,
  HelpCircle as HelpCircleIcon,
  ChevronRight as ChevronRightIcon
} from 'lucide-vue-next'

// Import DashboardCard component
import DashboardCard from '@/components/ui/DashboardCard.vue'

// Router instance for navigation
const router = useRouter()

/**
 * Navigation functions for each host management section
 * These functions handle routing to respective host pages
 */

// Navigate to property management
const navigateToProperties = () => {
  router.push('/host/properties')
}

// Navigate to tours management
const navigateToTours = () => {
  router.push('/host/tours')
}

// Navigate to bookings management
const navigateToBookings = () => {
  router.push('/host/bookings')
}

// Navigate to financial reports and earnings
const navigateToFinancials = () => {
  router.push('/host/financials')
}

// Navigate to help and support
const navigateToSupport = () => {
  router.push('/host/support')
}
</script>

<style scoped>
/**
 * Custom CSS for brand-specific colors not available in default Tailwind
 * Using scoped styles to avoid global pollution
 */

/* Primary brand color */
.text-primary {
  color: #3F51B5;
}

.bg-primary {
  background-color: #3F51B5;
}

.hover\:bg-primary-dark:hover {
  background-color: #303F9F;
}

/* Custom text colors for brand consistency */
.text-darkText {
  color: #2C2C2C;
}

.text-lightText {
  color: #9E9E9E;
}

/* Background color for light theme */
.bg-background {
  background-color: #F5F5F5;
}

/* Focus ring enhancement for better accessibility */
.focus\:ring-primary:focus {
  --tw-ring-color: #3F51B5;
}

/* Ensure button text alignment */
button {
  text-align: inherit;
}
</style>