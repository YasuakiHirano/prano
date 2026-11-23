<?php

namespace App\Notifications;

use App\Models\Workspace;
use App\Models\WorkspaceInvitation;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class WorkspaceInvitationNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public Workspace $workspace,
        public WorkspaceInvitation $invitation,
        public string $token,
    ) {}

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject("{$this->workspace->name} への招待")
            ->greeting("{$this->workspace->name} に招待されました")
            ->line('Pranoでワークスペースのタスクを一緒に管理しましょう。')
            ->action('招待を確認する', route('workspace-invitations.show', $this->token))
            ->line('この招待リンクは7日間有効です。');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return ['workspace_id' => $this->workspace->id];
    }
}
