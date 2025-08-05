import httpClient from './HttpClient';

/**
 * Base Service Class
 * Provides common CRUD operations and utilities for all API services
 */
class BaseService {
    constructor(endpoint) {
        if (!endpoint) {
            throw new Error('Service endpoint is required');
        }
        this.endpoint = endpoint;
    }

    /**
     * Get all resources with filtering, sorting, and pagination
     * @param {Object} params - Query parameters
     * @returns {Promise<Object>} Paginated response with data
     */
    async getAll(params = {}) {
        try {
            const response = await httpClient.get(this.endpoint, { params });
            return this.transformResponse(response.data);
        } catch (error) {
            throw this.handleError(error, 'Failed to fetch resources');
        }
    }

    /**
     * Get a specific resource by ID
     * @param {number|string} id - Resource ID
     * @param {Object} params - Additional query parameters
     * @returns {Promise<Object>} Resource data
     */
    async getById(id, params = {}) {
        if (!id) {
            throw new Error('Resource ID is required');
        }

        try {
            const response = await httpClient.get(`${this.endpoint}/${id}`, { params });
            return this.transformResponse(response.data);
        } catch (error) {
            throw this.handleError(error, `Failed to fetch resource with ID: ${id}`);
        }
    }

    /**
     * Create a new resource
     * @param {Object} data - Resource data
     * @returns {Promise<Object>} Created resource
     */
    async create(data) {
        if (!data || typeof data !== 'object') {
            throw new Error('Valid data object is required');
        }

        try {
            const response = await httpClient.post(this.endpoint, data);
            return this.transformResponse(response.data);
        } catch (error) {
            throw this.handleError(error, 'Failed to create resource');
        }
    }

    /**
     * Update an existing resource
     * @param {number|string} id - Resource ID
     * @param {Object} data - Updated data
     * @returns {Promise<Object>} Updated resource
     */
    async update(id, data) {
        if (!id) {
            throw new Error('Resource ID is required');
        }
        if (!data || typeof data !== 'object') {
            throw new Error('Valid data object is required');
        }

        try {
            const response = await httpClient.put(`${this.endpoint}/${id}`, data);
            return this.transformResponse(response.data);
        } catch (error) {
            throw this.handleError(error, `Failed to update resource with ID: ${id}`);
        }
    }

    /**
     * Partially update a resource
     * @param {number|string} id - Resource ID
     * @param {Object} data - Partial update data
     * @returns {Promise<Object>} Updated resource
     */
    async patch(id, data) {
        if (!id) {
            throw new Error('Resource ID is required');
        }
        if (!data || typeof data !== 'object') {
            throw new Error('Valid data object is required');
        }

        try {
            const response = await httpClient.patch(`${this.endpoint}/${id}`, data);
            return this.transformResponse(response.data);
        } catch (error) {
            throw this.handleError(error, `Failed to patch resource with ID: ${id}`);
        }
    }

    /**
     * Delete a resource
     * @param {number|string} id - Resource ID
     * @returns {Promise<Object>} Deletion response
     */
    async delete(id) {
        if (!id) {
            throw new Error('Resource ID is required');
        }

        try {
            const response = await httpClient.delete(`${this.endpoint}/${id}`);
            return this.transformResponse(response.data);
        } catch (error) {
            throw this.handleError(error, `Failed to delete resource with ID: ${id}`);
        }
    }

    /**
     * Search resources
     * @param {string} query - Search query
     * @param {Object} params - Additional parameters
     * @returns {Promise<Array>} Search results
     */
    async search(query, params = {}) {
        if (!query || typeof query !== 'string') {
            throw new Error('Search query is required');
        }

        try {
            const response = await httpClient.get(`${this.endpoint}/search`, {
                params: { query, ...params }
            });
            return this.transformResponse(response.data);
        } catch (error) {
            throw this.handleError(error, 'Search failed');
        }
    }

    /**
     * Bulk operations
     */
    async bulkCreate(items) {
        if (!Array.isArray(items) || items.length === 0) {
            throw new Error('Items array is required and cannot be empty');
        }

        try {
            const response = await httpClient.post(`${this.endpoint}/bulk`, { items });
            return this.transformResponse(response.data);
        } catch (error) {
            throw this.handleError(error, 'Bulk create failed');
        }
    }

    /**
     * Bulk update resources
     * @param {Object[]} updates - Array of objects containing the resource ID and updated data
     * @returns {Promise<Object>} Bulk update response
     */
    async bulkUpdate(updates) {
        if (!Array.isArray(updates) || updates.length === 0) {
            throw new Error('Updates array is required and cannot be empty');
        }

        try {
            const response = await httpClient.put(`${this.endpoint}/bulk`, { updates });
            return this.transformResponse(response.data);
        } catch (error) {
            throw this.handleError(error, 'Bulk update failed');
        }
    }

    /**
     * Delete multiple resources at once
     * @param {number|string}[] ids - IDs of resources to delete
     * @returns {Promise<Object>} Deletion response
     * @throws {Error} If the IDs array is empty or not an array
     * @throws {Error} If the request fails
     */
    async bulkDelete(ids) {
        if (!Array.isArray(ids) || ids.length === 0) {
            throw new Error('IDs array is required and cannot be empty');
        }

        try {
            const response = await httpClient.delete(`${this.endpoint}/bulk`, {
                data: { ids }
            });
            return this.transformResponse(response.data);
        } catch (error) {
            throw this.handleError(error, 'Bulk delete failed');
        }
    }

    /**
     * Export resources
     * @param {string} format - Export format (csv, xlsx, pdf)
     * @param {Object} params - Export parameters
     * @returns {Promise<void>} Downloads the file
     */
    async export(format = 'csv', params = {}) {
        if (!['csv', 'xlsx', 'pdf'].includes(format)) {
            throw new Error('Invalid export format. Use csv, xlsx, or pdf');
        }

        try {
            const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
            const filename = `${this.endpoint.replace('/', '_')}_export_${timestamp}.${format}`;
            
            await httpClient.download(
                `${this.endpoint}/export/${format}`,
                filename,
                { params }
            );
        } catch (error) {
            throw this.handleError(error, `Export to ${format.toUpperCase()} failed`);
        }
    }

    /**
     * Import resources from file
     * @param {File} file - File to import
     * @param {Object} options - Import options
     * @returns {Promise<Object>} Import results
     */
    async import(file, options = {}) {
        if (!file) {
            throw new Error('File is required for import');
        }

        try {
            const response = await httpClient.upload(
                `${this.endpoint}/import`,
                file,
                {
                    fieldName: 'file',
                    fields: options.fields,
                    onProgress: options.onProgress
                }
            );
            return this.transformResponse(response.data);
        } catch (error) {
            throw this.handleError(error, 'Import failed');
        }
    }

    /**
     * Get statistics/metrics for the resource
     * @param {Object} params - Filter parameters
     * @returns {Promise<Object>} Statistics data
     */
    async getStats(params = {}) {
        try {
            const response = await httpClient.get(`${this.endpoint}/stats`, { params });
            return this.transformResponse(response.data);
        } catch (error) {
            throw this.handleError(error, 'Failed to fetch statistics');
        }
    }

    /**
     * Transform API response - can be overridden by child classes
     * @param {Object} data - Raw API response
     * @returns {Object} Transformed data
     */
    transformResponse(data) {
        // Example usage of 'this' to satisfy the linter
        if (this.endpoint) {
            // Optionally, you can add custom transformation logic here
        }
        return data;
    }

    /**
     * Handle errors with context - can be overridden by child classes
     * @param {Object} error - Error object
     * @param {string} context - Error context message
     * @returns {Error} Enhanced error
     */
    handleError(error, context) {
        const enhancedError = new Error(context);
        enhancedError.originalError = error;
        enhancedError.status = error.status;
        enhancedError.errors = error.errors;
        enhancedError.type = error.type;
        
        console.error(`${this.constructor.name}: ${context}`, error);
        return enhancedError;
    }

    /**
     * Make custom request to service endpoint
     * @param {string} method - HTTP method
     * @param {string} path - Path relative to service endpoint
     * @param {Object} data - Request data
     * @param {Object} config - Request config
     * @returns {Promise<Object>} Response data
     */
    async request(method, path = '', data = null, config = {}) {
        const url = path ? `${this.endpoint}/${path}` : this.endpoint;
        
        try {
            let response = null;
            
            switch (method.toLowerCase()) {
                case 'get':
                    response = await httpClient.get(url, config);
                    break;
                case 'post':
                    response = await httpClient.post(url, data, config);
                    break;
                case 'put':
                    response = await httpClient.put(url, data, config);
                    break;
                case 'patch':
                    response = await httpClient.patch(url, data, config);
                    break;
                case 'delete':
                    response = await httpClient.delete(url, config);
                    break;
                default:
                    throw new Error(`Unsupported HTTP method: ${method}`);
            }
            
            return this.transformResponse(response.data);
        } catch (error) {
            throw this.handleError(error, `Custom ${method.toUpperCase()} request failed`);
        }
    }
}

export default BaseService;