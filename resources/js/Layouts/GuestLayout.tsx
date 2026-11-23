import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#f8faf9] px-6 py-8 text-slate-900 sm:px-10">
            <div aria-hidden="true" className="pointer-events-none absolute -right-40 -top-40 size-[30rem] rounded-full bg-emerald-100/70 blur-3xl" />
            <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between">
                <Link href="/" className="flex items-center gap-2.5" aria-label="Prano ホーム">
                    <span className="flex size-9 items-center justify-center rounded-xl bg-emerald-600 text-lg font-bold text-white shadow-sm shadow-emerald-900/15">
                        p
                    </span>
                    <span className="text-xl font-bold tracking-tight">prano</span>
                </Link>
                <Link href="/" className="text-sm font-medium text-slate-500 transition hover:text-emerald-700">
                    トップページへ
                </Link>
            </header>

            <main className="relative z-10 flex flex-1 items-center justify-center py-12 sm:py-16">
                <div className="w-full max-w-md rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_24px_70px_-36px_rgba(15,70,52,0.35)] sm:rounded-3xl sm:p-9">
                    {children}
                </div>
            </main>

            <footer className="relative z-10 text-center text-xs text-slate-400">
                Prano · 少人数チームのタスク管理
            </footer>
        </div>
    );
}
