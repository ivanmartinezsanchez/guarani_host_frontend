import { ref, computed, onMounted } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { SearchIcon, HeartIcon, StarIcon, HomeIcon, MapIcon } from 'lucide-vue-next';
import { useAuth } from '@/composables/useAuth';
import { getFeaturedProperties } from '@/services/publicPropertyService';
import { getFeaturedTours } from '@/services/publicTourService';
const router = useRouter();
const { user } = useAuth();
// Core reactive collections for homepage content
const properties = ref([]);
const tours = ref([]);
const loadingProperties = ref(false);
const loadingTours = ref(false);
// UI state flags
const showAllProperties = ref(false);
const showAllTours = ref(false);
const showLoginModal = ref(false);
const isSearching = ref(false);
// Fallback images for broken URLs
const fallbackImage = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80';
const fallbackTour = 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80';
// Search filters default values
const filters = ref({
    checkIn: '',
    checkOut: '',
    guests: 1,
});
/**
 * Gets today's date in YYYY-MM-DD format, used as min value for date inputs.
 */
const today = computed(() => {
    return new Date().toISOString().split('T')[0];
});
/**
 * Limits the initial number of displayed properties to improve performance.
 */
const displayedProperties = computed(() => {
    return showAllProperties.value ? properties.value : properties.value.slice(0, 8);
});
/**
 * Limits the initial number of displayed tours to improve performance.
 */
const displayedTours = computed(() => {
    return showAllTours.value ? tours.value : tours.value.slice(0, 6);
});
/**
 * Loads featured properties from the public API.
 */
const loadFeaturedProperties = async () => {
    try {
        loadingProperties.value = true;
        properties.value = await getFeaturedProperties();
        console.log('✅ Properties loaded:', properties.value.length);
    }
    catch (error) {
        console.error('❌ Error loading featured properties:', error);
    }
    finally {
        loadingProperties.value = false;
    }
};
/**
 * Loads featured tours from the public API.
 */
const loadFeaturedTours = async () => {
    try {
        loadingTours.value = true;
        tours.value = await getFeaturedTours();
        console.log('✅ Tours loaded:', tours.value.length);
    }
    catch (error) {
        console.error('❌ Error loading featured tours:', error);
    }
    finally {
        loadingTours.value = false;
    }
};
/**
 * Handles the search form submission and redirects to the search page.
 * Includes basic client-side validation for date ranges.
 */
const handleSearch = async () => {
    try {
        isSearching.value = true;
        if (filters.value.checkIn && filters.value.checkOut) {
            const checkInDate = new Date(filters.value.checkIn);
            const checkOutDate = new Date(filters.value.checkOut);
            const todayDate = new Date();
            todayDate.setHours(0, 0, 0, 0);
            // Prevent past check-in dates
            if (checkInDate < todayDate) {
                alert('La fecha de llegada no puede ser en el pasado');
                return;
            }
            // Ensure check-out date is strictly after check-in date
            if (checkOutDate <= checkInDate) {
                alert('La fecha de salida debe ser después de la fecha de llegada');
                return;
            }
        }
        const searchParams = {
            guests: filters.value.guests
        };
        if (filters.value.checkIn) {
            searchParams.checkIn = filters.value.checkIn;
        }
        if (filters.value.checkOut) {
            searchParams.checkOut = filters.value.checkOut;
        }
        await router.push({
            path: '/search',
            query: searchParams
        });
    }
    catch (error) {
        console.error('❌ Search error:', error);
        alert('Error en la búsqueda: ' + (error?.message || 'Error desconocido'));
    }
    finally {
        isSearching.value = false;
    }
};
/**
 * Redirects the user to a property detail page.
 */
const viewProperty = (id) => {
    router.push(`/property/${id}`);
};
/**
 * Redirects the user to a tour detail page.
 */
const viewTour = (id) => {
    router.push(`/tour/${id}`);
};
/**
 * Handles the favorite button.
 * If the user is not authenticated, it shows the login/register modal.
 */
const toggleFavorite = (id) => {
    if (!user.value) {
        showLoginModal.value = true;
        return;
    }
    console.log('Toggle favorite for property:', id);
    // TODO: connect with favorites API when available
};
/**
 * Toggles between initial and full list of properties.
 */
const toggleShowAllProperties = () => {
    showAllProperties.value = !showAllProperties.value;
};
/**
 * Toggles between initial and full list of tours.
 */
const toggleShowAllTours = () => {
    showAllTours.value = !showAllTours.value;
};
/**
 * Closes the login/register modal.
 */
const closeLoginModal = () => {
    showLoginModal.value = false;
};
/**
 * Helper to format a raw numeric price in USD (used across the view).
 */
const formatPrice = (price) => {
    const numericPrice = typeof price === 'number' ? price : Number(price);
    if (!Number.isFinite(numericPrice)) {
        // Fallback when data is corrupted or missing
        return 'Consultar';
    }
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(numericPrice);
};
/**
 * Returns a safe label for a property price.
 * - If price is valid → formatted USD value.
 * - If price is invalid / missing → "Consultar".
 */
const getPropertyPrice = (property) => {
    const raw = property?.pricePerNight;
    const n = typeof raw === 'number' ? raw : Number(raw);
    if (!Number.isFinite(n) || n <= 0) {
        return 'Consultar';
    }
    return formatPrice(n);
};
/**
 * Returns a safe label for a tour price.
 * - If price is valid → formatted USD value.
 * - If price is invalid / missing → "Consultar".
 */
const getTourPrice = (tour) => {
    const raw = tour?.price;
    const n = typeof raw === 'number' ? raw : Number(raw);
    if (!Number.isFinite(n) || n <= 0) {
        return 'Consultar';
    }
    return formatPrice(n);
};
/**
 * Returns a localized Spanish label for a given tour status code.
 */
const getStatusLabel = (status) => {
    const statusMap = {
        'available': 'Disponible',
        'sold_out': 'Agotado',
        'upcoming': 'Próximamente',
        'cancelled': 'Cancelado'
    };
    return statusMap[status] || status;
};
/**
 * Returns a safe, user-friendly host name for a tour.
 * - If firstName/lastName exist, it returns the full name.
 * - If not, it falls back to "guía local" so the UI is never empty.
 */
const getHostName = (tour) => {
    const first = tour.host?.firstName?.trim() || '';
    const last = tour.host?.lastName?.trim() || '';
    const fullName = [first, last].filter(Boolean).join(' ');
    return fullName || 'guía local';
};
/**
 * Replaces broken images with generic fallback photos for a better UX.
 */
const handleImageError = (event) => {
    const target = event.target;
    if (target.src.includes('tour') || target.alt.includes('tour')) {
        target.src = fallbackTour;
    }
    else {
        target.src = fallbackImage;
    }
};
/**
 * Initial data load for homepage.
 * Properties and tours are fetched in parallel for better performance.
 */
onMounted(async () => {
    console.log('🚀 Loading homepage data...');
    await Promise.all([
        loadFeaturedProperties(),
        loadFeaturedTours()
    ]);
    console.log('✅ Homepage data loaded successfully');
    console.log('💰 Tours price debug:', tours.value.map(t => ({
        title: t.title,
        price: t.price,
        host: t.host
    })));
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['text-darkText']} */ ;
/** @type {__VLS_StyleScopedClasses['dark']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lightText']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-background']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.main, __VLS_intrinsicElements.main)({
    ...{ class: "min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
    ...{ class: "relative h-[60vh] flex items-center justify-center bg-gradient-to-br from-primary to-primary-dark" },
    role: "banner",
    'aria-labelledby': "hero-title",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "absolute inset-0 bg-black/20" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center text-white" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({
    id: "hero-title",
    ...{ class: "text-4xl sm:text-5xl md:text-7xl font-bold mb-4 sm:mb-6" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-white/90" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.form, __VLS_intrinsicElements.form)({
    ...{ onSubmit: (__VLS_ctx.handleSearch) },
    ...{ class: "max-w-4xl mx-auto bg-white rounded-full shadow-2xl p-2" },
    role: "search",
    'aria-label': "Buscar alojamientos",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "grid grid-cols-1 md:grid-cols-4 gap-2" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "px-4 sm:px-6 py-3 sm:py-4 text-left" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    for: "checkin-input",
    ...{ class: "block text-xs font-semibold text-gray-800 mb-1" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
    id: "checkin-input",
    type: "date",
    min: (__VLS_ctx.today),
    ...{ class: "w-full text-gray-600 bg-transparent border-none outline-none text-sm focus:ring-2 focus:ring-primary/20 rounded" },
    'aria-describedby': "checkin-help",
});
(__VLS_ctx.filters.checkIn);
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    id: "checkin-help",
    ...{ class: "sr-only" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "px-4 sm:px-6 py-3 sm:py-4 text-left md:border-l border-gray-200" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    for: "checkout-input",
    ...{ class: "block text-xs font-semibold text-gray-800 mb-1" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
    id: "checkout-input",
    type: "date",
    min: (__VLS_ctx.filters.checkIn || __VLS_ctx.today),
    ...{ class: "w-full text-gray-600 bg-transparent border-none outline-none text-sm focus:ring-2 focus:ring-primary/20 rounded" },
    'aria-describedby': "checkout-help",
});
(__VLS_ctx.filters.checkOut);
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    id: "checkout-help",
    ...{ class: "sr-only" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "px-4 sm:px-6 py-3 sm:py-4 text-left md:border-l border-gray-200" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    for: "guests-input",
    ...{ class: "block text-xs font-semibold text-gray-800 mb-1" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
    id: "guests-input",
    type: "number",
    min: "1",
    max: "20",
    placeholder: "Agregar huéspedes",
    ...{ class: "w-full text-gray-600 bg-transparent border-none outline-none text-sm placeholder-gray-400 focus:ring-2 focus:ring-primary/20 rounded" },
    'aria-describedby': "guests-help",
});
(__VLS_ctx.filters.guests);
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    id: "guests-help",
    ...{ class: "sr-only" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "px-2 py-2" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    type: "submit",
    disabled: (__VLS_ctx.isSearching),
    ...{ class: "bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full px-6 sm:px-8 py-3 font-semibold transition-all duration-200 w-full focus:outline-none focus:ring-4 focus:ring-primary/30" },
    'aria-label': (__VLS_ctx.isSearching ? 'Buscando alojamientos...' : 'Buscar alojamientos'),
});
const __VLS_0 = {}.SearchIcon;
/** @type {[typeof __VLS_components.SearchIcon, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ class: "w-4 h-4 sm:w-5 sm:h-5 inline mr-2" },
    'aria-hidden': "true",
}));
const __VLS_2 = __VLS_1({
    ...{ class: "w-4 h-4 sm:w-5 sm:h-5 inline mr-2" },
    'aria-hidden': "true",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
(__VLS_ctx.isSearching ? 'Buscando...' : 'Buscar');
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
    ...{ class: "py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6" },
    'aria-labelledby': "properties-title",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.header, __VLS_intrinsicElements.header)({
    ...{ class: "mb-8 sm:mb-12" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
    id: "properties-title",
    ...{ class: "text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-300" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "text-gray-600 dark:text-gray-400 transition-colors duration-300" },
});
if (__VLS_ctx.loadingProperties) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex items-center justify-center py-12 sm:py-16" },
        role: "status",
        'aria-live': "polite",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "animate-spin rounded-full h-8 w-8 border-b-2 border-primary" },
        'aria-hidden': "true",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "ml-3 text-gray-600 dark:text-gray-400" },
    });
}
else if (__VLS_ctx.properties.length > 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6" },
        role: "list",
        'aria-label': "Lista de propiedades disponibles",
    });
    for (const [property] of __VLS_getVForSourceType((__VLS_ctx.displayedProperties))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.article, __VLS_intrinsicElements.article)({
            ...{ onClick: (...[$event]) => {
                    if (!!(__VLS_ctx.loadingProperties))
                        return;
                    if (!(__VLS_ctx.properties.length > 0))
                        return;
                    __VLS_ctx.viewProperty(property._id);
                } },
            ...{ onKeydown: (...[$event]) => {
                    if (!!(__VLS_ctx.loadingProperties))
                        return;
                    if (!(__VLS_ctx.properties.length > 0))
                        return;
                    __VLS_ctx.viewProperty(property._id);
                } },
            ...{ onKeydown: (...[$event]) => {
                    if (!!(__VLS_ctx.loadingProperties))
                        return;
                    if (!(__VLS_ctx.properties.length > 0))
                        return;
                    __VLS_ctx.viewProperty(property._id);
                } },
            key: (property._id),
            ...{ class: "group cursor-pointer focus-within:ring-2 focus-within:ring-primary/50 rounded-xl transition-all duration-300" },
            role: "listitem",
            tabindex: "0",
            'aria-label': (`Ver detalles de ${property.title} en ${property.city}`),
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "relative overflow-hidden rounded-xl mb-3" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
            ...{ onError: (__VLS_ctx.handleImageError) },
            src: (property.imageUrls?.[0] || __VLS_ctx.fallbackImage),
            alt: (`Imagen de ${property.title} en ${property.city}`),
            ...{ class: "w-full h-48 sm:h-64 object-cover group-hover:scale-105 transition-transform duration-300" },
            loading: "lazy",
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!!(__VLS_ctx.loadingProperties))
                        return;
                    if (!(__VLS_ctx.properties.length > 0))
                        return;
                    __VLS_ctx.toggleFavorite(property._id);
                } },
            ...{ onKeydown: (...[$event]) => {
                    if (!!(__VLS_ctx.loadingProperties))
                        return;
                    if (!(__VLS_ctx.properties.length > 0))
                        return;
                    __VLS_ctx.toggleFavorite(property._id);
                } },
            ...{ onKeydown: (...[$event]) => {
                    if (!!(__VLS_ctx.loadingProperties))
                        return;
                    if (!(__VLS_ctx.properties.length > 0))
                        return;
                    __VLS_ctx.toggleFavorite(property._id);
                } },
            ...{ class: "absolute top-3 right-3 p-2 bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50" },
            'aria-label': (`${__VLS_ctx.user ? 'Agregar a' : 'Inicia sesión para agregar'} ${property.title} a favoritos`),
        });
        const __VLS_4 = {}.HeartIcon;
        /** @type {[typeof __VLS_components.HeartIcon, ]} */ ;
        // @ts-ignore
        const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
            ...{ class: "w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-300" },
            'aria-hidden': "true",
        }));
        const __VLS_6 = __VLS_5({
            ...{ class: "w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-300" },
            'aria-hidden': "true",
        }, ...__VLS_functionalComponentArgsRest(__VLS_5));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "space-y-1" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "flex items-center justify-between gap-2" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
            ...{ class: "font-semibold text-darkText dark:text-white truncate text-sm sm:text-base transition-colors duration-300" },
        });
        (property.title);
        if (property.averageRating) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "flex items-center gap-1 flex-shrink-0" },
                'aria-label': (`Calificación: ${property.averageRating.toFixed(1)} de 5 estrellas`),
            });
            const __VLS_8 = {}.StarIcon;
            /** @type {[typeof __VLS_components.StarIcon, ]} */ ;
            // @ts-ignore
            const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
                ...{ class: "w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" },
                'aria-hidden': "true",
            }));
            const __VLS_10 = __VLS_9({
                ...{ class: "w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" },
                'aria-hidden': "true",
            }, ...__VLS_functionalComponentArgsRest(__VLS_9));
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "text-xs sm:text-sm text-gray-600 dark:text-gray-400" },
            });
            (property.averageRating.toFixed(1));
        }
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: "text-lightText dark:text-gray-400 text-xs sm:text-sm transition-colors duration-300" },
        });
        (property.city);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: "text-darkText dark:text-white font-semibold text-sm sm:text-base transition-colors duration-300" },
        });
        (__VLS_ctx.getPropertyPrice(property));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "font-normal text-lightText dark:text-gray-400" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: "text-xs text-lightText dark:text-gray-400 transition-colors duration-300" },
        });
        (property.guests);
        (property.guests > 1 ? 'es' : '');
    }
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "text-center py-12 sm:py-16" },
        role: "status",
        'aria-live': "polite",
    });
    const __VLS_12 = {}.HomeIcon;
    /** @type {[typeof __VLS_components.HomeIcon, ]} */ ;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
        ...{ class: "w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-gray-400 dark:text-gray-500" },
        'aria-hidden': "true",
    }));
    const __VLS_14 = __VLS_13({
        ...{ class: "w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-gray-400 dark:text-gray-500" },
        'aria-hidden': "true",
    }, ...__VLS_functionalComponentArgsRest(__VLS_13));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
        ...{ class: "text-lg sm:text-xl font-semibold text-darkText dark:text-white mb-2 transition-colors duration-300" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-lightText dark:text-gray-400 transition-colors duration-300" },
    });
}
if (__VLS_ctx.properties.length > 8) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "text-center mt-8 sm:mt-12" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.toggleShowAllProperties) },
        ...{ class: "border border-darkText dark:border-white text-darkText dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 font-semibold py-3 px-6 sm:px-8 rounded-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary/30" },
        'aria-expanded': (__VLS_ctx.showAllProperties),
        'aria-label': (__VLS_ctx.showAllProperties ? 'Mostrar menos propiedades' : `Mostrar ${__VLS_ctx.properties.length - 8} propiedades adicionales`),
    });
    (__VLS_ctx.showAllProperties ? 'Ver menos' : `Mostrar más (${__VLS_ctx.properties.length - 8} restantes)`);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
    ...{ class: "py-12 sm:py-16 bg-background dark:bg-gray-800 transition-colors duration-300" },
    'aria-labelledby': "tours-title",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "max-w-7xl mx-auto px-4 sm:px-6" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.header, __VLS_intrinsicElements.header)({
    ...{ class: "mb-8 sm:mb-12" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
    id: "tours-title",
    ...{ class: "text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-300" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "text-gray-700 dark:text-gray-300 transition-colors duration-300" },
});
if (__VLS_ctx.loadingTours) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex items-center justify-center py-12 sm:py-16" },
        role: "status",
        'aria-live': "polite",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "animate-spin rounded-full h-8 w-8 border-b-2 border-primary" },
        'aria-hidden': "true",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "ml-3 text-gray-600 dark:text-gray-400" },
    });
}
else if (__VLS_ctx.tours.length > 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6" },
        role: "list",
        'aria-label': "Lista de tours disponibles",
    });
    for (const [tour] of __VLS_getVForSourceType((__VLS_ctx.displayedTours))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.article, __VLS_intrinsicElements.article)({
            ...{ onClick: (...[$event]) => {
                    if (!!(__VLS_ctx.loadingTours))
                        return;
                    if (!(__VLS_ctx.tours.length > 0))
                        return;
                    __VLS_ctx.viewTour(tour._id);
                } },
            ...{ onKeydown: (...[$event]) => {
                    if (!!(__VLS_ctx.loadingTours))
                        return;
                    if (!(__VLS_ctx.tours.length > 0))
                        return;
                    __VLS_ctx.viewTour(tour._id);
                } },
            ...{ onKeydown: (...[$event]) => {
                    if (!!(__VLS_ctx.loadingTours))
                        return;
                    if (!(__VLS_ctx.tours.length > 0))
                        return;
                    __VLS_ctx.viewTour(tour._id);
                } },
            key: (tour._id),
            ...{ class: "group cursor-pointer focus-within:ring-2 focus-within:ring-primary/50 rounded-xl transition-all duration-300" },
            role: "listitem",
            tabindex: "0",
            'aria-label': (`Ver detalles del tour ${tour.title}`),
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "relative overflow-hidden rounded-xl mb-3" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
            ...{ onError: (__VLS_ctx.handleImageError) },
            src: (tour.imageUrls?.[0] || __VLS_ctx.fallbackTour),
            alt: (`Imagen del tour ${tour.title}`),
            ...{ class: "w-full h-56 sm:h-72 object-cover group-hover:scale-105 transition-transform duration-300" },
            loading: "lazy",
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "absolute top-3 left-3" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: ({
                    'bg-green-500': tour.status === 'available',
                    'bg-red-500': tour.status === 'sold_out',
                    'bg-yellow-500': tour.status === 'upcoming',
                    'bg-gray-500': tour.status === 'cancelled'
                }) },
            ...{ class: "px-2 py-1 text-xs font-medium text-white rounded-full" },
            'aria-label': (`Estado del tour: ${__VLS_ctx.getStatusLabel(tour.status)}`),
        });
        (__VLS_ctx.getStatusLabel(tour.status));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "space-y-1" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
            ...{ class: "font-semibold text-gray-900 dark:text-white text-sm sm:text-base transition-colors duration-300" },
        });
        (tour.title);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: "text-gray-700 dark:text-gray-300 text-xs sm:text-sm line-clamp-2 transition-colors duration-300" },
        });
        (tour.description);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "flex items-center justify-between gap-2" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: "font-semibold text-gray-900 dark:text-white text-sm sm:text-base transition-colors duration-300" },
        });
        (__VLS_ctx.getTourPrice(tour));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "font-normal text-gray-600 dark:text-gray-300" },
        });
        if (tour.averageRating) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "flex items-center gap-1 flex-shrink-0" },
                'aria-label': (`Calificación: ${tour.averageRating.toFixed(1)} de 5 estrellas`),
            });
            const __VLS_16 = {}.StarIcon;
            /** @type {[typeof __VLS_components.StarIcon, ]} */ ;
            // @ts-ignore
            const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
                ...{ class: "w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" },
                'aria-hidden': "true",
            }));
            const __VLS_18 = __VLS_17({
                ...{ class: "w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" },
                'aria-hidden': "true",
            }, ...__VLS_functionalComponentArgsRest(__VLS_17));
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "text-xs sm:text-sm text-gray-600 dark:text-gray-400" },
            });
            (tour.averageRating.toFixed(1));
        }
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "flex items-center text-xs mt-2 transition-colors duration-300" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "text-gray-700 dark:text-gray-300" },
        });
        (__VLS_ctx.getHostName(tour));
    }
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "text-center py-12 sm:py-16" },
        role: "status",
        'aria-live': "polite",
    });
    const __VLS_20 = {}.MapIcon;
    /** @type {[typeof __VLS_components.MapIcon, ]} */ ;
    // @ts-ignore
    const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
        ...{ class: "w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-gray-400 dark:text-gray-500" },
        'aria-hidden': "true",
    }));
    const __VLS_22 = __VLS_21({
        ...{ class: "w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-gray-400 dark:text-gray-500" },
        'aria-hidden': "true",
    }, ...__VLS_functionalComponentArgsRest(__VLS_21));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
        ...{ class: "text-lg sm:text-xl font-semibold text-darkText dark:text-white mb-2 transition-colors duration-300" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-lightText dark:text-gray-400 transition-colors duration-300" },
    });
}
if (__VLS_ctx.tours.length > 6) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "text-center mt-8 sm:mt-12" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.toggleShowAllTours) },
        ...{ class: "border border-darkText dark:border-white text-darkText dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 font-semibold py-3 px-6 sm:px-8 rounded-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary/30" },
        'aria-expanded': (__VLS_ctx.showAllTours),
        'aria-label': (__VLS_ctx.showAllTours ? 'Mostrar menos tours' : `Mostrar ${__VLS_ctx.tours.length - 6} tours adicionales`),
    });
    (__VLS_ctx.showAllTours ? 'Ver menos' : `Mostrar más tours (${__VLS_ctx.tours.length - 6} restantes)`);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
    ...{ class: "py-16 sm:py-20 bg-gradient-to-r from-primary to-primary-dark text-white" },
    'aria-labelledby': "cta-title",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "max-w-4xl mx-auto px-4 sm:px-6 text-center" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
    id: "cta-title",
    ...{ class: "text-3xl sm:text-4xl font-bold mb-4 sm:mb-6" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "text-lg sm:text-xl mb-6 sm:mb-8 text-white/90" },
});
const __VLS_24 = {}.RouterLink;
/** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.RouterLink, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    to: "/contact",
    ...{ class: "inline-block bg-white text-primary hover:bg-gray-50 font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-white/30" },
    'aria-label': "Ir a la página de contacto para unirse como host",
}));
const __VLS_26 = __VLS_25({
    to: "/contact",
    ...{ class: "inline-block bg-white text-primary hover:bg-gray-50 font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-white/30" },
    'aria-label': "Ir a la página de contacto para unirse como host",
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
__VLS_27.slots.default;
var __VLS_27;
if (__VLS_ctx.showLoginModal) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ onClick: (__VLS_ctx.closeLoginModal) },
        ...{ onKeydown: (__VLS_ctx.closeLoginModal) },
        ...{ class: "fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 transition-opacity duration-300" },
        role: "dialog",
        'aria-labelledby': "modal-title",
        'aria-modal': "true",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ onClick: () => { } },
        ...{ class: "bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 max-w-md w-full transition-colors duration-300" },
        role: "document",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "text-center" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
        id: "modal-title",
        ...{ class: "text-xl sm:text-2xl font-semibold text-darkText dark:text-white mb-4 transition-colors duration-300" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-lightText dark:text-gray-400 mb-6 sm:mb-8 transition-colors duration-300" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "space-y-4" },
    });
    const __VLS_28 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.RouterLink, ]} */ ;
    // @ts-ignore
    const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
        ...{ 'onClick': {} },
        to: "/register",
        ...{ class: "block w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-primary/30" },
        'aria-label': "Ir a la página de registro",
    }));
    const __VLS_30 = __VLS_29({
        ...{ 'onClick': {} },
        to: "/register",
        ...{ class: "block w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-primary/30" },
        'aria-label': "Ir a la página de registro",
    }, ...__VLS_functionalComponentArgsRest(__VLS_29));
    let __VLS_32;
    let __VLS_33;
    let __VLS_34;
    const __VLS_35 = {
        onClick: (__VLS_ctx.closeLoginModal)
    };
    __VLS_31.slots.default;
    var __VLS_31;
    const __VLS_36 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.RouterLink, ]} */ ;
    // @ts-ignore
    const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
        ...{ 'onClick': {} },
        to: "/login",
        ...{ class: "block w-full border border-gray-300 dark:border-gray-600 text-darkText dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors duración-200 focus:outline-none focus:ring-4 focus:ring-primary/30" },
        'aria-label': "Ir a la página de inicio de sesión",
    }));
    const __VLS_38 = __VLS_37({
        ...{ 'onClick': {} },
        to: "/login",
        ...{ class: "block w-full border border-gray-300 dark:border-gray-600 text-darkText dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors duración-200 focus:outline-none focus:ring-4 focus:ring-primary/30" },
        'aria-label': "Ir a la página de inicio de sesión",
    }, ...__VLS_functionalComponentArgsRest(__VLS_37));
    let __VLS_40;
    let __VLS_41;
    let __VLS_42;
    const __VLS_43 = {
        onClick: (__VLS_ctx.closeLoginModal)
    };
    __VLS_39.slots.default;
    var __VLS_39;
}
/** @type {__VLS_StyleScopedClasses['min-h-screen']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-gray-900']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['h-[60vh]']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gradient-to-br']} */ ;
/** @type {__VLS_StyleScopedClasses['from-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['to-primary-dark']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['inset-0']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-black/20']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['z-10']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-4xl']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['text-4xl']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:text-5xl']} */ ;
/** @type {__VLS_StyleScopedClasses['md:text-7xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-base']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['md:text-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:mb-8']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white/90']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-4xl']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['p-2']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-1']} */ ;
/** @type {__VLS_StyleScopedClasses['md:grid-cols-4']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['py-3']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:py-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-left']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-800']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-transparent']} */ ;
/** @type {__VLS_StyleScopedClasses['border-none']} */ ;
/** @type {__VLS_StyleScopedClasses['outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-2']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-primary/20']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['sr-only']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['py-3']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:py-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-left']} */ ;
/** @type {__VLS_StyleScopedClasses['md:border-l']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-800']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-transparent']} */ ;
/** @type {__VLS_StyleScopedClasses['border-none']} */ ;
/** @type {__VLS_StyleScopedClasses['outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-2']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-primary/20']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['sr-only']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['py-3']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:py-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-left']} */ ;
/** @type {__VLS_StyleScopedClasses['md:border-l']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-800']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-transparent']} */ ;
/** @type {__VLS_StyleScopedClasses['border-none']} */ ;
/** @type {__VLS_StyleScopedClasses['outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['placeholder-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-2']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-primary/20']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['sr-only']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-primary-dark']} */ ;
/** @type {__VLS_StyleScopedClasses['disabled:opacity-50']} */ ;
/** @type {__VLS_StyleScopedClasses['disabled:cursor-not-allowed']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:px-8']} */ ;
/** @type {__VLS_StyleScopedClasses['py-3']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-200']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-4']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-primary/30']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['inline']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-12']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:py-16']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-7xl']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:mb-12']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:text-3xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['py-12']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:py-16']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-spin']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-8']} */ ;
/** @type {__VLS_StyleScopedClasses['w-8']} */ ;
/** @type {__VLS_StyleScopedClasses['border-b-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-1']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:grid-cols-3']} */ ;
/** @type {__VLS_StyleScopedClasses['xl:grid-cols-4']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:gap-6']} */ ;
/** @type {__VLS_StyleScopedClasses['group']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['focus-within:ring-2']} */ ;
/** @type {__VLS_StyleScopedClasses['focus-within:ring-primary/50']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-48']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:h-64']} */ ;
/** @type {__VLS_StyleScopedClasses['object-cover']} */ ;
/** @type {__VLS_StyleScopedClasses['group-hover:scale-105']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-transform']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['top-3']} */ ;
/** @type {__VLS_StyleScopedClasses['right-3']} */ ;
/** @type {__VLS_StyleScopedClasses['p-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white/80']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-gray-800/80']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:hover:bg-gray-800']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-200']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-2']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-primary/50']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-1']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-darkText']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['truncate']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:text-base']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-1']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-shrink-0']} */ ;
/** @type {__VLS_StyleScopedClasses['w-3']} */ ;
/** @type {__VLS_StyleScopedClasses['h-3']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-yellow-400']} */ ;
/** @type {__VLS_StyleScopedClasses['fill-current']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lightText']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
/** @type {__VLS_StyleScopedClasses['text-darkText']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:text-base']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
/** @type {__VLS_StyleScopedClasses['font-normal']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lightText']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lightText']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['py-12']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:py-16']} */ ;
/** @type {__VLS_StyleScopedClasses['w-12']} */ ;
/** @type {__VLS_StyleScopedClasses['h-12']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:w-16']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:h-16']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:text-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-darkText']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lightText']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:mt-12']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-darkText']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:border-white']} */ ;
/** @type {__VLS_StyleScopedClasses['text-darkText']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-gray-50']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:hover:bg-gray-800']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['py-3']} */ ;
/** @type {__VLS_StyleScopedClasses['px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:px-8']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-200']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-4']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-primary/30']} */ ;
/** @type {__VLS_StyleScopedClasses['py-12']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:py-16']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-background']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-gray-800']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-7xl']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:mb-12']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:text-3xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['py-12']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:py-16']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-spin']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-8']} */ ;
/** @type {__VLS_StyleScopedClasses['w-8']} */ ;
/** @type {__VLS_StyleScopedClasses['border-b-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-1']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:grid-cols-3']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:gap-6']} */ ;
/** @type {__VLS_StyleScopedClasses['group']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['focus-within:ring-2']} */ ;
/** @type {__VLS_StyleScopedClasses['focus-within:ring-primary/50']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-56']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:h-72']} */ ;
/** @type {__VLS_StyleScopedClasses['object-cover']} */ ;
/** @type {__VLS_StyleScopedClasses['group-hover:scale-105']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-transform']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['top-3']} */ ;
/** @type {__VLS_StyleScopedClasses['left-3']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-green-500']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-red-500']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-yellow-500']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-1']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:text-base']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['line-clamp-2']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:text-base']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
/** @type {__VLS_StyleScopedClasses['font-normal']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-1']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-shrink-0']} */ ;
/** @type {__VLS_StyleScopedClasses['w-3']} */ ;
/** @type {__VLS_StyleScopedClasses['h-3']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-yellow-400']} */ ;
/** @type {__VLS_StyleScopedClasses['fill-current']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['py-12']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:py-16']} */ ;
/** @type {__VLS_StyleScopedClasses['w-12']} */ ;
/** @type {__VLS_StyleScopedClasses['h-12']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:w-16']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:h-16']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:text-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-darkText']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lightText']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:mt-12']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-darkText']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:border-white']} */ ;
/** @type {__VLS_StyleScopedClasses['text-darkText']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-gray-50']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:hover:bg-gray-800']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['py-3']} */ ;
/** @type {__VLS_StyleScopedClasses['px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:px-8']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-200']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-4']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-primary/30']} */ ;
/** @type {__VLS_StyleScopedClasses['py-16']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:py-20']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gradient-to-r']} */ ;
/** @type {__VLS_StyleScopedClasses['from-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['to-primary-dark']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-4xl']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-3xl']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:text-4xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:text-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:mb-8']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white/90']} */ ;
/** @type {__VLS_StyleScopedClasses['inline-block']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-gray-50']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['py-3']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:py-4']} */ ;
/** @type {__VLS_StyleScopedClasses['px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:px-8']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-200']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-4']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-white/30']} */ ;
/** @type {__VLS_StyleScopedClasses['fixed']} */ ;
/** @type {__VLS_StyleScopedClasses['inset-0']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-black/50']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['z-50']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-opacity']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-gray-800']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:p-8']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-md']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-darkText']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lightText']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:mb-8']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-4']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-primary-dark']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['py-3']} */ ;
/** @type {__VLS_StyleScopedClasses['px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-200']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-4']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-primary/30']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:border-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['text-darkText']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-gray-50']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:hover:bg-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['py-3']} */ ;
/** @type {__VLS_StyleScopedClasses['px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['duración-200']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-4']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-primary/30']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            RouterLink: RouterLink,
            SearchIcon: SearchIcon,
            HeartIcon: HeartIcon,
            StarIcon: StarIcon,
            HomeIcon: HomeIcon,
            MapIcon: MapIcon,
            user: user,
            properties: properties,
            tours: tours,
            loadingProperties: loadingProperties,
            loadingTours: loadingTours,
            showAllProperties: showAllProperties,
            showAllTours: showAllTours,
            showLoginModal: showLoginModal,
            isSearching: isSearching,
            fallbackImage: fallbackImage,
            fallbackTour: fallbackTour,
            filters: filters,
            today: today,
            displayedProperties: displayedProperties,
            displayedTours: displayedTours,
            handleSearch: handleSearch,
            viewProperty: viewProperty,
            viewTour: viewTour,
            toggleFavorite: toggleFavorite,
            toggleShowAllProperties: toggleShowAllProperties,
            toggleShowAllTours: toggleShowAllTours,
            closeLoginModal: closeLoginModal,
            getPropertyPrice: getPropertyPrice,
            getTourPrice: getTourPrice,
            getStatusLabel: getStatusLabel,
            getHostName: getHostName,
            handleImageError: handleImageError,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=HomeView.vue.js.map