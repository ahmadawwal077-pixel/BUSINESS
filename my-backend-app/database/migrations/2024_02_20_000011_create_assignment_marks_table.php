<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('assignment_marks', function (Blueprint $col) {
            $col->id();
            $col->foreignId('assignment_id')->constrained()->onDelete('cascade');
            $col->foreignId('student_id')->constrained('users')->onDelete('cascade');
            $col->float('marks');
            $col->foreignId('graded_by')->constrained('users')->onDelete('cascade');
            $col->timestamps();

            $col->unique(['assignment_id', 'student_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('assignment_marks');
    }
};
