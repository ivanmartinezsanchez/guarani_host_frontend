/**
 * @file bookingToFormData.ts
 * @description Converts a booking object and payment images to FormData for backend submission.
 * @created 2025-05-28
 */

/**
 * Converts a booking object and payment images to FormData for backend submission.
 * Ensures dates are formatted correctly and arrays are serialized.
 *
 * @param booking - Booking object (with checkIn/checkOut as Date or string)
 * @param images - Array of File objects from input[type="file"]
 * @returns FormData for multipart/form-data request
 */
export const bookingToFormData = (
  booking: Record<string, any>,
  images: File[] = []
): FormData => {
  const formData = new FormData()

  for (const [key, value] of Object.entries(booking)) {
    if (value === undefined || value === null) continue

    if (Array.isArray(value)) {
      for (const item of value) {
        formData.append(key, String(item))
      }
    } else if (key === 'checkIn' || key === 'checkOut') {
      // Ensure ISO string for date values
      const isoDate = new Date(value).toISOString()
      formData.append(key, isoDate)
    } else {
      formData.append(key, String(value))
    }
  }

  // Append all selected images for payment evidence
  for (const file of images) {
    formData.append('paymentImages', file)
  }

  return formData
}
