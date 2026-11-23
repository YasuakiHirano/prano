<?php

namespace App\Policies;

use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Auth\Access\Response;
use Illuminate\Database\Eloquent\Builder;

class TaskPolicy
{
    public function viewAny(User $user, Project $project): Response
    {
        return $this->isMemberOfProjectWorkspace($user, $project)
            ? Response::allow()
            : Response::denyAsNotFound();
    }

    public function create(User $user, Project $project): Response
    {
        return $this->isMemberOfProjectWorkspace($user, $project)
            ? Response::allow()
            : Response::denyAsNotFound();
    }

    public function update(User $user, Task $task): Response
    {
        $isMember = $user->workspaces()
            ->whereHas('projects', fn (Builder $query) => $query->whereKey($task->project_id))
            ->exists();

        return $isMember ? Response::allow() : Response::denyAsNotFound();
    }

    private function isMemberOfProjectWorkspace(User $user, Project $project): bool
    {
        return $user->workspaces()->whereKey($project->workspace_id)->exists();
    }
}
