import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowRight, LoaderCircle, LockKeyhole, Mail } from 'lucide-react';

const demoAccounts = [
    { label: 'Customer', email: 'customer@sportify.id' },
    { label: 'Owner', email: 'owner@sportify.id' },
    { label: 'Admin', email: 'admin@sportify.id' },
];

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (event) => {
        event.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    const fillDemo = (email) => {
        setData({
            email,
            password: 'password',
            remember: true,
        });
    };

    return (
        <GuestLayout>
            <Head title="Masuk" />

            <div className="mb-8">
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">
                    Selamat datang kembali
                </p>
                <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">
                    Masuk ke Sportify
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                    Kelola booking dan jadwal lapangan Anda dalam satu dashboard.
                </p>
            </div>

            {status && (
                <div className="mb-5 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm font-medium text-brand-700">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <InputLabel htmlFor="email" value="Alamat email" />
                    <div className="relative mt-1.5">
                        <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            autoComplete="username"
                            autoFocus
                            onChange={(event) => setData('email', event.target.value)}
                            placeholder="nama@email.com"
                            className="w-full rounded-xl border-slate-300 py-2.5 pl-10 pr-3 text-sm shadow-sm focus:border-brand-500 focus:ring-brand-500"
                        />
                    </div>
                    <InputError message={errors.email} className="mt-1.5" />
                </div>

                <div>
                    <div className="flex items-center justify-between">
                        <InputLabel htmlFor="password" value="Password" />
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-xs font-semibold text-brand-600 hover:text-brand-700"
                            >
                                Lupa password?
                            </Link>
                        )}
                    </div>
                    <div className="relative mt-1.5">
                        <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            autoComplete="current-password"
                            onChange={(event) => setData('password', event.target.value)}
                            placeholder="••••••••"
                            className="w-full rounded-xl border-slate-300 py-2.5 pl-10 pr-3 text-sm shadow-sm focus:border-brand-500 focus:ring-brand-500"
                        />
                    </div>
                    <InputError message={errors.password} className="mt-1.5" />
                </div>

                <label className="flex items-center gap-2.5 text-sm text-slate-600">
                    <Checkbox
                        name="remember"
                        checked={data.remember}
                        onChange={(event) => setData('remember', event.target.checked)}
                    />
                    Ingat saya di perangkat ini
                </label>

                <button
                    type="submit"
                    disabled={processing}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-sm shadow-brand-600/20 transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {processing ? (
                        <>
                            <LoaderCircle className="h-4 w-4 animate-spin" /> Memproses...
                        </>
                    ) : (
                        <>
                            Masuk <ArrowRight className="h-4 w-4" />
                        </>
                    )}
                </button>
            </form>

            <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold text-slate-600">Akun demo (password: password)</p>
                <div className="mt-2.5 flex flex-wrap gap-2">
                    {demoAccounts.map((account) => (
                        <button
                            key={account.email}
                            type="button"
                            onClick={() => fillDemo(account.email)}
                            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-brand-300 hover:text-brand-700"
                        >
                            {account.label}
                        </button>
                    ))}
                </div>
            </div>

            <p className="mt-6 text-center text-sm text-slate-500">
                Belum punya akun?{' '}
                <Link
                    href={route('register')}
                    className="font-semibold text-brand-600 hover:text-brand-700"
                >
                    Daftar gratis
                </Link>
            </p>
        </GuestLayout>
    );
}
