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
        Schema::create('consultation_requests', function (Blueprint $table) {
            $table->id();
            $table->string('fullName');
            $table->string('email');
            $table->string('phone');
            $table->string('company')->nullable();
            $table->enum('serviceType', ['general', 'business', 'technical', 'training', 'implementation', 'other'])->default('general');
            $table->date('preferredDate')->nullable();
            $table->string('preferredTime')->nullable();
            $table->text('message')->nullable();
            $table->enum('status', ['new', 'reviewed', 'contacted', 'completed', 'closed'])->default('new');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('consultation_requests');
    }
};
