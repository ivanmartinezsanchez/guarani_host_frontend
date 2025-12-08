<template>
  <div class="w-full">
    <!-- Top aligned label (non-floating to avoid overlapping with value/placeholder) -->
    <label
      v-if="label"
      :for="id"
      class="block text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mb-1"
    >
      {{ label }}
    </label>

    <div class="relative">
      <input
        :id="id"
        :type="type"
        :value="modelValue ?? ''"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        :min="min"
        :max="max"
        :step="step"
        :title="title"
        :autocomplete="computedAutocomplete"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
        :class="[
          'w-full px-3 py-2 sm:px-4 sm:py-3 border rounded-lg sm:rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm sm:text-base',
          error 
            ? 'border-red-500 bg-red-50 dark:bg-red-900/10 text-red-900 dark:text-red-100' 
            : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white',
          disabled && 'opacity-50 cursor-not-allowed'
        ]"
      />
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
 * FloatingInput.vue
 * -----------------
 * Reusable input component with:
 * - Top aligned label (non-floating) to avoid visual overlap with value/placeholder.
 * - Tailwind-based styling for light/dark modes.
 * - Optional error state and error message.
 * - v-model support via modelValue.
 * - Support for number, text, email, password and date inputs.
 */

import { ref, computed } from 'vue'

interface Props {
  id: string
  label: string
  modelValue?: string | number | null
  type?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  error?: boolean
  errorMessage?: string
  min?: string | number
  max?: string | number
  step?: string | number
  title?: string
  autocomplete?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  placeholder: '',
  required: false,
  disabled: false,
  error: false,
  errorMessage: '',
  modelValue: '',
  autocomplete: ''
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

/**
 * Derived autocomplete value:
 * - Uses explicit prop if provided.
 * - Falls back to sensible defaults for password/email.
 */
const computedAutocomplete = computed(() => {
  if (props.autocomplete) return props.autocomplete
  if (props.type === 'password') return 'current-password'
  if (props.type === 'email') return 'email'
  return 'off'
})

const isFocused = ref(false)

/**
 * Emit the current value to the parent component.
 * Numbers are converted to number type, other inputs remain strings.
 */
const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement

  if (props.type === 'number') {
    // Preserve empty value as empty string to avoid forcing 0 visually
    const raw = target.value
    const numeric = raw === '' ? '' : Number(target.value)
    emit('update:modelValue', numeric as any)
  } else {
    emit('update:modelValue', target.value)
  }
}

/**
 * Track focus state (kept for possible future styling/extensions).
 */
const handleFocus = () => {
  isFocused.value = true
}

/**
 * Track blur state.
 */
const handleBlur = () => {
  isFocused.value = false
}
</script>

<style scoped>
/* Remove native number input arrows for a cleaner look */
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}
</style>
