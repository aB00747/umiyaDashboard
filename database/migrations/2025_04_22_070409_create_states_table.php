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
        Schema::create('states', function (Blueprint $table) {
            $table->id(); // Primary key
            $table->unsignedBigInteger('country_id'); // Foreign key to countries table
            $table->string('state_code', 10)->nullable(); // Optional, e.g., MH, KA
            $table->string('state_name', 100);
            $table->timestamps();

            // Foreign key constraint
            $table->foreign('country_id')->references('id')->on('countries')->onDelete('cascade');
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('states');
    }
};
