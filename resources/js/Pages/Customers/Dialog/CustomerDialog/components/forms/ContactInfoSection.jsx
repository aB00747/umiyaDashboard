import React from "react";
import FormField from "../FormField";

/**
 * Renders a section for contact information, consisting of two input fields for phone number and alternate phone number.
 *
 * @param {Object} props
 * @param {Object} props.newCustomer - The customer object containing details to populate the form fields.
 * @param {Function} props.handleInputChange - Handler for input change events to update customer data.
 */
export default function ContactInfoSection({
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
            {/* Contact Information */}
            <div className="customer-dialog-section">
                <h4 className="customer-dialog-section-title">
                    Contact Information
                </h4>
                <div className="customer-dialog-section-grid customer-dialog-section-grid-2col">
                    <FormField
                        type="tel"
                        name="phone"
                        label="Phone"
                        value={newCustomer.phone}
                        onChange={handleFieldChange}
                        onBlur={handleFieldBlur}
                        required
                        error={validation.getFieldError("phone")}
                        touched={validation.touched.phone}
                    />

                    <FormField
                        type="tel"
                        name="alternatePhone"
                        label="Alternate Phone"
                        value={newCustomer.alternatePhone}
                        onChange={handleFieldChange}
                        onBlur={handleFieldBlur}
                        error={validation.getFieldError("alternatePhone")}
                        touched={validation.touched.alternatePhone}
                    />
                </div>
            </div>
        </>
    );
}
