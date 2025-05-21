/**
 * API Client
 * Configured Axios instance for making API requests
 */
import axios from 'axios';
import AuthService from '../../auth/AuthService';

// Get API base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Create axios instance with default config
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
    withCredentials: true, // Important for cookies/CSRF
});

// Request interceptor to add authorization token
apiClient.interceptors.request.use(
    (config) => {
        const token = AuthService.getToken();

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle common errors
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle 401 Unauthorized responses
        if (error.response && error.response.status === 401) {
            AuthService.handleAuthError();
        }

        return Promise.reject(error);
    }
);

export default apiClient;