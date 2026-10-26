import EmptyState from '@/Components/EmptyState';
import PageHeader from '@/Components/PageHeader';
import Pagination from '@/Components/Pagination';
import VenueCard from '@/Components/VenueCard';
import AppLayout from '@/Layouts/AppLayout';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { getSport } from '@/lib/utils';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    CalendarDays,
    ChevronRight,
    MapPin,
    RotateCcw,
    Search,
    SearchX,
    SlidersHorizontal,
} from 'lucide-react';
import { useState } from 'react';

export default function Index({ venues, filters = {}, cities = [], sports = [] }) {
    const { auth } = usePage().props;
    const isCustomer = auth?.user?.role === 'customer';
    const [values, setValues] = useState({
        q: filters.q ?? '',
        sport: filters.sport ?? '',
        city: filters.city ?? '',
        date: filters.date ?? '',
    });

    const update = (key, value) => setValues((current) => ({ ...current, [key]: value }));

    const submit = (event) => {
        event.preventDefault();

        const params = Object.fromEntries(
            Object.entries(values).filter(([, value]) => value !== '' && value !== null),
        );

        router.get(route('venues.index'), params, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const reset = () => {
        setValues({ q: '', sport: '', city: '', date: '' });
        router.get(route('venues.index'), {}, { preserveScroll: true, replace: true });
    };

    const hasFilters = Object.values(values).some((value) => value !== '');

    const results = (
        <>
            <form
                onSubmit={submit}
                className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5"
            >
                <div className="grid gap-3 lg:grid-cols-[1.4fr_1fr_1fr_1fr_auto]">
                    <FilterField icon={Search} label="Cari venue">
                        <input
                            type="text"
                            value={values.q}
                            onChange={(event) => update('q', event.target.value)}
                            placeholder="Nama venue atau alamat"
                            className="w-full border-0 bg-transparent p-0 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:ring-0"
                        />
                    </FilterField>

                    <FilterField icon={SlidersHorizontal} label="Olahraga">
                        <select
                            value={values.sport}
                            onChange={(event) => update('sport', event.target.value)}
                            className="w-full cursor-pointer border-0 bg-transparent p-0 text-sm font-medium text-slate-800 focus:ring-0"
                        >
                            <option value="">Semua</option>
                            {sports.map((sport) => (
                                <option key={sport} value={sport}>
                                    {getSport(sport).label}
                                </option>
                            ))}
                        </select>
                    </FilterField>

                    <FilterField icon={MapPin} label="Kota">
                        <select
                            value={values.city}
                            onChange={(event) => update('city', event.target.value)}
                            className="w-full cursor-pointer border-0 bg-transparent p-0 text-sm font-medium text-slate-800 focus:ring-0"
                        >
                            <option value="">Semua kota</option>
                            {cities.map((city) => (
                                <option key={city} value={city}>
                                    {city}
                                </option>
                            ))}
                        </select>
                    </FilterField>

                    <FilterField icon={CalendarDays} label="Tanggal main">
                        <input
                            type="date"
                            value={values.date}
                            min={new Date().toISOString().slice(0, 10)}
                            onChange={(event) => update('date', event.target.value)}
                            className="w-full border-0 bg-transparent p-0 text-sm font-medium text-slate-800 focus:ring-0"
                        />
                    </FilterField>

                    <div className="flex items-center gap-2">
                        <button
                            type="submit"
                            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 lg:flex-none"
                        >
                            <Search className="h-4 w-4" /> Terapkan
                        </button>
                        {hasFilters && (
                            <button
                                type="button"
                                onClick={reset}
                                className="grid h-11 w-11 place-items-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
                                aria-label="Reset filter"
                            >
                                <RotateCcw className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                </div>

                {hasFilters && (
                    <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
                        <span className="text-xs font-medium text-slate-400">Filter aktif:</span>
                        {values.q && <FilterChip label={`"${values.q}"`} />}
                        {values.sport && <FilterChip label={getSport(values.sport).label} />}
                        {values.city && <FilterChip label={values.city} />}
                        {values.date && <FilterChip label={values.date} />}
                    </div>
                )}
            </form>

            {venues.data.length > 0 ? (
                <>
                    <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {venues.data.map((venue) => (
                            <VenueCard key={venue.id} venue={venue} />
                        ))}
                    </div>
                    <Pagination paginator={venues} className="mt-8" />
                </>
            ) : (
                <div className="mt-7">
                    <EmptyState
                        icon={SearchX}
                        title="Belum ada venue yang cocok"
                        description="Coba ubah kata kunci, pilih olahraga lain, atau hapus filter tanggal untuk melihat lebih banyak pilihan."
                        actionLabel="Reset semua filter"
                        onAction={reset}
                    />
                </div>
            )}
        </>
    );

    if (isCustomer) {
        return (
            <DashboardLayout
                title="Cari Lapangan"
                header={
                    <PageHeader
                        eyebrow="Jelajahi Venue"
                        title="Temukan lapangan terbaik"
                        description="Bandingkan venue, cek ketersediaan, dan amankan jadwal bermain Anda. Semua dalam satu tempat."
                        action={
                            <span className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-slate-600 shadow-sm ring-1 ring-slate-200">
                                <MapPin className="h-4 w-4 text-brand-600" />
                                <span className="font-bold text-slate-900">{venues.total}</span> venue
                            </span>
                        }
                    />
                }
            >
                {results}
            </DashboardLayout>
        );
    }

    return (
        <AppLayout>
            <Head title="Cari Lapangan" />

            <section className="border-b border-slate-200 bg-white">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
                    <nav className="flex items-center gap-1.5 text-xs text-slate-400">
                        <Link href={route('home')} className="hover:text-brand-600">
                            Beranda
                        </Link>
                        <ChevronRight className="h-3.5 w-3.5" />
                        <span className="font-medium text-slate-600">Cari Lapangan</span>
                    </nav>

                    <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                                Temukan lapangan terbaik
                            </h1>
                            <p className="mt-1.5 max-w-2xl text-sm text-slate-500">
                                Bandingkan venue, cek ketersediaan, dan amankan jadwal bermain
                                Anda. Semua dalam satu tempat.
                            </p>
                        </div>
                        <p className="text-sm text-slate-500">
                            <span className="font-bold text-slate-900">{venues.total}</span> venue
                            ditemukan
                        </p>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{results}</section>
        </AppLayout>
    );
}

function FilterField({ icon: Icon, label, children }) {
    return (
        <label className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2.5 focus-within:border-brand-400 focus-within:bg-white focus-within:ring-1 focus-within:ring-brand-400">
            <Icon className="h-4 w-4 shrink-0 text-brand-600" />
            <span className="min-w-0 flex-1">
                <span className="block text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                    {label}
                </span>
                {children}
            </span>
        </label>
    );
}

function FilterChip({ label }) {
    return (
        <span className="inline-flex items-center rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700 ring-1 ring-inset ring-brand-600/20">
            {label}
        </span>
    );
}
