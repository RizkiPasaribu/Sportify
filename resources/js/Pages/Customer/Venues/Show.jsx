import EmptyState from '@/Components/EmptyState';
import RatingStars from '@/Components/RatingStars';
import SlotPicker from '@/Components/SlotPicker';
import VenueCard from '@/Components/VenueCard';
import AppLayout from '@/Layouts/AppLayout';
import {
    DAY_NAMES,
    durationLabel,
    formatCurrency,
    formatDateShort,
    formatTime,
    getSport,
    imageForVenue,
    initials,
    venueRating,
} from '@/lib/utils';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import {
    BadgeCheck,
    CalendarDays,
    Car,
    ChevronRight,
    Clock3,
    Droplets,
    LoaderCircle,
    Lock,
    MapPin,
    MessageSquare,
    Phone,
    ShieldCheck,
    Sparkles,
    Star,
    Utensils,
    Wifi,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

const facilities = [
    { label: 'Parkir luas', icon: Car },
    { label: 'Toilet & shower', icon: Droplets },
    { label: 'Ruang tunggu', icon: Lock },
    { label: 'Kantin', icon: Utensils },
    { label: 'WiFi', icon: Wifi },
    { label: 'Keamanan 24 jam', icon: ShieldCheck },
];

export default function Show({
    venue,
    fields = [],
    reviews = [],
    ratingBreakdown = {},
    relatedVenues = [],
    reviewableBooking = null,
    selectedDate,
    dateOptions = [],
}) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const [selectedFieldId, setSelectedFieldId] = useState(fields[0]?.id ?? null);
    const [selectedStart, setSelectedStart] = useState(null);
    const [selectedEnd, setSelectedEnd] = useState(null);

    const selectedField = useMemo(
        () => fields.find((field) => field.id === selectedFieldId) ?? fields[0],
        [fields, selectedFieldId],
    );

    const form = useForm({
        booking_date: selectedDate,
        start_time: '',
        end_time: '',
        notes: '',
    });

    useEffect(() => {
        form.setData('booking_date', selectedDate);
        setSelectedStart(null);
        setSelectedEnd(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedDate]);

    useEffect(() => {
        setSelectedStart(null);
        setSelectedEnd(null);
    }, [selectedFieldId, selectedDate]);

    const hours = useMemo(() => {
        if (!selectedStart || !selectedEnd) {
            return 0;
        }

        const [startHour, startMinute] = selectedStart.split(':').map(Number);
        const [endHour, endMinute] = selectedEnd.split(':').map(Number);

        return (endHour * 60 + endMinute - (startHour * 60 + startMinute)) / 60;
    }, [selectedStart, selectedEnd]);

    const total = hours * Number(selectedField?.price_per_hour ?? 0);
    const gallery = useMemo(() => {
        const images = venue.images?.length ? venue.images : [imageForVenue(venue)];
        const fallback = '/images/venues/futsal-2.svg';

        return [images[0], images[1] ?? fallback, images[2] ?? '/images/venues/badminton.svg'];
    }, [venue]);

    const changeDate = (date) => {
        router.get(
            route('venues.show', venue.id),
            { date },
            {
                preserveState: true,
                preserveScroll: true,
                only: ['fields', 'selectedDate', 'dateOptions'],
            },
        );
    };

    const submit = (event) => {
        event.preventDefault();

        form.transform((data) => ({
            ...data,
            booking_date: selectedDate,
            start_time: selectedStart,
            end_time: selectedEnd,
        }));

        form.post(route('customer.bookings.store', selectedField.id), {
            preserveScroll: true,
        });
    };

    const rating = venueRating(venue);
    const reviewCount = venue.reviews_count ?? reviews.length;

    return (
        <AppLayout>
            <Head title={venue.name} />

            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <nav className="flex flex-wrap items-center gap-1.5 text-xs text-slate-400">
                    <Link href={route('home')} className="hover:text-brand-600">
                        Beranda
                    </Link>
                    <ChevronRight className="h-3.5 w-3.5" />
                    <Link href={route('venues.index')} className="hover:text-brand-600">
                        Lapangan
                    </Link>
                    <ChevronRight className="h-3.5 w-3.5" />
                    <span className="font-medium text-slate-600">{venue.name}</span>
                </nav>

                <div className="mt-4 grid gap-3 lg:grid-cols-[2fr_1fr]">
                    <div className="relative overflow-hidden rounded-2xl bg-slate-100">
                        <img
                            src={gallery[0]}
                            alt={venue.name}
                            className="aspect-[16/10] h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/35 to-transparent" />
                        <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                            {venue.fields?.map((field) => {
                                const meta = getSport(field.sport_type);

                                return (
                                    <span
                                        key={field.id}
                                        className="rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur"
                                    >
                                        {meta.label}
                                    </span>
                                );
                            })}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
                        {gallery.slice(1, 3).map((image, index) => (
                            <div key={`${image}-${index}`} className="overflow-hidden rounded-2xl bg-slate-100">
                                <img
                                    src={image}
                                    alt={`${venue.name} ${index + 2}`}
                                    className="h-full w-full object-cover lg:aspect-[16/8]"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-8 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
                    <div>
                        <div className="flex flex-wrap items-start justify-between gap-4">
                            <div>
                                <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                                    {venue.name}
                                </h1>
                                <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
                                    <MapPin className="h-4 w-4 text-slate-400" />
                                    {venue.address}
                                    {venue.city ? `, ${venue.city}` : ''}
                                </p>
                                <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                                    <span className="inline-flex items-center gap-1.5 font-semibold text-slate-800">
                                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                        {rating > 0 ? rating.toFixed(1) : 'Baru'}
                                    </span>
                                    <span className="text-slate-400">•</span>
                                    <span className="text-slate-500">{reviewCount} ulasan</span>
                                    <span className="text-slate-400">•</span>
                                    <span className="inline-flex items-center gap-1.5 text-brand-700">
                                        <BadgeCheck className="h-4 w-4" /> Mitra terverifikasi
                                    </span>
                                </div>
                            </div>

                            {venue.phone && (
                                <a
                                    href={`tel:${venue.phone}`}
                                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                                >
                                    <Phone className="h-4 w-4 text-brand-600" /> Hubungi venue
                                </a>
                            )}
                        </div>

                        <div className="mt-6 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
                            <h2 className="text-base font-bold text-slate-900">Tentang venue</h2>
                            <p className="mt-2 text-sm leading-relaxed text-slate-600">
                                {venue.description ??
                                    'Venue olahraga dengan fasilitas lengkap dan jadwal yang fleksibel.'}
                            </p>

                            <h3 className="mt-6 text-sm font-bold text-slate-900">Fasilitas</h3>
                            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                                {facilities.map((facility) => {
                                    const Icon = facility.icon;

                                    return (
                                        <div
                                            key={facility.label}
                                            className="flex items-center gap-2.5 rounded-xl bg-slate-50 px-3 py-2.5 text-xs font-medium text-slate-600"
                                        >
                                            <Icon className="h-4 w-4 shrink-0 text-brand-600" />
                                            {facility.label}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="mt-5 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <h2 className="text-base font-bold text-slate-900">
                                    Jam operasional
                                </h2>
                                <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                                    <Clock3 className="h-4 w-4" /> Waktu lokal
                                </span>
                            </div>
                            <p className="mt-1.5 text-xs text-slate-500">
                                Jadwal dapat berbeda tiap lapangan. Pilih lapangan di panel booking
                                untuk melihat jam operasionalnya.
                            </p>

                            <div className="mt-4 grid gap-2 sm:grid-cols-2">
                                {DAY_NAMES.map((day, index) => {
                                    const operatingHour = selectedField?.operating_hours?.find(
                                        (hour) => Number(hour.day_of_week) === index,
                                    );

                                    return (
                                        <div
                                            key={day}
                                            className="flex items-center justify-between rounded-xl border border-slate-100 px-3.5 py-2.5 text-sm"
                                        >
                                            <span className="font-medium text-slate-600">{day}</span>
                                            <span
                                                className={
                                                    operatingHour && !operatingHour.is_closed
                                                        ? 'font-semibold text-slate-800'
                                                        : 'text-slate-400'
                                                }
                                            >
                                                {operatingHour && !operatingHour.is_closed
                                                    ? `${formatTime(operatingHour.open_time)} - ${formatTime(operatingHour.close_time)}`
                                                    : 'Tutup'}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="mt-5 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <h2 className="text-base font-bold text-slate-900">
                                    Ulasan pengguna
                                </h2>
                                <div className="flex items-center gap-3">
                                    {reviewableBooking && (
                                        <Link
                                            href={`${route(
                                                'customer.bookings.show',
                                                reviewableBooking.id,
                                            )}#review`}
                                            className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-amber-600"
                                        >
                                            <Star className="h-3.5 w-3.5" /> Beri Rating
                                        </Link>
                                    )}
                                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-slate-800">
                                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                        {rating > 0 ? rating.toFixed(1) : '-'} / 5
                                    </span>
                                </div>
                            </div>

                            <div className="mt-5 grid gap-6 sm:grid-cols-[auto_1fr]">
                                <div className="rounded-2xl bg-slate-50 p-5 text-center">
                                    <p className="text-4xl font-extrabold tracking-tight text-slate-900">
                                        {rating > 0 ? rating.toFixed(1) : '-'}
                                    </p>
                                    <RatingStars rating={rating} className="mt-2 justify-center" />
                                    <p className="mt-1.5 text-xs text-slate-500">
                                        {reviewCount} ulasan
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    {[5, 4, 3, 2, 1].map((star) => {
                                        const count = Number(ratingBreakdown?.[star] ?? 0);
                                        const percentage = reviewCount > 0 ? (count / reviewCount) * 100 : 0;

                                        return (
                                            <div key={star} className="flex items-center gap-3 text-xs">
                                                <span className="w-8 text-slate-500">{star} ★</span>
                                                <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                                                    <div
                                                        className="h-full rounded-full bg-amber-400"
                                                        style={{ width: `${percentage}%` }}
                                                    />
                                                </div>
                                                <span className="w-6 text-right text-slate-400">
                                                    {count}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="mt-6 space-y-4">
                                {reviews.length > 0 ? (
                                    reviews.map((review) => (
                                        <div
                                            key={review.id}
                                            className="border-t border-slate-100 pt-4 first:border-0 first:pt-0"
                                        >
                                            <div className="flex items-start gap-3">
                                                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-100 text-xs font-bold text-brand-700">
                                                    {initials(review.user?.name ?? 'Pengguna')}
                                                </span>
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                                        <p className="text-sm font-semibold text-slate-900">
                                                            {review.user?.name ?? 'Pengguna Sportify'}
                                                        </p>
                                                        <span className="text-xs text-slate-400">
                                                            {formatDateShort(review.created_at)}
                                                        </span>
                                                    </div>
                                                    <RatingStars rating={review.rating} className="mt-1" />
                                                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                                                        {review.comment}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <EmptyState
                                        icon={MessageSquare}
                                        title="Belum ada ulasan"
                                        description="Jadilah yang pertama memberikan ulasan setelah bermain di venue ini."
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="lg:sticky lg:top-24 lg:self-start">
                        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-lg shadow-slate-900/5">
                            <div className="flex items-end justify-between gap-3">
                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                        Harga mulai dari
                                    </p>
                                    <p className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900">
                                        {formatCurrency(selectedField?.price_per_hour ?? 0)}
                                        <span className="text-sm font-medium text-slate-400"> /jam</span>
                                    </p>
                                </div>
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700 ring-1 ring-inset ring-brand-600/20">
                                    <Sparkles className="h-3.5 w-3.5" /> Real-time
                                </span>
                            </div>

                            <div className="mt-5">
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                    Pilih lapangan
                                </p>
                                <div className="mt-2 space-y-1.5">
                                    {fields.map((field) => {
                                        const meta = getSport(field.sport_type);
                                        const Icon = meta.icon;
                                        const active = field.id === selectedField?.id;

                                        return (
                                            <button
                                                key={field.id}
                                                type="button"
                                                onClick={() => setSelectedFieldId(field.id)}
                                                className={`flex w-full items-center gap-3 rounded-xl border px-3.5 py-3 text-left transition ${
                                                    active
                                                        ? 'border-brand-600 bg-brand-50 ring-1 ring-brand-600'
                                                        : 'border-slate-200 bg-white hover:border-slate-300'
                                                }`}
                                            >
                                                <span
                                                    className={`grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br ${meta.gradient} text-white`}
                                                >
                                                    <Icon className="h-4 w-4" />
                                                </span>
                                                <span className="min-w-0 flex-1">
                                                    <span className="block truncate text-sm font-semibold text-slate-900">
                                                        {field.name}
                                                    </span>
                                                    <span className="text-xs text-slate-500">
                                                        {meta.label} ·{' '}
                                                        {formatCurrency(field.price_per_hour)}/jam
                                                    </span>
                                                </span>
                                                {active && (
                                                    <span className="h-2 w-2 rounded-full bg-brand-600" />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="mt-5">
                                <div className="flex items-center justify-between">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                        Tanggal main
                                    </p>
                                    <CalendarDays className="h-4 w-4 text-slate-400" />
                                </div>
                                <div className="mt-2 flex gap-1.5 overflow-x-auto pb-1">
                                    {dateOptions.map((option) => (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() => changeDate(option.value)}
                                            className={`shrink-0 rounded-xl border px-3 py-2 text-center transition ${
                                                option.value === selectedDate
                                                    ? 'border-brand-600 bg-brand-600 text-white'
                                                    : 'border-slate-200 bg-white text-slate-600 hover:border-brand-300'
                                            }`}
                                        >
                                            <span className="block text-[10px] font-medium uppercase">
                                                {option.label.split(',')[0]}
                                            </span>
                                            <span className="block text-sm font-bold">
                                                {option.value.slice(8, 10)}
                                            </span>
                                            <span className="block text-[10px]">
                                                {option.label.split(',')[1]?.trim().split(' ')[1]}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-5">
                                <div className="flex items-center justify-between">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                        Slot tersedia
                                    </p>
                                    <span className="text-[11px] text-slate-400">
                                        {selectedField?.availability?.is_open
                                            ? `${formatTime(selectedField.availability.open_time)} - ${formatTime(selectedField.availability.close_time)}`
                                            : 'Tutup'}
                                    </span>
                                </div>

                                <div className="mt-2">
                                    {selectedField?.availability?.is_open ? (
                                        selectedField.availability.slots.length > 0 ? (
                                            <SlotPicker
                                                slots={selectedField.availability.slots}
                                                start={selectedStart}
                                                end={selectedEnd}
                                                price={Number(selectedField.price_per_hour)}
                                                onChange={(start, end) => {
                                                    setSelectedStart(start);
                                                    setSelectedEnd(end);
                                                }}
                                            />
                                        ) : (
                                            <p className="rounded-xl bg-slate-50 p-3 text-xs text-slate-500">
                                                Tidak ada slot untuk tanggal ini.
                                            </p>
                                        )
                                    ) : (
                                        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-xs leading-relaxed text-amber-800">
                                            Lapangan tutup pada hari ini. Silakan pilih tanggal lain.
                                        </div>
                                    )}
                                </div>
                            </div>

                            {selectedStart && selectedEnd && (
                                <div className="mt-4 rounded-xl bg-slate-50 p-4">
                                    <div className="flex items-center justify-between text-xs text-slate-500">
                                        <span>
                                            {formatTime(selectedStart)} - {formatTime(selectedEnd)}
                                        </span>
                                        <span>{durationLabel(selectedStart, selectedEnd)}</span>
                                    </div>
                                    <div className="mt-2 flex items-center justify-between">
                                        <span className="text-sm font-semibold text-slate-700">
                                            Total{hours > 1 ? ` (${hours} jam)` : ''}
                                        </span>
                                        <span className="text-lg font-extrabold text-slate-900">
                                            {formatCurrency(total)}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {user?.role === 'customer' ? (
                                <form onSubmit={submit} className="mt-4">
                                    <label className="block">
                                        <span className="text-xs font-semibold text-slate-600">
                                            Catatan (opsional)
                                        </span>
                                        <textarea
                                            value={form.data.notes}
                                            onChange={(event) =>
                                                form.setData('notes', event.target.value)
                                            }
                                            rows={2}
                                            placeholder="Contoh: butuh bola tambahan"
                                            className="mt-1.5 w-full rounded-xl border-slate-300 text-sm shadow-sm focus:border-brand-500 focus:ring-brand-500"
                                        />
                                    </label>

                                    {form.errors.booking_date && (
                                        <p className="mt-1.5 text-xs font-medium text-rose-600">
                                            {form.errors.booking_date}
                                        </p>
                                    )}
                                    {form.errors.start_time && (
                                        <p className="mt-1.5 text-xs font-medium text-rose-600">
                                            {form.errors.start_time}
                                        </p>
                                    )}
                                    {form.errors.end_time && (
                                        <p className="mt-1.5 text-xs font-medium text-rose-600">
                                            {form.errors.end_time}
                                        </p>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={!selectedStart || !selectedEnd || form.processing}
                                        className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-sm shadow-brand-600/20 transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
                                    >
                                        {form.processing ? (
                                            <>
                                                <LoaderCircle className="h-4 w-4 animate-spin" />{' '}
                                                Memproses...
                                            </>
                                        ) : (
                                            'Pesan Sekarang'
                                        )}
                                    </button>
                                </form>
                            ) : user ? (
                                <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-xs leading-relaxed text-amber-800">
                                    Booking hanya dapat dilakukan menggunakan akun Customer. Anda
                                    sedang masuk sebagai {user.role_label}.
                                </div>
                            ) : (
                                <Link
                                    href={route('login')}
                                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
                                >
                                    Masuk untuk memesan
                                </Link>
                            )}

                            <div className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-[11px] text-slate-500">
                                <p className="flex items-center gap-2">
                                    <ShieldCheck className="h-3.5 w-3.5 text-brand-600" />
                                    Pembayaran aman & terverifikasi
                                </p>
                                <p className="flex items-center gap-2">
                                    <Clock3 className="h-3.5 w-3.5 text-brand-600" />
                                    Konfirmasi mitra maksimal 1x24 jam
                                </p>
                                <p className="flex items-center gap-2">
                                    <BadgeCheck className="h-3.5 w-3.5 text-brand-600" />
                                    Slot terkunci setelah pembayaran
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                Dikelola oleh
                            </p>
                            <div className="mt-2 flex items-center gap-3">
                                <span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-sm font-bold text-slate-600">
                                    {initials(venue.owner?.name ?? 'Mitra')}
                                </span>
                                <div>
                                    <p className="text-sm font-semibold text-slate-900">
                                        {venue.owner?.name ?? 'Mitra Sportify'}
                                    </p>
                                    <p className="text-xs text-slate-500">Mitra terverifikasi</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {relatedVenues.length > 0 && (
                    <section className="mt-14">
                        <div className="flex items-end justify-between">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">
                                    Di sekitar {venue.city}
                                </p>
                                <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900">
                                    Venue lain yang mungkin Anda suka
                                </h2>
                            </div>
                            <Link
                                href={route('venues.index', { city: venue.city })}
                                className="hidden items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700 sm:inline-flex"
                            >
                                Lihat semua <ChevronRight className="h-4 w-4" />
                            </Link>
                        </div>
                        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {relatedVenues.map((related) => (
                                <VenueCard key={related.id} venue={related} />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </AppLayout>
    );
}
