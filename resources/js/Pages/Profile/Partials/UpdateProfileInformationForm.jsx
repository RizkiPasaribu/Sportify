import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { Check, UserRound } from 'lucide-react';

export default function UpdateProfileInformation({ mustVerifyEmail, status }) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: user.name,
        email: user.email,
    });

    const submit = (event) => {
        event.preventDefault();

        patch(route('profile.update'), { preserveScroll: true });
    };

    return (
        <section>
            <div className="flex items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700">
                    <UserRound className="h-5 w-5" />
                </span>
                <div>
                    <h2 className="text-base font-bold text-slate-900">Informasi profil</h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Perbarui nama dan alamat email yang digunakan untuk masuk.
                    </p>
                </div>
            </div>

            <form onSubmit={submit} className="mt-6 space-y-5">
                <div>
                    <InputLabel htmlFor="name" value="Nama lengkap" />
                    <TextInput
                        id="name"
                        className="mt-1.5 block w-full"
                        value={data.name}
                        onChange={(event) => setData('name', event.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                    />
                    <InputError className="mt-1.5" message={errors.name} />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Alamat email" />
                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1.5 block w-full"
                        value={data.email}
                        onChange={(event) => setData('email', event.target.value)}
                        required
                        autoComplete="username"
                    />
                    <InputError className="mt-1.5" message={errors.email} />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4">
                        <p className="text-sm text-amber-800">
                            Email Anda belum diverifikasi.{' '}
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="font-semibold underline underline-offset-2 hover:text-amber-900"
                            >
                                Klik di sini untuk mengirim ulang email verifikasi.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <p className="mt-2 text-sm font-medium text-brand-700">
                                Tautan verifikasi baru telah dikirim ke email Anda.
                            </p>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4 border-t border-slate-100 pt-5">
                    <PrimaryButton disabled={processing}>Simpan perubahan</PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-700">
                            <Check className="h-4 w-4" /> Tersimpan
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
