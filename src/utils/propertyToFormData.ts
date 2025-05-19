/**
 * Converts a property object and optional image files into FormData
 */
export function propertyToFormData(property: Record<string, any>, images: File[] = []): FormData {
  const formData = new FormData()

  // Append fields
  for (const key in property) {
    if (property[key] !== undefined && property[key] !== null) {
      formData.append(key, property[key])
    }
  }

  // Append image files
  images.forEach((file) => formData.append('images', file))

  return formData
}
