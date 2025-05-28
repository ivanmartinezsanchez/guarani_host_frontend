<template>
  <!-- Dashboard navigation card -->
  <RouterLink
    :to="to"
    class="group block w-full bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary"
    :aria-label="`Go to ${title}`"
  >
    <div class="flex items-center gap-4">
      <!-- Dynamic icon with scale animation on hover -->
      <component
        :is="iconComponent"
        class="w-10 h-10 text-primary group-hover:scale-110 transition-transform duration-300"
      />
      <h2 class="text-lg font-semibold text-gray-800 dark:text-white">
        {{ title }}
      </h2>
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
/**
 * DashboardCard.vue
 * -----------------
 * Reusable dashboard card component with dynamic icon and navigation.
 * 
 * Props:
 * - title: string        // Section title displayed below the icon
 * - icon: string         // Lucide icon name from allowed set
 * - to: string           // Vue Router path to navigate to
 */

import { defineProps, computed } from 'vue'
import {
  User,
  Home,
  CalendarCheck,
  MapPinned,
  CreditCard,
  HelpCircle,
  Heart
} from 'lucide-vue-next'

// Define props and allowed icon names
const props = defineProps<{
  title: string
  icon: 'User' | 'Home' | 'CalendarCheck' | 'MapPinned' | 'CreditCard' | 'HelpCircle' | 'Heart'
  to: string
}>()

// Lookup table to resolve icon components dynamically
const icons = {
  User,
  Home,
  CalendarCheck,
  MapPinned,
  CreditCard,
  HelpCircle,
  Heart
}

// Computed property to resolve component for given icon name
const iconComponent = computed(() => icons[props.icon])
</script>

<style scoped>
/* Color styles for consistency with primary theme */
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
