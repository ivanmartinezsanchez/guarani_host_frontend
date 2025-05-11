<template>
  <div class="max-w-7xl mx-auto p-6">
    <h1 class="text-3xl font-bold mb-8 text-center text-primary">Panel del Anfitrión</h1>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Link to manage vacation homes -->
      <RouterLink
        to="/host/homes"
        aria-label="Gestionar propiedades"
        class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] flex flex-col items-center text-center group"
      >
        <HomeIcon class="w-10 h-10 text-primary group-hover:scale-110 transition-transform" />
        <span class="mt-3 font-semibold text-primary text-lg">Mis Propiedades</span>
      </RouterLink>

      <!-- Link to manage tour packages -->
      <RouterLink
        to="/host/tours"
        aria-label="Gestionar paquetes turísticos"
        class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] flex flex-col items-center text-center group"
      >
        <MapPinnedIcon class="w-10 h-10 text-primary group-hover:scale-110 transition-transform" />
        <span class="mt-3 font-semibold text-primary text-lg">Mis Paquetes</span>
      </RouterLink>

      <!-- Link to view and manage bookings -->
      <RouterLink
        to="/host/bookings"
        aria-label="Ver reservas"
        class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] flex flex-col items-center text-center group"
      >
        <CalendarCheckIcon class="w-10 h-10 text-primary group-hover:scale-110 transition-transform" />
        <span class="mt-3 font-semibold text-primary text-lg">Reservas</span>
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { HomeIcon, MapPinnedIcon, CalendarCheckIcon } from 'lucide-vue-next'
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
