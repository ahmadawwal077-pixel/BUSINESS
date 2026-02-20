<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('verification_token')->nullable();
            $table->dateTime('verification_token_expires')->nullable();
            $table->string('reset_token')->nullable();
            $table->dateTime('reset_token_expires')->nullable();
            $table->boolean('isEmailVerified')->default(false);
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'verification_token',
                'verification_token_expires',
                'reset_token',
                'reset_token_expires',
                'isEmailVerified'
            ]);
        });
    }
};
