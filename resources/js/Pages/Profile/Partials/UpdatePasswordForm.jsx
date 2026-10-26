import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { Check, KeyRound } from 'lucide-react';
import { useRef } from 'react';

export default function UpdatePasswordForm() {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (event) => {
        event.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current.focus();
                }
            },
        });
    };

    return (
        <section>
            <div className="flex items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700">
                    <KeyRound className="h-5 w-5" />
                </span>
                <div>
                    <h2 className="text-base font-bold text-slate-900">Keamanan password</h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Gunakan password yang panjang dan unik agar akun tetap aman.
                    </p>
                </div>
            </div>

            <form onSubmit={updatePassword} className="mt-6 space-y-5">
                <div>
                    <InputLabel htmlFor="current_password" value="Password saat ini" />
                    <TextInput
                        id="current_password"
                        ref={currentPasswordInput}
                        value={data.current_password}
                        onChange={(event) => setData('current_password', event.target.value)}
                        type="password"
                        className="mt-1.5 block w-full"
                        autoComplete="current-password"
                    />
                    <InputError message={errors.current_password} className="mt-1.5" />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="Password baru" />
                    <TextInput
                        id="password"
                        ref={passwordInput}
                        value={data.password}
                        onChange={(event) => setData('password', event.target.value)}
                        type="password"
                        className="mt-1.5 block w-full"
                        autoComplete="new-password"
                    />
                    <InputError message={errors.password} className="mt-1.5" />
                </div>

                <div>
                    <InputLabel htmlFor="password_confirmation" value="Konfirmasi password baru" />
                    <TextInput
                        id="password_confirmation"
                        value={data.password_confirmation}
                        onChange={(event) => setData('password_confirmation', event.target.value)}
                        type="password"
                        className="mt-1.5 block w-full"
                        autoComplete="new-password"
                    />
                    <InputError message={errors.password_confirmation} className="mt-1.5" />
                </div>

                <div className="flex items-center gap-4 border-t border-slate-100 pt-5">
                    <PrimaryButton disabled={processing}>Perbarui password</PrimaryButton>

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
