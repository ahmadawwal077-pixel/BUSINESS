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
        Schema::create('assignment_submissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('assignment_id')->constrained('assignments')->onDelete('cascade');
            $table->foreignId('course_id')->constrained('courses')->onDelete('cascade');
            $table->foreignId('student_id')->constrained('users')->onDelete('cascade');
            $table->json('submission')->nullable(); // text, files, images
            $table->dateTime('submittedAt')->useCurrent();

            // Grading information
            $table->enum('grading_status', ['pending', 'graded'])->default('pending');
            $table->float('score')->nullable();
            $table->integer('maxScore')->default(100);
            $table->float('percentage')->nullable();
            $table->text('comment')->nullable();
            $table->dateTime('gradedAt')->nullable();
            $table->foreignId('gradedBy')->nullable()->constrained('users')->onDelete('set null');

            $table->json('feedback')->nullable(); // text, files, images
            $table->boolean('isLate')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('assignment_submissions');
    }
};
