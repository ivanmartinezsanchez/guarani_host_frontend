<template>
  <!-- App container with dynamic dark mode support -->
  <div :class="{ dark: isDark }">
    <div
      class="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white transition-colors"
    >
      <!-- Global navigation bar -->
      <Navbar />

      <!-- Main content slot for router views -->
      <main class="flex-grow p-4">
        <router-view />
      </main>

      <!-- Footer displayed conditionally depending on route meta -->
      <Footer v-if="showFooter" />

      <!-- Cookie consent banner, shown globally once per user -->
      <CookieConsent />
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * App.vue - Global layout container
 * - Applies dark mode using custom composable
 * - Displays navbar, main content (router-view), and footer
 * - Integrates global CookieConsent component
 */

import { useRoute } from 'vue-router'
import { computed } from 'vue'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import CookieConsent from '@/components/CookieConsent.vue'
import { useTheme } from '@/composables/useTheme'

// Enable dark mode support using custom logic
const { isDark } = useTheme()

// Access current route to conditionally hide footer
const route = useRoute()
const showFooter = computed(() => route.meta.showFooter !== false)
</script>
