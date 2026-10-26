import FieldForm from '@/Components/FieldForm';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { formatCurrency, getSport } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { ArrowLeft, CalendarCheck2, MapPin, Pencil } from 'lucide-react';

export default function Edit({ venue, field, sportTypes = [] }) {
    const sport = getSport(field.sport_type);
    const SportIcon = sport.icon;

    return (
        <DashboardLayout title="Edit Lapangan">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <Link
                    href={route('owner.venues.fields.index', venue.id)}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-brand-700"
                >
                    <ArrowLeft className="h-4 w-4" /> Kembali ke daftar lapangan
                </Link>
                <Link
                    href={route('venues.show', venue.id)}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                >
                    Lihat halaman publik
                </Link>
            </div>

            <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center">
                <span
                    className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${sport.gradient} text-white`}
                >
                    <SportIcon className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-brand-600">
                        <Pencil className="h-3.5 w-3.5" /> Edit lapangan
                    </p>
                    <h1 className="mt-1 text-xl font-bold tracking-tight text-slate-900">
                        {field.name}
                    </h1>
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                        <span className="inline-flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5" /> {venue.name}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                            <CalendarCheck2 className="h-3.5 w-3.5" /> {sport.label}
                        </span>
                        <span className="font-semibold text-slate-700">
                            {formatCurrency(field.price_per_hour)} / jam
                        </span>
                    </div>
                </div>
            </div>

            <FieldForm venue={venue} field={field} sportTypes={sportTypes} />
        </DashboardLayout>
    );
}
