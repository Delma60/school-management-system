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
        // Check if classroom_id column exists
        if (!Schema::hasColumn('attendances', 'classroom_id')) {
            // Add the column with foreign key constraint
            Schema::table('attendances', function (Blueprint $table) {
                $table->foreignId('classroom_id')->nullable()->constrained('classrooms')->onDelete('cascade');
            });
        } else {
            // If the column exists, modify it to be nullable with correct type
            // Use unsignedBigInteger to match foreignId type
            DB::statement('ALTER TABLE attendances MODIFY COLUMN classroom_id BIGINT UNSIGNED NULL');

            // Clean up invalid references
            DB::statement('UPDATE attendances SET classroom_id = NULL WHERE classroom_id IS NOT NULL AND classroom_id NOT IN (SELECT id FROM classrooms)');

            // Add the foreign key constraint
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
