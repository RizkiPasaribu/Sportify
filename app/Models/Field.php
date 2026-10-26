<?php

namespace App\Models;

use Database\Factories\FieldFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['venue_id', 'name', 'sport_type', 'price_per_hour', 'is_active'])]
class Field extends Model
{
    /** @use HasFactory<FieldFactory> */
    use HasFactory, HasUuids;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'price_per_hour' => 'decimal:2',
            'is_active' => 'boolean',
        ];
    }

    /**
     * @return BelongsTo<Venue, $this>
     */
    public function venue(): BelongsTo
    {
        return $this->belongsTo(Venue::class);
    }

    /**
     * @return HasMany<OperatingHour, $this>
     */
    public function operatingHours(): HasMany
    {
        return $this->hasMany(OperatingHour::class)->orderBy('day_of_week');
    }

    /**
     * @return HasMany<Booking, $this>
     */
    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    public function operatingHourFor(int $dayOfWeek): ?OperatingHour
    {
        return $this->operatingHours->firstWhere('day_of_week', $dayOfWeek);
    }
}
