import Dropdown from '@/Components/Dropdown';
import FlashMessages from '@/Components/FlashMessages';
import Logo from '@/Components/Logo';
import { initials } from '@/lib/utils';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    BarChart3,
    Building2,
    CalendarCheck2,
    ChevronDown,
    ClipboardList,
    Compass,
    LayoutDashboard,
    LogOut,
    Menu,
    ReceiptText,
    Search,
    UserRound,
    Users,
    X,
} from 'lucide-react';
import { useState } from 'react';

const menus = {
    customer: [
        { label: 'Dashboard', route: 'customer.dashboard', icon: LayoutDashboard },
        { label: 'Cari Lapangan', route: 'venues.index', icon: Search },
        { label: 'Booking Saya', route: 'customer.bookings.index', icon: CalendarCheck2 },
        { label: 'Profil Saya', route: 'profile.edit', icon: UserRound },
    ],
    owner: [
        { label: 'Dashboard', route: 'owner.dashboard', icon: LayoutDashboard },
        { label: 'Venue Saya', route: 'owner.venues.index', icon: Building2 },
        { label: 'Booking Masuk', route: 'owner.bookings.index', icon: ClipboardList },
        { label: 'Laporan', route: 'owner.reports.index', icon: BarChart3 },
        { label: 'Profil Saya', route: 'profile.edit', icon: UserRound },
    ],
    admin: [
        { label: 'Dashboard', route: 'admin.dashboard', icon: LayoutDashboard },
        { label: 'Pengguna', route: 'admin.users.index', icon: Users },
        { label: 'Venue', route: 'admin.venues.index', icon: Building2 },
        { label: 'Transaksi', route: 'admin.bookings.index', icon: ReceiptText },
        { label: 'Profil Saya', route: 'profile.edit', icon: UserRound },
    ],
};

export default function DashboardLayout({ title, header, children }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const items = menus[user.role] ?? menus.customer;

    const isActive = (routeName) => {
        if (routeName === 'venues.index') {
            return route().current('venues.*');
        }

        if (routeName === 'owner.venues.index') {
            return route().current('owner.venues.*');
        }

        return route().current(routeName);
    };

    const sidebar = (
        <div className="flex h-full flex-col bg-brand-950 text-slate-300">
            <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
                <Logo light />
                <button
                    type="button"
                    onClick={() => setSidebarOpen(false)}
                    className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-white/10 hover:text-white lg:hidden"
                    aria-label="Tutup menu"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>

            <div className="border-b border-white/10 px-5 py-5">
                <div className="flex items-center gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 text-sm font-bold text-white">
                        {initials(user.name)}
                    </span>
                    <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-white">{user.name}</p>
                        <p className="truncate text-xs text-slate-400">{user.role_label}</p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
                <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Menu Utama
                </p>
                {items.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.route);

                    return (
                        <Link
                            key={item.label}
                            href={route(item.route)}
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                                active
                                    ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/30'
                                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                            }`}
                        >
                            <Icon className="h-[18px] w-[18px]" />
                            {item.label}
                        </Link>
                    );
                })}

                <div className="pt-4">
                    <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        Lainnya
                    </p>
                    <Link
                        href={route('home')}
                        onClick={() => setSidebarOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
                    >
                        <Compass className="h-[18px] w-[18px]" /> Halaman Publik
                    </Link>
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-rose-300"
                    >
                        <LogOut className="h-[18px] w-[18px]" /> Keluar
                    </Link>
                </div>
            </nav>

            <div className="border-t border-white/10 p-4">
                <div className="rounded-xl bg-white/5 p-4">
                    <p className="text-xs font-semibold text-white">Butuh bantuan?</p>
                    <p className="mt-1 text-xs leading-relaxed text-slate-400">
                        Tim Sportify siap membantu setiap hari, 08.00 - 22.00 WIB.
                    </p>
                    <a
                        href="mailto:halo@sportify.id"
                        className="mt-3 inline-flex text-xs font-semibold text-brand-300 hover:text-brand-200"
                    >
                        halo@sportify.id
                    </a>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50">
            {title && <Head title={title} />}
            <FlashMessages />

            <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 lg:block">{sidebar}</aside>

            {sidebarOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        onClick={() => setSidebarOpen(false)}
                    />
                    <aside className="absolute inset-y-0 left-0 w-72 max-w-[85%] shadow-2xl">{sidebar}</aside>
                </div>
            )}

            <div className="lg:pl-64">
                <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur-lg sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setSidebarOpen(true)}
                            className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-slate-600 lg:hidden"
                            aria-label="Buka menu"
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                                {user.role_label}
                            </p>
                            <h1 className="text-base font-bold text-slate-900 sm:text-lg">{title}</h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            href={route('venues.index')}
                            className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 sm:inline-flex"
                        >
                            <Search className="h-4 w-4" /> Cari lapangan
                        </Link>
                        <Dropdown>
                            <Dropdown.Trigger>
                                <button
                                    type="button"
                                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                                >
                                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-100 text-xs font-bold text-brand-700">
                                        {initials(user.name)}
                                    </span>
                                    <span className="hidden max-w-[120px] truncate sm:block">{user.name}</span>
                                    <ChevronDown className="h-4 w-4 text-slate-400" />
                                </button>
                            </Dropdown.Trigger>
                            <Dropdown.Content width="56">
                                <div className="border-b border-slate-100 px-4 py-3">
                                    <p className="truncate text-sm font-semibold text-slate-900">{user.name}</p>
                                    <p className="truncate text-xs text-slate-500">{user.email}</p>
                                </div>
                                <Dropdown.Link href={route('profile.edit')}>Profil Saya</Dropdown.Link>
                                <Dropdown.Link href={route('home')}>Halaman Publik</Dropdown.Link>
                                <Dropdown.Link href={route('logout')} method="post" as="button">
                                    Keluar
                                </Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>
                </header>

                <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
                    {header && <div className="mb-6">{header}</div>}
                    {children}
                </main>
            </div>
        </div>
    );
}
