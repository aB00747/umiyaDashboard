/**
 * Customer API Service
 * Provides methods for interacting with customer data through the API
 */

import AuthService from './AuthService';

class CustomerAPI {
    // Base endpoint for customer API
    static endpoint = '/customers';

    /**
     * Get all customers with optional pagination and filtering
     * @param {Object} params - Query parameters (page, limit, search, etc.)
     * @returns {Promise<Object>} Customer list with pagination metadata
     */
    static async getAll(params = {}) {
        try {
            // Convert params object to query string
            const queryString = Object.entries(params)
                .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
                .join('&');

            const url = queryString ? `${this.endpoint}?${queryString}` : this.endpoint;
            const response = await AuthService.apiRequestJSON(url);

            // Add more detailed logging
            console.log('Customer API response:', response);
            return response;
        } catch (error) {
            console.error('Error fetching customers:', error);
            throw error;
        }
    }

    /**
     * Get a specific customer by ID
     * @param {number|string} id - Customer ID
     * @returns {Promise<Object>} Customer data
     */
    static async getById(id) {
        try {
            return await AuthService.apiRequestJSON(`${this.endpoint}/${id}`);
        } catch (error) {
            console.error(`Error fetching customer #${id}:`, error);
            throw error;
        }
    }

    /**
     * Create a new customer
     * @param {Object} customerData - Customer information
     * @returns {Promise<Object>} Created customer data
     */
    static async create(customerData) {
        try {
            return await AuthService.apiRequestJSON(this.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(customerData),
            });
        } catch (error) {
            console.error('Error creating customer:', error);
            throw error;
        }
    }

    /**
     * Update an existing customer
     * @param {number|string} id - Customer ID
     * @param {Object} customerData - Updated customer information
     * @returns {Promise<Object>} Updated customer data
     */
    static async update(id, customerData) {
        try {
            return await AuthService.apiRequestJSON(`${this.endpoint}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(customerData),
            });
        } catch (error) {
            console.error(`Error updating customer #${id}:`, error);
            throw error;
        }
    }

    /**
     * Delete a customer
     * @param {number|string} id - Customer ID
     * @returns {Promise<Object>} Deletion response
     */
    static async delete(id) {
        try {
            return await AuthService.apiRequestJSON(`${this.endpoint}/${id}`, {
                method: 'DELETE',
            });
        } catch (error) {
            console.error(`Error deleting customer #${id}:`, error);
            throw error;
        }
    }

    /**
     * Search for customers
     * @param {string} query - Search term
     * @returns {Promise<Array>} Matching customers
     */
    static async search(query) {
        try {
            return await AuthService.apiRequestJSON(`${this.endpoint}/search?query=${encodeURIComponent(query)}`);
        } catch (error) {
            console.error('Error searching customers:', error);
            throw error;
        }
    }

    /**
     * Get customer orders
     * @param {number|string} customerId - Customer ID
     * @param {Object} params - Query parameters (page, limit, etc.)
     * @returns {Promise<Object>} Customer orders with pagination metadata
     */
    static async getOrders(customerId, params = {}) {
        try {
            const queryString = Object.entries(params)
                .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
                .join('&');

            const url = queryString
                ? `${this.endpoint}/${customerId}/orders?${queryString}`
                : `${this.endpoint}/${customerId}/orders`;

            return await AuthService.apiRequestJSON(url);
        } catch (error) {
            console.error(`Error fetching orders for customer #${customerId}:`, error);
            throw error;
        }
    }

    /**
     * Import customers from CSV or Excel file
     * @param {File} file - CSV or Excel file to import
     * @returns {Promise<Object>} Import results
     */
    static async importCustomers(file) {
        try {
            const formData = new FormData();
            formData.append('file', file);

            return await AuthService.apiRequest(`${this.endpoint}/import`, {
                method: 'POST',
                body: formData,
                // Don't set Content-Type header as FormData will set it with boundary
                headers: {
                    // Remove Content-Type so browser sets it automatically with boundary
                },
            }).then(response => response.json());
        } catch (error) {
            console.error('Error importing customers:', error);
            throw error;
        }
    }

    /**
     * Export customers to CSV
     * @param {Object} filters - Export filters
     * @returns {Promise<Blob>} CSV file as blob
     */
    static async exportToCSV(filters = {}) {
        try {
            // Convert filters to query string
            const queryString = Object.entries(filters)
                .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
                .join('&');

            const url = queryString
                ? `${this.endpoint}/export/csv?${queryString}`
                : `${this.endpoint}/export/csv`;

            const response = await AuthService.apiRequest(url, {
                headers: {
                    'Accept': 'text/csv',
                },
            });

            return await response.blob();
        } catch (error) {
            console.error('Error exporting customers:', error);
            throw error;
        }
    }
}

export default CustomerAPI;