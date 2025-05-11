/**
 * Uploads an array of image files to Cloudinary and returns their secure URLs.
 * @param files - Array of image files to upload
 * @returns Promise<string[]> - List of secure Cloudinary URLs
 */
export async function uploadImagesToCloudinary(files: File[]): Promise<string[]> {
  const urls: string[] = []

  // These values should be set in your frontend .env file:
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME

  if (!uploadPreset || !cloudName) {
    throw new Error("Cloudinary config is missing in environment variables")
  }

  for (const file of files) {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", uploadPreset)

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json()
      console.error("❌ Cloudinary upload error:", error)
      throw new Error(error.error?.message || "Upload failed")
    }

    const data = await response.json()
    urls.push(data.secure_url)
  }

  return urls
}
