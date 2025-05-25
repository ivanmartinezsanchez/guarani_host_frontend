<template>
  <div class="max-w-7xl mx-auto p-6">
    <!-- Page title -->
    <h1 class="text-3xl font-bold mb-8 text-center text-primary">
      Panel de Control del Anfitrión
    </h1>

    <!-- Dashboard card grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Manage Properties -->
      <DashboardCard
        title="Mis Propiedades"
        icon="Home"
        to="/host/properties"
      />

      <!-- Manage Tour Packages -->
      <DashboardCard
        title="Mis Tours"
        icon="MapPinned"
        to="/host/tours"
      />

      <!-- View Bookings -->
      <DashboardCard
        title="Reservas"
        icon="CalendarCheck"
        to="/host/bookings"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
// Import reusable dashboard card component
import DashboardCard from '@/components/DashboardCard.vue'
</script>

<style scoped>
/* Primary color (Airbnb-inspired) */
.text-primary {
  color: #3F51B5;
}

/* Primary hover color */
.bg-primary {
  background-color: #3F51B5;
}

.hover\:bg-hover:hover {
  background-color: #303F9F;
}
</style>
