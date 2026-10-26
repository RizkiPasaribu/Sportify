<?php

namespace App\Enums;

enum VenueFacility: string
{
    case Parking = 'parking';
    case Shower = 'shower';
    case WaitingRoom = 'waiting_room';
    case Canteen = 'canteen';
    case Wifi = 'wifi';
    case Security = 'security';
    case Locker = 'locker';
    case PrayerRoom = 'prayer_room';

    public function label(): string
    {
        return match ($this) {
            self::Parking => 'Parkir luas',
            self::Shower => 'Toilet & shower',
            self::WaitingRoom => 'Ruang tunggu',
            self::Canteen => 'Kantin',
            self::Wifi => 'WiFi',
            self::Security => 'Keamanan 24 jam',
            self::Locker => 'Locker',
            self::PrayerRoom => 'Mushola',
        };
    }

    /**
     * @return array<string, string>
     */
    public static function options(): array
    {
        return collect(self::cases())
            ->mapWithKeys(fn (self $facility): array => [$facility->value => $facility->label()])
            ->all();
    }

    /**
     * @return array<int, string>
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
