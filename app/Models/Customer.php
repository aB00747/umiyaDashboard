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
     * Get customer's full name
     *
     * @return string
     */
    public function getFullNameAttribute()
    {
        return trim($this->first_name . ' ' . $this->last_name);
    }
}