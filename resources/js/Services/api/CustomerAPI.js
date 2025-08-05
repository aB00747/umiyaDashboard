import BaseApiService from './config/BaseApiService';
import apiClient from './config/apiClient';
import { CUSTOMERS } from '@/Constants/routes';

/**
 * Customer API Service
 * Provides methods for interacting with customer data through the API
 */
class CustomerAPI extends BaseApiService {
    constructor() {
        super(CUSTOMERS.BASE);
    }

    /**
     * Search for customers
     * @param {string} query - Search term
     * @returns {Promise<Array>} Matching customers
     */
    search(query) {
        return this.get('search', { query });
    }

    /**
     * Get customer orders
     * @param {number|string} customerId - Customer ID
     * @param {Object} params - Query parameters (page, limit, etc.)
     * @returns {Promise<Object>} Customer orders with pagination metadata
     */
    getOrders(customerId, params = {}) {
        return this.get(`${customerId}/orders`, params);
    }

    /**
     * Import customers from various file formats (Excel, CSV, PDF)
     * @param {File} file - File to import (xlsx, xls, csv, pdf)
     * @returns {Promise<Object>} Import results with detailed statistics
     */
    async importCustomers(file) {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await this.post('import', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                timeout: 300000, // 5 minutes timeout for large files
            });

            return response;
        } catch (error) {
            // Enhanced error handling for import operations
            if (error.response?.status === 422) {
                // Validation errors
                throw new Error(error.response.data.message || 'File validation failed');
            } else if (error.response?.status === 413) {
                // File too large
                throw new Error('File is too large. Maximum size allowed is 50MB');
            } else if (error.code === 'ECONNABORTED') {
                // Timeout
                throw new Error('Import operation timed out. Please try with a smaller file');
            }
            
            throw error;
        }
    }

    /**
     * Validate import file before processing
     * @param {File} file - File to validate
     * @returns {Promise<Object>} Validation results
     */
    async validateImportFile(file) {
        const formData = new FormData();
        formData.append('file', file);

        return this.post('import/validate', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }

    /**
     * Export customers to CSV
     * @param {Object} filters - Export filters
     * @returns {Promise<Blob>} CSV file as blob
     */
    async exportToCSV(filters = {}) {
        try {
            const response = await apiClient.get(`${this.resourceBase}/export/csv`, {
                params: filters,
                responseType: 'blob',
                headers: {
                    'Accept': 'text/csv',
                },
            });

            return response.data;
        } catch (error) {
            console.error('Error exporting customers:', error);
            throw error;
        }
    }

    /**
     * Download customer import template with proper blob handling
     * @param {string} format - Template format (xlsx, csv, pdf)
     * @returns {Promise<Object>} Download result
     */
    async downloadTemplate(format = 'xlsx') {
        try {
            // Validate format
            const validFormats = ['xlsx', 'csv', 'pdf'];
            if (!validFormats.includes(format.toLowerCase())) {
                throw new Error(`Invalid format: ${format}. Supported formats: ${validFormats.join(', ')}`);
            }

            // Make API request with proper headers for file download
            const response = await apiClient.get(`${this.resourceBase}/export/template`, {
                params: { format: format.toLowerCase() },
                responseType: 'blob',
                headers: {
                    'Accept': this.getAcceptHeader(format)
                },
                timeout: 30000 // 30 second timeout for template generation
            });

            // Get filename from response headers or create default
            const contentDisposition = response.headers['content-disposition'];
            let filename = `customer_import_template.${format.toLowerCase()}`;
            
            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
                if (filenameMatch && filenameMatch[1]) {
                    filename = filenameMatch[1].replace(/['"]/g, '');
                }
            }

            // Create blob with proper MIME type
            const blob = new Blob([response.data], {
                type: this.getMimeType(format)
            });

            // Create download link and trigger download
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            link.style.display = 'none';
            
            // Add to DOM, click, and cleanup
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Cleanup blob URL
            setTimeout(() => {
                window.URL.revokeObjectURL(url);
            }, 100);

            return { 
                success: true, 
                filename,
                size: blob.size,
                format: format.toLowerCase()
            };
        } catch (error) {
            console.error('Error downloading template:', error);
            
            // Enhanced error handling
            if (error.response) {
                const status = error.response.status;
                switch (status) {
                    case 404:
                        throw new Error('Template not found on server');
                    case 500:
                        throw new Error('Server error generating template');
                    case 403:
                        throw new Error('Access denied. Please check permissions');
                    default:
                        throw new Error(`Failed to download template: ${error.response.statusText}`);
                }
            } else if (error.code === 'ECONNABORTED') {
                throw new Error('Template download timed out. Please try again');
            } else {
                throw new Error(`Failed to download template: ${error.message}`);
            }
        }
    }

    /**
     * Get appropriate Accept header for file format
     * @param {string} format - File format
     * @returns {string} Accept header value
     */
    getAcceptHeader(format) {
        const headers = {
            'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'csv': 'text/csv',
            'pdf': 'application/pdf'
        };
        return headers[format.toLowerCase()] || 'application/octet-stream';
    }

    /**
     * Get MIME type for file format
     * @param {string} format - File format
     * @returns {string} MIME type
     */
    getMimeType(format) {
        const mimeTypes = {
            'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'csv': 'text/csv',
            'pdf': 'application/pdf'
        };
        return mimeTypes[format.toLowerCase()] || 'application/octet-stream';
    }
}

// Create and export a singleton instance
const customerAPI = new CustomerAPI();
export default customerAPI;