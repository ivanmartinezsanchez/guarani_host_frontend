import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
// Import host services with corrected functions
import { getHostBookings, updateHostBookingStatus, // ✅ Now exists in service
updateHostBookingPaymentStatus, // ✅ Now exists in service
exportHostBookingsToPDF } from '@/services/hostBookingService';
// Import floating UI components
import FloatingInput from '@/components/ui/FloatingInput.vue';
import FloatingSelect from '@/components/ui/FloatingSelect.vue';
// Import icons from Lucide Vue Next
import { ArrowLeft as ArrowLeftIcon, Calendar as CalendarIcon, User as UserIcon, Users as UsersIcon, Eye as EyeIcon, Edit as EditIcon, X as XIcon, ArrowRight as ArrowRightIcon, Download as DownloadIcon, CreditCard as CreditCardIcon } from 'lucide-vue-next';
// ===== ROUTER SETUP =====
const router = useRouter();
/**
 * Navigate back to host dashboard
 */
const goBack = () => {
    router.push('/host/dashboard');
};
// ===== REACTIVE STATE MANAGEMENT =====
/** UI state management for loading, modals, and interactions */
const isLoading = ref(false);
const isUpdating = ref(false);
const isExporting = ref(false);
const showStatusUpdateModal = ref(false);
const showPaymentUpdateModal = ref(false);
const selectedBooking = ref(null);
const selectedBookingForUpdate = ref(null);
const selectedImage = ref(null);
/** Filter state for booking list */
const paymentStatusFilter = ref('');
const bookingStatusFilter = ref('');
const typeFilter = ref('');
/** Update modal form state */
const newStatus = ref('pending');
const newPaymentStatus = ref('pending');
const statusReason = ref('');
/** Main booking data */
const allBookings = ref([]);
// ===== COMPUTED PROPERTIES =====
/**
 * Filter bookings based on applied filters and sort by creation date
 * Applies payment status, booking status, and service type filters
 */
const filteredBookings = computed(() => {
    let filtered = allBookings.value;
    // Apply payment status filter
    if (paymentStatusFilter.value) {
        filtered = filtered.filter(booking => booking.paymentStatus === paymentStatusFilter.value);
    }
    // Apply booking status filter
    if (bookingStatusFilter.value) {
        filtered = filtered.filter(booking => booking.status === bookingStatusFilter.value);
    }
    // Apply service type filter (property vs tour)
    if (typeFilter.value) {
        if (typeFilter.value === 'property') {
            filtered = filtered.filter(booking => booking.property && !booking.tourPackage);
        }
        else if (typeFilter.value === 'tour') {
            filtered = filtered.filter(booking => booking.tourPackage && !booking.property);
        }
    }
    // Sort by creation date (newest first)
    return filtered.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
});
/**
 * Count bookings with paid payment status
 */
const paidCount = computed(() => {
    return filteredBookings.value.filter(booking => booking.paymentStatus === 'paid').length;
});
/**
 * Check if any filters are currently active
 */
const hasActiveFilters = computed(() => {
    return !!(paymentStatusFilter.value || bookingStatusFilter.value || typeFilter.value);
});
/**
 * Calculate total revenue from paid bookings
 */
const totalRevenue = computed(() => {
    return filteredBookings.value
        .filter(booking => booking.paymentStatus === 'paid')
        .reduce((total, booking) => total + (booking.totalPrice || 0), 0);
});
// ===== LIFECYCLE HOOKS =====
/**
 * Initialize component when mounted
 * Load all host bookings on component mount
 */
onMounted(async () => {
    await loadBookings();
});
// ===== DATA LOADING =====
/**
 * Load host bookings using the real API service
 * Handles loading state and error management
 */
const loadBookings = async () => {
    try {
        isLoading.value = true;
        const bookings = await getHostBookings();
        allBookings.value = bookings;
    }
    catch (error) {
        console.error('Error loading bookings:', error);
        await Swal.fire({
            icon: 'error',
            title: 'Loading Error',
            text: 'Could not load bookings. Please try again.',
            confirmButtonText: 'OK'
        });
    }
    finally {
        isLoading.value = false;
    }
};
// ===== FILTER MANAGEMENT =====
/**
 * Clear all active filters and reset to show all bookings
 */
const clearFilters = () => {
    paymentStatusFilter.value = '';
    bookingStatusFilter.value = '';
    typeFilter.value = '';
};
// ===== EXPORT FUNCTIONALITY =====
/**
 * Export host bookings to PDF using the real API service
 * Applies current filters to the export
 */
const exportPDF = async () => {
    try {
        isExporting.value = true;
        // Prepare filters for export (backend expects 'bookingStatus' not 'status')
        const filters = {};
        if (paymentStatusFilter.value)
            filters.paymentStatus = paymentStatusFilter.value;
        if (bookingStatusFilter.value)
            filters.bookingStatus = bookingStatusFilter.value; // ✅ Fixed: backend uses 'bookingStatus'
        await exportHostBookingsToPDF(filters);
        await Swal.fire({
            icon: 'success',
            title: 'PDF Generated',
            text: 'The file has been downloaded successfully.',
            confirmButtonText: 'OK'
        });
    }
    catch (error) {
        console.error('Error exporting bookings:', error);
        await Swal.fire({
            icon: 'error',
            title: 'Export Error',
            text: 'Could not generate PDF. Please try again.',
            confirmButtonText: 'OK'
        });
    }
    finally {
        isExporting.value = false;
    }
};
// ===== BOOKING OPERATIONS =====
/**
 * Show detailed booking information in modal
 * @param booking - Booking object to display
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
 * Show booking status update modal
 * @param booking - Booking to update
 */
const showStatusModal = (booking) => {
    selectedBookingForUpdate.value = booking;
    newStatus.value = booking.status;
    statusReason.value = '';
    showStatusUpdateModal.value = true;
};
/**
 * Close status update modal and reset form
 */
const closeStatusModal = () => {
    showStatusUpdateModal.value = false;
    selectedBookingForUpdate.value = null;
    newStatus.value = 'pending';
    statusReason.value = '';
};
/**
 * Show payment status update modal
 * @param booking - Booking to update payment status
 */
const showPaymentStatusModal = (booking) => {
    selectedBookingForUpdate.value = booking;
    newPaymentStatus.value = booking.paymentStatus;
    showPaymentUpdateModal.value = true;
};
/**
 * Close payment status update modal and reset form
 */
const closePaymentStatusModal = () => {
    showPaymentUpdateModal.value = false;
    selectedBookingForUpdate.value = null;
    newPaymentStatus.value = 'pending';
};
/**
 * Update booking status using host service
 * Includes reason parameter and proper error handling
 */
const updateBookingStatus = async () => {
    if (!selectedBookingForUpdate.value?._id)
        return;
    try {
        isUpdating.value = true;
        // Call API with booking ID, new status, and optional reason
        await updateHostBookingStatus(selectedBookingForUpdate.value._id, newStatus.value, statusReason.value || undefined // Backend expects 'reason' parameter
        );
        // Update local state to reflect changes immediately
        const bookingIndex = allBookings.value.findIndex(b => b._id === selectedBookingForUpdate.value._id);
        if (bookingIndex !== -1) {
            allBookings.value[bookingIndex].status = newStatus.value;
            allBookings.value[bookingIndex].updatedAt = new Date();
        }
        await Swal.fire({
            icon: 'success',
            title: 'Status Updated',
            text: 'The booking status has been updated successfully.',
            confirmButtonText: 'Continue'
        });
        closeStatusModal();
    }
    catch (error) {
        console.error('Error updating booking status:', error);
        await Swal.fire({
            icon: 'error',
            title: 'Update Error',
            text: 'Could not update booking status.',
            confirmButtonText: 'OK'
        });
    }
    finally {
        isUpdating.value = false;
    }
};
/**
 * Update payment status using host service
 * Updates both API and local state
 */
const updatePaymentStatus = async () => {
    if (!selectedBookingForUpdate.value?._id)
        return;
    try {
        isUpdating.value = true;
        // Call API to update payment status
        await updateHostBookingPaymentStatus(selectedBookingForUpdate.value._id, newPaymentStatus.value);
        // Update local state immediately
        const bookingIndex = allBookings.value.findIndex(b => b._id === selectedBookingForUpdate.value._id);
        if (bookingIndex !== -1) {
            allBookings.value[bookingIndex].paymentStatus = newPaymentStatus.value;
            allBookings.value[bookingIndex].updatedAt = new Date();
        }
        await Swal.fire({
            icon: 'success',
            title: 'Payment Updated',
            text: 'The payment status has been updated successfully.',
            confirmButtonText: 'Continue'
        });
        closePaymentStatusModal();
    }
    catch (error) {
        console.error('Error updating payment status:', error);
        await Swal.fire({
            icon: 'error',
            title: 'Update Error',
            text: 'Could not update payment status.',
            confirmButtonText: 'OK'
        });
    }
    finally {
        isUpdating.value = false;
    }
};
// ===== IMAGE MODAL MANAGEMENT =====
/**
 * Open payment image in full-screen modal
 * @param imageUrl - URL of image to display
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
// ===== TYPE GUARDS FOR SAFE PROPERTY ACCESS =====
/**
 * Type guard to check if object has createdAt property
 * @param obj - Object to check
 * @returns Boolean indicating if createdAt exists
 */
const hasCreatedAt = (obj) => {
    return obj && obj.createdAt !== undefined && obj.createdAt !== null;
};
/**
 * Type guard to check if object has updatedAt property
 * @param obj - Object to check
 * @returns Boolean indicating if updatedAt exists
 */
const hasUpdatedAt = (obj) => {
    return obj && obj.updatedAt !== undefined && obj.updatedAt !== null;
};
/**
 * Type guard to check if tourPackage is a populated object
 * @param tourPackage - Tour package to check
 * @returns Boolean indicating if it's a populated object
 */
const isTourPackageObject = (tourPackage) => {
    return tourPackage && typeof tourPackage === 'object' && typeof tourPackage.title === 'string';
};
/**
 * Type guard to check if property is a populated object
 * @param property - Property to check
 * @returns Boolean indicating if it's a populated object
 */
const isPropertyObject = (property) => {
    return property && typeof property === 'object' && typeof property.title === 'string';
};
/**
 * Type guard to check if user is a populated object
 * @param user - User to check
 * @returns Boolean indicating if it's a populated object
 */
const isUserObject = (user) => {
    return user && typeof user === 'object' && typeof user.email === 'string';
};
// ===== UTILITY FUNCTIONS =====
/**
 * Format date for display with proper error handling
 * @param dateString - Date string or Date object to format
 * @returns Formatted date string in Spanish locale
 */
const formatDate = (dateString) => {
    if (!dateString)
        return 'Fecha no disponible';
    try {
        const date = new Date(dateString);
        // Check if date is valid
        if (isNaN(date.getTime())) {
            return 'Fecha inválida';
        }
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
    catch (error) {
        console.error('Error formatting date:', dateString, error);
        return 'Fecha inválida';
    }
};
/**
 * Get guest name safely with fallbacks
 * @param user - User object or ID
 * @returns Formatted guest name
 */
const getGuestName = (user) => {
    if (typeof user === 'string')
        return `ID: ${user}`;
    if (isUserObject(user)) {
        if (user.firstName && user.lastName) {
            return `${user.firstName} ${user.lastName}`;
        }
        if (user.firstName)
            return user.firstName;
        if (user.lastName)
            return user.lastName;
        return user.email.split('@')[0]; // Use email prefix as fallback
    }
    return 'Usuario desconocido';
};
/**
 * Get guest email safely
 * @param user - User object or ID
 * @returns Guest email or fallback message
 */
const getGuestEmail = (user) => {
    if (typeof user === 'string')
        return 'Email no disponible';
    if (isUserObject(user)) {
        return user.email;
    }
    return 'Email no disponible';
};
/**
 * Get guest phone safely
 * @param user - User object or ID
 * @returns Guest phone or fallback message
 */
const getGuestPhone = (user) => {
    if (typeof user === 'string')
        return 'Teléfono no disponible';
    if (isUserObject(user) && user.phone) {
        return user.phone;
    }
    return 'No especificado';
};
/**
 * Get service type (Property or Tour)
 * @param booking - Booking object
 * @returns Service type string
 */
const getServiceType = (booking) => {
    return booking.tourPackage ? 'Tour' : 'Propiedad';
};
/**
 * Get CSS classes for service type badge
 * @param booking - Booking object
 * @returns CSS classes for styling
 */
const getServiceTypeBadge = (booking) => {
    const base = 'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium';
    if (booking.tourPackage) {
        return `${base} bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-200`;
    }
    return `${base} bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200`;
};
/**
 * Get service name safely with type checking
 * @param booking - Booking object
 * @returns Service name or fallback
 */
const getServiceName = (booking) => {
    if (booking.tourPackage) {
        if (isTourPackageObject(booking.tourPackage)) {
            return booking.tourPackage.title;
        }
        return typeof booking.tourPackage === 'string' ? `Tour ID: ${booking.tourPackage}` : 'Tour sin título';
    }
    if (booking.property) {
        if (isPropertyObject(booking.property)) {
            return booking.property.title;
        }
        return typeof booking.property === 'string' ? `Propiedad ID: ${booking.property}` : 'Propiedad sin título';
    }
    return 'Servicio no especificado';
};
/**
 * Get service location safely
 * @param booking - Booking object
 * @returns Service location or empty string for tours
 */
const getServiceLocation = (booking) => {
    if (booking.property) {
        const property = booking.property;
        if (isPropertyObject(property)) {
            return property.city || property.location || 'Ciudad no especificada';
        }
        return 'Ubicación no disponible';
    }
    return ''; // Tours don't have fixed location
};
/**
 * Get service duration for tours - FIXED VERSION
 * @param booking - Booking object
 * @returns Duration string for tours or empty string
 */
const getServiceDuration = (booking) => {
    if (booking.tourPackage) {
        const tour = booking.tourPackage;
        // ✅ FIXED: Changed tour.duration === 'number' to typeof tour.duration === 'number'
        if (isTourPackageObject(tour) && typeof tour.duration === 'number') {
            return `${tour.duration} días`;
        }
    }
    return ''; // Return empty string instead of undefined
};
/**
 * Get user-friendly status label in Spanish
 * @param status - Booking status
 * @returns Spanish status label
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
 * @param status - Booking status
 * @returns CSS classes for styling
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
 * @param status - Payment status
 * @returns Spanish payment status label
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
 * @param status - Payment status
 * @returns CSS classes for styling
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
 * Check if booking status can be updated by host
 * @param status - Current booking status
 * @returns Boolean indicating if status can be updated
 */
const canUpdateStatus = (status) => {
    return status !== 'cancelled' && status !== 'completed';
};
/**
 * Check if payment status can be updated by host
 * @param paymentStatus - Current payment status
 * @returns Boolean indicating if payment status can be updated
 */
const canUpdatePaymentStatus = (paymentStatus) => {
    return paymentStatus !== 'refunded';
};
/**
 * Format currency for display
 * @param amount - Amount to format
 * @returns Formatted currency string
 */
const formatCurrency = (amount) => {
    if (!amount)
        return '$0';
    return `$${amount.toLocaleString()}`;
};
/**
 * Helper functions for safe date formatting in templates
 */
const formatCreatedAt = (booking) => {
    return hasCreatedAt(booking) ? formatDate(booking.createdAt) : 'Fecha no disponible';
};
const formatUpdatedAt = (booking) => {
    return hasUpdatedAt(booking) ? formatDate(booking.updatedAt) : 'Fecha no disponible';
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
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
    'aria-label': "Go back to dashboard",
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
    ...{ class: "flex items-center gap-4 text-sm" },
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
(__VLS_ctx.paidCount);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "bg-purple-100 dark:bg-purple-900/30 px-3 py-1 rounded-lg" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "text-purple-600 dark:text-purple-400 font-medium" },
});
(__VLS_ctx.formatCurrency(__VLS_ctx.totalRevenue));
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
    ...{ class: "flex flex-col lg:flex-row lg:items-end gap-4" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex-1 max-w-xs" },
});
/** @type {[typeof FloatingSelect, ]} */ ;
// @ts-ignore
const __VLS_4 = __VLS_asFunctionalComponent(FloatingSelect, new FloatingSelect({
    id: "payment-status-filter",
    label: "Estado de Pago",
    modelValue: (__VLS_ctx.paymentStatusFilter),
    options: ([
        { value: '', label: 'Todos' },
        { value: 'pending', label: 'Pendientes' },
        { value: 'paid', label: 'Pagado' },
        { value: 'failed', label: 'Fallido' },
        { value: 'refunded', label: 'Reembolsado' }
    ]),
}));
const __VLS_5 = __VLS_4({
    id: "payment-status-filter",
    label: "Estado de Pago",
    modelValue: (__VLS_ctx.paymentStatusFilter),
    options: ([
        { value: '', label: 'Todos' },
        { value: 'pending', label: 'Pendientes' },
        { value: 'paid', label: 'Pagado' },
        { value: 'failed', label: 'Fallido' },
        { value: 'refunded', label: 'Reembolsado' }
    ]),
}, ...__VLS_functionalComponentArgsRest(__VLS_4));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex-1 max-w-xs" },
});
/** @type {[typeof FloatingSelect, ]} */ ;
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent(FloatingSelect, new FloatingSelect({
    id: "booking-status-filter",
    label: "Estado de Reserva",
    modelValue: (__VLS_ctx.bookingStatusFilter),
    options: ([
        { value: '', label: 'Todos' },
        { value: 'pending', label: 'Pendiente' },
        { value: 'confirmed', label: 'Confirmada' },
        { value: 'cancelled', label: 'Cancelada' },
        { value: 'completed', label: 'Completada' }
    ]),
}));
const __VLS_8 = __VLS_7({
    id: "booking-status-filter",
    label: "Estado de Reserva",
    modelValue: (__VLS_ctx.bookingStatusFilter),
    options: ([
        { value: '', label: 'Todos' },
        { value: 'pending', label: 'Pendiente' },
        { value: 'confirmed', label: 'Confirmada' },
        { value: 'cancelled', label: 'Cancelada' },
        { value: 'completed', label: 'Completada' }
    ]),
}, ...__VLS_functionalComponentArgsRest(__VLS_7));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex-1 max-w-xs" },
});
/** @type {[typeof FloatingSelect, ]} */ ;
// @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent(FloatingSelect, new FloatingSelect({
    id: "type-filter",
    label: "Tipo de Servicio",
    modelValue: (__VLS_ctx.typeFilter),
    options: ([
        { value: '', label: 'Todos' },
        { value: 'property', label: 'Propiedades' },
        { value: 'tour', label: 'Tours' }
    ]),
}));
const __VLS_11 = __VLS_10({
    id: "type-filter",
    label: "Tipo de Servicio",
    modelValue: (__VLS_ctx.typeFilter),
    options: ([
        { value: '', label: 'Todos' },
        { value: 'property', label: 'Propiedades' },
        { value: 'tour', label: 'Tours' }
    ]),
}, ...__VLS_functionalComponentArgsRest(__VLS_10));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex gap-2" },
});
if (__VLS_ctx.hasActiveFilters) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.clearFilters) },
        ...{ class: "px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500" },
    });
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (__VLS_ctx.exportPDF) },
    disabled: (__VLS_ctx.isExporting),
    ...{ class: "inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" },
});
const __VLS_13 = {}.DownloadIcon;
/** @type {[typeof __VLS_components.DownloadIcon, ]} */ ;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
    ...{ class: "w-4 h-4" },
}));
const __VLS_15 = __VLS_14({
    ...{ class: "w-4 h-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
(__VLS_ctx.isExporting ? 'Exportando...' : 'Exportar PDF');
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
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "inline-block min-w-full align-middle" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.table, __VLS_intrinsicElements.table)({
        ...{ class: "min-w-full divide-y divide-gray-200 dark:divide-gray-700" },
        role: "table",
        'aria-label': "Host bookings table",
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
            ...{ class: ({
                    'bg-green-50 dark:bg-green-900/10': booking.paymentStatus === 'paid',
                    'bg-yellow-50 dark:bg-yellow-900/10': booking.status === 'pending'
                }) },
        });
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
        const __VLS_17 = {}.UserIcon;
        /** @type {[typeof __VLS_components.UserIcon, ]} */ ;
        // @ts-ignore
        const __VLS_18 = __VLS_asFunctionalComponent(__VLS_17, new __VLS_17({
            ...{ class: "w-4 h-4 text-blue-600 dark:text-blue-400" },
        }));
        const __VLS_19 = __VLS_18({
            ...{ class: "w-4 h-4 text-blue-600 dark:text-blue-400" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_18));
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
        (booking._id?.slice(-8).toUpperCase());
        __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({
            ...{ class: "px-6 py-4" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "flex items-center space-x-2 mb-1" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: (__VLS_ctx.getServiceTypeBadge(booking)) },
        });
        (__VLS_ctx.getServiceType(booking));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "text-sm font-medium text-gray-900 dark:text-white truncate" },
        });
        (__VLS_ctx.getServiceName(booking));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({
            ...{ class: "px-6 py-4 whitespace-nowrap" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "text-sm text-gray-900 dark:text-white" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "flex items-center" },
        });
        const __VLS_21 = {}.CalendarIcon;
        /** @type {[typeof __VLS_components.CalendarIcon, ]} */ ;
        // @ts-ignore
        const __VLS_22 = __VLS_asFunctionalComponent(__VLS_21, new __VLS_21({
            ...{ class: "w-4 h-4 mr-1 text-gray-400" },
        }));
        const __VLS_23 = __VLS_22({
            ...{ class: "w-4 h-4 mr-1 text-gray-400" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_22));
        (__VLS_ctx.formatDate(booking.checkIn));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "flex items-center mt-1" },
        });
        const __VLS_25 = {}.ArrowRightIcon;
        /** @type {[typeof __VLS_components.ArrowRightIcon, ]} */ ;
        // @ts-ignore
        const __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({
            ...{ class: "w-4 h-4 mr-1 text-gray-400" },
        }));
        const __VLS_27 = __VLS_26({
            ...{ class: "w-4 h-4 mr-1 text-gray-400" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_26));
        (__VLS_ctx.formatDate(booking.checkOut));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({
            ...{ class: "px-6 py-4 whitespace-nowrap" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "flex items-center text-sm text-gray-900 dark:text-white" },
        });
        const __VLS_29 = {}.UsersIcon;
        /** @type {[typeof __VLS_components.UsersIcon, ]} */ ;
        // @ts-ignore
        const __VLS_30 = __VLS_asFunctionalComponent(__VLS_29, new __VLS_29({
            ...{ class: "w-4 h-4 mr-1 text-gray-400" },
        }));
        const __VLS_31 = __VLS_30({
            ...{ class: "w-4 h-4 mr-1 text-gray-400" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_30));
        (booking.guests);
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
            'aria-label': (`View booking details for ${booking._id}`),
        });
        const __VLS_33 = {}.EyeIcon;
        /** @type {[typeof __VLS_components.EyeIcon, ]} */ ;
        // @ts-ignore
        const __VLS_34 = __VLS_asFunctionalComponent(__VLS_33, new __VLS_33({
            ...{ class: "w-4 h-4 mr-1" },
        }));
        const __VLS_35 = __VLS_34({
            ...{ class: "w-4 h-4 mr-1" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_34));
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
                disabled: (__VLS_ctx.isUpdating && __VLS_ctx.selectedBookingForUpdate?._id === booking._id),
                ...{ class: "inline-flex items-center text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition-colors focus:outline-none focus:underline text-sm disabled:opacity-50" },
                'aria-label': (`Update payment status for booking ${booking._id}`),
            });
            const __VLS_37 = {}.CreditCardIcon;
            /** @type {[typeof __VLS_components.CreditCardIcon, ]} */ ;
            // @ts-ignore
            const __VLS_38 = __VLS_asFunctionalComponent(__VLS_37, new __VLS_37({
                ...{ class: "w-4 h-4 mr-1" },
            }));
            const __VLS_39 = __VLS_38({
                ...{ class: "w-4 h-4 mr-1" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_38));
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
                disabled: (__VLS_ctx.isUpdating && __VLS_ctx.selectedBookingForUpdate?._id === booking._id),
                ...{ class: "inline-flex items-center text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-colors focus:outline-none focus:underline text-sm disabled:opacity-50" },
                'aria-label': (`Update booking status for ${booking._id}`),
            });
            const __VLS_41 = {}.EditIcon;
            /** @type {[typeof __VLS_components.EditIcon, ]} */ ;
            // @ts-ignore
            const __VLS_42 = __VLS_asFunctionalComponent(__VLS_41, new __VLS_41({
                ...{ class: "w-4 h-4 mr-1" },
            }));
            const __VLS_43 = __VLS_42({
                ...{ class: "w-4 h-4 mr-1" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_42));
        }
    }
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "text-center py-12" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4" },
    });
    const __VLS_45 = {}.CalendarIcon;
    /** @type {[typeof __VLS_components.CalendarIcon, ]} */ ;
    // @ts-ignore
    const __VLS_46 = __VLS_asFunctionalComponent(__VLS_45, new __VLS_45({
        ...{ class: "w-12 h-12 text-gray-400" },
    }));
    const __VLS_47 = __VLS_46({
        ...{ class: "w-12 h-12 text-gray-400" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_46));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
        ...{ class: "text-lg font-medium text-gray-900 dark:text-white mb-2" },
    });
    (__VLS_ctx.hasActiveFilters ? 'No se encontraron reservas' : 'No tienes reservas aún');
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto" },
    });
    (__VLS_ctx.hasActiveFilters
        ? 'Ninguna reserva coincide con los filtros actuales. Intenta cambiar los criterios de búsqueda.'
        : 'Cuando recibas reservas para tus propiedades y tours, aparecerán aquí.');
    if (__VLS_ctx.hasActiveFilters) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (__VLS_ctx.clearFilters) },
            ...{ class: "inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500" },
        });
    }
}
if (__VLS_ctx.showStatusUpdateModal) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ onClick: (__VLS_ctx.closeStatusModal) },
        ...{ onKeydown: (__VLS_ctx.closeStatusModal) },
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
    const __VLS_49 = __VLS_asFunctionalComponent(FloatingSelect, new FloatingSelect({
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
    const __VLS_50 = __VLS_49({
        id: "new-status",
        label: "Nuevo Estado",
        modelValue: (__VLS_ctx.newStatus),
        options: ([
            { value: 'pending', label: 'Pendiente' },
            { value: 'confirmed', label: 'Confirmada' },
            { value: 'cancelled', label: 'Cancelada' },
            { value: 'completed', label: 'Completada' }
        ]),
    }, ...__VLS_functionalComponentArgsRest(__VLS_49));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    /** @type {[typeof FloatingInput, ]} */ ;
    // @ts-ignore
    const __VLS_52 = __VLS_asFunctionalComponent(FloatingInput, new FloatingInput({
        id: "status-reason",
        label: "Razón (opcional)",
        type: "text",
        placeholder: "Motivo del cambio de estado...",
        modelValue: (__VLS_ctx.statusReason),
    }));
    const __VLS_53 = __VLS_52({
        id: "status-reason",
        label: "Razón (opcional)",
        type: "text",
        placeholder: "Motivo del cambio de estado...",
        modelValue: (__VLS_ctx.statusReason),
    }, ...__VLS_functionalComponentArgsRest(__VLS_52));
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
        ...{ onClick: (__VLS_ctx.closePaymentStatusModal) },
        ...{ onKeydown: (__VLS_ctx.closePaymentStatusModal) },
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
    const __VLS_55 = __VLS_asFunctionalComponent(FloatingSelect, new FloatingSelect({
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
    const __VLS_56 = __VLS_55({
        id: "new-payment-status",
        label: "Nuevo Estado de Pago",
        modelValue: (__VLS_ctx.newPaymentStatus),
        options: ([
            { value: 'pending', label: 'Pendiente' },
            { value: 'paid', label: 'Pagado' },
            { value: 'failed', label: 'Fallido' },
            { value: 'refunded', label: 'Reembolsado' }
        ]),
    }, ...__VLS_functionalComponentArgsRest(__VLS_55));
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
        ...{ onClick: (__VLS_ctx.closeBookingDetails) },
        ...{ onKeydown: (__VLS_ctx.closeBookingDetails) },
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
    const __VLS_58 = {}.XIcon;
    /** @type {[typeof __VLS_components.XIcon, ]} */ ;
    // @ts-ignore
    const __VLS_59 = __VLS_asFunctionalComponent(__VLS_58, new __VLS_58({
        ...{ class: "w-6 h-6" },
    }));
    const __VLS_60 = __VLS_59({
        ...{ class: "w-6 h-6" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_59));
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
    (__VLS_ctx.getGuestPhone(__VLS_ctx.selectedBooking.user));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "font-medium" },
    });
    (__VLS_ctx.selectedBooking.guests);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)({
        ...{ class: "text-lg font-medium text-gray-900 dark:text-white mb-3" },
    });
    (__VLS_ctx.getServiceType(__VLS_ctx.selectedBooking));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "font-medium" },
    });
    (__VLS_ctx.getServiceName(__VLS_ctx.selectedBooking));
    if (__VLS_ctx.getServiceLocation(__VLS_ctx.selectedBooking)) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "font-medium" },
        });
        (__VLS_ctx.getServiceLocation(__VLS_ctx.selectedBooking));
    }
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
    (__VLS_ctx.formatDate(__VLS_ctx.selectedBooking.checkIn));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "font-medium" },
    });
    (__VLS_ctx.formatDate(__VLS_ctx.selectedBooking.checkOut));
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
    (__VLS_ctx.formatCreatedAt(__VLS_ctx.selectedBooking));
    if (__VLS_ctx.hasUpdatedAt(__VLS_ctx.selectedBooking)) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "font-medium" },
        });
        (__VLS_ctx.formatUpdatedAt(__VLS_ctx.selectedBooking));
    }
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
                alt: (`Payment proof ${index + 1}`),
                ...{ class: "w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity" },
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
        ...{ onKeydown: (__VLS_ctx.closeImageModal) },
        ...{ class: "fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-[60]" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "max-w-4xl max-h-full" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
        src: (__VLS_ctx.selectedImage),
        alt: "Payment proof document",
        ...{ class: "max-w-full max-h-full object-contain rounded-lg" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.closeImageModal) },
        ...{ class: "absolute top-4 right-4 w-10 h-10 bg-white bg-opacity-20 text-white rounded-full hover:bg-opacity-30 focus:outline-none transition-colors flex items-center justify-center" },
        'aria-label': "Close image viewer",
    });
    const __VLS_62 = {}.XIcon;
    /** @type {[typeof __VLS_components.XIcon, ]} */ ;
    // @ts-ignore
    const __VLS_63 = __VLS_asFunctionalComponent(__VLS_62, new __VLS_62({
        ...{ class: "w-6 h-6" },
    }));
    const __VLS_64 = __VLS_63({
        ...{ class: "w-6 h-6" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_63));
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
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:flex-row']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:items-end']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-100']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:hover:bg-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-2']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['inline-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
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
/** @type {__VLS_StyleScopedClasses['inline-block']} */ ;
/** @type {__VLS_StyleScopedClasses['min-w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['align-middle']} */ ;
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
/** @type {__VLS_StyleScopedClasses['bg-green-50']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-green-900/10']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-yellow-50']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-yellow-900/10']} */ ;
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
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['space-x-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-white']} */ ;
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
/** @type {__VLS_StyleScopedClasses['px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['py-4']} */ ;
/** @type {__VLS_StyleScopedClasses['whitespace-nowrap']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
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
/** @type {__VLS_StyleScopedClasses['disabled:opacity-50']} */ ;
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
/** @type {__VLS_StyleScopedClasses['disabled:opacity-50']} */ ;
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
/** @type {__VLS_StyleScopedClasses['inline-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-blue-600']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-blue-700']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-2']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-blue-500']} */ ;
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
/** @type {__VLS_StyleScopedClasses['transition-opacity']} */ ;
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
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['top-4']} */ ;
/** @type {__VLS_StyleScopedClasses['right-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-10']} */ ;
/** @type {__VLS_StyleScopedClasses['h-10']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-opacity-20']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-opacity-30']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['w-6']} */ ;
/** @type {__VLS_StyleScopedClasses['h-6']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            FloatingInput: FloatingInput,
            FloatingSelect: FloatingSelect,
            ArrowLeftIcon: ArrowLeftIcon,
            CalendarIcon: CalendarIcon,
            UserIcon: UserIcon,
            UsersIcon: UsersIcon,
            EyeIcon: EyeIcon,
            EditIcon: EditIcon,
            XIcon: XIcon,
            ArrowRightIcon: ArrowRightIcon,
            DownloadIcon: DownloadIcon,
            CreditCardIcon: CreditCardIcon,
            goBack: goBack,
            isLoading: isLoading,
            isUpdating: isUpdating,
            isExporting: isExporting,
            showStatusUpdateModal: showStatusUpdateModal,
            showPaymentUpdateModal: showPaymentUpdateModal,
            selectedBooking: selectedBooking,
            selectedBookingForUpdate: selectedBookingForUpdate,
            selectedImage: selectedImage,
            paymentStatusFilter: paymentStatusFilter,
            bookingStatusFilter: bookingStatusFilter,
            typeFilter: typeFilter,
            newStatus: newStatus,
            newPaymentStatus: newPaymentStatus,
            statusReason: statusReason,
            filteredBookings: filteredBookings,
            paidCount: paidCount,
            hasActiveFilters: hasActiveFilters,
            totalRevenue: totalRevenue,
            clearFilters: clearFilters,
            exportPDF: exportPDF,
            viewBookingDetails: viewBookingDetails,
            closeBookingDetails: closeBookingDetails,
            showStatusModal: showStatusModal,
            closeStatusModal: closeStatusModal,
            showPaymentStatusModal: showPaymentStatusModal,
            closePaymentStatusModal: closePaymentStatusModal,
            updateBookingStatus: updateBookingStatus,
            updatePaymentStatus: updatePaymentStatus,
            openImageModal: openImageModal,
            closeImageModal: closeImageModal,
            hasUpdatedAt: hasUpdatedAt,
            formatDate: formatDate,
            getGuestName: getGuestName,
            getGuestEmail: getGuestEmail,
            getGuestPhone: getGuestPhone,
            getServiceType: getServiceType,
            getServiceTypeBadge: getServiceTypeBadge,
            getServiceName: getServiceName,
            getServiceLocation: getServiceLocation,
            getServiceDuration: getServiceDuration,
            getStatusLabel: getStatusLabel,
            getStatusBadge: getStatusBadge,
            getPaymentStatusLabel: getPaymentStatusLabel,
            getPaymentStatusBadge: getPaymentStatusBadge,
            canUpdateStatus: canUpdateStatus,
            canUpdatePaymentStatus: canUpdatePaymentStatus,
            formatCurrency: formatCurrency,
            formatCreatedAt: formatCreatedAt,
            formatUpdatedAt: formatUpdatedAt,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=HostBookingView.vue.js.map