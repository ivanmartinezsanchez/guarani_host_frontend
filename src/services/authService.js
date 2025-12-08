import axios from 'axios';
const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/auth`;
/**
 * Returns the Authorization headers using JWT from sessionStorage.
 * sessionStorage clears automatically when browser tab closes.
 */
const authHeaders = () => {
    const token = sessionStorage.getItem('token');
    if (!token)
        throw new Error('❌ No token found in sessionStorage');
    return { Authorization: `Bearer ${token}` };
};
/**
 * Login user and store token in sessionStorage.
 * sessionStorage ensures the session expires upon closing the browser.
 */
export async function loginUser(credentials) {
    try {
        const cleanEmail = credentials.email.trim();
        const cleanPassword = credentials.password.trim();
        const response = await axios.post(`${API_URL}/login`, {
            email: cleanEmail,
            password: cleanPassword,
        });
        const { token, user } = response.data;
        // Save to sessionStorage (NOT localStorage)
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('user', JSON.stringify(user));
        return { token, user };
    }
    catch (error) {
        const message = error?.response?.data?.message ||
            error?.message ||
            'Login failed. Please try again.';
        throw new Error(message);
    }
}
/**
 * Register a new user and store session token.
 */
export async function registerUser(userData) {
    const response = await axios.post(`${API_URL}/register`, userData);
    const { token, user } = response.data;
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('user', JSON.stringify(user));
    return { token, user };
}
/**
 * Fetch logged user's profile.
 * Automatically attaches session token.
 */
export async function getUserProfile() {
    const response = await axios.get(`${API_URL}/profile`, {
        headers: authHeaders(),
    });
    return response.data;
}
/**
 * Update logged user's profile.
 */
export async function updateUserProfile(updatedData) {
    const response = await axios.put(`${API_URL}/profile`, updatedData, {
        headers: authHeaders(),
    });
    return response.data;
}
/**
 * 🔥 AXIOS INTERCEPTOR
 * Automatically logs out user when token expires.
 */
axios.interceptors.response.use((response) => response, (error) => {
    const code = error?.response?.data?.code;
    if (code === 'TOKEN_EXPIRED') {
        console.warn('⏰ Session expired. Logging out...');
        // Clear session
        sessionStorage.clear();
        // Redirect user to login
        window.location.href = '/login';
    }
    return Promise.reject(error);
});
//# sourceMappingURL=authService.js.map