/**
 * @file formDataHelpers.ts
 * @description Utility functions to convert property objects into FormData format for image upload,
 *              and to format dates for input fields and display. Used in create/edit views.
 * @created 2025-05-27
 */

/**
 * Converts a property object and optional images to FormData for backend submission.
 * Ensures arrays are serialized, dates are ISO strings, and images are appended.
 *
 * @param property - Property data matching backend model
 * @param images - Optional list of File objects from <input type="file">
 * @returns FormData for multipart/form-data submission
 */
export const propertyToFormData = (
  property: Record<string, any>,
  images: File[] = []
): FormData => {
  const formData = new FormData()

  for (const [key, value] of Object.entries(property)) {
    if (value === undefined || value === null) continue

    if (Array.isArray(value)) {
      // Append each item as a separate entry for arrays
      for (const item of value) {
        formData.append(key, String(item))
      }
    } else if (
      key === 'checkIn' ||
      key === 'checkOut'
    ) {
      // Expecting yyyy-MM-dd string, send directly
      formData.append(key, value)
    } else {
      formData.append(key, String(value))
    }
  }

  for (const file of images) {
    formData.append('images', file)
  }

  return formData
}

/**
 * Converts a Date or ISO string to 'yyyy-MM-dd' for use in <input type="date">
 */
export const formatDateInput = (date: Date | string): string =>
  new Date(date).toISOString().split('T')[0]

/**
 * Converts a Date or ISO string into a localized readable format (e.g., "May 28, 2025")
 */
export const formatDate = (date: Date | string): string =>
  new Date(date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
