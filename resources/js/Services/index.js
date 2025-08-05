/**
 * Services Index
 * Central export point for all services
 */

// Core services
import BaseService from './core/BaseService';
import httpClient from './core/HttpClient';
import customerService from './api/CustomerService';
import financialService from './api/FinancialService';
import authService from './auth/AuthService';
import validationService from './utils/ValidationService';

export { default as httpClient } from './core/HttpClient';
export { default as BaseService } from './core/BaseService';

// API services
export { default as customerService } from './api/CustomerService';
export { default as financialService } from './api/FinancialService';

// Auth service
export { default as authService } from './auth/AuthService';

// Utility services
export { default as validationService } from './utils/ValidationService';

// Service factory for creating new service instances
export class ServiceFactory {
    /**
     * Create a new service instance for a specific endpoint
     * @param {string} endpoint - API endpoint
     * @returns {BaseService} Service instance
     */
    static createService(endpoint) {
        return new BaseService(endpoint);
    }
    
    /**
     * Create a custom service class
     * @param {string} endpoint - API endpoint
     * @param {Object} customMethods - Custom methods to add to the service
     * @returns {Class} Custom service class
     */
    static createCustomService(endpoint, customMethods = {}) {
        /**
         * CustomService class
         * Extends BaseService and adds custom methods for a specific endpoint.
         */
        class CustomService extends BaseService {
            constructor() {
                super(endpoint);
                
                // Add custom methods
                Object.entries(customMethods).forEach(([name, method]) => {
                    this[name] = method.bind(this);
                });
            }
        }
        
        return new CustomService();
    }
}

// Export all services as a single object for convenience
export const services = {
    http: httpClient,
    customer: customerService,
    financial: financialService,
    auth: authService,
    validation: validationService
};

export default services;