import { formatCurrency, formatTime } from '@/lib/utils';
import { Clock, RotateCcw } from 'lucide-react';

export default function SlotPicker({ slots, start, end, price, onChange }) {
    if (!slots?.length) {
        return null;
    }

    const startIndex = slots.findIndex((item) => item.start_time === start);

    const handleClick = (slot) => {
        if (!slot.available) {
            return;
        }

        const clickedIndex = slots.findIndex((item) => item.start_time === slot.start_time);

        // Belum ada pilihan, pilihan lama tidak valid, atau klik sebelum jam mulai:
        // mulai pilihan baru dari slot yang diklik.
        if (!start || !end || startIndex === -1 || clickedIndex < startIndex) {
            onChange(slot.start_time, slot.end_time);

            return;
        }

        // Klik ulang slot pertama: kembali ke durasi 1 jam.
        if (clickedIndex === startIndex) {
            onChange(slot.start_time, slot.end_time);

            return;
        }

        const range = slots.slice(startIndex, clickedIndex + 1);

        // Semua slot dalam rentang kosong: pilih beberapa jam sekaligus.
        if (range.every((item) => item.available)) {
            onChange(start, slot.end_time);

            return;
        }

        // Ada slot terisi di antaranya: mulai pilihan baru dari slot yang diklik.
        onChange(slot.start_time, slot.end_time);
    };

    const hasSelection = Boolean(start && end);
    const selectedCount = hasSelection
        ? slots.filter((slot) => slot.start_time >= start && slot.end_time <= end).length
        : 0;

    return (
        <div>
            <div className="mb-2 flex items-center justify-between gap-3">
                <p className="text-[11px] leading-relaxed text-slate-500">
                    {hasSelection
                        ? 'Klik jam berikutnya untuk menambah durasi, atau klik jam pertama untuk mengulang.'
                        : 'Klik jam mulai, lalu klik jam terakhir untuk memesan beberapa jam sekaligus.'}
                </p>
                {hasSelection && (
                    <button
                        type="button"
                        onClick={() => onChange(null, null)}
                        className="inline-flex shrink-0 items-center gap-1 rounded-lg px-1.5 py-1 text-[11px] font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                    >
                        <RotateCcw className="h-3 w-3" /> Bersihkan
                    </button>
                )}
            </div>

            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {slots.map((slot) => {
                    const isSelected =
                        hasSelection && slot.start_time >= start && slot.end_time <= end;
                    const isStart = start === slot.start_time;
                    const isEnd = end === slot.end_time;

                    return (
                        <button
                            key={slot.start_time}
                            type="button"
                            disabled={!slot.available}
                            aria-pressed={isSelected}
                            onClick={() => handleClick(slot)}
                            className={`relative rounded-xl border px-2 py-2.5 text-xs font-semibold transition ${
                                isSelected
                                    ? 'border-brand-600 bg-brand-600 text-white shadow-sm'
                                    : slot.available
                                      ? 'border-slate-200 bg-white text-slate-700 hover:border-brand-400 hover:bg-brand-50'
                                      : 'cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300 line-through'
                            }`}
                        >
                            {formatTime(slot.start_time)}
                            {(isStart || isEnd) && (
                                <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-amber-300" />
                            )}
                        </button>
                    );
                })}
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-slate-500">
                <span className="inline-flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-sm border border-slate-200 bg-white" /> Tersedia
                </span>
                <span className="inline-flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-sm bg-brand-600" /> Dipilih
                </span>
                <span className="inline-flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-sm bg-slate-200" /> Terisi
                </span>
                {hasSelection && selectedCount > 1 && (
                    <span className="inline-flex items-center gap-1 font-semibold text-brand-700">
                        {selectedCount} jam dipilih
                    </span>
                )}
                {price > 0 && (
                    <span className="ml-auto inline-flex items-center gap-1 font-semibold text-slate-600">
                        <Clock className="h-3.5 w-3.5" /> {formatCurrency(price)} / jam
                    </span>
                )}
            </div>
        </div>
    );
}
