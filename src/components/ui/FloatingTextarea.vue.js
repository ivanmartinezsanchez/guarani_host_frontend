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
</script>/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />

defineOptions({
    inheritAttrs: false
});
const __VLS_props = defineProps();
const __VLS_emit = defineEmits();
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "relative w-full" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.textarea)({
    ...{ onInput: (...[$event]) => {
            __VLS_ctx.$emit('update:modelValue', $event.target.value);
        } },
    id: (__VLS_ctx.id),
    value: (__VLS_ctx.modelValue),
    required: (__VLS_ctx.required),
    disabled: (__VLS_ctx.disabled),
    rows: (__VLS_ctx.rows),
    'aria-invalid': (__VLS_ctx.error ?? false),
    'aria-describedby': (__VLS_ctx.error ? `${__VLS_ctx.id}-error` : undefined),
    ...{ class: ([
            'peer w-full px-4 pt-6 pb-2 rounded-lg border text-sm sm:text-base',
            'bg-white dark:bg-gray-900 dark:text-white',
            'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder-transparent',
            'disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed',
            __VLS_ctx.resize ? 'resize-y' : 'resize-none',
            __VLS_ctx.error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600',
            `min-h-[${__VLS_ctx.minHeight}px]`
        ]) },
    placeholder: " ",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    for: (__VLS_ctx.id),
    ...{ class: ([
            'absolute left-4 top-2 text-sm text-gray-500 dark:text-gray-300 transition-all pointer-events-none',
            'peer-placeholder-shown:top-4 peer-placeholder-shown:text-base',
            'peer-placeholder-shown:text-gray-400 dark:peer-placeholder-shown:text-gray-500',
            'peer-focus:top-2 peer-focus:text-sm peer-focus:text-indigo-600',
            __VLS_ctx.disabled ? 'text-gray-400 dark:text-gray-500' : '',
            __VLS_ctx.error ? 'peer-focus:text-red-500' : ''
        ]) },
});
(__VLS_ctx.label);
if (__VLS_ctx.maxLength) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "absolute bottom-2 right-3 text-xs text-gray-400 dark:text-gray-500" },
    });
    ((__VLS_ctx.modelValue?.length || 0));
    (__VLS_ctx.maxLength);
}
if (__VLS_ctx.error) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        id: (`${__VLS_ctx.id}-error`),
        ...{ class: "mt-1 text-sm text-red-600 dark:text-red-400" },
    });
    (__VLS_ctx.errorMessage || 'Campo obligatorio o inválido.');
}
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['peer']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-6']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:text-base']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-gray-900']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-2']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-indigo-500']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:border-transparent']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['placeholder-transparent']} */ ;
/** @type {__VLS_StyleScopedClasses['disabled:bg-gray-100']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:disabled:bg-gray-800']} */ ;
/** @type {__VLS_StyleScopedClasses['disabled:cursor-not-allowed']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['left-4']} */ ;
/** @type {__VLS_StyleScopedClasses['top-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['pointer-events-none']} */ ;
/** @type {__VLS_StyleScopedClasses['peer-placeholder-shown:top-4']} */ ;
/** @type {__VLS_StyleScopedClasses['peer-placeholder-shown:text-base']} */ ;
/** @type {__VLS_StyleScopedClasses['peer-placeholder-shown:text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:peer-placeholder-shown:text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['peer-focus:top-2']} */ ;
/** @type {__VLS_StyleScopedClasses['peer-focus:text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['peer-focus:text-indigo-600']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['bottom-2']} */ ;
/** @type {__VLS_StyleScopedClasses['right-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-600']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-red-400']} */ ;
[__VLS_dollars.$attrs,];
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeEmits: {},
    __typeProps: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeEmits: {},
    __typeProps: {},
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=FloatingTextarea.vue.js.map