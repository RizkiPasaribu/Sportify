import SearchBar from '@/Components/SearchBar';
import VenueCard from '@/Components/VenueCard';
import AppLayout from '@/Layouts/AppLayout';
import { getSport, venueRating } from '@/lib/utils';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    BadgeCheck,
    CalendarCheck2,
    CheckCircle2,
    Clock3,
    LayoutDashboard,
    MapPin,
    Search,
    ShieldCheck,
    Sparkles,
    Star,
    TrendingUp,
    Users,
    Wallet,
} from 'lucide-react';

const steps = [
    {
        icon: Search,
        title: 'Cari lapangan',
        description: 'Filter berdasarkan kota, jenis olahraga, dan tanggal bermain.',
    },
    {
        icon: CalendarCheck2,
        title: 'Pilih slot waktu',
        description: 'Lihat ketersediaan real-time dan pilih jam yang paling pas.',
    },
    {
        icon: BadgeCheck,
        title: 'Bayar & main',
        description: 'Selesaikan pembayaran, tunggu konfirmasi mitra, lalu datang dan main.',
    },
];

export default function Welcome({ venues = [], sports = [], stats = {} }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const featured = venues.slice(0, 6);

    return (
        <AppLayout>
            <Head title="Booking Lapangan Olahraga" />

            <section className="relative overflow-hidden bg-brand-950">
                <img
                    src="/images/venues/futsal-2.svg"
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-brand-950 via-brand-950/85 to-brand-900/60" />
                <div
                    className="absolute inset-0 opacity-[0.07]"
                    style={{
                        backgroundImage:
                            'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
                        backgroundSize: '56px 56px',
                    }}
                />

                <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-14 sm:px-6 sm:pt-20 lg:px-8 lg:pb-24">
                    <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
                        <div>
                            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-brand-100 ring-1 ring-white/20 backdrop-blur">
                                <Sparkles className="h-3.5 w-3.5" />
                                Platform booking lapangan #1
                            </span>

                            <h1 className="mt-5 max-w-2xl text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-[3.4rem]">
                                Main lebih sering,
                                <br />
                                booking lapangan{' '}
                                <span className="bg-gradient-to-r from-brand-300 to-emerald-200 bg-clip-text text-transparent">
                                    lebih gampang.
                                </span>
                            </h1>

                            <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-300">
                                Temukan lapangan futsal, badminton, tenis, dan basket terbaik di
                                kotamu. Cek jadwal real-time, pilih slot, dan bayar dalam satu
                                alur yang mulus.
                            </p>

                            <div className="mt-8">
                                <SearchBar sports={sports} />
                            </div>

                            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
                                <Stat value={stats.venues ?? 0} label="Venue terdaftar" />
                                <Stat value={stats.fields ?? 0} label="Lapangan aktif" />
                                <Stat value={stats.bookings ?? 0} label="Booking diproses" />
                            </div>
                        </div>

                        <div className="relative hidden lg:block">
                            <div className="absolute -inset-6 rounded-[2.5rem] bg-brand-400/10 blur-2xl" />
                            <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-white/10 p-3 shadow-2xl backdrop-blur">
                                <div className="overflow-hidden rounded-2xl bg-white">
                                    <div className="relative aspect-[4/3]">
                                        <img
                                            src="/images/venues/futsal.svg"
                                            alt="Sportify Arena Kemang"
                                            className="h-full w-full object-cover"
                                        />
                                        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold text-brand-700 shadow-sm">
                                            Tersedia malam ini
                                        </span>
                                    </div>
                                    <div className="p-5">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">
                                                    Sportify Arena Kemang
                                                </p>
                                                <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                                                    <MapPin className="h-3.5 w-3.5" /> Jakarta Selatan
                                                </p>
                                            </div>
                                            <span className="inline-flex items-center gap-1 rounded-lg bg-amber-50 px-2 py-1 text-xs font-bold text-amber-700">
                                                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                                4.9
                                            </span>
                                        </div>
                                        <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 px-3.5 py-3">
                                            <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                                                <Clock3 className="h-4 w-4 text-brand-600" />
                                                19.00 – 21.00
                                            </div>
                                            <p className="text-sm font-bold text-slate-900">
                                                Rp 300.000
                                            </p>
                                        </div>
                                        <div className="mt-4 grid grid-cols-3 gap-1.5">
                                            {['18.00', '19.00', '20.00'].map((time, index) => (
                                                <span
                                                    key={time}
                                                    className={`rounded-lg py-1.5 text-center text-[11px] font-semibold ${
                                                        index === 1
                                                            ? 'bg-brand-600 text-white'
                                                            : 'bg-slate-100 text-slate-500'
                                                    }`}
                                                >
                                                    {time}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute -bottom-6 -left-8 flex items-center gap-3 rounded-2xl border border-white/20 bg-white p-4 shadow-xl">
                                <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-100 text-brand-700">
                                    <ShieldCheck className="h-5 w-5" />
                                </span>
                                <div>
                                    <p className="text-xs font-bold text-slate-900">
                                        Pembayaran aman
                                    </p>
                                    <p className="text-[11px] text-slate-500">
                                        Konfirmasi mitra terverifikasi
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative border-t border-white/10 bg-brand-950/60">
                    <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 text-xs text-slate-400 sm:px-6 lg:px-8">
                        <span className="inline-flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4 text-brand-400" /> Pembayaran
                            terenkripsi
                        </span>
                        <span className="inline-flex items-center gap-2">
                            <Clock3 className="h-4 w-4 text-brand-400" /> Konfirmasi cepat
                        </span>
                        <span className="inline-flex items-center gap-2">
                            <Wallet className="h-4 w-4 text-brand-400" /> Berbagai metode
                            pembayaran
                        </span>
                        <span className="inline-flex items-center gap-2">
                            <Star className="h-4 w-4 text-brand-400" /> Mitra terkurasi
                        </span>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">
                            Pilih olahraga favoritmu
                        </p>
                        <h2 className="mt-1.5 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                            Mau main apa hari ini?
                        </h2>
                    </div>
                    <Link
                        href={route('venues.index')}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700"
                    >
                        Lihat semua lapangan <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>

                <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                    {sports.map((sport) => {
                        const meta = getSport(sport);
                        const Icon = meta.icon;

                        return (
                            <Link
                                key={sport}
                                href={route('venues.index', { sport })}
                                className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-lg"
                            >
                                <div
                                    className={`absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br ${meta.gradient} opacity-10 transition group-hover:scale-125`}
                                />
                                <span
                                    className={`grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${meta.gradient} text-white shadow-sm`}
                                >
                                    <Icon className="h-5 w-5" />
                                </span>
                                <p className="mt-4 text-sm font-bold text-slate-900">
                                    {meta.label}
                                </p>
                                <p className="mt-0.5 text-xs text-slate-500">
                                    Cari lapangan terdekat
                                </p>
                            </Link>
                        );
                    })}
                </div>
            </section>

            <section className="bg-white py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">
                                Rekomendasi untukmu
                            </p>
                            <h2 className="mt-1.5 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                                Venue pilihan di Sportify
                            </h2>
                            <p className="mt-2 max-w-xl text-sm text-slate-500">
                                Fasilitas terbaik, harga transparan, dan jadwal yang selalu
                                diperbarui oleh mitra.
                            </p>
                        </div>
                        <Link
                            href={route('venues.index')}
                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700"
                        >
                            Jelajahi semua <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>

                    <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {featured.map((venue) => (
                            <VenueCard key={venue.id} venue={venue} />
                        ))}
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="text-center">
                    <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">
                        Semudah itu
                    </p>
                    <h2 className="mt-1.5 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                        Tiga langkah menuju lapangan
                    </h2>
                    <p className="mx-auto mt-2 max-w-xl text-sm text-slate-500">
                        Tidak perlu telepon atau chat panjang. Semua proses booking dilakukan
                        langsung dari browser.
                    </p>
                </div>

                <div className="mt-10 grid gap-5 md:grid-cols-3">
                    {steps.map((step, index) => {
                        const Icon = step.icon;

                        return (
                            <div
                                key={step.title}
                                className="relative rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm"
                            >
                                <span className="absolute right-5 top-5 text-4xl font-black text-slate-100">
                                    0{index + 1}
                                </span>
                                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand-700">
                                    <Icon className="h-5 w-5" />
                                </span>
                                <h3 className="mt-4 text-base font-bold text-slate-900">
                                    {step.title}
                                </h3>
                                <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
                                    {step.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
                <div className="relative overflow-hidden rounded-3xl bg-brand-950 px-6 py-12 sm:px-10 lg:px-14">
                    <img
                        src="/images/venues/badminton.svg"
                        alt=""
                        className="absolute inset-y-0 right-0 hidden h-full w-1/2 object-cover opacity-30 lg:block"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-950 via-brand-950/95 to-brand-950/40" />

                    <div className="relative max-w-2xl">
                        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-brand-100 ring-1 ring-white/20">
                            <TrendingUp className="h-3.5 w-3.5" /> Untuk pemilik lapangan
                        </span>
                        <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                            Punya lapangan? Biarkan Sportify yang mengurus booking-nya.
                        </h2>
                        <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-300">
                            Kelola venue, atur jam operasional dan harga, terima pembayaran, serta
                            pantau pendapatan dari satu dashboard.
                        </p>

                        <ul className="mt-6 grid gap-2.5 text-sm text-slate-300 sm:grid-cols-2">
                            {[
                                'Dashboard pendapatan real-time',
                                'Kelola banyak venue & lapangan',
                                'Konfirmasi booking lebih cepat',
                                'Laporan transaksi lengkap',
                            ].map((item) => (
                                <li key={item} className="flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-400" />
                                    {item}
                                </li>
                            ))}
                        </ul>

                        <div className="mt-8 flex flex-wrap gap-3">
                            <Link
                                href={user ? route(`${user.role}.dashboard`) : route('register')}
                                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-brand-800 shadow-sm transition hover:bg-brand-50"
                            >
                                {user ? (
                                    <>
                                        <LayoutDashboard className="h-4 w-4" /> Buka Dashboard
                                    </>
                                ) : (
                                    <>
                                        Gabung sebagai Mitra <ArrowRight className="h-4 w-4" />
                                    </>
                                )}
                            </Link>
                            <Link
                                href={route('venues.index')}
                                className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                            >
                                Lihat contoh venue
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </AppLayout>
    );
}

function Stat({ value, label }) {
    return (
        <div>
            <p className="text-2xl font-extrabold tracking-tight text-white">
                {Number(value).toLocaleString('id-ID')}
                <span className="text-brand-400">+</span>
            </p>
            <p className="mt-0.5 text-xs text-slate-400">{label}</p>
        </div>
    );
}
