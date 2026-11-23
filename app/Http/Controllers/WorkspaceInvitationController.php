<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreWorkspaceInvitationRequest;
use App\Models\Workspace;
use App\Models\WorkspaceInvitation;
use App\Notifications\WorkspaceInvitationNotification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;
use Inertia\Inertia;
use Inertia\Response;

class WorkspaceInvitationController extends Controller
{
    public function store(StoreWorkspaceInvitationRequest $request, Workspace $workspace): RedirectResponse
    {
        $email = mb_strtolower($request->validated('email'));
        $user = $request->user();

        abort_if($workspace->members()->where('email', $email)->exists(), 422, 'このユーザーはすでにメンバーです。');

        $token = bin2hex(random_bytes(32));
        $invitation = $workspace->invitations()->create([
            'invited_by' => $user->id,
            'email' => $email,
            'token_hash' => hash('sha256', $token),
            'expires_at' => now()->addDays(7),
        ]);

        Notification::route('mail', $email)->notify(new WorkspaceInvitationNotification($workspace, $invitation, $token));

        return to_route('workspaces.edit', $workspace)->with('status', '招待メールを送信しました。');
    }

    public function show(Request $request, string $token): Response
    {
        $invitation = $this->findInvitation($token);
        abort_unless($invitation && $invitation->expires_at->isFuture(), 404);
        abort_unless(mb_strtolower($request->user()->email) === $invitation->email, 404);

        return Inertia::render('Workspaces/AcceptInvitation', [
            'workspace' => $invitation->workspace->only(['id', 'name']),
            'token' => $token,
        ]);
    }

    public function accept(Request $request, string $token): RedirectResponse
    {
        $invitation = $this->findInvitation($token);
        abort_unless($invitation && $invitation->expires_at->isFuture(), 404);
        abort_unless(mb_strtolower($request->user()->email) === $invitation->email, 404);

        DB::transaction(function () use ($invitation, $request): void {
            $invitation->workspace->members()->syncWithoutDetaching([
                $request->user()->id => ['role' => 'member'],
            ]);
            $invitation->delete();
        });

        return to_route('dashboard')->with('status', 'ワークスペースに参加しました。');
    }

    private function findInvitation(string $token): ?WorkspaceInvitation
    {
        return WorkspaceInvitation::query()
            ->with('workspace:id,name')
            ->where('token_hash', hash('sha256', $token))
            ->first();
    }
}
