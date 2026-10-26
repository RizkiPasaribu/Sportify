<?php

namespace App\Enums;

enum PaymentStatus: string
{
    case Unpaid = 'unpaid';
    case Paid = 'paid';
    case Refunded = 'refunded';

    public function label(): string
    {
        return match ($this) {
            self::Unpaid => 'Belum Dibayar',
            self::Paid => 'Sudah Dibayar',
            self::Refunded => 'Dikembalikan',
        };
    }

    public function badgeClasses(): string
    {
        return match ($this) {
            self::Unpaid => 'bg-amber-50 text-amber-700 ring-amber-600/20',
            self::Paid => 'bg-brand-50 text-brand-700 ring-brand-600/20',
            self::Refunded => 'bg-slate-100 text-slate-600 ring-slate-500/20',
        };
    }
}
