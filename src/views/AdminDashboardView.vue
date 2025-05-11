<template>
  <RouterLink
    :to="to"
    class="block bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 hover:shadow-lg transition duration-300"
  >
    <div class="flex items-center gap-4">
      <!-- Dynamic icon component -->
      <component :is="iconComponent" class="w-8 h-8 text-primary" />
      <h2 class="text-lg font-semibold text-gray-800 dark:text-white">{{ title }}</h2>
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
/**
 * DashboardCard component
 * Used to display a management section with icon and label
 * Props:
 * - title: string - the title to show
 * - icon: one of the allowed icon names
 * - to: router path
 */

import { defineProps, computed } from 'vue'
import { User, Home, CalendarCheck, MapPinned } from 'lucide-vue-next'

const props = defineProps<{
  title: string
  icon: 'User' | 'Home' | 'CalendarCheck' | 'MapPinned'
  to: string
}>()

// Icon mapping
const icons = { User, Home, CalendarCheck, MapPinned }

// Compute the actual icon component from the prop
const iconComponent = computed(() => icons[props.icon])
</script>

<style scoped>
.text-primary {
  /* Indigo base color (Airbnb-inspired) */
  color: #3F51B5;
}
</style>
