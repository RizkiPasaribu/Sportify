import { usePage } from '@inertiajs/react';
import { CircleAlert, CircleCheck, Info, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const variants = {
    success: {
        icon: CircleCheck,
        wrapper: 'border-brand-200 bg-white',
        iconWrapper: 'bg-brand-100 text-brand-700',
        title: 'Berhasil',
    },
    error: {
        icon: CircleAlert,
        wrapper: 'border-rose-200 bg-white',
        iconWrapper: 'bg-rose-100 text-rose-700',
        title: 'Perhatian',
    },
    info: {
        icon: Info,
        wrapper: 'border-sky-200 bg-white',
        iconWrapper: 'bg-sky-100 text-sky-700',
        title: 'Informasi',
    },
};

export default function FlashMessages() {
    const { flash } = usePage().props;
    const [visible, setVisible] = useState(false);

    const type = flash?.error ? 'error' : flash?.success ? 'success' : flash?.info ? 'info' : null;
    const message = type ? flash[type] : null;

    useEffect(() => {
        if (!message) {
            setVisible(false);

            return;
        }

        setVisible(true);
        const timeout = setTimeout(() => setVisible(false), 6000);

        return () => clearTimeout(timeout);
    }, [message, type]);

    if (!message || !visible) {
        return null;
    }

    const variant = variants[type];
    const Icon = variant.icon;

    return (
        <div className="pointer-events-none fixed inset-x-0 top-20 z-[70] flex justify-center px-4 sm:justify-end sm:px-6">
            <div
                className={`pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border p-4 shadow-xl shadow-slate-900/10 ${variant.wrapper}`}
                role="status"
            >
                <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${variant.iconWrapper}`}>
                    <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-900">{variant.title}</p>
                    <p className="mt-0.5 text-sm leading-relaxed text-slate-600">{message}</p>
                </div>
                <button
                    type="button"
                    onClick={() => setVisible(false)}
                    className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                    aria-label="Tutup notifikasi"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
