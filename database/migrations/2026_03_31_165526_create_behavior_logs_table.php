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
        Schema::create('behavior_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('users')->cascadeOnDelete();
            // The staff member (teacher/admin) who reported the behavior
            $table->foreignId('reporter_id')->constrained('users')->cascadeOnDelete(); 
            
            $table->string('type'); // e.g., 'positive', 'infraction', 'neutral'
            $table->string('title'); // e.g., 'Classroom Disturbance', 'Helped a Peer'
            $table->text('description');
            $table->date('incident_date');
            $table->string('action_taken')->nullable(); // e.g., 'Detention', 'Verbal Warning', 'Awarded Points'
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('behavior_logs');
    }
};
