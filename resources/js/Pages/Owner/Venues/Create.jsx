import VenueForm from '@/Components/VenueForm';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Link } from '@inertiajs/react';
import { ArrowLeft, Building2 } from 'lucide-react';

export default function Create() {
    return (
        <DashboardLayout title="Tambah Venue">
            <div className="mb-5">
                <Link
                    href={route('owner.venues.index')}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-brand-700"
                >
                    <ArrowLeft className="h-4 w-4" /> Kembali ke venue saya
                </Link>
            </div>

            <div className="mb-6 flex items-start gap-4 rounded-2xl border border-brand-200 bg-brand-50/60 p-5">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-600 text-white">
                    <Building2 className="h-5 w-5" />
                </span>
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-slate-900">
                        Tambah venue baru
                    </h1>
                    <p className="mt-1 text-sm text-slate-600">
                        Isi informasi dasar venue terlebih dahulu. Setelah tersimpan, Anda akan
                        diarahkan untuk menambahkan lapangan dan jam operasional.
                    </p>
                </div>
            </div>

            <VenueForm />
        </DashboardLayout>
    );
}
