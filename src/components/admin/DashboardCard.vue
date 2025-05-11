<template>
  <RouterLink
    :to="to"
    class="block bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 hover:shadow-lg transition duration-300"
    aria-label="Go to {{ title }}"  <!-- Added accessibility -->
  >
    <div class="flex items-center gap-4">
      <!-- Dynamically render the icon based on the 'icon' prop -->
      <component :is="iconComponent" class="w-8 h-8 text-primary" />
      <h2 class="text-lg font-semibold text-gray-800 dark:text-white">{{ title }}</h2>
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import {
  User,
  Home,
  CalendarCheck,
  MapPinned
} from 'lucide-vue-next'

// Define the props for the component
const props = defineProps<{
  title: string
  icon: 'User' | 'Home' | 'CalendarCheck' | 'MapPinned'  // Define icon options
  to: string
}>()

// Mapping of icon names to components
const icons = { User, Home, CalendarCheck, MapPinned }
// Dynamically resolve the icon component based on the 'icon' prop
const iconComponent = icons[props.icon]
</script>

<style scoped>
/* Card styles */
.block {
  display: block;
  width: 100%;
}
.bg-primary {
  background-color: #3F51B5;
}
.text-primary {
  color: #3F51B5;
}

/* Icon and title styling */
.icon {
  width: 32px;
  height: 32px;
}
</style>
