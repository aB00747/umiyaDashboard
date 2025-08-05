<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Financial
 *
 * This model represents the financial information for customers.
 * It tracks credit limits, outstanding amounts, payment behavior,
 * revenue metrics, and other financial data.
 */
class Financial extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'customer_id',
        'credit_limit',
        'available_credit',
        'used_credit',
        'outstanding_amount',
        'overdue_amount',
        'payment_terms_days',
        'payment_method',
        'total_revenue',
        'ytd_revenue',
        'last_year_revenue',
        'average_order_value',
        'total_orders',
        'ytd_orders',
        'cancelled_orders',
        'pending_orders',
        'discount_percentage',
        'price_tier',
        'last_payment_date',
        'last_order_date',
        'first_order_date',
        'credit_status',
        'payment_behavior',
        'days_since_last_payment',
        'gst_amount_collected',
        'tds_amount_deducted',
        'bank_name',
        'account_number',
        'ifsc_code',
        'branch_name',
        'financial_notes',
        'credit_notes',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'credit_limit' => 'decimal:2',
        'available_credit' => 'decimal:2',
        'used_credit' => 'decimal:2',
        'outstanding_amount' => 'decimal:2',
        'overdue_amount' => 'decimal:2',
        'total_revenue' => 'decimal:2',
        'ytd_revenue' => 'decimal:2',
        'last_year_revenue' => 'decimal:2',
        'average_order_value' => 'decimal:2',
        'discount_percentage' => 'decimal:2',
        'gst_amount_collected' => 'decimal:2',
        'tds_amount_deducted' => 'decimal:2',
        'last_payment_date' => 'date',
        'last_order_date' => 'date',
        'first_order_date' => 'date',
        'payment_terms_days' => 'integer',
        'total_orders' => 'integer',
        'ytd_orders' => 'integer',
        'cancelled_orders' => 'integer',
        'pending_orders' => 'integer',
        'days_since_last_payment' => 'integer',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = [
        'credit_utilization_percentage',
        'is_credit_limit_exceeded',
        'payment_status',
        'financial_health_score'
    ];

    /**
     * Get the customer that owns the financial record.
     */
    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    /**
     * Calculate credit utilization percentage
     *
     * @return float
     */
    public function getCreditUtilizationPercentageAttribute()
    {
        if ($this->credit_limit <= 0) {
            return 0.0;
        }
        
        return round(($this->used_credit / $this->credit_limit) * 100, 2);
    }

    /**
     * Check if credit limit is exceeded
     *
     * @return bool
     */
    public function getIsCreditLimitExceededAttribute()
    {
        return $this->used_credit > $this->credit_limit;
    }

    /**
     * Get payment status based on outstanding amount and overdue
     *
     * @return string
     */
    public function getPaymentStatusAttribute()
    {
        if ($this->overdue_amount > 0) {
            return 'overdue';
        }
        
        if ($this->outstanding_amount > 0) {
            return 'pending';
        }
        
        return 'current';
    }

    /**
     * Calculate financial health score (0-100)
     * Based on payment behavior, credit utilization, and overdue amounts
     *
     * @return int
     */
    public function getFinancialHealthScoreAttribute()
    {
        $score = 100;
        
        // Deduct points for payment behavior
        switch ($this->payment_behavior) {
            case 'poor':
                $score -= 40;
                break;
            case 'average':
                $score -= 20;
                break;
            case 'good':
                $score -= 5;
                break;
            case 'excellent':
                // No deduction
                break;
        }
        
        // Deduct points for high credit utilization
        $utilization = $this->credit_utilization_percentage;
        if ($utilization > 90) {
            $score -= 30;
        } elseif ($utilization > 75) {
            $score -= 20;
        } elseif ($utilization > 50) {
            $score -= 10;
        }
        
        // Deduct points for overdue amounts
        if ($this->overdue_amount > 0) {
            $score -= 25;
        }
        
        // Deduct points for credit status
        switch ($this->credit_status) {
            case 'blocked':
                $score -= 50;
                break;
            case 'review':
                $score -= 25;
                break;
            case 'warning':
                $score -= 15;
                break;
            case 'good':
                // No deduction
                break;
        }
        
        return max(0, min(100, $score));
    }

    /**
     * Scope a query to only include customers with good credit status.
     */
    public function scopeGoodCredit($query)
    {
        return $query->where('credit_status', 'good');
    }

    /**
     * Scope a query to only include customers with overdue amounts.
     */
    public function scopeOverdue($query)
    {
        return $query->where('overdue_amount', '>', 0);
    }

    /**
     * Scope a query to only include customers with outstanding amounts.
     */
    public function scopeOutstanding($query)
    {
        return $query->where('outstanding_amount', '>', 0);
    }

    /**
     * Scope a query to order by financial health score.
     */
    public function scopeOrderByHealthScore($query, $direction = 'desc')
    {
        // Since this is a computed attribute, we'll order by the factors that contribute to it
        return $query->orderBy('payment_behavior', $direction)
                     ->orderBy('credit_status', $direction)
                     ->orderBy('overdue_amount', $direction === 'desc' ? 'asc' : 'desc');
    }
}