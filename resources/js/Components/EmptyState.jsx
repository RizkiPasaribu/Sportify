import { Link } from '@inertiajs/react';

export default function EmptyState({ icon: Icon, title, description, actionLabel, actionHref, onAction }) {
    return (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
            {Icon && (
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 text-slate-400">
                    <Icon className="h-6 w-6" />
                </span>
            )}
            <h3 className="mt-4 text-base font-semibold text-slate-900">{title}</h3>
            {description && <p className="mt-1.5 max-w-sm text-sm text-slate-500">{description}</p>}
            {actionLabel && actionHref && (
                <Link
                    href={actionHref}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
                >
                    {actionLabel}
                </Link>
            )}
            {actionLabel && onAction && (
                <button
                    type="button"
                    onClick={onAction}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
                >
                    {actionLabel}
                </button>
            )}
        </div>
    );
}
