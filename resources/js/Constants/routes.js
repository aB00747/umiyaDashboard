/**
 * API Routes
 * Contains all API endpoint paths as constants
 */

// Auth endpoints
export const AUTH = {
    LOGIN: '/login',
    LOGOUT: '/logout',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
    CHECK_STATUS: '/auth/check',
};

// User endpoints
export const USERS = {
    BASE: '/users',
    PROFILE: '/users/profile',
    BY_ID: (id) => `/users/${id}`,
};

// Customer endpoints
export const CUSTOMERS = {
    BASE: '/customers',
    BY_ID: (id) => `/customers/${id}`,
    SEARCH: '/customers/search',
    IMPORT: '/customers/import',
    EXPORT_CSV: '/customers/export/csv',
    EXPORT_TEMPLATE: '/customers/export/template',
    ORDERS: (customerId) => `/customers/${customerId}/orders`,
};

// Product endpoints
export const PRODUCTS = {
    BASE: '/products',
    BY_ID: (id) => `/products/${id}`,
    SEARCH: '/products/search',
    CATEGORIES: '/products/categories',
};

// Order endpoints
export const ORDERS = {
    BASE: '/orders',
    BY_ID: (id) => `/orders/${id}`,
    SEARCH: '/orders/search',
    STATUS: '/orders/status',
};

// Dashboard endpoints
export const DASHBOARD = {
    STATS: '/dashboard/stats',
    RECENT_ORDERS: '/dashboard/recent-orders',
    REVENUE: '/dashboard/revenue',
};

// General search endpoint
export const SEARCH = '/search';

// Export all routes as a single object as well
export default {
    AUTH,
    USERS,
    CUSTOMERS,
    PRODUCTS,
    ORDERS,
    DASHBOARD,
    SEARCH,
};