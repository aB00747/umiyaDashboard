import React from "react";

import PersonalInfoSection from "./forms/PersonalInfoSection";
import AddressSection from "./forms/AddressSection";
import BusinessInfoSection from "./forms/BusinessInfoSection";
import ContactInfoSection from "./forms/ContactInfoSection";
import CustomerDetailsSection from "./forms/CustomerDetailsSection";

/**
 * Renders a manual entry form for customer data, consisting of multiple sections
 * for personal, contact, address, business information, and customer details.
 *
 * @param {Object} props
 * @param {Object} props.newCustomer - The customer object containing details to populate the form fields.
 * @param {Function} props.handleInputChange - Handler for input change events to update customer data.
 * @param {Function} props.handleCheckboxChange - Handler for checkbox change events to update customer status.
 * @param {Function} props.handleSubmit - Handler for form submission to process customer data.
 */

export default function ManualEntryForm({
    newCustomer,
    handleInputChange,
    handleCheckboxChange,
    handleSubmit,
}) {
    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="hidden" name="id" value={newCustomer.id || ""} />

                {/* Personal Information */}
                <PersonalInfoSection
                    newCustomer={newCustomer}
                    handleInputChange={handleInputChange}
                />

                {/* Contact Information */}
                <ContactInfoSection
                    newCustomer={newCustomer}
                    handleInputChange={handleInputChange}
                />

                {/* Address Information */}
                <AddressSection
                    newCustomer={newCustomer}
                    handleInputChange={handleInputChange}
                />

                {/* Business Information */}
                <BusinessInfoSection
                    newCustomer={newCustomer}
                    handleInputChange={handleInputChange}
                />

                {/* Customer Type and Status */}
                <CustomerDetailsSection
                    newCustomer={newCustomer}
                    handleInputChange={handleInputChange}
                    handleCheckboxChange={handleCheckboxChange}
                />
            </form>
        </>
    );
}
