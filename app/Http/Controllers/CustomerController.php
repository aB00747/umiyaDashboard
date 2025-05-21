<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\CustomersExport;
use App\Imports\CustomersImport;
use App\Imports\SimpleCustomerImport;
use Illuminate\Support\Facades\Response;

/**
 * Controller for managing customers
 *
 * Handles all customer-related requests
 *
 * @package App\Http\Controllers
 */
class CustomerController extends Controller
{
    /**
     * Get all customers with optional pagination and filtering
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getAll(Request $request)
    {
        $limit = $request->input('limit', 15);
        $page = $request->input('page', 1);
        $search = $request->input('search', '');

        $query = Customer::query();

        // Apply search filter if provided
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('company_name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        // Apply custom filters
        if ($request->has('is_active')) {
            $query->where('is_active', $request->input('is_active'));
        }

        if ($request->has('customer_type')) {
            $query->where('customer_type', $request->input('customer_type'));
        }

        // Order by
        $orderBy = $request->input('order_by', 'created_at');
        $orderDir = $request->input('order_dir', 'desc');
        $query->orderBy($orderBy, $orderDir);

        // Get paginated results
        $customers = $query->paginate($limit);

        return response()->json($customers);
    }

    /**
     * Get a specific customer by ID
     * 
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function getById($id)
    {
        $customer = Customer::findOrFail($id);
        return response()->json($customer);
    }

    /**
     * Create a new customer
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function create(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'company_name' => 'nullable|string|max:255',
            'address_line1' => 'required|string|max:255',
            'address_line2' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'state' => 'nullable|string|max:255',
            'state_code' => 'nullable|string|max:4',
            'country' => 'nullable|string|max:255',
            'country_code' => 'nullable|string|max:4',
            'pin_code' => 'nullable|integer',
            'phone' => 'nullable|string|max:15',
            'alternate_phone' => 'nullable|string|max:15',
            'email' => 'nullable|email|max:255',
            'gstin' => 'nullable|string|max:255',
            'pan' => 'nullable|string|max:10',
            'customer_type' => 'nullable|string|max:255',
            'is_active' => 'nullable|boolean',
        ]);

        $customer = Customer::create($validated);

        return response()->json($customer, 201);
    }

    /**
     * Update an existing customer
     * 
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        $customer = Customer::findOrFail($id);

        $validated = $request->validate([
            'first_name' => 'string|max:255',
            'last_name' => 'nullable|string|max:255',
            'company_name' => 'nullable|string|max:255',
            'address_line1' => 'string|max:255',
            'address_line2' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'state' => 'nullable|string|max:255',
            'state_code' => 'nullable|integer',
            'country' => 'nullable|string|max:255',
            'country_code' => 'nullable|integer',
            'pin_code' => 'nullable|integer',
            'phone' => 'nullable|string|max:15',
            'alternate_phone' => 'nullable|string|max:15',
            'email' => 'nullable|email|max:255',
            'gstin' => 'nullable|string|max:255',
            'pan' => 'nullable|string|max:10',
            'customer_type' => 'nullable|string|max:255',
            'is_active' => 'nullable|boolean',
        ]);

        $customer->update($validated);

        return response()->json($customer);
    }

    /**
     * Delete a customer
     * 
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function delete($id)
    {
        $customer = Customer::findOrFail($id);
        $customer->delete();

        return response()->json(['message' => 'Customer deleted successfully']);
    }

    /**
     * Search for customers
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function search(Request $request)
    {
        $query = $request->input('query', '');

        $customers = Customer::where('first_name', 'like', "%{$query}%")
            ->orWhere('last_name', 'like', "%{$query}%")
            ->orWhere('company_name', 'like', "%{$query}%")
            ->orWhere('email', 'like', "%{$query}%")
            ->orWhere('phone', 'like', "%{$query}%")
            ->get();

        return response()->json($customers);
    }

    /**
     * Import customers from Excel/CSV file
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function import(Request $request)
    {
        // Validate the uploaded file
        $request->validate([
            'file' => 'required|file|mimes:csv,txt|max:10240', // 10MB max
        ]);

        $file = $request->file('file');

        try {
            $importer = new SimpleCustomerImport();
            $imported = $importer->import($file->getPathname());

            return response()->json([
                'success' => true,
                'imported' => $imported,
                'message' => "Successfully imported {$imported} customers."
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to import customers: ' . $e->getMessage()
            ], 422);
        }
    }

    /**
     * Import customers from Excel file
     * 
     * @param \Illuminate\Http\UploadedFile $file
     * @return int Number of imported customers
     */
    private function importFromExcel($file)
    {
        // Install the required package: composer require maatwebsite/excel
        $import = new CustomersImport();
        Excel::import($import, $file);

        return $import->getRowCount();
    }

    /**
     * Import customers from CSV file
     * 
     * @param \Illuminate\Http\UploadedFile $file
     * @return int Number of imported customers
     */
    private function importFromCSV($file)
    {
        $imported = 0;
        $handle = fopen($file->getPathname(), 'r');

        // Read the header row
        $headers = fgetcsv($handle);
        $mappedHeaders = $this->mapCSVHeaders($headers);

        // Process each row
        while (($data = fgetcsv($handle)) !== false) {
            $customerData = [];

            // Map CSV columns to database fields
            foreach ($mappedHeaders as $index => $field) {
                if ($field && isset($data[$index])) {
                    $customerData[$field] = $data[$index];
                }
            }

            // Validate required fields
            if (empty($customerData['first_name']) && empty($customerData['company_name'])) {
                continue; // Skip invalid rows
            }

            // Create the customer
            try {
                Customer::create($customerData);
                $imported++;
            } catch (\Exception $e) {
                // Log error and continue
                // \Log::error('Failed to import customer: ' . $e->getMessage(), $customerData);
            }
        }

        fclose($handle);
        return $imported;
    }

    /**
     * Map CSV headers to database fields
     * 
     * @param array $headers
     * @return array
     */
    private function mapCSVHeaders($headers)
    {
        $mapping = [];
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
        ];

        foreach ($headers as $index => $header) {
            $header = strtolower(trim($header));
            $mapping[$index] = $fieldMap[$header] ?? null;
        }

        return $mapping;
    }

    /**
     * Download customer import template
     * 
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\BinaryFileResponse
     */
    // public function downloadTemplate(Request $request)
    // {
    //     $format = $request->query('format', 'xlsx');

    //     if ($format === 'csv') {
    //         $headers = [
    //             'First Name',
    //             'Last Name',
    //             'Company Name',
    //             'Address Line 1',
    //             'Address Line 2',
    //             'City',
    //             'State',
    //             'State Code',
    //             'Country',
    //             'Country Code',
    //             'PIN Code',
    //             'Phone',
    //             'Alternate Phone',
    //             'Email',
    //             'GSTIN',
    //             'PAN',
    //             'Customer Type',
    //             'Is Active'
    //         ];

    //         $filename = 'customer_import_template.csv';
    //         $callback = function () use ($headers) {
    //             $file = fopen('php://output', 'w');
    //             fputcsv($file, $headers);
    //             fclose($file);
    //         };

    //         return response()->stream($callback, 200, [
    //             'Content-Type' => 'text/csv',
    //             'Content-Disposition' => "attachment; filename=\"{$filename}\"",
    //         ]);
    //     } else {
    //         // For Excel format
    //         return Excel::download(new CustomerTemplateExport(), 'customer_import_template.xlsx');
    //     }
    // }


    public function downloadTemplate()
    {
        try {
            $importer = new SimpleCustomerImport();
            $templatePath = $importer->generateTemplate();

            return Response::download($templatePath, 'customer_import_template.csv', [
                'Content-Type' => 'text/csv',
            ])->deleteFileAfterSend(true);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to generate template: ' . $e->getMessage()
            ], 500);
        }
    }
}
