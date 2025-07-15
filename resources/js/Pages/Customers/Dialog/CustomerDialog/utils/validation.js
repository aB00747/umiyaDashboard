// utils/validation.js
export const ValidationRules = {
    required: (value, fieldName) => {
        if (!value || value.toString().trim() === '') {
            return `${fieldName} is required`;
        }
        return null;
    },

    email: (value, fieldName) => {
        if (!value) return null;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            return `Please enter a valid ${fieldName.toLowerCase()}`;
        }
        return null;
    },

    phone: (value, fieldName) => {
        if (!value) return null;
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
        if (!phoneRegex.test(value.replace(/\s/g, ''))) {
            return `Please enter a valid ${fieldName.toLowerCase()}`;
        }
        return null;
    },

    minLength: (minLength) => (value, fieldName) => {
        if (!value) return null;
        if (value.toString().length < minLength) {
            return `${fieldName} must be at least ${minLength} characters`;
        }
        return null;
    },

    maxLength: (maxLength) => (value, fieldName) => {
        if (!value) return null;
        if (value.toString().length > maxLength) {
            return `${fieldName} must not exceed ${maxLength} characters`;
        }
        return null;
    },

    pattern: (regex, message) => (value, fieldName) => {
        if (!value) return null;
        if (!regex.test(value)) {
            return message || `Invalid ${fieldName.toLowerCase()} format`;
        }
        return null;
    },

    custom: (validator) => (value, fieldName) => {
        return validator(value, fieldName);
    }
};

// Validation schema for customer form
export const CustomerValidationSchema = {
    firstName: {
        label: 'First Name',
        rules: [ValidationRules.required, ValidationRules.minLength(2)]
    },
    lastName: {
        label: 'Last Name',
        rules: [ValidationRules.required, ValidationRules.minLength(2)]
    },
    companyName: {
        label: 'Company Name',
        rules: [] // Optional field
    },
    email: {
        label: 'Email',
        rules: [ValidationRules.required, ValidationRules.email]
    },
    phone: {
        label: 'Phone',
        rules: [ValidationRules.required, ValidationRules.phone]
    },
    alternatePhone: {
        label: 'Alternate Phone',
        rules: [ValidationRules.phone] // Optional but must be valid if provided
    },
    addressLine1: {
        label: 'Address Line 1',
        rules: [ValidationRules.required, ValidationRules.minLength(5)]
    },
    addressLine2: {
        label: 'Address Line 2',
        rules: [] // Optional
    },
    country: {
        label: 'Country',
        rules: [ValidationRules.required]
    },
    countryCode: {
        label: 'Country Code',
        rules: [ValidationRules.pattern(/^[A-Z]{2}$/, 'Country code must be 2 uppercase letters')]
    },
    city: {
        label: 'City',
        rules: [ValidationRules.required, ValidationRules.minLength(2)]
    },
    state: {
        label: 'State',
        rules: [ValidationRules.required, ValidationRules.minLength(2)]
    },
    stateCode: {
        label: 'State Code',
        rules: [ValidationRules.pattern(/^[A-Z]{2,3}$/, 'State code must be 2-3 uppercase letters')]
    },
    pinCode: {
        label: 'PIN Code',
        rules: [
            ValidationRules.required,
            ValidationRules.pattern(/^\d{4,10}$/, 'PIN code must be 4-10 digits')
        ]
    },
    gstin: {
        label: 'GSTIN',
        rules: [
            ValidationRules.pattern(
                /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
                'Invalid GSTIN format'
            )
        ] // Optional but must be valid format if provided
    },
    pan: {
        label: 'PAN',
        rules: [
            ValidationRules.pattern(
                /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
                'Invalid PAN format (e.g., ABCDE1234F)'
            )
        ] // Optional but must be valid format if provided
    }
};

// Custom validation for interdependent fields
export const CustomValidations = {
    validateCustomerName: (data) => {
        if (!data.firstName && !data.companyName) {
            return {
                firstName: 'Either First Name or Company Name is required',
                companyName: 'Either First Name or Company Name is required'
            };
        }
        return {};
    },

    validateBusinessFields: (data) => {
        const errors = {};
        if (data.customerType === 'Corporate' && !data.companyName) {
            errors.companyName = 'Company Name is required for Corporate customers';
        }
        return errors;
    }
};