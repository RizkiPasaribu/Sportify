<?php

namespace App\Enums;

enum UserRole: string
{
    case Customer = 'customer';
    case Owner = 'owner';
    case Admin = 'admin';

    public function label(): string
    {
        return match ($this) {
            self::Customer => 'Customer',
            self::Owner => 'Mitra / Owner',
            self::Admin => 'Administrator',
        };
    }

    public function dashboardRoute(): string
    {
        return match ($this) {
            self::Customer => 'customer.dashboard',
            self::Owner => 'owner.dashboard',
            self::Admin => 'admin.dashboard',
        };
    }

    /**
     * @return array<string, string>
     */
    public static function options(): array
    {
        return [
            self::Customer->value => self::Customer->label(),
            self::Owner->value => self::Owner->label(),
            self::Admin->value => self::Admin->label(),
        ];
    }
}
