<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\WorkspaceController;
use App\Models\Task;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function (Request $request) {
    return Inertia::render('Dashboard', [
        'workspaces' => $request->user()->workspaces()
            ->with('projects:id,workspace_id,name,description,status')
            ->orderByDesc('workspaces.created_at')
            ->get(['workspaces.id', 'workspaces.name', 'workspaces.created_at']),
        'myTasks' => $request->user()->assignedTasks()
            ->where('status', '!=', 'done')
            ->whereHas('project.workspace.members', fn (Builder $query) => $query
                ->where('users.id', $request->user()->getAuthIdentifier()))
            ->with([
                'project:id,workspace_id,name',
                'project.workspace:id,name',
            ])
            ->latest()
            ->limit(5)
            ->get(['id', 'project_id', 'title', 'status', 'priority', 'due_at'])
            ->map(fn (Task $task): array => [
                'id' => $task->id,
                'title' => $task->title,
                'status' => $task->status,
                'priority' => $task->priority,
                'due_at' => $task->due_at?->format('Y-m-d'),
                'project' => [
                    'id' => $task->project->id,
                    'name' => $task->project->name,
                    'workspace_id' => $task->project->workspace->id,
                ],
            ])
            ->values(),
        'status' => session('status'),
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::post('/workspaces', [WorkspaceController::class, 'store'])
    ->middleware(['auth', 'verified'])
    ->name('workspaces.store');

Route::get('/workspaces/{workspace}/edit', [WorkspaceController::class, 'edit'])
    ->middleware(['auth', 'verified'])
    ->name('workspaces.edit');

Route::put('/workspaces/{workspace}', [WorkspaceController::class, 'update'])
    ->middleware(['auth', 'verified'])
    ->name('workspaces.update');

Route::post('/workspaces/{workspace}/projects', [ProjectController::class, 'store'])
    ->middleware(['auth', 'verified'])
    ->name('workspaces.projects.store');

Route::get('/workspaces/{workspace}/projects/{project}/edit', [ProjectController::class, 'edit'])
    ->middleware(['auth', 'verified'])
    ->scopeBindings()
    ->name('workspaces.projects.edit');

Route::put('/workspaces/{workspace}/projects/{project}', [ProjectController::class, 'update'])
    ->middleware(['auth', 'verified'])
    ->scopeBindings()
    ->name('workspaces.projects.update');

Route::get('/workspaces/{workspace}/projects/{project}/tasks', [TaskController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->scopeBindings()
    ->name('workspaces.projects.tasks.index');

Route::post('/workspaces/{workspace}/projects/{project}/tasks', [TaskController::class, 'store'])
    ->middleware(['auth', 'verified'])
    ->scopeBindings()
    ->name('workspaces.projects.tasks.store');

Route::get('/tasks', [TaskController::class, 'overview'])
    ->middleware(['auth', 'verified'])
    ->name('tasks.index');

Route::get('/workspaces/{workspace}/projects/{project}/tasks/{task}/edit', [TaskController::class, 'edit'])
    ->middleware(['auth', 'verified'])
    ->scopeBindings()
    ->name('workspaces.projects.tasks.edit');

Route::put('/workspaces/{workspace}/projects/{project}/tasks/{task}', [TaskController::class, 'update'])
    ->middleware(['auth', 'verified'])
    ->scopeBindings()
    ->name('workspaces.projects.tasks.update');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
