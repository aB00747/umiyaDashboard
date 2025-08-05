/**
 * Financial Service
 * Handles all financial-related API operations for customers
 */
import BaseService from '../core/BaseService';

class FinancialService extends BaseService {
    constructor() {
        super('/financials');
    }

    /**
     * Transform financial response data
     */
    transformResponse(data) {
        if (data.data && Array.isArray(data.data)) {
            // Paginated response
            return {
                ...data,
                data: data.data.map(financial => this.transformFinancial(financial))
            };
        } else if (data.data && typeof data.data === 'object' && data.data.id) {
            // Single financial response
            return {
                ...data,
                data: this.transformFinancial(data.data)
            };
        } else if (data.id) {
            // Direct financial object
            return this.transformFinancial(data);
        }
        
        return data;
    }

    /**
     * Transform individual financial object
     */
    transformFinancial(financial) {
        return {
            ...financial,
            // Format currency fields
            credit_limit: this.formatCurrency(financial.credit_limit),
            available_credit: this.formatCurrency(financial.available_credit),
            used_credit: this.formatCurrency(financial.used_credit),
            outstanding_amount: this.formatCurrency(financial.outstanding_amount),
            overdue_amount: this.formatCurrency(financial.overdue_amount),
            total_revenue: this.formatCurrency(financial.total_revenue),
            ytd_revenue: this.formatCurrency(financial.ytd_revenue),
            last_year_revenue: this.formatCurrency(financial.last_year_revenue),
            average_order_value: this.formatCurrency(financial.average_order_value),
            gst_amount_collected: this.formatCurrency(financial.gst_amount_collected),
            tds_amount_deducted: this.formatCurrency(financial.tds_amount_deducted),
            
            // Format dates
            last_payment_date: financial.last_payment_date ? new Date(financial.last_payment_date) : null,
            last_order_date: financial.last_order_date ? new Date(financial.last_order_date) : null,
            first_order_date: financial.first_order_date ? new Date(financial.first_order_date) : null,
            created_at: financial.created_at ? new Date(financial.created_at) : null,
            updated_at: financial.updated_at ? new Date(financial.updated_at) : null,
            
            // Computed properties with fallbacks
            credit_utilization_percentage: financial.credit_utilization_percentage || 0,
            is_credit_limit_exceeded: Boolean(financial.is_credit_limit_exceeded),
            payment_status: financial.payment_status || 'current',
            financial_health_score: financial.financial_health_score || 0
        };
    }

    /**
     * Format currency values
     */
    formatCurrency(amount) {
        if (amount === null || amount === undefined) return 0;
        return parseFloat(amount) || 0;
    }

    /**
     * Get financial data by customer ID
     */
    async getByCustomerId(customerId) {
        if (!customerId) {
            throw new Error('Customer ID is required');
        }
        return this.request('get', '', null, {
            params: { customer_id: customerId }
        });
    }

    /**
     * Update credit limit
     */
    async updateCreditLimit(financialId, newLimit, reason = '') {
        if (!financialId) {
            throw new Error('Financial ID is required');
        }
        if (!newLimit || newLimit < 0) {
            throw new Error('Valid credit limit is required');
        }
        
        return this.patch(financialId, {
            credit_limit: newLimit,
            credit_notes: reason
        });
    }

    /**
     * Record payment
     */
    async recordPayment(customerId, paymentData) {
        if (!customerId) {
            throw new Error('Customer ID is required');
        }
        if (!paymentData || !paymentData.amount) {
            throw new Error('Payment data with amount is required');
        }
        
        return this.request('post', `${customerId}/payments`, {
            amount: paymentData.amount,
            payment_method: paymentData.payment_method || 'cash',
            payment_date: paymentData.payment_date || new Date().toISOString().split('T')[0],
            reference_number: paymentData.reference_number,
            notes: paymentData.notes
        });
    }

    /**
     * Get payment history
     */
    async getPaymentHistory(customerId, params = {}) {
        if (!customerId) {
            throw new Error('Customer ID is required');
        }
        return this.request('get', `${customerId}/payments`, null, { params });
    }

    /**
     * Get customers with overdue payments
     */
    async getOverdue(params = {}) {
        return this.getAll({ ...params, filter: 'overdue' });
    }

    /**
     * Get customers with good credit
     */
    async getGoodCredit(params = {}) {
        return this.getAll({ ...params, credit_status: 'good' });
    }

    /**
     * Get customers by credit status
     */
    async getByCreditStatus(status, params = {}) {
        if (!status) {
            throw new Error('Credit status is required');
        }
        return this.getAll({ ...params, credit_status: status });
    }

    /**
     * Get customers by payment behavior
     */
    async getByPaymentBehavior(behavior, params = {}) {
        if (!behavior) {
            throw new Error('Payment behavior is required');
        }
        return this.getAll({ ...params, payment_behavior: behavior });
    }

    /**
     * Update credit status
     */
    async updateCreditStatus(financialId, status, reason = '') {
        if (!financialId) {
            throw new Error('Financial ID is required');
        }
        if (!['good', 'warning', 'blocked', 'review'].includes(status)) {
            throw new Error('Invalid credit status');
        }
        
        return this.patch(financialId, {
            credit_status: status,
            credit_notes: reason
        });
    }

    /**
     * Update payment behavior rating
     */
    async updatePaymentBehavior(financialId, behavior, notes = '') {
        if (!financialId) {
            throw new Error('Financial ID is required');
        }
        if (!['excellent', 'good', 'average', 'poor'].includes(behavior)) {
            throw new Error('Invalid payment behavior rating');
        }
        
        return this.patch(financialId, {
            payment_behavior: behavior,
            financial_notes: notes
        });
    }

    /**
     * Calculate and update financial metrics
     */
    async recalculateMetrics(customerId) {
        if (!customerId) {
            throw new Error('Customer ID is required');
        }
        return this.request('post', `${customerId}/recalculate`);
    }

    /**
     * Get financial dashboard data
     */
    async getDashboardData(dateRange = '30d') {
        return this.request('get', 'dashboard', null, {
            params: { date_range: dateRange }
        });
    }

    /**
     * Get aging report
     */
    async getAgingReport(params = {}) {
        return this.request('get', 'reports/aging', null, { params });
    }

    /**
     * Get credit utilization report
     */
    async getCreditUtilizationReport(params = {}) {
        return this.request('get', 'reports/credit-utilization', null, { params });
    }

    /**
     * Get revenue analysis
     */
    async getRevenueAnalysis(customerId, period = 'monthly') {
        if (!customerId) {
            throw new Error('Customer ID is required');
        }
        return this.request('get', `${customerId}/revenue-analysis`, null, {
            params: { period }
        });
    }

    /**
     * Get financial trends
     */
    async getFinancialTrends(params = {}) {
        return this.request('get', 'trends', null, { params });
    }

    /**
     * Set payment reminder
     */
    async setPaymentReminder(customerId, reminderData) {
        if (!customerId) {
            throw new Error('Customer ID is required');
        }
        return this.request('post', `${customerId}/reminders`, reminderData);
    }

    /**
     * Get risk assessment
     */
    async getRiskAssessment(customerId) {
        if (!customerId) {
            throw new Error('Customer ID is required');
        }
        return this.request('get', `${customerId}/risk-assessment`);
    }

    /**
     * Bulk update credit limits
     */
    async bulkUpdateCreditLimits(updates) {
        if (!Array.isArray(updates) || updates.length === 0) {
            throw new Error('Updates array is required');
        }
        return this.request('post', 'bulk/credit-limits', { updates });
    }

    /**
     * Generate financial statement
     */
    async generateStatement(customerId, startDate, endDate, format = 'pdf') {
        if (!customerId) {
            throw new Error('Customer ID is required');
        }
        if (!startDate || !endDate) {
            throw new Error('Start date and end date are required');
        }
        
        return this.request('get', `${customerId}/statement`, null, {
            params: { start_date: startDate, end_date: endDate, format },
            responseType: format === 'pdf' ? 'blob' : 'json'
        });
    }
}

// Create and export singleton instance
const financialService = new FinancialService();

export default financialService;