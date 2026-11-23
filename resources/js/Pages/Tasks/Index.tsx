import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

type Workspace = {
    id: number;
    name: string;
};

type Project = {
    id: number;
    name: string;
    description: string | null;
};

type Member = {
    id: number;
    name: string;
};

type TaskStatus = 'todo' | 'in_progress' | 'done';
type TaskPriority = 'low' | 'normal' | 'high';

type TaskItem = {
    id: number;
    title: string;
    description: string | null;
    status: TaskStatus;
    priority: TaskPriority;
    due_at: string | null;
    assignee: Member | null;
};

type TasksPageProps = PageProps<{
    workspace: Workspace;
    project: Project;
    tasks: TaskItem[];
    members: Member[];
    status?: string;
}>;

const statusLabels: Record<TaskStatus, string> = {
    todo: '未着手',
    in_progress: '進行中',
    done: '完了',
};

const statusStyles: Record<TaskStatus, string> = {
    todo: 'bg-slate-100 text-slate-700',
    in_progress: 'bg-sky-100 text-sky-800',
    done: 'bg-emerald-100 text-emerald-800',
};

const priorityLabels: Record<TaskPriority, string> = {
    low: '低',
    normal: '通常',
    high: '高',
};

export default function Index({
    workspace,
    project,
    tasks,
    members,
    status,
}: TasksPageProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        description: '',
        assigned_to: '',
        priority: 'normal',
        due_at: '',
    });

    const submit: FormEventHandler = (event) => {
        event.preventDefault();

        post(route('workspaces.projects.tasks.store', {
            workspace: workspace.id,
            project: project.id,
        }), {
            onSuccess: () => reset(),
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title={`${project.name}のタスク`} />

            <div className="mx-auto flex w-full max-w-7xl flex-col gap-7 px-6 py-10 sm:px-10 sm:py-14">
                <Link
                    href={route('dashboard')}
                    className="w-fit rounded-lg text-sm font-medium text-slate-500 transition hover:text-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
                >
                    ← ダッシュボードへ戻る
                </Link>

                <section className="flex flex-col gap-2">
                    <p className="text-sm font-semibold text-emerald-700">
                        {workspace.name}
                    </p>
                    <div className="flex flex-wrap items-end justify-between gap-3">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                                {project.name}
                            </h1>
                            <p className="mt-2 text-sm leading-6 text-slate-500">
                                タスクを追加して、担当や進捗をチームで共有しましょう。
                            </p>
                        </div>
                        <span className="rounded-full bg-white px-3.5 py-2 text-sm font-semibold text-slate-600 ring-1 ring-slate-200">
                            {tasks.length}件のタスク
                        </span>
                    </div>
                    {project.description && (
                        <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600">
                            {project.description}
                        </p>
                    )}
                </section>

                {status && (
                    <div role="status" className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
                        {status}
                    </div>
                )}

                <div className="grid items-start gap-6 lg:grid-cols-[0.85fr_1.15fr]">
                    <section className="rounded-3xl border border-emerald-100/80 bg-gradient-to-br from-white to-emerald-50/80 p-6 shadow-[0_24px_70px_-42px_rgba(15,70,52,0.35)] sm:p-8">
                        <span className="flex size-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                            <TaskIcon />
                        </span>
                        <h2 className="mt-5 text-xl font-bold tracking-tight text-slate-950">
                            タスクを追加
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                            作業内容を入力し、必要に応じて担当者や期限を設定します。
                        </p>

                        <form onSubmit={submit} className="mt-6 flex flex-col gap-4">
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
                                    placeholder="例：デザイン案を確認する"
                                    maxLength={255}
                                    required
                                    aria-invalid={Boolean(errors.title)}
                                    aria-describedby={errors.title ? 'task-title-error' : undefined}
                                    className="mt-2 w-full rounded-xl border-slate-200 px-4 py-3 text-sm shadow-sm placeholder:text-slate-400 focus:border-emerald-500 focus:ring-emerald-500"
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
                                    placeholder="作業内容や補足を書きます"
                                    maxLength={2000}
                                    rows={3}
                                    aria-invalid={Boolean(errors.description)}
                                    className="mt-2 w-full resize-y rounded-xl border-slate-200 px-4 py-3 text-sm shadow-sm placeholder:text-slate-400 focus:border-emerald-500 focus:ring-emerald-500"
                                />
                                <InputError message={errors.description} className="mt-2" />
                            </div>

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

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="task-priority" className="text-sm font-medium text-slate-700">
                                        優先度
                                    </label>
                                    <select
                                        id="task-priority"
                                        name="priority"
                                        value={data.priority}
                                        onChange={(event) => setData('priority', event.target.value)}
                                        aria-invalid={Boolean(errors.priority)}
                                        className="mt-2 w-full rounded-xl border-slate-200 px-4 py-3 text-sm shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                                    >
                                        <option value="low">低</option>
                                        <option value="normal">通常</option>
                                        <option value="high">高</option>
                                    </select>
                                    <InputError message={errors.priority} className="mt-2" />
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

                            <PrimaryButton
                                className="mt-1 justify-center rounded-xl !bg-emerald-600 px-5 py-3 text-sm normal-case tracking-normal hover:!bg-emerald-700 focus:!bg-emerald-700 focus:!ring-emerald-600 active:!bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
                                disabled={processing}
                            >
                                {processing ? '作成中…' : 'タスクを追加'}
                            </PrimaryButton>
                        </form>
                    </section>

                    <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-bold tracking-tight text-slate-950">
                                    タスク一覧
                                </h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    状態や担当を確認して、必要に応じて編集できます。
                                </p>
                            </div>
                            <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600">
                                {tasks.length}
                            </span>
                        </div>

                        {tasks.length > 0 ? (
                            <ul className="mt-6 flex flex-col gap-3">
                                {tasks.map((task) => (
                                    <li key={task.id}>
                                        <TaskCard
                                            task={task}
                                            workspaceId={workspace.id}
                                            projectId={project.id}
                                        />
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="mt-6 flex min-h-56 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-6 text-center">
                                <span className="flex size-12 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm">
                                    <TaskIcon />
                                </span>
                                <h3 className="mt-4 text-sm font-semibold text-slate-700">
                                    まだタスクがありません
                                </h3>
                                <p className="mt-1 max-w-xs text-sm leading-6 text-slate-500">
                                    左のフォームから最初のタスクを追加できます。
                                </p>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function TaskCard({
    task,
    workspaceId,
    projectId,
}: {
    task: TaskItem;
    workspaceId: number;
    projectId: number;
}) {
    return (
        <article className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <h3 className="break-words text-sm font-semibold text-slate-800">
                        {task.title}
                    </h3>
                    {task.description && (
                        <p className="mt-1.5 break-words text-xs leading-5 text-slate-500">
                            {task.description}
                        </p>
                    )}
                </div>
                <Link
                    href={route('workspaces.projects.tasks.edit', {
                        workspace: workspaceId,
                        project: projectId,
                        task: task.id,
                    })}
                    aria-label={`${task.title}を編集`}
                    className="shrink-0 rounded-lg px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
                >
                    編集
                </Link>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusStyles[task.status]}`}>
                    {statusLabels[task.status]}
                </span>
                <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-slate-600 ring-1 ring-slate-200">
                    優先度：{priorityLabels[task.priority]}
                </span>
                {task.assignee && (
                    <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-slate-600 ring-1 ring-slate-200">
                        担当：{task.assignee.name}
                    </span>
                )}
                {task.due_at && (
                    <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-slate-600 ring-1 ring-slate-200">
                        期限：{task.due_at.replaceAll('-', '/')}
                    </span>
                )}
            </div>
        </article>
    );
}

function TaskIcon() {
    return (
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-5">
            <path d="M8 5.5h11M8 12h11M8 18.5h11M4.5 5.5h.01M4.5 12h.01M4.5 18.5h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
    );
}
