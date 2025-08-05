import React, { useState, useEffect, useCallback, useMemo } from "react";

import { CUSTOMER_DIALOG } from "@/Constants/Business/customers";
import { useFormValidation } from "./hooks/useFormValidation";
import {
    CustomerValidationSchema,
    CustomValidations,
} from "./utils/validation";
import { useCustomerForm } from "./hooks/useCustomerForm";
import { useUndoTimer } from "./hooks/useUndoTimer";
import { useCustomerSubmission } from "./hooks/useCustomerSubmission";
import { notifications } from "@/utils/notifications";

import Dialog from "@/Components/Common/Dialog";
import TabNavigation from "./components/TabNavigation";
import ManualEntryForm from "./components/ManualEntryForm";
import UnifiedImportTab from "./components/UnifiedImportTab";
import DialogFooter from "./components/DialogFooter";

/**
 * Optimized CustomerDialog component for adding/editing customers.
 * Features:
 * - Clean separation of concerns with custom hooks
 * - Optimized re-renders with useMemo and useCallback
 * - Better error handling and validation flow
 * - Undo functionality with timer
 * - Multi-tab interface (Manual, Excel, PDF import)
 *
 * @param {boolean} isModalOpen - Whether the modal is currently open
 * @param {function} setIsModalOpen - Function to control modal visibility
 * @param {Object} customer - Optional customer object for editing mode
 * @param {function} onAddCustomer - Callback when customer is successfully added/updated
 */
export default function CustomerDialog({
    isModalOpen,
    setIsModalOpen,
    customer,
    onAddCustomer,
}) {
    // Constants
    const TAB_TYPES = {
        MANUAL: 'manual',
        IMPORT: 'import'
    };

    // State management
    const [activeTab, setActiveTab] = useState(TAB_TYPES.MANUAL);
    
    // Custom hooks for clean separation of concerns
    const {
        customer: formCustomer,
        handleInputChange,
        handleCheckboxChange,
        resetForm,
        createEmptyCustomer,
        isEditMode,
        setCustomer: setFormCustomer,
    } = useCustomerForm(customer);

    const {
        showTimer: showUndoTimer,
        timeLeft: undoTimeLeft,
        startUndoTimer,
        executeUndo,
    } = useUndoTimer();

    const {
        isLoading,
        submitError,
        submitCustomer,
        importCustomers,
        clearError,
    } = useCustomerSubmission();

    // Form validation hook
    const validation = useFormValidation(CustomerValidationSchema, [
        CustomValidations.validateCustomerName,
        CustomValidations.validateBusinessFields,
    ]);

    // Reset form and validation when modal opens
    useEffect(() => {
        if (isModalOpen) {
            validation.clearAllErrors();
            clearError();
        }
    }, [isModalOpen]); // Remove unstable dependencies

    // Memoized handlers to prevent unnecessary re-renders
    const handleClearForm = useCallback(() => {
        startUndoTimer({ ...formCustomer });
        const emptyCustomer = createEmptyCustomer();
        setFormCustomer(emptyCustomer);
        validation.clearAllErrors();
        clearError();
    }, [formCustomer, startUndoTimer, createEmptyCustomer, setFormCustomer]); // Remove unstable validation and clearError

    const handleUndo = useCallback(() => {
        const restoredState = executeUndo();
        if (restoredState) {
            setFormCustomer(restoredState);
            validation.clearAllErrors();
        }
    }, [executeUndo, setFormCustomer]); // Remove unstable validation

    // Optimized form submission handler
    const handleSubmit = useCallback(async (e) => {
        e?.preventDefault();
        clearError();

        // Mark all fields as touched and validate
        Object.keys(CustomerValidationSchema).forEach((field) => {
            validation.markFieldTouched(field);
        });

        const validationErrors = validation.validateAllFields(formCustomer);

        if (Object.keys(validationErrors).length > 0) {
            notifications.error("Please fix the validation errors before submitting");
            return;
        }

        try {
            const result = await submitCustomer(formCustomer, isEditMode);
            
            // Notify parent component
            onAddCustomer?.(result);
            
            // Reset and close
            resetForm();
            setIsModalOpen(false);
        } catch (error) {
            // Error handling is done in the hook
        }
    }, [formCustomer, isEditMode, submitCustomer, onAddCustomer, resetForm, setIsModalOpen]); // Remove unstable dependencies

    // Handle import success from unified import component
    const handleImportSuccess = useCallback((result) => {
        // Notify parent component with import result
        onAddCustomer?.({
            action: "import",
            count: result.imported || 0,
            result
        });
        
        // Close dialog after successful import
        setIsModalOpen(false);
    }, [onAddCustomer, setIsModalOpen]);

    // Memoized computed values to prevent unnecessary re-renders
    const hasValidationErrors = useMemo(() => 
        Object.keys(validation.errors).some(key => validation.errors[key]),
        [validation.errors]
    );
    
    const touchedFields = useMemo(() => 
        Object.keys(validation.touched).length > 0,
        [validation.touched]
    );
    
    const dialogTitle = useMemo(() => 
        isEditMode ? "Edit Customer" : "Add New Customer",
        [isEditMode]
    );
    
    const handleCloseDialog = useCallback(() => {
        setIsModalOpen(false);
    }, [setIsModalOpen]);
    return (
        <Dialog
            isOpen={isModalOpen}
            onClose={handleCloseDialog}
            title={dialogTitle}
            size="large"
        >
            {/* Tabs */}
            <div className="border-b border-gray-200">
                <TabNavigation
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />
            </div>

            <div className="p-6">
                {/* Validation Summary */}
                {hasValidationErrors && touchedFields && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                        <h5 className="text-red-800 font-medium mb-2">
                            Please fix the following errors:
                        </h5>
                        <ul className="text-red-700 text-sm space-y-1">
                            {Object.entries(validation.errors)
                                .filter(([field, error]) => error) // Only show actual errors
                                .map(([field, error]) => (
                                    <li key={field}>• {error}</li>
                                ))}
                        </ul>
                    </div>
                )}

                {/* Error message display */}
                {!hasValidationErrors && !touchedFields && submitError && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                        <h5 className="text-red-800 font-medium mb-2">
                            {submitError}
                        </h5>
                    </div>
                )}

                {/* Manual Entry Tab */}
                {activeTab === TAB_TYPES.MANUAL && (
                    <ManualEntryForm
                        newCustomer={formCustomer}
                        handleInputChange={handleInputChange}
                        handleCheckboxChange={handleCheckboxChange}
                        handleSubmit={handleSubmit}
                        validation={validation}
                    />
                )}

                {/* Unified Import Tab */}
                {activeTab === TAB_TYPES.IMPORT && (
                    <UnifiedImportTab onImportSuccess={handleImportSuccess} />
                )}
            </div>

            {/* Footer with action buttons - Fixed at bottom */}
            <div className="border-t border-gray-200 flex-shrink-0">
                <DialogFooter
                    {...{
                        handleUndo,
                        handleClearForm,
                        handleSubmit,
                        activeTab,
                        showUndoTimer,
                        undoTimeLeft,
                        setIsModalOpen,
                        isLoading,
                        isFormValid: validation.isValid,
                    }}
                />
            </div>
        </Dialog>
    );
}
