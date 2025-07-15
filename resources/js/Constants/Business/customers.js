export const CUSTOMER_DIALOG = {
    TITLE: 'Add New Customer',
    TABS: {
        MANUAL: 'Manual Entry',
        EXCEL: 'Excel Import',
        PDF: 'PDF Import'
    },
    TABS_TYPE: {
        MANUAL: 'manual',
        EXCEL: 'excel',
        PDF: 'pdf'
    },
    MESSAGES: {
        SUCCESS_CREATE: 'Customer added successfully',
        SUCCESS_UPDATE: 'Customer updated successfully',
        SUCCESS_IMPORT: 'Successfully imported customers',
        ERROR_VALIDATION: 'Please fill in all required fields',
        ERROR_SAVE: 'Failed to save customer',
        ERROR_IMPORT: 'Failed to import customers',
        ERROR_PDF_NOT_IMPLEMENTED: 'PDF import functionality is not yet implemented'
    },
    ERROR_MESSAGES: {
        FIRST_NAME: 'First name is required',
        LAST_NAME: 'Last name is required',
        PHONE_NAME: 'Phone Number is required',
        ADDRESS: 'Address Line 1 is required',
        COUNTRY: 'Country is required',
        CITY: 'City is required',
        STATE: 'State is required',
        ZIP: 'Zip Code is required',
        PIN_CODE: 'Pin Code is required'
    },
    BUTTONS: {
        SUBMIT: 'Save Customer',
        CLEAR: 'Clear Form',
        UNDO: 'Undo',
        CLOSE: 'Close',
        CANCEL: 'Cancel'
    }
};

export const CUSTOMER_TYPES = {
    INDIVIDUAL: 'Individual',
    BUSINESS: 'Business'
};