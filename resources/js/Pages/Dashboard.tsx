import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import { ReactNode } from 'react';

export default function Dashboard({ auth }: PageProps) {
    return (
        <AuthenticatedLayout>
            <Head title="ダッシュボード" />

            <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-7xl flex-col gap-8 px-6 py-10 sm:px-10 sm:py-14">
                <section className="flex flex-col gap-3">
                    <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-100 bg-white px-3.5 py-2 text-xs font-semibold text-emerald-800 shadow-sm">
                        <span className="size-2 rounded-full bg-emerald-500" />
                        あなたのチームスペース
                    </span>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                        おかえりなさい、{auth.user.name}さん
                    </h1>
                    <p className="max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
                        チームのタスクやプロジェクトを、すっきり整理して進めましょう。
                    </p>
                </section>

                <section className="relative isolate grid flex-1 overflow-hidden rounded-3xl border border-emerald-100/80 bg-gradient-to-br from-white via-white to-emerald-50/80 shadow-[0_24px_70px_-42px_rgba(15,70,52,0.35)] lg:grid-cols-[1fr_1.05fr]">
                    <div className="relative z-10 flex flex-col justify-center gap-6 p-7 sm:p-10 lg:p-12">
                        <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-6">
                                <path d="M8 5.5h11M8 12h11M8 18.5h11M4.5 5.5h.01M4.5 12h.01M4.5 18.5h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </div>
                        <div className="flex flex-col gap-3">
                            <p className="text-sm font-semibold text-emerald-700">Pranoでチームの仕事を整理</p>
                            <h2 className="max-w-lg text-2xl font-bold leading-snug tracking-tight text-slate-950 sm:text-3xl">
                                やることが見えると、
                                <br className="hidden sm:block" />
                                チームはもっと進みやすい。
                            </h2>
                            <p className="max-w-lg text-sm leading-7 text-slate-600 sm:text-base">
                                プロジェクトごとにタスクをまとめて、誰が何に取り組んでいるかをチームで共有できます。
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <FeaturePill>プロジェクトごとに整理</FeaturePill>
                            <FeaturePill>進捗をひと目で共有</FeaturePill>
                            <FeaturePill>少人数チームにぴったり</FeaturePill>
                        </div>
                    </div>

                    <div className="relative flex min-h-72 items-center justify-center overflow-hidden px-5 pb-8 pt-4 sm:px-10 sm:pb-10 lg:min-h-[34rem] lg:px-8 lg:py-12">
                        <div aria-hidden="true" className="absolute inset-8 rounded-full bg-emerald-100/80 blur-3xl" />
                        <TaskBoardIllustration />
                    </div>
                </section>

                <section className="grid gap-4 sm:grid-cols-3">
                    <InfoCard
                        number="01"
                        title="タスクをまとめる"
                        description="やることをプロジェクトごとに整理。"
                        icon={<ListIcon />}
                    />
                    <InfoCard
                        number="02"
                        title="担当を共有する"
                        description="誰が取り組むかをチームで確認。"
                        icon={<PeopleIcon />}
                    />
                    <InfoCard
                        number="03"
                        title="進捗を見渡す"
                        description="チームの今の状況をひと目で把握。"
                        icon={<ProgressIcon />}
                    />
                </section>
            </div>
        </AuthenticatedLayout>
    );
}

function FeaturePill({ children }: { children: string }) {
    return (
        <span className="rounded-full border border-emerald-100 bg-white/80 px-3 py-1.5 text-xs font-medium text-emerald-800">
            {children}
        </span>
    );
}

function InfoCard({
    number,
    title,
    description,
    icon,
}: {
    number: string;
    title: string;
    description: string;
    icon: ReactNode;
}) {
    return (
        <article className="flex items-start gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-900/[0.02]">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                {icon}
            </span>
            <div className="flex min-w-0 flex-col gap-1">
                <p className="text-[11px] font-semibold tracking-[0.16em] text-emerald-700">{number}</p>
                <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
                <p className="text-xs leading-5 text-slate-500">{description}</p>
            </div>
        </article>
    );
}

function TaskBoardIllustration() {
    return (
        <div
            role="img"
            aria-label="タスクボードのイメージ"
            className="relative w-full max-w-xl rotate-[1deg] rounded-2xl border border-slate-200/80 bg-white p-3 shadow-[0_28px_70px_-32px_rgba(15,70,52,0.35)] sm:rounded-3xl sm:p-5"
        >
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                    <span className="flex size-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                        <ListIcon />
                    </span>
                    <div className="flex flex-col gap-1">
                        <span className="text-sm font-semibold text-slate-800">プロジェクト</span>
                        <span className="text-[11px] text-slate-400">チームのタスクを一覧</span>
                    </div>
                </div>
                <div className="flex -space-x-2" aria-hidden="true">
                    <span className="flex size-7 items-center justify-center rounded-full border-2 border-white bg-amber-100 text-[10px] font-semibold text-amber-800">A</span>
                    <span className="flex size-7 items-center justify-center rounded-full border-2 border-white bg-sky-100 text-[10px] font-semibold text-sky-800">M</span>
                    <span className="flex size-7 items-center justify-center rounded-full border-2 border-white bg-violet-100 text-[10px] font-semibold text-violet-800">Y</span>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-2.5 pt-4 sm:gap-3.5">
                <BoardColumn title="これから" tone="slate" tasks={['アイデアをまとめる', '次回の予定を決める']} />
                <BoardColumn title="進行中" tone="blue" tasks={['デザインを確認する', '資料を仕上げる']} />
                <BoardColumn title="完了" tone="green" tasks={['キックオフ']} />
            </div>

            <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50/80 px-3 py-2.5 text-[11px] font-medium text-emerald-800 sm:px-4 sm:text-xs">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="size-3.5">
                        <path d="m5 10.25 3.2 3.2L15.5 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </span>
                チームの進捗を、みんなで共有
            </div>
        </div>
    );
}

function BoardColumn({
    title,
    tone,
    tasks,
}: {
    title: string;
    tone: 'slate' | 'blue' | 'green';
    tasks: string[];
}) {
    const tones = {
        slate: 'bg-slate-400',
        blue: 'bg-blue-500',
        green: 'bg-emerald-500',
    };

    return (
        <section className="min-w-0 rounded-xl bg-slate-50 p-2 sm:p-3">
            <div className="mb-2.5 flex items-center gap-1.5">
                <span className={`size-1.5 shrink-0 rounded-full ${tones[tone]}`} />
                <h3 className="truncate text-[10px] font-semibold text-slate-600 sm:text-[11px]">{title}</h3>
            </div>
            <div className="flex flex-col gap-2">
                {tasks.map((task) => (
                    <div key={task} className="rounded-lg border border-slate-100 bg-white p-2 shadow-sm sm:p-2.5">
                        <p className="min-h-8 text-[9px] font-medium leading-4 text-slate-700 sm:text-[10px] sm:leading-5">{task}</p>
                        <span className="mt-1.5 flex size-5 items-center justify-center rounded-full bg-slate-100 text-[8px] font-semibold text-slate-500">{task === 'キックオフ' ? 'A' : 'M'}</span>
                    </div>
                ))}
            </div>
        </section>
    );
}

function ListIcon() {
    return (
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-5">
            <path d="M8 5.5h11M8 12h11M8 18.5h11M4.5 5.5h.01M4.5 12h.01M4.5 18.5h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
    );
}

function PeopleIcon() {
    return (
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-5">
            <path d="M16 20v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 18.5V20M10 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM16 4.2a3.5 3.5 0 0 1 0 6.8M20 20v-1.5a3.5 3.5 0 0 0-2.5-3.35" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function ProgressIcon() {
    return (
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-5">
            <path d="M4 19V5m0 14h16M8 15l3-4 3 2 5-6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M16 7h3v3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}
