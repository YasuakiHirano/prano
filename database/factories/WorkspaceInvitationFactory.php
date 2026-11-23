<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Workspace;
use App\Models\WorkspaceInvitation;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<WorkspaceInvitation>
 */
class WorkspaceInvitationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'workspace_id' => Workspace::factory(),
            'invited_by' => User::factory(),
            'email' => fake()->unique()->safeEmail(),
            'token_hash' => hash('sha256', fake()->unique()->sha256()),
            'expires_at' => now()->addDays(7),
        ];
    }
}
