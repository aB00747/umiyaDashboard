import React from "react";
import FormField from "../FormField";

/**
 * PersonalInfoSection
 *
 * This component renders a section of the customer dialog form dedicated to personal information.
 * It includes input fields for first name, last name, company name, and email.
 *
 * @param {Object} props - The component properties.
 * @param {Object} props.newCustomer - The customer object containing the current values for the input fields.
 * @param {Function} props.handleInputChange - The handler function for updating customer data when input values change.
 */

export default function PersonalInfoSection({
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
            {/* Personal Information */}
            <div className="customer-dialog-section">
                <h4 className="customer-dialog-section-title">
                    Personal Information
                </h4>
                <div className="customer-dialog-section-grid customer-dialog-section-grid-2col">
                    <FormField
                        name="firstName"
                        label="First Name"
                        value={newCustomer.firstName}
                        onChange={handleFieldChange}
                        onBlur={handleFieldBlur}
                        required
                        error={validation.getFieldError("firstName")}
                        touched={validation.touched.firstName}
                    />

                    <FormField
                        name="lastName"
                        label="Last Name"
                        value={newCustomer.lastName}
                        onChange={handleFieldChange}
                        onBlur={handleFieldBlur}
                        required
                        error={validation.getFieldError("lastName")}
                        touched={validation.touched.lastName}
                    />

                    <FormField
                        name="companyName"
                        label="Company Name"
                        value={newCustomer.companyName}
                        onChange={handleFieldChange}
                        onBlur={handleFieldBlur}
                        // required
                        error={validation.getFieldError("companyName")}
                        touched={validation.touched.companyName}
                    />

                    <FormField
                        type="email"
                        name="email"
                        label="Email"
                        value={newCustomer.email}
                        onChange={handleFieldChange}
                        onBlur={handleFieldBlur}
                        required
                        error={validation.getFieldError("email")}
                        touched={validation.touched.email}
                    />
                </div>
            </div>
        </>
    );
}
