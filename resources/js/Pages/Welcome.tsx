import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth }: PageProps) {
    return (
        <>
            <Head title="少人数チームのタスク管理" />
            <div className="min-h-screen overflow-hidden bg-[#f8faf9] text-slate-900">
                <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-5 sm:px-10">
                    <Link href="/" className="flex items-center gap-2.5" aria-label="Prano ホーム">
                        <span className="flex size-9 items-center justify-center rounded-xl bg-emerald-600 text-lg font-bold text-white shadow-sm shadow-emerald-900/15">
                            p
                        </span>
                        <span className="text-xl font-bold tracking-tight">prano</span>
                    </Link>
                    <nav className="flex items-center gap-3 text-sm font-medium">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="rounded-full px-4 py-2.5 text-slate-600 transition hover:bg-white hover:text-slate-900"
                            >
                                ダッシュボードへ
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="rounded-full px-4 py-2.5 text-slate-600 transition hover:bg-white hover:text-slate-900"
                                >
                                    ログイン
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="rounded-full bg-emerald-600 px-5 py-2.5 text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
                                >
                                    新規登録
                                </Link>
                            </>
                        )}
                    </nav>
                </header>

                <main className="relative mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl items-center gap-14 px-6 pb-16 pt-10 sm:px-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:pb-24 lg:pt-0">
                    <div className="relative z-10 mx-auto max-w-xl lg:mx-0">
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white/80 px-3.5 py-2 text-sm font-medium text-emerald-800 shadow-sm">
                            <span className="size-2 rounded-full bg-emerald-500" />
                            少人数チームのためのタスク管理
                        </div>
                        <h1 className="text-4xl font-bold leading-[1.2] tracking-tight text-slate-950 sm:text-5xl lg:text-[3.5rem]">
                            チームの仕事を、
                            <br />
                            <span className="text-emerald-700">ひと目でわかる。</span>
                        </h1>
                        <p className="mt-6 max-w-lg text-base leading-8 text-slate-600 sm:text-lg">
                            誰が、何を、どこまで進めているか。
                            <br className="hidden sm:block" />
                            Pranoなら、チームのタスクをシンプルに整理できます。
                        </p>
                        {!auth.user && (
                            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                                <Link
                                    href={route('register')}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-7 py-4 text-base font-semibold text-white shadow-lg shadow-emerald-900/15 transition hover:-translate-y-0.5 hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
                                >
                                    新規登録してはじめる
                                    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="size-5">
                                        <path d="M4.167 10h11.666M10 4.167 15.833 10 10 15.833" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </Link>
                                <span className="text-center text-sm text-slate-500 sm:px-2">
                                    登録はかんたん、すぐに使えます
                                </span>
                            </div>
                        )}
                        <div className="mt-10 flex items-center gap-3 text-sm text-slate-500">
                            <div className="flex -space-x-2">
                                <span className="flex size-8 items-center justify-center rounded-full border-2 border-[#f8faf9] bg-amber-100 text-xs font-semibold text-amber-800">A</span>
                                <span className="flex size-8 items-center justify-center rounded-full border-2 border-[#f8faf9] bg-sky-100 text-xs font-semibold text-sky-800">M</span>
                                <span className="flex size-8 items-center justify-center rounded-full border-2 border-[#f8faf9] bg-violet-100 text-xs font-semibold text-violet-800">Y</span>
                            </div>
                            <span>チームの「今」が、すぐわかる</span>
                        </div>
                    </div>

                    <div className="relative mx-auto w-full max-w-2xl lg:mx-0">
                        <div aria-hidden="true" className="absolute -inset-10 rounded-full bg-emerald-100/70 blur-3xl" />
                        <div className="relative rotate-[-1deg] rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_30px_80px_-32px_rgba(15,70,52,0.3)] sm:rounded-3xl sm:p-6">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                                <div className="flex items-center gap-3">
                                    <span className="flex size-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                                        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-5">
                                            <path d="M4 5.75A1.75 1.75 0 0 1 5.75 4h12.5A1.75 1.75 0 0 1 20 5.75v12.5A1.75 1.75 0 0 1 18.25 20H5.75A1.75 1.75 0 0 1 4 18.25V5.75Z" stroke="currentColor" strokeWidth="1.6" />
                                            <path d="M8 8h8M8 12h5M8 16h3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                                        </svg>
                                    </span>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-800">プロジェクト</p>
                                        <p className="text-xs text-slate-400">チームのタスク</p>
                                    </div>
                                </div>
                                <div className="flex -space-x-2">
                                    <span className="flex size-7 items-center justify-center rounded-full border-2 border-white bg-amber-100 text-[10px] font-semibold text-amber-800">A</span>
                                    <span className="flex size-7 items-center justify-center rounded-full border-2 border-white bg-sky-100 text-[10px] font-semibold text-sky-800">M</span>
                                    <span className="flex size-7 items-center justify-center rounded-full border-2 border-white bg-violet-100 text-[10px] font-semibold text-violet-800">Y</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-3 pt-5 sm:gap-4">
                                <TaskColumn title="これから" count="2" tone="slate" tasks={[['企画のアイデア出し', '企画'], ['来週の予定を確認', 'チーム']]} />
                                <TaskColumn title="進行中" count="2" tone="blue" tasks={[['新機能のデザイン', 'デザイン'], ['お知らせ文を書く', 'コンテンツ']]} />
                                <TaskColumn title="完了" count="1" tone="green" tasks={[['キックオフを実施', 'ミーティング']]} />
                            </div>
                            <div className="mt-5 flex items-center gap-2 rounded-xl bg-emerald-50/80 px-4 py-3 text-xs font-medium text-emerald-800 sm:text-sm">
                                <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="size-4 shrink-0">
                                    <path d="m5 10.25 3.2 3.2L15.5 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                タスクの進み具合を、チームみんなで共有
                            </div>
                        </div>
                        <div className="absolute -bottom-5 -left-4 hidden items-center gap-2 rounded-xl border border-slate-100 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-lg sm:flex">
                            <span className="flex size-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">✓</span>
                            チームで、すっきり進めよう
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}

function TaskColumn({
    title,
    count,
    tone,
    tasks,
}: {
    title: string;
    count: string;
    tone: 'slate' | 'blue' | 'green';
    tasks: [string, string][];
}) {
    const tones = {
        slate: 'bg-slate-400',
        blue: 'bg-blue-500',
        green: 'bg-emerald-500',
    };

    return (
        <section className="min-w-0 rounded-xl bg-slate-50 p-2.5 sm:p-3.5">
            <div className="mb-3 flex items-center justify-between gap-1">
                <div className="flex min-w-0 items-center gap-1.5">
                    <span className={`size-2 shrink-0 rounded-full ${tones[tone]}`} />
                    <h2 className="truncate text-[11px] font-semibold text-slate-600 sm:text-xs">{title}</h2>
                </div>
                <span className="text-[10px] text-slate-400">{count}</span>
            </div>
            <div className="flex flex-col gap-2">
                {tasks.map(([task, label]) => (
                    <article key={task} className="rounded-lg border border-slate-100 bg-white p-2.5 shadow-sm sm:p-3">
                        <p className="min-h-8 text-[10px] font-medium leading-4 text-slate-700 sm:text-xs sm:leading-5">{task}</p>
                        <span className="mt-2 inline-flex max-w-full truncate rounded-md bg-slate-100 px-1.5 py-1 text-[9px] text-slate-500 sm:text-[10px]">{label}</span>
                    </article>
                ))}
            </div>
        </section>
    );
}
