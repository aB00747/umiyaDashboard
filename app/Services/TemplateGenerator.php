<?php

namespace App\Services;

use Maatwebsite\Excel\Facades\Excel;
use App\Exports\CustomerTemplateExport;
use TCPDF;
use Illuminate\Support\Facades\Storage;

/**
 * Template Generator Service
 * Generates import templates in various formats (Excel, CSV, PDF)
 */
class TemplateGenerator
{
    /**
     * Generate template in specified format
     *
     * @param string $format
     * @return string Path to generated template
     */
    public function generateTemplate(string $format): string
    {
        switch (strtolower($format)) {
            case 'xlsx':
                return $this->generateExcelTemplate();
            case 'csv':
                return $this->generateCsvTemplate();
            case 'pdf':
                return $this->generatePdfTemplate();
            default:
                throw new \InvalidArgumentException("Unsupported format: {$format}");
        }
    }

    /**
     * Generate Excel template
     *
     * @return string
     */
    protected function generateExcelTemplate(): string
    {
        $filename = 'customer_import_template_' . time() . '.xlsx';
        $path = storage_path('app/temp/' . $filename);

        // Ensure temp directory exists
        if (!file_exists(dirname($path))) {
            mkdir(dirname($path), 0755, true);
        }

        Excel::store(new CustomerTemplateExport(), 'temp/' . $filename);

        return $path;
    }

    /**
     * Generate CSV template
     *
     * @return string
     */
    protected function generateCsvTemplate(): string
    {
        $filename = 'customer_import_template_' . time() . '.csv';
        $path = storage_path('app/temp/' . $filename);

        // Ensure temp directory exists
        if (!file_exists(dirname($path))) {
            mkdir(dirname($path), 0755, true);
        }

        $headers = [
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

        $sampleData = [
            [
                'John',
                'Doe',
                'Acme Corporation',
                'john.doe@acme.com',
                '+1-555-123-4567',
                '+1-555-987-6543',
                '123 Business Street',
                'Suite 100',
                'New York',
                'New York',
                'NY',
                'United States',
                'US',
                '10001',
                'GST123456789',
                'ABCDE1234F',
                'Corporate',
                'true'
            ],
            [
                'Jane',
                'Smith',
                'Smith Enterprises',
                'jane.smith@smithent.com',
                '+1-555-234-5678',
                '',
                '456 Commerce Ave',
                '',
                'Los Angeles',
                'California',
                'CA',
                'United States',
                'US',
                '90210',
                'GST987654321',
                'FGHIJ5678K',
                'Individual',
                'true'
            ]
        ];

        $handle = fopen($path, 'w');
        
        // Add BOM for UTF-8
        fwrite($handle, "\xEF\xBB\xBF");
        
        // Write headers
        fputcsv($handle, $headers);
        
        // Write sample data
        foreach ($sampleData as $row) {
            fputcsv($handle, $row);
        }
        
        fclose($handle);

        return $path;
    }

    /**
     * Generate PDF template with comprehensive guide
     *
     * @return string
     */
    protected function generatePdfTemplate(): string
    {
        $filename = 'customer_import_template_' . time() . '.pdf';
        $path = storage_path('app/temp/' . $filename);

        // Ensure temp directory exists
        if (!file_exists(dirname($path))) {
            mkdir(dirname($path), 0755, true);
        }

        // Create new PDF document
        $pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);

        // Set document information
        $pdf->SetCreator('Customer Management System');
        $pdf->SetAuthor('Umiya Chemical');
        $pdf->SetTitle('Customer Import Template & Guide');
        $pdf->SetSubject('Customer Data Import Instructions');
        $pdf->SetKeywords('Customer, Import, Template, Excel, CSV, PDF');

        // Set default header data
        $pdf->SetHeaderData('', 0, 'Customer Import Template', 'Complete Import Guide & Instructions');

        // Set header and footer fonts
        $pdf->setHeaderFont(['helvetica', '', 10]);
        $pdf->setFooterFont(['helvetica', '', 8]);

        // Set margins
        $pdf->SetMargins(15, 27, 15);
        $pdf->SetHeaderMargin(5);
        $pdf->SetFooterMargin(10);

        // Set auto page breaks
        $pdf->SetAutoPageBreak(true, 25);

        // Add a page
        $pdf->AddPage();

        // Title
        $pdf->SetFont('helvetica', 'B', 18);
        $pdf->SetTextColor(67, 56, 202); // Indigo color
        $pdf->Cell(0, 15, 'Customer Import Template & Guide', 0, 1, 'C');
        $pdf->Ln(5);

        // Reset color
        $pdf->SetTextColor(0, 0, 0);

        // Introduction section
        $pdf->SetFont('helvetica', 'B', 14);
        $pdf->Cell(0, 8, '1. Introduction', 0, 1, 'L');
        $pdf->SetFont('helvetica', '', 11);
        
        $intro = "This guide provides comprehensive instructions for importing customer data into the system. We support multiple file formats including Excel (.xlsx), CSV, and PDF. Please follow the specifications carefully to ensure successful data import.";
        $pdf->MultiCell(0, 6, $intro, 0, 'J');
        $pdf->Ln(5);

        // Supported formats section
        $pdf->SetFont('helvetica', 'B', 14);
        $pdf->Cell(0, 8, '2. Supported File Formats', 0, 1, 'L');
        $pdf->SetFont('helvetica', '', 11);

        $formats = [
            '• Excel Files (.xlsx, .xls) - Recommended for structured data with multiple customers',
            '• CSV Files (.csv) - Simple comma-separated format, ideal for data exports',
            '• PDF Files (.pdf) - Extract data from structured PDF documents (experimental)'
        ];

        foreach ($formats as $format) {
            $pdf->Cell(0, 6, $format, 0, 1, 'L');
        }
        $pdf->Ln(3);

        // Required fields section
        $pdf->SetFont('helvetica', 'B', 14);
        $pdf->Cell(0, 8, '3. Required Fields', 0, 1, 'L');
        $pdf->SetFont('helvetica', 'I', 11);
        $pdf->SetTextColor(200, 0, 0);
        $pdf->Cell(0, 6, 'At least one of the following must be provided for each customer:', 0, 1, 'L');
        $pdf->SetTextColor(0, 0, 0);
        $pdf->SetFont('helvetica', '', 11);

        $required = [
            '• First Name (if Company Name is not provided)',
            '• Company Name (if First Name is not provided)',
            '• Email Address (recommended for duplicate detection)'
        ];

        foreach ($required as $req) {
            $pdf->Cell(0, 6, $req, 0, 1, 'L');
        }
        $pdf->Ln(3);

        // Field specifications table
        $pdf->SetFont('helvetica', 'B', 14);
        $pdf->Cell(0, 8, '4. Field Specifications', 0, 1, 'L');
        $pdf->Ln(2);

        // Table data
        $tableData = [
            ['Field Name', 'Type', 'Max Length', 'Example', 'Notes'],
            ['first_name', 'Text', '255', 'John', 'Customer\'s first name'],
            ['last_name', 'Text', '255', 'Doe', 'Customer\'s last name'],
            ['company_name', 'Text', '255', 'Acme Corp', 'Business/Company name'],
            ['email', 'Email', '255', 'john@example.com', 'Valid email address'],
            ['phone', 'Text', '20', '+1-555-123-4567', 'Primary contact number'],
            ['alternate_phone', 'Text', '20', '+1-555-987-6543', 'Secondary contact'],
            ['address_line1', 'Text', '500', '123 Main Street', 'Primary address'],
            ['address_line2', 'Text', '500', 'Suite 100', 'Secondary address'],
            ['city', 'Text', '255', 'New York', 'City name'],
            ['state', 'Text', '255', 'New York', 'State/Province'],
            ['state_code', 'Text', '10', 'NY', 'State/Province code'],
            ['country', 'Text', '255', 'United States', 'Country name'],
            ['country_code', 'Text', '10', 'US', 'Country code (ISO)'],
            ['pin_code', 'Text', '20', '10001', 'ZIP/Postal code'],
            ['gstin', 'Text', '50', 'GST123456789', 'GST identification'],
            ['pan', 'Text', '20', 'ABCDE1234F', 'PAN number'],
            ['customer_type', 'Text', '50', 'Corporate', 'Individual/Corporate'],
            ['is_active', 'Boolean', '-', 'true/false', 'Customer status']
        ];

        // Table styling
        $pdf->SetFillColor(67, 56, 202);
        $pdf->SetTextColor(255, 255, 255);
        $pdf->SetFont('helvetica', 'B', 9);

        // Column widths
        $w = [35, 20, 25, 45, 55];

        // Header
        for ($i = 0; $i < 5; $i++) {
            $pdf->Cell($w[$i], 8, $tableData[0][$i], 1, 0, 'C', true);
        }
        $pdf->Ln();

        // Data rows
        $pdf->SetFillColor(245, 245, 245);
        $pdf->SetTextColor(0, 0, 0);
        $pdf->SetFont('helvetica', '', 8);
        
        $fill = false;
        for ($i = 1; $i < count($tableData); $i++) {
            for ($j = 0; $j < 5; $j++) {
                $pdf->Cell($w[$j], 6, $tableData[$i][$j], 1, 0, 'L', $fill);
            }
            $pdf->Ln();
            $fill = !$fill;
        }
        $pdf->Ln(5);

        // CSV format example
        $pdf->SetFont('helvetica', 'B', 14);
        $pdf->Cell(0, 8, '5. CSV Format Example', 0, 1, 'L');
        $pdf->SetFont('helvetica', '', 9);

        $csvExample = 'first_name,last_name,company_name,email,phone,address_line1,city,state,country,customer_type,is_active
John,Doe,Acme Corp,john@acme.com,+1-555-123-4567,123 Main St,New York,NY,USA,Corporate,true
Jane,Smith,Smith LLC,jane@smith.com,+1-555-234-5678,456 Oak Ave,Los Angeles,CA,USA,Individual,true';

        $pdf->SetFont('courier', '', 8);
        $pdf->SetFillColor(248, 249, 250);
        $pdf->MultiCell(0, 4, $csvExample, 1, 'L', true);
        $pdf->Ln(5);

        // Add new page for instructions
        $pdf->AddPage();

        // Import instructions
        $pdf->SetFont('helvetica', 'B', 14);
        $pdf->Cell(0, 8, '6. Import Instructions', 0, 1, 'L');
        $pdf->SetFont('helvetica', '', 11);

        $instructions = [
            'Step 1: Prepare Your Data',
            '• Organize your customer data according to the field specifications above',
            '• Ensure required fields are populated for each customer',
            '• Use consistent formatting for phone numbers and addresses',
            '• Validate email addresses before import',
            '',
            'Step 2: Choose Your Format',
            '• Excel (.xlsx): Best for complex data with formatting',
            '• CSV: Simple format, compatible with most systems',
            '• PDF: Experimental - works best with structured documents',
            '',
            'Step 3: Upload and Import',
            '• Select your prepared file in the import dialog',
            '• Review any validation warnings before proceeding',
            '• Monitor the import progress and results',
            '• Check the import summary for any errors or skipped records'
        ];

        foreach ($instructions as $instruction) {
            if (empty($instruction)) {
                $pdf->Ln(3);
                continue;
            }
            
            if (strpos($instruction, 'Step') === 0) {
                $pdf->SetFont('helvetica', 'B', 12);
                $pdf->SetTextColor(67, 56, 202);
                $pdf->Cell(0, 8, $instruction, 0, 1, 'L');
                $pdf->SetTextColor(0, 0, 0);
                $pdf->SetFont('helvetica', '', 11);
            } else {
                $pdf->MultiCell(0, 6, $instruction, 0, 'L');
            }
        }

        // Best practices
        $pdf->Ln(5);
        $pdf->SetFont('helvetica', 'B', 14);
        $pdf->Cell(0, 8, '7. Best Practices', 0, 1, 'L');
        $pdf->SetFont('helvetica', '', 11);

        $practices = [
            '✓ Test with a small sample file first (5-10 records)',
            '✓ Use UTF-8 encoding to support international characters',
            '✓ Remove any formatting like colors, fonts, or merged cells from Excel',
            '✓ Keep field names exactly as specified (case-sensitive)',
            '✓ Use consistent date formats throughout your data',
            '✓ Remove empty rows and columns before import',
            '✓ Backup your existing data before large imports'
        ];

        foreach ($practices as $practice) {
            $pdf->Cell(0, 6, $practice, 0, 1, 'L');
        }

        // Troubleshooting
        $pdf->Ln(5);
        $pdf->SetFont('helvetica', 'B', 14);
        $pdf->SetTextColor(200, 0, 0);
        $pdf->Cell(0, 8, '8. Troubleshooting', 0, 1, 'L');
        $pdf->SetTextColor(0, 0, 0);
        $pdf->SetFont('helvetica', '', 11);

        $troubleshooting = [
            'Common Issues:',
            '• "Invalid email format" - Check email addresses for typos',
            '• "Duplicate customer" - Customer with same email already exists',
            '• "Missing required fields" - Ensure first_name OR company_name is provided',
            '• "File too large" - Split large files into smaller batches (max 10MB)',
            '• "Encoding issues" - Save your file with UTF-8 encoding',
            '',
            'Need Help?',
            '• Check the import results summary for detailed error information',
            '• Contact system administrator for technical support',
            '• Refer to system documentation for advanced features'
        ];

        foreach ($troubleshooting as $item) {
            if (empty($item)) {
                $pdf->Ln(2);
                continue;
            }
            
            if (strpos($item, ':') !== false && !strpos($item, '•')) {
                $pdf->SetFont('helvetica', 'B', 11);
                $pdf->Cell(0, 6, $item, 0, 1, 'L');
                $pdf->SetFont('helvetica', '', 11);
            } else {
                $pdf->Cell(0, 6, $item, 0, 1, 'L');
            }
        }

        // Footer
        $pdf->Ln(10);
        $pdf->SetFont('helvetica', 'I', 10);
        $pdf->SetTextColor(128, 128, 128);
        $pdf->Cell(0, 6, 'Generated on ' . date('Y-m-d H:i:s') . ' | Customer Management System', 0, 1, 'C');

        // Output PDF
        $pdf->Output($path, 'F');

        return $path;
    }

    /**
     * Get content type for file format
     *
     * @param string $format
     * @return string
     */
    public function getContentType(string $format): string
    {
        return match (strtolower($format)) {
            'xlsx' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'xls' => 'application/vnd.ms-excel',
            'csv' => 'text/csv',
            'pdf' => 'application/pdf',
            default => 'application/octet-stream'
        };
    }
}