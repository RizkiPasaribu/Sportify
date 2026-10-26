import { formatCompactCurrency } from '@/lib/utils';

export default function StatCard({
    title,
    value,
    icon: Icon,
    description,
    accent = 'brand',
    valueClassName = '',
}) {
    const accents = {
        brand: 'bg-brand-50 text-brand-700',
        amber: 'bg-amber-50 text-amber-700',
        sky: 'bg-sky-50 text-sky-700',
        rose: 'bg-rose-50 text-rose-700',
        slate: 'bg-slate-100 text-slate-700',
        violet: 'bg-violet-50 text-violet-700',
    };

    return (
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-500">{title}</p>
                    <p className={`mt-2 truncate text-2xl font-bold tracking-tight text-slate-900 ${valueClassName}`}>
                        {value}
                    </p>
                    {description && <p className="mt-1.5 text-xs text-slate-500">{description}</p>}
                </div>
                {Icon && (
                    <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${accents[accent]}`}>
                        <Icon className="h-5 w-5" />
                    </span>
                )}
            </div>
        </div>
    );
}

export function RevenueStatCard({ title, value, icon: Icon, description }) {
    return (
        <StatCard
            title={title}
            value={formatCompactCurrency(value)}
            icon={Icon}
            description={description}
            accent="brand"
        />
    );
}
