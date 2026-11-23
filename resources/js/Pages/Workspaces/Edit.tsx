import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

type Workspace = {
    id: number;
    name: string;
};

type Member = { id: number; name: string; email: string; role: string };
type Invitation = { id: number; email: string; expires_at: string };

export default function Edit({ workspace, members, invitations }: { workspace: Workspace; members: Member[]; invitations: Invitation[] }) {
    const { data, setData, put, processing, errors } = useForm({
        name: workspace.name,
    });
    const invitationForm = useForm({ email: '' });
    const status = usePage().props.flash?.status;

    const submit: FormEventHandler = (event) => {
        event.preventDefault();
        put(route('workspaces.update', workspace.id));
    };

    const submitInvitation: FormEventHandler = (event) => {
        event.preventDefault();
        invitationForm.post(route('workspaces.invitations.store', workspace.id), {
            onSuccess: () => invitationForm.reset(),
        });
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

                {status && (
                    <p role="status" className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">{status}</p>
                )}

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

                <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
                    <div>
                        <p className="text-sm font-semibold text-emerald-700">チーム</p>
                        <h2 className="mt-1 text-xl font-bold text-slate-950">メンバー</h2>
                        <p className="mt-2 text-sm text-slate-500">メールアドレス宛に招待リンクを送信します。リンクの有効期限は7日間です。</p>
                    </div>

                    <form onSubmit={submitInvitation} className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-start">
                        <div className="flex-1">
                            <label htmlFor="member-email" className="sr-only">招待するメールアドレス</label>
                            <input
                                id="member-email"
                                type="email"
                                value={invitationForm.data.email}
                                onChange={(event) => invitationForm.setData('email', event.target.value)}
                                placeholder="name@example.com"
                                required
                                className="w-full rounded-xl border-slate-200 px-4 py-3 text-sm shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                            />
                            <InputError message={invitationForm.errors.email} className="mt-2" />
                        </div>
                        <PrimaryButton disabled={invitationForm.processing} className="justify-center rounded-xl !bg-emerald-600 px-5 py-3 text-sm normal-case tracking-normal hover:!bg-emerald-700">
                            {invitationForm.processing ? '送信中…' : '招待を送信'}
                        </PrimaryButton>
                    </form>

                    <div className="mt-6 divide-y divide-slate-100 border-t border-slate-100">
                        {members.map((member) => (
                            <div key={member.id} className="flex items-center justify-between gap-3 py-3">
                                <div>
                                    <p className="text-sm font-semibold text-slate-800">{member.name}</p>
                                    <p className="text-sm text-slate-500">{member.email}</p>
                                </div>
                                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">{member.role === 'owner' ? 'オーナー' : 'メンバー'}</span>
                            </div>
                        ))}
                        {invitations.map((invitation) => (
                            <div key={invitation.id} className="flex items-center justify-between gap-3 py-3">
                                <div>
                                    <p className="text-sm font-semibold text-slate-700">{invitation.email}</p>
                                    <p className="text-xs text-slate-400">招待中 · 期限 {new Date(invitation.expires_at).toLocaleDateString('ja-JP')}</p>
                                </div>
                                <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">未参加</span>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </AuthenticatedLayout>
    );
}
