/**
 * Client-side template generator for customer import files
 * Provides fallback functionality when server templates are unavailable
 */

/**
 * Customer data template structure
 */
const CUSTOMER_TEMPLATE_HEADERS = [
    'first_name',
    'last_name', 
    'company_name',
    'email',
    'phone',
    'alternate_phone',
    'address_line1',
    'address_line2',
    'city',
    'state',
    'state_code',
    'country',
    'country_code',
    'pin_code',
    'gstin',
    'pan',
    'customer_type',
    'is_active'
];

/**
 * Sample customer data for template
 */
const SAMPLE_CUSTOMER_DATA = [
    {
        first_name: 'John',
        last_name: 'Doe',
        company_name: 'Acme Corporation',
        email: 'john.doe@acme.com',
        phone: '+1-555-123-4567',
        alternate_phone: '+1-555-987-6543',
        address_line1: '123 Business Street',
        address_line2: 'Suite 100',
        city: 'New York',
        state: 'New York',
        state_code: 'NY',
        country: 'United States',
        country_code: 'US',
        pin_code: '10001',
        gstin: 'GST123456789',
        pan: 'ABCDE1234F',
        customer_type: 'Corporate',
        is_active: 'true'
    },
    {
        first_name: 'Jane',
        last_name: 'Smith',
        company_name: 'Smith Enterprises',
        email: 'jane.smith@smithent.com',
        phone: '+1-555-234-5678',
        alternate_phone: '',
        address_line1: '456 Commerce Ave',
        address_line2: '',
        city: 'Los Angeles',
        state: 'California',
        state_code: 'CA',
        country: 'United States',
        country_code: 'US',
        pin_code: '90210',
        gstin: 'GST987654321',
        pan: 'FGHIJ5678K',
        customer_type: 'Individual',
        is_active: 'true'
    }
];

/**
 * Generate CSV template content
 */
export const generateCSVTemplate = () => {
    const csvContent = [
        // Header row
        CUSTOMER_TEMPLATE_HEADERS.join(','),
        // Sample data rows
        ...SAMPLE_CUSTOMER_DATA.map(customer => 
            CUSTOMER_TEMPLATE_HEADERS.map(header => {
                const value = customer[header] || '';
                // Escape commas and quotes in CSV
                return `"${value.toString().replace(/"/g, '""')}"`;
            }).join(',')
        )
    ].join('\n');

    return csvContent;
};

/**
 * Generate Excel template using basic HTML table format
 * (This creates an .xls file that Excel can open)
 */
export const generateExcelTemplate = () => {
    const excelContent = `
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                table { border-collapse: collapse; width: 100%; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; font-weight: bold; }
                .instructions { margin-bottom: 20px; padding: 10px; background-color: #e7f3ff; border: 1px solid #b3d9ff; }
            </style>
        </head>
        <body>
            <div class="instructions">
                <h3>Customer Import Template</h3>
                <p><strong>Instructions:</strong></p>
                <ul>
                    <li>Fill in customer data in the rows below</li>
                    <li>Do not modify the header row</li>
                    <li>Remove sample data before importing</li>
                    <li>Save as .xlsx or .csv format</li>
                    <li>Required fields: first_name, last_name, email</li>
                    <li>customer_type: Individual or Corporate</li>
                    <li>is_active: true or false</li>
                </ul>
            </div>
            <table>
                <thead>
                    <tr>
                        ${CUSTOMER_TEMPLATE_HEADERS.map(header => `<th>${header}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
                    ${SAMPLE_CUSTOMER_DATA.map(customer => 
                        `<tr>${CUSTOMER_TEMPLATE_HEADERS.map(header => 
                            `<td>${customer[header] || ''}</td>`
                        ).join('')}</tr>`
                    ).join('')}
                </tbody>
            </table>
        </body>
        </html>
    `;

    return excelContent;
};

/**
 * Download template file
 * @param {string} format - File format (csv, xlsx)
 * @param {string} filename - Optional custom filename
 */
export const downloadTemplate = (format = 'csv', filename = null) => {
    let content, mimeType, defaultFilename;

    switch (format.toLowerCase()) {
        case 'csv':
            content = generateCSVTemplate();
            mimeType = 'text/csv';
            defaultFilename = 'customer_import_template.csv';
            break;
        case 'xlsx':
        case 'xls':
            content = generateExcelTemplate();
            mimeType = 'application/vnd.ms-excel';
            defaultFilename = 'customer_import_template.xls';
            break;
        default:
            throw new Error(`Unsupported format: ${format}`);
    }

    // Create blob and download
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.download = filename || defaultFilename;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Cleanup
    setTimeout(() => {
        window.URL.revokeObjectURL(url);
    }, 100);

    return {
        success: true,
        filename: filename || defaultFilename,
        size: blob.size,
        format: format.toLowerCase()
    };
};

/**
 * Generate field descriptions for documentation
 */
export const getFieldDescriptions = () => ({
    first_name: 'Customer first name (required)',
    last_name: 'Customer last name (required)', 
    company_name: 'Company or business name',
    email: 'Primary email address (required)',
    phone: 'Primary phone number',
    alternate_phone: 'Secondary phone number',
    address_line1: 'Street address line 1',
    address_line2: 'Street address line 2 (optional)',
    city: 'City name',
    state: 'State or province name',
    state_code: 'State/province code (e.g., CA, NY)',
    country: 'Country name',
    country_code: 'Country code (e.g., US, IN)',
    pin_code: 'ZIP/postal code',
    gstin: 'GST identification number',
    pan: 'PAN card number',
    customer_type: 'Individual or Corporate',
    is_active: 'true or false'
});

/**
 * Validate template data format
 * @param {Array} data - Array of customer objects
 * @returns {Object} Validation result
 */
export const validateTemplateData = (data) => {
    const errors = [];
    const warnings = [];
    
    if (!Array.isArray(data) || data.length === 0) {
        errors.push('No data provided or invalid format');
        return { valid: false, errors, warnings };
    }

    // Check headers
    const requiredFields = ['first_name', 'last_name', 'email'];
    const firstRow = data[0];
    
    if (typeof firstRow !== 'object') {
        errors.push('Invalid data format. Expected object array');
        return { valid: false, errors, warnings };
    }

    // Validate required fields
    requiredFields.forEach(field => {
        if (!firstRow.hasOwnProperty(field)) {
            errors.push(`Missing required field: ${field}`);
        }
    });

    // Validate data types and formats
    data.forEach((row, index) => {
        if (row.email && !isValidEmail(row.email)) {
            warnings.push(`Row ${index + 1}: Invalid email format`);
        }
        
        if (row.customer_type && !['Individual', 'Corporate'].includes(row.customer_type)) {
            warnings.push(`Row ${index + 1}: Invalid customer_type. Use 'Individual' or 'Corporate'`);
        }
        
        if (row.is_active && !['true', 'false'].includes(row.is_active.toString().toLowerCase())) {
            warnings.push(`Row ${index + 1}: Invalid is_active value. Use 'true' or 'false'`);
        }
    });

    return {
        valid: errors.length === 0,
        errors,
        warnings,
        rowCount: data.length
    };
};

/**
 * Simple email validation
 * @param {string} email 
 * @returns {boolean}
 */
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export default {
    generateCSVTemplate,
    generateExcelTemplate,
    downloadTemplate,
    getFieldDescriptions,
    validateTemplateData,
    CUSTOMER_TEMPLATE_HEADERS,
    SAMPLE_CUSTOMER_DATA
};