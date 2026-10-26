import FieldForm from '@/Components/FieldForm';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Link } from '@inertiajs/react';
import { ArrowLeft, MapPin, PlusCircle } from 'lucide-react';

export default function Create({ venue, sportTypes = [] }) {
    return (
        <DashboardLayout title="Tambah Lapangan">
            <div className="mb-5">
                <Link
                    href={route('owner.venues.fields.index', venue.id)}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-brand-700"
                >
                    <ArrowLeft className="h-4 w-4" /> Kembali ke daftar lapangan
                </Link>
            </div>

            <div className="mb-6 flex items-start gap-4 rounded-2xl border border-brand-200 bg-brand-50/60 p-5">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-600 text-white">
                    <PlusCircle className="h-5 w-5" />
                </span>
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-slate-900">
                        Tambah lapangan baru
                    </h1>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-600">
                        <MapPin className="h-3.5 w-3.5" /> {venue.name} · {venue.city}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                        Lengkapi informasi lapangan, harga sewa, dan jam operasional. Slot booking
                        akan dibuat otomatis setiap jam.
                    </p>
                </div>
            </div>

            <FieldForm venue={venue} sportTypes={sportTypes} />
        </DashboardLayout>
    );
}
