<?php

namespace App\Models;

use Database\Factories\PaymentFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'booking_id',
    'payment_gateway_ref',
    'amount',
    'payment_method',
    'status',
    'gateway_response',
])]
class Payment extends Model
{
    /** @use HasFactory<PaymentFactory> */
    use HasFactory, HasUuids;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'gateway_response' => 'array',
        ];
    }

    /**
     * @return BelongsTo<Booking, $this>
     */
    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class);
    }

    public function methodLabel(): string
    {
        return match ($this->payment_method) {
            'bank_transfer' => 'Transfer Bank',
            'ewallet' => 'E-Wallet',
            'qris' => 'QRIS',
            'cash' => 'Bayar di Tempat',
            default => ucfirst(str_replace('_', ' ', $this->payment_method)),
        };
    }
}
