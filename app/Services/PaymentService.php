<?php

namespace App\Services;

use App\Enums\BookingStatus;
use App\Enums\PaymentStatus;
use App\Models\Booking;
use App\Models\Payment;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class PaymentService
{
    /**
     * Simulate a successful payment through a payment gateway.
     *
     * @throws ValidationException
     */
    public function pay(Booking $booking, string $paymentMethod): Payment
    {
        return DB::transaction(function () use ($booking, $paymentMethod): Payment {
            $lockedBooking = Booking::query()->lockForUpdate()->findOrFail($booking->id);

            if ($lockedBooking->status === BookingStatus::Cancelled) {
                throw ValidationException::withMessages([
                    'payment' => 'Booking yang sudah dibatalkan tidak dapat dibayar.',
                ]);
            }

            if ($lockedBooking->payment_status === PaymentStatus::Paid) {
                throw ValidationException::withMessages([
                    'payment' => 'Booking ini sudah dibayar.',
                ]);
            }

            $payment = $lockedBooking->payments()->create([
                'payment_gateway_ref' => 'SPT-'.Str::upper(Str::random(12)),
                'amount' => $lockedBooking->total_price,
                'payment_method' => $paymentMethod,
                'status' => 'paid',
                'gateway_response' => [
                    'simulated' => true,
                    'paid_at' => now()->toIso8601String(),
                    'method' => $paymentMethod,
                ],
            ]);

            $lockedBooking->update([
                'payment_status' => PaymentStatus::Paid,
            ]);

            return $payment;
        });
    }

    public function refund(Booking $booking): void
    {
        DB::transaction(function () use ($booking): void {
            $lockedBooking = Booking::query()->lockForUpdate()->findOrFail($booking->id);

            if ($lockedBooking->payment_status !== PaymentStatus::Paid) {
                return;
            }

            $lockedBooking->payments()
                ->where('status', 'paid')
                ->get()
                ->each(function (Payment $payment): void {
                    $payment->update([
                        'status' => 'refunded',
                        'gateway_response' => [
                            'simulated' => true,
                            'refunded_at' => now()->toIso8601String(),
                        ],
                    ]);
                });

            $lockedBooking->update([
                'payment_status' => PaymentStatus::Refunded,
            ]);
        });
    }
}
