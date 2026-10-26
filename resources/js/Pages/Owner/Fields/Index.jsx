import ConfirmModal from '@/Components/ConfirmModal';
import EmptyState from '@/Components/EmptyState';
import PageHeader from '@/Components/PageHeader';
import DashboardLayout from '@/Layouts/DashboardLayout';
import {
    formatCurrency,
    formatTime,
    getSport,
    imageForVenue,
} from '@/lib/utils';
import { Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    CalendarCheck2,
    CalendarDays,
    Clock3,
    MapPin,
    Pencil,
    Plus,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';

function hoursSummary(hours = []) {
    const openDays = hours.filter((hour) => !hour.is_closed);

    if (openDays.length === 0) {
        return 'Tutup sementara';
    }

    const unique = [...new Set(openDays.map((hour) => `${formatTime(hour.open_time)} - ${formatTime(hour.close_time)}`))];

    if (unique.length === 1 && openDays.length === 7) {
        return `Setiap hari ${unique[0]}`;
    }

    if (unique.length === 1) {
        return `${openDays.length} hari aktif · ${unique[0]}`;
    }

    return `${openDays.length} hari aktif · jam bervariasi`;
}

export default function Index({ venue, fields = [] }) {
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const confirmDelete = () => {
        if (!deleteTarget) {
            return;
        }

        setDeleting(true);
        router.delete(route('owner.venues.fields.destroy', [venue.id, deleteTarget.id]), {
            preserveScroll: true,
            onFinish: () => {
                setDeleting(false);
                setDeleteTarget(null);
            },
        });
    };

    return (
        <DashboardLayout
            title="Kelola Lapangan"
            header={
                <PageHeader
                    eyebrow="Manajemen Lapangan"
                    title={venue.name}
                    description="Atur lapangan, harga sewa, status ketersediaan, dan jam operasional."
                    action={
                        <Link
                            href={route('owner.venues.fields.create', venue.id)}
                            className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
                        >
                            <Plus className="h-4 w-4" /> Tambah Lapangan
                        </Link>
                    }
                />
            }
        >
            <div className="mb-5">
                <Link
                    href={route('owner.venues.index')}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-brand-700"
                >
                    <ArrowLeft className="h-4 w-4" /> Kembali ke venue saya
                </Link>
            </div>

            <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
                <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:p-5">
                    <img
                        src={imageForVenue(venue)}
                        alt={venue.name}
                        className="h-32 w-full rounded-xl object-cover sm:h-20 sm:w-28"
                    />
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-slate-900">{venue.name}</p>
                        <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                            <MapPin className="h-3.5 w-3.5" /> {venue.address}
                        </p>
                        <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                            <CalendarCheck2 className="h-3.5 w-3.5" /> {fields.length} lapangan
                            terdaftar
                        </p>
                    </div>
                    <Link
                        href={route('venues.show', venue.id)}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3.5 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                    >
                        Lihat halaman publik
                    </Link>
                </div>
            </div>

            {fields.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                    {fields.map((field) => {
                        const meta = getSport(field.sport_type);
                        const Icon = meta.icon;

                        return (
                            <div
                                key={field.id}
                                className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-start gap-3">
                                        <span
                                            className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${meta.gradient} text-white`}
                                        >
                                            <Icon className="h-5 w-5" />
                                        </span>
                                        <div>
                                            <h3 className="text-sm font-bold text-slate-900">
                                                {field.name}
                                            </h3>
                                            <p className="mt-0.5 text-xs text-slate-500">
                                                {meta.label}
                                            </p>
                                        </div>
                                    </div>
                                    <span
                                        className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ring-1 ring-inset ${
                                            field.is_active
                                                ? 'bg-brand-50 text-brand-700 ring-brand-600/20'
                                                : 'bg-slate-100 text-slate-500 ring-slate-400/20'
                                        }`}
                                    >
                                        {field.is_active ? 'Aktif' : 'Nonaktif'}
                                    </span>
                                </div>

                                <div className="mt-4 grid grid-cols-2 gap-3">
                                    <div className="rounded-xl bg-slate-50 p-3">
                                        <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                                            Harga / jam
                                        </p>
                                        <p className="mt-0.5 text-sm font-bold text-slate-900">
                                            {formatCurrency(field.price_per_hour)}
                                        </p>
                                    </div>
                                    <div className="rounded-xl bg-slate-50 p-3">
                                        <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                                            Total booking
                                        </p>
                                        <p className="mt-0.5 text-sm font-bold text-slate-900">
                                            {field.bookings_count}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-3 flex items-start gap-2 rounded-xl border border-slate-100 px-3 py-2.5 text-xs text-slate-500">
                                    <Clock3 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-600" />
                                    {hoursSummary(field.operating_hours)}
                                </div>

                                <div className="mt-4 flex gap-2 border-t border-slate-100 pt-4">
                                    <Link
                                        href={route('owner.venues.fields.edit', [
                                            venue.id,
                                            field.id,
                                        ])}
                                        className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                                    >
                                        <Pencil className="h-3.5 w-3.5" /> Edit lapangan
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => setDeleteTarget(field)}
                                        className="grid h-8 w-8 place-items-center rounded-lg border border-rose-200 text-rose-500 transition hover:bg-rose-50"
                                        aria-label="Hapus lapangan"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <EmptyState
                    icon={CalendarDays}
                    title="Belum ada lapangan"
                    description="Tambahkan lapangan pertama di venue ini beserta harga dan jam operasionalnya."
                    actionLabel="Tambah lapangan"
                    actionHref={route('owner.venues.fields.create', venue.id)}
                />
            )}

            <ConfirmModal
                show={Boolean(deleteTarget)}
                title="Hapus lapangan ini?"
                description={`${deleteTarget?.name ?? ''} beserta jadwal operasional dan riwayat booking-nya akan dihapus permanen.`}
                confirmLabel="Ya, hapus lapangan"
                onConfirm={confirmDelete}
                onClose={() => setDeleteTarget(null)}
                processing={deleting}
                danger
            />
        </DashboardLayout>
    );
}
