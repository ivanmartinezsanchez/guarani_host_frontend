<template>
  <div class="relative">
    <select
      :id="id"
      :value="modelValue || ''"
      :required="required"
      :disabled="disabled"
      @change="handleChange"
      @focus="handleFocus"
      @blur="handleBlur"
      :class="[
        'peer w-full px-3 py-2 sm:px-4 sm:py-3 border rounded-lg sm:rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm sm:text-base appearance-none bg-no-repeat bg-right pr-10',
        error 
          ? 'border-red-500 bg-red-50 dark:bg-red-900/10 text-red-900 dark:text-red-100' 
          : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white',
        disabled && 'opacity-50 cursor-not-allowed'
      ]"
      style="background-image: url('data:image/svg+xml;charset=US-ASCII,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 4 5%22><path fill=%22%23666%22 d=%22M2 0L0 2h4zm0 5L0 3h4z%22/></svg>'); background-size: 12px; background-position: right 12px center;"
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

// Option interface for select dropdown
export interface SelectOption {
  value: string | number
  label: string
  disabled?: boolean
}

// Component props with proper TypeScript definitions
interface Props {
  id: string
  label: string
  modelValue?: string | number | null
  options: SelectOption[]
  required?: boolean
  disabled?: boolean
  error?: boolean
  errorMessage?: string
  placeholder?: string
}

// Define props with defaults
const props = withDefaults(defineProps<Props>(), {
  required: false,
  disabled: false,
  error: false,
  errorMessage: '',
  placeholder: '',
  modelValue: ''
})

// Define emits for v-model support
const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

// Local state for focus management
const isFocused = ref(false)

// Event handlers
const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  emit('update:modelValue', target.value)
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
select:focus + label {
  color: #e11d48;
}

/* Dark mode focus styles */
.dark select:focus + label {
  color: #fb7185;
}

/* Custom select arrow styling */
select {
  background-image: url('data:image/svg+xml;charset=US-ASCII,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4 5"><path fill="%23666" d="M2 0L0 2h4zm0 5L0 3h4z"/></svg>');
}

.dark select {
  background-image: url('data:image/svg+xml;charset=US-ASCII,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4 5"><path fill="%23999" d="M2 0L0 2h4zm0 5L0 3h4z"/></svg>');
}

/* Remove default select appearance */
select::-ms-expand {
  display: none;
}
</style>