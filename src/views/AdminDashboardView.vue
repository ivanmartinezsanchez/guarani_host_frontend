<template>
  <div class="max-w-7xl mx-auto p-6">
    <h1 class="text-3xl font-bold text-primary text-center mb-8">Panel de Control Administrador</h1>

    <!-- Cards grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Users -->
      <DashboardCard title="Usuarios" icon="User" to="/admin/users" />
      <!-- Properties -->
      <DashboardCard title="Propiedades" icon="Home" to="/admin/properties" />
      <!-- Tours -->
      <DashboardCard title="Paquetes Turísticos" icon="MapPinned" to="/admin/tours" />
      <!-- Bookings -->
      <DashboardCard title="Reservas" icon="CalendarCheck" to="/admin/bookings" />
    </div>
  </div>
</template>

<script setup lang="ts">
import DashboardCard from '@/components/admin/DashboardCard.vue'
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

