<?php

namespace Database\Factories;

use App\Models\Booking;
use App\Models\Payment;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Payment>
 */
class PaymentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'booking_id' => Booking::factory(),
            'payment_gateway_ref' => 'SPT-'.Str::upper(Str::random(12)),
            'amount' => 200000,
            'payment_method' => fake()->randomElement(['bank_transfer', 'ewallet', 'qris']),
            'status' => 'paid',
            'gateway_response' => ['simulated' => true],
        ];
    }
}
