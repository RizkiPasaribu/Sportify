import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { TriangleAlert } from 'lucide-react';
import { useRef, useState } from 'react';

export default function DeleteUserForm() {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const { data, setData, delete: destroy, processing, reset, errors, clearErrors } = useForm({
        password: '',
    });

    const deleteUser = (event) => {
        event.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        clearErrors();
        reset();
    };

    return (
        <section>
            <div className="flex items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-rose-50 text-rose-600">
                    <TriangleAlert className="h-5 w-5" />
                </span>
                <div>
                    <h2 className="text-base font-bold text-slate-900">Hapus akun</h2>
                    <p className="mt-1 text-sm leading-relaxed text-slate-500">
                        Setelah dihapus, seluruh data akun, booking, dan venue Anda akan hilang
                        permanen. Tindakan ini tidak dapat dibatalkan.
                    </p>
                </div>
            </div>

            <DangerButton className="mt-5" onClick={() => setConfirmingUserDeletion(true)}>
                Hapus akun saya
            </DangerButton>

            <Modal show={confirmingUserDeletion} onClose={closeModal} maxWidth="md">
                <form onSubmit={deleteUser} className="p-6">
                    <h2 className="text-lg font-bold text-slate-900">
                        Yakin ingin menghapus akun?
                    </h2>

                    <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
                        Semua data akan dihapus permanen. Masukkan password Anda untuk
                        mengonfirmasi tindakan ini.
                    </p>

                    <div className="mt-5">
                        <InputLabel htmlFor="delete_password" value="Password" className="sr-only" />
                        <TextInput
                            id="delete_password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(event) => setData('password', event.target.value)}
                            className="mt-1 block w-full"
                            isFocused
                            placeholder="Masukkan password Anda"
                        />
                        <InputError message={errors.password} className="mt-1.5" />
                    </div>

                    <div className="mt-6 flex justify-end gap-2">
                        <SecondaryButton onClick={closeModal}>Batal</SecondaryButton>
                        <DangerButton disabled={processing}>Hapus akun</DangerButton>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
