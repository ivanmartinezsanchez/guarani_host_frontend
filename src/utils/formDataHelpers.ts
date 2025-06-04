/**
 * @file formDataHelpers.ts
 * @description Utility functions to convert property, booking, and tour objects into FormData format for backend submission,
 *              and to format dates for input fields and display. Used in create/edit views across the platform.
 * @created 2025-05-30
 */

/**
 * Converts a property object and optional images to FormData for backend submission.
 * Ensures arrays are serialized, dates are preserved, and images are appended in order.
 *
 * @param property - Property object matching backend schema.
 * @param images - Optional array of File objects from input[type="file"].
 * @returns FormData for multipart/form-data submission.
 */
export const propertyToFormData = (
  property: Record<string, any>,
  images: File[] = []
): FormData => {
  const formData = new FormData()

  for (const [key, value] of Object.entries(property)) {
    if (value === undefined || value === null) continue

    if (Array.isArray(value)) {
      value.forEach(item => formData.append(key, String(item)))
    } else if (key === 'checkIn' || key === 'checkOut') {
      const isoDate = new Date(value).toISOString()
      formData.append(key, isoDate)
    } else if (typeof value === 'object' && value._id) {
      formData.append(key, value._id) // Handle host object
    } else {
      formData.append(key, String(value))
    }
  }

  images.forEach(file => formData.append('images', file))

  return formData
}

/**
 * Converts a booking object and optional payment images to FormData.
 * Ensures dates are formatted as ISO strings and arrays are serialized.
 *
 * @param booking - Booking data with checkIn/checkOut and optional extras.
 * @param images - Optional array of File objects from input[type="file"].
 * @returns FormData for multipart/form-data submission.
 */
export const bookingToFormData = (
  booking: Record<string, any>,
  images: File[] = []
): FormData => {
  const formData = new FormData()

  for (const [key, value] of Object.entries(booking)) {
    if (value === undefined || value === null) continue

    if (Array.isArray(value)) {
      value.forEach(item => formData.append(key, String(item)))
    } else if (key === 'checkIn' || key === 'checkOut') {
      const isoDate = new Date(value).toISOString()
      formData.append(key, isoDate)
    } else if (typeof value === 'object' && value._id) {
      formData.append(key, value._id) // Handle nested user/tour/property
    } else {
      formData.append(key, String(value))
    }
  }

  images.forEach(file => formData.append('paymentImages', file))

  return formData
}

/**
 * Converts a tour object and optional images to FormData.
 * All fields are stringified and images appended.
 *
 * @param tour - Tour package data.
 * @param images - Optional array of File objects.
 * @returns FormData formatted for backend API.
 */
export const tourToFormData = (
  tour: Record<string, any>,
  images: File[] = []
): FormData => {
  const formData = new FormData()

  for (const [key, value] of Object.entries(tour)) {
    if (value === undefined || value === null) continue

    if (Array.isArray(value)) {
      value.forEach(item => formData.append(key, String(item)))
    } else if (typeof value === 'object' && value._id) {
      formData.append(key, value._id)
    } else {
      formData.append(key, String(value))
    }
  }

  images.forEach(file => formData.append('images', file))

  return formData
}

/**
 * Formats a Date or ISO string into 'yyyy-MM-dd' for input[type="date"] compatibility.
 *
 * @param date - Date object or ISO string.
 * @returns String in 'yyyy-MM-dd' format.
 */
export const formatDateInput = (date: Date | string): string =>
  new Date(date).toISOString().split('T')[0]

/**
 * Formats a date into a readable localized format (e.g. "30 de mayo de 2025").
 *
 * @param date - Date or ISO string.
 * @returns Localized date string.
 */
export const formatDate = (date: Date | string): string =>
  new Date(date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
