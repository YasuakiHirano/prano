<?php

namespace Tests\Feature;

use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use App\Models\Workspace;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaskManagementModelsTest extends TestCase
{
    use RefreshDatabase;

    public function test_workspace_project_task_and_user_relationships_are_defined(): void
    {
        $member = User::factory()->create();
        $creator = User::factory()->create();
        $workspace = Workspace::factory()->create();
        $workspace->members()->attach($member, ['role' => 'owner']);
        $project = $workspace->projects()->create([
            'name' => 'Website refresh',
            'status' => 'active',
        ]);
        $task = $project->tasks()->create([
            'created_by' => $creator->id,
            'assigned_to' => $member->id,
            'title' => 'Prepare the first draft',
        ]);

        $this->assertSame($workspace->id, $member->workspaces()->firstOrFail()->id);
        $this->assertSame('owner', $member->workspaces()->firstOrFail()->pivot->role);
        $this->assertSame($workspace->id, $project->workspace->id);
        $this->assertSame($task->id, $project->tasks()->firstOrFail()->id);
        $this->assertSame($creator->id, $task->createdBy->id);
        $this->assertSame($member->id, $task->assignee->id);
        $this->assertSame($task->id, $creator->createdTasks()->firstOrFail()->id);
        $this->assertSame($task->id, $member->assignedTasks()->firstOrFail()->id);
    }

    public function test_deleting_a_user_preserves_tasks_and_clears_user_references(): void
    {
        $user = User::factory()->create();
        $project = Project::factory()->create();
        $task = Task::factory()->for($project)->create([
            'created_by' => $user->id,
            'assigned_to' => $user->id,
        ]);

        $user->delete();

        $this->assertDatabaseHas('tasks', [
            'id' => $task->id,
            'created_by' => null,
            'assigned_to' => null,
        ]);
    }
}
