<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Workspace;
use Illuminate\Auth\Access\Response;

class WorkspacePolicy
{
    public function view(User $user, Workspace $workspace): Response
    {
        return $this->isMember($user, $workspace)
            ? Response::allow()
            : Response::denyAsNotFound();
    }

    public function update(User $user, Workspace $workspace): Response
    {
        $isOwner = $user->workspaces()
            ->whereKey($workspace->getKey())
            ->wherePivot('role', 'owner')
            ->exists();

        return $isOwner ? Response::allow() : Response::denyAsNotFound();
    }

    private function isMember(User $user, Workspace $workspace): bool
    {
        return $user->workspaces()->whereKey($workspace->getKey())->exists();
    }
}
