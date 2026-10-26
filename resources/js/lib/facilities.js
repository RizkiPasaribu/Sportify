import {
    Armchair,
    BadgeCheck,
    Car,
    Droplets,
    Lock,
    MoonStar,
    ShieldCheck,
    Utensils,
    Wifi,
} from 'lucide-react';

const FACILITY_ICONS = {
    parking: Car,
    shower: Droplets,
    waiting_room: Armchair,
    canteen: Utensils,
    wifi: Wifi,
    security: ShieldCheck,
    locker: Lock,
    prayer_room: MoonStar,
};

const DEFAULT_FACILITY_ICON = BadgeCheck;

export function facilityIcon(value) {
    return FACILITY_ICONS[value] ?? DEFAULT_FACILITY_ICON;
}

export function getFacility(value, labels = {}) {
    return {
        value,
        label: labels[value] ?? value,
        icon: facilityIcon(value),
    };
}
