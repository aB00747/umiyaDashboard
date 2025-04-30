<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('chemicals', function (Blueprint $table) {
            $table->id();
            $table->string('chemical_name');
            $table->string('chemical_code')->unique();
            $table->unsignedBigInteger('category_id')->nullable(); // optional category
            $table->text('description')->nullable();
            $table->string('unit', 20); // e.g. "Liter", "KG", etc.
            $table->decimal('quantity', 10, 2)->default(0);
            $table->decimal('min_quantity', 10, 2)->default(0); // for alerts
            $table->decimal('purchase_price', 10, 2)->default(0);
            $table->decimal('selling_price', 10, 2)->default(0);
            $table->decimal('gst_percentage', 5, 2)->default(0); // e.g., 18.00
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chemicals');
    }
};
