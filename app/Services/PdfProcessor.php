<?php

namespace App\Services;

use App\Models\Customer;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\UploadedFile;
use Smalot\PdfParser\Parser;

/**
 * PDF Processing Service for Customer Import
 * Handles extraction of customer data from PDF documents
 */
class PdfProcessor
{
    protected $parser;
    protected $importResults;

    public function __construct()
    {
        $this->parser = new Parser();
        $this->initializeResults();
    }

    /**
     * Initialize import results structure
     */
    protected function initializeResults(): void
    {
        $this->importResults = [
            'total_pages' => 0,
            'imported' => 0,
            'skipped' => 0,
            'errors' => 0,
            'warnings' => [],
            'error_details' => [],
            'extracted_text' => '',
            'processing_method' => 'text_extraction'
        ];
    }

    /**
     * Process PDF file and extract customer data
     *
     * @param UploadedFile $file
     * @return array
     */
    public function processPdfFile(UploadedFile $file): array
    {
        try {
            // Parse the PDF file
            $pdf = $this->parser->parseFile($file->getPathname());
            
            // Get document metadata
            $details = $pdf->getDetails();
            $this->importResults['total_pages'] = count($pdf->getPages());

            // Extract text from all pages
            $fullText = '';
            foreach ($pdf->getPages() as $page) {
                $fullText .= $page->getText() . "\n";
            }

            $this->importResults['extracted_text'] = $fullText;

            // Process the extracted text
            $customers = $this->extractCustomerData($fullText);
            
            // Import the customers
            foreach ($customers as $customerData) {
                try {
                    if ($this->validateCustomerData($customerData)) {
                        Customer::create($customerData);
                        $this->importResults['imported']++;
                    } else {
                        $this->importResults['skipped']++;
                    }
                } catch (\Exception $e) {
                    $this->importResults['errors']++;
                    $this->importResults['error_details'][] = [
                        'data' => $customerData,
                        'error' => $e->getMessage()
                    ];
                }
            }

            return $this->importResults;

        } catch (\Exception $e) {
            Log::error('PDF processing failed', [
                'file' => $file->getClientOriginalName(),
                'error' => $e->getMessage()
            ]);

            throw new \Exception('Failed to process PDF: ' . $e->getMessage());
        }
    }

    /**
     * Extract customer data from text using various strategies
     *
     * @param string $text
     * @return array
     */
    protected function extractCustomerData(string $text): array
    {
        $customers = [];

        // Try different extraction methods
        $methods = [
            'extractFromTable',
            'extractFromStructuredText',
            'extractFromKeyValuePairs'
        ];

        foreach ($methods as $method) {
            $extracted = $this->$method($text);
            if (!empty($extracted)) {
                $customers = array_merge($customers, $extracted);
                $this->importResults['processing_method'] = $method;
                break;
            }
        }

        return $customers;
    }

    /**
     * Extract data from table-like structure
     *
     * @param string $text
     * @return array
     */
    protected function extractFromTable(string $text): array
    {
        $customers = [];
        $lines = explode("\n", $text);
        
        $headerFound = false;
        $headers = [];
        
        foreach ($lines as $line) {
            $line = trim($line);
            if (empty($line)) continue;

            // Look for table headers
            if (!$headerFound && $this->looksLikeTableHeader($line)) {
                $headers = $this->parseTableRow($line);
                $headerFound = true;
                continue;
            }

            // Process data rows
            if ($headerFound && $this->looksLikeDataRow($line)) {
                $data = $this->parseTableRow($line);
                if (count($data) >= count($headers)) {
                    $customer = $this->mapTableRowToCustomer($headers, $data);
                    if ($customer) {
                        $customers[] = $customer;
                    }
                }
            }
        }

        return $customers;
    }

    /**
     * Extract data from structured text format
     *
     * @param string $text
     * @return array
     */
    protected function extractFromStructuredText(string $text): array
    {
        $customers = [];
        
        // Split text into potential customer records
        $blocks = preg_split('/\n\s*\n/', $text);
        
        foreach ($blocks as $block) {
            $customer = $this->parseTextBlock($block);
            if ($customer && $this->hasMinimumRequiredFields($customer)) {
                $customers[] = $customer;
            }
        }

        return $customers;
    }

    /**
     * Extract data from key-value pairs format
     *
     * @param string $text
     * @return array
     */
    protected function extractFromKeyValuePairs(string $text): array
    {
        $customers = [];
        $lines = explode("\n", $text);
        
        $currentCustomer = [];
        
        foreach ($lines as $line) {
            $line = trim($line);
            if (empty($line)) {
                // Empty line might indicate end of customer record
                if (!empty($currentCustomer) && $this->hasMinimumRequiredFields($currentCustomer)) {
                    $customers[] = $currentCustomer;
                    $currentCustomer = [];
                }
                continue;
            }

            // Look for key-value patterns
            $keyValue = $this->extractKeyValue($line);
            if ($keyValue) {
                $currentCustomer[$keyValue['key']] = $keyValue['value'];
            }
        }

        // Don't forget the last customer
        if (!empty($currentCustomer) && $this->hasMinimumRequiredFields($currentCustomer)) {
            $customers[] = $currentCustomer;
        }

        return $customers;
    }

    /**
     * Check if line looks like a table header
     *
     * @param string $line
     * @return bool
     */
    protected function looksLikeTableHeader(string $line): bool
    {
        $headerKeywords = ['name', 'email', 'phone', 'address', 'company', 'customer'];
        $line = strtolower($line);
        
        $matchCount = 0;
        foreach ($headerKeywords as $keyword) {
            if (strpos($line, $keyword) !== false) {
                $matchCount++;
            }
        }
        
        return $matchCount >= 2;
    }

    /**
     * Check if line looks like a data row
     *
     * @param string $line
     * @return bool
     */
    protected function looksLikeDataRow(string $line): bool
    {
        // Look for email pattern or phone pattern
        return preg_match('/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/', $line) ||
               preg_match('/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/', $line) ||
               preg_match('/\+\d{1,3}[-.\s]?\d{1,14}/', $line);
    }

    /**
     * Parse table row into array
     *
     * @param string $line
     * @return array
     */
    protected function parseTableRow(string $line): array
    {
        // Try different delimiters
        $delimiters = ["\t", "|", ";", ","];
        
        foreach ($delimiters as $delimiter) {
            $parts = explode($delimiter, $line);
            if (count($parts) > 1) {
                return array_map('trim', $parts);
            }
        }

        // If no delimiter found, try to split by multiple spaces
        $parts = preg_split('/\s{2,}/', $line);
        return array_map('trim', $parts);
    }

    /**
     * Map table row data to customer array
     *
     * @param array $headers
     * @param array $data
     * @return array|null
     */
    protected function mapTableRowToCustomer(array $headers, array $data): ?array
    {
        $customer = [];
        $fieldMapping = $this->getFieldMapping();
        
        for ($i = 0; $i < min(count($headers), count($data)); $i++) {
            $header = strtolower(trim($headers[$i]));
            $value = trim($data[$i]);
            
            foreach ($fieldMapping as $patterns => $dbField) {
                foreach ($patterns as $pattern) {
                    if (strpos($header, $pattern) !== false) {
                        $customer[$dbField] = $value;
                        break 2;
                    }
                }
            }
        }

        return empty($customer) ? null : $this->normalizeCustomerData($customer);
    }

    /**
     * Parse text block into customer data
     *
     * @param string $block
     * @return array|null
     */
    protected function parseTextBlock(string $block): ?array
    {
        $customer = [];
        
        // Extract email
        if (preg_match('/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/', $block, $matches)) {
            $customer['email'] = $matches[0];
        }

        // Extract phone numbers
        if (preg_match('/(?:\+\d{1,3}[-.\s]?)?\d{3}[-.]?\d{3}[-.]?\d{4}/', $block, $matches)) {
            $customer['phone'] = $matches[0];
        }

        // Extract names (this is more complex and might need refinement)
        $lines = explode("\n", $block);
        foreach ($lines as $line) {
            $line = trim($line);
            
            // Look for name patterns
            if (preg_match('/^([A-Z][a-z]+)\s+([A-Z][a-z]+)/', $line, $matches)) {
                if (empty($customer['first_name'])) {
                    $customer['first_name'] = $matches[1];
                    $customer['last_name'] = $matches[2];
                }
            }
            
            // Look for company names (lines with "Inc", "Ltd", "Corp", etc.)
            if (preg_match('/\b(Inc|Ltd|Corp|Company|LLC|LLP)\b/i', $line)) {
                $customer['company_name'] = $line;
            }
        }

        return empty($customer) ? null : $this->normalizeCustomerData($customer);
    }

    /**
     * Extract key-value pair from line
     *
     * @param string $line
     * @return array|null
     */
    protected function extractKeyValue(string $line): ?array
    {
        $patterns = [
            '/^([^:]+):\s*(.+)$/',
            '/^([^=]+)=\s*(.+)$/',
            '/^([^-]+)-\s*(.+)$/'
        ];

        foreach ($patterns as $pattern) {
            if (preg_match($pattern, $line, $matches)) {
                $key = strtolower(trim($matches[1]));
                $value = trim($matches[2]);
                
                // Map key to database field
                $dbField = $this->mapKeyToField($key);
                if ($dbField) {
                    return ['key' => $dbField, 'value' => $value];
                }
            }
        }

        return null;
    }

    /**
     * Map extracted key to database field
     *
     * @param string $key
     * @return string|null
     */
    protected function mapKeyToField(string $key): ?string
    {
        $fieldMapping = [
            ['first name', 'firstname', 'fname'] => 'first_name',
            ['last name', 'lastname', 'lname', 'surname'] => 'last_name',
            ['company', 'company name', 'business', 'organization'] => 'company_name',
            ['email', 'e-mail', 'email address'] => 'email',
            ['phone', 'telephone', 'mobile', 'contact'] => 'phone',
            ['address', 'street', 'location'] => 'address_line1',
            ['city', 'town'] => 'city',
            ['state', 'province'] => 'state',
            ['country'] => 'country',
            ['zip', 'postal', 'pincode', 'pin'] => 'pin_code',
        ];

        foreach ($fieldMapping as $patterns => $dbField) {
            foreach ($patterns as $pattern) {
                if (strpos($key, $pattern) !== false) {
                    return $dbField;
                }
            }
        }

        return null;
    }

    /**
     * Get field mapping patterns
     *
     * @return array
     */
    protected function getFieldMapping(): array
    {
        return [
            ['name', 'customer', 'client'] => 'first_name',
            ['email', 'e-mail', 'mail'] => 'email',
            ['phone', 'telephone', 'mobile', 'contact'] => 'phone',
            ['company', 'business', 'organization'] => 'company_name',
            ['address', 'street', 'location'] => 'address_line1',
            ['city', 'town'] => 'city',
            ['state', 'province'] => 'state',
            ['country'] => 'country',
            ['zip', 'postal', 'pin'] => 'pin_code',
        ];
    }

    /**
     * Normalize customer data
     *
     * @param array $customer
     * @return array
     */
    protected function normalizeCustomerData(array $customer): array
    {
        // Set defaults
        $customer['is_active'] = true;
        $customer['customer_type'] = $customer['customer_type'] ?? 'Individual';

        // Clean up phone numbers
        if (isset($customer['phone'])) {
            $customer['phone'] = preg_replace('/[^\d+\-\s\(\)]/', '', $customer['phone']);
        }

        // Validate email
        if (isset($customer['email']) && !filter_var($customer['email'], FILTER_VALIDATE_EMAIL)) {
            unset($customer['email']);
        }

        return $customer;
    }

    /**
     * Validate customer data has minimum required fields
     *
     * @param array $customer
     * @return bool
     */
    protected function hasMinimumRequiredFields(array $customer): bool
    {
        return !empty($customer['first_name']) || !empty($customer['company_name']) || !empty($customer['email']);
    }

    /**
     * Validate customer data before saving
     *
     * @param array $customer
     * @return bool
     */
    protected function validateCustomerData(array $customer): bool
    {
        // Check for required fields
        if (empty($customer['first_name']) && empty($customer['company_name'])) {
            $this->importResults['warnings'][] = 'Customer skipped: Missing both name and company';
            return false;
        }

        // Check for duplicate email
        if (!empty($customer['email'])) {
            if (Customer::where('email', $customer['email'])->exists()) {
                $this->importResults['warnings'][] = "Duplicate email skipped: {$customer['email']}";
                return false;
            }
        }

        return true;
    }

    /**
     * Get import results
     *
     * @return array
     */
    public function getImportResults(): array
    {
        return $this->importResults;
    }
}