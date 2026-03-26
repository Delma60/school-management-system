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
        // Migration for Roles table
        Schema::create('roles', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // 'student', 'teacher', 'admin'
            $table->string('slug')->unique(); // 'student', 'teacher', 'admin'
            $table->timestamps();
        });

        // Update Users table
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('role_id')->nullable()->constrained();
            // You can now safely drop the old string 'role' column if you had one
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('roles');
    }
};
