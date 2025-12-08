import axios from 'axios';
/**
 * Admin/Host property management service - Requires authentication.
 * Used in: AdminPropertyManagement, HostPropertyManagement.
 */
const ADMIN_API_URL = `${import.meta.env.VITE_API_BASE_URL}/admin`;
const HOST_API_URL = `${import.meta.env.VITE_API_BASE_URL}/host`;
/**
 * Generates the Authorization header using JWT stored in sessionStorage (primary)
 * or localStorage (fallback, for compatibility).
 */
const getAuthHeaders = () => {
    const tokenFromSession = sessionStorage.getItem('token') ||
        sessionStorage.getItem('accessToken') ||
        sessionStorage.getItem('authToken');
    const tokenFromLocal = localStorage.getItem('token') ||
        localStorage.getItem('accessToken') ||
        localStorage.getItem('authToken');
    const token = tokenFromSession || tokenFromLocal;
    if (!token) {
        console.warn('⚠️ No authentication token found in storage');
        return { headers: {} };
    }
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};
/**
 * Retrieves logged user and checks if they are an admin.
 * Reads sessionStorage first (main source used by login).
 */
const getUserInfo = () => {
    const rawUser = sessionStorage.getItem('user') ||
        localStorage.getItem('user') || // Compatibility fallback
        '{}';
    let user;
    try {
        user = JSON.parse(rawUser);
    }
    catch {
        user = {};
    }
    return {
        user,
        isAdmin: user.role === 'admin',
    };
};
/**
 * Fetch all properties for the logged-in admin or host.
 */
export const getProperties = async () => {
    try {
        const { isAdmin } = getUserInfo();
        const endpoint = isAdmin
            ? `${ADMIN_API_URL}/properties`
            : `${HOST_API_URL}/properties`;
        const res = await axios.get(endpoint, getAuthHeaders());
        console.log('✅ getProperties response:', res.data);
        return res.data.properties || res.data || [];
    }
    catch (error) {
        console.error('❌ Error fetching properties:', error);
        throw new Error('No se pudieron cargar las propiedades');
    }
};
/**
 * Create a new property.
 * Admins create properties for hosts; hosts create their own.
 */
export const createProperty = async (formData) => {
    try {
        const { isAdmin } = getUserInfo();
        const endpoint = isAdmin
            ? `${ADMIN_API_URL}/properties`
            : `${HOST_API_URL}/properties`;
        const auth = getAuthHeaders();
        const res = await axios.post(endpoint, formData, {
            ...auth,
            headers: {
                ...auth.headers,
                'Content-Type': 'multipart/form-data',
            },
        });
        return res.data.property || res.data;
    }
    catch (error) {
        const serverMessage = error.response?.data?.message || error.response?.data?.error;
        if (serverMessage) {
            throw new Error(`Error del servidor: ${serverMessage}`);
        }
        if (error.request) {
            throw new Error('No se recibió respuesta del servidor');
        }
        throw new Error('No se pudo crear la propiedad');
    }
};
/**
 * Update an existing property by ID.
 */
export const updateProperty = async (id, formData) => {
    try {
        const { isAdmin } = getUserInfo();
        const endpoint = isAdmin
            ? `${ADMIN_API_URL}/properties/${id}`
            : `${HOST_API_URL}/properties/${id}`;
        const auth = getAuthHeaders();
        const res = await axios.patch(endpoint, formData, {
            ...auth,
            headers: {
                ...auth.headers,
                'Content-Type': 'multipart/form-data',
            },
        });
        return res.data.property || res.data;
    }
    catch (error) {
        throw new Error('No se pudo actualizar la propiedad');
    }
};
/**
 * Delete a property by ID.
 */
export const deleteProperty = async (id) => {
    try {
        const { isAdmin } = getUserInfo();
        const endpoint = isAdmin
            ? `${ADMIN_API_URL}/properties/${id}`
            : `${HOST_API_URL}/properties/${id}`;
        await axios.delete(endpoint, getAuthHeaders());
    }
    catch (error) {
        throw new Error('No se pudo eliminar la propiedad');
    }
};
/**
 * Retrieve a property by ID (for editing).
 */
export const getPropertyById = async (id) => {
    try {
        const { isAdmin } = getUserInfo();
        const endpoint = isAdmin
            ? `${ADMIN_API_URL}/properties/${id}`
            : `${HOST_API_URL}/properties/${id}`;
        const res = await axios.get(endpoint, getAuthHeaders());
        return res.data.property || res.data || null;
    }
    catch (error) {
        return null;
    }
};
//# sourceMappingURL=propertyService.js.map