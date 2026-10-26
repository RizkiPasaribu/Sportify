import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { KeyRound } from 'lucide-react';

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token,
        email,
        password: '',
        password_confirmation: '',
    });

    const submit = (event) => {
        event.preventDefault();

        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Reset Password" />

            <div className="mb-7">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand-700">
                    <KeyRound className="h-6 w-6" />
                </span>
                <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900">
                    Buat password baru
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                    Password baru minimal 8 karakter. Pastikan mudah Anda ingat namun sulit
                    ditebak orang lain.
                </p>
            </div>

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <InputLabel htmlFor="email" value="Alamat email" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1.5 block w-full"
                        autoComplete="username"
                        onChange={(event) => setData('email', event.target.value)}
                    />
                    <InputError message={errors.email} className="mt-1.5" />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="Password baru" />
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1.5 block w-full"
                        autoComplete="new-password"
                        isFocused
                        onChange={(event) => setData('password', event.target.value)}
                    />
                    <InputError message={errors.password} className="mt-1.5" />
                </div>

                <div>
                    <InputLabel htmlFor="password_confirmation" value="Konfirmasi password baru" />
                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1.5 block w-full"
                        autoComplete="new-password"
                        onChange={(event) => setData('password_confirmation', event.target.value)}
                    />
                    <InputError message={errors.password_confirmation} className="mt-1.5" />
                </div>

                <PrimaryButton className="w-full" disabled={processing}>
                    Simpan password baru
                </PrimaryButton>
            </form>
        </GuestLayout>
    );
}
