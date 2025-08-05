import BaseService from '../core/BaseService';

/**
 * Customer Service
 * Handles all customer-related API operations
 */
class CustomerService extends BaseService {
    constructor() {
        super('/customers');
    }

    /**
     * Transform customer response data
     */
    transformResponse(data) {
        if (data.data && Array.isArray(data.data)) {
            // Paginated response
            return {
                ...data,
                data: data.data.map(customer => this.transformCustomer(customer))
            };
        } else if (data.data && typeof data.data === 'object' && data.data.id) {
            // Single customer response
            return {
                ...data,
                data: this.transformCustomer(data.data)
            };
        } else if (data.id) {
            // Direct customer object
            return this.transformCustomer(data);
        }
        
        return data;
    }

    /**
     * Transform individual customer object
     */
    transformCustomer(customer) {
        return {
            ...customer,
            // Ensure address is properly structured
            address: customer.address || null,
            // Compute full name if not provided
            full_name: customer.full_name || 
                      `${customer.first_name || ''} ${customer.last_name || ''}`.trim(),
            // Format dates
            created_at: customer.created_at ? new Date(customer.created_at) : null,
            updated_at: customer.updated_at ? new Date(customer.updated_at) : null,
            // Ensure boolean fields
            is_active: Boolean(customer.is_active)
        };
    }

    /**
     * Get customers with financial data
     */
    async getWithFinancial(params = {}) {
        const response = await this.request('get', '', null, {
            params: { ...params, include: 'financial' }
        });

        return response
    }

    /**
     * Get customer orders
     */
    async getOrders(customerId, params = {}) {
        if (!customerId) {
            throw new Error('Customer ID is required');
        }
        const response = await this.request('get', `${customerId}/orders`, null, { params });

        return response;
    }

    /**
     * Get customer interactions/activity
     */
    async getInteractions(customerId, params = {}) {
        if (!customerId) {
            throw new Error('Customer ID is required');
        }
        const response = await this.request('get', `${customerId}/interactions`, null, { params });

        return response;
    }

    /**
     * Get customer documents
     */
    async getDocuments(customerId, params = {}) {
        if (!customerId) {
            throw new Error('Customer ID is required');
        }
        const response = await this.request('get', `${customerId}/documents`, null, { params });
        return response;
    }

    /**
     * Update customer status
     */
    async updateStatus(customerId, isActive) {
        if (!customerId) {
            throw new Error('Customer ID is required');
        }
        const response = await this.patch(customerId, { is_active: Boolean(isActive) });

        return response
    }

    /**
     * Get customers by type
     */
    async getByType(customerType, params = {}) {
        if (!customerType) {
            throw new Error('Customer type is required');
        }
        const response = await this.getAll({ ...params, customer_type: customerType });

        return response;
    }

    /**
     * Get active customers
     */
    async getActive(params = {}) {
        const response = await this.getAll({ ...params, is_active: true });
        
        return response;
    }

    /**
     * Get inactive customers
     */
    async getInactive(params = {}) {
        const response = await this.getAll({ ...params, is_active: false });
        
        return response;
    }

    /**
     * Advanced search with multiple criteria
     */
    async advancedSearch(criteria) {
        if (!criteria || typeof criteria !== 'object') {
            throw new Error('Search criteria object is required');
        }
        
        const response = await this.request('post', 'search/advanced', criteria);

        return response;
    }

    /**
     * Get customer statistics
     */
    async getCustomerStats(params = {}) {
        const response = await this.getStats(params);

        return response;
    }

    /**
     * Duplicate customer check
     */
    async checkDuplicate(email, phone, companyName) {
        const params = {};
        if (email) params.email = email;
        if (phone) params.phone = phone;
        if (companyName) params.company_name = companyName;
        
        const response = await this.request('get', 'check-duplicate', null, { params });

        return response;
    }

    /**
     * Merge customers
     */
    async merge(primaryCustomerId, secondaryCustomerId, mergeOptions = {}) {
        if (!primaryCustomerId || !secondaryCustomerId) {
            throw new Error('Both customer IDs are required for merge');
        }
        
        const response = await this.request('post', 'merge', {
            primary_customer_id: primaryCustomerId,
            secondary_customer_id: secondaryCustomerId,
            options: mergeOptions
        });

        return response;
    }

    /**
     * Generate customer report
     */
    async generateReport(customerId, reportType = 'summary') {
        if (!customerId) {
            throw new Error('Customer ID is required');
        }
        
        const response = await this.request('get', `${customerId}/report/${reportType}`);

        return response;
    }

    /**
     * Upload customer documents
     */
    async uploadDocument(customerId, file, documentType, description = '') {
        if (!customerId) {
            throw new Error('Customer ID is required');
        }
        if (!file) {
            throw new Error('File is required');
        }
        
        const response = await super.import(file, {
            fields: {
                customer_id: customerId,
                document_type: documentType,
                description
            }
        });

        return response;
    }

    /**
     * Get import template
     */
    async getImportTemplate(format = 'xlsx') {
        try {
            const response = await super.request('get', 'import/template', null, {
                params: { format },
                responseType: 'blob'
            });

            // Auto-download the template
            const blob = new Blob([response]);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `customer_import_template.${format}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            return { success: true };
        } catch (error) {
            throw this.handleError(error, 'Failed to download import template');
        }
    }

    /**
     * Validate import data
     */
    async validateImport(file) {
        if (!file) {
            throw new Error('File is required for validation');
        }

        const response = await this.request('post', 'import/validate', null, {
            data: { file },
            headers: { 'Content-Type': 'multipart/form-data' }
        });

        return response;
    }
}

// Create and export singleton instance
const customerService = new CustomerService();

export default customerService;