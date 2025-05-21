<?php

namespace App\Imports;

use App\Models\Customer;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;

class CustomersImport implements ToModel, WithHeadingRow, WithValidation
{
    private $rowCount = 0;

    /**
     * @param array $row
     *
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public function model(array $row)
    {
        // Map Excel column names to database fields
        // Note: Excel headers should be converted to snake_case automatically
        $this->rowCount++;

        return new Customer([
            'first_name' => $row['first_name'] ?? null,
            'last_name' => $row['last_name'] ?? null,
            'company_name' => $row['company_name'] ?? null,
            'address_line1' => $row['address_line1'] ?? null,
            'address_line2' => $row['address_line2'] ?? null,
            'city' => $row['city'] ?? null,
            'state' => $row['state'] ?? null,
            'state_code' => $row['state_code'] ?? null,
            'country' => $row['country'] ?? null,
            'country_code' => $row['country_code'] ?? null,
            'pin_code' => $row['pin_code'] ?? null,
            'phone' => $row['phone'] ?? null,
            'alternate_phone' => $row['alternate_phone'] ?? null,
            'email' => $row['email'] ?? null,
            'gstin' => $row['gstin'] ?? null,
            'pan' => $row['pan'] ?? null,
            'customer_type' => $row['customer_type'] ?? 'Individual',
            'is_active' => isset($row['is_active']) ? filter_var($row['is_active'], FILTER_VALIDATE_BOOLEAN) : true,
        ]);
    }

    /**
     * @return array
     */
    public function rules(): array
    {
        return [
            '*.first_name' => 'required_without:*.company_name|string|max:255',
            '*.company_name' => 'required_without:*.first_name|string|max:255',
            '*.address_line1' => 'required|string|max:255',
        ];
    }

    /**
     * Get the number of imported rows
     *
     * @return int
     */
    public function getRowCount(): int
    {
        return $this->rowCount;
    }
}
