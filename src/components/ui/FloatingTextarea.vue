<template>
  <div class="relative w-full">
    <textarea
      v-bind="$attrs"
      :id="id"
      :value="modelValue"
      :required="required"
      :aria-invalid="error ? 'true' : 'false'"
      :aria-describedby="error ? `${id}-error` : undefined"
      @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
      :class="[
        'peer w-full px-4 pt-6 pb-2 rounded-md border resize-none min-h-[100px] text-sm sm:text-base',
        'bg-white dark:bg-gray-900 dark:text-white',
        'focus:outline-none focus:ring-2 focus:ring-primary transition-all placeholder-transparent',
        error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
      ]"
      placeholder=" "
    />
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
  modelValue: string
  required?: boolean
  error?: boolean
}>()

defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>

<style scoped>
textarea::placeholder {
  color: transparent;
}
</style>
