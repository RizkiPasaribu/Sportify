import VenueForm from '@/Components/VenueForm';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Link } from '@inertiajs/react';
import { ArrowLeft, Pencil } from 'lucide-react';

export default function Edit({ venue }) {
    return (
        <DashboardLayout title="Edit Venue">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <Link
                    href={route('owner.venues.index')}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-brand-700"
                >
                    <ArrowLeft className="h-4 w-4" /> Kembali ke venue saya
                </Link>
                <Link
                    href={route('owner.venues.fields.index', venue.id)}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                >
                    Kelola lapangan venue ini
                </Link>
            </div>

            <div className="mb-6 flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700">
                    <Pencil className="h-5 w-5" />
                </span>
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-slate-900">
                        Edit {venue.name}
                    </h1>
                    <p className="mt-1 text-sm text-slate-600">
                        Perbarui informasi venue, foto, dan kontak pengelola. Perubahan akan
                        langsung tampil di halaman publik.
                    </p>
                </div>
            </div>

            <VenueForm venue={venue} />
        </DashboardLayout>
    );
}
