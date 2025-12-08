import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { MenuIcon, XIcon, SunIcon, MoonIcon, ChevronDownIcon, UserIcon, SettingsIcon, HomeIcon, LogOutIcon } from 'lucide-vue-next';
import { useAuth } from '@/composables/useAuth';
import { useTheme } from '@/composables/useTheme';
/**
 * NavBar Component
 * ----------------
 * Provides:
 * - Global navigation (desktop & mobile)
 * - Theme toggle (light/dark) via useTheme composable
 * - Role-based links for admin/host/user
 * - User dropdown with profile and logout actions
 */
const route = useRoute();
const router = useRouter();
const { user, logout } = useAuth();
// Theme management (delegated to useTheme composable)
const { toggleTheme, themeIcon, themeLabel } = useTheme();
// Local UI state
const mobileMenuOpen = ref(false);
const userMenuOpen = ref(false);
/**
 * Toggle user dropdown menu.
 * Also ensures mobile menu is closed to avoid overlapping menus.
 */
const toggleUserMenu = () => {
    userMenuOpen.value = !userMenuOpen.value;
    if (userMenuOpen.value) {
        mobileMenuOpen.value = false;
    }
};
/** Close user dropdown menu */
const closeUserMenu = () => {
    userMenuOpen.value = false;
};
/**
 * Toggle mobile navigation menu.
 * Also ensures user menu is closed when opening mobile menu.
 */
const toggleMobileMenu = () => {
    mobileMenuOpen.value = !mobileMenuOpen.value;
    if (mobileMenuOpen.value) {
        userMenuOpen.value = false;
    }
};
/** Close mobile navigation menu */
const closeMobileMenu = () => {
    mobileMenuOpen.value = false;
};
/**
 * Get user's full name (for headers / summaries)
 */
const getUserFullName = () => {
    if (!user.value)
        return '';
    return `${user.value.firstName} ${user.value.lastName}`.trim();
};
/**
 * Get user's initials for avatar circle.
 * Falls back to empty string if no user is present.
 */
const getUserInitials = () => {
    if (!user.value)
        return '';
    const first = user.value.firstName?.[0] || '';
    const last = user.value.lastName?.[0] || '';
    return (first + last).toUpperCase();
};
/**
 * Logout handler:
 * - calls logout composable
 * - closes menus
 * - redirects to login page
 */
const handleLogout = async () => {
    try {
        await logout();
        userMenuOpen.value = false;
        mobileMenuOpen.value = false;
        router.push('/login');
    }
    catch (error) {
        console.error('Error during logout:', error);
    }
};
/**
 * Close open menus when clicking outside of them.
 * Improves UX by auto-closing when user clicks elsewhere on the page.
 */
const handleOutsideClick = (event) => {
    const target = event.target;
    if (userMenuOpen.value && !target.closest('[data-user-menu]')) {
        userMenuOpen.value = false;
    }
    if (mobileMenuOpen.value && !target.closest('[data-mobile-menu]')) {
        mobileMenuOpen.value = false;
    }
};
/**
 * Close open menus when pressing Escape key.
 * Provides keyboard accessibility for dismissing menus.
 */
const handleEscapeKey = (event) => {
    if (event.key === 'Escape') {
        userMenuOpen.value = false;
        mobileMenuOpen.value = false;
    }
};
onMounted(() => {
    document.addEventListener('click', handleOutsideClick);
    document.addEventListener('keydown', handleEscapeKey);
});
onUnmounted(() => {
    document.removeEventListener('click', handleOutsideClick);
    document.removeEventListener('keydown', handleEscapeKey);
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.nav, __VLS_intrinsicElements.nav)({
    ...{ class: "sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4" },
    role: "navigation",
    'aria-label': "Main navigation",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "max-w-7xl mx-auto flex items-center justify-between" },
});
const __VLS_0 = {}.RouterLink;
/** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.RouterLink, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    to: "/",
    ...{ class: "flex items-center space-x-2 text-primary font-bold text-xl" },
    'aria-label': "GuaraníHost - Go to home",
}));
const __VLS_2 = __VLS_1({
    to: "/",
    ...{ class: "flex items-center space-x-2 text-primary font-bold text-xl" },
    'aria-label': "GuaraníHost - Go to home",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
    src: "@/assets/logo.png",
    alt: "GuaraníHost logo",
    ...{ class: "h-8 w-auto" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
var __VLS_3;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "hidden md:flex items-center space-x-8" },
});
const __VLS_4 = {}.RouterLink;
/** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.RouterLink, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    to: "/",
    ...{ class: "text-darkText dark:text-white hover:text-primary dark:hover:text-primary transition-colors font-medium" },
    ...{ class: ({ 'text-primary': __VLS_ctx.route.path === '/' }) },
}));
const __VLS_6 = __VLS_5({
    to: "/",
    ...{ class: "text-darkText dark:text-white hover:text-primary dark:hover:text-primary transition-colors font-medium" },
    ...{ class: ({ 'text-primary': __VLS_ctx.route.path === '/' }) },
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
__VLS_7.slots.default;
var __VLS_7;
const __VLS_8 = {}.RouterLink;
/** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.RouterLink, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    to: "/tours",
    ...{ class: "text-darkText dark:text-white hover:text-primary dark:hover:text-primary transition-colors font-medium" },
    ...{ class: ({
            'text-primary': __VLS_ctx.route.path.startsWith('/tours') || __VLS_ctx.route.path.startsWith('/tour')
        }) },
}));
const __VLS_10 = __VLS_9({
    to: "/tours",
    ...{ class: "text-darkText dark:text-white hover:text-primary dark:hover:text-primary transition-colors font-medium" },
    ...{ class: ({
            'text-primary': __VLS_ctx.route.path.startsWith('/tours') || __VLS_ctx.route.path.startsWith('/tour')
        }) },
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
__VLS_11.slots.default;
var __VLS_11;
if (!__VLS_ctx.user) {
    const __VLS_12 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.RouterLink, ]} */ ;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
        to: "/about",
        ...{ class: "text-darkText dark:text-white hover:text-primary dark:hover:text-primary transition-colors font-medium" },
        ...{ class: ({ 'text-primary': __VLS_ctx.route.path === '/about' }) },
    }));
    const __VLS_14 = __VLS_13({
        to: "/about",
        ...{ class: "text-darkText dark:text-white hover:text-primary dark:hover:text-primary transition-colors font-medium" },
        ...{ class: ({ 'text-primary': __VLS_ctx.route.path === '/about' }) },
    }, ...__VLS_functionalComponentArgsRest(__VLS_13));
    __VLS_15.slots.default;
    var __VLS_15;
}
else {
    if (__VLS_ctx.user.role === 'admin') {
        const __VLS_16 = {}.RouterLink;
        /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.RouterLink, ]} */ ;
        // @ts-ignore
        const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
            to: "/admin/dashboard",
            ...{ class: "text-darkText dark:text-white hover:text-primary dark:hover:text-primary transition-colors font-medium" },
            ...{ class: ({ 'text-primary': __VLS_ctx.route.path.startsWith('/admin') }) },
        }));
        const __VLS_18 = __VLS_17({
            to: "/admin/dashboard",
            ...{ class: "text-darkText dark:text-white hover:text-primary dark:hover:text-primary transition-colors font-medium" },
            ...{ class: ({ 'text-primary': __VLS_ctx.route.path.startsWith('/admin') }) },
        }, ...__VLS_functionalComponentArgsRest(__VLS_17));
        __VLS_19.slots.default;
        var __VLS_19;
    }
    if (__VLS_ctx.user.role === 'host') {
        const __VLS_20 = {}.RouterLink;
        /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.RouterLink, ]} */ ;
        // @ts-ignore
        const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
            to: "/host/dashboard",
            ...{ class: "text-darkText dark:text-white hover:text-primary dark:hover:text-primary transition-colors font-medium" },
            ...{ class: ({ 'text-primary': __VLS_ctx.route.path.startsWith('/host') }) },
        }));
        const __VLS_22 = __VLS_21({
            to: "/host/dashboard",
            ...{ class: "text-darkText dark:text-white hover:text-primary dark:hover:text-primary transition-colors font-medium" },
            ...{ class: ({ 'text-primary': __VLS_ctx.route.path.startsWith('/host') }) },
        }, ...__VLS_functionalComponentArgsRest(__VLS_21));
        __VLS_23.slots.default;
        var __VLS_23;
    }
    if (__VLS_ctx.user.role === 'user') {
        const __VLS_24 = {}.RouterLink;
        /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.RouterLink, ]} */ ;
        // @ts-ignore
        const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
            to: "/user/dashboard",
            ...{ class: "text-darkText dark:text-white hover:text-primary dark:hover:text-primary transition-colors font-medium" },
            ...{ class: ({ 'text-primary': __VLS_ctx.route.path.startsWith('/user') }) },
        }));
        const __VLS_26 = __VLS_25({
            to: "/user/dashboard",
            ...{ class: "text-darkText dark:text-white hover:text-primary dark:hover:text-primary transition-colors font-medium" },
            ...{ class: ({ 'text-primary': __VLS_ctx.route.path.startsWith('/user') }) },
        }, ...__VLS_functionalComponentArgsRest(__VLS_25));
        __VLS_27.slots.default;
        var __VLS_27;
    }
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex items-center space-x-4" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (__VLS_ctx.toggleTheme) },
    ...{ class: "p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" },
    'aria-label': (__VLS_ctx.themeLabel),
    title: (__VLS_ctx.themeLabel),
});
if (__VLS_ctx.themeIcon === 'sun') {
    const __VLS_28 = {}.SunIcon;
    /** @type {[typeof __VLS_components.SunIcon, ]} */ ;
    // @ts-ignore
    const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
        ...{ class: "w-5 h-5 text-gray-600 dark:text-gray-400" },
    }));
    const __VLS_30 = __VLS_29({
        ...{ class: "w-5 h-5 text-gray-600 dark:text-gray-400" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_29));
}
else {
    const __VLS_32 = {}.MoonIcon;
    /** @type {[typeof __VLS_components.MoonIcon, ]} */ ;
    // @ts-ignore
    const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
        ...{ class: "w-5 h-5 text-gray-600 dark:text-gray-400" },
    }));
    const __VLS_34 = __VLS_33({
        ...{ class: "w-5 h-5 text-gray-600 dark:text-gray-400" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_33));
}
if (!__VLS_ctx.user) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "hidden md:flex items-center space-x-3" },
    });
    const __VLS_36 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.RouterLink, ]} */ ;
    // @ts-ignore
    const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
        to: "/login",
        ...{ class: "text-darkText dark:text-white hover:text-primary transition-colors font-medium" },
    }));
    const __VLS_38 = __VLS_37({
        to: "/login",
        ...{ class: "text-darkText dark:text-white hover:text-primary transition-colors font-medium" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_37));
    __VLS_39.slots.default;
    var __VLS_39;
    const __VLS_40 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.RouterLink, ]} */ ;
    // @ts-ignore
    const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
        to: "/register",
        ...{ class: "bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-medium transition-colors" },
    }));
    const __VLS_42 = __VLS_41({
        to: "/register",
        ...{ class: "bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-medium transition-colors" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_41));
    __VLS_43.slots.default;
    var __VLS_43;
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "relative" },
        'data-user-menu': true,
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.toggleUserMenu) },
        ...{ class: "flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" },
        'aria-label': (`User menu - ${__VLS_ctx.getUserFullName()}`),
        'aria-expanded': (__VLS_ctx.userMenuOpen),
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold text-sm" },
    });
    (__VLS_ctx.getUserInitials());
    const __VLS_44 = {}.ChevronDownIcon;
    /** @type {[typeof __VLS_components.ChevronDownIcon, ]} */ ;
    // @ts-ignore
    const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
        ...{ class: "w-4 h-4 text-gray-600 dark:text-gray-400 transition-transform" },
        ...{ class: ({ 'rotate-180': __VLS_ctx.userMenuOpen }) },
    }));
    const __VLS_46 = __VLS_45({
        ...{ class: "w-4 h-4 text-gray-600 dark:text-gray-400 transition-transform" },
        ...{ class: ({ 'rotate-180': __VLS_ctx.userMenuOpen }) },
    }, ...__VLS_functionalComponentArgsRest(__VLS_45));
    const __VLS_48 = {}.Transition;
    /** @type {[typeof __VLS_components.Transition, typeof __VLS_components.Transition, ]} */ ;
    // @ts-ignore
    const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
        enterActiveClass: "transition ease-out duration-200",
        enterFromClass: "opacity-0 scale-95",
        enterToClass: "opacity-100 scale-100",
        leaveActiveClass: "transition ease-in duration-150",
        leaveFromClass: "opacity-100 scale-100",
        leaveToClass: "opacity-0 scale-95",
    }));
    const __VLS_50 = __VLS_49({
        enterActiveClass: "transition ease-out duration-200",
        enterFromClass: "opacity-0 scale-95",
        enterToClass: "opacity-100 scale-100",
        leaveActiveClass: "transition ease-in duration-150",
        leaveFromClass: "opacity-100 scale-100",
        leaveToClass: "opacity-0 scale-95",
    }, ...__VLS_functionalComponentArgsRest(__VLS_49));
    __VLS_51.slots.default;
    if (__VLS_ctx.userMenuOpen) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ onClick: () => { } },
            ...{ class: "absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "px-4 py-2 border-b border-gray-200 dark:border-gray-700" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: "font-semibold text-darkText dark:text-white" },
        });
        (__VLS_ctx.getUserFullName());
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: "text-sm text-lightText dark:text-gray-400" },
        });
        (__VLS_ctx.user.email);
        const __VLS_52 = {}.RouterLink;
        /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.RouterLink, ]} */ ;
        // @ts-ignore
        const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
            ...{ 'onClick': {} },
            to: "/profile",
            ...{ class: "flex items-center px-4 py-2 text-darkText dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors" },
        }));
        const __VLS_54 = __VLS_53({
            ...{ 'onClick': {} },
            to: "/profile",
            ...{ class: "flex items-center px-4 py-2 text-darkText dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_53));
        let __VLS_56;
        let __VLS_57;
        let __VLS_58;
        const __VLS_59 = {
            onClick: (__VLS_ctx.closeUserMenu)
        };
        __VLS_55.slots.default;
        const __VLS_60 = {}.UserIcon;
        /** @type {[typeof __VLS_components.UserIcon, ]} */ ;
        // @ts-ignore
        const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
            ...{ class: "w-4 h-4 mr-2" },
        }));
        const __VLS_62 = __VLS_61({
            ...{ class: "w-4 h-4 mr-2" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_61));
        var __VLS_55;
        if (__VLS_ctx.user.role === 'admin') {
            const __VLS_64 = {}.RouterLink;
            /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.RouterLink, ]} */ ;
            // @ts-ignore
            const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
                ...{ 'onClick': {} },
                to: "/admin/dashboard",
                ...{ class: "flex items-center px-4 py-2 text-darkText dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors" },
            }));
            const __VLS_66 = __VLS_65({
                ...{ 'onClick': {} },
                to: "/admin/dashboard",
                ...{ class: "flex items-center px-4 py-2 text-darkText dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_65));
            let __VLS_68;
            let __VLS_69;
            let __VLS_70;
            const __VLS_71 = {
                onClick: (__VLS_ctx.closeUserMenu)
            };
            __VLS_67.slots.default;
            const __VLS_72 = {}.SettingsIcon;
            /** @type {[typeof __VLS_components.SettingsIcon, ]} */ ;
            // @ts-ignore
            const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
                ...{ class: "w-4 h-4 mr-2" },
            }));
            const __VLS_74 = __VLS_73({
                ...{ class: "w-4 h-4 mr-2" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_73));
            var __VLS_67;
        }
        if (__VLS_ctx.user.role === 'host') {
            const __VLS_76 = {}.RouterLink;
            /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.RouterLink, ]} */ ;
            // @ts-ignore
            const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
                ...{ 'onClick': {} },
                to: "/host/dashboard",
                ...{ class: "flex items-center px-4 py-2 text-darkText dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors" },
            }));
            const __VLS_78 = __VLS_77({
                ...{ 'onClick': {} },
                to: "/host/dashboard",
                ...{ class: "flex items-center px-4 py-2 text-darkText dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_77));
            let __VLS_80;
            let __VLS_81;
            let __VLS_82;
            const __VLS_83 = {
                onClick: (__VLS_ctx.closeUserMenu)
            };
            __VLS_79.slots.default;
            const __VLS_84 = {}.HomeIcon;
            /** @type {[typeof __VLS_components.HomeIcon, ]} */ ;
            // @ts-ignore
            const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
                ...{ class: "w-4 h-4 mr-2" },
            }));
            const __VLS_86 = __VLS_85({
                ...{ class: "w-4 h-4 mr-2" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_85));
            var __VLS_79;
        }
        __VLS_asFunctionalElement(__VLS_intrinsicElements.hr, __VLS_intrinsicElements.hr)({
            ...{ class: "my-1 border-gray-200 dark:border-gray-600" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (__VLS_ctx.handleLogout) },
            ...{ class: "flex items-center w-full text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors" },
        });
        const __VLS_88 = {}.LogOutIcon;
        /** @type {[typeof __VLS_components.LogOutIcon, ]} */ ;
        // @ts-ignore
        const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
            ...{ class: "w-4 h-4 mr-2" },
        }));
        const __VLS_90 = __VLS_89({
            ...{ class: "w-4 h-4 mr-2" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_89));
    }
    var __VLS_51;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (__VLS_ctx.toggleMobileMenu) },
    ...{ class: "md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" },
    'aria-label': (__VLS_ctx.mobileMenuOpen ? 'Close menu' : 'Open menu'),
    'aria-expanded': (__VLS_ctx.mobileMenuOpen),
    'data-mobile-menu': true,
});
if (__VLS_ctx.mobileMenuOpen) {
    const __VLS_92 = {}.XIcon;
    /** @type {[typeof __VLS_components.XIcon, ]} */ ;
    // @ts-ignore
    const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
        ...{ class: "w-6 h-6 text-gray-600 dark:text-gray-400" },
    }));
    const __VLS_94 = __VLS_93({
        ...{ class: "w-6 h-6 text-gray-600 dark:text-gray-400" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_93));
}
else {
    const __VLS_96 = {}.MenuIcon;
    /** @type {[typeof __VLS_components.MenuIcon, ]} */ ;
    // @ts-ignore
    const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
        ...{ class: "w-6 h-6 text-gray-600 dark:text-gray-400" },
    }));
    const __VLS_98 = __VLS_97({
        ...{ class: "w-6 h-6 text-gray-600 dark:text-gray-400" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_97));
}
const __VLS_100 = {}.Transition;
/** @type {[typeof __VLS_components.Transition, typeof __VLS_components.Transition, ]} */ ;
// @ts-ignore
const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
    enterActiveClass: "transition ease-out duration-200",
    enterFromClass: "opacity-0 -translate-y-2",
    enterToClass: "opacity-100 translate-y-0",
    leaveActiveClass: "transition ease-in duration-150",
    leaveFromClass: "opacity-100 translate-y-0",
    leaveToClass: "opacity-0 -translate-y-2",
}));
const __VLS_102 = __VLS_101({
    enterActiveClass: "transition ease-out duration-200",
    enterFromClass: "opacity-0 -translate-y-2",
    enterToClass: "opacity-100 translate-y-0",
    leaveActiveClass: "transition ease-in duration-150",
    leaveFromClass: "opacity-100 translate-y-0",
    leaveToClass: "opacity-0 -translate-y-2",
}, ...__VLS_functionalComponentArgsRest(__VLS_101));
__VLS_103.slots.default;
if (__VLS_ctx.mobileMenuOpen) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "md:hidden mt-4 pb-4 border-t border-gray-200 dark:border-gray-700 pt-4" },
        'data-mobile-menu': true,
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "space-y-3" },
    });
    const __VLS_104 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.RouterLink, ]} */ ;
    // @ts-ignore
    const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
        ...{ 'onClick': {} },
        to: "/",
        ...{ class: "block text-darkText dark:text-white hover:text-primary transition-colors font-medium" },
        ...{ class: ({ 'text-primary': __VLS_ctx.route.path === '/' }) },
    }));
    const __VLS_106 = __VLS_105({
        ...{ 'onClick': {} },
        to: "/",
        ...{ class: "block text-darkText dark:text-white hover:text-primary transition-colors font-medium" },
        ...{ class: ({ 'text-primary': __VLS_ctx.route.path === '/' }) },
    }, ...__VLS_functionalComponentArgsRest(__VLS_105));
    let __VLS_108;
    let __VLS_109;
    let __VLS_110;
    const __VLS_111 = {
        onClick: (__VLS_ctx.closeMobileMenu)
    };
    __VLS_107.slots.default;
    var __VLS_107;
    const __VLS_112 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.RouterLink, ]} */ ;
    // @ts-ignore
    const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
        ...{ 'onClick': {} },
        to: "/tours",
        ...{ class: "block text-darkText dark:text-white hover:text-primary transition-colors font-medium" },
        ...{ class: ({
                'text-primary': __VLS_ctx.route.path.startsWith('/tours') || __VLS_ctx.route.path.startsWith('/tour')
            }) },
    }));
    const __VLS_114 = __VLS_113({
        ...{ 'onClick': {} },
        to: "/tours",
        ...{ class: "block text-darkText dark:text-white hover:text-primary transition-colors font-medium" },
        ...{ class: ({
                'text-primary': __VLS_ctx.route.path.startsWith('/tours') || __VLS_ctx.route.path.startsWith('/tour')
            }) },
    }, ...__VLS_functionalComponentArgsRest(__VLS_113));
    let __VLS_116;
    let __VLS_117;
    let __VLS_118;
    const __VLS_119 = {
        onClick: (__VLS_ctx.closeMobileMenu)
    };
    __VLS_115.slots.default;
    var __VLS_115;
    if (!__VLS_ctx.user) {
        const __VLS_120 = {}.RouterLink;
        /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.RouterLink, ]} */ ;
        // @ts-ignore
        const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({
            ...{ 'onClick': {} },
            to: "/about",
            ...{ class: "block text-darkText dark:text-white hover:text-primary transition-colors font-medium" },
        }));
        const __VLS_122 = __VLS_121({
            ...{ 'onClick': {} },
            to: "/about",
            ...{ class: "block text-darkText dark:text-white hover:text-primary transition-colors font-medium" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_121));
        let __VLS_124;
        let __VLS_125;
        let __VLS_126;
        const __VLS_127 = {
            onClick: (__VLS_ctx.closeMobileMenu)
        };
        __VLS_123.slots.default;
        var __VLS_123;
        const __VLS_128 = {}.RouterLink;
        /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.RouterLink, ]} */ ;
        // @ts-ignore
        const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({
            ...{ 'onClick': {} },
            to: "/login",
            ...{ class: "block text-darkText dark:text-white hover:text-primary transition-colors font-medium" },
        }));
        const __VLS_130 = __VLS_129({
            ...{ 'onClick': {} },
            to: "/login",
            ...{ class: "block text-darkText dark:text-white hover:text-primary transition-colors font-medium" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_129));
        let __VLS_132;
        let __VLS_133;
        let __VLS_134;
        const __VLS_135 = {
            onClick: (__VLS_ctx.closeMobileMenu)
        };
        __VLS_131.slots.default;
        var __VLS_131;
        const __VLS_136 = {}.RouterLink;
        /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.RouterLink, ]} */ ;
        // @ts-ignore
        const __VLS_137 = __VLS_asFunctionalComponent(__VLS_136, new __VLS_136({
            ...{ 'onClick': {} },
            to: "/register",
            ...{ class: "block bg-primary text-white px-4 py-2 rounded-lg font-medium text-center" },
        }));
        const __VLS_138 = __VLS_137({
            ...{ 'onClick': {} },
            to: "/register",
            ...{ class: "block bg-primary text-white px-4 py-2 rounded-lg font-medium text-center" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_137));
        let __VLS_140;
        let __VLS_141;
        let __VLS_142;
        const __VLS_143 = {
            onClick: (__VLS_ctx.closeMobileMenu)
        };
        __VLS_139.slots.default;
        var __VLS_139;
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: "font-semibold text-darkText dark:text-white" },
        });
        (__VLS_ctx.getUserFullName());
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: "text-sm text-lightText dark:text-gray-400 capitalize" },
        });
        (__VLS_ctx.user.role);
        if (__VLS_ctx.user.role === 'admin') {
            const __VLS_144 = {}.RouterLink;
            /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.RouterLink, ]} */ ;
            // @ts-ignore
            const __VLS_145 = __VLS_asFunctionalComponent(__VLS_144, new __VLS_144({
                ...{ 'onClick': {} },
                to: "/admin/dashboard",
                ...{ class: "block text-darkText dark:text-white hover:text-primary transition-colors font-medium" },
            }));
            const __VLS_146 = __VLS_145({
                ...{ 'onClick': {} },
                to: "/admin/dashboard",
                ...{ class: "block text-darkText dark:text-white hover:text-primary transition-colors font-medium" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_145));
            let __VLS_148;
            let __VLS_149;
            let __VLS_150;
            const __VLS_151 = {
                onClick: (__VLS_ctx.closeMobileMenu)
            };
            __VLS_147.slots.default;
            var __VLS_147;
        }
        if (__VLS_ctx.user.role === 'host') {
            const __VLS_152 = {}.RouterLink;
            /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.RouterLink, ]} */ ;
            // @ts-ignore
            const __VLS_153 = __VLS_asFunctionalComponent(__VLS_152, new __VLS_152({
                ...{ 'onClick': {} },
                to: "/host/dashboard",
                ...{ class: "block text-darkText dark:text-white hover:text-primary transition-colors font-medium" },
            }));
            const __VLS_154 = __VLS_153({
                ...{ 'onClick': {} },
                to: "/host/dashboard",
                ...{ class: "block text-darkText dark:text-white hover:text-primary transition-colors font-medium" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_153));
            let __VLS_156;
            let __VLS_157;
            let __VLS_158;
            const __VLS_159 = {
                onClick: (__VLS_ctx.closeMobileMenu)
            };
            __VLS_155.slots.default;
            var __VLS_155;
        }
        if (__VLS_ctx.user.role === 'user') {
            const __VLS_160 = {}.RouterLink;
            /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.RouterLink, ]} */ ;
            // @ts-ignore
            const __VLS_161 = __VLS_asFunctionalComponent(__VLS_160, new __VLS_160({
                ...{ 'onClick': {} },
                to: "/user/dashboard",
                ...{ class: "block text-darkText dark:text-white hover:text-primary transition-colors font-medium" },
            }));
            const __VLS_162 = __VLS_161({
                ...{ 'onClick': {} },
                to: "/user/dashboard",
                ...{ class: "block text-darkText dark:text-white hover:text-primary transition-colors font-medium" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_161));
            let __VLS_164;
            let __VLS_165;
            let __VLS_166;
            const __VLS_167 = {
                onClick: (__VLS_ctx.closeMobileMenu)
            };
            __VLS_163.slots.default;
            var __VLS_163;
        }
        const __VLS_168 = {}.RouterLink;
        /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.RouterLink, ]} */ ;
        // @ts-ignore
        const __VLS_169 = __VLS_asFunctionalComponent(__VLS_168, new __VLS_168({
            ...{ 'onClick': {} },
            to: "/profile",
            ...{ class: "block text-darkText dark:text-white hover:text-primary transition-colors font-medium" },
        }));
        const __VLS_170 = __VLS_169({
            ...{ 'onClick': {} },
            to: "/profile",
            ...{ class: "block text-darkText dark:text-white hover:text-primary transition-colors font-medium" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_169));
        let __VLS_172;
        let __VLS_173;
        let __VLS_174;
        const __VLS_175 = {
            onClick: (__VLS_ctx.closeMobileMenu)
        };
        __VLS_171.slots.default;
        var __VLS_171;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (__VLS_ctx.handleLogout) },
            ...{ class: "block w-full text-left text-red-600 dark:text-red-400 hover:text-red-700 transition-colors font-medium" },
        });
    }
}
var __VLS_103;
/** @type {__VLS_StyleScopedClasses['sticky']} */ ;
/** @type {__VLS_StyleScopedClasses['top-0']} */ ;
/** @type {__VLS_StyleScopedClasses['z-50']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-gray-900']} */ ;
/** @type {__VLS_StyleScopedClasses['border-b']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:border-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['py-4']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-7xl']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['space-x-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['h-8']} */ ;
/** @type {__VLS_StyleScopedClasses['w-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['md:flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['space-x-8']} */ ;
/** @type {__VLS_StyleScopedClasses['text-darkText']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:hover:text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['text-darkText']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:hover:text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['text-darkText']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:hover:text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['text-darkText']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:hover:text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['text-darkText']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:hover:text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['text-darkText']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:hover:text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['space-x-4']} */ ;
/** @type {__VLS_StyleScopedClasses['p-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-gray-100']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:hover:bg-gray-800']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['md:flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['space-x-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-darkText']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-primary-dark']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['space-x-2']} */ ;
/** @type {__VLS_StyleScopedClasses['p-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-gray-100']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:hover:bg-gray-800']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['w-8']} */ ;
/** @type {__VLS_StyleScopedClasses['h-8']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-transform']} */ ;
/** @type {__VLS_StyleScopedClasses['rotate-180']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['right-0']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['w-48']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-gray-800']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:border-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['z-50']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border-b']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:border-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-darkText']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lightText']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-darkText']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-gray-50']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:hover:bg-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-darkText']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-gray-50']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:hover:bg-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-darkText']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-gray-50']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:hover:bg-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['my-1']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:border-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['text-left']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-600']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-red-400']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-gray-50']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:hover:bg-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['md:hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['p-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-gray-100']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:hover:bg-gray-800']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['w-6']} */ ;
/** @type {__VLS_StyleScopedClasses['h-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['w-6']} */ ;
/** @type {__VLS_StyleScopedClasses['h-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['md:hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['border-t']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:border-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-3']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['text-darkText']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['text-darkText']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['text-darkText']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['text-darkText']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-50']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-gray-800']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-darkText']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lightText']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['capitalize']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['text-darkText']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['text-darkText']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['text-darkText']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['text-darkText']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['text-left']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-600']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-red-400']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-red-700']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            MenuIcon: MenuIcon,
            XIcon: XIcon,
            SunIcon: SunIcon,
            MoonIcon: MoonIcon,
            ChevronDownIcon: ChevronDownIcon,
            UserIcon: UserIcon,
            SettingsIcon: SettingsIcon,
            HomeIcon: HomeIcon,
            LogOutIcon: LogOutIcon,
            route: route,
            user: user,
            toggleTheme: toggleTheme,
            themeIcon: themeIcon,
            themeLabel: themeLabel,
            mobileMenuOpen: mobileMenuOpen,
            userMenuOpen: userMenuOpen,
            toggleUserMenu: toggleUserMenu,
            closeUserMenu: closeUserMenu,
            toggleMobileMenu: toggleMobileMenu,
            closeMobileMenu: closeMobileMenu,
            getUserFullName: getUserFullName,
            getUserInitials: getUserInitials,
            handleLogout: handleLogout,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=Navbar.vue.js.map