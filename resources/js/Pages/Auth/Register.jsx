import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Building2, LoaderCircle, UserRound } from 'lucide-react';

const roles = [
    {
        value: 'customer',
        label: 'Saya Penyewa',
        description: 'Cari dan booking lapangan favorit',
        icon: UserRound,
    },
    {
        value: 'owner',
        label: 'Saya Pengelola',
        description: 'Kelola venue, lapangan, dan booking',
        icon: Building2,
    },
];

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'customer',
    });

    const submit = (event) => {
        event.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Daftar" />

            <div className="mb-7">
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">
                    Bergabung sekarang
                </p>
                <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">
                    Buat akun Sportify
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                    Pilih tipe akun yang sesuai. Anda dapat menghubungi admin jika ingin
                    mengubahnya nanti.
                </p>
            </div>

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <InputLabel value="Saya mendaftar sebagai" />
                    <div className="mt-2 grid gap-2 sm:grid-cols-2">
                        {roles.map((role) => {
                            const Icon = role.icon;
                            const selected = data.role === role.value;

                            return (
                                <button
                                    key={role.value}
                                    type="button"
                                    onClick={() => setData('role', role.value)}
                                    className={`flex items-start gap-3 rounded-xl border p-3.5 text-left transition ${
                                        selected
                                            ? 'border-brand-600 bg-brand-50 ring-1 ring-brand-600'
                                            : 'border-slate-200 bg-white hover:border-slate-300'
                                    }`}
                                >
                                    <span
                                        className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${
                                            selected
                                                ? 'bg-brand-600 text-white'
                                                : 'bg-slate-100 text-slate-500'
                                        }`}
                                    >
                                        <Icon className="h-4 w-4" />
                                    </span>
                                    <span>
                                        <span className="block text-sm font-semibold text-slate-900">
                                            {role.label}
                                        </span>
                                        <span className="mt-0.5 block text-xs leading-relaxed text-slate-500">
                                            {role.description}
                                        </span>
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                    <InputError message={errors.role} className="mt-1.5" />
                </div>

                <div>
                    <InputLabel htmlFor="name" value="Nama lengkap" />
                    <input
                        id="name"
                        name="name"
                        value={data.name}
                        autoComplete="name"
                        autoFocus
                        onChange={(event) => setData('name', event.target.value)}
                        placeholder="Nama sesuai identitas"
                        className="mt-1.5 w-full rounded-xl border-slate-300 py-2.5 text-sm shadow-sm focus:border-brand-500 focus:ring-brand-500"
                    />
                    <InputError message={errors.name} className="mt-1.5" />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Alamat email" />
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        autoComplete="username"
                        onChange={(event) => setData('email', event.target.value)}
                        placeholder="nama@email.com"
                        className="mt-1.5 w-full rounded-xl border-slate-300 py-2.5 text-sm shadow-sm focus:border-brand-500 focus:ring-brand-500"
                    />
                    <InputError message={errors.email} className="mt-1.5" />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <InputLabel htmlFor="password" value="Password" />
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            autoComplete="new-password"
                            onChange={(event) => setData('password', event.target.value)}
                            placeholder="Min. 8 karakter"
                            className="mt-1.5 w-full rounded-xl border-slate-300 py-2.5 text-sm shadow-sm focus:border-brand-500 focus:ring-brand-500"
                        />
                        <InputError message={errors.password} className="mt-1.5" />
                    </div>
                    <div>
                        <InputLabel htmlFor="password_confirmation" value="Ulangi password" />
                        <input
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            autoComplete="new-password"
                            onChange={(event) =>
                                setData('password_confirmation', event.target.value)
                            }
                            placeholder="Ketik ulang password"
                            className="mt-1.5 w-full rounded-xl border-slate-300 py-2.5 text-sm shadow-sm focus:border-brand-500 focus:ring-brand-500"
                        />
                        <InputError message={errors.password_confirmation} className="mt-1.5" />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-sm shadow-brand-600/20 transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {processing ? (
                        <>
                            <LoaderCircle className="h-4 w-4 animate-spin" /> Mendaftarkan...
                        </>
                    ) : (
                        'Daftar Sekarang'
                    )}
                </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
                Sudah punya akun?{' '}
                <Link href={route('login')} className="font-semibold text-brand-600 hover:text-brand-700">
                    Masuk di sini
                </Link>
            </p>
        </GuestLayout>
    );
}
