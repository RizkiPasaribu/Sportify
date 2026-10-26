import EmptyState from '@/Components/EmptyState';
import PageHeader from '@/Components/PageHeader';
import StatCard from '@/Components/StatCard';
import VenueCard from '@/Components/VenueCard';
import DashboardLayout from '@/Layouts/DashboardLayout';
import {
    bookingStatus,
    formatCompactCurrency,
    formatCurrency,
    formatDateShort,
    formatTimeRange,
    imageForVenue,
    paymentStatus,
} from '@/lib/utils';
import { Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    CalendarCheck2,
    CalendarDays,
    CircleCheck,
    ClipboardList,
    MapPin,
    Search,
    Star,
    Wallet,
} from 'lucide-react';

export default function Dashboard({
    upcomingBookings = [],
    favouriteVenues = [],
    pendingReviews = [],
    stats = {},
}) {
    const { auth } = usePage().props;
    const user = auth.user;
    const firstName = user.name.split(' ')[0];

    return (
        <DashboardLayout
            title="Dashboard"
            header={
                <PageHeader
                    eyebrow="Customer Dashboard"
                    title={`Halo, ${firstName}! 👋`}
                    description="Siap main lagi? Berikut ringkasan aktivitas booking Anda."
                    action={
                        <Link
                            href={route('venues.index')}
                            className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
                        >
                            <Search className="h-4 w-4" /> Cari Lapangan
                        </Link>
                    }
                />
            }
        >
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    title="Booking Aktif"
                    value={stats.upcoming ?? 0}
                    icon={CalendarCheck2}
                    description="Menunggu atau terkonfirmasi"
                    accent="brand"
                />
                <StatCard
                    title="Selesai"
                    value={stats.completed ?? 0}
                    icon={CircleCheck}
                    description="Total sesi yang sudah dimainkan"
                    accent="sky"
                />
                <StatCard
                    title="Total Booking"
                    value={stats.total ?? 0}
                    icon={ClipboardList}
                    description="Sejak akun dibuat"
                    accent="violet"
                />
                <StatCard
                    title="Total Pengeluaran"
                    value={formatCompactCurrency(stats.spent ?? 0)}
                    icon={Wallet}
                    description="Pembayaran berhasil"
                    accent="amber"
                />
            </div>

            <div className="mt-8 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
                <section>
                    <div className="flex items-center justify-between">
                        <h3 className="text-base font-bold text-slate-900">Booking mendatang</h3>
                        <Link
                            href={route('customer.bookings.index')}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700"
                        >
                            Lihat semua <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                    </div>

                    <div className="mt-3 space-y-3">
                        {upcomingBookings.length > 0 ? (
                            upcomingBookings.map((booking) => {
                                const status = bookingStatus(booking.status);
                                const payment = paymentStatus(booking.payment_status);

                                return (
                                    <Link
                                        key={booking.id}
                                        href={route('customer.bookings.show', booking.id)}
                                        className="group flex gap-4 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-sm transition hover:border-brand-200 hover:shadow-md"
                                    >
                                        <img
                                            src={imageForVenue(booking.field.venue)}
                                            alt={booking.field.venue.name}
                                            className="h-24 w-24 shrink-0 rounded-xl object-cover sm:h-28 sm:w-32"
                                        />
                                        <div className="flex min-w-0 flex-1 flex-col">
                                            <div className="flex flex-wrap items-start justify-between gap-2">
                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-bold text-slate-900 group-hover:text-brand-700">
                                                        {booking.field.venue.name}
                                                    </p>
                                                    <p className="mt-0.5 truncate text-xs text-slate-500">
                                                        {booking.field.name}
                                                    </p>
                                                </div>
                                                <span
                                                    className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[10px] font-semibold ring-1 ring-inset ${status.classes}`}
                                                >
                                                    <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                                                    {status.short}
                                                </span>
                                            </div>

                                            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                                                <span className="inline-flex items-center gap-1">
                                                    <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
                                                    {formatDateShort(booking.booking_date)}
                                                </span>
                                                <span className="inline-flex items-center gap-1">
                                                    <CalendarCheck2 className="h-3.5 w-3.5 text-slate-400" />
                                                    {formatTimeRange(booking.start_time, booking.end_time)}
                                                </span>
                                            </div>

                                            <div className="mt-auto flex items-end justify-between gap-2 pt-2">
                                                <span
                                                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset ${payment.classes}`}
                                                >
                                                    {payment.label}
                                                </span>
                                                <p className="text-sm font-extrabold text-slate-900">
                                                    {formatCurrency(booking.total_price)}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })
                        ) : (
                            <EmptyState
                                icon={CalendarCheck2}
                                title="Belum ada booking mendatang"
                                description="Yuk cari lapangan dan amankan jadwal bermain berikutnya."
                                actionLabel="Cari lapangan"
                                actionHref={route('venues.index')}
                            />
                        )}
                    </div>
                </section>

                <section>
                    {pendingReviews.length > 0 && (
                        <div className="mb-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-base font-bold text-slate-900">Beri rating</h3>
                                <Link
                                    href={route('customer.bookings.index', {
                                        status: 'completed',
                                    })}
                                    className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700"
                                >
                                    Lihat semua <ArrowRight className="h-3.5 w-3.5" />
                                </Link>
                            </div>

                            <div className="mt-3 space-y-2">
                                {pendingReviews.map((booking) => (
                                    <Link
                                        key={booking.id}
                                        href={`${route(
                                            'customer.bookings.show',
                                            booking.id,
                                        )}#review`}
                                        className="group flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-3 transition hover:border-amber-300 hover:bg-amber-100"
                                    >
                                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-500 text-white">
                                            <Star className="h-5 w-5" />
                                        </span>
                                        <span className="min-w-0 flex-1">
                                            <span className="block truncate text-sm font-semibold text-slate-900">
                                                {booking.field.venue.name}
                                            </span>
                                            <span className="block truncate text-xs text-slate-500">
                                                {booking.field.name} ·{' '}
                                                {formatDateShort(booking.booking_date)}
                                            </span>
                                        </span>
                                        <ArrowRight className="h-4 w-4 shrink-0 text-amber-600 transition group-hover:translate-x-0.5" />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex items-center justify-between">
                        <h3 className="text-base font-bold text-slate-900">Venue favorit</h3>
                    </div>

                    <div className="mt-3 space-y-3">
                        {favouriteVenues.length > 0 ? (
                            favouriteVenues.map((venue) => (
                                <Link
                                    key={venue.id}
                                    href={route('venues.show', venue.id)}
                                    className="group flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm transition hover:border-brand-200 hover:shadow-md"
                                >
                                    <img
                                        src={imageForVenue(venue)}
                                        alt={venue.name}
                                        className="h-16 w-16 rounded-xl object-cover"
                                    />
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-semibold text-slate-900 group-hover:text-brand-700">
                                            {venue.name}
                                        </p>
                                        <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-slate-500">
                                            <MapPin className="h-3.5 w-3.5" /> {venue.city}
                                        </p>
                                    </div>
                                    <ArrowRight className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:text-brand-600" />
                                </Link>
                            ))
                        ) : (
                            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center">
                                <p className="text-sm text-slate-500">
                                    Venue yang Anda booking akan muncul di sini.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="mt-4 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 p-5 text-white shadow-lg shadow-brand-900/10">
                        <p className="text-sm font-bold">Butuh lapangan untuk tim?</p>
                        <p className="mt-1.5 text-xs leading-relaxed text-brand-100">
                            Bandingkan beberapa venue sekaligus dan pilih yang paling sesuai
                            dengan budget tim Anda.
                        </p>
                        <Link
                            href={route('venues.index')}
                            className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-white/15 px-3 py-2 text-xs font-semibold text-white ring-1 ring-white/20 transition hover:bg-white/25"
                        >
                            Jelajahi venue <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                    </div>
                </section>
            </div>
        </DashboardLayout>
    );
}
