<?php

namespace App\Http\Requests;

use App\Models\Workspace;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class StoreWorkspaceInvitationRequest extends FormRequest
{
    protected function prepareForValidation(): void
    {
        if (is_string($this->input('email'))) {
            $this->merge(['email' => mb_strtolower($this->input('email'))]);
        }
    }

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

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        /** @var Workspace $workspace */
        $workspace = $this->route('workspace');

        return [
            'email' => [
                'required', 'email', 'max:255',
                Rule::unique('workspace_invitations', 'email')->where('workspace_id', $workspace->id),
                Rule::notIn($workspace->members()->pluck('email')->all()),
            ],
        ];
    }
}
