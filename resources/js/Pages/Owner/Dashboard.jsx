import EmptyState from '@/Components/EmptyState';
import PageHeader from '@/Components/PageHeader';
import StatCard from '@/Components/StatCard';
import DashboardLayout from '@/Layouts/DashboardLayout';
import {
    bookingStatus,
    formatCompactCurrency,
    formatCurrency,
    formatDateShort,
    formatTimeRange,
    paymentStatus,
} from '@/lib/utils';
import { Link } from '@inertiajs/react';
import {
    ArrowRight,
    BarChart3,
    Building2,
    CalendarCheck2,
    CalendarDays,
    ClipboardList,
    Plus,
    TrendingUp,
    Wallet,
} from 'lucide-react';

export default function Dashboard({
    stats = {},
    monthlyRevenue = [],
    topFields = [],
    recentBookings = [],
}) {
    const maxRevenue = Math.max(...monthlyRevenue.map((item) => Number(item.total)), 1);

    return (
        <DashboardLayout
            title="Dashboard"
            header={
                <PageHeader
                    eyebrow="Owner Dashboard"
                    title="Ringkasan bisnis Anda"
                    description="Pantau performa venue, pendapatan, dan booking masuk dalam satu tampilan."
                    action={
                        <Link
                            href={route('owner.venues.create')}
                            className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
                        >
                            <Plus className="h-4 w-4" /> Tambah Venue
                        </Link>
                    }
                />
            }
        >
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    title="Pendapatan Bulan Ini"
                    value={formatCurrency(stats.revenue_this_month ?? 0)}
                    icon={Wallet}
                    description="Dari booking lunas"
                    accent="brand"
                />
                <StatCard
                    title="Total Pendapatan"
                    value={formatCurrency(stats.revenue_total ?? 0)}
                    icon={TrendingUp}
                    description="Akumulasi seluruh waktu"
                    accent="sky"
                />
                <StatCard
                    title="Booking Menunggu"
                    value={stats.pending_bookings ?? 0}
                    icon={ClipboardList}
                    description="Perlu konfirmasi Anda"
                    accent="amber"
                />
                <StatCard
                    title="Booking Mendatang"
                    value={stats.upcoming_bookings ?? 0}
                    icon={CalendarCheck2}
                    description="Pending & terkonfirmasi"
                    accent="violet"
                />
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-[1.45fr_1fr]">
                <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                            <h3 className="text-base font-bold text-slate-900">
                                Pendapatan 6 bulan terakhir
                            </h3>
                            <p className="mt-1 text-xs text-slate-500">
                                Hanya transaksi berstatus lunas dan tidak dibatalkan.
                            </p>
                        </div>
                        <Link
                            href={route('owner.reports.index')}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700"
                        >
                            Laporan lengkap <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                    </div>

                    <div className="mt-6 flex h-56 items-end gap-3 sm:gap-5">
                        {monthlyRevenue.map((item) => {
                            const height = Math.max((Number(item.total) / maxRevenue) * 100, 3);

                            return (
                                <div key={item.label} className="flex flex-1 flex-col items-center gap-2">
                                    <span className="text-[10px] font-semibold text-slate-500">
                                        {item.total > 0 ? formatCompactCurrency(item.total) : ''}
                                    </span>
                                    <div className="flex h-44 w-full items-end">
                                        <div
                                            className="w-full rounded-t-lg bg-gradient-to-t from-brand-600 to-brand-400 transition-all hover:from-brand-700 hover:to-brand-500"
                                            style={{ height: `${height}%` }}
                                            title={`${item.label}: ${formatCurrency(item.total)}`}
                                        />
                                    </div>
                                    <span className="text-[10px] font-medium text-slate-400">
                                        {item.label.split(' ')[0]}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </section>

                <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
                    <h3 className="text-base font-bold text-slate-900">Lapangan terpopuler</h3>
                    <p className="mt-1 text-xs text-slate-500">
                        Berdasarkan jumlah booking lunas.
                    </p>

                    <div className="mt-4 space-y-3">
                        {topFields.length > 0 ? (
                            topFields.map((field, index) => (
                                <div key={field.id} className="flex items-center gap-3">
                                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-slate-100 text-xs font-bold text-slate-500">
                                        {index + 1}
                                    </span>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-semibold text-slate-800">
                                            {field.name}
                                        </p>
                                        <p className="truncate text-xs text-slate-400">
                                            {field.venue?.name}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-slate-900">
                                            {field.paid_bookings_count}
                                        </p>
                                        <p className="text-[10px] text-slate-400">booking</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
                                Belum ada data booking untuk lapangan Anda.
                            </p>
                        )}
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-5">
                        <Link
                            href={route('owner.venues.index')}
                            className="rounded-xl bg-slate-50 p-3.5 transition hover:bg-slate-100"
                        >
                            <Building2 className="h-4 w-4 text-brand-600" />
                            <p className="mt-2 text-lg font-bold text-slate-900">
                                {stats.venues ?? 0}
                            </p>
                            <p className="text-[11px] text-slate-500">Venue aktif</p>
                        </Link>
                        <Link
                            href={route('owner.bookings.index')}
                            className="rounded-xl bg-slate-50 p-3.5 transition hover:bg-slate-100"
                        >
                            <BarChart3 className="h-4 w-4 text-brand-600" />
                            <p className="mt-2 text-lg font-bold text-slate-900">
                                {stats.fields ?? 0}
                            </p>
                            <p className="text-[11px] text-slate-500">Lapangan aktif</p>
                        </Link>
                    </div>
                </section>
            </div>

            <section className="mt-6 rounded-2xl border border-slate-200/80 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
                    <div>
                        <h3 className="text-base font-bold text-slate-900">Booking terbaru</h3>
                        <p className="mt-0.5 text-xs text-slate-500">
                            Aktivitas terakhir di seluruh venue Anda.
                        </p>
                    </div>
                    <Link
                        href={route('owner.bookings.index')}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700"
                    >
                        Lihat semua <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                </div>

                {recentBookings.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[720px] text-left text-sm">
                            <thead>
                                <tr className="border-b border-slate-100 text-[11px] uppercase tracking-wide text-slate-400">
                                    <th className="px-5 py-3 font-semibold sm:px-6">Customer</th>
                                    <th className="px-3 py-3 font-semibold">Venue / Lapangan</th>
                                    <th className="px-3 py-3 font-semibold">Jadwal</th>
                                    <th className="px-3 py-3 font-semibold">Total</th>
                                    <th className="px-3 py-3 font-semibold">Status</th>
                                    <th className="px-5 py-3 text-right font-semibold sm:px-6">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {recentBookings.map((booking) => {
                                    const status = bookingStatus(booking.status);
                                    const payment = paymentStatus(booking.payment_status);

                                    return (
                                        <tr key={booking.id} className="hover:bg-slate-50/70">
                                            <td className="px-5 py-3.5 sm:px-6">
                                                <p className="font-semibold text-slate-800">
                                                    {booking.user?.name}
                                                </p>
                                                <p className="text-xs text-slate-400">
                                                    {booking.user?.email}
                                                </p>
                                            </td>
                                            <td className="px-3 py-3.5">
                                                <p className="font-medium text-slate-700">
                                                    {booking.field?.venue?.name}
                                                </p>
                                                <p className="text-xs text-slate-400">
                                                    {booking.field?.name}
                                                </p>
                                            </td>
                                            <td className="px-3 py-3.5">
                                                <p className="text-slate-700">
                                                    {formatDateShort(booking.booking_date)}
                                                </p>
                                                <p className="text-xs text-slate-400">
                                                    {formatTimeRange(
                                                        booking.start_time,
                                                        booking.end_time,
                                                    )}
                                                </p>
                                            </td>
                                            <td className="px-3 py-3.5 font-semibold text-slate-800">
                                                {formatCurrency(booking.total_price)}
                                            </td>
                                            <td className="px-3 py-3.5">
                                                <div className="flex flex-col gap-1">
                                                    <span
                                                        className={`inline-flex w-fit items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset ${status.classes}`}
                                                    >
                                                        {status.short}
                                                    </span>
                                                    <span
                                                        className={`inline-flex w-fit items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset ${payment.classes}`}
                                                    >
                                                        {payment.label}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3.5 text-right sm:px-6">
                                                <Link
                                                    href={route('owner.bookings.index', {
                                                        q: booking.user?.email,
                                                    })}
                                                    className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700"
                                                >
                                                    Kelola <ArrowRight className="h-3.5 w-3.5" />
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-5">
                        <EmptyState
                            icon={CalendarDays}
                            title="Belum ada booking masuk"
                            description="Booking dari customer akan muncul di sini secara otomatis."
                        />
                    </div>
                )}
            </section>
        </DashboardLayout>
    );
}
