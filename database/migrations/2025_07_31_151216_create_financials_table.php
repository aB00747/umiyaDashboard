<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('financials', function (Blueprint $table) {
            $table->id();
            
            // Customer relationship
            $table->foreignId('customer_id')->constrained('customers')->onDelete('cascade');
            
            // Credit Information
            $table->decimal('credit_limit', 15, 2)->default(0.00);
            $table->decimal('available_credit', 15, 2)->default(0.00);
            $table->decimal('used_credit', 15, 2)->default(0.00);
            
            // Outstanding Balances
            $table->decimal('outstanding_amount', 15, 2)->default(0.00);
            $table->decimal('overdue_amount', 15, 2)->default(0.00);
            
            // Payment Terms
            $table->integer('payment_terms_days')->default(30); // Net 30, Net 15, etc.
            $table->enum('payment_method', ['cash', 'cheque', 'bank_transfer', 'upi', 'card', 'other'])->default('cash');
            
            // Revenue & Financial Metrics
            $table->decimal('total_revenue', 15, 2)->default(0.00);
            $table->decimal('ytd_revenue', 15, 2)->default(0.00); // Year to date
            $table->decimal('last_year_revenue', 15, 2)->default(0.00);
            $table->decimal('average_order_value', 15, 2)->default(0.00);
            
            // Order Statistics
            $table->integer('total_orders')->default(0);
            $table->integer('ytd_orders')->default(0);
            $table->integer('cancelled_orders')->default(0);
            $table->integer('pending_orders')->default(0);
            
            // Discount & Pricing
            $table->decimal('discount_percentage', 5, 2)->default(0.00); // Customer-specific discount
            $table->enum('price_tier', ['standard', 'wholesale', 'premium', 'vip'])->default('standard');
            
            // Dates & Timeline
            $table->date('last_payment_date')->nullable();
            $table->date('last_order_date')->nullable();
            $table->date('first_order_date')->nullable();
            
            // Risk & Status
            $table->enum('credit_status', ['good', 'warning', 'blocked', 'review'])->default('good');
            $table->enum('payment_behavior', ['excellent', 'good', 'average', 'poor'])->default('good');
            $table->integer('days_since_last_payment')->default(0);
            
            // GST & Tax Information
            $table->decimal('gst_amount_collected', 15, 2)->default(0.00);
            $table->decimal('tds_amount_deducted', 15, 2)->default(0.00);
            
            // Banking Details
            $table->string('bank_name')->nullable();
            $table->string('account_number')->nullable();
            $table->string('ifsc_code')->nullable();
            $table->string('branch_name')->nullable();
            
            // Notes & Comments
            $table->text('financial_notes')->nullable();
            $table->text('credit_notes')->nullable();
            
            // Timestamps
            $table->timestamps();
            
            // Indexes for better performance
            $table->index(['customer_id', 'credit_status']);
            $table->index(['payment_behavior', 'credit_status']);
            $table->index('last_payment_date');
            $table->index('outstanding_amount');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('financials');
    }
};
