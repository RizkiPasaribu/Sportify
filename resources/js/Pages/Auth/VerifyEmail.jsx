import PrimaryButton from '@/Components/PrimaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { LogOut, MailCheck } from 'lucide-react';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (event) => {
        event.preventDefault();

        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Verifikasi Email" />

            <div className="mb-7">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand-700">
                    <MailCheck className="h-6 w-6" />
                </span>
                <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900">
                    Verifikasi email Anda
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                    Terima kasih sudah mendaftar! Klik tautan verifikasi yang kami kirim ke email
                    Anda. Jika belum menerimanya, kirim ulang di bawah.
                </p>
            </div>

            {status === 'verification-link-sent' && (
                <div className="mb-5 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm font-medium text-brand-700">
                    Tautan verifikasi baru telah dikirim ke alamat email Anda.
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                <PrimaryButton className="w-full" disabled={processing}>
                    Kirim ulang email verifikasi
                </PrimaryButton>

                <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                    <LogOut className="h-4 w-4" /> Keluar
                </Link>
            </form>
        </GuestLayout>
    );
}
