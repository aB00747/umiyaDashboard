import React from "react";
import FormField from "../FormField";

/**
 * Renders a section for entering customer business information, containing
 * fields for GSTIN and PAN. The section is a part of the manual entry form
 * for customer data.
 *
 * @param {Object} props
 * @param {Object} props.newCustomer - The customer object containing details to
 *                                      populate the form fields.
 * @param {Function} props.handleInputChange - Handler for input change events to
 *                                            update customer data.
 */
export default function BusinessInfoSection({
    newCustomer,
    handleInputChange,
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
            {/* Business Information */}
            <div className="customer-dialog-section">
                <h4 className="customer-dialog-section-title">
                    Business Information
                </h4>
                <div className="customer-dialog-section-grid customer-dialog-section-grid-2col">
                    <FormField
                        name="gstin"
                        label="GSTIN"
                        value={newCustomer.gstin}
                        onChange={handleFieldChange}
                        onBlur={handleFieldBlur}
                        error={validation.getFieldError("gstin")}
                        touched={validation.touched.gstin}
                        placeholder="22AAAAA0000A1Z5"
                    />

                    <FormField
                        name="pan"
                        label="PAN"
                        value={newCustomer.pan}
                        onChange={handleFieldChange}
                        onBlur={handleFieldBlur}
                        error={validation.getFieldError("pan")}
                        touched={validation.touched.pan}
                        placeholder="ABCDE1234F"
                    />
                </div>
            </div>
        </>
    );
}
