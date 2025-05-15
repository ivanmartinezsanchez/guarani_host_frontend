<template>
  <div class="max-w-7xl mx-auto p-6">
    <!-- Title -->
    <h1 class="text-3xl font-bold text-primary text-center mb-8">Panel de Control del Uusario</h1>

    <!-- Cards Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- My Bookings -->
      <DashboardCard
        title="Mis Reservas"
        icon="CalendarCheck"
        to="/profile/bookings"
      />

      <!-- Payments -->
      <DashboardCard
        title="Mis Pagos"
        icon="CreditCard"
        to="/profile/payments"
      />

      <!-- Support -->
      <DashboardCard
        title="Soporte"
        icon="HelpCircle"
        to="/support"
      />

      <!-- Favorites -->
      <DashboardCard
        title="Favoritos"
        icon="Heart"
        to="/profile/favorites"
      />

      <!-- Profile Settings -->
      <DashboardCard
        title="Mi Perfil"
        icon="User"
        to="/profile"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import DashboardCard from '@/components/DashboardCard.vue'
</script>

<style scoped>
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
