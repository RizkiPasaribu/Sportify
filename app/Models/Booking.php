<?php

namespace App\Models;

use App\Enums\BookingStatus;
use App\Enums\PaymentStatus;
use Database\Factories\BookingFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

#[Fillable([
    'user_id',
    'field_id',
    'booking_date',
    'start_time',
    'end_time',
    'total_price',
    'status',
    'payment_status',
    'notes',
])]
class Booking extends Model
{
    /** @use HasFactory<BookingFactory> */
    use HasFactory, HasUuids;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'booking_date' => 'date',
            'total_price' => 'decimal:2',
            'status' => BookingStatus::class,
            'payment_status' => PaymentStatus::class,
        ];
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return BelongsTo<Field, $this>
     */
    public function field(): BelongsTo
    {
        return $this->belongsTo(Field::class);
    }

    /**
     * @return HasMany<Payment, $this>
     */
    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    /**
     * @return HasOne<Payment, $this>
     */
    public function latestPayment(): HasOne
    {
        return $this->hasOne(Payment::class)
            ->orderByDesc('created_at')
            ->orderByDesc('id');
    }

    /**
     * @return HasOne<Review, $this>
     */
    public function review(): HasOne
    {
        return $this->hasOne(Review::class);
    }

    /**
     * @param  Builder<Booking>  $query
     * @return Builder<Booking>
     */
    public function scopeBlocking(Builder $query): Builder
    {
        return $query->whereIn('status', [
            BookingStatus::Pending,
            BookingStatus::Confirmed,
            BookingStatus::Completed,
        ]);
    }

    /**
     * @param  Builder<Booking>  $query
     * @return Builder<Booking>
     */
    public function scopeUpcoming(Builder $query): Builder
    {
        return $query->whereDate('booking_date', '>=', today());
    }

    public function durationInMinutes(): int
    {
        [$startHour, $startMinute] = array_map('intval', explode(':', substr((string) $this->start_time, 0, 5)));
        [$endHour, $endMinute] = array_map('intval', explode(':', substr((string) $this->end_time, 0, 5)));

        return (($endHour * 60) + $endMinute) - (($startHour * 60) + $startMinute);
    }

    public function durationInHours(): float
    {
        return round($this->durationInMinutes() / 60, 2);
    }

    public function canBeCancelledByCustomer(): bool
    {
        return in_array($this->status, [BookingStatus::Pending, BookingStatus::Confirmed], true)
            && $this->booking_date->isFuture();
    }

    public function canBeReviewed(): bool
    {
        return $this->status === BookingStatus::Completed && $this->review === null;
    }
}
