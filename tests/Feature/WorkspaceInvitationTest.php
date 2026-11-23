<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Workspace;
use App\Models\WorkspaceInvitation;
use App\Notifications\WorkspaceInvitationNotification;
use Illuminate\Support\Facades\Notification;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class WorkspaceInvitationTest extends TestCase
{
    public function test_workspace_owner_can_invite_a_member_by_email(): void
    {
        Notification::fake();
        $owner = User::factory()->create();
        $workspace = Workspace::factory()->create();
        $workspace->members()->attach($owner, ['role' => 'owner']);
        $email = fake()->unique()->safeEmail();

        $response = $this->actingAs($owner)->post(route('workspaces.invitations.store', $workspace), [
            'email' => $email,
        ]);

        $response->assertRedirect(route('workspaces.edit', $workspace, absolute: false));
        $this->assertDatabaseHas('workspace_invitations', [
            'workspace_id' => $workspace->id,
            'email' => $email,
        ]);
        Notification::assertSentOnDemand(WorkspaceInvitationNotification::class);
    }

    public function test_workspace_member_cannot_invite_members(): void
    {
        $member = User::factory()->create();
        $workspace = Workspace::factory()->create();
        $workspace->members()->attach($member, ['role' => 'member']);

        $this->actingAs($member)
            ->post(route('workspaces.invitations.store', $workspace), ['email' => 'invitee@example.com'])
            ->assertNotFound();

        $this->assertDatabaseMissing('workspace_invitations', ['workspace_id' => $workspace->id]);
    }

    public function test_invited_user_can_accept_with_the_matching_account(): void
    {
        $email = fake()->unique()->safeEmail();
        $user = User::factory()->create(['email' => $email]);
        $workspace = Workspace::factory()->create();
        $token = bin2hex(random_bytes(32));
        $invitation = WorkspaceInvitation::factory()->create([
            'workspace_id' => $workspace->id,
            'email' => $user->email,
            'token_hash' => hash('sha256', $token),
            'expires_at' => now()->addDay(),
        ]);

        $this->actingAs($user)
            ->get(route('workspace-invitations.show', $token))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Workspaces/AcceptInvitation')
                ->where('workspace.name', $workspace->name));

        $this->post(route('workspace-invitations.accept', $token))
            ->assertRedirect(route('dashboard', absolute: false));

        $this->assertDatabaseHas('workspace_user', [
            'workspace_id' => $workspace->id,
            'user_id' => $user->id,
            'role' => 'member',
        ]);
        $this->assertDatabaseMissing('workspace_invitations', ['id' => $invitation->id]);
    }

    public function test_invitation_cannot_be_accepted_by_a_different_email(): void
    {
        $email = fake()->unique()->safeEmail();
        $user = User::factory()->create();
        $workspace = Workspace::factory()->create();
        $token = bin2hex(random_bytes(32));
        WorkspaceInvitation::factory()->create([
            'workspace_id' => $workspace->id,
            'email' => $email,
            'token_hash' => hash('sha256', $token),
            'expires_at' => now()->addDay(),
        ]);

        $this->actingAs($user)
            ->post(route('workspace-invitations.accept', $token))
            ->assertNotFound();

        $this->assertDatabaseMissing('workspace_user', [
            'workspace_id' => $workspace->id,
            'user_id' => $user->id,
        ]);
    }

    public function test_expired_invitation_cannot_be_accepted(): void
    {
        $user = User::factory()->create(['email' => fake()->unique()->safeEmail()]);
        $workspace = Workspace::factory()->create();
        $token = bin2hex(random_bytes(32));
        WorkspaceInvitation::factory()->create([
            'workspace_id' => $workspace->id,
            'email' => $user->email,
            'token_hash' => hash('sha256', $token),
            'expires_at' => now()->subMinute(),
        ]);

        $this->actingAs($user)
            ->post(route('workspace-invitations.accept', $token))
            ->assertNotFound();
    }
}
