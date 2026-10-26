<?php

namespace Database\Factories;

use App\Enums\BookingStatus;
use App\Enums\PaymentStatus;
use App\Models\Booking;
use App\Models\Field;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Booking>
 */
class BookingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'field_id' => Field::factory(),
            'booking_date' => fake()->dateTimeBetween('now', '+14 days')->format('Y-m-d'),
            'start_time' => '18:00',
            'end_time' => '20:00',
            'total_price' => 200000,
            'status' => BookingStatus::Pending,
            'payment_status' => PaymentStatus::Unpaid,
        ];
    }

    public function confirmed(): static
    {
        return $this->state(fn (array $attributes): array => [
            'status' => BookingStatus::Confirmed,
            'payment_status' => PaymentStatus::Paid,
        ]);
    }

    public function completed(): static
    {
        return $this->state(fn (array $attributes): array => [
            'status' => BookingStatus::Completed,
            'payment_status' => PaymentStatus::Paid,
            'booking_date' => fake()->dateTimeBetween('-30 days', '-1 day')->format('Y-m-d'),
        ]);
    }

    public function cancelled(): static
    {
        return $this->state(fn (array $attributes): array => [
            'status' => BookingStatus::Cancelled,
            'payment_status' => PaymentStatus::Unpaid,
        ]);
    }
}
