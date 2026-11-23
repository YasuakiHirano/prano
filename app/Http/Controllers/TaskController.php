<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use App\Models\Workspace;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class TaskController extends Controller
{
    public function overview(Request $request): Response
    {
        $user = $request->user();
        $scope = $request->query('scope') === 'team' ? 'team' : 'mine';

        $tasksQuery = Task::query()
            ->whereHas('project.workspace.members', fn (Builder $query) => $query
                ->where('users.id', $user->getAuthIdentifier()))
            ->with([
                'assignee:id,name',
                'project:id,workspace_id,name',
                'project.workspace:id,name',
            ]);

        if ($scope === 'mine') {
            $tasksQuery->where('assigned_to', $user->getAuthIdentifier());
        }

        $workspaces = $user->workspaces()
            ->with([
                'projects:id,workspace_id,name',
                'members:id,name',
            ])
            ->orderBy('workspaces.name')
            ->get(['workspaces.id', 'workspaces.name'])
            ->map(fn (Workspace $workspace): array => [
                'id' => $workspace->id,
                'name' => $workspace->name,
                'projects' => $workspace->projects
                    ->map(fn (Project $project): array => [
                        'id' => $project->id,
                        'name' => $project->name,
                    ])
                    ->values(),
                'members' => $workspace->members
                    ->map(fn (User $member): array => [
                        'id' => $member->id,
                        'name' => $member->name,
                    ])
                    ->values(),
            ])
            ->values();

        return Inertia::render('Tasks/Overview', [
            'scope' => $scope,
            'workspaces' => $workspaces,
            'tasks' => $tasksQuery
                ->latest()
                ->get(['id', 'project_id', 'assigned_to', 'title', 'description', 'status', 'priority', 'due_at'])
                ->map(fn (Task $task): array => [
                    'id' => $task->id,
                    'title' => $task->title,
                    'description' => $task->description,
                    'status' => $task->status,
                    'priority' => $task->priority,
                    'due_at' => $task->due_at?->format('Y-m-d'),
                    'assignee' => $task->assignee === null ? null : [
                        'id' => $task->assignee->id,
                        'name' => $task->assignee->name,
                    ],
                    'project' => [
                        'id' => $task->project->id,
                        'name' => $task->project->name,
                    ],
                    'workspace' => [
                        'id' => $task->project->workspace->id,
                        'name' => $task->project->workspace->name,
                    ],
                ])
                ->values(),
            'status' => session('status'),
        ]);
    }

    public function index(Workspace $workspace, Project $project): Response
    {
        Gate::authorize('viewAny', [Task::class, $project]);

        return Inertia::render('Tasks/Index', [
            'workspace' => $workspace->only(['id', 'name']),
            'project' => $project->only(['id', 'name', 'description']),
            'tasks' => $project->tasks()
                ->with('assignee:id,name')
                ->latest()
                ->get(['id', 'project_id', 'assigned_to', 'title', 'description', 'status', 'priority', 'due_at'])
                ->map(fn (Task $task): array => [
                    'id' => $task->id,
                    'title' => $task->title,
                    'description' => $task->description,
                    'status' => $task->status,
                    'priority' => $task->priority,
                    'due_at' => $task->due_at?->format('Y-m-d'),
                    'assignee' => $task->assignee === null ? null : [
                        'id' => $task->assignee->id,
                        'name' => $task->assignee->name,
                    ],
                ])
                ->values(),
            'members' => $workspace->members()
                ->orderBy('users.name')
                ->get(['users.id', 'users.name'])
                ->map(fn (User $member): array => [
                    'id' => $member->id,
                    'name' => $member->name,
                ])
                ->values(),
            'status' => session('status'),
        ]);
    }

    public function edit(Workspace $workspace, Project $project, Task $task): Response
    {
        Gate::authorize('update', $task);

        return Inertia::render('Tasks/Edit', [
            'workspace' => $workspace->only(['id', 'name']),
            'project' => $project->only(['id', 'name']),
            'task' => [
                'id' => $task->id,
                'title' => $task->title,
                'description' => $task->description,
                'status' => $task->status,
                'priority' => $task->priority,
                'due_at' => $task->due_at?->format('Y-m-d'),
                'assigned_to' => $task->assigned_to,
            ],
            'members' => $workspace->members()
                ->orderBy('users.name')
                ->get(['users.id', 'users.name'])
                ->map(fn (User $member): array => [
                    'id' => $member->id,
                    'name' => $member->name,
                ])
                ->values(),
        ]);
    }

    public function store(
        StoreTaskRequest $request,
        Workspace $workspace,
        Project $project,
    ): RedirectResponse {
        $project->tasks()->create([
            ...$request->validated(),
            'created_by' => $request->user()->getAuthIdentifier(),
            'status' => 'todo',
        ]);

        return to_route('workspaces.projects.tasks.index', [$workspace, $project])
            ->with('status', 'タスクを作成しました。');
    }

    public function update(
        UpdateTaskRequest $request,
        Workspace $workspace,
        Project $project,
        Task $task,
    ): RedirectResponse {
        $validated = $request->validated();
        $completedAt = $validated['status'] === 'done'
            ? ($task->completed_at ?? now())
            : null;

        $task->update([
            ...$validated,
            'completed_at' => $completedAt,
        ]);

        return to_route('workspaces.projects.tasks.index', [$workspace, $project])
            ->with('status', 'タスクを更新しました。');
    }
}
