import Logo from '@/Components/Logo';
import { Link } from '@inertiajs/react';
import { Instagram, Mail, MapPin, Phone, Twitter } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="border-t border-slate-800 bg-brand-950 text-slate-300">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid gap-10 md:grid-cols-4">
                    <div className="md:col-span-2">
                        <Logo light />
                        <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-400">
                            Sportify memudahkan Anda menemukan dan memesan lapangan olahraga
                            favorit secara real-time. Dari futsal sampai badminton, semua ada
                            dalam satu platform.
                        </p>
                        <div className="mt-6 flex items-center gap-3">
                            <a
                                href="mailto:halo@sportify.id"
                                className="grid h-9 w-9 place-items-center rounded-lg bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white"
                                aria-label="Email"
                            >
                                <Mail className="h-4 w-4" />
                            </a>
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noreferrer"
                                className="grid h-9 w-9 place-items-center rounded-lg bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white"
                                aria-label="Instagram"
                            >
                                <Instagram className="h-4 w-4" />
                            </a>
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noreferrer"
                                className="grid h-9 w-9 place-items-center rounded-lg bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white"
                                aria-label="Twitter"
                            >
                                <Twitter className="h-4 w-4" />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                            Jelajahi
                        </h3>
                        <ul className="mt-4 space-y-2.5 text-sm">
                            <li>
                                <Link href={route('venues.index')} className="hover:text-white">
                                    Semua Lapangan
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={route('venues.index', { sport: 'futsal' })}
                                    className="hover:text-white"
                                >
                                    Futsal
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={route('venues.index', { sport: 'badminton' })}
                                    className="hover:text-white"
                                >
                                    Badminton
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={route('venues.index', { sport: 'tennis' })}
                                    className="hover:text-white"
                                >
                                    Tenis
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={route('venues.index', { sport: 'basket' })}
                                    className="hover:text-white"
                                >
                                    Basket
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                            Untuk Mitra
                        </h3>
                        <ul className="mt-4 space-y-2.5 text-sm">
                            <li>
                                <Link href={route('register')} className="hover:text-white">
                                    Daftar sebagai Owner
                                </Link>
                            </li>
                            <li>
                                <Link href={route('login')} className="hover:text-white">
                                    Masuk Dashboard
                                </Link>
                            </li>
                            <li>
                                <a href="mailto:partner@sportify.id" className="hover:text-white">
                                    partner@sportify.id
                                </a>
                            </li>
                        </ul>
                        <div className="mt-6 space-y-2 text-sm text-slate-400">
                            <p className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" /> Jakarta, Indonesia
                            </p>
                            <p className="flex items-center gap-2">
                                <Phone className="h-4 w-4" /> +62 812 3456 7890
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-slate-500 sm:flex-row">
                    <p>© {new Date().getFullYear()} Sportify. Seluruh hak cipta dilindungi.</p>
                    <p>Dibangun dengan Laravel, Inertia.js, React, dan PostgreSQL.</p>
                </div>
            </div>
        </footer>
    );
}
