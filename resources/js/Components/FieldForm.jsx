import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import { formatCurrency, getSport, SPORTS } from '@/lib/utils';
import { Link, useForm } from '@inertiajs/react';
import {
    CalendarClock,
    Check,
    Copy,
    Info,
    LoaderCircle,
    Save,
    Sparkles,
    Wallet,
} from 'lucide-react';
import { useMemo } from 'react';

const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0];

const DAY_LABELS = {
    0: 'Minggu',
    1: 'Senin',
    2: 'Selasa',
    3: 'Rabu',
    4: 'Kamis',
    5: 'Jumat',
    6: 'Sabtu',
};

const DEFAULT_OPEN = '08:00';
const DEFAULT_CLOSE = '22:00';

function timeValue(value, fallback) {
    if (!value) {
        return fallback;
    }

    const normalized = String(value).slice(0, 5);

    return /^\d{2}:\d{2}$/.test(normalized) ? normalized : fallback;
}

function buildHours(field) {
    const existing = new Map(
        (field?.operating_hours ?? []).map((hour) => [Number(hour.day_of_week), hour]),
    );

    return DAY_ORDER.map((day) => {
        const hour = existing.get(day);

        return {
            day_of_week: day,
            open_time: timeValue(hour?.open_time, DEFAULT_OPEN),
            close_time: timeValue(hour?.close_time, DEFAULT_CLOSE),
            is_closed: Boolean(hour?.is_closed),
        };
    });
}

export default function FieldForm({ venue, field = null, sportTypes = Object.keys(SPORTS) }) {
    const isEdit = Boolean(field);

    const form = useForm({
        name: field?.name ?? '',
        sport_type: field?.sport_type ?? sportTypes[0] ?? 'futsal',
        price_per_hour: field?.price_per_hour ?? '',
        is_active: field?.is_active ?? true,
        hours: buildHours(field),
    });

    const selectedSport = getSport(form.data.sport_type);
    const SportIcon = selectedSport.icon;

    const activeDays = useMemo(
        () => form.data.hours.filter((hour) => !hour.is_closed).length,
        [form.data.hours],
    );

    const updateHour = (dayOfWeek, key, value) => {
        form.setData(
            'hours',
            form.data.hours.map((hour) =>
                hour.day_of_week === dayOfWeek ? { ...hour, [key]: value } : hour,
            ),
        );
    };

    const copyFirstSchedule = () => {
        const source = form.data.hours.find((hour) => !hour.is_closed) ?? form.data.hours[0];

        if (!source) {
            return;
        }

        form.setData(
            'hours',
            form.data.hours.map((hour) => ({
                ...hour,
                open_time: source.open_time,
                close_time: source.close_time,
            })),
        );
    };

    const submit = (event) => {
        event.preventDefault();

        if (isEdit) {
            form.put(route('owner.venues.fields.update', [venue.id, field.id]), {
                preserveScroll: true,
            });

            return;
        }

        form.post(route('owner.venues.fields.store', venue.id), { preserveScroll: true });
    };

    return (
        <form onSubmit={submit} className="grid gap-6 xl:grid-cols-[1.55fr_1fr]">
            <div className="space-y-5">
                <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
                    <div className="flex items-start gap-3">
                        <span
                            className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${selectedSport.gradient} text-white`}
                        >
                            <SportIcon className="h-5 w-5" />
                        </span>
                        <div>
                            <h3 className="text-base font-bold text-slate-900">Informasi lapangan</h3>
                            <p className="mt-1 text-xs text-slate-500">
                                Data ini menentukan tampilan lapangan pada halaman detail venue.
                            </p>
                        </div>
                    </div>

                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                            <InputLabel htmlFor="name" value="Nama lapangan" />
                            <input
                                id="name"
                                value={form.data.name}
                                onChange={(event) => form.setData('name', event.target.value)}
                                placeholder="Contoh: Lapangan A / Court 1"
                                className="mt-1.5 w-full rounded-xl border-slate-300 text-sm shadow-sm focus:border-brand-500 focus:ring-brand-500"
                            />
                            <InputError message={form.errors.name} className="mt-1.5" />
                        </div>

                        <div>
                            <InputLabel htmlFor="sport_type" value="Jenis olahraga" />
                            <select
                                id="sport_type"
                                value={form.data.sport_type}
                                onChange={(event) => form.setData('sport_type', event.target.value)}
                                className="mt-1.5 w-full rounded-xl border-slate-300 text-sm shadow-sm focus:border-brand-500 focus:ring-brand-500"
                            >
                                {sportTypes.map((type) => (
                                    <option key={type} value={type}>
                                        {getSport(type).label}
                                    </option>
                                ))}
                            </select>
                            <InputError message={form.errors.sport_type} className="mt-1.5" />
                        </div>

                        <div>
                            <InputLabel htmlFor="price_per_hour" value="Harga sewa per jam" />
                            <div className="relative mt-1.5">
                                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-sm font-semibold text-slate-400">
                                    Rp
                                </span>
                                <input
                                    id="price_per_hour"
                                    type="number"
                                    min="0"
                                    step="1000"
                                    value={form.data.price_per_hour}
                                    onChange={(event) =>
                                        form.setData('price_per_hour', event.target.value)
                                    }
                                    placeholder="150000"
                                    className="w-full rounded-xl border-slate-300 pl-10 text-sm shadow-sm focus:border-brand-500 focus:ring-brand-500"
                                />
                            </div>
                            {form.data.price_per_hour !== '' && !form.errors.price_per_hour && (
                                <p className="mt-1.5 text-xs text-slate-400">
                                    Setara {formatCurrency(form.data.price_per_hour)} / jam
                                </p>
                            )}
                            <InputError message={form.errors.price_per_hour} className="mt-1.5" />
                        </div>
                    </div>
                </section>

                <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700">
                                <CalendarClock className="h-5 w-5" />
                            </span>
                            <div>
                                <h3 className="text-base font-bold text-slate-900">
                                    Jam operasional
                                </h3>
                                <p className="mt-1 text-xs text-slate-500">
                                    Slot booking dibuat otomatis setiap jam sesuai rentang di bawah.
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={copyFirstSchedule}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                        >
                            <Copy className="h-3.5 w-3.5" /> Samakan semua hari
                        </button>
                    </div>

                    <div className="mt-5 space-y-2">
                        {form.data.hours.map((hour, index) => {
                            const openError =
                                form.errors[`hours.${index}.open_time`] ??
                                form.errors[`hours.${index}.close_time`];
                            const closed = hour.is_closed;

                            return (
                                <div
                                    key={hour.day_of_week}
                                    className={`rounded-xl border p-3 transition sm:flex sm:items-center sm:gap-3 ${
                                        closed
                                            ? 'border-slate-200 bg-slate-50/70'
                                            : 'border-slate-200 bg-white'
                                    }`}
                                >
                                    <div className="flex items-center justify-between gap-3 sm:w-32">
                                        <span
                                            className={`text-sm font-semibold ${
                                                closed ? 'text-slate-400' : 'text-slate-800'
                                            }`}
                                        >
                                            {DAY_LABELS[hour.day_of_week]}
                                        </span>
                                        <label className="inline-flex cursor-pointer items-center gap-1.5 text-[11px] font-medium text-slate-500 sm:hidden">
                                            <input
                                                type="checkbox"
                                                checked={closed}
                                                onChange={(event) =>
                                                    updateHour(
                                                        hour.day_of_week,
                                                        'is_closed',
                                                        event.target.checked,
                                                    )
                                                }
                                                className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                                            />
                                            Tutup
                                        </label>
                                    </div>

                                    <div className="mt-2 flex flex-1 items-center gap-2 sm:mt-0">
                                        <input
                                            type="time"
                                            value={hour.open_time}
                                            disabled={closed}
                                            onChange={(event) =>
                                                updateHour(
                                                    hour.day_of_week,
                                                    'open_time',
                                                    event.target.value,
                                                )
                                            }
                                            className="w-full rounded-lg border-slate-300 text-sm shadow-sm focus:border-brand-500 focus:ring-brand-500 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 sm:max-w-32"
                                        />
                                        <span className="text-xs text-slate-400">s/d</span>
                                        <input
                                            type="time"
                                            value={hour.close_time}
                                            disabled={closed}
                                            onChange={(event) =>
                                                updateHour(
                                                    hour.day_of_week,
                                                    'close_time',
                                                    event.target.value,
                                                )
                                            }
                                            className="w-full rounded-lg border-slate-300 text-sm shadow-sm focus:border-brand-500 focus:ring-brand-500 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 sm:max-w-32"
                                        />
                                    </div>

                                    <label className="hidden cursor-pointer items-center gap-1.5 text-[11px] font-medium text-slate-500 sm:inline-flex sm:w-20 sm:justify-end">
                                        <input
                                            type="checkbox"
                                            checked={closed}
                                            onChange={(event) =>
                                                updateHour(
                                                    hour.day_of_week,
                                                    'is_closed',
                                                    event.target.checked,
                                                )
                                            }
                                            className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                                        />
                                        Tutup
                                    </label>

                                    {openError && (
                                        <p className="mt-1.5 text-xs font-medium text-rose-600 sm:hidden">
                                            {openError}
                                        </p>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <InputError message={form.errors.hours} className="mt-2" />

                    <div className="mt-4 flex items-center gap-2 rounded-xl bg-brand-50/70 px-3.5 py-2.5 text-xs text-brand-800">
                        <Info className="h-3.5 w-3.5 shrink-0" />
                        {activeDays} hari aktif. Slot di luar jam operasional otomatis tidak dapat
                        dibooking.
                    </div>
                </section>
            </div>

            <div className="space-y-4">
                <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-900">Status lapangan</h3>
                    <p className="mt-1 text-xs leading-relaxed text-slate-500">
                        Lapangan nonaktif tidak akan muncul pada halaman pencarian customer.
                    </p>

                    <button
                        type="button"
                        onClick={() => form.setData('is_active', !form.data.is_active)}
                        className={`mt-4 flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition ${
                            form.data.is_active
                                ? 'border-brand-300 bg-brand-50/70'
                                : 'border-slate-200 bg-slate-50'
                        }`}
                    >
                        <span>
                            <span className="block text-sm font-semibold text-slate-800">
                                {form.data.is_active ? 'Aktif & dapat dibooking' : 'Nonaktif'}
                            </span>
                            <span className="mt-0.5 block text-xs text-slate-500">
                                {form.data.is_active
                                    ? 'Customer dapat melihat dan memesan lapangan ini.'
                                    : 'Lapangan disembunyikan dari pencarian.'}
                            </span>
                        </span>
                        <span
                            className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition ${
                                form.data.is_active ? 'bg-brand-600' : 'bg-slate-300'
                            }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition ${
                                    form.data.is_active ? 'translate-x-6' : 'translate-x-1'
                                }`}
                            />
                        </span>
                    </button>
                    <InputError message={form.errors.is_active} className="mt-1.5" />
                </section>

                <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-900">Ringkasan</h3>
                    <div className="mt-3 space-y-2.5 text-sm">
                        <div className="flex items-center justify-between gap-3">
                            <span className="text-slate-500">Venue</span>
                            <span className="truncate font-semibold text-slate-800">
                                {venue.name}
                            </span>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                            <span className="text-slate-500">Olahraga</span>
                            <span className="font-semibold text-slate-800">
                                {selectedSport.label}
                            </span>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                            <span className="text-slate-500">Harga / jam</span>
                            <span className="font-semibold text-slate-800">
                                {form.data.price_per_hour
                                    ? formatCurrency(form.data.price_per_hour)
                                    : '-'}
                            </span>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                            <span className="text-slate-500">Hari aktif</span>
                            <span className="font-semibold text-slate-800">{activeDays} hari</span>
                        </div>
                    </div>
                </section>

                <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
                    <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
                        <Sparkles className="h-4 w-4 text-brand-600" /> Tips
                    </h3>
                    <ul className="mt-3 space-y-2.5 text-xs leading-relaxed text-slate-500">
                        <li className="flex gap-2">
                            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-600" />
                            Beri nama lapangan yang mudah dikenali customer.
                        </li>
                        <li className="flex gap-2">
                            <Wallet className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-600" />
                            Harga otomatis dikalikan durasi booking per jam.
                        </li>
                        <li className="flex gap-2">
                            <CalendarClock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-600" />
                            Pastikan jam tutup lebih lambat dari jam buka.
                        </li>
                    </ul>
                </section>

                <div className="flex flex-col gap-2 sm:flex-row xl:flex-col">
                    <button
                        type="submit"
                        disabled={form.processing}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {form.processing ? (
                            <LoaderCircle className="h-4 w-4 animate-spin" />
                        ) : (
                            <Save className="h-4 w-4" />
                        )}
                        {isEdit ? 'Simpan perubahan' : 'Tambah lapangan'}
                    </button>
                    <Link
                        href={route('owner.venues.fields.index', venue.id)}
                        className="inline-flex flex-1 items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                        Batal
                    </Link>
                </div>
            </div>
        </form>
    );
}
