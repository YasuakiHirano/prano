<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Models\Project;
use App\Models\Workspace;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    public function edit(Workspace $workspace, Project $project): Response
    {
        Gate::authorize('update', $project);

        return Inertia::render('Projects/Edit', [
            'workspace' => $workspace->only(['id', 'name']),
            'project' => $project->only(['id', 'name', 'description']),
        ]);
    }

    public function store(StoreProjectRequest $request, Workspace $workspace): RedirectResponse
    {
        $workspace->projects()->create($request->validated());

        return to_route('dashboard')->with('status', 'プロジェクトを作成しました。');
    }

    public function update(
        UpdateProjectRequest $request,
        Workspace $workspace,
        Project $project,
    ): RedirectResponse {
        $project->update($request->validated());

        return to_route('dashboard')->with('status', 'プロジェクトを更新しました。');
    }
}
