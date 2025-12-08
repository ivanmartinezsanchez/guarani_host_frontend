import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import Swal from 'sweetalert2';
import FloatingInput from '@/components/ui/FloatingInput.vue';
// Auth composable and router
const { register } = useAuth();
const router = useRouter();
// Form fields
const firstName = ref('');
const lastName = ref('');
const email = ref('');
const password = ref('');
const phone = ref('');
const address = ref('');
// UI state
const emailValid = ref(true);
const passwordValid = ref(true);
const isLoading = ref(false);
const mounted = ref(false);
// Regex validation rules
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
onMounted(() => {
    mounted.value = true;
});
/**
 * Handles registration form submission.
 * Validates inputs, calls register() from useAuth, shows feedback, and redirects by role.
 */
async function handleRegister() {
    emailValid.value = emailRegex.test(email.value);
    passwordValid.value = passwordRegex.test(password.value);
    if (firstName.value.trim() &&
        lastName.value.trim() &&
        emailValid.value &&
        passwordValid.value &&
        phone.value.trim() &&
        address.value.trim()) {
        isLoading.value = true;
        try {
            // Prepare user payload
            const userData = {
                firstName: firstName.value.trim(),
                lastName: lastName.value.trim(),
                email: email.value.trim(),
                password: password.value.trim(),
                phone: phone.value.trim(),
                address: address.value.trim(),
                role: 'user',
            };
            // Register user and get back stored profile
            const user = await register(userData);
            // Notify user
            Swal.fire({
                icon: 'success',
                title: 'Bienvenido/a!',
                text: `Cuenta creada con éxito como ${user.role}`,
                timer: 2000,
                showConfirmButton: false,
            });
            // Redirect user by role
            if (user.role === 'admin') {
                router.push('/admin/dashboard');
            }
            else if (user.role === 'host') {
                router.push('/host/dashboard');
            }
            else {
                router.push('/profile');
            }
        }
        catch (error) {
            console.error('❌ Registration error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Registro fallido',
                text: error?.response?.data?.message || 'Por favor, inténtalo de nuevo.',
            });
        }
        finally {
            isLoading.value = false;
        }
    }
    else {
        Swal.fire({
            icon: 'error',
            title: 'Formulario inválido',
            text: 'Por favor, introduce todos los campos correctamente.',
        });
    }
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
    ...{ class: "min-h-screen flex items-center justify-center px-4 bg-gray-50 dark:bg-gray-950 transition-colors duration-300" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.form, __VLS_intrinsicElements.form)({
    ...{ onSubmit: (__VLS_ctx.handleRegister) },
    ...{ class: "w-full max-w-lg bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md space-y-5 transition duration-500 ease-out transform scale-95 opacity-0" },
    ...{ class: ({ 'scale-100 opacity-100': __VLS_ctx.mounted }) },
});
__VLS_asFunctionalDirective(__VLS_directives.vShow)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.mounted) }, null, null);
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
    ...{ class: "text-2xl font-bold text-center text-gray-800 dark:text-white tracking-tight" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "grid md:grid-cols-2 gap-4" },
});
/** @type {[typeof FloatingInput, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(FloatingInput, new FloatingInput({
    modelValue: (__VLS_ctx.firstName),
    id: "firstName",
    label: "Nombre",
    type: "text",
    required: true,
}));
const __VLS_1 = __VLS_0({
    modelValue: (__VLS_ctx.firstName),
    id: "firstName",
    label: "Nombre",
    type: "text",
    required: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
/** @type {[typeof FloatingInput, ]} */ ;
// @ts-ignore
const __VLS_3 = __VLS_asFunctionalComponent(FloatingInput, new FloatingInput({
    modelValue: (__VLS_ctx.lastName),
    id: "lastName",
    label: "Apellido",
    type: "text",
    required: true,
}));
const __VLS_4 = __VLS_3({
    modelValue: (__VLS_ctx.lastName),
    id: "lastName",
    label: "Apellido",
    type: "text",
    required: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_3));
/** @type {[typeof FloatingInput, ]} */ ;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(FloatingInput, new FloatingInput({
    modelValue: (__VLS_ctx.email),
    id: "email",
    label: "Correo Electrónico",
    type: "email",
    required: true,
    error: (!__VLS_ctx.emailValid),
}));
const __VLS_7 = __VLS_6({
    modelValue: (__VLS_ctx.email),
    id: "email",
    label: "Correo Electrónico",
    type: "email",
    required: true,
    error: (!__VLS_ctx.emailValid),
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
if (!__VLS_ctx.emailValid) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-sm text-red-600" },
    });
}
/** @type {[typeof FloatingInput, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(FloatingInput, new FloatingInput({
    modelValue: (__VLS_ctx.phone),
    id: "phone",
    label: "Teléfono",
    type: "tel",
    required: true,
}));
const __VLS_10 = __VLS_9({
    modelValue: (__VLS_ctx.phone),
    id: "phone",
    label: "Teléfono",
    type: "tel",
    required: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
/** @type {[typeof FloatingInput, ]} */ ;
// @ts-ignore
const __VLS_12 = __VLS_asFunctionalComponent(FloatingInput, new FloatingInput({
    modelValue: (__VLS_ctx.address),
    id: "address",
    label: "Dirección",
    type: "text",
    required: true,
}));
const __VLS_13 = __VLS_12({
    modelValue: (__VLS_ctx.address),
    id: "address",
    label: "Dirección",
    type: "text",
    required: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_12));
/** @type {[typeof FloatingInput, ]} */ ;
// @ts-ignore
const __VLS_15 = __VLS_asFunctionalComponent(FloatingInput, new FloatingInput({
    modelValue: (__VLS_ctx.password),
    id: "password",
    label: "Contraseña",
    type: "password",
    required: true,
    error: (!__VLS_ctx.passwordValid),
}));
const __VLS_16 = __VLS_15({
    modelValue: (__VLS_ctx.password),
    id: "password",
    label: "Contraseña",
    type: "password",
    required: true,
    error: (!__VLS_ctx.passwordValid),
}, ...__VLS_functionalComponentArgsRest(__VLS_15));
if (!__VLS_ctx.passwordValid) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-sm text-red-600" },
    });
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    type: "submit",
    disabled: (__VLS_ctx.isLoading),
    ...{ class: "w-full bg-primary hover:bg-hover text-white font-semibold py-2 px-4 rounded-md transition-colors relative" },
});
if (!__VLS_ctx.isLoading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
        ...{ class: "w-5 h-5 animate-spin text-white absolute inset-0 m-auto" },
        fill: "none",
        viewBox: "0 0 24 24",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.circle)({
        ...{ class: "opacity-25" },
        cx: "12",
        cy: "12",
        r: "10",
        stroke: "currentColor",
        'stroke-width': "4",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
        ...{ class: "opacity-75" },
        fill: "currentColor",
        d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z",
    });
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "text-center text-sm text-gray-600 dark:text-gray-300 mt-2" },
});
const __VLS_18 = {}.RouterLink;
/** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.RouterLink, ]} */ ;
// @ts-ignore
const __VLS_19 = __VLS_asFunctionalComponent(__VLS_18, new __VLS_18({
    to: "/login",
    ...{ class: "text-primary hover:underline" },
}));
const __VLS_20 = __VLS_19({
    to: "/login",
    ...{ class: "text-primary hover:underline" },
}, ...__VLS_functionalComponentArgsRest(__VLS_19));
__VLS_21.slots.default;
var __VLS_21;
/** @type {__VLS_StyleScopedClasses['min-h-screen']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-50']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-gray-950']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-gray-800']} */ ;
/** @type {__VLS_StyleScopedClasses['p-8']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-md']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-5']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-500']} */ ;
/** @type {__VLS_StyleScopedClasses['ease-out']} */ ;
/** @type {__VLS_StyleScopedClasses['transform']} */ ;
/** @type {__VLS_StyleScopedClasses['scale-95']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-0']} */ ;
/** @type {__VLS_StyleScopedClasses['scale-100']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-100']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-800']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['tracking-tight']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['md:grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-600']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-600']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-hover']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-spin']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['inset-0']} */ ;
/** @type {__VLS_StyleScopedClasses['m-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-25']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-75']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:underline']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            FloatingInput: FloatingInput,
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            phone: phone,
            address: address,
            emailValid: emailValid,
            passwordValid: passwordValid,
            isLoading: isLoading,
            mounted: mounted,
            handleRegister: handleRegister,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=RegisterView.vue.js.map