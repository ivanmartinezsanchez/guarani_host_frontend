import axios from 'axios'

const API_URL = 'http://localhost:4000/api/uploads'

/**
 * Deletes an image from Cloudinary by its public_id.
 * Requires authentication token in localStorage.
 * @param publicId - Cloudinary public_id of the image to delete
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
