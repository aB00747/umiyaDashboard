import { useState, useCallback, useMemo } from 'react';
import { notifications } from '@/utils/notifications';
import { CUSTOMER_DIALOG } from '@/Constants/Business/customers';
import CustomerAPI from '@/Services/api/CustomerAPI';

/**
 * Custom hook for handling customer form submission and API operations
 * @returns {Object} Submission state and handlers
 */
export const useCustomerSubmission = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [submitError, setSubmitError] = useState(null);

    // Transform form data to API format - use useMemo to make it stable
    const transformCustomerData = useMemo(() => (customer) => ({
        first_name: customer.firstName,
        last_name: customer.lastName,
        company_name: customer.companyName,
        address_line1: customer.addressLine1,
        address_line2: customer.addressLine2,
        city: customer.city,
        state: customer.state,
        state_code: customer.stateCode,
        country: customer.country,
        country_code: customer.countryCode,
        pin_code: customer.pinCode,
        phone: customer.phone,
        alternate_phone: customer.alternatePhone,
        email: customer.email,
        gstin: customer.gstin,
        pan: customer.pan,
        customer_type: customer.customerType,
        is_active: customer.isActive,
    }), []);

    const submitCustomer = useCallback(async (customer, isEditMode = false) => {
        setSubmitError(null);
        setIsLoading(true);

        const loadingToast = notifications.loading(
            isEditMode ? "Updating customer..." : "Creating customer..."
        );

        try {
            const customerData = transformCustomerData(customer);
            let result;

            if (isEditMode) {
                result = await CustomerAPI.update(customer.id, customerData);
                notifications.dismiss(loadingToast);
                notifications.apiSuccess("update", "Customer");
            } else {
                result = await CustomerAPI.create(customerData);
                notifications.dismiss(loadingToast);
                notifications.apiSuccess("create", "Customer");
            }

            return result;
        } catch (error) {
            console.error("Error saving customer:", error);
            
            notifications.dismiss(loadingToast);
            const action = isEditMode ? "update" : "create";
            notifications.apiError(action, error, "Customer");
            
            setSubmitError(
                CUSTOMER_DIALOG.ERROR_SAVE + ": " + (error.message || "Unknown error")
            );
            
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [transformCustomerData]);

    const importCustomers = useCallback(async (file) => {
        setSubmitError(null);
        setIsLoading(true);

        const loadingToast = notifications.loading("Importing customers from Excel...");

        try {
            const result = await CustomerAPI.importCustomers(file);
            
            notifications.dismiss(loadingToast);
            
            const importedCount = result.imported || 0;
            notifications.success(
                `Successfully imported ${importedCount} customer${
                    importedCount !== 1 ? "s" : ""
                }!`,
                { duration: 5000 }
            );

            return result;
        } catch (error) {
            console.error("Error importing customers:", error);
            
            notifications.dismiss(loadingToast);
            notifications.apiError("import", error, "Customers");
            
            setSubmitError(
                CUSTOMER_DIALOG.ERROR_IMPORT + ": " + (error.message || "Unknown error")
            );
            
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const clearError = useCallback(() => {
        setSubmitError(null);
    }, []);

    return {
        isLoading,
        submitError,
        submitCustomer,
        importCustomers,
        clearError,
    };
};