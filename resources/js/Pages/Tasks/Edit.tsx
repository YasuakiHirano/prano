import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

type Workspace = {
    id: number;
    name: string;
};

type Project = {
    id: number;
    name: string;
};

type Member = {
    id: number;
    name: string;
};

type Task = {
    id: number;
    title: string;
    description: string | null;
    status: 'todo' | 'in_progress' | 'done';
    priority: 'low' | 'normal' | 'high';
    due_at: string | null;
    assigned_to: number | null;
};

export default function Edit({
    workspace,
    project,
    task,
    members,
}: {
    workspace: Workspace;
    project: Project;
    task: Task;
    members: Member[];
}) {
    const { data, setData, put, processing, errors } = useForm({
        title: task.title,
        description: task.description ?? '',
        assigned_to: task.assigned_to?.toString() ?? '',
        priority: task.priority,
        status: task.status,
        due_at: task.due_at ?? '',
    });

    const submit: FormEventHandler = (event) => {
        event.preventDefault();

        put(route('workspaces.projects.tasks.update', {
            workspace: workspace.id,
            project: project.id,
            task: task.id,
        }));
    };

    return (
        <AuthenticatedLayout>
            <Head title="タスクを編集" />

            <div className="mx-auto flex w-full max-w-3xl flex-col gap-7 px-6 py-10 sm:px-10 sm:py-14">
                <Link
                    href={route('workspaces.projects.tasks.index', {
                        workspace: workspace.id,
                        project: project.id,
                    })}
                    className="w-fit rounded-lg text-sm font-medium text-slate-500 transition hover:text-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
                >
                    ← {project.name}のタスク一覧へ戻る
                </Link>

                <section>
                    <p className="text-sm font-semibold text-emerald-700">
                        {workspace.name} / {project.name}
                    </p>
                    <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                        タスクを編集
                    </h1>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                        内容や担当、進捗を更新できます。
                    </p>
                </section>

                <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
                    <form onSubmit={submit} className="flex flex-col gap-5">
                        <div>
                            <label htmlFor="task-title" className="text-sm font-medium text-slate-700">
                                タスク名
                            </label>
                            <input
                                id="task-title"
                                name="title"
                                type="text"
                                value={data.title}
                                onChange={(event) => setData('title', event.target.value)}
                                maxLength={255}
                                required
                                aria-invalid={Boolean(errors.title)}
                                aria-describedby={errors.title ? 'task-title-error' : undefined}
                                className="mt-2 w-full rounded-xl border-slate-200 px-4 py-3 text-sm shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                            />
                            <InputError id="task-title-error" message={errors.title} className="mt-2" />
                        </div>

                        <div>
                            <label htmlFor="task-description" className="text-sm font-medium text-slate-700">
                                説明（任意）
                            </label>
                            <textarea
                                id="task-description"
                                name="description"
                                value={data.description}
                                onChange={(event) => setData('description', event.target.value)}
                                maxLength={2000}
                                rows={4}
                                aria-invalid={Boolean(errors.description)}
                                className="mt-2 w-full resize-y rounded-xl border-slate-200 px-4 py-3 text-sm shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                            />
                            <InputError message={errors.description} className="mt-2" />
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label htmlFor="task-status" className="text-sm font-medium text-slate-700">
                                    状態
                                </label>
                                <select
                                    id="task-status"
                                    name="status"
                                    value={data.status}
                                    onChange={(event) => setData('status', event.target.value as Task['status'])}
                                    required
                                    aria-invalid={Boolean(errors.status)}
                                    className="mt-2 w-full rounded-xl border-slate-200 px-4 py-3 text-sm shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                                >
                                    <option value="todo">未着手</option>
                                    <option value="in_progress">進行中</option>
                                    <option value="done">完了</option>
                                </select>
                                <InputError message={errors.status} className="mt-2" />
                            </div>
                            <div>
                                <label htmlFor="task-priority" className="text-sm font-medium text-slate-700">
                                    優先度
                                </label>
                                <select
                                    id="task-priority"
                                    name="priority"
                                    value={data.priority}
                                    onChange={(event) => setData('priority', event.target.value as Task['priority'])}
                                    required
                                    aria-invalid={Boolean(errors.priority)}
                                    className="mt-2 w-full rounded-xl border-slate-200 px-4 py-3 text-sm shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                                >
                                    <option value="low">低</option>
                                    <option value="normal">通常</option>
                                    <option value="high">高</option>
                                </select>
                                <InputError message={errors.priority} className="mt-2" />
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label htmlFor="task-assignee" className="text-sm font-medium text-slate-700">
                                    担当者（任意）
                                </label>
                                <select
                                    id="task-assignee"
                                    name="assigned_to"
                                    value={data.assigned_to}
                                    onChange={(event) => setData('assigned_to', event.target.value)}
                                    aria-invalid={Boolean(errors.assigned_to)}
                                    className="mt-2 w-full rounded-xl border-slate-200 px-4 py-3 text-sm shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                                >
                                    <option value="">未設定</option>
                                    {members.map((member) => (
                                        <option key={member.id} value={member.id}>
                                            {member.name}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.assigned_to} className="mt-2" />
                            </div>
                            <div>
                                <label htmlFor="task-due-at" className="text-sm font-medium text-slate-700">
                                    期限（任意）
                                </label>
                                <input
                                    id="task-due-at"
                                    name="due_at"
                                    type="date"
                                    value={data.due_at}
                                    onChange={(event) => setData('due_at', event.target.value)}
                                    aria-invalid={Boolean(errors.due_at)}
                                    className="mt-2 w-full rounded-xl border-slate-200 px-4 py-3 text-sm shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                                />
                                <InputError message={errors.due_at} className="mt-2" />
                            </div>
                        </div>

                        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                            <Link
                                href={route('workspaces.projects.tasks.index', {
                                    workspace: workspace.id,
                                    project: project.id,
                                })}
                                className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
                            >
                                キャンセル
                            </Link>
                            <PrimaryButton
                                className="justify-center rounded-xl !bg-emerald-600 px-6 py-3 text-sm normal-case tracking-normal hover:!bg-emerald-700 focus:!bg-emerald-700 focus:!ring-emerald-600 active:!bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
                                disabled={processing}
                            >
                                {processing ? '保存中…' : '変更を保存'}
                            </PrimaryButton>
                        </div>
                    </form>
                </section>
            </div>
        </AuthenticatedLayout>
    );
}
