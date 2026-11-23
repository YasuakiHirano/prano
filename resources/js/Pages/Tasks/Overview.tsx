import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

type MemberOption = {
    id: number;
    name: string;
};

type ProjectOption = {
    id: number;
    name: string;
};

type WorkspaceOption = {
    id: number;
    name: string;
    projects: ProjectOption[];
    members: MemberOption[];
};

type TaskStatus = 'todo' | 'in_progress' | 'done';
type TaskPriority = 'low' | 'normal' | 'high';

type OverviewTask = {
    id: number;
    title: string;
    description: string | null;
    status: TaskStatus;
    priority: TaskPriority;
    due_at: string | null;
    assignee: MemberOption | null;
    project: ProjectOption;
    workspace: {
        id: number;
        name: string;
    };
};

type OverviewProps = PageProps<{
    scope: 'mine' | 'team';
    workspaces: WorkspaceOption[];
    tasks: OverviewTask[];
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

export default function Overview({ scope, workspaces, tasks, status }: OverviewProps) {
    const [workspaceId, setWorkspaceId] = useState('');
    const [projectId, setProjectId] = useState('');
    const selectedWorkspace = workspaces.find((workspace) => workspace.id === Number(workspaceId));
    const projects = selectedWorkspace?.projects ?? [];
    const members = selectedWorkspace?.members ?? [];

    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        description: '',
        assigned_to: '',
        priority: 'normal',
        due_at: '',
    });

    const submit: FormEventHandler = (event) => {
        event.preventDefault();

        if (!selectedWorkspace || !projectId) {
            return;
        }

        post(route('workspaces.projects.tasks.store', {
            workspace: selectedWorkspace.id,
            project: Number(projectId),
        }), {
            onSuccess: () => {
                reset();
                setWorkspaceId('');
                setProjectId('');
            },
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="タスク" />

            <div className="mx-auto flex w-full max-w-7xl flex-col gap-7 px-6 py-10 sm:px-10 sm:py-14">
                <section className="flex flex-col gap-2">
                    <p className="text-sm font-semibold text-emerald-700">チームの仕事を見渡す</p>
                    <div className="flex flex-wrap items-end justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                                タスク
                            </h1>
                            <p className="mt-2 text-sm leading-6 text-slate-500">
                                担当している作業や、チーム全体の進捗を確認できます。
                            </p>
                        </div>
                        <span className="rounded-full bg-white px-3.5 py-2 text-sm font-semibold text-slate-600 ring-1 ring-slate-200">
                            {tasks.length}件
                        </span>
                    </div>
                </section>

                {status && (
                    <div role="status" className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
                        {status}
                    </div>
                )}

                <div className="grid items-start gap-6 lg:grid-cols-[0.8fr_1.2fr]">
                    <section className="rounded-3xl border border-emerald-100/80 bg-gradient-to-br from-white to-emerald-50/80 p-6 shadow-[0_24px_70px_-42px_rgba(15,70,52,0.35)] sm:p-8">
                        <h2 className="text-xl font-bold tracking-tight text-slate-950">
                            タスクを追加
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                            ワークスペースとプロジェクトを選んで作成します。
                        </p>

                        <form onSubmit={submit} className="mt-6 flex flex-col gap-4">
                            <div>
                                <label htmlFor="workspace-select" className="text-sm font-medium text-slate-700">
                                    ワークスペース
                                </label>
                                <select
                                    id="workspace-select"
                                    value={workspaceId}
                                    onChange={(event) => {
                                        setWorkspaceId(event.target.value);
                                        setProjectId('');
                                        setData('assigned_to', '');
                                    }}
                                    required
                                    className="mt-2 w-full rounded-xl border-slate-200 px-4 py-3 text-sm shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                                >
                                    <option value="">選択してください</option>
                                    {workspaces.map((workspace) => (
                                        <option key={workspace.id} value={workspace.id}>
                                            {workspace.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="project-select" className="text-sm font-medium text-slate-700">
                                    プロジェクト
                                </label>
                                <select
                                    id="project-select"
                                    value={projectId}
                                    onChange={(event) => setProjectId(event.target.value)}
                                    required
                                    disabled={!selectedWorkspace}
                                    className="mt-2 w-full rounded-xl border-slate-200 px-4 py-3 text-sm shadow-sm focus:border-emerald-500 focus:ring-emerald-500 disabled:bg-slate-100"
                                >
                                    <option value="">選択してください</option>
                                    {projects.map((project) => (
                                        <option key={project.id} value={project.id}>
                                            {project.name}
                                        </option>
                                    ))}
                                </select>
                                {selectedWorkspace && projects.length === 0 && (
                                    <p className="mt-2 text-xs text-slate-500">
                                        このワークスペースにはまだプロジェクトがありません。
                                    </p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="overview-task-title" className="text-sm font-medium text-slate-700">
                                    タスク名
                                </label>
                                <input
                                    id="overview-task-title"
                                    type="text"
                                    value={data.title}
                                    onChange={(event) => setData('title', event.target.value)}
                                    placeholder="例：デザイン案を確認する"
                                    maxLength={255}
                                    required
                                    aria-invalid={Boolean(errors.title)}
                                    className="mt-2 w-full rounded-xl border-slate-200 px-4 py-3 text-sm shadow-sm placeholder:text-slate-400 focus:border-emerald-500 focus:ring-emerald-500"
                                />
                                <InputError message={errors.title} className="mt-2" />
                            </div>

                            <div>
                                <label htmlFor="overview-task-description" className="text-sm font-medium text-slate-700">
                                    説明（任意）
                                </label>
                                <textarea
                                    id="overview-task-description"
                                    value={data.description}
                                    onChange={(event) => setData('description', event.target.value)}
                                    maxLength={2000}
                                    rows={3}
                                    className="mt-2 w-full resize-y rounded-xl border-slate-200 px-4 py-3 text-sm shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                                />
                                <InputError message={errors.description} className="mt-2" />
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="overview-task-assignee" className="text-sm font-medium text-slate-700">
                                        担当者
                                    </label>
                                    <select
                                        id="overview-task-assignee"
                                        value={data.assigned_to}
                                        onChange={(event) => setData('assigned_to', event.target.value)}
                                        disabled={!selectedWorkspace}
                                        className="mt-2 w-full rounded-xl border-slate-200 px-4 py-3 text-sm shadow-sm focus:border-emerald-500 focus:ring-emerald-500 disabled:bg-slate-100"
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
                                    <label htmlFor="overview-task-priority" className="text-sm font-medium text-slate-700">
                                        優先度
                                    </label>
                                    <select
                                        id="overview-task-priority"
                                        value={data.priority}
                                        onChange={(event) => setData('priority', event.target.value)}
                                        className="mt-2 w-full rounded-xl border-slate-200 px-4 py-3 text-sm shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                                    >
                                        <option value="low">低</option>
                                        <option value="normal">通常</option>
                                        <option value="high">高</option>
                                    </select>
                                    <InputError message={errors.priority} className="mt-2" />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="overview-task-due" className="text-sm font-medium text-slate-700">
                                    期限（任意）
                                </label>
                                <input
                                    id="overview-task-due"
                                    type="date"
                                    value={data.due_at}
                                    onChange={(event) => setData('due_at', event.target.value)}
                                    className="mt-2 w-full rounded-xl border-slate-200 px-4 py-3 text-sm shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                                />
                                <InputError message={errors.due_at} className="mt-2" />
                            </div>

                            <PrimaryButton
                                className="justify-center rounded-xl !bg-emerald-600 px-5 py-3 text-sm normal-case tracking-normal hover:!bg-emerald-700 focus:!bg-emerald-700 focus:!ring-emerald-600 active:!bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
                                disabled={processing || workspaces.length === 0}
                            >
                                {processing ? '作成中…' : 'タスクを作成'}
                            </PrimaryButton>
                        </form>
                    </section>

                    <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-bold tracking-tight text-slate-950">
                                    {scope === 'mine' ? '自分の担当' : 'チーム全体'}
                                </h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    {scope === 'mine'
                                        ? '自分が担当するタスクです。'
                                        : '所属するワークスペースのタスクです。'}
                                </p>
                            </div>
                            <div className="flex rounded-xl bg-slate-100 p-1" aria-label="タスクの表示範囲">
                                <Link
                                    href={route('tasks.index', { scope: 'mine' })}
                                    aria-current={scope === 'mine' ? 'page' : undefined}
                                    className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${scope === 'mine' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                                >
                                    自分の担当
                                </Link>
                                <Link
                                    href={route('tasks.index', { scope: 'team' })}
                                    aria-current={scope === 'team' ? 'page' : undefined}
                                    className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${scope === 'team' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                                >
                                    チーム全体
                                </Link>
                            </div>
                        </div>

                        {tasks.length > 0 ? (
                            <ul className="mt-6 flex flex-col gap-3">
                                {tasks.map((task) => (
                                    <li key={task.id}>
                                        <article className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 sm:p-5">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <h3 className="break-words text-sm font-semibold text-slate-800">
                                                        {task.title}
                                                    </h3>
                                                    <p className="mt-1 text-xs text-slate-500">
                                                        {task.workspace.name} / {task.project.name}
                                                    </p>
                                                    {task.description && (
                                                        <p className="mt-2 break-words text-xs leading-5 text-slate-500">
                                                            {task.description}
                                                        </p>
                                                    )}
                                                </div>
                                                <Link
                                                    href={route('workspaces.projects.tasks.edit', {
                                                        workspace: task.workspace.id,
                                                        project: task.project.id,
                                                        task: task.id,
                                                    })}
                                                    aria-label={`${task.title}を編集`}
                                                    className="shrink-0 rounded-lg px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
                                                >
                                                    編集
                                                </Link>
                                            </div>
                                            <div className="mt-3 flex flex-wrap gap-2">
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
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="mt-6 flex min-h-56 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-6 text-center">
                                <h3 className="text-sm font-semibold text-slate-700">
                                    {scope === 'mine' ? '担当中のタスクはありません' : '表示できるタスクはありません'}
                                </h3>
                                <p className="mt-1 max-w-xs text-sm leading-6 text-slate-500">
                                    左のフォームから新しいタスクを作成できます。
                                </p>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
