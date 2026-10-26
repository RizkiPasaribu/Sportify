import { formatCurrency, getSport, imageForVenue, venueMinPrice, venueRating, venueSports } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { ArrowRight, MapPin, Star } from 'lucide-react';

export default function VenueCard({ venue }) {
    const sports = venueSports(venue);
    const rating = venueRating(venue);
    const minPrice = venueMinPrice(venue);

    return (
        <Link
            href={route('venues.show', venue.id)}
            className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-xl hover:shadow-brand-900/5"
        >
            <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                <img
                    src={imageForVenue(venue)}
                    alt={venue.name}
                    className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />

                <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
                    {sports.slice(0, 2).map((sport) => {
                        const meta = getSport(sport);
                        const Icon = meta.icon;

                        return (
                            <span
                                key={sport}
                                className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-slate-700 shadow-sm backdrop-blur"
                            >
                                <Icon className="h-3.5 w-3.5" /> {meta.label}
                            </span>
                        );
                    })}
                </div>

                {rating > 0 && (
                    <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold text-slate-800 shadow-sm backdrop-blur">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        {rating.toFixed(1)}
                    </span>
                )}

                {venue.available_fields_count !== undefined && (
                    <span className="absolute bottom-3 left-3 inline-flex items-center rounded-full bg-brand-600/95 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm">
                        {venue.available_fields_count} lapangan tersedia
                    </span>
                )}
            </div>

            <div className="flex flex-1 flex-col p-5">
                <h3 className="line-clamp-1 text-base font-bold tracking-tight text-slate-900 group-hover:text-brand-700">
                    {venue.name}
                </h3>
                <p className="mt-1.5 flex items-center gap-1.5 text-sm text-slate-500">
                    <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
                    <span className="line-clamp-1">
                        {venue.city ? `${venue.city} · ` : ''}
                        {venue.address}
                    </span>
                </p>

                <div className="mt-auto flex items-end justify-between gap-3 border-t border-slate-100 pt-4">
                    <div>
                        <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                            Mulai dari
                        </p>
                        <p className="mt-0.5 text-base font-bold text-slate-900">
                            {minPrice > 0 ? formatCurrency(minPrice) : 'Hubungi venue'}
                            {minPrice > 0 && (
                                <span className="text-xs font-medium text-slate-400"> /jam</span>
                            )}
                        </p>
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600">
                        Detail
                        <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                    </span>
                </div>
            </div>
        </Link>
    );
}
