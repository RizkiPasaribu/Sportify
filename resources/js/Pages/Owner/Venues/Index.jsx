import ConfirmModal from '@/Components/ConfirmModal';
import EmptyState from '@/Components/EmptyState';
import PageHeader from '@/Components/PageHeader';
import DashboardLayout from '@/Layouts/DashboardLayout';
import {
    formatCurrency,
    imageForVenue,
    venueMinPrice,
    venueRating,
    venueSports,
    getSport,
} from '@/lib/utils';
import { Link, router } from '@inertiajs/react';
import {
    Building2,
    CalendarCheck2,
    Eye,
    MapPin,
    Pencil,
    Plus,
    Star,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';

export default function Index({ venues = [] }) {
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const confirmDelete = () => {
        if (!deleteTarget) {
            return;
        }

        setDeleting(true);
        router.delete(route('owner.venues.destroy', deleteTarget.id), {
            preserveScroll: true,
            onFinish: () => {
                setDeleting(false);
                setDeleteTarget(null);
            },
        });
    };

    return (
        <DashboardLayout
            title="Venue Saya"
            header={
                <PageHeader
                    eyebrow="Manajemen Venue"
                    title="Venue Saya"
                    description="Kelola informasi venue, lapangan, dan jam operasional yang tampil di platform."
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
            {venues.length > 0 ? (
                <div className="grid auto-rows-fr gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {venues.map((venue) => {
                        const rating = venueRating(venue);

                        return (
                            <div
                                key={venue.id}
                                className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm"
                            >
                                <div className="relative aspect-[16/9] shrink-0 overflow-hidden bg-slate-100">
                                    <img
                                        src={imageForVenue(venue)}
                                        alt={venue.name}
                                        className="absolute inset-0 h-full w-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 to-transparent" />
                                    <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
                                        {venueSports(venue).slice(0, 2).map((sport) => (
                                            <span
                                                key={sport}
                                                className="rounded-full bg-white/95 px-2 py-0.5 text-[10px] font-semibold text-slate-700"
                                            >
                                                {getSport(sport).label}
                                            </span>
                                        ))}
                                    </div>
                                    {rating > 0 && (
                                        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-1 text-[10px] font-bold text-slate-800">
                                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                            {rating.toFixed(1)}
                                        </span>
                                    )}
                                </div>

                                <div className="flex flex-1 flex-col p-5">
                                    <h3 className="line-clamp-2 min-h-11 text-base font-bold leading-snug text-slate-900">
                                        {venue.name}
                                    </h3>
                                    <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                                        <MapPin className="h-3.5 w-3.5" /> {venue.city}
                                    </p>

                                    <div className="mt-3 grid grid-cols-3 gap-2 rounded-xl bg-slate-50 p-3 text-center">
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">
                                                {venue.fields_count}
                                            </p>
                                            <p className="text-[10px] text-slate-500">Lapangan</p>
                                        </div>
                                        <div className="border-x border-slate-200">
                                            <p className="text-sm font-bold text-slate-900">
                                                {venue.bookings_count}
                                            </p>
                                            <p className="text-[10px] text-slate-500">Booking</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">
                                                {venue.reviews_count}
                                            </p>
                                            <p className="text-[10px] text-slate-500">Ulasan</p>
                                        </div>
                                    </div>

                                    <div className="mt-auto">
                                        <p className="pt-3 text-xs text-slate-500">
                                            Mulai{' '}
                                            <span className="font-bold text-slate-800">
                                                {formatCurrency(venueMinPrice(venue))}
                                            </span>{' '}
                                            /jam
                                        </p>

                                        <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                                            <Link
                                                href={route('owner.venues.fields.index', venue.id)}
                                                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-brand-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-brand-700"
                                            >
                                                <CalendarCheck2 className="h-3.5 w-3.5" /> Kelola Lapangan
                                            </Link>
                                            <Link
                                                href={route('owner.venues.edit', venue.id)}
                                                className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
                                                aria-label="Edit venue"
                                            >
                                                <Pencil className="h-3.5 w-3.5" />
                                            </Link>
                                            <Link
                                                href={route('venues.show', venue.id)}
                                                className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
                                                aria-label="Lihat halaman publik"
                                            >
                                                <Eye className="h-3.5 w-3.5" />
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
                            </div>
                        );
                    })}
                </div>
            ) : (
                <EmptyState
                    icon={Building2}
                    title="Belum ada venue"
                    description="Tambahkan venue pertama Anda, lalu atur lapangan dan jam operasionalnya."
                    actionLabel="Tambah venue"
                    actionHref={route('owner.venues.create')}
                />
            )}

            <ConfirmModal
                show={Boolean(deleteTarget)}
                title="Hapus venue ini?"
                description={`${deleteTarget?.name ?? ''} beserta seluruh lapangan, jadwal, dan riwayat booking terkait akan dihapus permanen.`}
                confirmLabel="Ya, hapus venue"
                onConfirm={confirmDelete}
                onClose={() => setDeleteTarget(null)}
                processing={deleting}
                danger
            />
        </DashboardLayout>
    );
}
