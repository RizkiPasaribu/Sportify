import ConfirmModal from '@/Components/ConfirmModal';
import PageHeader from '@/Components/PageHeader';
import RatingStars from '@/Components/RatingStars';
import DashboardLayout from '@/Layouts/DashboardLayout';
import {
    bookingStatus,
    durationLabel,
    formatCurrency,
    formatDateWithDay,
    formatTime,
    formatTimeRange,
    imageForVenue,
    paymentMethodLabel,
    paymentStatus,
    PAYMENT_METHODS,
} from '@/lib/utils';
import { Link, router, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    BadgeCheck,
    CalendarDays,
    CheckCircle2,
    CircleAlert,
    Clock3,
    CreditCard,
    Download,
    Info,
    LoaderCircle,
    MapPin,
    MessageSquare,
    Phone,
    ReceiptText,
    RotateCcw,
    ShieldCheck,
    Star,
    UserRound,
    XCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Show({ booking, canPay = false, canCancel = false, canReview = false }) {
    const [cancelOpen, setCancelOpen] = useState(false);
    const [cancelling, setCancelling] = useState(false);

    const paymentForm = useForm({ payment_method: 'bank_transfer' });
    const reviewForm = useForm({
        rating: 0,
        comment: '',
    });

    const status = bookingStatus(booking.status);
    const payment = paymentStatus(booking.payment_status);
    const latestPayment = booking.payments?.[0];
    const refundedAt = latestPayment?.gateway_response?.refunded_at;
    const venue = booking.field.venue;
    const duration = durationLabel(booking.start_time, booking.end_time);

    const submitPayment = (event) => {
        event.preventDefault();

        paymentForm.post(route('customer.bookings.pay', booking.id), {
            preserveScroll: true,
        });
    };

    const submitReview = (event) => {
        event.preventDefault();

        reviewForm.post(route('customer.bookings.review', booking.id), {
            preserveScroll: true,
        });
    };

    useEffect(() => {
        if (window.location.hash === '#review') {
            document.getElementById('review')?.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }
    }, []);

    const cancelBooking = () => {
        setCancelling(true);
        router.post(
            route('customer.bookings.cancel', booking.id),
            {},
            {
                onFinish: () => {
                    setCancelling(false);
                    setCancelOpen(false);
                },
            },
        );
    };

    return (
        <DashboardLayout title="Detail Booking">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <Link
                    href={route('customer.bookings.index')}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-brand-700"
                >
                    <ArrowLeft className="h-4 w-4" /> Kembali ke booking saya
                </Link>
                <div className="flex items-center gap-2">
                    <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-inset ${status.classes}`}
                    >
                        <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                        {status.label}
                    </span>
                    <span
                        className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-inset ${payment.classes}`}
                    >
                        {payment.label}
                    </span>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
                <div className="space-y-5">
                    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
                        <div className="relative h-44 sm:h-56">
                            <img
                                src={imageForVenue(venue)}
                                alt={venue.name}
                                className="h-full w-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent" />
                            <div className="absolute bottom-5 left-5 right-5 text-white">
                                <p className="text-xs font-medium text-brand-200">
                                    Kode booking #{booking.id.slice(0, 8).toUpperCase()}
                                </p>
                                <h2 className="mt-1 text-xl font-extrabold sm:text-2xl">
                                    {venue.name}
                                </h2>
                                <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-200">
                                    <MapPin className="h-4 w-4" /> {venue.address}
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
                            <DetailRow
                                icon={CalendarDays}
                                label="Tanggal bermain"
                                value={formatDateWithDay(booking.booking_date)}
                            />
                            <DetailRow
                                icon={Clock3}
                                label="Waktu"
                                value={`${formatTimeRange(booking.start_time, booking.end_time)} (${duration})`}
                            />
                            <DetailRow
                                icon={BadgeCheck}
                                label="Lapangan"
                                value={`${booking.field.name} · ${booking.field.sport_type}`}
                            />
                            <DetailRow
                                icon={UserRound}
                                label="Pemesan"
                                value={booking.user?.name ?? 'Anda'}
                            />
                        </div>

                        {booking.notes && (
                            <div className="border-t border-slate-100 px-5 py-4 sm:px-6">
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                    Catatan
                                </p>
                                <p className="mt-1 text-sm text-slate-600">{booking.notes}</p>
                            </div>
                        )}
                    </div>

                    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
                        <div className="flex items-center gap-2">
                            <ReceiptText className="h-5 w-5 text-brand-600" />
                            <h3 className="text-base font-bold text-slate-900">
                                Rincian pembayaran
                            </h3>
                        </div>

                        <div className="mt-4 space-y-2.5 text-sm">
                            <div className="flex items-center justify-between text-slate-600">
                                <span>
                                    Sewa {booking.field.name} × {duration}
                                </span>
                                <span className="font-medium text-slate-800">
                                    {formatCurrency(booking.total_price)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-slate-600">
                                <span>Biaya layanan</span>
                                <span className="font-medium text-brand-700">Gratis</span>
                            </div>
                            <div className="flex items-center justify-between border-t border-dashed border-slate-200 pt-3 text-base">
                                <span className="font-semibold text-slate-900">Total</span>
                                <span className="font-extrabold text-slate-900">
                                    {formatCurrency(booking.total_price)}
                                </span>
                            </div>
                        </div>

                        {latestPayment && (
                            <div className="mt-5 rounded-xl bg-slate-50 p-4">
                                <div className="grid gap-3 text-xs sm:grid-cols-2">
                                    <div>
                                        <p className="text-slate-400">Metode pembayaran</p>
                                        <p className="mt-0.5 font-semibold text-slate-700">
                                            {paymentMethodLabel(latestPayment.payment_method)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-slate-400">Referensi gateway</p>
                                        <p className="mt-0.5 font-mono font-semibold text-slate-700">
                                            {latestPayment.payment_gateway_ref}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-slate-400">Status transaksi</p>
                                        <p className="mt-0.5 font-semibold text-slate-700">
                                            {latestPayment.status === 'refunded'
                                                ? 'Dana Dikembalikan'
                                                : latestPayment.status === 'paid'
                                                  ? 'Lunas'
                                                  : 'Menunggu Pembayaran'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-slate-400">Waktu pembayaran</p>
                                        <p className="mt-0.5 font-semibold text-slate-700">
                                            {formatDateWithDay(latestPayment.created_at)}
                                        </p>
                                    </div>
                                    {refundedAt && (
                                        <div>
                                            <p className="text-slate-400">Waktu refund</p>
                                            <p className="mt-0.5 font-semibold text-slate-700">
                                                {formatDateWithDay(refundedAt)}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {(canReview || booking.review) && (
                        <div
                            id="review"
                            className="scroll-mt-24 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6"
                        >
                            <div className="flex items-center gap-2">
                                <MessageSquare className="h-5 w-5 text-brand-600" />
                                <h3 className="text-base font-bold text-slate-900">
                                    Ulasan Anda
                                </h3>
                            </div>

                            {booking.review ? (
                                <div className="mt-4 rounded-xl bg-slate-50 p-4">
                                    <div className="flex items-center justify-between gap-3">
                                        <RatingStars rating={booking.review.rating} />
                                        <span className="text-xs text-slate-400">
                                            {formatDateWithDay(booking.review.created_at)}
                                        </span>
                                    </div>
                                    <p className="mt-2.5 text-sm leading-relaxed text-slate-600">
                                        {booking.review.comment}
                                    </p>
                                </div>
                            ) : (
                                <form onSubmit={submitReview} className="mt-4">
                                    <p className="text-sm text-slate-500">
                                        Bagaimana pengalaman bermain Anda? Ulasan membantu pemain
                                        lain memilih venue.
                                    </p>
                                    <div className="mt-3">
                                        <RatingStars
                                            rating={reviewForm.data.rating}
                                            size="lg"
                                            interactive
                                            onChange={(rating) =>
                                                reviewForm.setData('rating', rating)
                                            }
                                        />
                                        {reviewForm.errors.rating && (
                                            <p className="mt-1 text-xs font-medium text-rose-600">
                                                {reviewForm.errors.rating}
                                            </p>
                                        )}
                                    </div>
                                    <textarea
                                        value={reviewForm.data.comment}
                                        onChange={(event) =>
                                            reviewForm.setData('comment', event.target.value)
                                        }
                                        rows={3}
                                        placeholder="Ceritakan fasilitas, kebersihan, atau pelayanan venue..."
                                        className="mt-3 w-full rounded-xl border-slate-300 text-sm shadow-sm focus:border-brand-500 focus:ring-brand-500"
                                    />
                                    {reviewForm.errors.comment && (
                                        <p className="mt-1 text-xs font-medium text-rose-600">
                                            {reviewForm.errors.comment}
                                        </p>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={reviewForm.processing}
                                        className="mt-3 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
                                    >
                                        {reviewForm.processing && (
                                            <LoaderCircle className="h-4 w-4 animate-spin" />
                                        )}
                                        Kirim Ulasan
                                    </button>
                                </form>
                            )}
                        </div>
                    )}
                </div>

                <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
                    {booking.status === 'confirmed' && (
                        <div className="rounded-2xl border border-brand-200 bg-brand-50 p-4">
                            <p className="flex items-center gap-2 text-sm font-bold text-brand-800">
                                <CheckCircle2 className="h-5 w-5" /> Booking terkonfirmasi
                            </p>
                            <p className="mt-1.5 text-xs leading-relaxed text-brand-700">
                                Tunjukkan halaman ini atau kode booking saat tiba di venue. Datang
                                10 menit lebih awal untuk persiapan.
                            </p>
                        </div>
                    )}

                    {booking.status === 'pending' && booking.payment_status === 'paid' && (
                        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                            <p className="flex items-center gap-2 text-sm font-bold text-amber-800">
                                <Info className="h-5 w-5" /> Menunggu konfirmasi mitra
                            </p>
                            <p className="mt-1.5 text-xs leading-relaxed text-amber-700">
                                Pembayaran sudah kami terima. Mitra akan mengonfirmasi booking Anda
                                maksimal 1x24 jam.
                            </p>
                        </div>
                    )}

                    {booking.status === 'completed' && (
                        <div className="rounded-2xl border border-slate-200 bg-slate-100 p-4">
                            <p className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                <CheckCircle2 className="h-5 w-5" /> Sesi selesai
                            </p>
                            <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
                                Terima kasih sudah bermain. Semoga sesi Anda menyenangkan!
                            </p>
                            {canReview && (
                                <a
                                    href="#review"
                                    className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-amber-600"
                                >
                                    <Star className="h-3.5 w-3.5" /> Beri Rating
                                </a>
                            )}
                        </div>
                    )}

                    {booking.status === 'cancelled' && (
                        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4">
                            <p className="flex items-center gap-2 text-sm font-bold text-rose-800">
                                <XCircle className="h-5 w-5" /> Booking dibatalkan
                            </p>
                            <p className="mt-1.5 text-xs leading-relaxed text-rose-700">
                                {booking.payment_status === 'refunded' ? (
                                    <>
                                        Pembayaran sebesar{' '}
                                        <span className="font-semibold">
                                            {formatCurrency(booking.total_price)}
                                        </span>{' '}
                                        telah dikembalikan ke metode pembayaran Anda
                                        {refundedAt
                                            ? ` pada ${formatDateWithDay(refundedAt)}`
                                            : ''}
                                        . Proses refund biasanya memakan 1–3 hari kerja.
                                    </>
                                ) : (
                                    'Booking ini sudah dibatalkan. Silakan buat booking baru jika ingin bermain.'
                                )}
                            </p>
                        </div>
                    )}

                    {canPay ? (
                        <form
                            onSubmit={submitPayment}
                            className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"
                        >
                            <div className="flex items-center gap-2">
                                <CreditCard className="h-5 w-5 text-brand-600" />
                                <h3 className="text-base font-bold text-slate-900">
                                    Selesaikan pembayaran
                                </h3>
                            </div>
                            <p className="mt-1 text-xs leading-relaxed text-slate-500">
                                Pilih metode pembayaran. Slot Anda terkunci setelah pembayaran
                                berhasil.
                            </p>

                            <div className="mt-4 space-y-2">
                                {PAYMENT_METHODS.map((method) => {
                                    const Icon = method.icon;
                                    const active =
                                        paymentForm.data.payment_method === method.value;

                                    return (
                                        <label
                                            key={method.value}
                                            className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition ${
                                                active
                                                    ? 'border-brand-600 bg-brand-50 ring-1 ring-brand-600'
                                                    : 'border-slate-200 hover:border-slate-300'
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name="payment_method"
                                                value={method.value}
                                                checked={active}
                                                onChange={() =>
                                                    paymentForm.setData(
                                                        'payment_method',
                                                        method.value,
                                                    )
                                                }
                                                className="sr-only"
                                            />
                                            <span
                                                className={`grid h-9 w-9 place-items-center rounded-lg ${
                                                    active
                                                        ? 'bg-brand-600 text-white'
                                                        : 'bg-slate-100 text-slate-500'
                                                }`}
                                            >
                                                <Icon className="h-4 w-4" />
                                            </span>
                                            <span className="min-w-0 flex-1">
                                                <span className="block text-sm font-semibold text-slate-900">
                                                    {method.label}
                                                </span>
                                                <span className="block text-[11px] text-slate-500">
                                                    {method.description}
                                                </span>
                                            </span>
                                            <span
                                                className={`grid h-4 w-4 place-items-center rounded-full border ${
                                                    active
                                                        ? 'border-brand-600 bg-brand-600'
                                                        : 'border-slate-300'
                                                }`}
                                            >
                                                {active && (
                                                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                                                )}
                                            </span>
                                        </label>
                                    );
                                })}
                            </div>

                            {paymentForm.errors.payment && (
                                <p className="mt-3 rounded-lg bg-rose-50 p-2.5 text-xs font-medium text-rose-700">
                                    {paymentForm.errors.payment}
                                </p>
                            )}

                            <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                                <span className="text-sm font-medium text-slate-600">
                                    Total pembayaran
                                </span>
                                <span className="text-lg font-extrabold text-slate-900">
                                    {formatCurrency(booking.total_price)}
                                </span>
                            </div>

                            <button
                                type="submit"
                                disabled={paymentForm.processing}
                                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {paymentForm.processing ? (
                                    <>
                                        <LoaderCircle className="h-4 w-4 animate-spin" />{' '}
                                        Memproses pembayaran...
                                    </>
                                ) : (
                                    <>
                                        <ShieldCheck className="h-4 w-4" /> Bayar{' '}
                                        {formatCurrency(booking.total_price)}
                                    </>
                                )}
                            </button>

                            <p className="mt-3 flex items-start gap-1.5 text-[11px] leading-relaxed text-slate-400">
                                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                                Mode demo: pembayaran disimulasikan dan langsung ditandai lunas.
                                Tidak ada transaksi uang sungguhan.
                            </p>
                        </form>
                    ) : (
                        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
                            <div className="flex items-center gap-2">
                                <ReceiptText className="h-5 w-5 text-brand-600" />
                                <h3 className="text-base font-bold text-slate-900">
                                    Status pembayaran
                                </h3>
                            </div>
                            <div className="mt-4 space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-500">Status</span>
                                    <span className="font-semibold text-slate-800">
                                        {payment.label}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-500">Total</span>
                                    <span className="font-semibold text-slate-800">
                                        {formatCurrency(booking.total_price)}
                                    </span>
                                </div>
                                {latestPayment && (
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-500">Metode</span>
                                        <span className="font-semibold text-slate-800">
                                            {paymentMethodLabel(latestPayment.payment_method)}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {booking.payment_status === 'refunded' ? (
                                <div className="mt-4 rounded-xl bg-slate-100 p-3.5 text-xs leading-relaxed text-slate-700">
                                    <p className="flex items-center gap-1.5 font-semibold">
                                        <RotateCcw className="h-4 w-4" /> Dana dikembalikan
                                    </p>
                                    <p className="mt-1 text-slate-600">
                                        Refund sebesar {formatCurrency(booking.total_price)} sudah
                                        diproses
                                        {refundedAt
                                            ? ` pada ${formatDateWithDay(refundedAt)}`
                                            : ''}
                                        . Dana masuk kembali ke metode pembayaran Anda dalam 1–3
                                        hari kerja.
                                    </p>
                                </div>
                            ) : (
                                <div className="mt-4 rounded-xl bg-brand-50 p-3.5 text-xs leading-relaxed text-brand-800">
                                    <p className="flex items-center gap-1.5 font-semibold">
                                        <ShieldCheck className="h-4 w-4" /> Pembayaran terlindungi
                                    </p>
                                    <p className="mt-1 text-brand-700">
                                        Simpan halaman ini sebagai bukti booking yang sah.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Butuh bantuan?
                        </p>
                        <p className="mt-1.5 text-sm text-slate-600">
                            Hubungi mitra pengelola venue untuk perubahan jadwal atau pertanyaan
                            lain.
                        </p>
                        {venue.phone && (
                            <a
                                href={`tel:${venue.phone}`}
                                className="mt-3 inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3.5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                            >
                                <Phone className="h-4 w-4 text-brand-600" /> {venue.phone}
                            </a>
                        )}
                    </div>

                    {canCancel && (
                        <button
                            type="button"
                            onClick={() => setCancelOpen(true)}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-rose-200 bg-white px-4 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
                        >
                            <XCircle className="h-4 w-4" /> Batalkan booking
                        </button>
                    )}
                </div>
            </div>

            <ConfirmModal
                show={cancelOpen}
                title="Batalkan booking ini?"
                description="Slot akan dilepas dan dapat dipesan orang lain. Jika sudah dibayar, dana akan diproses sebagai refund sesuai kebijakan mitra."
                confirmLabel="Ya, batalkan"
                onConfirm={cancelBooking}
                onClose={() => setCancelOpen(false)}
                processing={cancelling}
                danger
            />
        </DashboardLayout>
    );
}

function DetailRow({ icon: Icon, label, value }) {
    return (
        <div className="flex items-start gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-500">
                <Icon className="h-4 w-4" />
            </span>
            <div className="min-w-0">
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                    {label}
                </p>
                <p className="mt-0.5 text-sm font-semibold capitalize text-slate-800">{value}</p>
            </div>
        </div>
    );
}
