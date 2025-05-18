import React from "react";

/**
 * Renders a section for contact information, consisting of two input fields for phone number and alternate phone number.
 * 
 * @param {Object} props
 * @param {Object} props.newCustomer - The customer object containing details to populate the form fields.
 * @param {Function} props.handleInputChange - Handler for input change events to update customer data.
 */
export default function ContactInfoSection( { newCustomer, handleInputChange } ) {
    return (
        <>
            {/* Contact Information */}
            <div className="customer-dialog-section">
                <h4 className="customer-dialog-section-title">
                    Contact Information
                </h4>
                <div className="customer-dialog-section-grid customer-dialog-section-grid-2col">
                    <div>
                        <label
                            htmlFor="phone"
                            className="customer-dialog-field-label"
                        >
                            Phone*
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            id="phone"
                            required
                            value={newCustomer.phone || ""}
                            onChange={handleInputChange}
                            className="customer-dialog-field-input"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="alternatePhone"
                            className="customer-dialog-field-label"
                        >
                            Alternate Phone
                        </label>
                        <input
                            type="tel"
                            name="alternatePhone"
                            id="alternatePhone"
                            value={newCustomer.alternatePhone || ""}
                            onChange={handleInputChange}
                            className="customer-dialog-field-input"
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
