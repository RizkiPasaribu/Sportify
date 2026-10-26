import { getSport } from "@/lib/utils";
import { router } from "@inertiajs/react";
import { CalendarDays, MapPin, Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

export default function SearchBar({
    sports = [],
    defaultValues = {},
    className = "",
}) {
    const [q, setQ] = useState(defaultValues.q ?? "");
    const [sport, setSport] = useState(defaultValues.sport ?? "");
    const [date, setDate] = useState(defaultValues.date ?? "");

    const submit = (event) => {
        event.preventDefault();

        router.get(
            route("venues.index"),
            {
                ...(q ? { q } : {}),
                ...(sport ? { sport } : {}),
                ...(date ? { date } : {}),
            },
            { preserveScroll: true },
        );
    };

    return (
        <form
            onSubmit={submit}
            className={`grid gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/5 sm:grid-cols-2 xl:grid-cols-[1.15fr_1fr_1fr_auto] ${className}`}
        >
            <label className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 focus-within:bg-slate-50 sm:col-span-2 xl:col-span-1">
                <MapPin className="h-5 w-5 shrink-0 text-brand-600" />
                <span className="min-w-0 flex-1">
                    <span className="block text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                        Lokasi / Venue
                    </span>
                    <input
                        type="text"
                        value={q}
                        onChange={(event) => setQ(event.target.value)}
                        placeholder="Cari kota atau venue"
                        className="mt-0.5 w-full border-0 bg-transparent p-0 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:ring-0"
                    />
                </span>
            </label>

            <label className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 focus-within:bg-slate-50">
                <SlidersHorizontal className="h-5 w-5 shrink-0 text-brand-600" />
                <span className="min-w-0 flex-1">
                    <span className="block text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                        Olahraga
                    </span>
                    <select
                        value={sport}
                        onChange={(event) => setSport(event.target.value)}
                        className="mt-0.5 w-full cursor-pointer border-0 bg-transparent p-0 text-sm font-medium text-slate-800 focus:ring-0"
                    >
                        <option value="">Semua</option>
                        {sports.map((item) => (
                            <option key={item} value={item}>
                                {getSport(item).label}
                            </option>
                        ))}
                    </select>
                </span>
            </label>

            <label className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 focus-within:bg-slate-50">
                <CalendarDays className="h-5 w-5 shrink-0 text-brand-600" />
                <span className="min-w-0 flex-1">
                    <span className="block text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                        Tanggal Main
                    </span>
                    <input
                        type="date"
                        value={date}
                        min={new Date().toISOString().slice(0, 10)}
                        onChange={(event) => setDate(event.target.value)}
                        className="mt-0.5 w-full border-0 bg-transparent p-0 text-sm font-medium text-slate-800 focus:ring-0"
                    />
                </span>
            </label>

            <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-brand-600/20 transition hover:bg-brand-700 sm:col-span-2 xl:col-span-1"
            >
                <Search className="h-4 w-4" />
                Cari
            </button>
        </form>
    );
}
