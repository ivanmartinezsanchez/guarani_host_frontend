<template>
  <transition name="fade-scale">
    <div class="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center px-4 sm:px-6">
      <div
        class="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-xl w-full max-w-lg sm:max-w-xl md:max-w-2xl relative overflow-y-auto max-h-[90vh] sm:max-h-[85vh]"
      >
        <!-- Close modal button -->
        <button
          @click="$emit('close')"
          class="absolute top-3 right-3 text-gray-500 dark:text-gray-300 hover:text-red-600 transition-colors"
          aria-label="Close modal"
        >
          <XIcon class="w-5 h-5" />
        </button>

        <!-- Modal title slot -->
        <h2
          v-if="$slots.title"
          class="text-xl font-bold mb-4 text-center text-primary flex items-center justify-center gap-2"
        >
          <slot name="title" />
        </h2>

        <!-- Modal content slot -->
        <slot />
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { XIcon } from 'lucide-vue-next'
</script>

<style scoped>
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.3s ease;
}
.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* Custom scrollbar for modal content */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-thumb {
  background-color: rgba(100, 100, 100, 0.4);
  border-radius: 3px;
}

/* Adjust SVG icon colors for better contrast in dark mode */
:deep(svg) {
  stroke: currentColor;
  color: #4b5563; /* Tailwind gray-600 by default */
}

.dark :deep(svg) {
  color: #e5e7eb; /* Tailwind gray-200 for dark mode */
}
</style>
