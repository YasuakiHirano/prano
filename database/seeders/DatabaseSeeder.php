<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use App\Models\Workspace;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        $user = User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        $workspace = Workspace::factory()->create([
            'name' => 'Prano Demo Team',
        ]);
        $workspace->members()->attach($user, ['role' => 'owner']);

        $project = Project::factory()->for($workspace)->create([
            'name' => 'Getting Started',
            'description' => 'A sample project for exploring Prano.',
        ]);

        Task::factory()->for($project)->for($user, 'createdBy')->create([
            'title' => 'Explore the sample task',
            'description' => 'This task was created by the demo seeder.',
            'assigned_to' => $user->id,
        ]);
    }
}
