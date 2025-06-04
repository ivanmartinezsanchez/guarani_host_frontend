<!-- DashboardCard.vue - Base reusable dashboard card component -->
<template>
  <div 
    :class="[
      // Base card styling with relative positioning for loading overlay
      'relative bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700',
      // Interactive states
      'transition-all duration-200 hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600',
      // Focus states for accessibility
      'focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-opacity-20',
      // Responsive padding
      'p-4 sm:p-6',
      // Custom classes
      className
    ]"
    :role="role"
    :aria-label="ariaLabel"
    v-bind="$attrs"
  >
    <!-- Header section -->
    <header 
      v-if="$slots.header || title || icon" 
      class="flex items-center justify-between mb-4"
    >
      <div class="flex items-center space-x-3">
        <!-- Icon with improved accessibility -->
        <div 
          v-if="icon" 
          :class="[
            'flex items-center justify-center rounded-lg transition-colors duration-200',
            'w-10 h-10 sm:w-12 sm:h-12',
            iconBg || 'bg-blue-50 dark:bg-blue-900/20'
          ]"
        >
          <component 
            :is="icon" 
            :class="[
              'w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-200',
              iconColor || 'text-blue-600 dark:text-blue-400'
            ]"
            :aria-hidden="true"
          />
        </div>
        
        <!-- Title and subtitle section -->
        <div v-if="title || subtitle || $slots.title">
          <slot name="title">
            <h3 
              :class="[
                'font-semibold text-gray-900 dark:text-white',
                titleSize || 'text-lg sm:text-xl'
              ]"
            >
              {{ title }}
            </h3>
          </slot>
          <p 
            v-if="subtitle" 
            class="text-sm text-gray-500 dark:text-gray-400 mt-1"
          >
            {{ subtitle }}
          </p>
        </div>
      </div>
      
      <!-- Header actions slot -->
      <div v-if="$slots.actions" class="flex items-center space-x-2">
        <slot name="actions" />
      </div>
    </header>

    <!-- Main content area -->
    <main class="space-y-4">
      <slot />
    </main>

    <!-- Footer section -->
    <footer v-if="$slots.footer" class="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
      <slot name="footer" />
    </footer>

    <!-- Loading overlay with improved accessibility -->
    <div 
      v-if="loading"
      class="absolute inset-0 bg-white/80 dark:bg-gray-800/80 rounded-xl flex items-center justify-center backdrop-blur-sm"
      aria-label="Cargando contenido"
      role="status"
    >
      <div class="flex items-center space-x-3">
        <!-- Improved loading spinner -->
        <div 
          class="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-blue-600" 
          aria-hidden="true"
        ></div>
        <span class="text-sm font-medium text-gray-600 dark:text-gray-300">
          {{ loadingText || 'Cargando...' }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * DashboardCard.vue
 * -----------------
 * Reusable dashboard card component for admin and host dashboards
 * 
 * Features:
 * - Fully responsive design (mobile-first approach)
 * - Dark/light mode support with smooth transitions
 * - WCAG 2.1 AA accessibility compliance
 * - Flexible slot system for content customization
 * - Loading states with overlay
 * - Interactive hover and focus states
 * - Icon integration with component support
 * 
 * Props:
 * @param {String} title - Main card title
 * @param {String} subtitle - Optional subtitle text
 * @param {Object|Function} icon - Vue component for icon display
 * @param {String} className - Additional CSS classes
 * @param {String} iconColor - Tailwind color classes for icon
 * @param {String} iconBg - Tailwind background classes for icon container
 * @param {Boolean} loading - Show loading overlay
 * @param {String} loadingText - Custom loading text
 * @param {String} role - ARIA role for accessibility
 * @param {String} ariaLabel - ARIA label for screen readers
 */

// Props for customization with proper TypeScript-like definitions
const props = defineProps({
  // Card content props
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  },
  icon: {
    type: [Object, Function], // Support for Vue components
    default: null
  },
  
  // Styling customization props
  className: {
    type: String,
    default: ''
  },
  titleSize: {
    type: String,
    default: 'text-lg sm:text-xl'
  },
  iconColor: {
    type: String,
    default: 'text-blue-600 dark:text-blue-400'
  },
  iconBg: {
    type: String,
    default: 'bg-blue-50 dark:bg-blue-900/20'
  },
  
  // State management props
  loading: {
    type: Boolean,
    default: false
  },
  loadingText: {
    type: String,
    default: 'Cargando...'
  },
  
  // Accessibility props
  role: {
    type: String,
    default: 'region'
  },
  ariaLabel: {
    type: String,
    default: ''
  }
})

// Inherit all HTML attributes for maximum flexibility and accessibility
defineOptions({
  inheritAttrs: false
})
</script>