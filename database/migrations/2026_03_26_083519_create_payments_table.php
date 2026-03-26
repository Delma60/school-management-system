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
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->string('transaction_reference')->unique();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('student_fee_id')->nullable()->constrained('student_fees')->onDelete('set null');
            $table->decimal('amount', 12, 2);
            $table->string('payment_method'); // 'Bank Transfer', 'Cash', 'Card'
            $table->date('payment_date');
            $table->text('notes')->nullable();
            $table->json("meta")->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
