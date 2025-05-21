import React from "react";

/**
 * Renders a section for customer details, consisting of a select field for customer type and a checkbox for
 * active/inactive status.
 * 
 * @param {Object} props
 * @param {Object} props.newCustomer - The customer object containing details to populate the form fields.
 * @param {Function} props.handleInputChange - Handler for input change events to update customer data.
 * @param {Function} props.handleCheckboxChange - Handler for checkbox change events to update customer status.
 */
export default function CustomerDetailsSection( { newCustomer, handleInputChange, handleCheckboxChange } ) {
    return (
        <>
            {/* Customer Type and Status */}
            <div className="customer-dialog-section">
                <h4 className="customer-dialog-section-title">
                    Customer Details
                </h4>
                <div className="customer-dialog-section-grid customer-dialog-section-grid-2col">
                    <div>
                        <label
                            htmlFor="customerType"
                            className="customer-dialog-field-label"
                        >
                            Customer Type
                        </label>
                        <select
                            id="customerType"
                            name="customerType"
                            value={newCustomer.customerType || "Individual"}
                            onChange={handleInputChange}
                            className="customer-dialog-field-input"
                        >
                            <option value="Individual">Individual</option>
                            <option value="Corporate">Corporate</option>
                            <option value="Retailer">Retailer</option>
                            <option value="Distributor">Distributor</option>
                        </select>
                    </div>
                    <div className="flex items-center mt-8">
                        <input
                            id="isActive"
                            name="isActive"
                            type="checkbox"
                            checked={newCustomer.isActive || false}
                            onChange={handleCheckboxChange}
                            className="customer-dialog-field-checkbox"
                        />
                        <label
                            htmlFor="isActive"
                            className="customer-dialog-field-checkbox-label"
                        >
                            Active Customer
                        </label>
                    </div>
                </div>
            </div>
        </>
    );
}
