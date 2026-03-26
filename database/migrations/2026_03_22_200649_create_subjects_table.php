<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('subjects', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('code')->unique(); // e.g., MAT-101
            $table->string('department');     // Science, Arts, Commerce, etc.
            $table->text('description')->nullable();
            
            // Academic Weight
            $table->decimal('credits', 3, 1)->default(1.0); 
            $table->enum('type', ['core', 'elective', 'vocational'])->default('core');
            
            // Syllabus Management
            $table->boolean('has_syllabus')->default(false);
            $table->string('syllabus_path')->nullable(); // Path to PDF/Doc
            
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes(); // For 2026 data integrity
        });

        // Pivot Table: Linking Teachers to Subjects
        Schema::create('subject_user', function (Blueprint $table) {
            $table->id();
            $table->foreignId('subject_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // The Teacher
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('subject_user');
        Schema::dropIfExists('subjects');
    }
};