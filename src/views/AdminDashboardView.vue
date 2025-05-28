<template>
  <div class="max-w-7xl mx-auto p-6">
    <!-- Admin dashboard title -->
    <h1 class="text-3xl font-bold text-primary text-center mb-8">
      Panel de Control Administrador
    </h1>

    <!-- Admin dashboard cards grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Manage users -->
      <DashboardCard
        title="Usuarios"
        icon="User"
        to="/admin/users"
      />

      <!-- Manage properties -->
      <DashboardCard
        title="Propiedades"
        icon="Home"
        to="/admin/properties"
      />

      <!-- Manage tour packages -->
      <DashboardCard
        title="Paquetes Turísticos"
        icon="MapPinned"
        to="/admin/tours"
      />

      <!-- Manage bookings -->
      <DashboardCard
        title="Reservas"
        icon="CalendarCheck"
        to="/admin/bookings"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * AdminDashboardView.vue
 * -----------------------
 * Admin panel with access to all system resources:
 * - Users
 * - Properties
 * - Tour packages
 * - Bookings
 */

import DashboardCard from '@/components/DashboardCard.vue'
</script>

<style scoped>
/* Primary brand color */
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
