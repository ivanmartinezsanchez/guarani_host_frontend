import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
// Import admin services
import { getAllBookingsForAdmin, updateBookingByAdmin, updateBookingPaymentStatusAdmin, deleteBookingByAdmin, exportAdminBookingsToPDF } from '@/services/adminBookingService';
// Import floating components
import FloatingInput from '@/components/ui/FloatingInput.vue';
import FloatingSelect from '@/components/ui/FloatingSelect.vue';
// Import helpers
import { formatDate } from '@/utils/formDataHelpers';
// Icons from Lucide Vue Next
import { ArrowLeft as ArrowLeftIcon, Calendar as CalendarIcon, User as UserIcon, Eye as EyeIcon, Edit as EditIcon, X as XIcon, ArrowRight as ArrowRightIcon, Download as DownloadIcon, CreditCard as CreditCardIcon, Trash as TrashIcon } from 'lucide-vue-next';
// ===== ROUTER =====
const router = useRouter();
const goBack = () => {
    router.push('/admin/dashboard');
};
// ===== REACTIVE STATE =====
/** UI state management */
const isLoading = ref(false);
const isUpdating = ref(false);
const isExporting = ref(false);
const showStatusUpdateModal = ref(false);
const showPaymentUpdateModal = ref(false);
const selectedBooking = ref(null);
const selectedBookingForUpdate = ref(null);
const selectedImage = ref(null);
/** Filter state */
const typeFilter = ref('');
const statusFilter = ref('');
const paymentStatusFilter = ref('');
const guestSearch = ref('');
const dateRange = ref({
    start: '',
    end: ''
});
/** Update modal state */
const newStatus = ref('pending');
const newPaymentStatus = ref('pending');
/** Data */
const allBookings = ref([]);
// ===== COMPUTED PROPERTIES =====
/**
 * Filter bookings based on applied filters
 */
const filteredBookings = computed(() => {
    if (!Array.isArray(allBookings.value)) {
        console.warn('allBookings.value is not an array:', allBookings.value);
        return [];
    }
    let filtered = allBookings.value;
    // Type filter (property vs tour)
    if (typeFilter.value) {
        if (typeFilter.value === 'property') {
            filtered = filtered.filter(booking => booking.property && !booking.tourPackage);
        }
        else if (typeFilter.value === 'tour') {
            filtered = filtered.filter(booking => booking.tourPackage && !booking.property);
        }
    }
    // Status filter
    if (statusFilter.value) {
        filtered = filtered.filter(booking => booking.status === statusFilter.value);
    }
    // Payment status filter
    if (paymentStatusFilter.value) {
        filtered = filtered.filter(booking => booking.paymentStatus === paymentStatusFilter.value);
    }
    // Guest search
    if (guestSearch.value.trim()) {
        const searchTerm = guestSearch.value.toLowerCase().trim();
        filtered = filtered.filter(booking => {
            const user = booking.user;
            if (typeof user === 'object') {
                const fullName = `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase();
                const email = user.email.toLowerCase();
                return fullName.includes(searchTerm) || email.includes(searchTerm);
            }
            return false;
        });
    }
    // Date range filter
    if (dateRange.value.start) {
        filtered = filtered.filter(booking => new Date(booking.checkIn) >= new Date(dateRange.value.start));
    }
    if (dateRange.value.end) {
        filtered = filtered.filter(booking => new Date(booking.checkOut) <= new Date(dateRange.value.end));
    }
    return filtered.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
});
/**
 * Count confirmed bookings
 */
const confirmedCount = computed(() => {
    return filteredBookings.value.filter(booking => booking.status === 'confirmed').length;
});
/**
 * Check if any filters are currently active
 */
const hasActiveFilters = computed(() => {
    return !!(typeFilter.value ||
        statusFilter.value ||
        paymentStatusFilter.value ||
        guestSearch.value.trim() ||
        dateRange.value.start ||
        dateRange.value.end);
});
/**
 * Get total revenue from filtered bookings
 */
const getTotalRevenue = computed(() => {
    return filteredBookings.value
        .filter(booking => booking.paymentStatus === 'paid')
        .reduce((total, booking) => total + (booking.totalPrice || 0), 0);
});
// ===== LIFECYCLE HOOKS =====
/**
 * Initialize component on mount
 */
onMounted(async () => {
    await loadBookings();
});
// ===== DATA LOADING =====
/**
 * Load all bookings using admin service
 */
const loadBookings = async () => {
    try {
        isLoading.value = true;
        const bookings = await getAllBookingsForAdmin();
        // ✅ Verificar que bookings sea un array
        if (Array.isArray(bookings)) {
            allBookings.value = bookings;
        }
        else {
            console.error('Bookings is not an array:', bookings);
            allBookings.value = [];
        }
    }
    catch (error) {
        console.error('Error loading bookings:', error);
        // ✅ Asegurar array vacío en caso de error
        allBookings.value = [];
        await Swal.fire({
            icon: 'error',
            title: 'Error de Carga',
            text: 'No se pudieron cargar las reservas. Inténtalo de nuevo.',
            confirmButtonText: 'OK'
        });
    }
    finally {
        isLoading.value = false;
    }
};
// ===== FILTER MANAGEMENT =====
/**
 * Clear all active filters
 */
const clearAllFilters = () => {
    typeFilter.value = '';
    statusFilter.value = '';
    paymentStatusFilter.value = '';
    guestSearch.value = '';
    dateRange.value = {
        start: '',
        end: ''
    };
};
// ===== EXPORT FUNCTIONALITY =====
/**
 * Export bookings to PDF using admin service
 */
const exportToPDF = async () => {
    try {
        isExporting.value = true;
        const filters = {};
        if (paymentStatusFilter.value)
            filters.paymentStatus = paymentStatusFilter.value;
        if (statusFilter.value)
            filters.status = statusFilter.value;
        if (dateRange.value.start)
            filters.from = dateRange.value.start;
        if (dateRange.value.end)
            filters.to = dateRange.value.end;
        if (typeFilter.value)
            filters.type = typeFilter.value;
        await exportAdminBookingsToPDF(filters);
        await Swal.fire({
            icon: 'success',
            title: 'PDF Generado',
            text: 'El archivo se ha descargado exitosamente.',
            confirmButtonText: 'OK'
        });
    }
    catch (error) {
        console.error('Error exporting bookings:', error);
        await Swal.fire({
            icon: 'error',
            title: 'Error al Exportar',
            text: 'No se pudo generar el PDF. Inténtalo de nuevo.',
            confirmButtonText: 'OK'
        });
    }
    finally {
        isExporting.value = false;
    }
};
// ===== BOOKING OPERATIONS =====
/**
 * View detailed booking information
 */
const viewBookingDetails = (booking) => {
    selectedBooking.value = booking;
};
/**
 * Close booking details modal
 */
const closeBookingDetails = () => {
    selectedBooking.value = null;
};
/**
 * Show status update modal
 */
const showStatusModal = (booking) => {
    selectedBookingForUpdate.value = booking;
    newStatus.value = booking.status;
    showStatusUpdateModal.value = true;
};
/**
 * Close status update modal
 */
const closeStatusModal = () => {
    showStatusUpdateModal.value = false;
    selectedBookingForUpdate.value = null;
    newStatus.value = 'pending';
};
/**
 * Show payment status update modal
 */
const showPaymentStatusModal = (booking) => {
    selectedBookingForUpdate.value = booking;
    newPaymentStatus.value = booking.paymentStatus;
    showPaymentUpdateModal.value = true;
};
/**
 * Close payment status update modal
 */
const closePaymentStatusModal = () => {
    showPaymentUpdateModal.value = false;
    selectedBookingForUpdate.value = null;
    newPaymentStatus.value = 'pending';
};
/**
 * Update booking status using admin service with SweetAlert
 */
const updateBookingStatus = async () => {
    if (!selectedBookingForUpdate.value?._id)
        return;
    try {
        isUpdating.value = true;
        await updateBookingByAdmin(selectedBookingForUpdate.value._id, {
            status: newStatus.value
        });
        // Update local state
        const bookingIndex = allBookings.value.findIndex(b => b._id === selectedBookingForUpdate.value._id);
        if (bookingIndex !== -1) {
            allBookings.value[bookingIndex].status = newStatus.value;
            allBookings.value[bookingIndex].updatedAt = new Date();
        }
        await Swal.fire({
            icon: 'success',
            title: 'Estado Actualizado',
            text: 'El estado de la reserva se ha actualizado exitosamente.',
            confirmButtonText: 'Continuar'
        });
        closeStatusModal();
    }
    catch (error) {
        console.error('Error updating booking status:', error);
        await Swal.fire({
            icon: 'error',
            title: 'Error al Actualizar',
            text: 'No se pudo actualizar el estado de la reserva.',
            confirmButtonText: 'OK'
        });
    }
    finally {
        isUpdating.value = false;
    }
};
/**
 * Update payment status using admin service with SweetAlert
 */
const updatePaymentStatus = async () => {
    if (!selectedBookingForUpdate.value?._id)
        return;
    try {
        isUpdating.value = true;
        await updateBookingPaymentStatusAdmin(selectedBookingForUpdate.value._id, newPaymentStatus.value);
        // Update local state
        const bookingIndex = allBookings.value.findIndex(b => b._id === selectedBookingForUpdate.value._id);
        if (bookingIndex !== -1) {
            allBookings.value[bookingIndex].paymentStatus = newPaymentStatus.value;
            allBookings.value[bookingIndex].updatedAt = new Date();
        }
        await Swal.fire({
            icon: 'success',
            title: 'Pago Actualizado',
            text: 'El estado de pago se ha actualizado exitosamente.',
            confirmButtonText: 'Continuar'
        });
        closePaymentStatusModal();
    }
    catch (error) {
        console.error('Error updating payment status:', error);
        await Swal.fire({
            icon: 'error',
            title: 'Error al Actualizar',
            text: 'No se pudo actualizar el estado de pago.',
            confirmButtonText: 'OK'
        });
    }
    finally {
        isUpdating.value = false;
    }
};
/**
 * Confirm and delete booking with SweetAlert
 */
const confirmDeleteBooking = async (booking) => {
    if (!booking._id)
        return;
    const result = await Swal.fire({
        title: "¿Eliminar Reserva?",
        text: `Esta acción eliminará permanentemente la reserva #${booking._id.slice(-6).toUpperCase()}`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc2626",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
    });
    if (result.isConfirmed) {
        try {
            await deleteBookingByAdmin(booking._id);
            // Remove from local state
            allBookings.value = allBookings.value.filter(b => b._id !== booking._id);
            await Swal.fire({
                icon: 'success',
                title: 'Reserva Eliminada',
                text: 'La reserva se ha eliminado exitosamente.',
                confirmButtonText: 'Continuar'
            });
        }
        catch (error) {
            console.error('Error deleting booking:', error);
            await Swal.fire({
                icon: 'error',
                title: 'Error al Eliminar',
                text: 'No se pudo eliminar la reserva. Inténtalo de nuevo.',
                confirmButtonText: 'OK'
            });
        }
    }
};
// ===== IMAGE MODAL =====
/**
 * Open image in modal
 */
const openImageModal = (imageUrl) => {
    selectedImage.value = imageUrl;
};
/**
 * Close image modal
 */
const closeImageModal = () => {
    selectedImage.value = null;
};
// ===== UTILITY FUNCTIONS =====
/**
 * Format date for display using helper
 */
const formatDateDisplay = (dateString) => {
    if (!dateString)
        return '';
    return formatDate(dateString);
};
/**
 * Calculate duration between dates or get tour duration
 */
const calculateDuration = (booking) => {
    if (booking.tourPackage) {
        const tour = booking.tourPackage;
        if (typeof tour === 'object' && tour.duration) {
            return `${tour.duration} días`;
        }
        return 'Ver detalles';
    }
    // For properties, calculate nights
    if (!booking.checkIn || !booking.checkOut)
        return '';
    const start = new Date(booking.checkIn);
    const end = new Date(booking.checkOut);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${nights} noche${nights > 1 ? 's' : ''}`;
};
/**
 * Get guest name safely
 */
const getGuestName = (user) => {
    if (typeof user === 'string')
        return `ID: ${user}`;
    if (user?.firstName && user?.lastName) {
        return `${user.firstName} ${user.lastName}`;
    }
    return user?.email || 'Usuario desconocido';
};
/**
 * Get guest email safely
 */
const getGuestEmail = (user) => {
    if (typeof user === 'string')
        return 'Email no disponible';
    return user?.email || 'Email no disponible';
};
/**
 * Get booking type (Property or Tour)
 */
const getBookingType = (booking) => {
    return booking.tourPackage ? 'Tour' : 'Propiedad';
};
/**
 * Get booking type badge classes
 */
const getBookingTypeBadge = (booking) => {
    const base = 'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium';
    if (booking.tourPackage) {
        return `${base} bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-200`;
    }
    return `${base} bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200`;
};
/**
 * Get service title safely
 */
const getServiceTitle = (booking) => {
    if (booking.tourPackage) {
        const tour = booking.tourPackage;
        return typeof tour === 'string' ? `Tour ID: ${tour}` : tour.title;
    }
    if (booking.property) {
        const property = booking.property;
        return typeof property === 'string' ? `Propiedad ID: ${property}` : property.title;
    }
    return 'Servicio no especificado';
};
/**
 * Get service location safely
 */
const getServiceLocation = (booking) => {
    if (booking.property) {
        const property = booking.property;
        if (typeof property === 'object') {
            return property.city || property.location || 'Ciudad no especificada';
        }
        return 'Ubicación no disponible';
    }
    return 'Tour';
};
/**
 * Get service duration (for tours in details)
 */
const getServiceDuration = (booking) => {
    if (booking.tourPackage) {
        const tour = booking.tourPackage;
        if (typeof tour === 'object' && tour.duration) {
            return `${tour.duration} días`;
        }
    }
    return '';
};
/**
 * Get user-friendly status label in Spanish
 */
const getStatusLabel = (status) => {
    const labels = {
        'pending': 'Pendiente',
        'confirmed': 'Confirmada',
        'cancelled': 'Cancelada',
        'completed': 'Completada'
    };
    return labels[status] || status;
};
/**
 * Get CSS classes for status badges
 */
const getStatusBadge = (status) => {
    const base = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
    const colors = {
        'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200',
        'confirmed': 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200',
        'cancelled': 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200',
        'completed': 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200'
    };
    return `${base} ${colors[status] || colors.pending}`;
};
/**
 * Get user-friendly payment status label in Spanish
 */
const getPaymentStatusLabel = (status) => {
    const labels = {
        'pending': 'Pendiente',
        'paid': 'Pagado',
        'failed': 'Fallido',
        'refunded': 'Reembolsado'
    };
    return labels[status] || status;
};
/**
 * Get CSS classes for payment status badges
 */
const getPaymentStatusBadge = (status) => {
    const base = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
    const colors = {
        'pending': 'bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-200',
        'paid': 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200',
        'failed': 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200',
        'refunded': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
    };
    return `${base} ${colors[status] || colors.pending}`;
};
/**
 * Check if booking status can be updated
 */
const canUpdateStatus = (status) => {
    return status !== 'cancelled' && status !== 'completed';
};
/**
 * Check if payment status can be updated
 */
const canUpdatePaymentStatus = (paymentStatus) => {
    return paymentStatus !== 'refunded';
};
/**
 * Format currency for display
 */
const formatCurrency = (amount) => {
    if (!amount)
        return '$0';
    return `$${amount.toLocaleString()}`;
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['overflow-x-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-x-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-x-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-x-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-x-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['dark']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-x-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['dark']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-x-auto']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "min-h-screen bg-gray-50 dark:bg-gray-900" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.header, __VLS_intrinsicElements.header)({
    ...{ class: "bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex items-center space-x-4" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (__VLS_ctx.goBack) },
    ...{ class: "inline-flex items-center p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500" },
    'aria-label': "Volver al dashboard",
});
const __VLS_0 = {}.ArrowLeftIcon;
/** @type {[typeof __VLS_components.ArrowLeftIcon, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ class: "w-5 h-5" },
}));
const __VLS_2 = __VLS_1({
    ...{ class: "w-5 h-5" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({
    ...{ class: "text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "text-sm text-gray-500 dark:text-gray-400 mt-1" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex items-center gap-4" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex items-center gap-3 text-sm" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-lg" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "text-blue-600 dark:text-blue-400 font-medium" },
});
(__VLS_ctx.filteredBookings.length);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-lg" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "text-green-600 dark:text-green-400 font-medium" },
});
(__VLS_ctx.confirmedCount);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "bg-purple-100 dark:bg-purple-900/30 px-3 py-1 rounded-lg" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "text-purple-600 dark:text-purple-400 font-medium" },
});
(__VLS_ctx.formatCurrency(__VLS_ctx.getTotalRevenue));
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (__VLS_ctx.exportToPDF) },
    disabled: (__VLS_ctx.isExporting),
    ...{ class: "inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" },
});
const __VLS_4 = {}.DownloadIcon;
/** @type {[typeof __VLS_components.DownloadIcon, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    ...{ class: "w-4 h-4" },
}));
const __VLS_6 = __VLS_5({
    ...{ class: "w-4 h-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
(__VLS_ctx.isExporting ? 'Exportando...' : 'Exportar PDF');
__VLS_asFunctionalElement(__VLS_intrinsicElements.main, __VLS_intrinsicElements.main)({
    ...{ class: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
    ...{ class: "bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "p-6" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "space-y-4" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex items-center justify-between" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
    ...{ class: "text-lg font-semibold text-gray-900 dark:text-white" },
});
if (__VLS_ctx.hasActiveFilters) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.clearAllFilters) },
        ...{ class: "text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline focus:outline-none" },
    });
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
/** @type {[typeof FloatingSelect, ]} */ ;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent(FloatingSelect, new FloatingSelect({
    id: "type-filter",
    label: "Tipo",
    modelValue: (__VLS_ctx.typeFilter),
    options: ([
        { value: '', label: 'Todos' },
        { value: 'property', label: 'Propiedades' },
        { value: 'tour', label: 'Tours' }
    ]),
}));
const __VLS_9 = __VLS_8({
    id: "type-filter",
    label: "Tipo",
    modelValue: (__VLS_ctx.typeFilter),
    options: ([
        { value: '', label: 'Todos' },
        { value: 'property', label: 'Propiedades' },
        { value: 'tour', label: 'Tours' }
    ]),
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
/** @type {[typeof FloatingSelect, ]} */ ;
// @ts-ignore
const __VLS_11 = __VLS_asFunctionalComponent(FloatingSelect, new FloatingSelect({
    id: "status-filter",
    label: "Estado",
    modelValue: (__VLS_ctx.statusFilter),
    options: ([
        { value: '', label: 'Todos' },
        { value: 'pending', label: 'Pendiente' },
        { value: 'confirmed', label: 'Confirmada' },
        { value: 'cancelled', label: 'Cancelada' },
        { value: 'completed', label: 'Completada' }
    ]),
}));
const __VLS_12 = __VLS_11({
    id: "status-filter",
    label: "Estado",
    modelValue: (__VLS_ctx.statusFilter),
    options: ([
        { value: '', label: 'Todos' },
        { value: 'pending', label: 'Pendiente' },
        { value: 'confirmed', label: 'Confirmada' },
        { value: 'cancelled', label: 'Cancelada' },
        { value: 'completed', label: 'Completada' }
    ]),
}, ...__VLS_functionalComponentArgsRest(__VLS_11));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
/** @type {[typeof FloatingSelect, ]} */ ;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent(FloatingSelect, new FloatingSelect({
    id: "payment-filter",
    label: "Pago",
    modelValue: (__VLS_ctx.paymentStatusFilter),
    options: ([
        { value: '', label: 'Todos' },
        { value: 'pending', label: 'Pendiente' },
        { value: 'paid', label: 'Pagado' },
        { value: 'failed', label: 'Fallido' },
        { value: 'refunded', label: 'Reembolsado' }
    ]),
}));
const __VLS_15 = __VLS_14({
    id: "payment-filter",
    label: "Pago",
    modelValue: (__VLS_ctx.paymentStatusFilter),
    options: ([
        { value: '', label: 'Todos' },
        { value: 'pending', label: 'Pendiente' },
        { value: 'paid', label: 'Pagado' },
        { value: 'failed', label: 'Fallido' },
        { value: 'refunded', label: 'Reembolsado' }
    ]),
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
/** @type {[typeof FloatingInput, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(FloatingInput, new FloatingInput({
    id: "start-date",
    label: "Fecha inicio",
    type: "date",
    modelValue: (__VLS_ctx.dateRange.start),
}));
const __VLS_18 = __VLS_17({
    id: "start-date",
    label: "Fecha inicio",
    type: "date",
    modelValue: (__VLS_ctx.dateRange.start),
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
/** @type {[typeof FloatingInput, ]} */ ;
// @ts-ignore
const __VLS_20 = __VLS_asFunctionalComponent(FloatingInput, new FloatingInput({
    id: "end-date",
    label: "Fecha fin",
    type: "date",
    modelValue: (__VLS_ctx.dateRange.end),
}));
const __VLS_21 = __VLS_20({
    id: "end-date",
    label: "Fecha fin",
    type: "date",
    modelValue: (__VLS_ctx.dateRange.end),
}, ...__VLS_functionalComponentArgsRest(__VLS_20));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
/** @type {[typeof FloatingInput, ]} */ ;
// @ts-ignore
const __VLS_23 = __VLS_asFunctionalComponent(FloatingInput, new FloatingInput({
    id: "guest-search",
    label: "Buscar huésped",
    type: "text",
    placeholder: "Nombre o email...",
    modelValue: (__VLS_ctx.guestSearch),
}));
const __VLS_24 = __VLS_23({
    id: "guest-search",
    label: "Buscar huésped",
    type: "text",
    placeholder: "Nombre o email...",
    modelValue: (__VLS_ctx.guestSearch),
}, ...__VLS_functionalComponentArgsRest(__VLS_23));
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
    ...{ class: "bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "p-6" },
});
if (__VLS_ctx.isLoading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex items-center justify-center py-12" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex items-center space-x-3" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "text-gray-600 dark:text-gray-300" },
    });
}
else if (__VLS_ctx.filteredBookings.length > 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "overflow-x-auto" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.table, __VLS_intrinsicElements.table)({
        ...{ class: "min-w-full divide-y divide-gray-200 dark:divide-gray-700" },
        role: "table",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.thead, __VLS_intrinsicElements.thead)({
        ...{ class: "bg-gray-50 dark:bg-gray-700" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.tr, __VLS_intrinsicElements.tr)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({
        scope: "col",
        ...{ class: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({
        scope: "col",
        ...{ class: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({
        scope: "col",
        ...{ class: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({
        scope: "col",
        ...{ class: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({
        scope: "col",
        ...{ class: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({
        scope: "col",
        ...{ class: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({
        scope: "col",
        ...{ class: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({
        scope: "col",
        ...{ class: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.tbody, __VLS_intrinsicElements.tbody)({
        ...{ class: "bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700" },
    });
    for (const [booking] of __VLS_getVForSourceType((__VLS_ctx.filteredBookings))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.tr, __VLS_intrinsicElements.tr)({
            key: (booking._id),
            ...{ class: "hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({
            ...{ class: "px-6 py-4 whitespace-nowrap" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "text-sm font-medium text-gray-900 dark:text-white" },
        });
        (booking._id?.slice(-6).toUpperCase());
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "text-sm text-gray-500 dark:text-gray-400" },
        });
        (__VLS_ctx.formatDateDisplay(booking.createdAt));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "flex items-center mt-1" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: (__VLS_ctx.getBookingTypeBadge(booking)) },
        });
        (__VLS_ctx.getBookingType(booking));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({
            ...{ class: "px-6 py-4" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "flex items-center space-x-3" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "flex-shrink-0" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center" },
        });
        const __VLS_26 = {}.UserIcon;
        /** @type {[typeof __VLS_components.UserIcon, ]} */ ;
        // @ts-ignore
        const __VLS_27 = __VLS_asFunctionalComponent(__VLS_26, new __VLS_26({
            ...{ class: "w-4 h-4 text-blue-600 dark:text-blue-400" },
        }));
        const __VLS_28 = __VLS_27({
            ...{ class: "w-4 h-4 text-blue-600 dark:text-blue-400" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_27));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "min-w-0 flex-1" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: "text-sm font-medium text-gray-900 dark:text-white truncate" },
        });
        (__VLS_ctx.getGuestName(booking.user));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: "text-sm text-gray-500 dark:text-gray-400 truncate" },
        });
        (__VLS_ctx.getGuestEmail(booking.user));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: "text-xs text-gray-400 dark:text-gray-500" },
        });
        (booking.guests);
        (booking.guests > 1 ? 's' : '');
        __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({
            ...{ class: "px-6 py-4" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "text-sm font-medium text-gray-900 dark:text-white truncate" },
        });
        (__VLS_ctx.getServiceTitle(booking));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "text-sm text-gray-500 dark:text-gray-400 truncate" },
        });
        (__VLS_ctx.getServiceLocation(booking));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({
            ...{ class: "px-6 py-4 whitespace-nowrap" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "text-sm text-gray-900 dark:text-white" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "flex items-center" },
        });
        const __VLS_30 = {}.CalendarIcon;
        /** @type {[typeof __VLS_components.CalendarIcon, ]} */ ;
        // @ts-ignore
        const __VLS_31 = __VLS_asFunctionalComponent(__VLS_30, new __VLS_30({
            ...{ class: "w-4 h-4 mr-1 text-gray-400" },
        }));
        const __VLS_32 = __VLS_31({
            ...{ class: "w-4 h-4 mr-1 text-gray-400" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_31));
        (__VLS_ctx.formatDateDisplay(booking.checkIn));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "flex items-center mt-1" },
        });
        const __VLS_34 = {}.ArrowRightIcon;
        /** @type {[typeof __VLS_components.ArrowRightIcon, ]} */ ;
        // @ts-ignore
        const __VLS_35 = __VLS_asFunctionalComponent(__VLS_34, new __VLS_34({
            ...{ class: "w-4 h-4 mr-1 text-gray-400" },
        }));
        const __VLS_36 = __VLS_35({
            ...{ class: "w-4 h-4 mr-1 text-gray-400" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_35));
        (__VLS_ctx.formatDateDisplay(booking.checkOut));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "text-xs text-gray-500 dark:text-gray-400 mt-1" },
        });
        (__VLS_ctx.calculateDuration(booking));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({
            ...{ class: "px-6 py-4 whitespace-nowrap" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: (__VLS_ctx.getStatusBadge(booking.status)) },
        });
        (__VLS_ctx.getStatusLabel(booking.status));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({
            ...{ class: "px-6 py-4 whitespace-nowrap" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: (__VLS_ctx.getPaymentStatusBadge(booking.paymentStatus)) },
        });
        (__VLS_ctx.getPaymentStatusLabel(booking.paymentStatus));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({
            ...{ class: "px-6 py-4 whitespace-nowrap" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "text-sm font-medium text-gray-900 dark:text-white" },
        });
        (__VLS_ctx.formatCurrency(booking.totalPrice));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({
            ...{ class: "px-6 py-4 whitespace-nowrap" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "flex items-center space-x-2" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!!(__VLS_ctx.isLoading))
                        return;
                    if (!(__VLS_ctx.filteredBookings.length > 0))
                        return;
                    __VLS_ctx.viewBookingDetails(booking);
                } },
            ...{ class: "inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors focus:outline-none focus:underline text-sm" },
            'aria-label': (`Ver detalles de reserva ${booking._id}`),
        });
        const __VLS_38 = {}.EyeIcon;
        /** @type {[typeof __VLS_components.EyeIcon, ]} */ ;
        // @ts-ignore
        const __VLS_39 = __VLS_asFunctionalComponent(__VLS_38, new __VLS_38({
            ...{ class: "w-4 h-4 mr-1" },
        }));
        const __VLS_40 = __VLS_39({
            ...{ class: "w-4 h-4 mr-1" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_39));
        if (__VLS_ctx.canUpdatePaymentStatus(booking.paymentStatus)) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
                ...{ onClick: (...[$event]) => {
                        if (!!(__VLS_ctx.isLoading))
                            return;
                        if (!(__VLS_ctx.filteredBookings.length > 0))
                            return;
                        if (!(__VLS_ctx.canUpdatePaymentStatus(booking.paymentStatus)))
                            return;
                        __VLS_ctx.showPaymentStatusModal(booking);
                    } },
                ...{ class: "inline-flex items-center text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition-colors focus:outline-none focus:underline text-sm" },
                'aria-label': (`Actualizar pago de reserva ${booking._id}`),
            });
            const __VLS_42 = {}.CreditCardIcon;
            /** @type {[typeof __VLS_components.CreditCardIcon, ]} */ ;
            // @ts-ignore
            const __VLS_43 = __VLS_asFunctionalComponent(__VLS_42, new __VLS_42({
                ...{ class: "w-4 h-4 mr-1" },
            }));
            const __VLS_44 = __VLS_43({
                ...{ class: "w-4 h-4 mr-1" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_43));
        }
        if (__VLS_ctx.canUpdateStatus(booking.status)) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
                ...{ onClick: (...[$event]) => {
                        if (!!(__VLS_ctx.isLoading))
                            return;
                        if (!(__VLS_ctx.filteredBookings.length > 0))
                            return;
                        if (!(__VLS_ctx.canUpdateStatus(booking.status)))
                            return;
                        __VLS_ctx.showStatusModal(booking);
                    } },
                ...{ class: "inline-flex items-center text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-colors focus:outline-none focus:underline text-sm" },
                'aria-label': (`Actualizar estado de reserva ${booking._id}`),
            });
            const __VLS_46 = {}.EditIcon;
            /** @type {[typeof __VLS_components.EditIcon, ]} */ ;
            // @ts-ignore
            const __VLS_47 = __VLS_asFunctionalComponent(__VLS_46, new __VLS_46({
                ...{ class: "w-4 h-4 mr-1" },
            }));
            const __VLS_48 = __VLS_47({
                ...{ class: "w-4 h-4 mr-1" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_47));
        }
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!!(__VLS_ctx.isLoading))
                        return;
                    if (!(__VLS_ctx.filteredBookings.length > 0))
                        return;
                    __VLS_ctx.confirmDeleteBooking(booking);
                } },
            ...{ class: "inline-flex items-center text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors focus:outline-none focus:underline text-sm" },
            'aria-label': (`Eliminar reserva ${booking._id}`),
        });
        const __VLS_50 = {}.TrashIcon;
        /** @type {[typeof __VLS_components.TrashIcon, ]} */ ;
        // @ts-ignore
        const __VLS_51 = __VLS_asFunctionalComponent(__VLS_50, new __VLS_50({
            ...{ class: "w-4 h-4 mr-1" },
        }));
        const __VLS_52 = __VLS_51({
            ...{ class: "w-4 h-4 mr-1" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_51));
    }
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "text-center py-12" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4" },
    });
    const __VLS_54 = {}.CalendarIcon;
    /** @type {[typeof __VLS_components.CalendarIcon, ]} */ ;
    // @ts-ignore
    const __VLS_55 = __VLS_asFunctionalComponent(__VLS_54, new __VLS_54({
        ...{ class: "w-12 h-12 text-gray-400" },
    }));
    const __VLS_56 = __VLS_55({
        ...{ class: "w-12 h-12 text-gray-400" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_55));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
        ...{ class: "text-lg font-medium text-gray-900 dark:text-white mb-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto" },
    });
    (__VLS_ctx.hasActiveFilters ? 'Ninguna reserva coincide con los filtros actuales.' : 'No hay reservas registradas en el sistema.');
}
if (__VLS_ctx.showStatusUpdateModal) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-6" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
        ...{ class: "text-lg font-medium text-gray-900 dark:text-white mb-4" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "space-y-4" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    /** @type {[typeof FloatingSelect, ]} */ ;
    // @ts-ignore
    const __VLS_58 = __VLS_asFunctionalComponent(FloatingSelect, new FloatingSelect({
        id: "new-status",
        label: "Nuevo Estado",
        modelValue: (__VLS_ctx.newStatus),
        options: ([
            { value: 'pending', label: 'Pendiente' },
            { value: 'confirmed', label: 'Confirmada' },
            { value: 'cancelled', label: 'Cancelada' },
            { value: 'completed', label: 'Completada' }
        ]),
    }));
    const __VLS_59 = __VLS_58({
        id: "new-status",
        label: "Nuevo Estado",
        modelValue: (__VLS_ctx.newStatus),
        options: ([
            { value: 'pending', label: 'Pendiente' },
            { value: 'confirmed', label: 'Confirmada' },
            { value: 'cancelled', label: 'Cancelada' },
            { value: 'completed', label: 'Completada' }
        ]),
    }, ...__VLS_functionalComponentArgsRest(__VLS_58));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex justify-end space-x-3 mt-6" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.closeStatusModal) },
        ...{ class: "px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.updateBookingStatus) },
        disabled: (__VLS_ctx.isUpdating),
        ...{ class: "px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2" },
    });
    if (__VLS_ctx.isUpdating) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" },
        });
    }
    (__VLS_ctx.isUpdating ? 'Actualizando...' : 'Actualizar Estado');
}
if (__VLS_ctx.showPaymentUpdateModal) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-6" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
        ...{ class: "text-lg font-medium text-gray-900 dark:text-white mb-4" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "space-y-4" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    /** @type {[typeof FloatingSelect, ]} */ ;
    // @ts-ignore
    const __VLS_61 = __VLS_asFunctionalComponent(FloatingSelect, new FloatingSelect({
        id: "new-payment-status",
        label: "Nuevo Estado de Pago",
        modelValue: (__VLS_ctx.newPaymentStatus),
        options: ([
            { value: 'pending', label: 'Pendiente' },
            { value: 'paid', label: 'Pagado' },
            { value: 'failed', label: 'Fallido' },
            { value: 'refunded', label: 'Reembolsado' }
        ]),
    }));
    const __VLS_62 = __VLS_61({
        id: "new-payment-status",
        label: "Nuevo Estado de Pago",
        modelValue: (__VLS_ctx.newPaymentStatus),
        options: ([
            { value: 'pending', label: 'Pendiente' },
            { value: 'paid', label: 'Pagado' },
            { value: 'failed', label: 'Fallido' },
            { value: 'refunded', label: 'Reembolsado' }
        ]),
    }, ...__VLS_functionalComponentArgsRest(__VLS_61));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex justify-end space-x-3 mt-6" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.closePaymentStatusModal) },
        ...{ class: "px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.updatePaymentStatus) },
        disabled: (__VLS_ctx.isUpdating),
        ...{ class: "px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2" },
    });
    if (__VLS_ctx.isUpdating) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" },
        });
    }
    (__VLS_ctx.isUpdating ? 'Actualizando...' : 'Actualizar Pago');
}
if (__VLS_ctx.selectedBooking) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full max-h-screen overflow-y-auto" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-6" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex items-center justify-between mb-6" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
        ...{ class: "text-xl font-semibold text-gray-900 dark:text-white" },
    });
    (__VLS_ctx.selectedBooking._id?.slice(-6).toUpperCase());
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.closeBookingDetails) },
        ...{ class: "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none" },
    });
    const __VLS_64 = {}.XIcon;
    /** @type {[typeof __VLS_components.XIcon, ]} */ ;
    // @ts-ignore
    const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
        ...{ class: "w-6 h-6" },
    }));
    const __VLS_66 = __VLS_65({
        ...{ class: "w-6 h-6" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_65));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "grid grid-cols-1 lg:grid-cols-2 gap-6" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)({
        ...{ class: "text-lg font-medium text-gray-900 dark:text-white mb-3" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "font-medium" },
    });
    (__VLS_ctx.getGuestName(__VLS_ctx.selectedBooking.user));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "font-medium" },
    });
    (__VLS_ctx.getGuestEmail(__VLS_ctx.selectedBooking.user));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "font-medium" },
    });
    (__VLS_ctx.selectedBooking.guests);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)({
        ...{ class: "text-lg font-medium text-gray-900 dark:text-white mb-3" },
    });
    (__VLS_ctx.getBookingType(__VLS_ctx.selectedBooking));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "font-medium" },
    });
    (__VLS_ctx.getServiceTitle(__VLS_ctx.selectedBooking));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "font-medium" },
    });
    (__VLS_ctx.getServiceLocation(__VLS_ctx.selectedBooking));
    if (__VLS_ctx.getServiceDuration(__VLS_ctx.selectedBooking)) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "font-medium" },
        });
        (__VLS_ctx.getServiceDuration(__VLS_ctx.selectedBooking));
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)({
        ...{ class: "text-lg font-medium text-gray-900 dark:text-white mb-3" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "font-medium" },
    });
    (__VLS_ctx.formatDateDisplay(__VLS_ctx.selectedBooking.checkIn));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "font-medium" },
    });
    (__VLS_ctx.formatDateDisplay(__VLS_ctx.selectedBooking.checkOut));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "font-medium" },
    });
    (__VLS_ctx.getBookingType(__VLS_ctx.selectedBooking) === 'Tour' ? 'Duración' : 'Noches');
    (__VLS_ctx.calculateDuration(__VLS_ctx.selectedBooking));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "font-medium" },
    });
    (__VLS_ctx.formatCurrency(__VLS_ctx.selectedBooking.totalPrice));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "font-medium" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: (__VLS_ctx.getStatusBadge(__VLS_ctx.selectedBooking.status)) },
    });
    (__VLS_ctx.getStatusLabel(__VLS_ctx.selectedBooking.status));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "font-medium" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: (__VLS_ctx.getPaymentStatusBadge(__VLS_ctx.selectedBooking.paymentStatus)) },
    });
    (__VLS_ctx.getPaymentStatusLabel(__VLS_ctx.selectedBooking.paymentStatus));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "font-medium" },
    });
    (__VLS_ctx.formatDateDisplay(__VLS_ctx.selectedBooking.createdAt));
    if (__VLS_ctx.selectedBooking.paymentImages && __VLS_ctx.selectedBooking.paymentImages.length > 0) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)({
            ...{ class: "text-lg font-medium text-gray-900 dark:text-white mb-3" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "bg-gray-50 dark:bg-gray-700 rounded-lg p-4" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "grid grid-cols-2 gap-3" },
        });
        for (const [image, index] of __VLS_getVForSourceType((__VLS_ctx.selectedBooking.paymentImages))) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                key: (index),
                ...{ class: "relative" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
                ...{ onClick: (...[$event]) => {
                        if (!(__VLS_ctx.selectedBooking))
                            return;
                        if (!(__VLS_ctx.selectedBooking.paymentImages && __VLS_ctx.selectedBooking.paymentImages.length > 0))
                            return;
                        __VLS_ctx.openImageModal(image);
                    } },
                src: (image),
                alt: (`Comprobante ${index + 1}`),
                ...{ class: "w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-80" },
            });
        }
    }
    if (__VLS_ctx.selectedBooking.paymentDetails) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "lg:col-span-2" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)({
            ...{ class: "text-lg font-medium text-gray-900 dark:text-white mb-3" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "bg-gray-50 dark:bg-gray-700 rounded-lg p-4" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
        (__VLS_ctx.selectedBooking.paymentDetails);
    }
}
if (__VLS_ctx.selectedImage) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ onClick: (__VLS_ctx.closeImageModal) },
        ...{ class: "fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-[60]" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "max-w-4xl max-h-full" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
        src: (__VLS_ctx.selectedImage),
        alt: "Comprobante de pago",
        ...{ class: "max-w-full max-h-full object-contain rounded-lg" },
    });
}
/** @type {__VLS_StyleScopedClasses['min-h-screen']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-50']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-gray-900']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-gray-800']} */ ;
/** @type {__VLS_StyleScopedClasses['border-b']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:border-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-7xl']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:px-8']} */ ;
/** @type {__VLS_StyleScopedClasses['py-4']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:py-6']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:flex-row']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['space-x-4']} */ ;
/** @type {__VLS_StyleScopedClasses['inline-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['p-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-gray-100']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:hover:text-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:hover:bg-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-2']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-blue-500']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:text-3xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-blue-100']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-blue-900/30']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['text-blue-600']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-blue-400']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-green-100']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-green-900/30']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['text-green-600']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-green-400']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-purple-100']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-purple-900/30']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['text-purple-600']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-purple-400']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['inline-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-green-600']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-green-700']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-2']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-green-500']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['disabled:opacity-50']} */ ;
/** @type {__VLS_StyleScopedClasses['disabled:cursor-not-allowed']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-7xl']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:px-8']} */ ;
/** @type {__VLS_StyleScopedClasses['py-6']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-6']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-gray-800']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:border-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-blue-600']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-blue-700']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-blue-400']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:hover:text-blue-300']} */ ;
/** @type {__VLS_StyleScopedClasses['underline']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-1']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:grid-cols-6']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-gray-800']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:border-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['py-12']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['space-x-3']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-spin']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-6']} */ ;
/** @type {__VLS_StyleScopedClasses['w-6']} */ ;
/** @type {__VLS_StyleScopedClasses['border-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border-blue-600']} */ ;
/** @type {__VLS_StyleScopedClasses['border-t-transparent']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-x-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['min-w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['divide-y']} */ ;
/** @type {__VLS_StyleScopedClasses['divide-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:divide-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-50']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['py-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-left']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
/** @type {__VLS_StyleScopedClasses['tracking-wider']} */ ;
/** @type {__VLS_StyleScopedClasses['px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['py-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-left']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
/** @type {__VLS_StyleScopedClasses['tracking-wider']} */ ;
/** @type {__VLS_StyleScopedClasses['px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['py-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-left']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
/** @type {__VLS_StyleScopedClasses['tracking-wider']} */ ;
/** @type {__VLS_StyleScopedClasses['px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['py-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-left']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
/** @type {__VLS_StyleScopedClasses['tracking-wider']} */ ;
/** @type {__VLS_StyleScopedClasses['px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['py-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-left']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
/** @type {__VLS_StyleScopedClasses['tracking-wider']} */ ;
/** @type {__VLS_StyleScopedClasses['px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['py-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-left']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
/** @type {__VLS_StyleScopedClasses['tracking-wider']} */ ;
/** @type {__VLS_StyleScopedClasses['px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['py-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-left']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
/** @type {__VLS_StyleScopedClasses['tracking-wider']} */ ;
/** @type {__VLS_StyleScopedClasses['px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['py-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-left']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
/** @type {__VLS_StyleScopedClasses['tracking-wider']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-gray-800']} */ ;
/** @type {__VLS_StyleScopedClasses['divide-y']} */ ;
/** @type {__VLS_StyleScopedClasses['divide-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:divide-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-gray-50']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:hover:bg-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-150']} */ ;
/** @type {__VLS_StyleScopedClasses['px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['py-4']} */ ;
/** @type {__VLS_StyleScopedClasses['whitespace-nowrap']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['py-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['space-x-3']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-shrink-0']} */ ;
/** @type {__VLS_StyleScopedClasses['h-8']} */ ;
/** @type {__VLS_StyleScopedClasses['w-8']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-blue-100']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-blue-900/30']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-blue-600']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-blue-400']} */ ;
/** @type {__VLS_StyleScopedClasses['min-w-0']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['truncate']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['truncate']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['py-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['truncate']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['truncate']} */ ;
/** @type {__VLS_StyleScopedClasses['px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['py-4']} */ ;
/** @type {__VLS_StyleScopedClasses['whitespace-nowrap']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['py-4']} */ ;
/** @type {__VLS_StyleScopedClasses['whitespace-nowrap']} */ ;
/** @type {__VLS_StyleScopedClasses['px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['py-4']} */ ;
/** @type {__VLS_StyleScopedClasses['whitespace-nowrap']} */ ;
/** @type {__VLS_StyleScopedClasses['px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['py-4']} */ ;
/** @type {__VLS_StyleScopedClasses['whitespace-nowrap']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['py-4']} */ ;
/** @type {__VLS_StyleScopedClasses['whitespace-nowrap']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['space-x-2']} */ ;
/** @type {__VLS_StyleScopedClasses['inline-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-blue-600']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-blue-700']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-blue-400']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:hover:text-blue-300']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:underline']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-1']} */ ;
/** @type {__VLS_StyleScopedClasses['inline-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-purple-600']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-purple-700']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-purple-400']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:hover:text-purple-300']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:underline']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-1']} */ ;
/** @type {__VLS_StyleScopedClasses['inline-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-green-600']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-green-700']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-green-400']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:hover:text-green-300']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:underline']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-1']} */ ;
/** @type {__VLS_StyleScopedClasses['inline-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-600']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-red-700']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-red-400']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:hover:text-red-300']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:underline']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['py-12']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['w-24']} */ ;
/** @type {__VLS_StyleScopedClasses['h-24']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-100']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-12']} */ ;
/** @type {__VLS_StyleScopedClasses['h-12']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['fixed']} */ ;
/** @type {__VLS_StyleScopedClasses['inset-0']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-black']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-opacity-50']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['z-50']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-gray-800']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-md']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-end']} */ ;
/** @type {__VLS_StyleScopedClasses['space-x-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-6']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:border-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-gray-50']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:hover:bg-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-2']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-blue-600']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-blue-700']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-2']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-blue-500']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['disabled:opacity-50']} */ ;
/** @type {__VLS_StyleScopedClasses['disabled:cursor-not-allowed']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-spin']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['border-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border-white']} */ ;
/** @type {__VLS_StyleScopedClasses['border-t-transparent']} */ ;
/** @type {__VLS_StyleScopedClasses['fixed']} */ ;
/** @type {__VLS_StyleScopedClasses['inset-0']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-black']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-opacity-50']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['z-50']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-gray-800']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-md']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-end']} */ ;
/** @type {__VLS_StyleScopedClasses['space-x-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-6']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:border-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-gray-50']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:hover:bg-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-2']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-purple-600']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-purple-700']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-2']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-purple-500']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['disabled:opacity-50']} */ ;
/** @type {__VLS_StyleScopedClasses['disabled:cursor-not-allowed']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-spin']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['border-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border-white']} */ ;
/** @type {__VLS_StyleScopedClasses['border-t-transparent']} */ ;
/** @type {__VLS_StyleScopedClasses['fixed']} */ ;
/** @type {__VLS_StyleScopedClasses['inset-0']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-black']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-opacity-50']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['z-50']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-gray-800']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-3xl']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['max-h-screen']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-y-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:hover:text-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['w-6']} */ ;
/** @type {__VLS_StyleScopedClasses['h-6']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-1']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-50']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-2']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-50']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-2']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-50']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-2']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-50']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-24']} */ ;
/** @type {__VLS_StyleScopedClasses['object-cover']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:opacity-80']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:col-span-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-50']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['fixed']} */ ;
/** @type {__VLS_StyleScopedClasses['inset-0']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-black']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-opacity-75']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['z-[60]']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-4xl']} */ ;
/** @type {__VLS_StyleScopedClasses['max-h-full']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['max-h-full']} */ ;
/** @type {__VLS_StyleScopedClasses['object-contain']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            FloatingInput: FloatingInput,
            FloatingSelect: FloatingSelect,
            ArrowLeftIcon: ArrowLeftIcon,
            CalendarIcon: CalendarIcon,
            UserIcon: UserIcon,
            EyeIcon: EyeIcon,
            EditIcon: EditIcon,
            XIcon: XIcon,
            ArrowRightIcon: ArrowRightIcon,
            DownloadIcon: DownloadIcon,
            CreditCardIcon: CreditCardIcon,
            TrashIcon: TrashIcon,
            goBack: goBack,
            isLoading: isLoading,
            isUpdating: isUpdating,
            isExporting: isExporting,
            showStatusUpdateModal: showStatusUpdateModal,
            showPaymentUpdateModal: showPaymentUpdateModal,
            selectedBooking: selectedBooking,
            selectedImage: selectedImage,
            typeFilter: typeFilter,
            statusFilter: statusFilter,
            paymentStatusFilter: paymentStatusFilter,
            guestSearch: guestSearch,
            dateRange: dateRange,
            newStatus: newStatus,
            newPaymentStatus: newPaymentStatus,
            filteredBookings: filteredBookings,
            confirmedCount: confirmedCount,
            hasActiveFilters: hasActiveFilters,
            getTotalRevenue: getTotalRevenue,
            clearAllFilters: clearAllFilters,
            exportToPDF: exportToPDF,
            viewBookingDetails: viewBookingDetails,
            closeBookingDetails: closeBookingDetails,
            showStatusModal: showStatusModal,
            closeStatusModal: closeStatusModal,
            showPaymentStatusModal: showPaymentStatusModal,
            closePaymentStatusModal: closePaymentStatusModal,
            updateBookingStatus: updateBookingStatus,
            updatePaymentStatus: updatePaymentStatus,
            confirmDeleteBooking: confirmDeleteBooking,
            openImageModal: openImageModal,
            closeImageModal: closeImageModal,
            formatDateDisplay: formatDateDisplay,
            calculateDuration: calculateDuration,
            getGuestName: getGuestName,
            getGuestEmail: getGuestEmail,
            getBookingType: getBookingType,
            getBookingTypeBadge: getBookingTypeBadge,
            getServiceTitle: getServiceTitle,
            getServiceLocation: getServiceLocation,
            getServiceDuration: getServiceDuration,
            getStatusLabel: getStatusLabel,
            getStatusBadge: getStatusBadge,
            getPaymentStatusLabel: getPaymentStatusLabel,
            getPaymentStatusBadge: getPaymentStatusBadge,
            canUpdateStatus: canUpdateStatus,
            canUpdatePaymentStatus: canUpdatePaymentStatus,
            formatCurrency: formatCurrency,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=AdminBookingManagementView.vue.js.map