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
        Schema::create('customers', function (Blueprint $table) {
            $table->id(); // Auto-incrementing primary key
            $table->string('first_name');
            $table->string('last_name')->nullable();
            $table->string('company_name')->nullable();
            $table->string('address_line1');
            $table->string('address_line2')->nullable();
            $table->string('city')->nullable();
            $table->string('state')->nullable();
            $table->integer('state_code')->nullable();
            $table->string('country')->nullable();
            $table->integer('country_code')->nullable();
            $table->integer('pin_code')->nullable();
            $table->string('phone', 15)->nullable();
            $table->string('alternate_phone', 15)->nullable();
            $table->string('email')->nullable();
            $table->string('gstin')->nullable();
            $table->string('pan', 10)->nullable();
            $table->string('customer_type')->nullable(); // e.g. 'Retail', 'Wholesale'
            $table->boolean('is_active')->default(true);
            $table->timestamps(); // created_at & updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customers');
    }
};
