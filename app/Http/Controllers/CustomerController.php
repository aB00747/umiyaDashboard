<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\CustomersExport;
use App\Imports\CustomerImport;
use App\Services\PdfProcessor;
use App\Services\TemplateGenerator;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

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

        $defaultColumns = [
            'id',
            'first_name',
            'last_name',
            'company_name',
            'address_line1',
            'address_line2',
            'city',
            'state',
            'state_code',
            'country',
            'country_code',
            'pin_code',
            'alternate_phone',
            'gstin',
            'pan',
            'email',
            'phone',
            'customer_type',
            'is_active',
            'created_at',
            'updated_at',
        ];

        // Allow dynamic column selection via 'fields' parameter
        $fields = $request->input('fields');
        $columns = $fields ? explode(',', $fields) : $defaultColumns;

        $query = Customer::select($columns);

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
     * Import customers from various file formats (Excel, CSV, PDF)
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function import(Request $request)
    {
        // Validate the uploaded file
        $validator = Validator::make($request->all(), [
            'file' => 'required|file|mimes:xlsx,xls,csv,pdf|max:51200', // 50MB max
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'File validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $file = $request->file('file');
        $extension = strtolower($file->getClientOriginalExtension());

        try {
            Log::info('Starting customer import', [
                'filename' => $file->getClientOriginalName(),
                'size' => $file->getSize(),
                'type' => $extension
            ]);

            $results = match ($extension) {
                'xlsx', 'xls' => $this->importFromExcel($file),
                'csv' => $this->importFromCsv($file),
                'pdf' => $this->importFromPdf($file),
                default => throw new \Exception("Unsupported file format: {$extension}")
            };

            Log::info('Customer import completed', $results);

            return response()->json([
                'success' => true,
                'message' => $this->generateImportMessage($results),
                ...$results
            ]);

        } catch (\Exception $e) {
            Log::error('Customer import failed', [
                'filename' => $file->getClientOriginalName(),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to import customers: ' . $e->getMessage(),
                'error_details' => config('app.debug') ? $e->getTraceAsString() : null
            ], 422);
        }
    }

    /**
     * Import customers from Excel file
     * 
     * @param \Illuminate\Http\UploadedFile $file
     * @return array Import results
     */
    private function importFromExcel($file): array
    {
        $import = new CustomerImport();
        Excel::import($import, $file);
        return $import->getImportResults();
    }

    /**
     * Import customers from CSV file
     * 
     * @param \Illuminate\Http\UploadedFile $file
     * @return array Import results
     */
    private function importFromCsv($file): array
    {
        // Convert CSV to Excel format for consistent processing
        $import = new CustomerImport();
        Excel::import($import, $file);
        return $import->getImportResults();
    }

    /**
     * Import customers from PDF file
     * 
     * @param \Illuminate\Http\UploadedFile $file
     * @return array Import results
     */
    private function importFromPdf($file): array
    {
        $processor = new PdfProcessor();
        return $processor->processPdfFile($file);
    }


    /**
     * Download customer import template
     * 
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\BinaryFileResponse|\Illuminate\Http\JsonResponse
     */
    public function downloadTemplate(Request $request)
    {
        $format = strtolower($request->input('format', 'xlsx'));
        
        // Validate format
        if (!in_array($format, ['xlsx', 'csv', 'pdf'])) {
            return response()->json([
                'success' => false,
                'message' => "Unsupported format: {$format}. Supported formats: xlsx, csv, pdf"
            ], 400);
        }

        try {
            $generator = new TemplateGenerator();
            $templatePath = $generator->generateTemplate($format);
            
            $filename = 'customer_import_template.' . $format;
            $contentType = $generator->getContentType($format);

            Log::info('Template downloaded', [
                'format' => $format,
                'filename' => $filename,
                'path' => $templatePath
            ]);

            return Response::download($templatePath, $filename, [
                'Content-Type' => $contentType,
                'Content-Disposition' => "attachment; filename=\"{$filename}\"",
                'Cache-Control' => 'no-cache, must-revalidate',
                'Expires' => '0'
            ])->deleteFileAfterSend(true);

        } catch (\Exception $e) {
            Log::error('Template generation failed', [
                'format' => $format,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to generate template: ' . $e->getMessage(),
                'error_details' => config('app.debug') ? $e->getTraceAsString() : null
            ], 500);
        }
    }

    /**
     * Generate import success message
     * 
     * @param array $results
     * @return string
     */
    private function generateImportMessage(array $results): string
    {
        $imported = $results['imported'] ?? 0;
        $skipped = $results['skipped'] ?? 0;
        $errors = $results['errors'] ?? 0;
        
        $message = "Successfully imported {$imported} customer" . ($imported !== 1 ? 's' : '');
        
        if ($skipped > 0) {
            $message .= ", skipped {$skipped} record" . ($skipped !== 1 ? 's' : '');
        }
        
        if ($errors > 0) {
            $message .= ", {$errors} error" . ($errors !== 1 ? 's' : ' occurred');
        }
        
        return $message . '.';
    }

    /**
     * Validate import file before processing
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function validateImport(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'file' => 'required|file|mimes:xlsx,xls,csv,pdf|max:51200',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'File validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $file = $request->file('file');
        
        return response()->json([
            'success' => true,
            'message' => 'File is valid for import',
            'file_info' => [
                'name' => $file->getClientOriginalName(),
                'size' => $file->getSize(),
                'type' => $file->getClientOriginalExtension(),
                'mime_type' => $file->getMimeType()
            ]
        ]);
    }
}
