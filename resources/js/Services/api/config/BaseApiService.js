/**
 * Base API Service
 * Provides abstracted methods for common API operations
 */

import apiClient from './apiClient';

class BaseApiService {
    /**
     * Create a new service instance for a specific resource
     * @param {string} resourceBase - Base endpoint for the resource
     */
    constructor(resourceBase) {
        this.resourceBase = resourceBase;
    }

    /**
     * Get resource collection with optional parameters
     * @param {Object} params - Query parameters
     * @returns {Promise<Object>} API response data
     */
    async getAll(params = {}) {
        try {
            const response = await apiClient.get(this.resourceBase, { params });
            return response.data;
        } catch (error) {
            console.error(`Error fetching ${this.resourceBase}:`, error);
            throw error;
        }
    }

    /**
     * Get a specific resource by ID
     * @param {number|string} id - Resource ID
     * @returns {Promise<Object>} Resource data
     */
    async getById(id) {
        try {
            const response = await apiClient.get(`${this.resourceBase}/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching ${this.resourceBase}/${id}:`, error);
            throw error;
        }
    }

    /**
     * Create a new resource
     * @param {Object} data - Resource data
     * @returns {Promise<Object>} Created resource data
     */
    async create(data) {
        try {
            const response = await apiClient.post(this.resourceBase, data);
            return response.data;
        } catch (error) {
            console.error(`Error creating ${this.resourceBase}:`, error);
            throw error;
        }
    }

    /**
     * Update an existing resource
     * @param {number|string} id - Resource ID
     * @param {Object} data - Updated resource data
     * @returns {Promise<Object>} Updated resource data
     */
    async update(id, data) {
        try {
            const response = await apiClient.put(`${this.resourceBase}/${id}`, data);
            return response.data;
        } catch (error) {
            console.error(`Error updating ${this.resourceBase}/${id}:`, error);
            throw error;
        }
    }

    /**
     * Delete a resource
     * @param {number|string} id - Resource ID
     * @returns {Promise<Object>} Deletion response
     */
    async delete(id) {
        try {
            const response = await apiClient.delete(`${this.resourceBase}/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting ${this.resourceBase}/${id}:`, error);
            throw error;
        }
    }

    /**
     * Make a custom GET request to a specific endpoint
     * @param {string} endpoint - Endpoint path relative to resource base
     * @param {Object} params - Query parameters
     * @returns {Promise<Object>} API response data
     */
    async get(endpoint, params = {}) {
        const url = endpoint ? `${this.resourceBase}/${endpoint}` : this.resourceBase;

        try {
            const response = await apiClient.get(url, { params });
            return response.data;
        } catch (error) {
            console.error(`Error in GET ${url}:`, error);
            throw error;
        }
    }

    /**
     * Make a custom POST request to a specific endpoint
     * @param {string} endpoint - Endpoint path relative to resource base
     * @param {Object} data - Request body data
     * @param {Object} config - Additional Axios config
     * @returns {Promise<Object>} API response data
     */
    async post(endpoint, data, config = {}) {
        const url = endpoint ? `${this.resourceBase}/${endpoint}` : this.resourceBase;

        try {
            const response = await apiClient.post(url, data, config);
            return response.data;
        } catch (error) {
            console.error(`Error in POST ${url}:`, error);
            throw error;
        }
    }
}

export default BaseApiService;