<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('timetables', function (Blueprint $blueprint) {
            $blueprint->id();
            
            // Relationships
            $blueprint->foreignId('subject_id')->constrained()->cascadeOnDelete();
            $blueprint->foreignId('classroom_id')->constrained()->cascadeOnDelete();
            
            /** * Points to 'users' table because of your STI setup. 
             * We use 'teacher_id' as the column name for clarity.
             */
            $blueprint->foreignId('teacher_id')->constrained('users')->cascadeOnDelete();

            // Schedule Details
            $blueprint->enum('day_of_week', [
                'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
            ]);
            
            $blueprint->time('start_time');
            $blueprint->time('end_time');

            // Metadata & Audit
            $blueprint->boolean('is_published')->default(true);
            $blueprint->json('meta')->nullable(); // For special notes like "Lab Session"
            $blueprint->timestamps();

            /**
             * 2026 Conflict Prevention (Indexing)
             */
            
            // Prevent a Classroom from having two subjects at the same time
            $blueprint->unique(
                ['classroom_id', 'day_of_week', 'start_time'], 
                'unique_classroom_slot'
            );

            // Prevent a Teacher from being in two rooms at the same time
            $blueprint->unique(
                ['teacher_id', 'day_of_week', 'start_time'], 
                'unique_teacher_slot'
            );
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('timetables');
    }
};