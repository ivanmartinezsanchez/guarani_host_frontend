import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Wifi, Car, Coffee, Tv, Waves, Dumbbell, UtensilsCrossed, WashingMachine, AirVent, Shield, TreePine, Thermometer, ParkingCircle, Baby, Cigarette, Dog, Accessibility, } from 'lucide-vue-next';
import { getPublicPropertyById, } from '@/services/publicPropertyService';
import { createBooking } from '@/services/bookingService';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import Swal from 'sweetalert2';
const route = useRoute();
const router = useRouter();
// Reactive state for property and UI
const property = ref(null);
const loading = ref(true);
const isSubmitting = ref(false);
const dateRange = ref(null);
const guests = ref(1);
// Maximum guests allowed in the booking form
const maxGuests = computed(() => property.value?.guests ?? 10);
/**
 * Amenity configuration used on the public details page.
 * Maps amenity IDs from the DB to human labels and icons.
 */
const AMENITY_CONFIG = {
    wifi: { label: 'WiFi', icon: Wifi },
    parking: { label: 'Estacionamiento', icon: Car },
    kitchen: { label: 'Cocina', icon: Coffee },
    tv: { label: 'TV', icon: Tv },
    pool: { label: 'Piscina', icon: Waves },
    gym: { label: 'Gimnasio', icon: Dumbbell },
    restaurant: { label: 'Restaurante', icon: UtensilsCrossed },
    laundry: { label: 'Lavandería', icon: WashingMachine },
    air_conditioning: { label: 'Aire Acondicionado', icon: AirVent },
    security: { label: 'Seguridad 24/7', icon: Shield },
    garden: { label: 'Jardín', icon: TreePine },
    heating: { label: 'Calefacción', icon: Thermometer },
    valet_parking: { label: 'Valet Parking', icon: ParkingCircle },
    baby_friendly: { label: 'Apto para Bebés', icon: Baby },
    smoking_allowed: { label: 'Permitido Fumar', icon: Cigarette },
    pet_friendly: { label: 'Acepta Mascotas', icon: Dog },
    accessible: { label: 'Accesible', icon: Accessibility },
};
/**
 * Returns amenity definition (label + icon) for a given ID.
 * Falls back to raw ID text when unknown.
 */
const getAmenityDefinition = (id) => {
    return AMENITY_CONFIG[id] ?? { label: id, icon: null };
};
// Temporary mock: booked dates should eventually come from API
const bookedDates = [
    new Date('2025-06-01'),
    new Date('2025-06-05'),
    new Date('2025-06-12'),
];
// Booking validation
const isValidBooking = computed(() => !!dateRange.value &&
    dateRange.value.length === 2 &&
    guests.value > 0 &&
    guests.value <= maxGuests.value &&
    property.value?.status === 'available');
// Number of nights between selected dates
const numberOfNights = computed(() => {
    if (!dateRange.value || dateRange.value.length !== 2)
        return 0;
    const [checkIn, checkOut] = dateRange.value;
    return Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
});
// Total price for the selected stay
const totalPrice = computed(() => {
    if (!property.value || numberOfNights.value <= 0)
        return 0;
    return property.value.pricePerNight * numberOfNights.value;
});
// Load property details on mount
onMounted(async () => {
    try {
        loading.value = true;
        const propertyId = route.params.id;
        console.log('🏠 Loading property with ID:', propertyId);
        property.value = await getPublicPropertyById(propertyId);
        if (!property.value) {
            console.warn('❌ Property not found:', propertyId);
        }
        else {
            console.log('✅ Property loaded successfully:', property.value.title);
        }
    }
    catch (error) {
        console.error('❌ Error fetching property:', error);
        property.value = null;
    }
    finally {
        loading.value = false;
    }
});
/* ---------------- SUBMIT RESERVATION ---------------- */
async function handleReservation() {
    // Read logged-in user from sessionStorage (same place as login)
    const userStr = sessionStorage.getItem('user');
    // If not logged in, show modal and redirect to login only if confirmed
    if (!userStr) {
        const result = await Swal.fire({
            title: 'Inicia sesión',
            text: 'Debes iniciar sesión para reservar.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Iniciar sesión',
            cancelButtonText: 'Cancelar',
        });
        if (result.isConfirmed) {
            await router.push('/login');
        }
        // Important: stop here if user is not authenticated
        return;
    }
    // Validate form one more time on submit
    if (!isValidBooking.value || !property.value || !dateRange.value) {
        await Swal.fire('Datos incompletos', 'Selecciona fechas válidas y número de huéspedes.', 'warning');
        return;
    }
    const user = JSON.parse(userStr);
    const [checkIn, checkOut] = dateRange.value;
    try {
        isSubmitting.value = true;
        await createBooking({
            user: user._id,
            property: property.value._id,
            checkIn,
            checkOut,
            guests: guests.value,
            status: 'pending',
            totalPrice: totalPrice.value,
            paymentStatus: 'pending',
        });
        await Swal.fire('¡Reserva creada!', 'Tu reserva fue enviada correctamente.', 'success');
        // Reset booking state after success
        dateRange.value = null;
        guests.value = 1;
    }
    catch (err) {
        console.error('Booking failed:', err);
        await Swal.fire('Error', 'No se pudo crear la reserva. Inténtalo de nuevo.', 'error');
    }
    finally {
        isSubmitting.value = false;
    }
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
    ...{ class: "max-w-5xl mx-auto p-6" },
});
if (__VLS_ctx.property) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "space-y-6" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({
        ...{ class: "text-3xl font-bold text-primary" },
    });
    (__VLS_ctx.property.title);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-gray-700 dark:text-gray-300 text-lg" },
    });
    (__VLS_ctx.property.city);
    (__VLS_ctx.property.address);
    if (__VLS_ctx.property.imageUrls?.length) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "grid grid-cols-1 sm:grid-cols-2 gap-4" },
        });
        for (const [img, i] of __VLS_getVForSourceType((__VLS_ctx.property.imageUrls))) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
                key: (i),
                src: (img),
                alt: "Property image",
                ...{ class: "w-full h-64 object-cover rounded" },
            });
        }
    }
    if (__VLS_ctx.property.host) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "bg-gray-50 dark:bg-gray-800 rounded-xl p-6" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
            ...{ class: "text-lg font-semibold mb-2" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "flex items-center space-x-3" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold" },
        });
        ((__VLS_ctx.property.host.firstName || '').charAt(0));
        ((__VLS_ctx.property.host.lastName || '').charAt(0));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: "font-medium" },
        });
        (__VLS_ctx.property.host.firstName || 'N/A');
        (__VLS_ctx.property.host.lastName || '');
        if (__VLS_ctx.property.averageRating) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "flex items-center text-sm text-gray-600" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "text-yellow-500" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "ml-1" },
            });
            (__VLS_ctx.property.averageRating);
            (__VLS_ctx.property.totalReviews);
        }
    }
    if (__VLS_ctx.property.description) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
            ...{ class: "text-lg font-semibold mb-2" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: "text-gray-700 dark:text-gray-300" },
        });
        (__VLS_ctx.property.description);
    }
    if (__VLS_ctx.property.amenities?.length) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
            ...{ class: "text-lg font-semibold mb-2" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "flex flex-wrap gap-2" },
        });
        for (const [amenityId] of __VLS_getVForSourceType((__VLS_ctx.property.amenities))) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                key: (amenityId),
                ...{ class: "inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-100 rounded-full text-sm" },
            });
            if (__VLS_ctx.getAmenityDefinition(amenityId).icon) {
                const __VLS_0 = ((__VLS_ctx.getAmenityDefinition(amenityId).icon));
                // @ts-ignore
                const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
                    ...{ class: "w-3 h-3 mr-1" },
                }));
                const __VLS_2 = __VLS_1({
                    ...{ class: "w-3 h-3 mr-1" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_1));
            }
            (__VLS_ctx.getAmenityDefinition(amenityId).label);
        }
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "text-lg text-gray-800 dark:text-gray-200 space-y-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
    (__VLS_ctx.property.pricePerNight?.toLocaleString() || 'N/A');
    if (__VLS_ctx.property.guests !== undefined) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
        (__VLS_ctx.property.guests);
        (__VLS_ctx.property.guests === 1 ? '' : 'es');
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: (__VLS_ctx.property.status === 'available'
                ? 'text-green-600'
                : 'text-red-600') },
    });
    (__VLS_ctx.property.status === 'available'
        ? 'Disponible'
        : 'No disponible');
    if (__VLS_ctx.property.status === 'available') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "mt-8 space-y-4" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
            ...{ class: "text-xl font-semibold text-primary" },
        });
        const __VLS_4 = {}.VueDatePicker;
        /** @type {[typeof __VLS_components.VueDatePicker, ]} */ ;
        // @ts-ignore
        const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
            modelValue: (__VLS_ctx.dateRange),
            range: true,
            format: "yyyy-MM-dd",
            disabledDates: (__VLS_ctx.bookedDates),
            placeholder: "Selecciona fechas",
            ...{ class: "w-full max-w-md" },
        }));
        const __VLS_6 = __VLS_5({
            modelValue: (__VLS_ctx.dateRange),
            range: true,
            format: "yyyy-MM-dd",
            disabledDates: (__VLS_ctx.bookedDates),
            placeholder: "Selecciona fechas",
            ...{ class: "w-full max-w-md" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_5));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "mt-2 max-w-xs" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
            for: "guests",
            ...{ class: "block text-sm font-medium mb-1 text-gray-700 dark:text-white" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
            id: "guests",
            type: "number",
            min: "1",
            max: (__VLS_ctx.maxGuests),
            ...{ class: "input" },
        });
        (__VLS_ctx.guests);
        if (__VLS_ctx.property?.guests) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
                ...{ class: "mt-1 text-xs text-gray-500 dark:text-gray-400" },
            });
            (__VLS_ctx.property.guests);
            (__VLS_ctx.property.guests === 1 ? '' : 'es');
        }
        if (__VLS_ctx.totalPrice > 0) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "p-4 bg-gray-100 dark:bg-gray-700 rounded-lg" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
                ...{ class: "text-lg font-semibold" },
            });
            (__VLS_ctx.totalPrice.toLocaleString());
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "text-sm text-gray-600 dark:text-gray-400" },
            });
            (__VLS_ctx.numberOfNights);
            (__VLS_ctx.numberOfNights === 1 ? 'noche' : 'noches');
        }
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (__VLS_ctx.handleReservation) },
            disabled: (!__VLS_ctx.isValidBooking),
            ...{ class: "bg-primary hover:bg-hover text-white px-6 py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed" },
        });
        (__VLS_ctx.isSubmitting ? 'Procesando...' : 'Confirmar Reserva');
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: "text-yellow-800 dark:text-yellow-200" },
        });
    }
}
else if (__VLS_ctx.loading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "text-center py-20" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "mt-4 text-gray-500 dark:text-gray-400" },
    });
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "text-center py-20 text-gray-500 dark:text-gray-400" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
        ...{ class: "text-xl font-semibold mb-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    const __VLS_8 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.RouterLink, ]} */ ;
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
        to: "/",
        ...{ class: "inline-block mt-4 text-primary hover:underline" },
    }));
    const __VLS_10 = __VLS_9({
        to: "/",
        ...{ class: "inline-block mt-4 text-primary hover:underline" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_9));
    __VLS_11.slots.default;
    var __VLS_11;
}
/** @type {__VLS_StyleScopedClasses['max-w-5xl']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-3xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-1']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-64']} */ ;
/** @type {__VLS_StyleScopedClasses['object-cover']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-50']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-gray-800']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['space-x-3']} */ ;
/** @type {__VLS_StyleScopedClasses['w-12']} */ ;
/** @type {__VLS_StyleScopedClasses['h-12']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['text-yellow-500']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['inline-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-blue-100']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-blue-900/40']} */ ;
/** @type {__VLS_StyleScopedClasses['text-blue-800']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-blue-100']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['w-3']} */ ;
/** @type {__VLS_StyleScopedClasses['h-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-800']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-md']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['input']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-100']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-hover']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['py-3']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['disabled:opacity-50']} */ ;
/** @type {__VLS_StyleScopedClasses['disabled:cursor-not-allowed']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-yellow-50']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-yellow-900/20']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-yellow-200']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:border-yellow-800']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['text-yellow-800']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-yellow-200']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['py-20']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-spin']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-12']} */ ;
/** @type {__VLS_StyleScopedClasses['w-12']} */ ;
/** @type {__VLS_StyleScopedClasses['border-b-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['py-20']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['inline-block']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:underline']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            VueDatePicker: VueDatePicker,
            property: property,
            loading: loading,
            isSubmitting: isSubmitting,
            dateRange: dateRange,
            guests: guests,
            maxGuests: maxGuests,
            getAmenityDefinition: getAmenityDefinition,
            bookedDates: bookedDates,
            isValidBooking: isValidBooking,
            numberOfNights: numberOfNights,
            totalPrice: totalPrice,
            handleReservation: handleReservation,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=PropertyDetailView.vue.js.map