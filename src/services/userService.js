import axios from 'axios';
/**
 * Base URL for admin user operations.
 */
const API_URL = `${import.meta.env.VITE_API_BASE_URL}/admin/users`;
const PROFILE_URL = `${import.meta.env.VITE_API_BASE_URL}/users`;
/**
 * Returns auth headers using the JWT stored in sessionStorage (primary)
 * or localStorage (fallback). This is aligned with useAuth, which stores
 * the token under `sessionStorage.setItem('token', token)`.
 */
const authHeaders = () => {
    // Try sessionStorage first (used by useAuth)
    const tokenFromSession = sessionStorage.getItem('token');
    // Fallback to localStorage just in case (optional)
    const token = tokenFromSession || localStorage.getItem('token');
    if (!token) {
        console.warn('⚠️ No auth token found in storage');
        return {};
    }
    return { Authorization: `Bearer ${token}` };
};
/**
 * Fetch all users (admin only).
 * @returns Promise resolving to a list of User objects.
 */
export const getAllUsers = async () => {
    try {
        const headers = authHeaders();
        // If no Authorization header, the session is likely expired
        if (!('Authorization' in headers)) {
            throw new Error('Your session has expired. Please log in again.');
        }
        const response = await axios.get(API_URL, {
            headers
        });
        console.log('getAllUsers response:', response.data);
        // Handle the expected response format: {message: '...', users: User[]}
        if (response.data && response.data.users && Array.isArray(response.data.users)) {
            return response.data.users;
        }
        console.error('Unexpected response format:', response.data);
        return [];
    }
    catch (error) {
        console.error('Error fetching users:', error);
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 403) {
                throw new Error('No tienes permisos para acceder a esta información');
            }
            else if (error.response?.status === 401) {
                throw new Error('Tu sesión ha expirado, por favor inicia sesión nuevamente');
            }
            else if (error.response?.status === 500) {
                throw new Error('Error interno del servidor');
            }
        }
        throw error;
    }
};
/**
 * Create a new user (admin only).
 * For role 'host', the backend uses a specific endpoint for host registration.
 * @param userData Data required to create a user.
 * @returns The newly created user.
 */
export const createUser = async (userData) => {
    try {
        const headers = authHeaders();
        // Use the general user creation endpoint for all users
        const endpoint = API_URL; // Always use /api/admin/users for creating any user
        console.log('Creating user with data:', JSON.stringify(userData, null, 2));
        console.log('Using endpoint:', endpoint);
        console.log('Headers:', JSON.stringify(headers, null, 2));
        console.log('Data keys:', Object.keys(userData));
        console.log('Data values:', Object.values(userData));
        const response = await axios.post(endpoint, userData, { headers });
        console.log('createUser response:', response.data);
        // Handle the expected response format: {message: '...', user: User}
        if (response.data && response.data.user && '_id' in response.data.user) {
            return response.data.user;
        }
        throw new Error('Invalid response format from server');
    }
    catch (error) {
        console.error('Error creating user:', error);
        if (axios.isAxiosError(error)) {
            console.log('Error response:', JSON.stringify(error.response?.data, null, 2));
            console.log('Error status:', error.response?.status);
            console.log('Error headers:', JSON.stringify(error.response?.headers, null, 2));
            if (error.response?.status === 403) {
                throw new Error('No tienes permisos para crear usuarios');
            }
            else if (error.response?.status === 401) {
                throw new Error('Tu sesión ha expirado, por favor inicia sesión nuevamente');
            }
            else if (error.response?.status === 500) {
                const errorData = error.response?.data;
                let errorMessage = 'Error interno del servidor';
                if (errorData?.message) {
                    errorMessage = errorData.message;
                }
                else if (errorData?.error) {
                    errorMessage = errorData.error;
                }
                throw new Error(`Error del servidor: ${errorMessage}`);
            }
            else if (error.response?.status === 400) {
                const errorData = error.response?.data;
                let errorMessage = 'Datos inválidos';
                if (errorData?.message) {
                    errorMessage = errorData.message;
                }
                else if (errorData?.error) {
                    errorMessage = errorData.error;
                }
                else if (errorData?.errors) {
                    errorMessage = Object.values(errorData.errors).join(', ');
                }
                throw new Error(`Error de validación: ${errorMessage}`);
            }
        }
        throw error;
    }
};
/**
 * Update an existing user by ID.
 * Email and ID are immutable and should not be updated.
 * @param userId ID of the user to update.
 * @param updatedData Partial user data to update.
 * @returns The updated user object.
 */
export const updateUserById = async (userId, updatedData) => {
    try {
        console.log('Updating user with ID:', userId);
        console.log('Update data:', JSON.stringify(updatedData, null, 2));
        console.log('Update endpoint:', `${API_URL}/${userId}`);
        const response = await axios.patch(`${API_URL}/${userId}`, updatedData, { headers: authHeaders() });
        console.log('Update response:', JSON.stringify(response.data, null, 2));
        // Handle the expected response format: {message: '...', user: User}
        if (response.data && response.data.user && '_id' in response.data.user) {
            return response.data.user;
        }
        throw new Error('Invalid response format from server');
    }
    catch (error) {
        console.error('Error updating user:', error);
        if (axios.isAxiosError(error)) {
            console.log('Update error response:', JSON.stringify(error.response?.data, null, 2));
            console.log('Update error status:', error.response?.status);
            if (error.response?.status === 403) {
                throw new Error('No tienes permisos para actualizar usuarios');
            }
            else if (error.response?.status === 401) {
                throw new Error('Tu sesión ha expirado, por favor inicia sesión nuevamente');
            }
            else if (error.response?.status === 500) {
                const errorMessage = error.response?.data?.message || 'Error interno del servidor';
                throw new Error(`Error del servidor: ${errorMessage}`);
            }
            else if (error.response?.status === 400) {
                const errorMessage = error.response?.data?.message || 'Datos inválidos';
                throw new Error(`Error de validación: ${errorMessage}`);
            }
        }
        throw error;
    }
};
/**
 * Delete a user by their ID.
 * @param userId User's ID to delete.
 * @returns Promise resolving to void on success.
 */
export const deleteUser = async (userId) => {
    try {
        await axios.delete(`${API_URL}/${userId}`, {
            headers: authHeaders()
        });
    }
    catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
};
/**
 * Update the profile of the currently logged-in user.
 * Route: PATCH /users/profile (authenticated user only).
 * @param data Fields allowed to update from frontend (e.g., profile).
 * @returns The updated user object.
 */
export const updateProfileService = async (data) => {
    try {
        console.log('Updating profile with data:', JSON.stringify(data, null, 2));
        const response = await axios.patch(`${PROFILE_URL}/profile`, data, { headers: authHeaders() });
        console.log('Profile update response:', response.data);
        // Handle different possible response formats from your existing backend
        if (response.data?.data?.user) {
            return response.data.data.user;
        }
        else if (response.data?.user) {
            return response.data.user;
        }
        else if (response.data?._id) {
            return response.data;
        }
        throw new Error('Invalid response format from server');
    }
    catch (error) {
        console.error('Error updating profile:', error);
        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                'Error actualizando perfil';
            throw new Error(errorMessage);
        }
        throw error;
    }
};
//# sourceMappingURL=userService.js.map