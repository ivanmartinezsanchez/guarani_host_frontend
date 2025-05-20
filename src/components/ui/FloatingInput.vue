<template>
  <div class="relative">
    <!-- Input con etiqueta flotante y validación accesible -->
    <input
      v-bind="$attrs"
      :id="id"
      :type="type"
      :value="modelValue"
      :required="required"
      :aria-invalid="error ? 'true' : 'false'"
      :aria-describedby="error ? `${id}-error` : undefined"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      :class="[
        'peer w-full px-4 pt-6 pb-2 rounded-md border bg-white dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary transition-all placeholder-transparent text-sm sm:text-base',
        error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
      ]"
      placeholder=" "
    />

    <!-- Etiqueta flotante -->
    <label
      :for="id"
      class="absolute left-4 top-2 text-sm text-gray-500 dark:text-gray-400 transition-all
        peer-placeholder-shown:top-4 peer-placeholder-shown:text-base
        peer-placeholder-shown:text-gray-400
        peer-focus:top-2 peer-focus:text-sm peer-focus:text-gray-500"
    >
      {{ label }}
    </label>
  </div>
</template>

<script setup lang="ts">
defineOptions({ inheritAttrs: false })

defineProps<{
  id: string
  label: string
  type: string
  modelValue: string
  required?: boolean
  error?: boolean
}>()

defineEmits(['update:modelValue'])
</script>
