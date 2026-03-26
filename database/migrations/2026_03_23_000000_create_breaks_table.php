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
        // Create breaks table
        Schema::create('breaks', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // e.g., "Morning Break", "Fellowship Time"
            $table->enum('type', ['break', 'fellowship', 'sport', 'assembly', 'event'])->default('break');
            $table->text('description')->nullable();
            $table->string('color')->nullable(); // Hex color for UI display
            $table->timestamps();
        });

        // Add timebreak_id to timetable_entries table
        Schema::table('timetables', function (Blueprint $table) {
            $table->foreignId('timebreak_id')->nullable()->constrained('breaks')->onDelete('set null');
            $table->string('entry_type')->default('class'); // 'class', 'break', 'event'
            
            // Make subject_id and teacher_id nullable for breaks/events
            $table->unsignedBigInteger('subject_id')->nullable()->change();
            $table->unsignedBigInteger('teacher_id')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('timetables', function (Blueprint $table) {
            $table->dropForeign(['timebreak_id']);
            $table->dropColumn(['timebreak_id', 'entry_type']);
        });

        Schema::dropIfExists('breaks');
    }
};
