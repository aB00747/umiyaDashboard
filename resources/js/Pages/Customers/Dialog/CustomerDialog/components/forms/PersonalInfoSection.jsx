import React from "react";

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

export default function PersonalInfoSection({ newCustomer, handleInputChange }) {
    return (
        <>
            {/* Personal Information */}
            <div className="customer-dialog-section">
                <h4 className="customer-dialog-section-title">
                    Personal Information
                </h4>
                <div className="customer-dialog-section-grid customer-dialog-section-grid-2col">
                    <div>
                        <label
                            htmlFor="firstName"
                            className="customer-dialog-field-label"
                        >
                            First Name*
                        </label>
                        <input
                            type="text"
                            name="firstName"
                            id="firstName"
                            required
                            value={newCustomer.firstName || ""}
                            onChange={handleInputChange}
                            className="customer-dialog-field-input"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="lastName"
                            className="customer-dialog-field-label"
                        >
                            Last Name*
                        </label>
                        <input
                            type="text"
                            name="lastName"
                            id="lastName"
                            required
                            value={newCustomer.lastName || ""}
                            onChange={handleInputChange}
                            className="customer-dialog-field-input"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="companyName"
                            className="customer-dialog-field-label"
                        >
                            Company Name
                        </label>
                        <input
                            type="text"
                            name="companyName"
                            id="companyName"
                            value={newCustomer.companyName || ""}
                            onChange={handleInputChange}
                            className="customer-dialog-field-input"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="email"
                            className="customer-dialog-field-label"
                        >
                            Email*
                        </label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            required
                            value={newCustomer.email || ""}
                            onChange={handleInputChange}
                            className="customer-dialog-field-input"
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
