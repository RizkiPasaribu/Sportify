import EmptyState from '@/Components/EmptyState';
import PageHeader from '@/Components/PageHeader';
import StatCard from '@/Components/StatCard';
import DashboardLayout from '@/Layouts/DashboardLayout';
import {
    formatCompactCurrency,
    formatCurrency,
    formatMonth,
    paymentMethodLabel,
} from '@/lib/utils';
import { Link, router } from '@inertiajs/react';
import {
    ArrowRight,
    BarChart3,
    Building2,
    CalendarDays,
    ClipboardList,
    CreditCard,
    Download,
    ReceiptText,
    TrendingUp,
    Trophy,
    Wallet,
} from 'lucide-react';
import { useState } from 'react';

export default function Index({
    month,
    monthLabel,
    stats = {},
    revenueByVenue = [],
    revenueByField = [],
    dailyRevenue = [],
    monthlyRevenue = [],
    paymentMethods = [],
}) {
    const [selectedMonth, setSelectedMonth] = useState(month);
    const [hoveredDate, setHoveredDate] = useState(null);

    const maxDaily = Math.max(...dailyRevenue.map((item) => Number(item.revenue)), 1);
    const maxMonthly = Math.max(...monthlyRevenue.map((item) => Number(item.total)), 1);
    const totalPayments = paymentMethods.reduce((total, item) => total + Number(item.count), 0);
    const hasData = Number(stats.bookings) > 0;

    const applyMonth = (value) => {
        setSelectedMonth(value);

        if (!value) {
            return;
        }

        router.get(
            route('owner.reports.index'),
            { month: value },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    return (
        <DashboardLayout
            title="Laporan Pendapatan"
            header={
                <PageHeader
                    eyebrow="Laporan & Analitik"
                    title="Laporan Pendapatan"
                    description="Analisis performa venue, pendapatan, dan metode pembayaran customer."
                    action={
                        <div className="flex flex-wrap items-center gap-2">
                            <div className="relative">
                                <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="month"
                                    value={selectedMonth}
                                    onChange={(event) => applyMonth(event.target.value)}
                                    className="rounded-xl border-slate-300 pl-9 text-sm shadow-sm focus:border-brand-500 focus:ring-brand-500"
                                />
                            </div>
                            <Link
                                href={route('owner.bookings.index')}
                                className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
                            >
                                <ClipboardList className="h-4 w-4" /> Booking masuk
                            </Link>
                        </div>
                    }
                />
            }
        >
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    title="Pendapatan Bulan Ini"
                    value={formatCurrency(stats.revenue ?? 0)}
                    icon={Wallet}
                    description={`${monthLabel} · hanya booking lunas`}
                    accent="brand"
                />
                <StatCard
                    title="Total Booking"
                    value={stats.bookings ?? 0}
                    icon={ClipboardList}
                    description="Tidak termasuk booking dibatalkan"
                    accent="sky"
                />
                <StatCard
                    title="Booking Lunas"
                    value={stats.paid_bookings ?? 0}
                    icon={ReceiptText}
                    description="Transaksi berhasil dibayar"
                    accent="violet"
                />
                <StatCard
                    title="Rata-rata / Booking"
                    value={formatCurrency(stats.average ?? 0)}
                    icon={TrendingUp}
                    description="Nilai transaksi rata-rata"
                    accent="amber"
                />
            </div>

            {hasData ? (
                <>
                    <div className="mt-6 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
                        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
                            <div className="flex flex-wrap items-start justify-between gap-3">
                                <div>
                                    <h3 className="text-base font-bold text-slate-900">
                                        Pendapatan harian
                                    </h3>
                                    <p className="mt-1 text-xs text-slate-500">
                                        Distribusi pendapatan setiap tanggal pada {monthLabel}.
                                    </p>
                                </div>
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">
                                    <BarChart3 className="h-3.5 w-3.5" />{' '}
                                    {formatCompactCurrency(stats.revenue ?? 0)}
                                </span>
                            </div>

                            <div className="mt-6 overflow-x-auto pb-2">
                                <div className="flex h-60 min-w-[560px] gap-1.5 pt-8">
                                    {dailyRevenue.map((item) => {
                                        const height = Math.max(
                                            (Number(item.revenue) / maxDaily) * 100,
                                            2,
                                        );
                                        const isHovered = hoveredDate === item.date;

                                        return (
                                            <div
                                                key={item.date}
                                                className="flex flex-1 flex-col items-center gap-1.5"
                                                onMouseEnter={() => setHoveredDate(item.date)}
                                                onMouseLeave={() => setHoveredDate(null)}
                                            >
                                                <div className="relative flex w-full flex-1 items-end">
                                                    <div
                                                        className={`relative w-full rounded-t-md transition-all ${
                                                            Number(item.revenue) > 0
                                                                ? 'bg-gradient-to-t from-brand-600 to-brand-400 hover:from-brand-700 hover:to-brand-500'
                                                                : 'bg-slate-100'
                                                        }`}
                                                        style={{ height: `${height}%` }}
                                                        title={`${item.label} ${monthLabel}: ${formatCurrency(item.revenue)}`}
                                                    >
                                                        {isHovered && Number(item.revenue) > 0 && (
                                                            <span className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-1 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-[10px] font-semibold text-white shadow-lg">
                                                                {formatCurrency(item.revenue)}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <span className="text-[9px] font-medium text-slate-400">
                                                    {item.label}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </section>

                        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
                            <h3 className="text-base font-bold text-slate-900">
                                Tren 6 bulan terakhir
                            </h3>
                            <p className="mt-1 text-xs text-slate-500">
                                Total pendapatan lunas per bulan.
                            </p>

                            <div className="mt-6 flex h-52 items-end gap-3">
                                {monthlyRevenue.map((item) => {
                                    const height = Math.max(
                                        (Number(item.total) / maxMonthly) * 100,
                                        3,
                                    );

                                    return (
                                        <div
                                            key={item.label}
                                            className="flex flex-1 flex-col items-center gap-2"
                                        >
                                            <span className="text-[10px] font-semibold text-slate-500">
                                                {Number(item.total) > 0
                                                    ? formatCompactCurrency(item.total)
                                                    : ''}
                                            </span>
                                            <div className="flex h-40 w-full items-end">
                                                <div
                                                    className="w-full rounded-t-lg bg-gradient-to-t from-slate-700 to-slate-500 transition-all hover:from-slate-800 hover:to-slate-600"
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
                    </div>

                    <div className="mt-6 grid gap-6 xl:grid-cols-2">
                        <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
                            <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-4 sm:px-6">
                                <Building2 className="h-4 w-4 text-brand-600" />
                                <div>
                                    <h3 className="text-base font-bold text-slate-900">
                                        Pendapatan per venue
                                    </h3>
                                    <p className="text-xs text-slate-500">
                                        Kontribusi tiap venue pada {monthLabel}.
                                    </p>
                                </div>
                            </div>

                            {revenueByVenue.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-[420px] text-left text-sm">
                                        <thead>
                                            <tr className="border-b border-slate-100 text-[11px] uppercase tracking-wide text-slate-400">
                                                <th className="px-5 py-3 font-semibold sm:px-6">
                                                    Venue
                                                </th>
                                                <th className="px-3 py-3 font-semibold">
                                                    Booking
                                                </th>
                                                <th className="px-5 py-3 text-right font-semibold sm:px-6">
                                                    Pendapatan
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {revenueByVenue.map((item) => (
                                                <tr
                                                    key={item.venue}
                                                    className="hover:bg-slate-50/70"
                                                >
                                                    <td className="px-5 py-3.5 font-semibold text-slate-800 sm:px-6">
                                                        {item.venue}
                                                    </td>
                                                    <td className="px-3 py-3.5 text-slate-500">
                                                        {item.bookings}
                                                    </td>
                                                    <td className="px-5 py-3.5 text-right font-bold text-slate-900 sm:px-6">
                                                        {formatCurrency(item.revenue)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="p-5 text-sm text-slate-500">
                                    Belum ada data venue pada bulan ini.
                                </p>
                            )}
                        </section>

                        <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
                            <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-4 sm:px-6">
                                <Trophy className="h-4 w-4 text-brand-600" />
                                <div>
                                    <h3 className="text-base font-bold text-slate-900">
                                        Lapangan terbaik
                                    </h3>
                                    <p className="text-xs text-slate-500">
                                        Diurutkan berdasarkan pendapatan.
                                    </p>
                                </div>
                            </div>

                            {revenueByField.length > 0 ? (
                                <div className="space-y-4 p-5 sm:p-6">
                                    {revenueByField.map((item, index) => {
                                        const max = Math.max(
                                            ...revenueByField.map((row) => Number(row.revenue)),
                                            1,
                                        );
                                        const width = Math.max(
                                            (Number(item.revenue) / max) * 100,
                                            2,
                                        );

                                        return (
                                            <div key={`${item.field}-${index}`}>
                                                <div className="flex items-center justify-between gap-3 text-sm">
                                                    <span className="flex min-w-0 items-center gap-2 font-semibold text-slate-800">
                                                        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-slate-100 text-[10px] font-bold text-slate-500">
                                                            {index + 1}
                                                        </span>
                                                        <span className="truncate">
                                                            {item.field}
                                                        </span>
                                                    </span>
                                                    <span className="shrink-0 font-bold text-slate-900">
                                                        {formatCurrency(item.revenue)}
                                                    </span>
                                                </div>
                                                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                                                    <div
                                                        className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-400"
                                                        style={{ width: `${width}%` }}
                                                    />
                                                </div>
                                                <p className="mt-1 text-[11px] text-slate-400">
                                                    {item.bookings} booking
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="p-5 text-sm text-slate-500">
                                    Belum ada data lapangan pada bulan ini.
                                </p>
                            )}
                        </section>
                    </div>

                    <section className="mt-6 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
                        <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4 text-brand-600" />
                            <div>
                                <h3 className="text-base font-bold text-slate-900">
                                    Metode pembayaran
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Preferensi pembayaran customer pada {monthLabel}.
                                </p>
                            </div>
                        </div>

                        {paymentMethods.length > 0 ? (
                            <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                                {paymentMethods.map((item) => {
                                    const percentage =
                                        totalPayments > 0
                                            ? Math.round((Number(item.count) / totalPayments) * 100)
                                            : 0;

                                    return (
                                        <div
                                            key={item.method}
                                            className="rounded-xl border border-slate-100 bg-slate-50/60 p-4"
                                        >
                                            <p className="text-sm font-semibold text-slate-800">
                                                {paymentMethodLabel(item.method)}
                                            </p>
                                            <p className="mt-1 text-lg font-bold text-slate-900">
                                                {formatCurrency(item.total)}
                                            </p>
                                            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200">
                                                <div
                                                    className="h-full rounded-full bg-brand-500"
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                            <p className="mt-1.5 text-[11px] text-slate-400">
                                                {item.count} transaksi · {percentage}%
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
                                Belum ada transaksi lunas pada bulan ini.
                            </p>
                        )}
                    </section>
                </>
            ) : (
                <div className="mt-6">
                    <EmptyState
                        icon={BarChart3}
                        title="Belum ada data laporan"
                        description={`Tidak ada booking pada ${formatMonth(month)}. Pilih bulan lain atau tunggu booking masuk.`}
                        actionLabel="Lihat booking masuk"
                        actionHref={route('owner.bookings.index')}
                    />
                </div>
            )}
        </DashboardLayout>
    );
}
