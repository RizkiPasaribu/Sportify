import Modal from '@/Components/Modal';
import { TriangleAlert } from 'lucide-react';

export default function ConfirmModal({
    show,
    title = 'Konfirmasi tindakan',
    description,
    confirmLabel = 'Ya, lanjutkan',
    cancelLabel = 'Batal',
    onConfirm,
    onClose,
    processing = false,
    danger = false,
}) {
    return (
        <Modal show={show} onClose={onClose} maxWidth="md">
            <div className="p-6">
                <div className="flex items-start gap-4">
                    <span
                        className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${
                            danger ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
                        }`}
                    >
                        <TriangleAlert className="h-5 w-5" />
                    </span>
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
                        {description && (
                            <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{description}</p>
                        )}
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={processing}
                        className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={processing}
                        className={`rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition disabled:opacity-50 ${
                            danger
                                ? 'bg-rose-600 hover:bg-rose-700'
                                : 'bg-brand-600 hover:bg-brand-700'
                        }`}
                    >
                        {processing ? 'Memproses...' : confirmLabel}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
