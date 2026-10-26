import ConfirmModal from '@/Components/ConfirmModal';
import EmptyState from '@/Components/EmptyState';
import PageHeader from '@/Components/PageHeader';
import Pagination from '@/Components/Pagination';
import DashboardLayout from '@/Layouts/DashboardLayout';
import {
    bookingStatus,
    formatCurrency,
    formatDateShort,
    formatTimeRange,
    paymentStatus,
} from '@/lib/utils';
import { Link, router } from '@inertiajs/react';
import {
    CalendarCheck2,
    CalendarDays,
    CheckCircle2,
    ClipboardList,
    Clock3,
    Filter,
    MapPin,
    RotateCcw,
    Search,
    XCircle,
} from 'lucide-react';
import { useState } from 'react';

const tabs = [
    { value: 'all', label: 'Semua' },
    { value: 'pending', label: 'Menunggu' },
    { value: 'confirmed', label: 'Terkonfirmasi' },
    { value: 'completed', label: 'Selesai' },
    { value: 'cancelled', label: 'Dibatalkan' },
];

const actions = {
    confirm: {
        title: 'Konfirmasi booking ini?',
        description: 'Customer akan menerima status terkonfirmasi dan jadwal lapangan terkunci.',
        confirmLabel: 'Ya, konfirmasi',
        successRoute: 'owner.bookings.confirm',
        danger: false,
    },
    complete: {
        title: 'Tandai booking selesai?',
        description: 'Booking akan dipindahkan ke riwayat selesai dan customer dapat menulis ulasan.',
        confirmLabel: 'Ya, selesaikan',
        successRoute: 'owner.bookings.complete',
        danger: false,
    },
    cancel: {
        title: 'Batalkan booking ini?',
        description:
            'Jadwal akan dibuka kembali untuk customer lain. Pembayaran yang sudah lunas akan direfund otomatis.',
        confirmLabel: 'Ya, batalkan booking',
        successRoute: 'owner.bookings.cancel',
        danger: true,
    },
};

export default function Index({
    bookings,
    filters = {},
    counts = {},
    venues = [],
}) {
    const [search, setSearch] = useState(filters.q ?? '');
    const [venueId, setVenueId] = useState(filters.venue_id ?? '');
    const [date, setDate] = useState(filters.date ?? '');
    const [action, setAction] = useState(null);
    const [processing, setProcessing] = useState(false);

    const applyFilters = (event) => {
        event.preventDefault();

        router.get(
            route('owner.bookings.index'),
            {
                status: filters.status ?? 'all',
                venue_id: venueId || undefined,
                q: search || undefined,
                date: date || undefined,
            },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const resetFilters = () => {
        setSearch('');
        setVenueId('');
        setDate('');
        router.get(
            route('owner.bookings.index'),
            { status: filters.status ?? 'all' },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const confirmAction = () => {
        if (!action) {
            return;
        }

        const config = actions[action.type];

        setProcessing(true);
        router.post(
            route(config.successRoute, action.booking.id),
            {},
            {
                preserveScroll: true,
                onFinish: () => {
                    setProcessing(false);
                    setAction(null);
                },
            },
        );
    };

    const hasFilters = Boolean(filters.q || filters.venue_id || filters.date);

    return (
        <DashboardLayout
            title="Booking Masuk"
            header={
                <PageHeader
                    eyebrow="Manajemen Booking"
                    title="Booking Masuk"
                    description="Konfirmasi, selesaikan, atau batalkan booking dari customer di seluruh venue Anda."
                    action={
                        <Link
                            href={route('owner.reports.index')}
                            className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
                        >
                            <ClipboardList className="h-4 w-4" /> Lihat laporan
                        </Link>
                    }
                />
            }
        >
            <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-200/80 bg-white p-2 shadow-sm">
                {tabs.map((tab) => {
                    const active = (filters.status ?? 'all') === tab.value;

                    return (
                        <Link
                            key={tab.value}
                            href={route('owner.bookings.index', {
                                status: tab.value,
                                venue_id: filters.venue_id || undefined,
                                q: filters.q || undefined,
                                date: filters.date || undefined,
                            })}
                            preserveScroll
                            className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition ${
                                active
                                    ? 'bg-brand-600 text-white shadow-sm'
                                    : 'text-slate-600 hover:bg-slate-100'
                            }`}
                        >
                            {tab.label}
                            <span
                                className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                                    active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                                }`}
                            >
                                {counts[tab.value] ?? 0}
                            </span>
                        </Link>
                    );
                })}
            </div>

            <form
                onSubmit={applyFilters}
                className="mt-4 grid gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_auto]"
            >
                <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Cari nama atau email customer..."
                        className="w-full rounded-xl border-slate-300 pl-9 text-sm shadow-sm focus:border-brand-500 focus:ring-brand-500"
                    />
                </div>

                <select
                    value={venueId}
                    onChange={(event) => setVenueId(event.target.value)}
                    className="w-full rounded-xl border-slate-300 text-sm shadow-sm focus:border-brand-500 focus:ring-brand-500"
                >
                    <option value="">Semua venue</option>
                    {venues.map((venue) => (
                        <option key={venue.id} value={venue.id}>
                            {venue.name}
                        </option>
                    ))}
                </select>

                <input
                    type="date"
                    value={date}
                    onChange={(event) => setDate(event.target.value)}
                    className="w-full rounded-xl border-slate-300 text-sm shadow-sm focus:border-brand-500 focus:ring-brand-500"
                />

                <div className="flex gap-2">
                    <button
                        type="submit"
                        className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                        <Filter className="h-4 w-4" /> Filter
                    </button>
                    {hasFilters && (
                        <button
                            type="button"
                            onClick={resetFilters}
                            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50"
                            aria-label="Reset filter"
                        >
                            <RotateCcw className="h-4 w-4" />
                        </button>
                    )}
                </div>
            </form>

            {bookings.data.length > 0 ? (
                <>
                    <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[900px] text-left text-sm">
                                <thead>
                                    <tr className="border-b border-slate-100 bg-slate-50/60 text-[11px] uppercase tracking-wide text-slate-400">
                                        <th className="px-5 py-3.5 font-semibold">Customer</th>
                                        <th className="px-3 py-3.5 font-semibold">
                                            Venue / Lapangan
                                        </th>
                                        <th className="px-3 py-3.5 font-semibold">Jadwal</th>
                                        <th className="px-3 py-3.5 font-semibold">Total</th>
                                        <th className="px-3 py-3.5 font-semibold">Status</th>
                                        <th className="px-5 py-3.5 text-right font-semibold">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {bookings.data.map((booking) => {
                                        const status = bookingStatus(booking.status);
                                        const payment = paymentStatus(booking.payment_status);
                                        const canConfirm =
                                            booking.status === 'pending' &&
                                            booking.payment_status === 'paid';
                                        const awaitingPayment =
                                            booking.status === 'pending' &&
                                            booking.payment_status !== 'paid';
                                        const canComplete = booking.status === 'confirmed';
                                        const canCancel = ['pending', 'confirmed'].includes(
                                            booking.status,
                                        );

                                        return (
                                            <tr
                                                key={booking.id}
                                                className="align-top transition hover:bg-slate-50/70"
                                            >
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-50 text-xs font-bold text-brand-700">
                                                            {(booking.user?.name ?? '?')
                                                                .split(' ')
                                                                .slice(0, 2)
                                                                .map((part) => part[0])
                                                                .join('')
                                                                .toUpperCase()}
                                                        </span>
                                                        <div className="min-w-0">
                                                            <p className="truncate font-semibold text-slate-800">
                                                                {booking.user?.name}
                                                            </p>
                                                            <p className="truncate text-xs text-slate-400">
                                                                {booking.user?.email}
                                                            </p>
                                                            <p className="mt-0.5 font-mono text-[10px] text-slate-400">
                                                                #{booking.id.slice(0, 8).toUpperCase()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-3 py-4">
                                                    <p className="font-medium text-slate-700">
                                                        {booking.field?.venue?.name}
                                                    </p>
                                                    <p className="text-xs text-slate-400">
                                                        {booking.field?.name}
                                                    </p>
                                                    <p className="mt-1 flex items-center gap-1 text-[11px] text-slate-400">
                                                        <MapPin className="h-3 w-3" />
                                                        {booking.field?.venue?.city}
                                                    </p>
                                                </td>

                                                <td className="px-3 py-4">
                                                    <p className="inline-flex items-center gap-1.5 text-slate-700">
                                                        <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
                                                        {formatDateShort(booking.booking_date)}
                                                    </p>
                                                    <p className="mt-0.5 inline-flex items-center gap-1.5 text-xs text-slate-400">
                                                        <Clock3 className="h-3.5 w-3.5" />
                                                        {formatTimeRange(
                                                            booking.start_time,
                                                            booking.end_time,
                                                        )}
                                                    </p>
                                                </td>

                                                <td className="px-3 py-4">
                                                    <p className="font-bold text-slate-900">
                                                        {formatCurrency(booking.total_price)}
                                                    </p>
                                                    {booking.latest_payment && (
                                                        <p className="mt-0.5 text-[10px] uppercase tracking-wide text-slate-400">
                                                            {booking.latest_payment.payment_method?.replace(
                                                                '_',
                                                                ' ',
                                                            )}
                                                        </p>
                                                    )}
                                                </td>

                                                <td className="px-3 py-4">
                                                    <div className="flex flex-col gap-1">
                                                        <span
                                                            className={`inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset ${status.classes}`}
                                                        >
                                                            <span
                                                                className={`h-1.5 w-1.5 rounded-full ${status.dot}`}
                                                            />
                                                            {status.short}
                                                        </span>
                                                        <span
                                                            className={`inline-flex w-fit items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset ${payment.classes}`}
                                                        >
                                                            {payment.label}
                                                        </span>
                                                    </div>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <div className="flex flex-col items-end gap-1.5">
                                                        {canConfirm && (
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    setAction({
                                                                        type: 'confirm',
                                                                        booking,
                                                                    })
                                                                }
                                                                className="inline-flex items-center gap-1 rounded-lg bg-brand-600 px-2.5 py-1.5 text-[11px] font-semibold text-white transition hover:bg-brand-700"
                                                            >
                                                                <CheckCircle2 className="h-3.5 w-3.5" />{' '}
                                                                Konfirmasi
                                                            </button>
                                                        )}
                                                        {awaitingPayment && (
                                                            <span
                                                                title="Customer belum menyelesaikan pembayaran. Booking dapat dikonfirmasi setelah pembayaran lunas."
                                                                className="inline-flex items-center gap-1 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1.5 text-[11px] font-semibold text-amber-700"
                                                            >
                                                                <Clock3 className="h-3.5 w-3.5" />{' '}
                                                                Menunggu pembayaran
                                                            </span>
                                                        )}
                                                        {canComplete && (
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    setAction({
                                                                        type: 'complete',
                                                                        booking,
                                                                    })
                                                                }
                                                                className="inline-flex items-center gap-1 rounded-lg bg-slate-900 px-2.5 py-1.5 text-[11px] font-semibold text-white transition hover:bg-slate-800"
                                                            >
                                                                <CalendarCheck2 className="h-3.5 w-3.5" />{' '}
                                                                Selesai
                                                            </button>
                                                        )}
                                                        {canCancel && (
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    setAction({
                                                                        type: 'cancel',
                                                                        booking,
                                                                    })
                                                                }
                                                                className="inline-flex items-center gap-1 rounded-lg border border-rose-200 px-2.5 py-1.5 text-[11px] font-semibold text-rose-600 transition hover:bg-rose-50"
                                                            >
                                                                <XCircle className="h-3.5 w-3.5" />{' '}
                                                                Batalkan
                                                            </button>
                                                        )}
                                                        {!canConfirm && !canComplete && !canCancel && (
                                                            <span className="text-[11px] text-slate-400">
                                                                Tidak ada aksi
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <Pagination paginator={bookings} className="mt-6" />
                </>
            ) : (
                <div className="mt-5">
                    <EmptyState
                        icon={ClipboardList}
                        title={hasFilters ? 'Booking tidak ditemukan' : 'Belum ada booking masuk'}
                        description={
                            hasFilters
                                ? 'Coba ubah kata kunci, venue, atau tanggal filter Anda.'
                                : 'Booking dari customer akan muncul di sini secara otomatis.'
                        }
                        actionLabel={hasFilters ? 'Reset filter' : undefined}
                        onAction={hasFilters ? resetFilters : undefined}
                    />
                </div>
            )}

            <ConfirmModal
                show={Boolean(action)}
                title={action ? actions[action.type].title : ''}
                description={action ? actions[action.type].description : ''}
                confirmLabel={action ? actions[action.type].confirmLabel : 'Ya, lanjutkan'}
                onConfirm={confirmAction}
                onClose={() => setAction(null)}
                processing={processing}
                danger={action ? actions[action.type].danger : false}
            />
        </DashboardLayout>
    );
}
