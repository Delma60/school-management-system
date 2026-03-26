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
        Schema::create('fee_types', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->decimal('amount', 12, 2);
            $table->string('academic_session'); // e.g., '2025/2026'
            $table->string('term'); // e.g., 'First Term'
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->json("meta")->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fee_types');
    }
};
