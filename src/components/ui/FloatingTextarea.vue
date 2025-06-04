<template>
  <div class="relative w-full">
    <textarea
      v-bind="$attrs"
      :id="id"
      :value="modelValue"
      :required="required"
      :disabled="disabled"
      :rows="rows"
      :aria-invalid="error ?? false"
      :aria-describedby="error ? `${id}-error` : undefined"
      @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
      :class="[
        'peer w-full px-4 pt-6 pb-2 rounded-lg border text-sm sm:text-base',
        'bg-white dark:bg-gray-900 dark:text-white',
        'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder-transparent',
        'disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed',
        resize ? 'resize-y' : 'resize-none',
        error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600',
        `min-h-[${minHeight}px]`
      ]"
      placeholder=" "
    />
    <label
      :for="id"
      :class="[
        'absolute left-4 top-2 text-sm text-gray-500 dark:text-gray-300 transition-all pointer-events-none',
        'peer-placeholder-shown:top-4 peer-placeholder-shown:text-base',
        'peer-placeholder-shown:text-gray-400 dark:peer-placeholder-shown:text-gray-500',
        'peer-focus:top-2 peer-focus:text-sm peer-focus:text-indigo-600',
        disabled ? 'text-gray-400 dark:text-gray-500' : '',
        error ? 'peer-focus:text-red-500' : ''
      ]"
    >
      {{ label }}
    </label>
    
    <!-- Character count -->
    <div 
      v-if="maxLength" 
      class="absolute bottom-2 right-3 text-xs text-gray-400 dark:text-gray-500"
    >
      {{ (modelValue?.length || 0) }}/{{ maxLength }}
    </div>
    
    <p
      v-if="error"
      :id="`${id}-error`"
      class="mt-1 text-sm text-red-600 dark:text-red-400"
    >
      {{ errorMessage || 'Campo obligatorio o inválido.' }}
    </p>
  </div>
</template>

<script setup lang="ts">
defineOptions({ 
  inheritAttrs: false 
})

defineProps<{
  id: string
  label: string
  modelValue: string
  rows?: number
  required?: boolean
  disabled?: boolean
  error?: boolean
  errorMessage?: string
  resize?: boolean
  minHeight?: number
  maxLength?: number
}>()

defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>