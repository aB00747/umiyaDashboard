// AuthService.js
import axios from 'axios';

class AuthService {
    constructor() {
        this.token = this.getStoredToken();
        this.setupAxiosInterceptors();
    }

    /**
     * Login user with remember me functionality
     * @param {string} email
     * @param {string} password
     * @param {boolean} remember
     * @returns {Promise}
     */
    async login(email, password, remember = false) {
        try {
            const response = await axios.post('/api/login', {
                email,
                password,
                remember,
                device_name: this.getDeviceName(),
            });

            const { token, user, expires_at } = response.data;

            // Store token based on remember preference
            if (remember) {
                // Store in localStorage for persistent login
                localStorage.setItem('auth_token', token);
                localStorage.setItem('auth_user', JSON.stringify(user));
                localStorage.setItem('remember_me', 'true');
                if (expires_at) {
                    localStorage.setItem('token_expires_at', expires_at);
                }
                
                // Remove from sessionStorage if exists
                sessionStorage.removeItem('auth_token');
                sessionStorage.removeItem('auth_user');
            } else {
                // Store in sessionStorage for session-only login
                sessionStorage.setItem('auth_token', token);
                sessionStorage.setItem('auth_user', JSON.stringify(user));
                
                // Remove from localStorage if exists
                localStorage.removeItem('auth_token');
                localStorage.removeItem('auth_user');
                localStorage.removeItem('remember_me');
                localStorage.removeItem('token_expires_at');
            }

            // Set current token
            this.token = token;
            this.setAuthHeader(token);

            // Redirect to dashboard
            window.location.href = '/dashboard';

            return response.data;
        } catch (error) {
            console.error('Login failed:', error);
            throw new Error(
                error.response?.data?.message || 
                'Login failed. Please check your credentials.'
            );
        }
    }

    /**
     * Logout user
     */
    async logout() {
        try {
            if (this.token) {
                await axios.post('/api/logout');
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            this.clearAuth();
            window.location.href = '/login';
        }
    }

    /**
     * Get stored token (check localStorage first, then sessionStorage)
     */
    getStoredToken() {
        // Check localStorage first (remember me)
        let token = localStorage.getItem('auth_token');
        if (token) {
            // Check if token is expired
            const expiresAt = localStorage.getItem('token_expires_at');
            if (expiresAt && new Date(expiresAt) <= new Date()) {
                this.clearAuth();
                return null;
            }
            return token;
        }

        // Check sessionStorage (session only)
        return sessionStorage.getItem('auth_token');
    }

    /**
     * Get stored user
     */
    getStoredUser() {
        const userStr = localStorage.getItem('auth_user') || sessionStorage.getItem('auth_user');
        return userStr ? JSON.parse(userStr) : null;
    }

    /**
     * Check if user chose remember me
     */
    isRemembered() {
        return localStorage.getItem('remember_me') === 'true';
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated() {
        return !!this.getStoredToken();
    }

    /**
     * Clear all authentication data
     */
    clearAuth() {
        // Clear localStorage
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        localStorage.removeItem('remember_me');
        localStorage.removeItem('token_expires_at');
        
        // Clear sessionStorage
        sessionStorage.removeItem('auth_token');
        sessionStorage.removeItem('auth_user');
        
        // Clear current token
        this.token = null;
        delete axios.defaults.headers.common['Authorization'];
    }

    /**
     * Set authorization header
     */
    setAuthHeader(token) {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
    }

    /**
     * Setup axios interceptors for automatic token handling
     */
    setupAxiosInterceptors() {
        // Request interceptor to add token
        axios.interceptors.request.use(
            (config) => {
                const token = this.getStoredToken();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // Response interceptor to handle 401 errors
        axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    this.clearAuth();
                    window.location.href = '/login';
                }
                return Promise.reject(error);
            }
        );
    }

    /**
     * Get device name for token
     */
    getDeviceName() {
        return `${navigator.platform} - ${navigator.userAgent.split(' ')[0]}`;
    }

    /**
     * Initialize auth on app start
     */
    init() {
        const token = this.getStoredToken();
        if (token) {
            this.setAuthHeader(token);
        }
    }
}

// Create singleton instance
const authService = new AuthService();

// Initialize on import
authService.init();

export default authService;