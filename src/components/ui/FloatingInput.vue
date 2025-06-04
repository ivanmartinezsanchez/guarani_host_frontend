<template>
  <div class="relative">
    <input
      :id="id"
      :type="type"
      :value="modelValue || ''"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      :min="min"
      :max="max"
      :step="step"
      :title="title"
      :autocomplete="autocomplete || (type === 'password' ? 'current-password' : type === 'email' ? 'email' : 'off')"
      @input="handleInput"
      @blur="handleBlur"
      @focus="handleFocus"
      :class="[
        'peer w-full px-3 py-2 sm:px-4 sm:py-3 border rounded-lg sm:rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm sm:text-base',
        error 
          ? 'border-red-500 bg-red-50 dark:bg-red-900/10 text-red-900 dark:text-red-100' 
          : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white',
        disabled && 'opacity-50 cursor-not-allowed'
      ]"
    />
    
    <label
      :for="id"
      :class="[
        'absolute left-3 sm:left-4 transition-all duration-200 pointer-events-none text-sm sm:text-base',
        isFocused || (modelValue && modelValue !== '')
          ? 'top-0 -translate-y-1/2 bg-white dark:bg-gray-900 px-2 text-rose-600 dark:text-rose-400 text-xs sm:text-sm font-medium'
          : 'top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400',
        error && 'text-red-600 dark:text-red-400'
      ]"
    >
      {{ label }}
    </label>
    
    <div v-if="error && errorMessage" class="mt-1 text-xs sm:text-sm text-red-600 dark:text-red-400">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Component props with proper TypeScript definitions
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

// Define props with defaults
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

// Define emits for v-model support
const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

// Local state for focus management
const isFocused = ref(false)

// Event handlers
const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = props.type === 'number' ? target.valueAsNumber || 0 : target.value
  emit('update:modelValue', value)
}

const handleFocus = () => {
  isFocused.value = true
}

const handleBlur = () => {
  isFocused.value = false
}
</script>

<style scoped>
/* Additional styling for better focus states */
input:focus + label {
  color: #e11d48;
}

/* Dark mode focus styles */
.dark input:focus + label {
  color: #fb7185;
}

/* Number input arrow removal for cleaner look */
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}
</style>