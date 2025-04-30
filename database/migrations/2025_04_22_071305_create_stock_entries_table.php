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
        Schema::create('stock_entries', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('chemical_id');
            $table->enum('entry_type', ['purchase', 'sale', 'adjustment']);
            $table->decimal('quantity', 10, 2);
            $table->decimal('rate', 10, 2)->nullable();
            $table->unsignedBigInteger('vendor_id')->nullable(); // for purchases
            $table->string('reference_note')->nullable();
            $table->timestamps();

            $table->foreign('chemical_id')->references('id')->on('chemicals')->onDelete('cascade');
            $table->foreign('vendor_id')->references('id')->on('vendors')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_entries');
    }
};
