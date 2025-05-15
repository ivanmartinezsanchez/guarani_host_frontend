<template>
  <div class="relative">
    <!-- Input field with dynamic styling and accessibility attributes -->
    <input
      v-bind="$attrs" <!-- Inherit all extra attributes like autocomplete, maxlength, etc. -->
      :id="id"
      :type="type"
      :value="modelValue"
      :required="required"
      :aria-invalid="error ? 'true' : 'false'"
      :aria-describedby="error ? `${id}-error` : undefined"
      class="peer w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-900 dark:text-white"
      :class="error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'"
      :placeholder="label"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />

    <!-- Floating label -->
    <label
      :for="id"
      class="absolute left-4 top-2 text-sm text-gray-500 dark:text-gray-400 transition-all
        peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base
        peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-gray-500"
    >
      {{ label }}
    </label>
  </div>
</template>

<script setup lang="ts">
/**
 * FloatingInput component
 * A reusable input field with label that floats on focus/typing
 * Supports accessibility, error styles, and extra HTML attributes
 */

// Allow parent components to bind additional HTML attributes
defineOptions({ inheritAttrs: false })

// Props definition
defineProps<{
  id: string
  label: string
  type: string
  modelValue: string
  required?: boolean
  error?: boolean
}>()

// Emits update on value change
defineEmits(['update:modelValue'])
</script>
