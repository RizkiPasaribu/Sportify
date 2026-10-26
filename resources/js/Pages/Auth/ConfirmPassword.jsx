import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { ShieldCheck } from 'lucide-react';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const submit = (event) => {
        event.preventDefault();

        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Konfirmasi Password" />

            <div className="mb-7">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand-700">
                    <ShieldCheck className="h-6 w-6" />
                </span>
                <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900">
                    Konfirmasi password
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                    Ini area aman aplikasi. Masukkan password Anda untuk melanjutkan.
                </p>
            </div>

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <InputLabel htmlFor="password" value="Password" />
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1.5 block w-full"
                        isFocused
                        autoComplete="current-password"
                        onChange={(event) => setData('password', event.target.value)}
                        placeholder="••••••••"
                    />
                    <InputError message={errors.password} className="mt-1.5" />
                </div>

                <PrimaryButton className="w-full" disabled={processing}>
                    Konfirmasi
                </PrimaryButton>
            </form>
        </GuestLayout>
    );
}
