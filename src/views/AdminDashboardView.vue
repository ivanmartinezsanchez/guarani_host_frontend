<template>
  <!-- Main dashboard container - adaptive height, not full screen -->
  <div class="bg-background dark:bg-gray-900">
    <!-- Header Section - Compact and responsive -->
    <header class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <!-- Title section with responsive text -->
          <div>
            <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-darkText dark:text-white">
              Panel de Control
            </h1>
            <p class="text-lightText dark:text-gray-400 mt-1 text-sm sm:text-base">
              Gestiona todo desde aquí, Admin Principal
            </p>
          </div>
          <!-- Admin badge - responsive sizing -->
          <div class="flex items-center space-x-4">
            <div class="bg-primary/10 p-2 sm:p-3 rounded-full" aria-hidden="true">
              <ShieldCheckIcon class="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-primary" />
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
        
        <!-- Responsive grid: 1 col mobile, 2 cols tablet, 4 cols desktop -->
        <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
          <!-- User Management Card - Clickable -->
          <button
            @click="navigateToUsers"
            @keydown.enter="navigateToUsers"
            @keydown.space.prevent="navigateToUsers"
            class="text-left w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-xl"
            aria-label="Acceder a gestión de usuarios"
          >
            <DashboardCard
              title="Gestión de Usuarios"
              subtitle="Administra usuarios, roles y permisos del sistema"
              :icon="UsersIcon"
              icon-color="text-blue-600 dark:text-blue-400"
              icon-bg="bg-blue-50 dark:bg-blue-900/20"
              class="hover:scale-105 transition-transform duration-200 cursor-pointer h-full"
            >
              <!-- Clean content without statistics -->
              <div class="space-y-3">
                <p class="text-sm text-lightText dark:text-gray-400">
                  Gestiona perfiles de usuario, asigna roles y configura permisos de acceso al sistema.
                </p>
              </div>
              
              <!-- Action indicator -->
              <template #footer>
                <div class="flex items-center justify-between text-blue-700 dark:text-blue-300">
                  <span class="text-sm font-medium">Acceder</span>
                  <ChevronRightIcon class="w-4 h-4" />
                </div>
              </template>
            </DashboardCard>
          </button>

          <!-- Property Management Card - Clickable -->
          <button
            @click="navigateToProperties"
            @keydown.enter="navigateToProperties"
            @keydown.space.prevent="navigateToProperties"
            class="text-left w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 rounded-xl"
            aria-label="Acceder a gestión de propiedades"
          >
            <DashboardCard
              title="Propiedades"
              subtitle="Supervisa alojamientos, precios y disponibilidad"
              :icon="HomeIcon"
              icon-color="text-green-600 dark:text-green-400"
              icon-bg="bg-green-50 dark:bg-green-900/20"
              class="hover:scale-105 transition-transform duration-200 cursor-pointer h-full"
            >
              <!-- Clean content without statistics -->
              <div class="space-y-3">
                <p class="text-sm text-lightText dark:text-gray-400">
                  Administra propiedades, actualiza información y monitorea el estado de los alojamientos.
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
            aria-label="Acceder a gestión de tours"
          >
            <DashboardCard
              title="Tours y Experiencias"
              subtitle="Gestiona paquetes turísticos y experiencias únicas"
              :icon="MapPinIcon"
              icon-color="text-purple-600 dark:text-purple-400"
              icon-bg="bg-purple-50 dark:bg-purple-900/20"
              class="hover:scale-105 transition-transform duration-200 cursor-pointer h-full"
            >
              <!-- Clean content without statistics -->
              <div class="space-y-3">
                <p class="text-sm text-lightText dark:text-gray-400">
                  Crea y administra tours, define itinerarios y gestiona las experiencias turísticas.
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
            class="text-left w-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 rounded-xl"
            aria-label="Acceder a gestión de reservas"
          >
            <DashboardCard
              title="Reservas"
              subtitle="Monitorea y administra todas las reservas del sistema"
              :icon="CalendarIcon"
              icon-color="text-orange-600 dark:text-orange-400"
              icon-bg="bg-orange-50 dark:bg-orange-900/20"
              class="hover:scale-105 transition-transform duration-200 cursor-pointer h-full"
            >
              <!-- Clean content without statistics -->
              <div class="space-y-3">
                <p class="text-sm text-lightText dark:text-gray-400">
                  Supervisa reservas, procesa confirmaciones y gestiona cancelaciones del sistema.
                </p>
              </div>
              
              <!-- Action indicator -->
              <template #footer>
                <div class="flex items-center justify-between text-orange-700 dark:text-orange-300">
                  <span class="text-sm font-medium">Ver reservas</span>
                  <ChevronRightIcon class="w-4 h-4" />
                </div>
              </template>
            </DashboardCard>
          </button>
        </div>
      </section>

      <!-- Administrative Tools Section - Responsive and accessible -->
      <section aria-labelledby="tools-heading" class="bg-gradient-to-r from-[#3F51B5] to-[#303F9F] rounded-xl lg:rounded-2xl p-4 sm:p-6 lg:p-8 text-white">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
          <!-- Section header -->
          <div class="mb-4 lg:mb-0">
            <h2 id="tools-heading" class="text-lg sm:text-xl lg:text-2xl font-bold mb-2">
              Herramientas Administrativas
            </h2>
            <p class="text-blue-100 text-sm sm:text-base">
              Acceso rápido a configuraciones y herramientas del sistema
            </p>
          </div>
          
          <!-- Tools grid - Responsive from 2 cols mobile to 4 cols desktop -->
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <!-- Settings Tool -->
            <button 
              @click="navigateToSettings"
              class="bg-white/20 hover:bg-white/30 focus:bg-white/30 backdrop-blur-sm rounded-lg lg:rounded-xl p-3 sm:p-4 transition-all duration-200 text-center group focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-label="Acceder a configuración del sistema"
            >
              <SettingsIcon class="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-2 group-hover:scale-110 group-focus:scale-110 transition-transform" />
              <span class="text-xs sm:text-sm font-medium">Configuración</span>
            </button>
            
            <!-- Reports Tool -->
            <button 
              @click="navigateToReports"
              class="bg-white/20 hover:bg-white/30 focus:bg-white/30 backdrop-blur-sm rounded-lg lg:rounded-xl p-3 sm:p-4 transition-all duration-200 text-center group focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-label="Ver reportes y estadísticas"
            >
              <BarChart3Icon class="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-2 group-hover:scale-110 group-focus:scale-110 transition-transform" />
              <span class="text-xs sm:text-sm font-medium">Reportes</span>
            </button>
            
            <!-- Database Tool -->
            <button 
              @click="navigateToDatabase"
              class="bg-white/20 hover:bg-white/30 focus:bg-white/30 backdrop-blur-sm rounded-lg lg:rounded-xl p-3 sm:p-4 transition-all duration-200 text-center group focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-label="Gestionar base de datos"
            >
              <DatabaseIcon class="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-2 group-hover:scale-110 group-focus:scale-110 transition-transform" />
              <span class="text-xs sm:text-sm font-medium">Base de Datos</span>
            </button>
            
            <!-- System Monitor Tool -->
            <button 
              @click="navigateToSystem"
              class="bg-white/20 hover:bg-white/30 focus:bg-white/30 backdrop-blur-sm rounded-lg lg:rounded-xl p-3 sm:p-4 transition-all duration-200 text-center group focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-label="Monitorear estado del sistema"
            >
              <MonitorIcon class="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-2 group-hover:scale-110 group-focus:scale-110 transition-transform" />
              <span class="text-xs sm:text-sm font-medium">Sistema</span>
            </button>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
/**
 * AdminDashboardView.vue
 * ----------------------
 * Admin dashboard with clickable navigation cards
 * 
 * Features:
 * - Fully responsive (mobile-first approach)
 * - WCAG 2.1 AA accessibility compliance
 * - Clickable cards for navigation
 * - Keyboard navigation support
 * - No statistics or counters
 * - Clean descriptive content
 * - Vue Router integration ready
 * 
 * Navigation Structure:
 * - Users: /admin/users
 * - Properties: /admin/properties  
 * - Tours: /admin/tours
 * - Bookings: /admin/bookings
 */

import { useRouter } from 'vue-router'

// Import icon components from lucide-vue-next
import { 
  Users as UsersIcon,
  Home as HomeIcon,
  MapPin as MapPinIcon,
  Calendar as CalendarIcon,
  ShieldCheck as ShieldCheckIcon,
  Settings as SettingsIcon,
  BarChart3 as BarChart3Icon,
  Database as DatabaseIcon,
  Monitor as MonitorIcon,
  ChevronRight as ChevronRightIcon
} from 'lucide-vue-next'

// Import DashboardCard component
import DashboardCard from '@/components/ui/DashboardCard.vue'

// Router instance for navigation
const router = useRouter()

/**
 * Navigation functions for each management section
 * These functions handle routing to respective admin pages
 */

// Navigate to user management
const navigateToUsers = () => {
  router.push('/admin/users')
}

// Navigate to property management
const navigateToProperties = () => {
  router.push('/admin/properties')
}

// Navigate to tours management
const navigateToTours = () => {
  router.push('/admin/tours')
}

// Navigate to bookings management
const navigateToBookings = () => {
  router.push('/admin/bookings')
}

// Navigate to system settings
const navigateToSettings = () => {
  router.push('/admin/settings')
}

// Navigate to reports and analytics
const navigateToReports = () => {
  router.push('/admin/reports')
}

// Navigate to database management
const navigateToDatabase = () => {
  router.push('/admin/database')
}

// Navigate to system monitoring
const navigateToSystem = () => {
  router.push('/admin/system')
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