import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

type ProjectListItem = {
    id: number;
    name: string;
    description: string | null;
    status: string;
};

type WorkspaceListItem = {
    id: number;
    name: string;
    pivot: {
        role: string;
    };
    projects: ProjectListItem[];
};

type DashboardTask = {
    id: number;
    title: string;
    status: 'todo' | 'in_progress' | 'done';
    priority: 'low' | 'normal' | 'high';
    due_at: string | null;
    project: {
        id: number;
        name: string;
        workspace_id: number;
    };
};

type DashboardProps = PageProps<{
    status?: string;
    myTasks: DashboardTask[];
    workspaces: WorkspaceListItem[];
}>;

export default function Dashboard({ auth, myTasks, status, workspaces }: DashboardProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
    });

    const submit: FormEventHandler = (event) => {
        event.preventDefault();

        post(route('workspaces.store'), {
            onSuccess: () => reset('name'),
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="ワークスペース" />

            <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-7xl flex-col gap-8 px-6 py-10 sm:px-10 sm:py-14">
                <section className="flex flex-col gap-3">
                    <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-100 bg-white px-3.5 py-2 text-xs font-semibold text-emerald-800 shadow-sm">
                        <span className="size-2 rounded-full bg-emerald-500" />
                        少人数チームのタスク管理
                    </span>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                        おかえりなさい、{auth.user.name}さん
                    </h1>
                    <p className="max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
                        ワークスペースとプロジェクトを整理して、チームの仕事をはじめましょう。
                    </p>
                </section>

                {status && (
                    <div role="status" className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
                        {status}
                    </div>
                )}

                <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <p className="text-sm font-semibold text-emerald-700">まずはここから</p>
                            <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-950">
                                自分の未完了タスク
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                担当している作業の進捗を確認できます。
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Link
                                href={route('tasks.index')}
                                className="rounded-xl px-4 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
                            >
                                すべてのタスク
                            </Link>
                            <Link
                                href={route('tasks.index')}
                                className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
                            >
                                タスクを追加
                            </Link>
                        </div>
                    </div>

                    {myTasks.length > 0 ? (
                        <ul className="mt-5 grid gap-3 md:grid-cols-2">
                            {myTasks.map((task) => (
                                <li key={task.id}>
                                    <Link
                                        href={route('workspaces.projects.tasks.edit', {
                                            workspace: task.project.workspace_id,
                                            project: task.project.id,
                                            task: task.id,
                                        })}
                                        className="flex h-full items-start justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 transition hover:border-emerald-200 hover:bg-emerald-50/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
                                    >
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-semibold text-slate-800">
                                                {task.title}
                                            </p>
                                            <p className="mt-1 text-xs text-slate-500">
                                                {task.project.name}
                                                {task.due_at && ` · 期限 ${task.due_at.replaceAll('-', '/')}`}
                                            </p>
                                        </div>
                                        <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${task.status === 'in_progress' ? 'bg-sky-100 text-sky-800' : 'bg-slate-100 text-slate-700'}`}>
                                            {task.status === 'in_progress' ? '進行中' : '未着手'}
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="mt-5 rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-5 py-7 text-center">
                            <p className="text-sm font-medium text-slate-700">
                                担当中の未完了タスクはありません
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                                タスク一覧からチームの作業を確認したり、新しいタスクを追加できます。
                            </p>
                        </div>
                    )}
                </section>

                <div className="grid items-start gap-6 lg:grid-cols-[0.85fr_1.15fr]">
                    <section className="rounded-3xl border border-emerald-100/80 bg-gradient-to-br from-white to-emerald-50/80 p-6 shadow-[0_24px_70px_-42px_rgba(15,70,52,0.35)] sm:p-8">
                        <div className="mb-6 flex size-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                            <WorkspaceIcon />
                        </div>
                        <h2 className="text-xl font-bold tracking-tight text-slate-950">
                            ワークスペースを作成
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                            チームの名前をつけて、タスクを整理する場所を作ります。作成したあなたはオーナーになります。
                        </p>

                        <form onSubmit={submit} className="mt-6 flex flex-col gap-3">
                            <label htmlFor="workspace-name" className="text-sm font-medium text-slate-700">
                                ワークスペース名
                            </label>
                            <input
                                id="workspace-name"
                                name="name"
                                type="text"
                                value={data.name}
                                onChange={(event) => setData('name', event.target.value)}
                                placeholder="例：デザインチーム"
                                maxLength={120}
                                required
                                autoComplete="organization"
                                aria-invalid={Boolean(errors.name)}
                                aria-describedby={errors.name ? 'workspace-name-error' : undefined}
                                className="w-full rounded-xl border-slate-200 px-4 py-3 text-sm shadow-sm placeholder:text-slate-400 focus:border-emerald-500 focus:ring-emerald-500"
                            />
                            <InputError
                                id="workspace-name-error"
                                message={errors.name}
                            />
                            <PrimaryButton
                                className="mt-2 justify-center rounded-xl !bg-emerald-600 px-5 py-3 text-sm normal-case tracking-normal hover:!bg-emerald-700 focus:!bg-emerald-700 focus:!ring-emerald-600 active:!bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
                                disabled={processing}
                            >
                                {processing ? '作成中…' : 'ワークスペースを作成'}
                            </PrimaryButton>
                        </form>
                    </section>

                    <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-bold tracking-tight text-slate-950">
                                    あなたのワークスペース
                                </h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    所属するチームとプロジェクトを管理できます。
                                </p>
                            </div>
                            <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600">
                                {workspaces.length}
                            </span>
                        </div>

                        {workspaces.length > 0 ? (
                            <ul className="mt-6 flex flex-col gap-4">
                                {workspaces.map((workspace) => (
                                    <li
                                        key={workspace.id}
                                        className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 sm:p-5"
                                    >
                                        <div className="flex items-center gap-4">
                                            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-lg font-semibold text-emerald-800">
                                                {workspace.name.slice(0, 1)}
                                            </span>
                                            <div className="min-w-0">
                                                <h3 className="truncate text-sm font-semibold text-slate-800">
                                                    {workspace.name}
                                                </h3>
                                                <p className="mt-1 text-xs text-slate-500">
                                                    ワークスペース
                                                </p>
                                            </div>
                                            <span className="ms-auto rounded-full bg-white px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-100">
                                                所属中
                                            </span>
                                            {workspace.pivot.role === 'owner' && (
                                                <Link
                                                    href={route('workspaces.edit', workspace.id)}
                                                    aria-label={`${workspace.name}を編集`}
                                                    className="rounded-lg px-3 py-2 text-xs font-semibold text-slate-500 transition hover:bg-white hover:text-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
                                                >
                                                    編集
                                                </Link>
                                            )}
                                        </div>
                                        <WorkspaceProjects workspace={workspace} />
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="mt-6 flex min-h-56 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-6 text-center">
                                <span className="flex size-12 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm">
                                    <WorkspaceIcon />
                                </span>
                                <h3 className="mt-4 text-sm font-semibold text-slate-700">
                                    まだワークスペースがありません
                                </h3>
                                <p className="mt-1 max-w-xs text-sm leading-6 text-slate-500">
                                    チームのワークスペースを作成すると、ここに表示されます。
                                </p>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function WorkspaceProjects({ workspace }: { workspace: WorkspaceListItem }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        description: '',
    });

    const submit: FormEventHandler = (event) => {
        event.preventDefault();

        post(route('workspaces.projects.store', workspace.id), {
            onSuccess: () => reset(),
        });
    };

    return (
        <div className="mt-5 border-t border-slate-200/80 pt-4">
            <div className="flex items-center justify-between gap-3">
                <h4 className="text-xs font-semibold text-slate-700">プロジェクト</h4>
                <span className="text-xs text-slate-400">{workspace.projects.length}件</span>
            </div>

            {workspace.projects.length > 0 ? (
                <ul className="mt-3 flex flex-col gap-2">
                    {workspace.projects.map((project) => (
                        <li
                            key={project.id}
                            className="flex items-start gap-3 rounded-xl border border-slate-100 bg-white p-3"
                        >
                            <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-700">
                                <ProjectIcon />
                            </span>
                            <div className="min-w-0">
                                <div className="flex items-start justify-between gap-3">
                                    <p className="truncate text-sm font-medium text-slate-800">
                                        {project.name}
                                    </p>
                                    <div className="flex shrink-0 items-center gap-1">
                                        <Link
                                            href={route('workspaces.projects.tasks.index', {
                                                workspace: workspace.id,
                                                project: project.id,
                                            })}
                                            aria-label={`${project.name}のタスクを表示`}
                                            className="rounded-md px-2 py-1 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
                                        >
                                            タスク
                                        </Link>
                                        <Link
                                            href={route('workspaces.projects.edit', {
                                                workspace: workspace.id,
                                                project: project.id,
                                            })}
                                            aria-label={`${project.name}を編集`}
                                            className="rounded-md px-2 py-1 text-xs font-semibold text-slate-500 transition hover:bg-slate-50 hover:text-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
                                        >
                                            編集
                                        </Link>
                                    </div>
                                </div>
                                {project.description && (
                                    <p className="mt-1 break-words text-xs leading-5 text-slate-500">
                                        {project.description}
                                    </p>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="mt-3 rounded-xl bg-white px-3 py-3 text-xs text-slate-500">
                    まだプロジェクトがありません。下のフォームから追加できます。
                </p>
            )}

            <form onSubmit={submit} className="mt-3 grid gap-2.5">
                <div>
                    <label htmlFor={`project-name-${workspace.id}`} className="sr-only">
                        {workspace.name}のプロジェクト名
                    </label>
                    <input
                        id={`project-name-${workspace.id}`}
                        name="name"
                        type="text"
                        value={data.name}
                        onChange={(event) => setData('name', event.target.value)}
                        placeholder="プロジェクト名"
                        maxLength={120}
                        required
                        aria-invalid={Boolean(errors.name)}
                        className="w-full rounded-lg border-slate-200 px-3 py-2.5 text-sm shadow-sm placeholder:text-slate-400 focus:border-emerald-500 focus:ring-emerald-500"
                    />
                    <InputError message={errors.name} className="mt-1.5" />
                </div>
                <div>
                    <label htmlFor={`project-description-${workspace.id}`} className="sr-only">
                        {workspace.name}の説明（任意）
                    </label>
                    <textarea
                        id={`project-description-${workspace.id}`}
                        name="description"
                        value={data.description}
                        onChange={(event) => setData('description', event.target.value)}
                        placeholder="説明（任意）"
                        maxLength={2000}
                        rows={2}
                        aria-invalid={Boolean(errors.description)}
                        className="w-full resize-y rounded-lg border-slate-200 px-3 py-2.5 text-sm shadow-sm placeholder:text-slate-400 focus:border-emerald-500 focus:ring-emerald-500"
                    />
                    <InputError message={errors.description} className="mt-1.5" />
                </div>
                <PrimaryButton
                    className="w-full justify-center rounded-lg !bg-slate-800 px-4 py-2.5 text-xs normal-case tracking-normal hover:!bg-slate-700 focus:!bg-slate-700 focus:!ring-emerald-600 active:!bg-slate-900 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:justify-self-end"
                    disabled={processing}
                >
                    {processing ? '作成中…' : 'プロジェクトを追加'}
                </PrimaryButton>
            </form>
        </div>
    );
}

function WorkspaceIcon() {
    return (
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-6">
            <path d="M4 7.75A1.75 1.75 0 0 1 5.75 6h4.1c.46 0 .9.18 1.24.51l1.32 1.3c.33.33.77.51 1.23.51h4.61A1.75 1.75 0 0 1 20 10.07v7.18A1.75 1.75 0 0 1 18.25 19h-12.5A1.75 1.75 0 0 1 4 17.25V7.75Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
            <path d="M4.5 10h15" stroke="currentColor" strokeWidth="1.7" />
        </svg>
    );
}

function ProjectIcon() {
    return (
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-4">
            <path d="M5 5.75A1.75 1.75 0 0 1 6.75 4h10.5A1.75 1.75 0 0 1 19 5.75v12.5A1.75 1.75 0 0 1 17.25 20H6.75A1.75 1.75 0 0 1 5 18.25V5.75Z" stroke="currentColor" strokeWidth="1.6" />
            <path d="M8.5 8h7M8.5 12h7M8.5 16h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
    );
}
