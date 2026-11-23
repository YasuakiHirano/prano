<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Workspace;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class TaskManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_workspace_member_can_view_tasks_for_a_project_in_their_workspace(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        $workspace = Workspace::factory()->create(['name' => 'My team']);
        $otherWorkspace = Workspace::factory()->create(['name' => 'Another team']);
        $workspace->members()->attach($user, ['role' => 'owner']);
        $otherWorkspace->members()->attach($otherUser, ['role' => 'owner']);
        $project = $workspace->projects()->create(['name' => 'Release']);
        $otherProject = $otherWorkspace->projects()->create(['name' => 'Private']);
        $project->tasks()->create(['title' => 'Visible task']);
        $otherProject->tasks()->create(['title' => 'Hidden task']);

        $response = $this->actingAs($user)->get(
            route('workspaces.projects.tasks.index', [$workspace, $project]),
        );

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Tasks/Index')
            ->where('workspace.name', 'My team')
            ->where('project.name', 'Release')
            ->has('tasks', 1)
            ->where('tasks.0.title', 'Visible task')
            ->has('members', 1)
        );
    }

    public function test_workspace_member_can_create_a_task_with_an_assignee(): void
    {
        $user = User::factory()->create();
        $assignee = User::factory()->create();
        $workspace = Workspace::factory()->create();
        $workspace->members()->attach($user, ['role' => 'owner']);
        $workspace->members()->attach($assignee, ['role' => 'member']);
        $project = $workspace->projects()->create(['name' => 'Release']);

        $response = $this->actingAs($user)->post(
            route('workspaces.projects.tasks.store', [$workspace, $project]),
            [
                'title' => 'Prepare release notes',
                'description' => 'Collect the changes for release.',
                'assigned_to' => $assignee->id,
                'priority' => 'high',
                'due_at' => '2026-12-01',
                'created_by' => $assignee->id,
                'status' => 'done',
                'completed_at' => '2026-01-01 00:00:00',
            ],
        );

        $response->assertRedirect(route('workspaces.projects.tasks.index', [$workspace, $project]));
        $response->assertSessionHas('status', 'タスクを作成しました。');
        $this->assertDatabaseHas('tasks', [
            'project_id' => $project->id,
            'created_by' => $user->id,
            'assigned_to' => $assignee->id,
            'title' => 'Prepare release notes',
            'description' => 'Collect the changes for release.',
            'priority' => 'high',
            'status' => 'todo',
            'due_at' => '2026-12-01 00:00:00',
            'completed_at' => null,
        ]);
    }

    public function test_task_requires_a_title_and_an_assignee_from_the_workspace(): void
    {
        $user = User::factory()->create();
        $outsider = User::factory()->create();
        $workspace = Workspace::factory()->create();
        $workspace->members()->attach($user, ['role' => 'owner']);
        $project = $workspace->projects()->create(['name' => 'Release']);

        $response = $this->actingAs($user)->post(
            route('workspaces.projects.tasks.store', [$workspace, $project]),
            [
                'title' => '',
                'assigned_to' => $outsider->id,
                'priority' => 'normal',
            ],
        );

        $response->assertInvalid([
            'title' => 'The title field is required.',
            'assigned_to' => 'selected',
        ]);
        $this->assertDatabaseCount('tasks', 0);
    }

    public function test_non_member_cannot_view_or_create_tasks_in_another_workspace(): void
    {
        $user = User::factory()->create();
        $workspace = Workspace::factory()->create();
        $project = $workspace->projects()->create(['name' => 'Private']);

        $response = $this->actingAs($user)->get(
            route('workspaces.projects.tasks.index', [$workspace, $project]),
        );

        $response->assertNotFound();
    }

    public function test_guest_cannot_view_tasks(): void
    {
        $workspace = Workspace::factory()->create();
        $project = $workspace->projects()->create(['name' => 'Release']);

        $response = $this->get(
            route('workspaces.projects.tasks.index', [$workspace, $project]),
        );

        $response->assertRedirect(route('login'));
    }

    public function test_global_task_screen_defaults_to_the_users_assigned_tasks(): void
    {
        $user = User::factory()->create();
        $teammate = User::factory()->create();
        $outsider = User::factory()->create();
        $workspace = Workspace::factory()->create(['name' => 'My team']);
        $otherWorkspace = Workspace::factory()->create(['name' => 'Other team']);
        $workspace->members()->attach($user, ['role' => 'owner']);
        $workspace->members()->attach($teammate, ['role' => 'member']);
        $otherWorkspace->members()->attach($outsider, ['role' => 'owner']);
        $project = $workspace->projects()->create(['name' => 'Release']);
        $otherProject = $otherWorkspace->projects()->create(['name' => 'Private']);
        $project->tasks()->create(['title' => 'My assigned task', 'assigned_to' => $user->id]);
        $project->tasks()->create(['title' => 'Teammate task', 'assigned_to' => $teammate->id]);
        $otherProject->tasks()->create(['title' => 'Foreign task', 'assigned_to' => $user->id]);

        $response = $this->actingAs($user)->get(route('tasks.index'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Tasks/Overview')
            ->where('scope', 'mine')
            ->has('tasks', 1)
            ->where('tasks.0.title', 'My assigned task')
            ->has('workspaces', 1)
        );
    }

    public function test_global_task_screen_can_show_all_tasks_in_the_users_workspaces(): void
    {
        $user = User::factory()->create();
        $teammate = User::factory()->create();
        $outsider = User::factory()->create();
        $workspace = Workspace::factory()->create();
        $otherWorkspace = Workspace::factory()->create();
        $workspace->members()->attach($user, ['role' => 'owner']);
        $workspace->members()->attach($teammate, ['role' => 'member']);
        $otherWorkspace->members()->attach($outsider, ['role' => 'owner']);
        $project = $workspace->projects()->create(['name' => 'Release']);
        $otherProject = $otherWorkspace->projects()->create(['name' => 'Private']);
        $project->tasks()->create(['title' => 'My task', 'assigned_to' => $user->id]);
        $project->tasks()->create(['title' => 'Teammate task', 'assigned_to' => $teammate->id]);
        $otherProject->tasks()->create(['title' => 'Foreign task', 'assigned_to' => $outsider->id]);

        $response = $this->actingAs($user)->get(route('tasks.index', ['scope' => 'team']));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Tasks/Overview')
            ->where('scope', 'team')
            ->has('tasks', 2)
        );
    }

    public function test_dashboard_highlights_only_the_users_uncompleted_assigned_tasks(): void
    {
        $user = User::factory()->create();
        $outsider = User::factory()->create();
        $workspace = Workspace::factory()->create();
        $otherWorkspace = Workspace::factory()->create();
        $workspace->members()->attach($user, ['role' => 'owner']);
        $otherWorkspace->members()->attach($outsider, ['role' => 'owner']);
        $project = $workspace->projects()->create(['name' => 'Release']);
        $otherProject = $otherWorkspace->projects()->create(['name' => 'Private']);
        $project->tasks()->create(['title' => 'My open task', 'assigned_to' => $user->id]);
        $project->tasks()->create([
            'title' => 'My completed task',
            'assigned_to' => $user->id,
            'status' => 'done',
        ]);
        $otherProject->tasks()->create(['title' => 'Foreign task', 'assigned_to' => $user->id]);

        $response = $this->actingAs($user)->get(route('dashboard'));

        $response->assertInertia(fn (Assert $page) => $page
            ->component('Dashboard')
            ->has('myTasks', 1)
            ->where('myTasks.0.title', 'My open task')
        );
    }

    public function test_workspace_member_can_open_the_task_edit_screen(): void
    {
        $user = User::factory()->create();
        $workspace = Workspace::factory()->create(['name' => 'My team']);
        $workspace->members()->attach($user, ['role' => 'member']);
        $project = $workspace->projects()->create(['name' => 'Release']);
        $task = $project->tasks()->create(['title' => 'Update notes']);

        $response = $this->actingAs($user)->get(
            route('workspaces.projects.tasks.edit', [$workspace, $project, $task]),
        );

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Tasks/Edit')
            ->where('workspace.name', 'My team')
            ->where('project.name', 'Release')
            ->where('task.title', 'Update notes')
        );
    }

    public function test_workspace_member_can_update_a_task_and_completion_time(): void
    {
        $user = User::factory()->create();
        $assignee = User::factory()->create();
        $workspace = Workspace::factory()->create();
        $workspace->members()->attach($user, ['role' => 'owner']);
        $workspace->members()->attach($assignee, ['role' => 'member']);
        $project = $workspace->projects()->create(['name' => 'Release']);
        $task = $project->tasks()->create(['title' => 'Old task']);

        $response = $this->actingAs($user)->put(
            route('workspaces.projects.tasks.update', [$workspace, $project, $task]),
            [
                'title' => 'Updated task',
                'description' => 'Updated details.',
                'assigned_to' => $assignee->id,
                'priority' => 'high',
                'status' => 'done',
                'due_at' => '2026-12-05',
                'completed_at' => '2099-01-01 00:00:00',
                'project_id' => 999,
            ],
        );

        $response->assertRedirect(route('workspaces.projects.tasks.index', [$workspace, $project]));
        $response->assertSessionHas('status', 'タスクを更新しました。');
        $this->assertDatabaseHas('tasks', [
            'id' => $task->id,
            'project_id' => $project->id,
            'assigned_to' => $assignee->id,
            'title' => 'Updated task',
            'description' => 'Updated details.',
            'priority' => 'high',
            'status' => 'done',
            'due_at' => '2026-12-05 00:00:00',
        ]);
        $this->assertNotNull($task->fresh()->completed_at);
        $this->assertNotSame(
            '2099-01-01 00:00:00',
            $task->fresh()->completed_at->format('Y-m-d H:i:s'),
        );
    }

    public function test_reopening_a_task_clears_its_completion_time(): void
    {
        $user = User::factory()->create();
        $workspace = Workspace::factory()->create();
        $workspace->members()->attach($user, ['role' => 'owner']);
        $project = $workspace->projects()->create(['name' => 'Release']);
        $task = $project->tasks()->create([
            'title' => 'Completed task',
            'status' => 'done',
            'completed_at' => now(),
        ]);

        $response = $this->actingAs($user)->put(
            route('workspaces.projects.tasks.update', [$workspace, $project, $task]),
            [
                'title' => 'Completed task',
                'status' => 'in_progress',
                'priority' => 'normal',
            ],
        );

        $response->assertRedirect(route('workspaces.projects.tasks.index', [$workspace, $project]));
        $this->assertNull($task->fresh()->completed_at);
    }

    public function test_non_member_cannot_update_a_task(): void
    {
        $user = User::factory()->create();
        $workspace = Workspace::factory()->create();
        $project = $workspace->projects()->create(['name' => 'Private']);
        $task = $project->tasks()->create(['title' => 'Private task']);

        $response = $this->actingAs($user)->put(
            route('workspaces.projects.tasks.update', [$workspace, $project, $task]),
            [
                'title' => 'Changed task',
                'status' => 'todo',
                'priority' => 'normal',
            ],
        );

        $response->assertNotFound();
        $this->assertDatabaseHas('tasks', [
            'id' => $task->id,
            'title' => 'Private task',
        ]);
    }

    public function test_task_cannot_be_updated_through_a_different_project_url(): void
    {
        $user = User::factory()->create();
        $workspace = Workspace::factory()->create();
        $workspace->members()->attach($user, ['role' => 'owner']);
        $project = $workspace->projects()->create(['name' => 'First']);
        $otherProject = $workspace->projects()->create(['name' => 'Second']);
        $task = $otherProject->tasks()->create(['title' => 'Other task']);

        $response = $this->actingAs($user)->put(
            route('workspaces.projects.tasks.update', [$workspace, $project, $task]),
            [
                'title' => 'Changed task',
                'status' => 'todo',
                'priority' => 'normal',
            ],
        );

        $response->assertNotFound();
        $this->assertDatabaseHas('tasks', [
            'id' => $task->id,
            'project_id' => $otherProject->id,
            'title' => 'Other task',
        ]);
    }
}
