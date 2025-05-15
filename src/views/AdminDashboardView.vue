<template>
  <div class="max-w-7xl mx-auto p-6">
    <h1 class="text-3xl font-bold text-primary text-center mb-8">Admin Dashboard</h1>

    <!-- Cards grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Users -->
      <DashboardCard title="Users" icon="User" to="/admin/users" />
      <!-- Properties -->
      <DashboardCard title="Properties" icon="Home" to="/admin/homes" />
      <!-- Tours -->
      <DashboardCard title="Tour Packages" icon="MapPinned" to="/admin/tours" />
      <!-- Bookings -->
      <DashboardCard title="Bookings" icon="CalendarCheck" to="/admin/bookings" />
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

