import Logo from '@/Components/Logo';
import { Link } from '@inertiajs/react';
import { ShieldCheck, Sparkles, Star } from 'lucide-react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen bg-slate-50">
            <div className="relative hidden w-1/2 overflow-hidden bg-brand-950 lg:block">
                <img
                    src="/images/venues/futsal-2.svg"
                    alt="Lapangan futsal Sportify"
                    className="absolute inset-0 h-full w-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-brand-950/90 via-brand-950/70 to-brand-900/80" />

                <div className="relative flex h-full flex-col justify-between p-12">
                    <Logo light />

                    <div>
                        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-brand-100 ring-1 ring-white/20 backdrop-blur">
                            <Sparkles className="h-3.5 w-3.5" /> Booking lapangan tanpa ribet
                        </span>
                        <h1 className="mt-5 max-w-md text-4xl font-extrabold leading-tight tracking-tight text-white">
                            Main kapan saja, lapangannya selalu siap.
                        </h1>
                        <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-300">
                            Temukan lapangan futsal, badminton, tenis, dan basket favorit Anda.
                            Cek jadwal real-time dan amankan slot dalam hitungan menit.
                        </p>

                        <div className="mt-8 flex items-center gap-4">
                            <div className="flex -space-x-2">
                                {['AP', 'BS', 'SR', 'DN'].map((initial) => (
                                    <span
                                        key={initial}
                                        className="grid h-9 w-9 place-items-center rounded-full border-2 border-brand-950 bg-brand-700 text-[11px] font-bold text-white"
                                    >
                                        {initial}
                                    </span>
                                ))}
                            </div>
                            <div>
                                <div className="flex items-center gap-0.5">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                                        />
                                    ))}
                                </div>
                                <p className="mt-1 text-xs text-slate-400">
                                    Dipercaya ribuan pemain di seluruh Indonesia
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-400">
                        <ShieldCheck className="h-4 w-4 text-brand-400" />
                        Pembayaran aman & konfirmasi mitra terverifikasi
                    </div>
                </div>
            </div>

            <div className="flex w-full flex-col lg:w-1/2">
                <div className="flex items-center justify-between p-6 lg:justify-end">
                    <div className="lg:hidden">
                        <Logo />
                    </div>
                    <Link
                        href={route('home')}
                        className="text-sm font-medium text-slate-500 transition hover:text-brand-700"
                    >
                        ← Kembali ke beranda
                    </Link>
                </div>

                <div className="flex flex-1 items-center justify-center px-4 pb-12 sm:px-6">
                    <div className="w-full max-w-md">{children}</div>
                </div>

                <p className="pb-6 text-center text-xs text-slate-400">
                    © {new Date().getFullYear()} Sportify. Semua hak dilindungi.
                </p>
            </div>
        </div>
    );
}
