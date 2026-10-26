<?php

namespace App\Models;

use Database\Factories\VenueFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

#[Fillable(['owner_id', 'name', 'city', 'address', 'description', 'phone', 'images'])]
class Venue extends Model
{
    /** @use HasFactory<VenueFactory> */
    use HasFactory, HasUuids;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'images' => 'array',
        ];
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    /**
     * @return HasMany<Field, $this>
     */
    public function fields(): HasMany
    {
        return $this->hasMany(Field::class);
    }

    /**
     * @return HasManyThrough<Booking, Field, $this>
     */
    public function bookings(): HasManyThrough
    {
        return $this->hasManyThrough(Booking::class, Field::class);
    }

    /**
     * @return HasMany<Review, $this>
     */
    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    /**
     * @return array<int, string>
     */
    public function sportTypes(): array
    {
        return $this->fields->pluck('sport_type')->unique()->values()->all();
    }
}
