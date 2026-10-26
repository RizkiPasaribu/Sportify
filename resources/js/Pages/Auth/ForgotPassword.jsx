import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, MailQuestion } from 'lucide-react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (event) => {
        event.preventDefault();

        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Lupa Password" />

            <div className="mb-7">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand-700">
                    <MailQuestion className="h-6 w-6" />
                </span>
                <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900">
                    Lupa password?
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                    Masukkan alamat email akun Anda. Kami akan mengirimkan tautan untuk membuat
                    password baru.
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
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1.5 block w-full"
                        isFocused
                        autoComplete="username"
                        onChange={(event) => setData('email', event.target.value)}
                        placeholder="nama@email.com"
                    />
                    <InputError message={errors.email} className="mt-1.5" />
                </div>

                <PrimaryButton className="w-full" disabled={processing}>
                    Kirim tautan reset
                </PrimaryButton>
            </form>

            <Link
                href={route('login')}
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 transition hover:text-brand-700"
            >
                <ArrowLeft className="h-4 w-4" /> Kembali ke halaman masuk
            </Link>
        </GuestLayout>
    );
}
