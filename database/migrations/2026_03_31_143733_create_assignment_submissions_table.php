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
        Schema::create('assignment_submissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('assignment_id')->constrained()->cascadeOnDelete();
            $table->foreignId('student_id')->constrained('users')->cascadeOnDelete();
            $table->longText('content')->nullable(); // The student's typed answer
            $table->string('file_path')->nullable(); // If they uploaded a PDF/Doc
            $table->integer('score')->nullable(); // The grade you assign
            $table->text('feedback')->nullable(); // Teacher's comments
            $table->timestamp('submitted_at')->useCurrent();
            $table->timestamps();
            
            // A student can only have one active submission per assignment
            $table->unique(['assignment_id', 'student_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('assignment_submissions');
    }
};
