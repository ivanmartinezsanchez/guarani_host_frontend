<template>
  <div class="w-full">
    <!-- Top label (non-floating) -->
    <label
      v-if="label"
      :for="id"
      class="block text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mb-1"
    >
      {{ label }}
    </label>

    <div class="relative">
      <select
        :id="id"
        :value="modelValue ?? ''"
        :required="required"
        :disabled="disabled"
        @change="handleChange"
        :class="[
          'w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent appearance-none bg-no-repeat bg-right pr-10',
          error 
            ? 'border-red-500 bg-red-50 dark:bg-red-900/10 text-red-900 dark:text-red-100' 
            : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white',
          disabled && 'opacity-50 cursor-not-allowed'
        ]"
        style="background-size: 12px; background-position: right 12px center;"
      >
        <option 
          v-for="option in options" 
          :key="option.value" 
          :value="option.value"
          :disabled="option.disabled"
        >
          {{ option.label }}
        </option>
      </select>

      <!-- Custom dropdown arrow -->
      <span
        class="pointer-events-none absolute inset-y-0 right-3 flex items-center"
        aria-hidden="true"
      >
        <svg
          class="w-4 h-4 text-gray-400 dark:text-gray-500"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
            clip-rule="evenodd"
          />
        </svg>
      </span>
    </div>

    <!-- Error message -->
    <div
      v-if="error && errorMessage"
      class="mt-1 text-xs sm:text-sm text-red-600 dark:text-red-400"
    >
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * FloatingSelect.vue
 * ------------------
 * Reusable select component with:
 * - Top aligned label (non-floating to avoid double text overlap)
 * - Optional error state and message
 * - Custom dropdown arrow and Tailwind styling
 * - v-model support (modelValue)
 */

export interface SelectOption {
  value: string | number
  label: string
  disabled?: boolean
}

interface Props {
  id: string
  label: string
  modelValue?: string | number | null
  options: SelectOption[]
  required?: boolean
  disabled?: boolean
  error?: boolean
  errorMessage?: string
}

const props = withDefaults(defineProps<Props>(), {
  required: false,
  disabled: false,
  error: false,
  errorMessage: '',
  modelValue: ''
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

/**
 * Emit the selected value to the parent component
 */
const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  emit('update:modelValue', target.value)
}
</script>

<style scoped>
/* Custom dropdown arrow for light mode */
select {
  background-image: url('data:image/svg+xml;charset=US-ASCII,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4 5"><path fill="%23666" d="M2 0L0 2h4zm0 5L0 3h4z"/></svg>');
}

/* Custom dropdown arrow for dark mode */
.dark select {
  background-image: url('data:image/svg+xml;charset=US-ASCII,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4 5"><path fill="%23999" d="M2 0L0 2h4zm0 5L0 3h4z"/></svg>');
}

/* Hide default arrow in old IE/Edge */
select::-ms-expand {
  display: none;
}
</style>
