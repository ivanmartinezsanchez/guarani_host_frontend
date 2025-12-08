import { ref, computed } from 'vue';
const props = withDefaults(defineProps(), {
    type: 'text',
    placeholder: '',
    required: false,
    disabled: false,
    error: false,
    errorMessage: '',
    modelValue: '',
    autocomplete: ''
});
const emit = defineEmits();
/**
 * Derived autocomplete value:
 * - Uses explicit prop if provided.
 * - Falls back to sensible defaults for password/email.
 */
const computedAutocomplete = computed(() => {
    if (props.autocomplete)
        return props.autocomplete;
    if (props.type === 'password')
        return 'current-password';
    if (props.type === 'email')
        return 'email';
    return 'off';
});
const isFocused = ref(false);
/**
 * Emit the current value to the parent component.
 * Numbers are converted to number type, other inputs remain strings.
 */
const handleInput = (event) => {
    const target = event.target;
    if (props.type === 'number') {
        // Preserve empty value as empty string to avoid forcing 0 visually
        const raw = target.value;
        const numeric = raw === '' ? '' : Number(target.value);
        emit('update:modelValue', numeric);
    }
    else {
        emit('update:modelValue', target.value);
    }
};
/**
 * Track focus state (kept for possible future styling/extensions).
 */
const handleFocus = () => {
    isFocused.value = true;
};
/**
 * Track blur state.
 */
const handleBlur = () => {
    isFocused.value = false;
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_withDefaultsArg = (function (t) { return t; })({
    type: 'text',
    placeholder: '',
    required: false,
    disabled: false,
    error: false,
    errorMessage: '',
    modelValue: '',
    autocomplete: ''
});
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "w-full" },
});
if (__VLS_ctx.label) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
        for: (__VLS_ctx.id),
        ...{ class: "block text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mb-1" },
    });
    (__VLS_ctx.label);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "relative" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
    ...{ onInput: (__VLS_ctx.handleInput) },
    ...{ onBlur: (__VLS_ctx.handleBlur) },
    ...{ onFocus: (__VLS_ctx.handleFocus) },
    id: (__VLS_ctx.id),
    type: (__VLS_ctx.type),
    value: (__VLS_ctx.modelValue ?? ''),
    placeholder: (__VLS_ctx.placeholder),
    required: (__VLS_ctx.required),
    disabled: (__VLS_ctx.disabled),
    min: (__VLS_ctx.min),
    max: (__VLS_ctx.max),
    step: (__VLS_ctx.step),
    title: (__VLS_ctx.title),
    autocomplete: (__VLS_ctx.computedAutocomplete),
    ...{ class: ([
            'w-full px-3 py-2 sm:px-4 sm:py-3 border rounded-lg sm:rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm sm:text-base',
            __VLS_ctx.error
                ? 'border-red-500 bg-red-50 dark:bg-red-900/10 text-red-900 dark:text-red-100'
                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white',
            __VLS_ctx.disabled && 'opacity-50 cursor-not-allowed'
        ]) },
});
if (__VLS_ctx.error && __VLS_ctx.errorMessage) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "mt-1 text-xs sm:text-sm text-red-600 dark:text-red-400" },
    });
    (__VLS_ctx.errorMessage);
}
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:py-3']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:rounded-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-200']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-2']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-rose-500']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:border-transparent']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:text-base']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-600']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-red-400']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            computedAutocomplete: computedAutocomplete,
            handleInput: handleInput,
            handleFocus: handleFocus,
            handleBlur: handleBlur,
        };
    },
    __typeEmits: {},
    __typeProps: {},
    props: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeEmits: {},
    __typeProps: {},
    props: {},
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=FloatingInput.vue.js.map