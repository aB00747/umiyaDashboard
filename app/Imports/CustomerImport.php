<?php

namespace App\Imports;

use App\Models\Customer;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Concerns\WithBatchInserts;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Maatwebsite\Excel\Concerns\SkipsErrors;
use Maatwebsite\Excel\Concerns\SkipsFailures;
use Maatwebsite\Excel\Concerns\SkipsOnError;
use Maatwebsite\Excel\Concerns\SkipsOnFailure;
use Maatwebsite\Excel\Validators\Failure;

/**
 * Advanced Customer Import with comprehensive validation and error handling
 */
class CustomerImport implements 
    ToCollection, 
    WithHeadingRow, 
    WithValidation,
    WithBatchInserts,
    WithChunkReading,
    SkipsOnError,
    SkipsOnFailure
{
    use SkipsErrors, SkipsFailures;

    protected $importResults = [
        'total_rows' => 0,
        'imported' => 0,
        'skipped' => 0,
        'errors' => 0,
        'warnings' => [],
        'error_details' => [],
        'duplicate_emails' => [],
        'invalid_rows' => []
    ];

    /**
     * Process the imported collection
     *
     * @param Collection $collection
     */
    public function collection(Collection $collection)
    {
        $this->importResults['total_rows'] = $collection->count();

        foreach ($collection as $rowIndex => $row) {
            try {
                // Transform the row data
                $customerData = $this->transformRow($row->toArray(), $rowIndex);

                if ($customerData === null) {
                    $this->importResults['skipped']++;
                    continue;
                }

                // Check for duplicates
                if ($this->isDuplicate($customerData)) {
                    $this->importResults['duplicate_emails'][] = $customerData['email'] ?? "Row " . ($rowIndex + 2);
                    $this->importResults['skipped']++;
                    continue;
                }

                // Create customer
                $customer = Customer::create($customerData);
                $this->importResults['imported']++;

                Log::info("Customer imported successfully", [
                    'row' => $rowIndex + 2,
                    'customer_id' => $customer->id,
                    'email' => $customer->email
                ]);

            } catch (\Exception $e) {
                $this->importResults['errors']++;
                $this->importResults['error_details'][] = [
                    'row' => $rowIndex + 2,
                    'error' => $e->getMessage(),
                    'data' => $row->toArray()
                ];

                Log::error("Customer import failed", [
                    'row' => $rowIndex + 2,
                    'error' => $e->getMessage(),
                    'data' => $row->toArray()
                ]);
            }
        }
    }

    /**
     * Transform and validate row data
     *
     * @param array $row
     * @param int $rowIndex
     * @return array|null
     */
    protected function transformRow(array $row, int $rowIndex): ?array
    {
        // Clean and map the data
        $data = [];

        // Handle flexible column names
        $columnMapping = $this->getColumnMapping();
        
        foreach ($columnMapping as $possibleKeys => $dbField) {
            $keys = is_array($possibleKeys) ? $possibleKeys : [$possibleKeys];
            
            foreach ($keys as $key) {
                if (isset($row[$key]) && !empty(trim($row[$key]))) {
                    $data[$dbField] = trim($row[$key]);
                    break;
                }
            }
        }

        // Skip empty rows
        if (empty($data['first_name']) && empty($data['company_name'])) {
            $this->importResults['invalid_rows'][] = [
                'row' => $rowIndex + 2,
                'reason' => 'Missing both first name and company name'
            ];
            return null;
        }

        // Set defaults
        $data['is_active'] = $this->parseBooleanField($data['is_active'] ?? 'true');
        $data['customer_type'] = $data['customer_type'] ?? 'Individual';

        // Validate email format
        if (!empty($data['email']) && !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            $this->importResults['warnings'][] = "Invalid email format in row " . ($rowIndex + 2) . ": " . $data['email'];
            unset($data['email']); // Remove invalid email
        }

        // Validate phone numbers (basic cleanup)
        if (isset($data['phone'])) {
            $data['phone'] = $this->cleanPhoneNumber($data['phone']);
        }
        if (isset($data['alternate_phone'])) {
            $data['alternate_phone'] = $this->cleanPhoneNumber($data['alternate_phone']);
        }

        // Validate customer type
        if (!in_array($data['customer_type'], ['Individual', 'Corporate', 'Retail', 'Wholesale'])) {
            $data['customer_type'] = 'Individual';
            $this->importResults['warnings'][] = "Invalid customer type in row " . ($rowIndex + 2) . ", defaulting to Individual";
        }

        return $data;
    }

    /**
     * Get column mapping for flexible header names
     *
     * @return array
     */
    protected function getColumnMapping(): array
    {
        return [
            ['first_name', 'firstname', 'first name', 'fname'] => 'first_name',
            ['last_name', 'lastname', 'last name', 'lname', 'surname'] => 'last_name',
            ['company_name', 'company', 'business_name', 'company name', 'business name'] => 'company_name',
            ['email', 'email_address', 'email address', 'e-mail'] => 'email',
            ['phone', 'phone_number', 'mobile', 'contact', 'phone number'] => 'phone',
            ['alternate_phone', 'alt_phone', 'secondary_phone', 'alternate phone', 'second phone'] => 'alternate_phone',
            ['address_line1', 'address1', 'address_1', 'address line 1', 'street'] => 'address_line1',
            ['address_line2', 'address2', 'address_2', 'address line 2', 'street2'] => 'address_line2',
            ['city'] => 'city',
            ['state', 'province'] => 'state',
            ['state_code', 'state code', 'province_code'] => 'state_code',
            ['country'] => 'country',
            ['country_code', 'country code'] => 'country_code',
            ['pin_code', 'pincode', 'zip', 'zip_code', 'postal_code', 'pin code'] => 'pin_code',
            ['gstin', 'gst', 'gst_number', 'gst number'] => 'gstin',
            ['pan', 'pan_number', 'pan number'] => 'pan',
            ['customer_type', 'type', 'customer type', 'client_type'] => 'customer_type',
            ['is_active', 'active', 'status', 'is active'] => 'is_active',
        ];
    }

    /**
     * Parse boolean field from various formats
     *
     * @param mixed $value
     * @return bool
     */
    protected function parseBooleanField($value): bool
    {
        if (is_bool($value)) {
            return $value;
        }

        $value = strtolower(trim($value));
        return in_array($value, ['1', 'true', 'yes', 'y', 'active', 'on', '✓']);
    }

    /**
     * Clean phone number format
     *
     * @param string $phone
     * @return string
     */
    protected function cleanPhoneNumber(string $phone): string
    {
        // Remove common formatting characters but keep + for country codes
        $cleaned = preg_replace('/[^\d+\-\s\(\)]/', '', $phone);
        return trim($cleaned);
    }

    /**
     * Check if customer already exists
     *
     * @param array $data
     * @return bool
     */
    protected function isDuplicate(array $data): bool
    {
        if (empty($data['email'])) {
            return false;
        }

        return Customer::where('email', $data['email'])->exists();
    }

    /**
     * Validation rules for the import
     *
     * @return array
     */
    public function rules(): array
    {
        return [
            '*.first_name' => 'nullable|string|max:255',
            '*.last_name' => 'nullable|string|max:255',
            '*.company_name' => 'nullable|string|max:255',
            '*.email' => 'nullable|email|max:255',
            '*.phone' => 'nullable|string|max:20',
            '*.alternate_phone' => 'nullable|string|max:20',
            '*.address_line1' => 'nullable|string|max:500',
            '*.address_line2' => 'nullable|string|max:500',
            '*.city' => 'nullable|string|max:255',
            '*.state' => 'nullable|string|max:255',
            '*.state_code' => 'nullable|string|max:10',
            '*.country' => 'nullable|string|max:255',
            '*.country_code' => 'nullable|string|max:10',
            '*.pin_code' => 'nullable|string|max:20',
            '*.gstin' => 'nullable|string|max:50',
            '*.pan' => 'nullable|string|max:20',
            '*.customer_type' => 'nullable|string|max:50',
        ];
    }

    /**
     * Custom validation messages
     *
     * @return array
     */
    public function customValidationMessages(): array
    {
        return [
            '*.email.email' => 'The email must be a valid email address.',
            '*.first_name.max' => 'First name cannot exceed 255 characters.',
            '*.last_name.max' => 'Last name cannot exceed 255 characters.',
            '*.phone.max' => 'Phone number cannot exceed 20 characters.',
        ];
    }

    /**
     * Batch insert size
     *
     * @return int
     */
    public function batchSize(): int
    {
        return 100;
    }

    /**
     * Chunk reading size
     *
     * @return int
     */
    public function chunkSize(): int
    {
        return 100;
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

    /**
     * Handle validation failures
     *
     * @param Failure[] $failures
     */
    public function onFailure(Failure ...$failures)
    {
        foreach ($failures as $failure) {
            $this->importResults['error_details'][] = [
                'row' => $failure->row(),
                'attribute' => $failure->attribute(),
                'errors' => $failure->errors(),
                'values' => $failure->values()
            ];
        }
    }
}