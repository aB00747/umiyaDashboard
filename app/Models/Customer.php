<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Customer
 *
 * This model represents a customer entity in the application.
 * It is used for managing customer-related data and interactions.
 */
class Customer extends Model
{
    use HasFactory;
    
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
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
        'phone',
        'alternate_phone',
        'email',
        'gstin',
        'pan',
        'customer_type',
        'is_active'
    ];
    
    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'state_code' => 'integer',
        'country_code' => 'integer',
        'pin_code' => 'integer',
        'is_active' => 'boolean',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = ['full_name', 'address'];
    
    /**
     * Get customer's full name
     *
     * @return string
     */
    public function getFullNameAttribute()
    {
        return trim($this->first_name . ' ' . $this->last_name);
    }

    /**
     * Get customer's address as an object
     *
     * @return array|null
     */
    public function getAddressAttribute()
    {
        // Return null if no meaningful address data exists
        if (empty($this->address_line1) && empty($this->city) && empty($this->state) && empty($this->country)) {
            return null;
        }

        return [
            'address_line1' => $this->address_line1 ?? null,
            'address_line2' => $this->address_line2 ?? null,
            'city' => $this->city ?? null,
            'state' => $this->state ?? null,
            'state_code' => $this->state_code ?? null,
            'country' => $this->country ?? null,
            'country_code' => $this->country_code ?? null,
            'pin_code' => $this->pin_code ?? null,
        ];
    }

    /**
     * Get the financial record associated with the customer.
     */
    public function financial()
    {
        return $this->hasOne(Financial::class);
    }

    public function getFields() 
    {
        $customers = Customer::query()->get();
    }

}