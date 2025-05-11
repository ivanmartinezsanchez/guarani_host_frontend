<template>
  <div :class="{ dark: isDark }">
    <div class="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white transition-colors">
      <Navbar />
      <main class="flex-grow p-4">
        <router-view />
      </main>
      <Footer v-if="showFooter" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import { useTheme } from '@/composables/useTheme'

const { isDark } = useTheme()
const route = useRoute()

// Mostrar footer 
const showFooter = computed(() => route.meta.showFooter !== false)
</script>
