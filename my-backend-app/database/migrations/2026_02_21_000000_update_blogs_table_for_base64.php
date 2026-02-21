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
        Schema::table('blogs', function (Blueprint $table) {
            // Update existing columns to support larger data
            $table->longText('content')->change();
            $table->longText('excerpt')->change();
            $table->longText('featuredImage')->nullable()->change();

            // Add missing columns if they don't exist
            if (!Schema::hasColumn('blogs', 'color')) {
                $table->string('color')->nullable()->after('category');
            }
            if (!Schema::hasColumn('blogs', 'icon')) {
                $table->string('icon')->nullable()->after('color');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('blogs', function (Blueprint $table) {
            $table->text('content')->change();
            $table->text('excerpt')->change();
            $table->string('featuredImage')->nullable()->change();

            $table->dropColumn(['color', 'icon']);
        });
    }
};
