<?php

namespace App\Http\Requests;

use App\Models\Project;
use App\Models\Task;
use App\Models\Workspace;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class StoreTaskRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $workspace = $this->route('workspace');
        $project = $this->route('project');

        if (! $workspace instanceof Workspace || ! $project instanceof Project) {
            return false;
        }

        Gate::authorize('create', [Task::class, $project]);

        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $workspace = $this->route('workspace');
        $workspaceId = $workspace instanceof Workspace ? $workspace->getKey() : null;

        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:2000'],
            'assigned_to' => [
                'nullable',
                'integer',
                Rule::exists('workspace_user', 'user_id')
                    ->where('workspace_id', $workspaceId),
            ],
            'priority' => ['required', 'in:low,normal,high'],
            'due_at' => ['nullable', 'date_format:Y-m-d'],
        ];
    }
}
