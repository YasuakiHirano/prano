import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren, ReactNode, useState } from 'react';
import { PageProps } from '@/types';

export default function Authenticated({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const { auth, workspaces } = usePage<PageProps>().props;
    const user = auth.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);
    const [expandedWorkspaces, setExpandedWorkspaces] = useState<number[]>([]);

    const toggleWorkspace = (workspaceId: number) => {
        setExpandedWorkspaces((expanded) =>
            expanded.includes(workspaceId)
                ? expanded.filter((id) => id !== workspaceId)
                : [...expanded, workspaceId],
        );
    };

    return (
        <div className="min-h-screen bg-[#f8faf9] text-slate-900">
            <nav className="border-b border-slate-200/80 bg-white/90 backdrop-blur-sm">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href={route('dashboard')} className="flex items-center gap-2.5">
                                    <span className="flex size-9 items-center justify-center rounded-xl bg-emerald-600 text-lg font-bold text-white shadow-sm shadow-emerald-900/15">
                                        p
                                    </span>
                                    <span className="text-xl font-bold tracking-tight text-slate-900">
                                        prano
                                    </span>
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                <NavLink
                                    href={route('dashboard')}
                                    active={route().current('dashboard')}
                                    className="!border-emerald-600 !text-emerald-700"
                                >
                                    ダッシュボード
                                </NavLink>
                                <div className="relative flex items-center">
                                    <span className="px-1 text-sm font-medium text-slate-500">
                                        ワークスペース
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => toggleWorkspace(-1)}
                                        aria-expanded={expandedWorkspaces.includes(-1)}
                                        aria-label="ワークスペース一覧を開く"
                                        className="ml-1 rounded p-1 text-slate-500 hover:bg-slate-100"
                                    >
                                        <ChevronIcon expanded={expandedWorkspaces.includes(-1)} />
                                    </button>
                                    {expandedWorkspaces.includes(-1) && (
                                        <div className="absolute left-0 top-full z-50 mt-2 w-72 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                                            {workspaces.length ? workspaces.map((workspace) => (
                                                <div key={workspace.id}>
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleWorkspace(workspace.id)}
                                                        aria-expanded={expandedWorkspaces.includes(workspace.id)}
                                                        className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50"
                                                    >
                                                        {workspace.name}
                                                        <ChevronIcon expanded={expandedWorkspaces.includes(workspace.id)} />
                                                    </button>
                                                    {expandedWorkspaces.includes(workspace.id) && (
                                                        <div className="mb-1 ml-3 border-l border-slate-200 pl-2">
                                                            {workspace.projects.map((project) => (
                                                                <Link
                                                                    key={project.id}
                                                                    href={route('workspaces.projects.tasks.index', [workspace.id, project.id])}
                                                                    className="block rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-emerald-50 hover:text-emerald-800"
                                                                >
                                                                    {project.name}
                                                                </Link>
                                                            ))}
                                                            {workspace.projects.length === 0 && (
                                                                <p className="px-3 py-2 text-xs text-slate-400">プロジェクトはありません</p>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            )) : (
                                                <p className="px-3 py-2 text-sm text-slate-500">ワークスペースはありません</p>
                                            )}
                                            <Link href={route('dashboard')} className="mt-1 block rounded-lg px-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-50">
                                                ワークスペースを管理
                                            </Link>
                                        </div>
                                    )}
                                </div>
                                <NavLink
                                    href={route('tasks.index')}
                                    active={route().current('tasks.*')}
                                    className="!border-emerald-600 !text-emerald-700"
                                >
                                    タスク
                                </NavLink>
                            </div>
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-full border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
                                            >
                                                {user.name}

                                                <svg
                                                    className="-me-0.5 ms-2 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link
                                            href={route('profile.edit')}
                                        >
                                            プロフィール
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                        >
                                            ログアウト
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState,
                                    )
                                }
                                className="inline-flex items-center justify-center rounded-xl p-2 text-slate-500 transition hover:bg-emerald-50 hover:text-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className={
                        (showingNavigationDropdown ? 'block' : 'hidden') +
                        ' sm:hidden'
                    }
                >
                    <div className="space-y-1 pb-3 pt-2">
                        <ResponsiveNavLink
                            href={route('dashboard')}
                            active={route().current('dashboard')}
                            className="!border-emerald-600 !bg-emerald-50 !text-emerald-800"
                        >
                            ダッシュボード
                        </ResponsiveNavLink>
                        <div className="px-4 py-3">
                            <button
                                type="button"
                                onClick={() => toggleWorkspace(-1)}
                                aria-expanded={expandedWorkspaces.includes(-1)}
                                className="flex w-full items-center justify-between text-left text-sm font-semibold text-slate-600"
                            >
                                ワークスペース
                                <ChevronIcon expanded={expandedWorkspaces.includes(-1)} />
                            </button>
                            {expandedWorkspaces.includes(-1) && (
                                <div className="mt-2 space-y-1">
                                    {workspaces.map((workspace) => (
                                        <div key={workspace.id}>
                                            <button
                                                type="button"
                                                onClick={() => toggleWorkspace(workspace.id)}
                                                aria-expanded={expandedWorkspaces.includes(workspace.id)}
                                                className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-50"
                                            >
                                                {workspace.name}
                                                <ChevronIcon expanded={expandedWorkspaces.includes(workspace.id)} />
                                            </button>
                                            {expandedWorkspaces.includes(workspace.id) && workspace.projects.map((project) => (
                                                <Link
                                                    key={project.id}
                                                    href={route('workspaces.projects.tasks.index', [workspace.id, project.id])}
                                                    className="block rounded-lg py-2 pl-6 text-sm text-slate-600 hover:bg-emerald-50 hover:text-emerald-800"
                                                >
                                                    {project.name}
                                                </Link>
                                            ))}
                                        </div>
                                    ))}
                                    <Link href={route('dashboard')} className="block px-2 py-2 text-sm font-medium text-emerald-700">
                                        ワークスペースを管理
                                    </Link>
                                </div>
                            )}
                        </div>
                        <ResponsiveNavLink
                            href={route('tasks.index')}
                            active={route().current('tasks.*')}
                            className="!border-emerald-600 !bg-emerald-50 !text-emerald-800"
                        >
                            タスク
                        </ResponsiveNavLink>
                    </div>

                    <div className="border-t border-slate-200 pb-1 pt-4">
                        <div className="px-4">
                            <div className="text-base font-medium text-slate-800">
                                {user.name}
                            </div>
                            <div className="text-sm font-medium text-slate-500">
                                {user.email}
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')} className="!border-transparent">
                                プロフィール
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route('logout')}
                                as="button"
                                className="!border-transparent"
                            >
                                ログアウト
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="border-b border-slate-200 bg-white">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}

function ChevronIcon({ expanded }: { expanded: boolean }) {
    return (
        <svg
            aria-hidden="true"
            className={`size-4 transition-transform ${expanded ? 'rotate-180' : ''}`}
            viewBox="0 0 20 20"
            fill="currentColor"
        >
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
    );
}
