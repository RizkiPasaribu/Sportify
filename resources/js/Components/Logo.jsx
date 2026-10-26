import { Link } from '@inertiajs/react';

export default function Logo({ href = '/', light = false, compact = false }) {
    return (
        <Link href={href} className="group inline-flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-400 via-brand-500 to-brand-700 text-white shadow-lg shadow-brand-600/25 transition group-hover:scale-105">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
                    <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" />
                    <path
                        d="M12 3.5 15.5 7l-1.3 4.5h-4.4L8.5 7 12 3.5ZM8.5 7 4 9.2l1.6 4.6 3.6-.8M15.5 7l4.5 2.2-1.6 4.6-3.6-.8M12 11.5l2.5 4.3-2.5 3.2-2.5-3.2 2.5-4.3Z"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        strokeLinejoin="round"
                    />
                </svg>
            </span>
            {!compact && (
                <span
                    className={`text-lg font-extrabold tracking-tight ${
                        light ? 'text-white' : 'text-slate-900'
                    }`}
                >
                    Sportify
                </span>
            )}
        </Link>
    );
}
