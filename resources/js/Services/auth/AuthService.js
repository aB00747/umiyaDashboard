import httpClient from '../core/HttpClient';

/**
 * Authentication Service
 * Handles user authentication, token management, and session handling
 */
class AuthService {
    constructor() {
        this.user = null;
        this.token = null;
        this.refreshTimer = null;
        this.init();
    }

    /**
     * Initialize authentication service
     */
    init() {
        this.token = this.getStoredToken();
        this.user = this.getStoredUser();
        
        if (this.token) {
            this.scheduleTokenRefresh();
        }
    }

    /**
     * Login user with credentials
     */
    async login(credentials) {
        try {
            const response = await httpClient.post('/auth/login', {
                email: credentials.email,
                password: credentials.password,
                remember: credentials.remember || false,
                device_name: this.getDeviceName()
            });

            const { token, user, expires_at } = response.data;

            // Store authentication data
            this.setAuthData(token, user, expires_at, credentials.remember);
            
            // Schedule token refresh if needed
            if (expires_at) {
                this.scheduleTokenRefresh();
            }

            return {
                success: true,
                user,
                token,
                message: 'Login successful'
            };

        } catch (error) {
            const err = new Error(error.message || 'Login failed');
            err.success = false;
            err.errors = error.errors || {};
            throw err;
        }
    }

    /**
     * Register new user
     */
    async register(userData) {
        try {
            const response = await httpClient.post('/auth/register', userData);
            
            const { token, user } = response.data;
            
            // Auto-login after registration
            if (token && user) {
                this.setAuthData(token, user);
            }

            return {
                success: true,
                user,
                token,
                message: 'Registration successful'
            };

        } catch (error) {
            throw {
                success: false,
                message: error.message || 'Registration failed',
                errors: error.errors || {}
            };
        }
    }

    /**
     * Logout user
     */
    async logout() {
        try {
            if (this.token) {
                await httpClient.post('/auth/logout');
            }
        } catch (error) {
            console.warn('Logout request failed:', error);
        } finally {
            this.clearAuthData();
            this.redirectToLogin();
        }
    }

    /**
     * Refresh authentication token
     */
    async refreshToken() {
        try {
            const response = await httpClient.post('/auth/refresh');
            const { token, user, expires_at } = response.data;
            
            this.setAuthData(token, user, expires_at, this.isRemembered());
            this.scheduleTokenRefresh();
            
            return { success: true, token };
        } catch (error) {
            console.error('Token refresh failed:', error);
            this.clearAuthData();
            this.redirectToLogin();
            throw error;
        }
    }

    /**
     * Get current user profile
     */
    async getCurrentUser() {
        try {
            const response = await httpClient.get('/auth/user');
            this.user = response.data;
            this.storeUser(this.user);
            return this.user;
        } catch (error) {
            console.error('Failed to fetch current user:', error);
            throw error;
        }
    }

    /**
     * Update user profile
     */
    async updateProfile(profileData) {
        try {
            const response = await httpClient.put('/auth/profile', profileData);
            this.user = response.data;
            this.storeUser(this.user);
            return this.user;
        } catch (error) {
            throw {
                success: false,
                message: error.message || 'Profile update failed',
                errors: error.errors || {}
            };
        }
    }

    /**
     * Change password
     */
    async changePassword(passwordData) {
        try {
            const response = await httpClient.put('/auth/password', {
                current_password: passwordData.currentPassword,
                password: passwordData.newPassword,
                password_confirmation: passwordData.confirmPassword
            });

            return {
                success: true,
                message: 'Password changed successfully'
            };
        } catch (error) {
            throw {
                success: false,
                message: error.message || 'Password change failed',
                errors: error.errors || {}
            };
        }
    }

    /**
     * Request password reset
     */
    async requestPasswordReset(email) {
        try {
            const response = await httpClient.post('/auth/forgot-password', { email });
            return {
                success: true,
                message: 'Password reset email sent'
            };
        } catch (error) {
            throw {
                success: false,
                message: error.message || 'Password reset request failed'
            };
        }
    }

    /**
     * Reset password with token
     */
    async resetPassword(token, email, password, passwordConfirmation) {
        try {
            const response = await httpClient.post('/auth/reset-password', {
                token,
                email,
                password,
                password_confirmation: passwordConfirmation
            });

            return {
                success: true,
                message: 'Password reset successful'
            };
        } catch (error) {
            throw {
                success: false,
                message: error.message || 'Password reset failed',
                errors: error.errors || {}
            };
        }
    }

    /**
     * Verify email address
     */
    async verifyEmail(token) {
        try {
            const response = await httpClient.post('/auth/verify-email', { token });
            return {
                success: true,
                message: 'Email verified successfully'
            };
        } catch (error) {
            throw {
                success: false,
                message: error.message || 'Email verification failed'
            };
        }
    }

    /**
     * Resend email verification
     */
    async resendEmailVerification() {
        try {
            const response = await httpClient.post('/auth/resend-verification');
            return {
                success: true,
                message: 'Verification email sent'
            };
        } catch (error) {
            throw {
                success: false,
                message: error.message || 'Failed to send verification email'
            };
        }
    }

    /**
     * Check authentication status
     */
    isAuthenticated() {
        return !!(this.token && this.user);
    }

    /**
     * Check if user has specific permission
     */
    hasPermission(permission) {
        if (!this.user || !this.user.permissions) return false;
        return this.user.permissions.includes(permission);
    }

    /**
     * Check if user has specific role
     */
    hasRole(role) {
        if (!this.user || !this.user.roles) return false;
        return this.user.roles.includes(role);
    }

    /**
     * Get current user
     */
    getUser() {
        return this.user;
    }

    /**
     * Get current token
     */
    getToken() {
        return this.token;
    }

    /**
     * Store authentication data
     */
    setAuthData(token, user, expiresAt = null, remember = false) {
        this.token = token;
        this.user = user;

        const storage = remember ? localStorage : sessionStorage;
        const otherStorage = remember ? sessionStorage : localStorage;

        // Store in appropriate storage
        storage.setItem('auth_token', token);
        storage.setItem('auth_user', JSON.stringify(user));
        
        if (remember) {
            localStorage.setItem('remember_me', 'true');
            if (expiresAt) {
                localStorage.setItem('token_expires_at', expiresAt);
            }
        }

        // Clear from other storage
        otherStorage.removeItem('auth_token');
        otherStorage.removeItem('auth_user');
        if (!remember) {
            localStorage.removeItem('remember_me');
            localStorage.removeItem('token_expires_at');
        }
    }

    /**
     * Get stored token
     */
    getStoredToken() {
        // Check localStorage first (remember me)
        let token = localStorage.getItem('auth_token');
        if (token) {
            const expiresAt = localStorage.getItem('token_expires_at');
            if (expiresAt && new Date(expiresAt) <= new Date()) {
                this.clearAuthData();
                return null;
            }
            return token;
        }

        // Check sessionStorage
        return sessionStorage.getItem('auth_token');
    }

    /**
     * Get stored user
     */
    getStoredUser() {
        const userStr = localStorage.getItem('auth_user') || 
                       sessionStorage.getItem('auth_user');
        return userStr ? JSON.parse(userStr) : null;
    }

    /**
     * Store user data
     */
    storeUser(user) {
        this.user = user;
        const storage = this.isRemembered() ? localStorage : sessionStorage;
        storage.setItem('auth_user', JSON.stringify(user));
    }

    /**
     * Check if remember me is active
     */
    isRemembered() {
        return localStorage.getItem('remember_me') === 'true';
    }

    /**
     * Clear all authentication data
     */
    clearAuthData() {
        this.token = null;
        this.user = null;

        // Clear localStorage
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        localStorage.removeItem('remember_me');
        localStorage.removeItem('token_expires_at');

        // Clear sessionStorage
        sessionStorage.removeItem('auth_token');
        sessionStorage.removeItem('auth_user');

        // Clear refresh timer
        if (this.refreshTimer) {
            clearTimeout(this.refreshTimer);
            this.refreshTimer = null;
        }
    }

    /**
     * Schedule automatic token refresh
     */
    scheduleTokenRefresh() {
        if (this.refreshTimer) {
            clearTimeout(this.refreshTimer);
        }

        const expiresAt = localStorage.getItem('token_expires_at');
        if (!expiresAt) return;

        const expiryTime = new Date(expiresAt).getTime();
        const currentTime = new Date().getTime();
        const timeUntilExpiry = expiryTime - currentTime;
        
        // Refresh 5 minutes before expiry
        const refreshTime = Math.max(timeUntilExpiry - (5 * 60 * 1000), 60000);

        if (refreshTime > 0) {
            this.refreshTimer = setTimeout(() => {
                this.refreshToken().catch(console.error);
            }, refreshTime);
        }
    }

    /**
     * Get device name for tracking
     */
    getDeviceName() {
        const platform = navigator.platform || 'Unknown Platform';
        const userAgent = navigator.userAgent.split(' ')[0] || 'Unknown Browser';
        return `${platform} - ${userAgent}`;
    }

    /**
     * Redirect to login page
     */
    redirectToLogin(returnUrl = null) {
        const url = returnUrl ? `/login?return=${encodeURIComponent(returnUrl)}` : '/login';
        window.location.href = url;
    }

    /**
     * Handle authentication errors
     */
    handleAuthError() {
        this.clearAuthData();
        if (!window.location.pathname.includes('/login')) {
            this.redirectToLogin(window.location.pathname);
        }
    }
}

// Create and export singleton instance
const authService = new AuthService();

export default authService;