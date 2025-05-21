import React, { useState, useEffect } from "react";

import DialgoHeader from "./components/DialogHeader";
import TabNavigation from "./components/TabNavigation";
import ManualEntryForm from "./components/ManualEntryForm";
import ExcelImportTab from "./components/ExcelImportTab";
import PdfImportTab from "./components/PdfImportTab";
import DialogFooter from "./components/DialogFooter";

import CustomerAPI from "@/Services/api/CustomerAPI";

/**
 * CustomerDialog is a modal dialog for adding new customers to the database.
 * It renders a modal overlay with a container div that contains the dialog
 * header, tabs, form content, and footer. The header contains a close button,
 * while the tabs allow the user to switch between manual entry, Excel import, and PDF import modes.
 * The form content is rendered based on the active tab, and the footer contains
 * action buttons for submitting the form, clearing the form, and undoing the
 * last clear action.
 *
 * @param {boolean} isModalOpen - Whether the modal is currently open.
 * @param {function} setIsModalOpen - Function to call to open or close the modal.
 * @param {Object} newCustomer - The customer object to be edited or added.
 * @param {function} setNewCustomer - Function to call to update the customer data.
 * @param {function} onAddCustomer - Function to call when the form is submitted.
 *
 * @returns {ReactElement} The rendered CustomerDialog component.
 */
export default function CustomerDialog({
    isModalOpen,
    setIsModalOpen,
    newCustomer,
    setNewCustomer,
    onAddCustomer,
}) {
    // Add state for active tab
    const [activeTab, setActiveTab] = useState("manual");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // State for undo functionality
    const [previousCustomerState, setPreviousCustomerState] = useState(null);
    const [showUndoTimer, setShowUndoTimer] = useState(false);
    const [undoTimeLeft, setUndoTimeLeft] = useState(5);
    const [undoTimerId, setUndoTimerId] = useState(null);

    // Initialize with all fields from the database schema
    const initializeCustomer = () => ({
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
        customerType: "Individual",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    });

    // Reset customer function with undo capability
    const handleClearForm = () => {
        // Save current state for possible undo
        setPreviousCustomerState({ ...newCustomer });

        // Clear the form
        setNewCustomer(initializeCustomer());

        // Show undo timer
        setShowUndoTimer(true);
        setUndoTimeLeft(5);

        // Start countdown timer
        const timerId = setInterval(() => {
            setUndoTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timerId);
                    setShowUndoTimer(false);
                    setPreviousCustomerState(null);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        setUndoTimerId(timerId);
    };

    const handleUndo = () => {
        if (previousCustomerState) {
            setNewCustomer(previousCustomerState);
            setPreviousCustomerState(null);
        }

        if (undoTimerId) {
            clearInterval(undoTimerId);
            setUndoTimerId(null);
        }

        setShowUndoTimer(false);
    };

    // Clean up timer on unmount
    useEffect(() => {
        return () => {
            if (undoTimerId) {
                clearInterval(undoTimerId);
            }
        };
    }, [undoTimerId]);

    const showNotification = (message, type = "info") => {
        // You can implement this based on your UI framework
        // For example, if you have a toast notification system
        if (window.toast) {
            window.toast({
                message,
                type,
                duration: 3000,
            });
        } else {
            // Fallback to console
            console.log(`${type.toUpperCase()}: ${message}`);
        }
    };

    // Reset customer function
    const resetCustomer = () => {
        setNewCustomer(initializeCustomer());
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewCustomer((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setNewCustomer((prevState) => ({
            ...prevState,
            [name]: checked,
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        setError(null);

        try {
            setIsLoading(true);

            if (!newCustomer.firstName && !newCustomer.companyName) {
                setError("Please provide either a first name or company name");
                setIsLoading(false);
                return;
            }

            const customerData = {
                first_name: newCustomer.firstName,
                last_name: newCustomer.lastName,
                company_name: newCustomer.companyName,
                address_line1: newCustomer.addressLine1,
                address_line2: newCustomer.addressLine2,
                city: newCustomer.city,
                state: newCustomer.state,
                state_code: newCustomer.stateCode,
                country: newCustomer.country,
                country_code: newCustomer.countryCode,
                pin_code: newCustomer.pinCode,
                phone: newCustomer.phone,
                alternate_phone: newCustomer.alternatePhone,
                email: newCustomer.email,
                gstin: newCustomer.gstin,
                pan: newCustomer.pan,
                customer_type: newCustomer.customerType,
                is_active: newCustomer.isActive,
            };

            let result;
            if (newCustomer.id && newCustomer.id !== "") {
                // Update existing customer
                result = await CustomerAPI.update(newCustomer.id, customerData);

                // Notify user of success
                showNotification("Customer updated successfully", "success");
            } else {
                // Create new customer
                result = await CustomerAPI.create(customerData);

                // Notify user of success
                showNotification("Customer added successfully", "success");
            }

            // Call the parent component's onAddCustomer function with the response data
            // if (onAddCustomer) {
            //     onAddCustomer(result);
            // }

            // Reset form and close modal
            resetCustomer();
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error saving customer:", error);
            setError(
                "Failed to save customer: " + (error.message || "Unknown error")
            );
        } finally {
            setIsLoading(false);
        }
    };

    // Handle file upload for Excel
    const handleExcelUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        setIsLoading(true);
        setError(null);
        
        try {
            // Use the CustomerAPI import function
            const result = await CustomerAPI.importCustomers(file);
            
            // Show success message
            showNotification(`Successfully imported ${result.imported || 0} customers`, "success");
            
            // Close the dialog and refresh
            if (onAddCustomer) {
                onAddCustomer({ action: 'import', count: result.imported || 0 });
            }
            
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error importing customers:", error);
            setError("Failed to import customers: " + (error.message || "Unknown error"));
        } finally {
            setIsLoading(false);
        }
    };

    // Handle file upload for PDF
    const handlePdfUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        setError("PDF import functionality is not yet implemented");
        
        // Logic for processing PDF would go here
        console.log("PDF file uploaded:", file);
    };

    return (
        <div className="customer-dialog-overlay">
            <div className="customer-dialog-container">
                {/* Header */}
                <DialgoHeader setIsModalOpen={setIsModalOpen} />

                {/* Tabs */}
                <TabNavigation
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />

                <div className="customer-dialog-content">
                    {/* Error message display */}
                    {error && (
                        <div className="error-message text-red-700">
                            {error}
                        </div>
                    )}
                    {/* Manual Entry Tab */}
                    {activeTab === "manual" && (
                        <ManualEntryForm
                            newCustomer={newCustomer}
                            handleInputChange={handleInputChange}
                            handleCheckboxChange={handleCheckboxChange}
                            handleSubmit={handleSubmit}
                        />
                    )}

                    {/* Excel Import Tab */}
                    {activeTab === "excel" && (
                        <ExcelImportTab handleExcelUpload={handleExcelUpload} />
                    )}

                    {/* PDF Import Tab */}
                    {activeTab === "pdf" && (
                        <PdfImportTab handlePdfUpload={handlePdfUpload} />
                    )}
                </div>

                {/* Footer with action buttons */}
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
                        error,
                    }}
                />
            </div>
        </div>
    );
}
