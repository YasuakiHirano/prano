<?php

namespace App\Http\Requests;

use App\Models\Workspace;
use Illuminate\Support\Facades\Gate;

class UpdateWorkspaceRequest extends StoreWorkspaceRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $workspace = $this->route('workspace');

        if (! $workspace instanceof Workspace) {
            return false;
        }

        Gate::authorize('update', $workspace);

        return true;
    }
}
