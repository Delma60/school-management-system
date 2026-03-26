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
        // database/migrations/xxxx_xx_xx_create_exams_table.php
        Schema::create('examinations', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // e.g., "First Term Examination"
            $table->string('term'); // e.g., "First Term"
            $table->string('session'); // e.g., "2025/2026"
            $table->date('start_date');
            $table->date('end_date');
            $table->enum('status', ['pending', 'ongoing', 'completed'])->default('pending');
            $table->boolean('results_published')->default(false);
            $table->json('meta')->nullable(); // For grading scales or instructions
            $table->timestamps();
        });

        // database/migrations/xxxx_xx_xx_create_exam_subjects_table.php
        Schema::create('exam_subjects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('examination_id')->constrained()->onDelete('cascade');
            $table->foreignId('subject_id')->constrained()->onDelete('cascade');
            $table->date('exam_date')->nullable();
            $table->time('start_time')->nullable();
            $table->integer('max_marks')->default(100);
            $table->integer('pass_marks')->default(40);
            $table->timestamps();
        });

        // database/migrations/xxxx_xx_xx_create_exam_marks_table.php
        Schema::create('exam_marks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('exam_subject_id')->constrained()->onDelete('cascade');
            $table->foreignId('student_id')->constrained("users")->onDelete('cascade');
            $table->foreignId('teacher_id')->constrained("users"); // Who recorded the mark
            $table->float('marks_obtained')->default(0);
            $table->text('teacher_remark')->nullable();
            $table->json('meta')->nullable(); // For breaking down CA vs Exam scores
            $table->timestamps();

            // Prevent duplicate marks for same student in same subject exam
            $table->unique(['exam_subject_id', 'student_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('examinations');
        Schema::dropIfExists('exam_subjects');
        Schema::dropIfExists('exam_marks');
    }
};
