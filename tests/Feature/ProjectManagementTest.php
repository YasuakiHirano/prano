<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Workspace;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ProjectManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_workspace_member_can_create_a_project_in_their_workspace(): void
    {
        $user = User::factory()->create();
        $workspace = Workspace::factory()->create();
        $workspace->members()->attach($user, ['role' => 'member']);

        $response = $this->actingAs($user)->post(
            route('workspaces.projects.store', $workspace),
            [
                'name' => 'Website refresh',
                'description' => 'Update the public site.',
                'status' => 'archived',
                'workspace_id' => 999,
            ],
        );

        $response->assertRedirect(route('dashboard', absolute: false));
        $response->assertSessionHas('status', 'プロジェクトを作成しました。');
        $this->assertDatabaseHas('projects', [
            'workspace_id' => $workspace->id,
            'name' => 'Website refresh',
            'description' => 'Update the public site.',
            'status' => 'active',
        ]);
    }

    public function test_project_requires_a_name_and_limits_description_length(): void
    {
        $user = User::factory()->create();
        $workspace = Workspace::factory()->create();
        $workspace->members()->attach($user, ['role' => 'owner']);

        $response = $this->actingAs($user)->post(
            route('workspaces.projects.store', $workspace),
            [
                'name' => '',
                'description' => str_repeat('a', 2001),
            ],
        );

        $response->assertInvalid([
            'name' => 'The name field is required.',
            'description' => '2000 characters',
        ]);
        $this->assertDatabaseCount('projects', 0);
    }

    public function test_workspace_member_can_open_the_project_edit_screen(): void
    {
        $user = User::factory()->create();
        $workspace = Workspace::factory()->create(['name' => 'Design team']);
        $workspace->members()->attach($user, ['role' => 'member']);
        $project = $workspace->projects()->create(['name' => 'Old project']);

        $response = $this->actingAs($user)->get(
            route('workspaces.projects.edit', [$workspace, $project]),
        );

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Projects/Edit')
            ->where('workspace.name', 'Design team')
            ->where('project.name', 'Old project')
        );
    }

    public function test_workspace_member_can_update_a_project(): void
    {
        $user = User::factory()->create();
        $workspace = Workspace::factory()->create();
        $workspace->members()->attach($user, ['role' => 'member']);
        $project = $workspace->projects()->create([
            'name' => 'Old project',
            'description' => 'Old description',
        ]);

        $response = $this->actingAs($user)->put(
            route('workspaces.projects.update', [$workspace, $project]),
            [
                'name' => 'Updated project',
                'description' => 'Updated description',
                'workspace_id' => 999,
                'status' => 'archived',
            ],
        );

        $response->assertRedirect(route('dashboard', absolute: false));
        $response->assertSessionHas('status', 'プロジェクトを更新しました。');
        $this->assertDatabaseHas('projects', [
            'id' => $project->id,
            'workspace_id' => $workspace->id,
            'name' => 'Updated project',
            'description' => 'Updated description',
            'status' => 'active',
        ]);
    }

    public function test_non_member_cannot_update_a_project(): void
    {
        $user = User::factory()->create();
        $workspace = Workspace::factory()->create();
        $project = $workspace->projects()->create(['name' => 'Private project']);

        $response = $this->actingAs($user)->put(
            route('workspaces.projects.update', [$workspace, $project]),
            ['name' => 'Changed project'],
        );

        $response->assertNotFound();
        $this->assertDatabaseHas('projects', [
            'id' => $project->id,
            'name' => 'Private project',
        ]);
    }

    public function test_project_cannot_be_updated_through_a_different_workspace_url(): void
    {
        $user = User::factory()->create();
        $workspace = Workspace::factory()->create();
        $otherWorkspace = Workspace::factory()->create();
        $workspace->members()->attach($user, ['role' => 'owner']);
        $project = $otherWorkspace->projects()->create(['name' => 'Other project']);

        $response = $this->actingAs($user)->put(
            route('workspaces.projects.update', [$workspace, $project]),
            ['name' => 'Changed project'],
        );

        $response->assertNotFound();
        $this->assertDatabaseHas('projects', [
            'id' => $project->id,
            'workspace_id' => $otherWorkspace->id,
            'name' => 'Other project',
        ]);
    }

    public function test_non_member_cannot_create_a_project_in_another_workspace(): void
    {
        $user = User::factory()->create();
        $workspace = Workspace::factory()->create();

        $response = $this->actingAs($user)->post(
            route('workspaces.projects.store', $workspace),
            ['name' => 'Private project'],
        );

        $response->assertNotFound();
        $this->assertDatabaseCount('projects', 0);
    }

    public function test_guest_cannot_create_a_project(): void
    {
        $workspace = Workspace::factory()->create();

        $response = $this->post(
            route('workspaces.projects.store', $workspace),
            ['name' => 'Private project'],
        );

        $response->assertRedirect(route('login'));
        $this->assertDatabaseCount('projects', 0);
    }

    public function test_dashboard_lists_projects_only_from_the_users_workspaces(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        $workspace = Workspace::factory()->create(['name' => 'My team']);
        $otherWorkspace = Workspace::factory()->create(['name' => 'Another team']);
        $workspace->members()->attach($user, ['role' => 'owner']);
        $otherWorkspace->members()->attach($otherUser, ['role' => 'owner']);
        $workspace->projects()->create(['name' => 'Visible project']);
        $otherWorkspace->projects()->create(['name' => 'Hidden project']);

        $response = $this->actingAs($user)->get(route('dashboard'));

        $response->assertInertia(fn (Assert $page) => $page
            ->component('Dashboard')
            ->has('workspaces', 1)
            ->where('workspaces.0.name', 'My team')
            ->has('workspaces.0.projects', 1)
            ->where('workspaces.0.projects.0.name', 'Visible project')
        );
    }
}
