import React from "react";
import Requiredstar from "./Requiredstar";
import FormField from "../FormField";

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
export default function AddressSection({
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
            {/* Address Information */}
            <div className="customer-dialog-section">
                <h4 className="customer-dialog-section-title">Address</h4>
                <div className="customer-dialog-section-grid customer-dialog-section-grid-1col">
                    <FormField
                        name="addressLine1"
                        label="Address Line 1"
                        value={newCustomer.addressLine1}
                        onChange={handleFieldChange}
                        onBlur={handleFieldBlur}
                        required
                        error={validation.getFieldError("addressLine1")}
                        touched={validation.touched.addressLine1}
                    />

                    <FormField
                        name="addressLine2"
                        label="Address Line 2"
                        value={newCustomer.addressLine2}
                        onChange={handleFieldChange}
                        onBlur={handleFieldBlur}
                        error={validation.getFieldError("addressLine2")}
                        touched={validation.touched.addressLine2}
                    />
                </div>

                <div className="customer-dialog-section-grid customer-dialog-section-grid-3col mt-4">
                    <FormField
                        name="country"
                        label="Country"
                        value={newCustomer.country}
                        onChange={handleFieldChange}
                        onBlur={handleFieldBlur}
                        required
                        error={validation.getFieldError("country")}
                        touched={validation.touched.country}
                    />

                    <FormField
                        name="countryCode"
                        label="Country Code"
                        value={newCustomer.countryCode}
                        onChange={handleFieldChange}
                        onBlur={handleFieldBlur}
                        error={validation.getFieldError("countryCode")}
                        touched={validation.touched.countryCode}
                        placeholder="IN"
                    />

                    <FormField
                        name="pinCode"
                        label="PIN Code"
                        value={newCustomer.pinCode}
                        onChange={handleFieldChange}
                        onBlur={handleFieldBlur}
                        required
                        error={validation.getFieldError("pinCode")}
                        touched={validation.touched.pinCode}
                    />
                </div>
                <div className="customer-dialog-section-grid customer-dialog-section-grid-3col mt-4">
                    <FormField
                        name="city"
                        label="City"
                        value={newCustomer.city}
                        onChange={handleFieldChange}
                        onBlur={handleFieldBlur}
                        required
                        error={validation.getFieldError("city")}
                        touched={validation.touched.city}
                    />

                    <FormField
                        name="state"
                        label="State"
                        value={newCustomer.state}
                        onChange={handleFieldChange}
                        onBlur={handleFieldBlur}
                        required
                        error={validation.getFieldError("state")}
                        touched={validation.touched.state}
                    />

                    <FormField
                        name="stateCode"
                        label="State Code"
                        value={newCustomer.stateCode}
                        onChange={handleFieldChange}
                        onBlur={handleFieldBlur}
                        error={validation.getFieldError("stateCode")}
                        touched={validation.touched.stateCode}
                        placeholder="CA"
                    />
                </div>
            </div>
        </>
    );
}
