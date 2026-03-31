<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // First, add the column as nullable if it doesn't exist
        if (!Schema::hasColumn('attendances', 'classroom_id')) {
            Schema::table('attendances', function (Blueprint $table) {
                $table->foreignId('classroom_id')->nullable()->constrained('classrooms')->onDelete('cascade');
            });
        } else {
            // If the column exists, clean up invalid references first
            DB::statement('UPDATE attendances SET classroom_id = NULL WHERE classroom_id IS NOT NULL AND classroom_id NOT IN (SELECT id FROM classrooms)');

            // Then add the constraint
            Schema::table('attendances', function (Blueprint $table) {
                $table->foreign('classroom_id')->references('id')->on('classrooms')->onDelete('cascade');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('attendances', function (Blueprint $table) {
            $table->dropForeignKey(['classroom_id']);
            $table->dropColumn('classroom_id');
        });
    }
};
