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
        Schema::create('classrooms', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // e.g. 10-A
            $table->string('grade_level'); // e.g. Grade 10
            $table->string('room_number')->nullable();
            $table->integer('capacity')->default(30);
            $table->foreignId('teacher_id')->nullable()->constrained('users');
            $table->string("status")->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('classrooms');
    }
};
