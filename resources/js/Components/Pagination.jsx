import { decodePaginationLabel } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ paginator, className = '' }) {
    if (!paginator || paginator.last_page <= 1) {
        return null;
    }

    const links = paginator.links ?? [];
    const previous = links[0];
    const next = links[links.length - 1];
    const pages = links.slice(1, -1);
    const from = paginator.from ?? 0;
    const to = paginator.to ?? 0;
    const total = paginator.total ?? 0;

    return (
        <div className={`flex flex-col items-center justify-between gap-4 sm:flex-row ${className}`}>
            <p className="text-sm text-slate-500">
                Menampilkan <span className="font-semibold text-slate-700">{from}</span>–
                <span className="font-semibold text-slate-700">{to}</span> dari{' '}
                <span className="font-semibold text-slate-700">{total}</span> data
            </p>

            <div className="flex items-center gap-1.5">
                <PageLink link={previous} direction="prev" />
                {pages.map((link, index) => (
                    <PageLink key={`${link.label}-${index}`} link={link} />
                ))}
                <PageLink link={next} direction="next" />
            </div>
        </div>
    );
}

function PageLink({ link, direction }) {
    const label = decodePaginationLabel(link.label);
    const baseClasses =
        'inline-flex h-9 min-w-9 items-center justify-center rounded-lg border text-sm font-medium transition';

    if (!link.url) {
        return (
            <span
                className={`${baseClasses} border-slate-200 bg-white px-2 text-slate-300`}
                aria-disabled="true"
            >
                {direction === 'prev' ? (
                    <ChevronLeft className="h-4 w-4" />
                ) : direction === 'next' ? (
                    <ChevronRight className="h-4 w-4" />
                ) : (
                    label
                )}
            </span>
        );
    }

    return (
        <Link
            href={link.url}
            preserveScroll
            className={`${baseClasses} px-2.5 ${
                link.active
                    ? 'border-brand-600 bg-brand-600 text-white shadow-sm'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
            }`}
        >
            {direction === 'prev' ? (
                <ChevronLeft className="h-4 w-4" />
            ) : direction === 'next' ? (
                <ChevronRight className="h-4 w-4" />
            ) : (
                label
            )}
        </Link>
    );
}
