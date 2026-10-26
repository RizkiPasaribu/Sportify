import Dropdown from '@/Components/Dropdown';
import Logo from '@/Components/Logo';
import { initials } from '@/lib/utils';
import { Link, usePage } from '@inertiajs/react';
import { ChevronDown, LayoutDashboard, LogOut, Menu, Search, UserRound, X } from 'lucide-react';
import { useState } from 'react';

const navigation = [
    { label: 'Beranda', href: '/', active: 'home' },
    { label: 'Cari Lapangan', href: '/venues', active: 'venues.*' },
];

export default function Navbar() {
    const { auth } = usePage().props;
    const user = auth?.user;
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-lg">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-8">
                    <Logo />
                    <nav className="hidden items-center gap-1 md:flex">
                        {navigation.map((item) => {
                            const isActive =
                                item.href === '/'
                                    ? route().current('home')
                                    : route().current(item.active);

                            return (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                                        isActive
                                            ? 'bg-brand-50 text-brand-700'
                                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                    }`}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="hidden items-center gap-3 md:flex">
                    {user ? (
                        <>
                            <Link
                                href={route(`${user.role}.dashboard`)}
                                className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-brand-600/20 transition hover:bg-brand-700"
                            >
                                <LayoutDashboard className="h-4 w-4" />
                                Dashboard
                            </Link>
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button
                                        type="button"
                                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                                    >
                                        <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-100 text-xs font-bold text-brand-700">
                                            {initials(user.name)}
                                        </span>
                                        <span className="max-w-[120px] truncate">{user.name}</span>
                                        <ChevronDown className="h-4 w-4 text-slate-400" />
                                    </button>
                                </Dropdown.Trigger>
                                <Dropdown.Content width="56">
                                    <div className="border-b border-slate-100 px-4 py-3">
                                        <p className="truncate text-sm font-semibold text-slate-900">
                                            {user.name}
                                        </p>
                                        <p className="truncate text-xs text-slate-500">{user.email}</p>
                                    </div>
                                    <Dropdown.Link href={route(`${user.role}.dashboard`)}>
                                        Dashboard
                                    </Dropdown.Link>
                                    <Dropdown.Link href={route('profile.edit')}>Profil Saya</Dropdown.Link>
                                    <Dropdown.Link href={route('logout')} method="post" as="button">
                                        Keluar
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </>
                    ) : (
                        <>
                            <Link
                                href={route('login')}
                                className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                            >
                                Masuk
                            </Link>
                            <Link
                                href={route('register')}
                                className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-brand-600/20 transition hover:bg-brand-700"
                            >
                                Daftar Sekarang
                            </Link>
                        </>
                    )}
                </div>

                <button
                    type="button"
                    onClick={() => setMobileOpen((value) => !value)}
                    className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-slate-600 md:hidden"
                    aria-label="Buka menu"
                >
                    {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
            </div>

            {mobileOpen && (
                <div className="border-t border-slate-100 bg-white px-4 pb-5 pt-3 md:hidden">
                    <nav className="space-y-1">
                        {navigation.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                onClick={() => setMobileOpen(false)}
                                className="block rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                    <div className="mt-4 border-t border-slate-100 pt-4">
                        {user ? (
                            <div className="space-y-2">
                                <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                                    <span className="grid h-10 w-10 place-items-center rounded-lg bg-brand-100 text-sm font-bold text-brand-700">
                                        {initials(user.name)}
                                    </span>
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold text-slate-900">
                                            {user.name}
                                        </p>
                                        <p className="text-xs text-slate-500">{user.role_label}</p>
                                    </div>
                                </div>
                                <Link
                                    href={route(`${user.role}.dashboard`)}
                                    onClick={() => setMobileOpen(false)}
                                    className="flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white"
                                >
                                    <LayoutDashboard className="h-4 w-4" /> Dashboard
                                </Link>
                                <Link
                                    href={route('profile.edit')}
                                    onClick={() => setMobileOpen(false)}
                                    className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
                                >
                                    <UserRound className="h-4 w-4" /> Profil Saya
                                </Link>
                                <Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                    onClick={() => setMobileOpen(false)}
                                    className="flex w-full items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50"
                                >
                                    <LogOut className="h-4 w-4" /> Keluar
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-2">
                                <Link
                                    href={route('login')}
                                    className="rounded-xl border border-slate-200 px-4 py-2.5 text-center text-sm font-semibold text-slate-700"
                                >
                                    Masuk
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="rounded-xl bg-brand-600 px-4 py-2.5 text-center text-sm font-semibold text-white"
                                >
                                    Daftar
                                </Link>
                            </div>
                        )}
                    </div>
                    <Link
                        href={route('venues.index')}
                        className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-700"
                        onClick={() => setMobileOpen(false)}
                    >
                        <Search className="h-4 w-4" /> Cari lapangan sekarang
                    </Link>
                </div>
            )}
        </header>
    );
}
