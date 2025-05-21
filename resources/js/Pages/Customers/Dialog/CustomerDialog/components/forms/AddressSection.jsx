import React from "react";

/**
 * Renders a section for entering customer address information, containing
 * fields for address line 1, address line 2, country, country code, PIN code,
 * city, state, and state code. The section is a part of the manual entry form
 * for customer data.
 *
 * @param {Object} props
 * @param {Object} props.newCustomer - The customer object containing details to
 *                                      populate the form fields.
 * @param {Function} props.handleInputChange - Handler for input change events to
 *                                            update customer data.
 */
export default function AddressSection( { newCustomer, handleInputChange } ) {
    return (
        <>
            {/* Address Information */}
            <div className="customer-dialog-section">
                <h4 className="customer-dialog-section-title">Address</h4>
                <div className="customer-dialog-section-grid customer-dialog-section-grid-1col">
                    <div>
                        <label
                            htmlFor="addressLine1"
                            className="customer-dialog-field-label"
                        >
                            Address Line 1*
                        </label>
                        <input
                            type="text"
                            name="addressLine1"
                            id="addressLine1"
                            required
                            value={newCustomer.addressLine1 || ""}
                            onChange={handleInputChange}
                            className="customer-dialog-field-input"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="addressLine2"
                            className="customer-dialog-field-label"
                        >
                            Address Line 2
                        </label>
                        <input
                            type="text"
                            name="addressLine2"
                            id="addressLine2"
                            value={newCustomer.addressLine2 || ""}
                            onChange={handleInputChange}
                            className="customer-dialog-field-input"
                        />
                    </div>
                </div>

                <div className="customer-dialog-section-grid customer-dialog-section-grid-3col mt-4">
                    <div>
                        <label
                            htmlFor="country"
                            className="customer-dialog-field-label"
                        >
                            Country*
                        </label>
                        <input
                            type="text"
                            name="country"
                            id="country"
                            required
                            value={newCustomer.country || ""}
                            onChange={handleInputChange}
                            className="customer-dialog-field-input"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="countryCode"
                            className="customer-dialog-field-label"
                        >
                            Country Code
                        </label>
                        <input
                            type="text"
                            name="countryCode"
                            id="countryCode"
                            value={newCustomer.countryCode || ""}
                            onChange={handleInputChange}
                            className="customer-dialog-field-input"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="pinCode"
                            className="customer-dialog-field-label"
                        >
                            PIN Code*
                        </label>
                        <input
                            type="text"
                            name="pinCode"
                            id="pinCode"
                            required
                            value={newCustomer.pinCode || ""}
                            onChange={handleInputChange}
                            className="customer-dialog-field-input"
                        />
                    </div>
                </div>
                <div className="customer-dialog-section-grid customer-dialog-section-grid-3col mt-4">
                    <div>
                        <label
                            htmlFor="city"
                            className="customer-dialog-field-label"
                        >
                            City*
                        </label>
                        <input
                            type="text"
                            name="city"
                            id="city"
                            required
                            value={newCustomer.city || ""}
                            onChange={handleInputChange}
                            className="customer-dialog-field-input"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="state"
                            className="customer-dialog-field-label"
                        >
                            State*
                        </label>
                        <input
                            type="text"
                            name="state"
                            id="state"
                            required
                            value={newCustomer.state || ""}
                            onChange={handleInputChange}
                            className="customer-dialog-field-input"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="stateCode"
                            className="customer-dialog-field-label"
                        >
                            State Code
                        </label>
                        <input
                            type="text"
                            name="stateCode"
                            id="stateCode"
                            value={newCustomer.stateCode || ""}
                            onChange={handleInputChange}
                            className="customer-dialog-field-input"
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
