import axios from 'axios'

const API_URL = 'http://localhost:4000/api/uploads'

/**
 * Deletes an image from Cloudinary using its public_id.
 * Requires a valid JWT token stored in localStorage.
 *
 * @param publicId - The public_id of the image to delete from Cloudinary
 * @returns An object containing a success message and the result from Cloudinary
 * @throws Error if token is missing or request fails
 */
export const deleteImage = async (publicId: string): Promise<{ message: string; result: any }> => {
  const token = localStorage.getItem('token')
  if (!token) throw new Error('❗ Unauthorized: Token not found')

  const response = await axios.delete(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    data: { public_id: publicId }
  })

  return response.data
}
