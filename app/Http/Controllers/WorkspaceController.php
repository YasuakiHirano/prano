<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreWorkspaceRequest;
use App\Http\Requests\UpdateWorkspaceRequest;
use App\Models\Workspace;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class WorkspaceController extends Controller
{
    public function edit(Workspace $workspace): Response
    {
        Gate::authorize('update', $workspace);

        return Inertia::render('Workspaces/Edit', [
            'workspace' => $workspace->only(['id', 'name']),
            'members' => $workspace->members()->orderBy('name')->get(['users.id', 'users.name', 'users.email'])
                ->map(fn ($member): array => [
                    'id' => $member->id,
                    'name' => $member->name,
                    'email' => $member->email,
                    'role' => $member->pivot->role,
                ]),
            'invitations' => $workspace->invitations()
                ->where('expires_at', '>', now())
                ->orderBy('created_at')
                ->get(['id', 'email', 'expires_at']),
        ]);
    }

    public function store(StoreWorkspaceRequest $request): RedirectResponse
    {
        DB::transaction(function () use ($request): void {
            $workspace = Workspace::create($request->validated());
            $request->user()->workspaces()->attach($workspace, ['role' => 'owner']);
        });

        return to_route('dashboard')->with('status', 'ワークスペースを作成しました。');
    }

    public function update(UpdateWorkspaceRequest $request, Workspace $workspace): RedirectResponse
    {
        $workspace->update($request->validated());

        return to_route('dashboard')->with('status', 'ワークスペースを更新しました。');
    }
}
