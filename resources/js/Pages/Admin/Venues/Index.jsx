import ConfirmModal from '@/Components/ConfirmModal';
import EmptyState from '@/Components/EmptyState';
import PageHeader from '@/Components/PageHeader';
import Pagination from '@/Components/Pagination';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { formatCurrency, imageForVenue, venueMinPrice } from '@/lib/utils';
import { Link, router } from '@inertiajs/react';
import {
    Building2,
    CalendarCheck2,
    Eye,
    Filter,
    MapPin,
    RotateCcw,
    Search,
    Star,
    Trash2,
    UserRound,
} from 'lucide-react';
import { useState } from 'react';

export default function Index({ venues, filters = {}, cities = [] }) {
    const [search, setSearch] = useState(filters.q ?? '');
    const [city, setCity] = useState(filters.city ?? '');
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const applyFilters = (event) => {
        event.preventDefault();

        router.get(
            route('admin.venues.index'),
            {
                q: search || undefined,
                city: city || undefined,
            },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const resetFilters = () => {
        setSearch('');
        setCity('');
        router.get(
            route('admin.venues.index'),
            {},
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const confirmDelete = () => {
        if (!deleteTarget) {
            return;
        }

        setDeleting(true);
        router.delete(route('admin.venues.destroy', deleteTarget.id), {
            preserveScroll: true,
            onFinish: () => {
                setDeleting(false);
                setDeleteTarget(null);
            },
        });
    };

    const hasFilters = Boolean(filters.q || filters.city);

    return (
        <DashboardLayout
            title="Kelola Venue"
            header={
                <PageHeader
                    eyebrow="Manajemen Venue"
                    title="Kelola Venue"
                    description="Pantau seluruh venue mitra, performa booking, dan moderasi konten platform."
                />
            }
        >
            <form
                onSubmit={applyFilters}
                className="grid gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_auto]"
            >
                <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Cari nama venue atau alamat..."
                        className="w-full rounded-xl border-slate-300 pl-9 text-sm shadow-sm focus:border-brand-500 focus:ring-brand-500"
                    />
                </div>

                <select
                    value={city}
                    onChange={(event) => setCity(event.target.value)}
                    className="w-full rounded-xl border-slate-300 text-sm shadow-sm focus:border-brand-500 focus:ring-brand-500"
                >
                    <option value="">Semua kota</option>
                    {cities.map((item) => (
                        <option key={item} value={item}>
                            {item}
                        </option>
                    ))}
                </select>

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

            {venues.data.length > 0 ? (
                <>
                    <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {venues.data.map((venue) => {
                            const rating = Number(venue.reviews_avg_rating ?? 0);

                            return (
                                <div
                                    key={venue.id}
                                    className="flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm"
                                >
                                    <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
                                        <img
                                            src={imageForVenue(venue)}
                                            alt={venue.name}
                                            className="absolute inset-0 h-full w-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-950/10 to-transparent" />
                                        {rating > 0 && (
                                            <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-1 text-[10px] font-bold text-slate-800">
                                                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                                {rating.toFixed(1)}
                                            </span>
                                        )}
                                        <div className="absolute bottom-3 left-3 right-3">
                                            <p className="text-sm font-bold text-white">
                                                {venue.name}
                                            </p>
                                            <p className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-200">
                                                <MapPin className="h-3 w-3" /> {venue.city}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex flex-1 flex-col p-5">
                                        <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2.5">
                                            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-100 text-brand-700">
                                                <UserRound className="h-4 w-4" />
                                            </span>
                                            <div className="min-w-0">
                                                <p className="truncate text-xs font-semibold text-slate-700">
                                                    {venue.owner?.name ?? 'Tanpa owner'}
                                                </p>
                                                <p className="truncate text-[10px] text-slate-400">
                                                    {venue.owner?.email}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-3 grid grid-cols-3 gap-2 rounded-xl border border-slate-100 p-3 text-center">
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">
                                                    {venue.fields_count}
                                                </p>
                                                <p className="text-[10px] text-slate-500">
                                                    Lapangan
                                                </p>
                                            </div>
                                            <div className="border-x border-slate-100">
                                                <p className="text-sm font-bold text-slate-900">
                                                    {venue.bookings_count}
                                                </p>
                                                <p className="text-[10px] text-slate-500">
                                                    Booking
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">
                                                    {venue.reviews_count}
                                                </p>
                                                <p className="text-[10px] text-slate-500">Ulasan</p>
                                            </div>
                                        </div>

                                        <p className="mt-3 text-xs text-slate-500">
                                            Mulai{' '}
                                            <span className="font-bold text-slate-800">
                                                {formatCurrency(venueMinPrice(venue))}
                                            </span>{' '}
                                            /jam
                                        </p>

                                        <div className="mt-auto flex gap-2 border-t border-slate-100 pt-4">
                                            <Link
                                                href={route('venues.show', venue.id)}
                                                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-brand-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-brand-700"
                                            >
                                                <Eye className="h-3.5 w-3.5" /> Lihat venue
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() => setDeleteTarget(venue)}
                                                className="grid h-8 w-8 place-items-center rounded-lg border border-rose-200 text-rose-500 transition hover:bg-rose-50"
                                                aria-label="Hapus venue"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <Pagination paginator={venues} className="mt-6" />
                </>
            ) : (
                <div className="mt-5">
                    <EmptyState
                        icon={Building2}
                        title={hasFilters ? 'Venue tidak ditemukan' : 'Belum ada venue'}
                        description={
                            hasFilters
                                ? 'Coba ubah kata kunci atau filter kota Anda.'
                                : 'Venue yang didaftarkan mitra akan tampil di sini.'
                        }
                        actionLabel={hasFilters ? 'Reset filter' : undefined}
                        onAction={hasFilters ? resetFilters : undefined}
                    />
                </div>
            )}

            <ConfirmModal
                show={Boolean(deleteTarget)}
                title="Hapus venue dari platform?"
                description={`${deleteTarget?.name ?? ''} beserta lapangan, booking, dan ulasannya akan dihapus permanen.`}
                confirmLabel="Ya, hapus venue"
                onConfirm={confirmDelete}
                onClose={() => setDeleteTarget(null)}
                processing={deleting}
                danger
            />
        </DashboardLayout>
    );
}
