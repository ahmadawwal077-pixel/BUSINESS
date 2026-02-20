<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('attendances', function (Blueprint $col) {
            $col->id();
            $col->foreignId('course_id')->constrained()->onDelete('cascade');
            $col->foreignId('student_id')->constrained('users')->onDelete('cascade');
            $col->date('date');
            $col->enum('status', ['present', 'absent', 'late'])->default('present');
            $col->text('notes')->nullable();
            $col->timestamps();

            $col->unique(['course_id', 'student_id', 'date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attendances');
    }
};
