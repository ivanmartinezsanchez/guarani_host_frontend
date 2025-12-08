const props = defineProps({
    // Card content props
    title: {
        type: String,
        default: ''
    },
    subtitle: {
        type: String,
        default: ''
    },
    icon: {
        type: [Object, Function], // Support for Vue components
        default: null
    },
    // Styling customization props
    className: {
        type: String,
        default: ''
    },
    titleSize: {
        type: String,
        default: 'text-lg sm:text-xl'
    },
    iconColor: {
        type: String,
        default: 'text-blue-600 dark:text-blue-400'
    },
    iconBg: {
        type: String,
        default: 'bg-blue-50 dark:bg-blue-900/20'
    },
    // State management props
    loading: {
        type: Boolean,
        default: false
    },
    loadingText: {
        type: String,
        default: 'Cargando...'
    },
    // Accessibility props
    role: {
        type: String,
        default: 'region'
    },
    ariaLabel: {
        type: String,
        default: ''
    }
});
// Inherit all HTML attributes for maximum flexibility and accessibility
defineOptions({
    inheritAttrs: false
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: ([
            // Base card styling with relative positioning for loading overlay
            'relative bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700',
            // Interactive states
            'transition-all duration-200 hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600',
            // Focus states for accessibility
            'focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-opacity-20',
            // Responsive padding
            'p-4 sm:p-6',
            // Custom classes
            __VLS_ctx.className
        ]) },
    role: (__VLS_ctx.role),
    'aria-label': (__VLS_ctx.ariaLabel),
});
if (__VLS_ctx.$slots.header || __VLS_ctx.title || __VLS_ctx.icon) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.header, __VLS_intrinsicElements.header)({
        ...{ class: "flex items-center justify-between mb-4" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex items-center space-x-3" },
    });
    if (__VLS_ctx.icon) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: ([
                    'flex items-center justify-center rounded-lg transition-colors duration-200',
                    'w-10 h-10 sm:w-12 sm:h-12',
                    __VLS_ctx.iconBg || 'bg-blue-50 dark:bg-blue-900/20'
                ]) },
        });
        const __VLS_0 = ((__VLS_ctx.icon));
        // @ts-ignore
        const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
            ...{ class: ([
                    'w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-200',
                    __VLS_ctx.iconColor || 'text-blue-600 dark:text-blue-400'
                ]) },
            'aria-hidden': (true),
        }));
        const __VLS_2 = __VLS_1({
            ...{ class: ([
                    'w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-200',
                    __VLS_ctx.iconColor || 'text-blue-600 dark:text-blue-400'
                ]) },
            'aria-hidden': (true),
        }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    }
    if (__VLS_ctx.title || __VLS_ctx.subtitle || __VLS_ctx.$slots.title) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
        var __VLS_4 = {};
        __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
            ...{ class: ([
                    'font-semibold text-gray-900 dark:text-white',
                    __VLS_ctx.titleSize || 'text-lg sm:text-xl'
                ]) },
        });
        (__VLS_ctx.title);
        if (__VLS_ctx.subtitle) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
                ...{ class: "text-sm text-gray-500 dark:text-gray-400 mt-1" },
            });
            (__VLS_ctx.subtitle);
        }
    }
    if (__VLS_ctx.$slots.actions) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "flex items-center space-x-2" },
        });
        var __VLS_6 = {};
    }
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.main, __VLS_intrinsicElements.main)({
    ...{ class: "space-y-4" },
});
var __VLS_8 = {};
if (__VLS_ctx.$slots.footer) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.footer, __VLS_intrinsicElements.footer)({
        ...{ class: "mt-6 pt-4 border-t border-gray-100 dark:border-gray-700" },
    });
    var __VLS_10 = {};
}
if (__VLS_ctx.loading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "absolute inset-0 bg-white/80 dark:bg-gray-800/80 rounded-xl flex items-center justify-center backdrop-blur-sm" },
        'aria-label': "Cargando contenido",
        role: "status",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex items-center space-x-3" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-blue-600" },
        'aria-hidden': "true",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "text-sm font-medium text-gray-600 dark:text-gray-300" },
    });
    (__VLS_ctx.loadingText || 'Cargando...');
}
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-gray-800']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:border-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-200']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:shadow-md']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:border-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:hover:border-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['focus-within:ring-2']} */ ;
/** @type {__VLS_StyleScopedClasses['focus-within:ring-blue-500']} */ ;
/** @type {__VLS_StyleScopedClasses['focus-within:ring-opacity-20']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['space-x-3']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-200']} */ ;
/** @type {__VLS_StyleScopedClasses['w-10']} */ ;
/** @type {__VLS_StyleScopedClasses['h-10']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:w-12']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:h-12']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:w-6']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:h-6']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-200']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['space-x-2']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-6']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['border-t']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-100']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:border-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['inset-0']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white/80']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-gray-800/80']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['backdrop-blur-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['space-x-3']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-spin']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-6']} */ ;
/** @type {__VLS_StyleScopedClasses['w-6']} */ ;
/** @type {__VLS_StyleScopedClasses['border-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['border-t-blue-600']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-300']} */ ;
// @ts-ignore
var __VLS_5 = __VLS_4, __VLS_7 = __VLS_6, __VLS_9 = __VLS_8, __VLS_11 = __VLS_10;
[__VLS_dollars.$attrs,];
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            $props: __VLS_makeOptional(props),
            ...props,
        };
    },
});
const __VLS_component = (await import('vue')).defineComponent({
    setup() {
        return {
            $props: __VLS_makeOptional(props),
            ...props,
        };
    },
});
export default {};
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=DashboardCard.vue.js.map