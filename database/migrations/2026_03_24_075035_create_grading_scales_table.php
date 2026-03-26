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
        Schema::create('grading_scales', function (Blueprint $table) {
            $table->id();
            $table->string('grade'); // A, B, C, etc.
            $table->integer('min_score'); // 70
            $table->integer('max_score'); // 100
            $table->string('remark')->nullable();
            $table->timestamps();
        });
    } 

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('grading_scales');
    }
};
