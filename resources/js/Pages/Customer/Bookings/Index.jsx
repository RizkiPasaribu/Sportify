import EmptyState from '@/Components/EmptyState';
import Pagination from '@/Components/Pagination';
import PageHeader from '@/Components/PageHeader';
import DashboardLayout from '@/Layouts/DashboardLayout';
import {
    bookingStatus,
    formatCurrency,
    formatDateShort,
    formatTimeRange,
    imageForVenue,
    paymentStatus,
} from '@/lib/utils';
import { Link } from '@inertiajs/react';
import {
    ArrowRight,
    CalendarCheck2,
    CalendarDays,
    CalendarX2,
    CircleCheck,
    Clock3,
    MapPin,
    ReceiptText,
    Search,
    Star,
} from 'lucide-react';

const tabs = [
    { value: 'active', label: 'Aktif', icon: CalendarCheck2 },
    { value: 'completed', label: 'Selesai', icon: CircleCheck },
    { value: 'cancelled', label: 'Dibatalkan', icon: CalendarX2 },
    { value: 'all', label: 'Semua', icon: ReceiptText },
];

export default function Index({ bookings, status = 'active', counts = {} }) {
    const emptyCopy = {
        active: {
            title: 'Tidak ada booking aktif',
            description: 'Booking yang menunggu konfirmasi atau sudah terkonfirmasi akan tampil di sini.',
        },
        completed: {
            title: 'Belum ada booking selesai',
            description: 'Setelah bermain, booking Anda akan otomatis masuk ke tab ini oleh mitra.',
        },
        cancelled: {
            title: 'Tidak ada booking dibatalkan',
            description: 'Semua booking Anda masih berjalan dengan baik.',
        },
        all: {
            title: 'Belum ada booking',
            description: 'Mulai cari lapangan favorit Anda dan lakukan booking pertama hari ini.',
        },
    }[status];

    return (
        <DashboardLayout
            title="Booking Saya"
            header={
                <PageHeader
                    eyebrow="Riwayat & Jadwal"
                    title="Booking Saya"
                    description="Pantau status pembayaran, konfirmasi mitra, dan riwayat bermain Anda."
                    action={
                        <Link
                            href={route('venues.index')}
                            className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
                        >
                            <Search className="h-4 w-4" /> Booking Baru
                        </Link>
                    }
                />
            }
        >
            <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-200/80 bg-white p-2 shadow-sm">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const active = status === tab.value;

                    return (
                        <Link
                            key={tab.value}
                            href={route('customer.bookings.index', { status: tab.value })}
                            preserveScroll
                            className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition ${
                                active
                                    ? 'bg-brand-600 text-white shadow-sm'
                                    : 'text-slate-600 hover:bg-slate-100'
                            }`}
                        >
                            <Icon className="h-4 w-4" />
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

            {bookings.data.length > 0 ? (
                <>
                    <div className="mt-5 space-y-3">
                        {bookings.data.map((booking) => {
                            const bookingState = bookingStatus(booking.status);
                            const paymentState = paymentStatus(booking.payment_status);
                            const canPay =
                                booking.payment_status === 'unpaid' &&
                                booking.status !== 'cancelled';

                            return (
                                <div
                                    key={booking.id}
                                    className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm"
                                >
                                    <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                                        <img
                                            src={imageForVenue(booking.field.venue)}
                                            alt={booking.field.venue.name}
                                            className="h-36 w-full rounded-xl object-cover sm:h-24 sm:w-32"
                                        />

                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-start justify-between gap-2">
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900">
                                                        {booking.field.venue.name}
                                                    </p>
                                                    <p className="mt-0.5 text-xs text-slate-500">
                                                        {booking.field.name} ·{' '}
                                                        {booking.field.sport_type}
                                                    </p>
                                                </div>
                                                <div className="flex flex-wrap gap-1.5">
                                                    <span
                                                        className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[10px] font-semibold ring-1 ring-inset ${bookingState.classes}`}
                                                    >
                                                        <span
                                                            className={`h-1.5 w-1.5 rounded-full ${bookingState.dot}`}
                                                        />
                                                        {bookingState.label}
                                                    </span>
                                                    <span
                                                        className={`inline-flex items-center rounded-full px-2 py-1 text-[10px] font-semibold ring-1 ring-inset ${paymentState.classes}`}
                                                    >
                                                        {paymentState.label}
                                                    </span>
                                                    {booking.review && (
                                                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-[10px] font-semibold text-amber-700 ring-1 ring-inset ring-amber-600/20">
                                                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                                            {booking.review.rating}/5
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500">
                                                <span className="inline-flex items-center gap-1.5">
                                                    <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
                                                    {formatDateShort(booking.booking_date)}
                                                </span>
                                                <span className="inline-flex items-center gap-1.5">
                                                    <Clock3 className="h-3.5 w-3.5 text-slate-400" />
                                                    {formatTimeRange(
                                                        booking.start_time,
                                                        booking.end_time,
                                                    )}
                                                </span>
                                                <span className="inline-flex items-center gap-1.5">
                                                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                                                    {booking.field.venue.city}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-3 sm:w-44 sm:flex-col sm:items-end sm:border-l sm:border-t-0 sm:pl-4 sm:pt-0">
                                            <div className="text-right">
                                                <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                                                    Total
                                                </p>
                                                <p className="text-base font-extrabold text-slate-900">
                                                    {formatCurrency(booking.total_price)}
                                                </p>
                                            </div>
                                            <div className="flex flex-wrap justify-end gap-2">
                                                {booking.status === 'completed' && !booking.review && (
                                                    <Link
                                                        href={`${route(
                                                            'customer.bookings.show',
                                                            booking.id,
                                                        )}#review`}
                                                        className="inline-flex items-center gap-1 rounded-lg bg-amber-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-amber-600"
                                                    >
                                                        <Star className="h-3.5 w-3.5" />
                                                        Beri Rating
                                                    </Link>
                                                )}
                                                {canPay && (
                                                    <Link
                                                        href={route(
                                                            'customer.bookings.show',
                                                            booking.id,
                                                        )}
                                                        className="rounded-lg bg-brand-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-brand-700"
                                                    >
                                                        Bayar
                                                    </Link>
                                                )}
                                                <Link
                                                    href={route(
                                                        'customer.bookings.show',
                                                        booking.id,
                                                    )}
                                                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                                                >
                                                    Detail <ArrowRight className="h-3.5 w-3.5" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <Pagination paginator={bookings} className="mt-6" />
                </>
            ) : (
                <div className="mt-5">
                    <EmptyState
                        icon={CalendarCheck2}
                        title={emptyCopy.title}
                        description={emptyCopy.description}
                        actionLabel="Cari lapangan"
                        actionHref={route('venues.index')}
                    />
                </div>
            )}
        </DashboardLayout>
    );
}
