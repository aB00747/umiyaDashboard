/**
 * Authentication Service
 * Provides utilities for API authentication and requests with Laravel Sanctum
 */

// Get base URL from Laravel's global window variable or fall back to a default
const APP_URL = window.location.origin;
const API_BASE_URL = `${APP_URL}/api`;

const STORAGE_KEYS = {
  TOKEN: 'api_token',
  USER: 'user'
};

/**
 * AuthService - Handles authentication and API requests
 */
class AuthService {
  /**
   * Authenticate user with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} Authentication response with token and user data
   */
  static async login(email, password) {
    try {
      // Get CSRF token first (Laravel requires this for security)
      const csrfResponse = await fetch(`${APP_URL}/sanctum/csrf-cookie`, {
        method: 'GET',
        credentials: 'include', // Important for cookies
      });

      if (!csrfResponse.ok) {
        console.error('Failed to get CSRF token');
      }

      // Now perform login with credentials
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest', // Required for Laravel to recognize as AJAX
        },
        credentials: 'include', // Important for cookies
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      // Store authentication data
      this.saveAuthData(data.token, data.user);

      await new Promise(resolve => setTimeout(resolve, 300));
      // Redirect to dashboard on successful login
      if (data.token) {
        window.location.href = '/dashboard';
      }

      return data;
    } catch (error) {
      console.error('Authentication error:', error.message);
      throw error;
    }
  }

  /**
   * Log out the current user
   * @returns {Promise<void>}
   */
  static async logout() {
    try {
      await this.apiRequest(`${API_BASE_URL}/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error.message);
    } finally {
      // Always clear authentication data even if the API call fails
      this.clearAuthData();
      window.location.href = '/login';
    }
  }

  /**
   * Make an authenticated API request
   * @param {string} url - API endpoint URL
   * @param {Object} options - Fetch options
   * @returns {Promise<Response>} Fetch response
   */
  static async apiRequest(url, options = {}) {
    const token = this.getToken();

    if (!token) {
      this.redirectToLogin();
      throw new Error('Not authenticated');
    }

    // Merge headers with authorization
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      ...(options.headers || {})
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include', // Important for cookies
      });

      // Handle authentication errors
      if (response.status === 401) {
        this.handleAuthError();
        throw new Error('Session expired');
      }

      return response;
    } catch (error) {
      // Handle network errors
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        console.error('Network error. Please check your connection.');
      }
      throw error;
    }
  }

  /**
   * Make an authenticated request and parse JSON response
   * @param {string} url - API endpoint
   * @param {Object} options - Fetch options
   * @returns {Promise<Object>} Parsed JSON response
   */
  static async apiRequestJSON(url, options = {}) {
    const response = await this.apiRequest(url, options);
    return await response.json();
  }

  /**
   * Search API with authentication
   * @param {string} query - Search query
   * @returns {Promise<Object>} Search results
   */
  static async search(query) {
    try {
      return await this.apiRequestJSON(
        `${API_BASE_URL}/search?q=${encodeURIComponent(query)}`
      );
    } catch (error) {
      console.error('Search error:', error.message);
      throw error;
    }
  }

  /**
   * Save authentication data to storage
   * @param {string} token - JWT token
   * @param {Object} user - User data
   */
  static saveAuthData(token, user) {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }

  /**
   * Clear authentication data from storage
   */
  static clearAuthData() {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  }

  /**
   * Get authentication token
   * @returns {string|null} Auth token or null if not authenticated
   */
  static getToken() {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  }

  /**
   * Get current user data
   * @returns {Object|null} User data or null if not authenticated
   */
  static getCurrentUser() {
    const userData = localStorage.getItem(STORAGE_KEYS.USER);
    return userData ? JSON.parse(userData) : null;
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} Authentication status
   */
  static isAuthenticated() {
    return !!this.getToken();
  }

  /**
   * Handle authentication errors
   */
  static handleAuthError() {
    this.clearAuthData();
    this.redirectToLogin();
  }

  /**
   * Redirect to login page
   */
  static redirectToLogin() {
    window.location.href = '/login';
  }

  // Add to AuthService.js
  static async checkAuthStatus() {
    try {
      const response = await fetch(`${APP_URL}/auth/check`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        }
      });

      const data = await response.json();
      return data.authenticated;
    } catch (error) {
      console.error('Auth check error:', error);
      return false;
    }
  }
}

export default AuthService;