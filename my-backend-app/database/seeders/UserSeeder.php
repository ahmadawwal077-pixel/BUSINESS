<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Admin
        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@tbo.com',
            'password' => Hash::make('password'),
            'isAdmin' => true,
        ]);

        // Create Instructors
        User::factory()->count(5)->create([
            'isAdmin' => false,
        ]);

        // Create Students
        User::factory()->count(20)->create([
            'isAdmin' => false,
        ]);
    }
}
