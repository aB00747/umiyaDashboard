import React from "react";
import FormField from "../FormField";

/**
 * Renders a section for customer details, consisting of a select field for customer type and a checkbox for
 * active/inactive status.
 *
 * @param {Object} props
 * @param {Object} props.newCustomer - The customer object containing details to populate the form fields.
 * @param {Function} props.handleInputChange - Handler for input change events to update customer data.
 * @param {Function} props.handleCheckboxChange - Handler for checkbox change events to update customer status.
 */
export default function CustomerDetailsSection({
    newCustomer,
    handleInputChange,
    handleCheckboxChange,
    validation,
}) {
    const handleFieldChange = (e) => {
        const { name, value } = e.target;
        handleInputChange(e);
        validation.validateSingleField(name, value, newCustomer);
    };

    const handleFieldBlur = (e) => {
        const { name } = e.target;
        validation.markFieldTouched(name);
    };

    return (
        <>
            {/* Customer Type and Status */}
            <div className="customer-dialog-section">
                <h4 className="customer-dialog-section-title">
                    Customer Details
                </h4>
                <div className="customer-dialog-section-grid customer-dialog-section-grid-2col">
                    <FormField
                        name="customerType"
                        label="Customer Type"
                        value={newCustomer.customerType}
                        onChange={handleFieldChange}
                        onBlur={handleFieldBlur}
                        error={validation.getFieldError("customerType")}
                        touched={validation.touched.customerType}
                    >
                        <select>
                            <option value="Individual">Individual</option>
                            <option value="Corporate">Corporate</option>
                            <option value="Retailer">Retailer</option>
                            <option value="Distributor">Distributor</option>
                        </select>
                    </FormField>

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
