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
     * Import customers from CSV or Excel file
     * @param {File} file - CSV or Excel file to import
     * @returns {Promise<Object>} Import results
     */
    importCustomers(file) {
        const formData = new FormData();
        formData.append('file', file);

        return this.post('import', formData, {
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
     * Download customer import template
     * @returns {Promise<void>} Opens template download in new window
     */
    downloadTemplate() {
        try {
            // Get the base URL from environment variable or construct it
            const baseUrl = import.meta.env.VITE_API_BASE_URL ||
                `${document.location.origin}/api`;

            // const templateUrl = `${baseUrl}${this.resourceBase}/export/template`;
            const templateUrl = `${baseUrl}${CUSTOMERS.EXPORT_TEMPLATE}/export/template`;

            console.log("templateUrl", templateUrl);

            // Create a temporary hidden link and click it to download
            const link = document.createElement('a');
            link.href = templateUrl;
            link.target = '_blank';
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            return { success: true };
        } catch (error) {
            console.error('Error downloading template:', error);
            throw error;
        }
    }
}

// Create and export a singleton instance
const customerAPI = new CustomerAPI();
export default customerAPI;