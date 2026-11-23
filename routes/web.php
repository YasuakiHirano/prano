<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\WorkspaceController;
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

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
