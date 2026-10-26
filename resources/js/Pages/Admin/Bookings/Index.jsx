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
    paymentMethodLabel,
    paymentStatus,
} from '@/lib/utils';
import { Link, router } from '@inertiajs/react';
import {
    CalendarDays,
    ClipboardList,
    Clock3,
    Filter,
    MapPin,
    ReceiptText,
    RotateCcw,
    Search,
    Wallet,
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

export default function Index({ bookings, filters = {}, counts = {} }) {
    const [search, setSearch] = useState(filters.q ?? '');
    const [date, setDate] = useState(filters.date ?? '');
    const [cancelTarget, setCancelTarget] = useState(null);
    const [processing, setProcessing] = useState(false);

    const applyFilters = (event) => {
        event.preventDefault();

        router.get(
            route('admin.bookings.index'),
            {
                status: filters.status ?? 'all',
                q: search || undefined,
                date: date || undefined,
            },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const resetFilters = () => {
        setSearch('');
        setDate('');
        router.get(
            route('admin.bookings.index'),
            { status: filters.status ?? 'all' },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const confirmCancel = () => {
        if (!cancelTarget) {
            return;
        }

        setProcessing(true);
        router.post(
            route('admin.bookings.cancel', cancelTarget.id),
            {},
            {
                preserveScroll: true,
                onFinish: () => {
                    setProcessing(false);
                    setCancelTarget(null);
                },
            },
        );
    };

    const hasFilters = Boolean(filters.q || filters.date);

    return (
        <DashboardLayout
            title="Transaksi & Booking"
            header={
                <PageHeader
                    eyebrow="Administrator"
                    title="Transaksi & Booking"
                    description="Pantau seluruh transaksi platform dan tangani booking bermasalah."
                />
            }
        >
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:col-span-2">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <p className="text-sm font-medium text-slate-500">
                                Total pendapatan platform
                            </p>
                            <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                                {formatCurrency(counts.revenue ?? 0)}
                            </p>
                            <p className="mt-1 text-xs text-slate-400">
                                Transaksi lunas di luar booking dibatalkan
                            </p>
                        </div>
                        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700">
                            <Wallet className="h-6 w-6" />
                        </span>
                    </div>
                </div>
                <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
                    <p className="text-sm font-medium text-slate-500">Total booking</p>
                    <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                        {counts.all ?? 0}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                        {counts.pending ?? 0} menunggu konfirmasi
                    </p>
                </div>
                <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
                    <p className="text-sm font-medium text-slate-500">Booking selesai</p>
                    <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                        {counts.completed ?? 0}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                        {counts.cancelled ?? 0} dibatalkan
                    </p>
                </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2 rounded-2xl border border-slate-200/80 bg-white p-2 shadow-sm">
                {tabs.map((tab) => {
                    const active = (filters.status ?? 'all') === tab.value;

                    return (
                        <Link
                            key={tab.value}
                            href={route('admin.bookings.index', {
                                status: tab.value,
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
                className="mt-4 grid gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_auto]"
            >
                <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Cari customer, email, atau venue..."
                        className="w-full rounded-xl border-slate-300 pl-9 text-sm shadow-sm focus:border-brand-500 focus:ring-brand-500"
                    />
                </div>

                <input
                    type="date"
                    value={date}
                    onChange={(event) => setDate(event.target.value)}
                    className="w-full rounded-xl border-slate-300 text-sm shadow-sm focus:border-brand-500 focus:ring-brand-500"
                />

                <div className="flex gap-2">
                    <button
                        type="submit"
                        className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 lg:flex-none"
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
                            <table className="w-full min-w-[920px] text-left text-sm">
                                <thead>
                                    <tr className="border-b border-slate-100 bg-slate-50/60 text-[11px] uppercase tracking-wide text-slate-400">
                                        <th className="px-5 py-3.5 font-semibold">Customer</th>
                                        <th className="px-3 py-3.5 font-semibold">Venue</th>
                                        <th className="px-3 py-3.5 font-semibold">Jadwal</th>
                                        <th className="px-3 py-3.5 font-semibold">Pembayaran</th>
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
                                        const canCancel = ['pending', 'confirmed'].includes(
                                            booking.status,
                                        );

                                        return (
                                            <tr
                                                key={booking.id}
                                                className="align-top transition hover:bg-slate-50/70"
                                            >
                                                <td className="px-5 py-4">
                                                    <p className="font-semibold text-slate-800">
                                                        {booking.user?.name}
                                                    </p>
                                                    <p className="text-xs text-slate-400">
                                                        {booking.user?.email}
                                                    </p>
                                                    <p className="mt-0.5 font-mono text-[10px] text-slate-400">
                                                        #{booking.id.slice(0, 8).toUpperCase()}
                                                    </p>
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
                                                    <p className="mt-0.5 text-[11px] text-slate-400">
                                                        {booking.latest_payment
                                                            ? paymentMethodLabel(
                                                                  booking.latest_payment
                                                                      .payment_method,
                                                              )
                                                            : 'Belum ada pembayaran'}
                                                    </p>
                                                    {booking.payment_status === 'refunded' &&
                                                        booking.latest_payment?.gateway_response
                                                            ?.refunded_at && (
                                                            <p className="mt-0.5 text-[10px] text-slate-400">
                                                                Refund{' '}
                                                                {formatDateShort(
                                                                    booking.latest_payment
                                                                        .gateway_response
                                                                        .refunded_at,
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

                                                <td className="px-5 py-4 text-right">
                                                    {canCancel ? (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setCancelTarget(booking)
                                                            }
                                                            className="inline-flex items-center gap-1 rounded-lg border border-rose-200 px-2.5 py-1.5 text-[11px] font-semibold text-rose-600 transition hover:bg-rose-50"
                                                        >
                                                            <XCircle className="h-3.5 w-3.5" />{' '}
                                                            Batalkan
                                                        </button>
                                                    ) : (
                                                        <span className="text-[11px] text-slate-400">
                                                            -
                                                        </span>
                                                    )}
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
                        title={hasFilters ? 'Transaksi tidak ditemukan' : 'Belum ada transaksi'}
                        description={
                            hasFilters
                                ? 'Coba ubah kata kunci atau tanggal filter Anda.'
                                : 'Transaksi customer akan tampil di sini secara otomatis.'
                        }
                        actionLabel={hasFilters ? 'Reset filter' : undefined}
                        onAction={hasFilters ? resetFilters : undefined}
                    />
                </div>
            )}

            <ConfirmModal
                show={Boolean(cancelTarget)}
                title="Batalkan booking ini?"
                description={`Booking ${cancelTarget?.user?.name ?? ''} akan dibatalkan dan pembayaran lunas direfund otomatis.`}
                confirmLabel="Ya, batalkan"
                onConfirm={confirmCancel}
                onClose={() => setCancelTarget(null)}
                processing={processing}
                danger
            />
        </DashboardLayout>
    );
}
