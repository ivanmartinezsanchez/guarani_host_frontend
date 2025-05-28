<template>
  <div class="max-w-7xl mx-auto p-6">
    <!-- User dashboard title -->
    <h1 class="text-3xl font-bold text-primary text-center mb-8">
      Panel de Control del Usuario
    </h1>

    <!-- User dashboard cards grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- View bookings -->
      <DashboardCard
        title="Mis Reservas"
        icon="CalendarCheck"
        to="/profile/bookings"
      />

      <!-- View payments -->
      <DashboardCard
        title="Mis Pagos"
        icon="CreditCard"
        to="/profile/payments"
      />

      <!-- Help and support -->
      <DashboardCard
        title="Soporte"
        icon="HelpCircle"
        to="/support"
      />

      <!-- Favorite listings -->
      <DashboardCard
        title="Favoritos"
        icon="Heart"
        to="/profile/favorites"
      />

      <!-- Profile settings -->
      <DashboardCard
        title="Mi Perfil"
        icon="User"
        to="/profile"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * UserDashboardView.vue
 * ----------------------
 * Dashboard for regular users with access to:
 * - Bookings
 * - Payments
 * - Support
 * - Favorites
 * - Profile
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
