import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

type Workspace = {
    id: number;
    name: string;
};

export default function Edit({ workspace }: { workspace: Workspace }) {
    const { data, setData, put, processing, errors } = useForm({
        name: workspace.name,
    });

    const submit: FormEventHandler = (event) => {
        event.preventDefault();
        put(route('workspaces.update', workspace.id));
    };

    return (
        <AuthenticatedLayout>
            <Head title="ワークスペースを編集" />

            <div className="mx-auto flex w-full max-w-3xl flex-col gap-7 px-6 py-10 sm:px-10 sm:py-14">
                <Link
                    href={route('dashboard')}
                    className="w-fit rounded-lg text-sm font-medium text-slate-500 transition hover:text-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
                >
                    ← ダッシュボードへ戻る
                </Link>

                <section>
                    <p className="text-sm font-semibold text-emerald-700">ワークスペース設定</p>
                    <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                        ワークスペースを編集
                    </h1>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                        チームに表示するワークスペース名を変更できます。
                    </p>
                </section>

                <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
                    <form onSubmit={submit} className="flex flex-col gap-4">
                        <div>
                            <label htmlFor="workspace-name" className="text-sm font-medium text-slate-700">
                                ワークスペース名
                            </label>
                            <input
                                id="workspace-name"
                                name="name"
                                type="text"
                                value={data.name}
                                onChange={(event) => setData('name', event.target.value)}
                                maxLength={120}
                                required
                                autoComplete="organization"
                                aria-invalid={Boolean(errors.name)}
                                aria-describedby={errors.name ? 'workspace-name-error' : undefined}
                                className="mt-2 w-full rounded-xl border-slate-200 px-4 py-3 text-sm shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                            />
                            <InputError
                                id="workspace-name-error"
                                message={errors.name}
                                className="mt-2"
                            />
                        </div>

                        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                            <Link
                                href={route('dashboard')}
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
