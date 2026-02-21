<?php

namespace Database\Factories;

use App\Models\Course;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Course>
 */
class CourseFactory extends Factory
{
    protected $model = Course::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $categories = [
            "Web Development",
            "Server Security",
            "Data Science",
            "Mobile Development",
            "Cloud Computing",
            "AI/ML",
        ];

        $levels = ["Beginner", "Intermediate", "Advanced"];

        return [
            'title' => fake()->sentence(4),
            'description' => fake()->paragraph(3),
            'instructor_id' => User::factory(),
            'category' => fake()->randomElement($categories),
            'level' => fake()->randomElement($levels),
            'price' => fake()->numberBetween(10000, 150000),
            'duration' => fake()->numberBetween(4, 12),
            'maxStudents' => fake()->numberBetween(20, 100),
            'enrolledStudents' => 0,
            'startDate' => fake()->dateTimeBetween('now', '+2 months'),
            'endDate' => fake()->dateTimeBetween('+3 months', '+6 months'),
            'schedule' => [
                'days' => fake()->randomElements(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], 2),
                'time' => '10:00 AM - 12:00 PM',
            ],
            'status' => 'active',
        ];
    }
}
