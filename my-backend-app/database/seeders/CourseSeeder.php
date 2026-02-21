<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\User;
use Illuminate\Database\Seeder;

class CourseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $instructors = User::where('isAdmin', false)->take(5)->get();

        if ($instructors->isEmpty()) {
            $instructors = User::factory()->count(3)->create();
        }

        foreach ($instructors as $instructor) {
            Course::factory()->count(2)->create([
                'instructor_id' => $instructor->id,
            ]);
        }
    }
}
