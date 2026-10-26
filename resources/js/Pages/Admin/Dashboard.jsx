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
    ReceiptText,
    ShieldCheck,
    TrendingUp,
    UserRound,
    Users,
    Wallet,
} from 'lucide-react';

export default function Dashboard({
    stats = {},
    recentBookings = [],
    topVenues = [],
    monthlyBookings = [],
}) {
    const maxBookings = Math.max(...monthlyBookings.map((item) => Number(item.total)), 1);

    return (
        <DashboardLayout
            title="Admin Dashboard"
            header={
                <PageHeader
                    eyebrow="Administrator"
                    title="Ringkasan platform"
                    description="Pantau pertumbuhan pengguna, venue, transaksi, dan aktivitas booking di Sportify."
                    action={
                        <Link
                            href={route('admin.bookings.index')}
                            className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
                        >
                            <ReceiptText className="h-4 w-4" /> Semua transaksi
                        </Link>
                    }
                />
            }
        >
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    title="Total Pengguna"
                    value={stats.users ?? 0}
                    icon={Users}
                    description={`${stats.customers ?? 0} customer · ${stats.owners ?? 0} owner`}
                    accent="brand"
                />
                <StatCard
                    title="Total Venue"
                    value={stats.venues ?? 0}
                    icon={Building2}
                    description={`${stats.fields ?? 0} lapangan terdaftar`}
                    accent="sky"
                />
                <StatCard
                    title="Total Booking"
                    value={stats.bookings ?? 0}
                    icon={CalendarCheck2}
                    description={`${stats.pending_bookings ?? 0} menunggu konfirmasi`}
                    accent="amber"
                />
                <StatCard
                    title="Total Pendapatan"
                    value={formatCurrency(stats.revenue ?? 0)}
                    icon={Wallet}
                    description="Transaksi lunas & tidak dibatalkan"
                    accent="violet"
                />
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
                <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                            <h3 className="text-base font-bold text-slate-900">
                                Booking 6 bulan terakhir
                            </h3>
                            <p className="mt-1 text-xs text-slate-500">
                                Jumlah booking yang dibuat di seluruh platform.
                            </p>
                        </div>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">
                            <TrendingUp className="h-3.5 w-3.5" /> {stats.bookings ?? 0} total
                        </span>
                    </div>

                    <div className="mt-6 flex h-56 items-end gap-3 sm:gap-5">
                        {monthlyBookings.map((item) => {
                            const height = Math.max((Number(item.total) / maxBookings) * 100, 3);

                            return (
                                <div
                                    key={item.label}
                                    className="flex flex-1 flex-col items-center gap-2"
                                >
                                    <span className="text-[10px] font-semibold text-slate-500">
                                        {item.total > 0 ? item.total : ''}
                                    </span>
                                    <div className="flex h-44 w-full items-end">
                                        <div
                                            className="w-full rounded-t-lg bg-gradient-to-t from-brand-600 to-brand-400 transition-all hover:from-brand-700 hover:to-brand-500"
                                            style={{ height: `${height}%` }}
                                            title={`${item.label}: ${item.total} booking`}
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
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-brand-600" />
                        <h3 className="text-base font-bold text-slate-900">Komposisi pengguna</h3>
                    </div>

                    <div className="mt-5 space-y-4">
                        <RoleBar
                            label="Customer"
                            value={stats.customers ?? 0}
                            total={stats.users ?? 0}
                            className="bg-brand-500"
                            icon={UserRound}
                        />
                        <RoleBar
                            label="Mitra / Owner"
                            value={stats.owners ?? 0}
                            total={stats.users ?? 0}
                            className="bg-sky-500"
                            icon={Building2}
                        />
                        <RoleBar
                            label="Administrator"
                            value={Math.max(
                                Number(stats.users ?? 0) -
                                    Number(stats.customers ?? 0) -
                                    Number(stats.owners ?? 0),
                                0,
                            )}
                            total={stats.users ?? 0}
                            className="bg-violet-500"
                            icon={ShieldCheck}
                        />
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3 border-t border-slate-100 pt-5">
                        <Link
                            href={route('admin.users.index')}
                            className="rounded-xl bg-slate-50 p-3.5 transition hover:bg-slate-100"
                        >
                            <Users className="h-4 w-4 text-brand-600" />
                            <p className="mt-2 text-sm font-bold text-slate-900">Kelola pengguna</p>
                            <p className="text-[11px] text-slate-500">Atur role & akses</p>
                        </Link>
                        <Link
                            href={route('admin.venues.index')}
                            className="rounded-xl bg-slate-50 p-3.5 transition hover:bg-slate-100"
                        >
                            <Building2 className="h-4 w-4 text-brand-600" />
                            <p className="mt-2 text-sm font-bold text-slate-900">Kelola venue</p>
                            <p className="text-[11px] text-slate-500">Moderasi mitra</p>
                        </Link>
                    </div>
                </section>
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_1fr]">
                <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
                        <div>
                            <h3 className="text-base font-bold text-slate-900">Booking terbaru</h3>
                            <p className="mt-0.5 text-xs text-slate-500">
                                Aktivitas transaksi terakhir di platform.
                            </p>
                        </div>
                        <Link
                            href={route('admin.bookings.index')}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700"
                        >
                            Lihat semua <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                    </div>

                    {recentBookings.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[680px] text-left text-sm">
                                <thead>
                                    <tr className="border-b border-slate-100 text-[11px] uppercase tracking-wide text-slate-400">
                                        <th className="px-5 py-3 font-semibold sm:px-6">
                                            Customer
                                        </th>
                                        <th className="px-3 py-3 font-semibold">Venue</th>
                                        <th className="px-3 py-3 font-semibold">Jadwal</th>
                                        <th className="px-3 py-3 font-semibold">Total</th>
                                        <th className="px-5 py-3 text-right font-semibold sm:px-6">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {recentBookings.map((booking) => {
                                        const status = bookingStatus(booking.status);
                                        const payment = paymentStatus(booking.payment_status);

                                        return (
                                            <tr
                                                key={booking.id}
                                                className="hover:bg-slate-50/70"
                                            >
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
                                                <td className="px-5 py-3.5 text-right sm:px-6">
                                                    <div className="flex flex-col items-end gap-1">
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
                                title="Belum ada booking"
                                description="Transaksi customer akan tampil di sini."
                            />
                        </div>
                    )}
                </section>

                <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
                    <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-4 sm:px-6">
                        <BarChart3 className="h-4 w-4 text-brand-600" />
                        <div>
                            <h3 className="text-base font-bold text-slate-900">Venue terpopuler</h3>
                            <p className="text-xs text-slate-500">Berdasarkan jumlah booking.</p>
                        </div>
                    </div>

                    {topVenues.length > 0 ? (
                        <div className="space-y-4 p-5 sm:p-6">
                            {topVenues.map((venue, index) => (
                                <div key={venue.id} className="flex items-center gap-3">
                                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-slate-100 text-xs font-bold text-slate-500">
                                        {index + 1}
                                    </span>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-semibold text-slate-800">
                                            {venue.name}
                                        </p>
                                        <p className="truncate text-xs text-slate-400">
                                            {venue.owner?.name} · {venue.fields_count} lapangan
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-slate-900">
                                            {venue.bookings_count}
                                        </p>
                                        <p className="text-[10px] text-slate-400">
                                            {formatCompactCurrency(venue.revenue ?? 0)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="p-5 text-sm text-slate-500">Belum ada venue terdaftar.</p>
                    )}

                    <div className="border-t border-slate-100 p-4">
                        <Link
                            href={route('admin.venues.index')}
                            className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-50 px-3 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                        >
                            <ClipboardList className="h-3.5 w-3.5" /> Lihat semua venue
                        </Link>
                    </div>
                </section>
            </div>
        </DashboardLayout>
    );
}

function RoleBar({ label, value, total, className, icon: Icon }) {
    const percentage = total > 0 ? Math.round((Number(value) / Number(total)) * 100) : 0;

    return (
        <div>
            <div className="flex items-center justify-between gap-3 text-sm">
                <span className="flex items-center gap-2 font-medium text-slate-700">
                    <Icon className="h-3.5 w-3.5 text-slate-400" /> {label}
                </span>
                <span className="font-semibold text-slate-800">
                    {value}{' '}
                    <span className="text-xs font-normal text-slate-400">({percentage}%)</span>
                </span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                <div className={`h-full rounded-full ${className}`} style={{ width: `${percentage}%` }} />
            </div>
        </div>
    );
}
