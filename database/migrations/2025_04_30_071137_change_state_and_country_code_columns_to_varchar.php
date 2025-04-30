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
        Schema::table('customers', function (Blueprint $table) {
            // First, modify the columns to varchar(5)
            $table->string('state_code', 5)->nullable()->change();
            $table->string('country_code', 5)->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('customers', function (Blueprint $table) {
            // If you need to roll back, convert back to integer
            $table->integer('state_code')->nullable()->change();
            $table->integer('country_code')->nullable()->change();
        });
    }
};