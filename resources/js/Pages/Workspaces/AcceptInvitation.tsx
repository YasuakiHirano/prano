import PrimaryButton from '@/Components/PrimaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

type Workspace = { id: number; name: string };

export default function AcceptInvitation({ workspace, token }: { workspace: Workspace; token: string }) {
    const { post, processing } = useForm({});

    const accept = () => post(route('workspace-invitations.accept', token));

    return (
        <AuthenticatedLayout>
            <Head title="ワークスペースへの招待" />
            <div className="mx-auto max-w-2xl px-6 py-12 sm:py-16">
                <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
                    <p className="text-sm font-semibold text-emerald-700">ワークスペースへの招待</p>
                    <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">{workspace.name} に参加しますか？</h1>
                    <p className="mt-3 text-sm leading-6 text-slate-600">参加すると、このワークスペースのプロジェクトとタスクを閲覧できます。</p>
                    <PrimaryButton onClick={accept} disabled={processing} className="mt-7 rounded-xl !bg-emerald-600 px-6 py-3 text-sm normal-case tracking-normal hover:!bg-emerald-700">
                        {processing ? '参加中…' : 'ワークスペースに参加'}
                    </PrimaryButton>
                </section>
            </div>
        </AuthenticatedLayout>
    );
}
