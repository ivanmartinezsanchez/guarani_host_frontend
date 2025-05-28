<template>
  <div class="max-w-7xl mx-auto p-6">
    <!-- Host Dashboard Title -->
    <h1 class="text-3xl font-bold mb-8 text-center text-primary">
      Panel de Control del Anfitrión
    </h1>

    <!-- Dashboard Cards Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Manage Properties -->
      <DashboardCard
        title="Mis Propiedades"
        icon="Home"
        to="/host/properties"
      />

      <!-- Manage Tour Packages -->
      <DashboardCard
        title="Mis Paquetes Turísticos"
        icon="MapPinned"
        to="/host/tours"
      />

      <!-- View Reservations -->
      <DashboardCard
        title="Mis Reservas"
        icon="CalendarCheck"
        to="/host/bookings"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * HostDashboardView.vue
 * - Host's main control panel with quick links
 * - Uses DashboardCard component with icons
 */

import DashboardCard from '@/components/DashboardCard.vue'
</script>

<style scoped>
/* Primary color styling (Airbnb-inspired) */
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
