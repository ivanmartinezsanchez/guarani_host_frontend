<template>
  <section
    class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-center px-6 animate-fade-in"
    role="alert"
    aria-label="Página no encontrada"
  >
    <div class="max-w-md w-full space-y-6">
      <!-- Icon -->
      <div class="text-primary">
        <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto w-20 h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4m0 4h.01M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10
          10-4.48 10-10S17.52 2 12 2z" />
        </svg>
      </div>

      <!-- Heading -->
      <h1 class="text-5xl font-extrabold text-primary">404</h1>

      <!-- Message -->
      <p class="text-lg text-gray-700 dark:text-gray-300">
        La página que buscas no existe o ha sido movida.
      </p>

      <!-- CTA Button -->
      <router-link
        to="/"
        class="inline-flex items-center justify-center px-6 py-2 bg-primary hover:bg-primary-dark text-white text-sm font-medium rounded-xl shadow transition"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Volver al inicio
      </router-link>
    </div>
  </section>
</template>

<script setup lang="ts">
// No script logic needed
</script>

<style scoped>
/* Smooth fade-in animation */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.6s ease-out;
}
</style>

