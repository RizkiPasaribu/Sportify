import PageHeader from '@/Components/PageHeader';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { initials } from '@/lib/utils';
import { usePage } from '@inertiajs/react';
import { BadgeCheck, CalendarDays, Mail, ShieldCheck, UserRound } from 'lucide-react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    const user = usePage().props.auth.user;

    return (
        <DashboardLayout
            title="Profil Saya"
            header={
                <PageHeader
                    eyebrow="Pengaturan Akun"
                    title="Profil Saya"
                    description="Perbarui informasi akun, keamanan password, dan preferensi Anda."
                />
            }
        >
            <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
                <div className="space-y-6">
                    <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                        />
                    </section>

                    <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
                        <UpdatePasswordForm />
                    </section>
                </div>

                <div className="space-y-6">
                    <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
                        <div className="bg-gradient-to-br from-brand-600 to-brand-800 p-5 text-white">
                            <div className="flex items-center gap-3">
                                <span className="grid h-12 w-12 place-items-center rounded-xl bg-white/15 text-sm font-bold backdrop-blur">
                                    {initials(user.name)}
                                </span>
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-bold">{user.name}</p>
                                    <p className="truncate text-xs text-brand-100">
                                        {user.role_label}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 p-5 text-sm">
                            <div className="flex items-center gap-2.5 text-slate-600">
                                <Mail className="h-4 w-4 text-slate-400" />
                                <span className="truncate">{user.email}</span>
                            </div>
                            <div className="flex items-center gap-2.5 text-slate-600">
                                <ShieldCheck className="h-4 w-4 text-slate-400" />
                                <span>Role: {user.role_label}</span>
                            </div>
                            <div className="flex items-center gap-2.5 text-slate-600">
                                <CalendarDays className="h-4 w-4 text-slate-400" />
                                <span>Bergabung sejak akun dibuat</span>
                            </div>
                            <div className="flex items-center gap-2.5 text-slate-600">
                                {user.email_verified_at ? (
                                    <>
                                        <BadgeCheck className="h-4 w-4 text-brand-600" />
                                        <span>Email terverifikasi</span>
                                    </>
                                ) : (
                                    <>
                                        <UserRound className="h-4 w-4 text-amber-500" />
                                        <span>Email belum diverifikasi</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </section>

                    <section className="rounded-2xl border border-rose-200 bg-white p-5 shadow-sm sm:p-6">
                        <DeleteUserForm />
                    </section>
                </div>
            </div>
        </DashboardLayout>
    );
}
