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
        Schema::create('course_enrollments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->constrained('courses')->onDelete('cascade');
            $table->foreignId('student_id')->constrained('users')->onDelete('cascade');
            $table->dateTime('enrollmentDate')->useCurrent();
            $table->enum('paymentStatus', ['pending', 'completed', 'failed'])->default('pending');
            $table->dateTime('paymentDate')->nullable();
            $table->enum('status', ['active', 'completed', 'dropped'])->default('active');
            $table->boolean('certificateEarned')->default(false);
            $table->dateTime('certificateDate')->nullable();

            // Progress tracking
            $table->integer('totalAttendance')->default(0);
            $table->integer('presentDays')->default(0);
            $table->integer('assignmentsSubmitted')->default(0);
            $table->float('assignmentGrade')->default(0); // Average grade
            $table->float('finalGrade')->default(0);

            $table->unique(['course_id', 'student_id']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('course_enrollments');
    }
};
