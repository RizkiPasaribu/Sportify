import ConfirmModal from '@/Components/ConfirmModal';
import EmptyState from '@/Components/EmptyState';
import PageHeader from '@/Components/PageHeader';
import Pagination from '@/Components/Pagination';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { formatDate, initials } from '@/lib/utils';
import { Link, router, usePage } from '@inertiajs/react';
import {
    Building2,
    CalendarCheck2,
    Filter,
    RotateCcw,
    Search,
    ShieldCheck,
    Trash2,
    UserRound,
    Users,
} from 'lucide-react';
import { useState } from 'react';

const roleStyles = {
    customer: 'bg-brand-50 text-brand-700 ring-brand-600/20',
    owner: 'bg-sky-50 text-sky-700 ring-sky-600/20',
    admin: 'bg-violet-50 text-violet-700 ring-violet-600/20',
};

const tabs = [
    { value: 'all', label: 'Semua', countKey: 'all' },
    { value: 'customer', label: 'Customer', countKey: 'customer' },
    { value: 'owner', label: 'Owner', countKey: 'owner' },
    { value: 'admin', label: 'Admin', countKey: 'admin' },
];

export default function Index({ users, filters = {}, counts = {}, roles = {} }) {
    const { auth } = usePage().props;
    const [search, setSearch] = useState(filters.q ?? '');
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [updatingId, setUpdatingId] = useState(null);

    const applyFilters = (event) => {
        event.preventDefault();

        router.get(
            route('admin.users.index'),
            {
                role: filters.role || undefined,
                q: search || undefined,
            },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const resetFilters = () => {
        setSearch('');
        router.get(
            route('admin.users.index'),
            {},
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const changeRole = (user, role) => {
        if (role === user.role) {
            return;
        }

        setUpdatingId(user.id);
        router.patch(
            route('admin.users.role', user.id),
            { role },
            {
                preserveScroll: true,
                onFinish: () => setUpdatingId(null),
            },
        );
    };

    const confirmDelete = () => {
        if (!deleteTarget) {
            return;
        }

        setDeleting(true);
        router.delete(route('admin.users.destroy', deleteTarget.id), {
            preserveScroll: true,
            onFinish: () => {
                setDeleting(false);
                setDeleteTarget(null);
            },
        });
    };

    return (
        <DashboardLayout
            title="Kelola Pengguna"
            header={
                <PageHeader
                    eyebrow="Manajemen Pengguna"
                    title="Kelola Pengguna"
                    description="Atur role, pantau aktivitas, dan kelola akses seluruh pengguna Sportify."
                />
            }
        >
            <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-200/80 bg-white p-2 shadow-sm">
                {tabs.map((tab) => {
                    const active = (filters.role || 'all') === tab.value;

                    return (
                        <Link
                            key={tab.value}
                            href={route('admin.users.index', {
                                role: tab.value === 'all' ? undefined : tab.value,
                                q: filters.q || undefined,
                            })}
                            preserveScroll
                            className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition ${
                                active
                                    ? 'bg-brand-600 text-white shadow-sm'
                                    : 'text-slate-600 hover:bg-slate-100'
                            }`}
                        >
                            {tab.label}
                            <span
                                className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                                    active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                                }`}
                            >
                                {counts[tab.countKey] ?? 0}
                            </span>
                        </Link>
                    );
                })}
            </div>

            <form
                onSubmit={applyFilters}
                className="mt-4 flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:flex-row"
            >
                <div className="relative flex-1">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Cari nama atau email pengguna..."
                        className="w-full rounded-xl border-slate-300 pl-9 text-sm shadow-sm focus:border-brand-500 focus:ring-brand-500"
                    />
                </div>
                <div className="flex gap-2">
                    <button
                        type="submit"
                        className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 sm:flex-none"
                    >
                        <Filter className="h-4 w-4" /> Cari
                    </button>
                    {(filters.q || filters.role) && (
                        <button
                            type="button"
                            onClick={resetFilters}
                            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                        >
                            <RotateCcw className="h-4 w-4" /> Reset
                        </button>
                    )}
                </div>
            </form>

            {users.data.length > 0 ? (
                <>
                    <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[860px] text-left text-sm">
                                <thead>
                                    <tr className="border-b border-slate-100 bg-slate-50/60 text-[11px] uppercase tracking-wide text-slate-400">
                                        <th className="px-5 py-3.5 font-semibold">Pengguna</th>
                                        <th className="px-3 py-3.5 font-semibold">Role</th>
                                        <th className="px-3 py-3.5 font-semibold">Aktivitas</th>
                                        <th className="px-3 py-3.5 font-semibold">Bergabung</th>
                                        <th className="px-5 py-3.5 text-right font-semibold">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {users.data.map((user) => {
                                        const isSelf = auth.user.id === user.id;

                                        return (
                                            <tr
                                                key={user.id}
                                                className="transition hover:bg-slate-50/70"
                                            >
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-xs font-bold text-white">
                                                            {initials(user.name)}
                                                        </span>
                                                        <div className="min-w-0">
                                                            <p className="flex items-center gap-1.5 truncate font-semibold text-slate-800">
                                                                {user.name}
                                                                {isSelf && (
                                                                    <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold uppercase text-slate-500">
                                                                        Anda
                                                                    </span>
                                                                )}
                                                            </p>
                                                            <p className="truncate text-xs text-slate-400">
                                                                {user.email}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-3 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <span
                                                            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset ${
                                                                roleStyles[user.role] ??
                                                                roleStyles.customer
                                                            }`}
                                                        >
                                                            {user.role === 'admin' ? (
                                                                <ShieldCheck className="h-3 w-3" />
                                                            ) : user.role === 'owner' ? (
                                                                <Building2 className="h-3 w-3" />
                                                            ) : (
                                                                <UserRound className="h-3 w-3" />
                                                            )}
                                                            {roles[user.role] ?? user.role}
                                                        </span>
                                                    </div>
                                                    <select
                                                        value={user.role}
                                                        disabled={isSelf || updatingId === user.id}
                                                        onChange={(event) =>
                                                            changeRole(user, event.target.value)
                                                        }
                                                        className="mt-2 w-full max-w-40 rounded-lg border-slate-300 text-xs shadow-sm focus:border-brand-500 focus:ring-brand-500 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                                                    >
                                                        {Object.entries(roles).map(
                                                            ([value, label]) => (
                                                                <option key={value} value={value}>
                                                                    {label}
                                                                </option>
                                                            ),
                                                        )}
                                                    </select>
                                                </td>

                                                <td className="px-3 py-4">
                                                    <div className="flex flex-col gap-1 text-xs text-slate-500">
                                                        <span className="inline-flex items-center gap-1.5">
                                                            <CalendarCheck2 className="h-3.5 w-3.5 text-slate-400" />
                                                            {user.bookings_count} booking
                                                        </span>
                                                        <span className="inline-flex items-center gap-1.5">
                                                            <Building2 className="h-3.5 w-3.5 text-slate-400" />
                                                            {user.venues_count} venue
                                                        </span>
                                                    </div>
                                                </td>

                                                <td className="px-3 py-4 text-xs text-slate-500">
                                                    {formatDate(user.created_at)}
                                                </td>

                                                <td className="px-5 py-4 text-right">
                                                    <button
                                                        type="button"
                                                        onClick={() => setDeleteTarget(user)}
                                                        disabled={isSelf}
                                                        className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 px-2.5 py-1.5 text-[11px] font-semibold text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-300"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" /> Hapus
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <Pagination paginator={users} className="mt-6" />
                </>
            ) : (
                <div className="mt-5">
                    <EmptyState
                        icon={Users}
                        title="Pengguna tidak ditemukan"
                        description="Coba ubah kata kunci atau filter role pengguna."
                        actionLabel="Reset filter"
                        onAction={resetFilters}
                    />
                </div>
            )}

            <ConfirmModal
                show={Boolean(deleteTarget)}
                title="Hapus pengguna ini?"
                description={`${deleteTarget?.name ?? ''} akan dihapus permanen beserta data terkait. Tindakan ini tidak dapat dibatalkan.`}
                confirmLabel="Ya, hapus pengguna"
                onConfirm={confirmDelete}
                onClose={() => setDeleteTarget(null)}
                processing={deleting}
                danger
            />
        </DashboardLayout>
    );
}
