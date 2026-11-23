<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Workspace;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class WorkspaceManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_create_a_workspace_as_its_owner(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post(route('workspaces.store'), [
            'name' => 'Design team',
            'role' => 'admin',
        ]);

        $response->assertRedirect(route('dashboard', absolute: false));
        $response->assertSessionHas('status', 'ワークスペースを作成しました。');
        $this->assertDatabaseHas('workspaces', ['name' => 'Design team']);
        $this->assertDatabaseHas('workspace_user', [
            'user_id' => $user->id,
            'role' => 'owner',
        ]);
    }

    public function test_workspace_name_is_required(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post(route('workspaces.store'), [
            'name' => '',
        ]);

        $response->assertInvalid(['name' => 'The name field is required.']);
        $this->assertDatabaseCount('workspaces', 0);
    }

    public function test_workspace_name_cannot_exceed_120_characters(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post(route('workspaces.store'), [
            'name' => str_repeat('a', 121),
        ]);

        $response->assertInvalid(['name' => '120 characters']);
        $this->assertDatabaseCount('workspaces', 0);
    }

    public function test_workspace_owner_can_update_the_workspace_name(): void
    {
        $user = User::factory()->create();
        $workspace = Workspace::factory()->create(['name' => 'Old name']);
        $workspace->members()->attach($user, ['role' => 'owner']);

        $response = $this->actingAs($user)->put(route('workspaces.update', $workspace), [
            'name' => 'New name',
        ]);

        $response->assertRedirect(route('dashboard', absolute: false));
        $response->assertSessionHas('status', 'ワークスペースを更新しました。');
        $this->assertDatabaseHas('workspaces', [
            'id' => $workspace->id,
            'name' => 'New name',
        ]);
    }

    public function test_workspace_owner_can_open_the_workspace_edit_screen(): void
    {
        $user = User::factory()->create();
        $workspace = Workspace::factory()->create(['name' => 'Design team']);
        $workspace->members()->attach($user, ['role' => 'owner']);

        $response = $this->actingAs($user)->get(route('workspaces.edit', $workspace));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Workspaces/Edit')
            ->where('workspace.name', 'Design team')
        );
    }

    public function test_workspace_member_cannot_update_the_workspace_name(): void
    {
        $user = User::factory()->create();
        $workspace = Workspace::factory()->create(['name' => 'Original name']);
        $workspace->members()->attach($user, ['role' => 'member']);

        $response = $this->actingAs($user)->put(route('workspaces.update', $workspace), [
            'name' => 'Changed name',
        ]);

        $response->assertNotFound();
        $this->assertDatabaseHas('workspaces', [
            'id' => $workspace->id,
            'name' => 'Original name',
        ]);
    }

    public function test_workspace_member_cannot_open_the_workspace_edit_screen(): void
    {
        $user = User::factory()->create();
        $workspace = Workspace::factory()->create();
        $workspace->members()->attach($user, ['role' => 'member']);

        $response = $this->actingAs($user)->get(route('workspaces.edit', $workspace));

        $response->assertNotFound();
    }

    public function test_guest_cannot_create_a_workspace(): void
    {
        $response = $this->post(route('workspaces.store'), [
            'name' => 'Design team',
        ]);

        $response->assertRedirect(route('login'));
        $this->assertDatabaseCount('workspaces', 0);
    }

    public function test_dashboard_lists_only_workspaces_the_user_belongs_to(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        $workspace = Workspace::factory()->create(['name' => 'My team']);
        $otherWorkspace = Workspace::factory()->create(['name' => 'Another team']);
        $workspace->members()->attach($user, ['role' => 'owner']);
        $otherWorkspace->members()->attach($otherUser, ['role' => 'owner']);

        $response = $this->actingAs($user)->get(route('dashboard'));

        $response->assertInertia(fn (Assert $page) => $page
            ->component('Dashboard')
            ->has('workspaces', 1)
            ->where('workspaces.0.name', 'My team')
        );
    }
}
