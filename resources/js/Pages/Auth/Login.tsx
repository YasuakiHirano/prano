import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false as boolean,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="ログイン" />

            <div className="mb-7">
                <p className="text-sm font-semibold text-emerald-700">おかえりなさい</p>
                <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
                    ログイン
                </h1>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                    メールアドレスとパスワードを入力してください。
                </p>
            </div>

            {status && (
                <div className="mb-5 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="flex flex-col gap-5">
                <div>
                    <InputLabel htmlFor="email" value="メールアドレス" className="text-slate-700" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-2 block w-full rounded-xl border-slate-200 px-4 py-3 text-sm shadow-sm placeholder:text-slate-400 focus:border-emerald-500 focus:ring-emerald-500"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="パスワード" className="text-slate-700" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-2 block w-full rounded-xl border-slate-200 px-4 py-3 text-sm shadow-sm placeholder:text-slate-400 focus:border-emerald-500 focus:ring-emerald-500"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="flex items-center justify-between gap-3">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            className="!text-emerald-600 focus:!ring-emerald-500"
                            checked={data.remember}
                            onChange={(e) =>
                                setData(
                                    'remember',
                                    (e.target.checked || false) as false,
                                )
                            }
                        />
                        <span className="ms-2 text-sm text-slate-600">
                            ログイン状態を保持
                        </span>
                    </label>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5">
                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="rounded-md text-sm font-medium text-emerald-700 transition hover:text-emerald-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
                        >
                            パスワードをお忘れですか？
                        </Link>
                    )}

                    <PrimaryButton className="rounded-xl !bg-emerald-600 px-6 py-3 text-sm normal-case tracking-normal hover:!bg-emerald-700 focus:!bg-emerald-700 focus:!ring-emerald-600 active:!bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60" disabled={processing}>
                        {processing ? 'ログイン中…' : 'ログイン'}
                    </PrimaryButton>
                </div>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
                はじめて利用する方は{' '}
                <Link href={route('register')} className="font-semibold text-emerald-700 hover:text-emerald-800">
                    新規登録
                </Link>
            </p>
        </GuestLayout>
    );
}
