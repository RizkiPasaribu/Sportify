<?php

namespace App\Enums;

enum BookingStatus: string
{
    case Pending = 'pending';
    case Confirmed = 'confirmed';
    case Cancelled = 'cancelled';
    case Completed = 'completed';

    public function label(): string
    {
        return match ($this) {
            self::Pending => 'Menunggu Konfirmasi',
            self::Confirmed => 'Terkonfirmasi',
            self::Cancelled => 'Dibatalkan',
            self::Completed => 'Selesai',
        };
    }

    public function badgeClasses(): string
    {
        return match ($this) {
            self::Pending => 'bg-amber-50 text-amber-700 ring-amber-600/20',
            self::Confirmed => 'bg-brand-50 text-brand-700 ring-brand-600/20',
            self::Cancelled => 'bg-rose-50 text-rose-700 ring-rose-600/20',
            self::Completed => 'bg-slate-100 text-slate-600 ring-slate-500/20',
        };
    }

    /**
     * @return array<string, string>
     */
    public static function options(): array
    {
        return collect(self::cases())
            ->mapWithKeys(fn (self $status): array => [$status->value => $status->label()])
            ->all();
    }
}
