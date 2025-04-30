<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;

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
}
