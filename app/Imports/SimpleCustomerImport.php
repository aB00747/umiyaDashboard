<?php

namespace App\Imports;

use App\Models\Customer;
use App\Models\Words;
use Illuminate\Support\Facades\Log;
use TCPDF; // You'll need to install TCPDF: composer require tecnickcom/tcpdf

class SimpleCustomerImport
{
    private $rowCount = 0;

    /**
     * Import customers from a CSV file
     * 
     * @param string $filePath The path to the CSV file
     * @return int Number of imported customers
     */
    public function import($filePath)
    {
        $this->rowCount = 0;
        $handle = fopen($filePath, 'r');

        if (!$handle) {
            throw new \Exception("Could not open file: {$filePath}");
        }

        // Read the header row
        $headers = fgetcsv($handle);
        $mappedHeaders = $this->mapHeaders($headers);

        // Process each row
        while (($data = fgetcsv($handle)) !== false) {
            $customerData = [];

            // Map CSV columns to database fields
            foreach ($mappedHeaders as $index => $field) {
                if ($field && isset($data[$index])) {
                    $customerData[$field] = $data[$index];
                }
            }

            // Basic validation
            if ((empty($customerData['first_name']) && empty($customerData['company_name'])) ||
                empty($customerData['address_line1'])
            ) {
                continue; // Skip invalid rows
            }

            // Format boolean fields
            if (isset($customerData['is_active'])) {
                $customerData['is_active'] = in_array(
                    strtolower($customerData['is_active']),
                    ['yes', 'true', '1', 'active', 'y']
                );
            } else {
                $customerData['is_active'] = true; // Default to active
            }

            // Create the customer
            try {
                Customer::create($customerData);
                $this->rowCount++;
            } catch (\Exception $e) {
                Log::error('Failed to import customer: ' . $e->getMessage(), $customerData);
                // Continue with next row
            }
        }

        fclose($handle);
        return $this->rowCount;
    }

    /**
     * Map CSV headers to database fields
     * 
     * @param array $headers
     * @return array
     */
    private function mapHeaders($headers)
    {
        $mappedHeaders = [];
        $fieldMap = [
            'first name' => 'first_name',
            'last name' => 'last_name',
            'company name' => 'company_name',
            'address line 1' => 'address_line1',
            'address line 2' => 'address_line2',
            'city' => 'city',
            'state' => 'state',
            'state code' => 'state_code',
            'country' => 'country',
            'country code' => 'country_code',
            'pin code' => 'pin_code',
            'zip code' => 'pin_code',
            'postal code' => 'pin_code',
            'phone' => 'phone',
            'phone number' => 'phone',
            'alternate phone' => 'alternate_phone',
            'email' => 'email',
            'email address' => 'email',
            'gstin' => 'gstin',
            'gst number' => 'gstin',
            'pan' => 'pan',
            'pan number' => 'pan',
            'customer type' => 'customer_type',
            'status' => 'is_active',
            'is active' => 'is_active',
        ];

        foreach ($headers as $index => $header) {
            $key = strtolower(trim($header));
            $mappedHeaders[$index] = $fieldMap[$key] ?? null;
        }

        return $mappedHeaders;
    }

    /**
     * Get the number of imported rows
     *
     * @return int
     */
    public function getRowCount()
    {
        return $this->rowCount;
    }

    /**
     * Generate a CSV template file
     * 
     * @param string $outputPath Path to save the template
     * @return string Path to the generated template
     */
    public function generateExcelTemplate($outputPath = null)
    {
        // Define headers
        $headers = [
            'First Name',
            'Last Name',
            'Company Name',
            'Address Line 1',
            'Address Line 2',
            'City',
            'State',
            'State Code',
            'Country',
            'Country Code',
            'PIN Code',
            'Phone',
            'Alternate Phone',
            'Email',
            'GSTIN',
            'PAN',
            'Customer Type',
            'Is Active'
        ];

        // Sample data
        $sampleData = [
            'John',
            'Doe',
            'ABC Company',
            '123 Main St',
            'Suite 101',
            'Mumbai',
            'Maharashtra',
            'MH',
            'India',
            'IN',
            '400001',
            '+91 22 12345678',
            '',
            'john@example.com',
            'GSTIN12345678',
            'ABCDE1234F',
            'Corporate',
            'Yes'
        ];

        // If no output path specified, create a temp file
        if (!$outputPath) {
            $tempDir = sys_get_temp_dir();
            $outputPath = $tempDir . '/customer_import_template_' . time() . '.csv';
        }

        // Create the CSV file
        $handle = fopen($outputPath, 'w');
        fputcsv($handle, $headers);
        fputcsv($handle, $sampleData);
        fclose($handle);

        return $outputPath;
    }

    /**
     * Generate a PDF template file with customer import instructions and format guide
     * 
     * @param string $outputPath Path to save the template
     * @return string Path to the generated template
     */
    public function generatePdfTemplate($outputPath = null)
    {
        // If no output path specified, create a temp file
        if (!$outputPath) {
            $tempDir = sys_get_temp_dir();
            $outputPath = $tempDir . '/customer_import_template_' . time() . '.pdf';
        }

        // Create new PDF document
        $pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);

        // Set document information
        $pdf->SetCreator('Customer Management System');
        $pdf->SetAuthor('Your Company Name');
        $pdf->SetTitle('Customer Import Template');
        $pdf->SetSubject('Customer Data Import Guide');
        $pdf->SetKeywords('Customer, Import, Template, CSV');

        // Set default header data
        $pdf->SetHeaderData('', 0, 'Customer Import Template', 'Data Format Guide & Instructions');

        // Set header and footer fonts
        $pdf->setHeaderFont(array(PDF_FONT_NAME_MAIN, '', PDF_FONT_SIZE_MAIN));
        $pdf->setFooterFont(array(PDF_FONT_NAME_DATA, '', PDF_FONT_SIZE_DATA));

        // Set default monospaced font
        $pdf->SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);

        // Set margins
        $pdf->SetMargins(PDF_MARGIN_LEFT, PDF_MARGIN_TOP, PDF_MARGIN_RIGHT);
        $pdf->SetHeaderMargin(PDF_MARGIN_HEADER);
        $pdf->SetFooterMargin(PDF_MARGIN_FOOTER);

        // Set auto page breaks
        $pdf->SetAutoPageBreak(TRUE, PDF_MARGIN_BOTTOM);

        // Set image scale factor
        $pdf->setImageScale(PDF_IMAGE_SCALE_RATIO);

        // Add a page
        $pdf->AddPage();

        // Set font
        $pdf->SetFont('helvetica', '', 12);

        // Title
        $pdf->SetFont('helvetica', 'B', 16);
        $pdf->Cell(0, 10, 'Customer Import Template & Instructions', 0, 1, 'C');
        $pdf->Ln(5);

        // Introduction
        $pdf->SetFont('helvetica', '', 11);
        $intro = "This document provides instructions for importing customer data into the system. Please follow the format specifications carefully to ensure successful data import.";
        $pdf->MultiCell(0, 6, $intro, 0, 'L');
        $pdf->Ln(5);

        // Required Fields Section
        $pdf->SetFont('helvetica', 'B', 14);
        $pdf->Cell(0, 8, 'Required Fields', 0, 1, 'L');
        $pdf->SetFont('helvetica', '', 10);

        $requiredFields = [
            '• First Name OR Company Name (at least one must be provided)',
            '• Address Line 1'
        ];

        foreach ($requiredFields as $field) {
            $pdf->Cell(0, 5, $field, 0, 1, 'L');
        }
        $pdf->Ln(3);

        // Field Specifications
        $pdf->SetFont('helvetica', 'B', 14);
        $pdf->Cell(0, 8, 'Field Specifications', 0, 1, 'L');
        $pdf->SetFont('helvetica', '', 9);

        // Create table for field specifications
        // $fields = [
        //     ['Field Name', 'Type', 'Max Length', 'Example', 'Notes'],
        //     ['First Name', 'Text', '255', 'John', 'Required if Company Name is empty'],
        //     ['Last Name', 'Text', '255', 'Doe', 'Optional'],
        //     ['Company Name', 'Text', '255', 'ABC Corp', 'Required if First Name is empty'],
        //     ['Address Line 1', 'Text', '255', '123 Main St', 'Required'],
        //     ['Address Line 2', 'Text', '255', 'Suite 101', 'Optional'],
        //     ['City', 'Text', '255', 'Mumbai', 'Optional'],
        //     ['State', 'Text', '255', 'Maharashtra', 'Optional'],
        //     ['State Code', 'Text', '4', 'MH', 'Optional'],
        //     ['Country', 'Text', '255', 'India', 'Optional'],
        //     ['Country Code', 'Text', '4', 'IN', 'Optional'],
        //     ['PIN Code', 'Number', '-', '400001', 'Optional'],
        //     ['Phone', 'Text', '15', '+91 22 1234567', 'Optional'],
        //     ['Alternate Phone', 'Text', '15', '+91 98 7654321', 'Optional'],
        //     ['Email', 'Email', '255', 'john@example.com', 'Optional, must be valid email'],
        //     ['GSTIN', 'Text', '255', 'GSTIN12345678', 'Optional'],
        //     ['PAN', 'Text', '10', 'ABCDE1234F', 'Optional'],
        //     ['Customer Type', 'Text', '255', 'Corporate', 'Optional'],
        //     ['Is Active', 'Boolean', '-', 'Yes/No/True/False', 'Optional, defaults to Yes']
        // ];

        $words = Words::snakeToNormal('Field_name');

        $customer = new Customer();
        $fields = $customer->getFields();


        








        // Set table properties
        $pdf->SetFillColor(240, 240, 240);
        $pdf->SetTextColor(0);
        $pdf->SetDrawColor(128, 128, 128);
        $pdf->SetLineWidth(0.3);
        $pdf->SetFont('helvetica', 'B', 8);

        // Table header
        $w = [35, 20, 25, 45, 55]; // column widths
        for ($i = 0; $i < count($fields[0]); $i++) {
            $pdf->Cell($w[$i], 7, $fields[0][$i], 1, 0, 'C', true);
        }
        $pdf->Ln();

        // Table data
        $pdf->SetFont('helvetica', '', 7);
        $fill = false;
        for ($i = 1; $i < count($fields); $i++) {
            for ($j = 0; $j < count($fields[$i]); $j++) {
                $pdf->Cell($w[$j], 6, $fields[$i][$j], 'LR', 0, 'L', $fill);
            }
            $pdf->Ln();
            $fill = !$fill;
        }
        $pdf->Cell(array_sum($w), 0, '', 'T');
        $pdf->Ln(8);

        // CSV Format Example
        $pdf->SetFont('helvetica', 'B', 14);
        $pdf->Cell(0, 8, 'CSV Format Example', 0, 1, 'L');
        $pdf->SetFont('helvetica', '', 9);

        $csvExample = 'First Name,Last Name,Company Name,Address Line 1,Address Line 2,City,State,State Code,Country,Country Code,PIN Code,Phone,Alternate Phone,Email,GSTIN,PAN,Customer Type,Is Active
John,Doe,ABC Company,123 Main St,Suite 101,Mumbai,Maharashtra,MH,India,IN,400001,+91 22 12345678,,john@example.com,GSTIN12345678,ABCDE1234F,Corporate,Yes
Jane,Smith,XYZ Corp,456 Oak Ave,,Delhi,Delhi,DL,India,IN,110001,+91 11 9876543,,jane@example.com,GSTIN87654321,FGHIJ5678K,Individual,Yes';

        // Use monospaced font for CSV example
        $pdf->SetFont('courier', '', 8);
        $pdf->MultiCell(0, 4, $csvExample, 1, 'L');
        $pdf->Ln(5);

        // Import Instructions
        $pdf->SetFont('helvetica', 'B', 14);
        $pdf->Cell(0, 8, 'Import Instructions', 0, 1, 'L');
        $pdf->SetFont('helvetica', '', 10);

        $instructions = [
            '1. Prepare your data in CSV format following the field specifications above.',
            '2. Ensure the first row contains column headers exactly as shown in the example.',
            '3. Each customer record should be on a separate row.',
            '4. Use UTF-8 encoding to support international characters.',
            '5. For boolean fields (Is Active), use: Yes/No, True/False, 1/0, Active/Inactive, or Y/N.',
            '6. Leave optional fields empty if no data is available.',
            '7. Ensure email addresses are in valid format (e.g., user@domain.com).',
            '8. Phone numbers can include country codes and formatting.',
            '9. Remove any special characters that might cause parsing issues.',
            '10. Test with a small sample file first before importing large datasets.'
        ];

        foreach ($instructions as $instruction) {
            $pdf->MultiCell(0, 5, $instruction, 0, 'L');
            $pdf->Ln(1);
        }

        // Important Notes
        $pdf->Ln(3);
        $pdf->SetFont('helvetica', 'B', 12);
        $pdf->SetTextColor(200, 0, 0);
        $pdf->Cell(0, 8, 'Important Notes', 0, 1, 'L');
        $pdf->SetTextColor(0, 0, 0);
        $pdf->SetFont('helvetica', '', 10);

        $notes = [
            '• Duplicate records will be skipped during import.',
            '• Invalid rows will be logged and skipped.',
            '• Maximum file size allowed: 10MB.',
            '• Supported file formats: CSV, TXT.',
            '• Contact support if you encounter any issues during import.'
        ];

        foreach ($notes as $note) {
            $pdf->MultiCell(0, 5, $note, 0, 'L');
            $pdf->Ln(1);
        }

        // Output PDF
        $pdf->Output($outputPath, 'F');

        return $outputPath;
    }
}
