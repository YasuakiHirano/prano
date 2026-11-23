import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="新規登録" />

            <div className="mb-7">
                <p className="text-sm font-semibold text-emerald-700">Pranoへようこそ</p>
                <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
                    新規登録
                </h1>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                    アカウントを作成して、チームのタスクを整理しましょう。
                </p>
            </div>

            <form onSubmit={submit} className="flex flex-col gap-5">
                <div>
                    <InputLabel htmlFor="name" value="お名前" className="text-slate-700" />

                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-2 block w-full rounded-xl border-slate-200 px-4 py-3 text-sm shadow-sm placeholder:text-slate-400 focus:border-emerald-500 focus:ring-emerald-500"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />

                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="メールアドレス" className="text-slate-700" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-2 block w-full rounded-xl border-slate-200 px-4 py-3 text-sm shadow-sm placeholder:text-slate-400 focus:border-emerald-500 focus:ring-emerald-500"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        required
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
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div>
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="パスワード（確認）"
                        className="text-slate-700"
                    />

                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-2 block w-full rounded-xl border-slate-200 px-4 py-3 text-sm shadow-sm placeholder:text-slate-400 focus:border-emerald-500 focus:ring-emerald-500"
                        autoComplete="new-password"
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        required
                    />

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5">
                    <Link
                        href={route('login')}
                        className="rounded-md text-sm font-medium text-emerald-700 transition hover:text-emerald-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
                    >
                        すでにアカウントをお持ちですか？
                    </Link>

                    <PrimaryButton className="rounded-xl !bg-emerald-600 px-6 py-3 text-sm normal-case tracking-normal hover:!bg-emerald-700 focus:!bg-emerald-700 focus:!ring-emerald-600 active:!bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60" disabled={processing}>
                        {processing ? '登録中…' : '登録する'}
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
