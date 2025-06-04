<template>
  <transition name="fade">
    <div
      v-if="!accepted"
      class="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 text-gray-800 dark:text-white shadow-md p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6"
      role="dialog"
      aria-label="Aviso de cookies"
    >
      <!-- Cookie message -->
      <p class="text-sm md:text-base flex-1">
        Utilizamos cookies para mejorar tu experiencia en GuaraníHost. Al continuar navegando, aceptas nuestra
        <RouterLink to="/privacy" class="underline text-primary hover:text-indigo-700 dark:hover:text-indigo-400">Política de Privacidad</RouterLink>.
      </p>

      <!-- Accept button -->
      <button
        @click="acceptCookies"
        class="bg-primary text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition text-sm md:text-base"
        aria-label="Aceptar cookies"
      >
        Aceptar
      </button>
    </div>
  </transition>
</template>

<script setup lang="ts">
// CookieConsent.vue: Accessible and responsive cookie consent banner.
// Automatically shows until user accepts; stored in localStorage.
import { ref, onMounted } from 'vue'

const accepted = ref(false)

const acceptCookies = () => {
  accepted.value = true
  localStorage.setItem('cookieAccepted', 'true')
}

onMounted(() => {
  accepted.value = localStorage.getItem('cookieAccepted') === 'true'
})
</script>

<style scoped>
/* Optional: Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
