import {
    Banknote,
    CircleDot,
    Dribbble,
    Feather,
    Goal,
    Landmark,
    QrCode,
    Trophy,
    Volleyball,
    Wallet,
} from 'lucide-react';

export const SPORTS = {
    futsal: {
        label: 'Futsal',
        icon: Goal,
        gradient: 'from-emerald-500 to-teal-700',
        chip: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
    },
    badminton: {
        label: 'Badminton',
        icon: Feather,
        gradient: 'from-sky-500 to-blue-700',
        chip: 'bg-sky-50 text-sky-700 ring-sky-600/20',
    },
    tennis: {
        label: 'Tenis',
        icon: CircleDot,
        gradient: 'from-amber-500 to-orange-700',
        chip: 'bg-amber-50 text-amber-700 ring-amber-600/20',
    },
    basket: {
        label: 'Basket',
        icon: Dribbble,
        gradient: 'from-orange-500 to-rose-700',
        chip: 'bg-orange-50 text-orange-700 ring-orange-600/20',
    },
    voli: {
        label: 'Voli',
        icon: Volleyball,
        gradient: 'from-violet-500 to-purple-700',
        chip: 'bg-violet-50 text-violet-700 ring-violet-600/20',
    },
};

export const DEFAULT_SPORT = {
    label: 'Olahraga',
    icon: Trophy,
    gradient: 'from-slate-500 to-slate-700',
    chip: 'bg-slate-100 text-slate-700 ring-slate-600/20',
};

export function getSport(type) {
    return SPORTS[type] ?? DEFAULT_SPORT;
}

export const PAYMENT_METHODS = [
    {
        value: 'bank_transfer',
        label: 'Transfer Bank',
        description: 'Virtual account BCA / Mandiri / BNI',
        icon: Landmark,
    },
    {
        value: 'ewallet',
        label: 'E-Wallet',
        description: 'GoPay, OVO, Dana, ShopeePay',
        icon: Wallet,
    },
    {
        value: 'qris',
        label: 'QRIS',
        description: 'Scan kode QR dari aplikasi bank apa pun',
        icon: QrCode,
    },
    {
        value: 'cash',
        label: 'Bayar di Tempat',
        description: 'Bayar tunai saat datang ke venue',
        icon: Banknote,
    },
];

export function paymentMethodLabel(method) {
    return PAYMENT_METHODS.find((item) => item.value === method)?.label ?? method;
}

export const BOOKING_STATUSES = {
    pending: {
        label: 'Menunggu Konfirmasi',
        short: 'Menunggu',
        classes: 'bg-amber-50 text-amber-700 ring-amber-600/20',
        dot: 'bg-amber-500',
    },
    confirmed: {
        label: 'Terkonfirmasi',
        short: 'Terkonfirmasi',
        classes: 'bg-brand-50 text-brand-700 ring-brand-600/20',
        dot: 'bg-brand-500',
    },
    cancelled: {
        label: 'Dibatalkan',
        short: 'Dibatalkan',
        classes: 'bg-rose-50 text-rose-700 ring-rose-600/20',
        dot: 'bg-rose-500',
    },
    completed: {
        label: 'Selesai',
        short: 'Selesai',
        classes: 'bg-slate-100 text-slate-600 ring-slate-500/20',
        dot: 'bg-slate-400',
    },
};

export const PAYMENT_STATUSES = {
    unpaid: {
        label: 'Belum Dibayar',
        classes: 'bg-amber-50 text-amber-700 ring-amber-600/20',
    },
    paid: {
        label: 'Sudah Dibayar',
        classes: 'bg-brand-50 text-brand-700 ring-brand-600/20',
    },
    refunded: {
        label: 'Dana Dikembalikan',
        classes: 'bg-slate-100 text-slate-600 ring-slate-500/20',
    },
};

export function bookingStatus(status) {
    return BOOKING_STATUSES[status] ?? BOOKING_STATUSES.pending;
}

export function paymentStatus(status) {
    return PAYMENT_STATUSES[status] ?? PAYMENT_STATUSES.unpaid;
}

export const DAY_NAMES = [
    'Minggu',
    'Senin',
    'Selasa',
    'Rabu',
    'Kamis',
    'Jumat',
    'Sabtu',
];

export function formatCurrency(value) {
    const amount = Number(value ?? 0);

    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(amount);
}

export function formatCompactCurrency(value) {
    const amount = Number(value ?? 0);

    if (amount >= 1_000_000_000) {
        return `Rp ${(amount / 1_000_000_000).toFixed(1).replace('.0', '')} M`;
    }

    if (amount >= 1_000_000) {
        return `Rp ${(amount / 1_000_000).toFixed(1).replace('.0', '')} jt`;
    }

    if (amount >= 1_000) {
        return `Rp ${Math.round(amount / 1_000)} rb`;
    }

    return formatCurrency(amount);
}

function parseDate(value) {
    if (!value) {
        return null;
    }

    if (value instanceof Date) {
        return value;
    }

    const normalized = String(value).slice(0, 10);

    return new Date(`${normalized}T00:00:00`);
}

export function formatDate(value, options = {}) {
    const date = parseDate(value);

    if (!date || Number.isNaN(date.getTime())) {
        return '-';
    }

    return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        ...options,
    }).format(date);
}

export function formatDateShort(value) {
    return formatDate(value, {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
    });
}

export function formatDateWithDay(value) {
    return formatDate(value, {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

export function formatMonth(value) {
    const date = parseDate(`${value}-01`);

    if (!date || Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat('id-ID', {
        month: 'long',
        year: 'numeric',
    }).format(date);
}

export function formatTime(value) {
    return value ? String(value).slice(0, 5) : '-';
}

export function formatTimeRange(start, end) {
    return `${formatTime(start)} - ${formatTime(end)}`;
}

export function durationLabel(start, end) {
    if (!start || !end) {
        return '-';
    }

    const [startHour, startMinute] = String(start).slice(0, 5).split(':').map(Number);
    const [endHour, endMinute] = String(end).slice(0, 5).split(':').map(Number);
    const minutes = endHour * 60 + endMinute - (startHour * 60 + startMinute);

    if (minutes <= 0) {
        return '-';
    }

    const hours = Math.floor(minutes / 60);
    const remaining = minutes % 60;

    if (remaining === 0) {
        return `${hours} jam`;
    }

    return `${hours} jam ${remaining} menit`;
}

export function imageForVenue(venue) {
    if (venue?.images?.length) {
        return venue.images[0];
    }

    const sport = venue?.fields?.[0]?.sport_type ?? 'futsal';

    return `/images/venues/${
        ['badminton', 'tennis', 'basket'].includes(sport) ? sport : 'futsal'
    }.svg`;
}

export function venueMinPrice(venue) {
    if (venue?.min_price) {
        return Number(venue.min_price);
    }

    if (!venue?.fields?.length) {
        return 0;
    }

    return Math.min(...venue.fields.map((field) => Number(field.price_per_hour)));
}

export function venueSports(venue) {
    if (venue?.sport_types?.length) {
        return venue.sport_types;
    }

    return [...new Set((venue?.fields ?? []).map((field) => field.sport_type))];
}

export function venueRating(venue) {
    const rating = Number(venue?.reviews_avg_rating ?? venue?.rating_avg ?? 0);

    return Number.isFinite(rating) ? rating : 0;
}

export function initials(name = '') {
    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join('');
}

export function decodePaginationLabel(label = '') {
    return label
        .replace(/&laquo;/g, '«')
        .replace(/&raquo;/g, '»')
        .replace(/&amp;/g, '&')
        .replace(/<[^>]*>/g, '')
        .trim();
}

export function toDateInputValue(date = new Date()) {
    const offset = date.getTimezoneOffset();
    const local = new Date(date.getTime() - offset * 60 * 1000);

    return local.toISOString().slice(0, 10);
}
