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
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('appointment_id')->nullable()->constrained('appointments')->onDelete('set null');
            $table->foreignId('enrollment_id')->nullable()->constrained('course_enrollments')->onDelete('set null');
            $table->decimal('amount', 10, 2);
            $table->string('currency')->default('NGN');
            $table->string('paystackPaymentRef')->nullable();
            $table->string('stripePaymentId')->nullable();
            $table->enum('status', ['pending', 'completed', 'failed'])->default('pending');
            $table->enum('paymentMethod', ['paystack', 'stripe', 'card', 'bank_transfer', 'ussd'])->default('paystack');
            $table->dateTime('verifiedAt')->nullable();
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
