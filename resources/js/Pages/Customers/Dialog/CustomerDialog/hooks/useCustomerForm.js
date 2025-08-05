import { useState, useEffect, useCallback, useMemo } from 'react';
import { CUSTOMER_TYPES } from '@/Constants/Business/customers';

/**
 * Custom hook for managing customer form state and operations
 * @param {Object} initialCustomer - Initial customer data for editing
 * @returns {Object} Form state and handlers
 */
export const useCustomerForm = (initialCustomer = null) => {
    // Create stable empty customer template
    const emptyCustomerTemplate = useMemo(() => ({
        id: "",
        firstName: "",
        lastName: "",
        companyName: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        stateCode: "",
        country: "",
        countryCode: "",
        pinCode: "",
        phone: "",
        alternatePhone: "",
        email: "",
        gstin: "",
        pan: "",
        customerType: CUSTOMER_TYPES.INDIVIDUAL,
        isActive: true,
        createdAt: "",
        updatedAt: "",
    }), []);

    // Create empty customer with current timestamp
    const createEmptyCustomer = useCallback(() => {
        const now = new Date().toISOString();
        return {
            ...emptyCustomerTemplate,
            createdAt: now,
            updatedAt: now,
        };
    }, [emptyCustomerTemplate]);

    const [customer, setCustomer] = useState(() => 
        initialCustomer || createEmptyCustomer()
    );

    // Reset form when initial customer changes (only when modal opens/closes or customer prop changes)
    useEffect(() => {
        if (initialCustomer) {
            setCustomer(initialCustomer);
        } else {
            setCustomer(createEmptyCustomer());
        }
    }, [initialCustomer?.id, createEmptyCustomer]); // Only depend on customer ID to avoid unnecessary resets

    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        setCustomer(prev => ({
            ...prev,
            [name]: value,
        }));
    }, []);

    const handleCheckboxChange = useCallback((e) => {
        const { name, checked } = e.target;
        setCustomer(prev => ({
            ...prev,
            [name]: checked,
        }));
    }, []);

    const resetForm = useCallback(() => {
        setCustomer(createEmptyCustomer());
    }, [createEmptyCustomer]);

    const isEditMode = Boolean(customer.id);

    return {
        customer,
        setCustomer,
        handleInputChange,
        handleCheckboxChange,
        resetForm,
        createEmptyCustomer,
        isEditMode,
    };
};