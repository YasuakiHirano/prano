<?php

namespace App\Policies;

use App\Models\Project;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ProjectPolicy
{
    public function update(User $user, Project $project): Response
    {
        $isWorkspaceMember = $user->workspaces()
            ->whereKey($project->workspace_id)
            ->exists();

        return $isWorkspaceMember ? Response::allow() : Response::denyAsNotFound();
    }
}
