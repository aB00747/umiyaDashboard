import React from "react";

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
export default function BusinessInfoSection( { newCustomer, handleInputChange } ) {
    return (
        <>
            {/* Business Information */}
            <div className="customer-dialog-section">
                <h4 className="customer-dialog-section-title">
                    Business Information
                </h4>
                <div className="customer-dialog-section-grid customer-dialog-section-grid-2col">
                    <div>
                        <label
                            htmlFor="gstin"
                            className="customer-dialog-field-label"
                        >
                            GSTIN
                        </label>
                        <input
                            type="text"
                            name="gstin"
                            id="gstin"
                            value={newCustomer.gstin || ""}
                            onChange={handleInputChange}
                            className="customer-dialog-field-input"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="pan"
                            className="customer-dialog-field-label"
                        >
                            PAN
                        </label>
                        <input
                            type="text"
                            name="pan"
                            id="pan"
                            value={newCustomer.pan || ""}
                            onChange={handleInputChange}
                            className="customer-dialog-field-input"
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
