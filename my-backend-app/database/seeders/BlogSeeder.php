<?php

namespace Database\Seeders;

use App\Models\Blog;
use App\Models\User;
use Illuminate\Database\Seeder;

class BlogSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $authors = User::where('isAdmin', true)->get();

        if ($authors->isEmpty()) {
            $authors = User::factory()->count(2)->create(['isAdmin' => true]);
        }

        foreach ($authors as $author) {
            Blog::factory()->count(3)->create([
                'author_id' => $author->id,
            ]);
        }
    }
}
