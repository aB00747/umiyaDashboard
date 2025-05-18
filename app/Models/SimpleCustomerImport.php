<?php

namespace App\Imports;

use App\Models\Customer;
use Illuminate\Support\Facades\Log;

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
                empty($customerData['address_line1'])) {
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
    public function generateTemplate($outputPath = null)
    {
        // Define headers
        $headers = [
            'First Name', 'Last Name', 'Company Name', 'Address Line 1', 
            'Address Line 2', 'City', 'State', 'State Code', 'Country', 
            'Country Code', 'PIN Code', 'Phone', 'Alternate Phone', 
            'Email', 'GSTIN', 'PAN', 'Customer Type', 'Is Active'
        ];
        
        // Sample data
        $sampleData = [
            'John', 'Doe', 'ABC Company', '123 Main St', 
            'Suite 101', 'Mumbai', 'Maharashtra', 'MH', 'India', 
            'IN', '400001', '+91 22 12345678', '', 
            'john@example.com', 'GSTIN12345678', 'ABCDE1234F', 'Corporate', 'Yes'
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
}