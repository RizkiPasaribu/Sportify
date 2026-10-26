<?php

namespace Database\Seeders;

use App\Enums\BookingStatus;
use App\Enums\PaymentStatus;
use App\Enums\UserRole;
use App\Models\Booking;
use App\Models\Field;
use App\Models\Payment;
use App\Models\Review;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class BookingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $customers = User::where('role', UserRole::Customer)->get();
        $primaryCustomer = User::where('email', 'customer@sportify.id')->firstOrFail();
        $fields = Field::with('venue')->get();

        if ($fields->isEmpty() || $customers->isEmpty()) {
            return;
        }

        $usedSlots = [];
        $startTimes = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'];

        $createBooking = function (
            Field $field,
            string $date,
            string $startTime,
            BookingStatus $status,
            PaymentStatus $paymentStatus,
            User $customer,
        ) use (&$usedSlots): ?Booking {
            $key = $field->id.'|'.$date.'|'.$startTime;

            if (isset($usedSlots[$key])) {
                return null;
            }

            $usedSlots[$key] = true;
            $endTime = sprintf('%02d:00', ((int) substr($startTime, 0, 2)) + 2);

            $booking = Booking::create([
                'user_id' => $customer->id,
                'field_id' => $field->id,
                'booking_date' => $date,
                'start_time' => $startTime,
                'end_time' => $endTime,
                'total_price' => (float) $field->price_per_hour * 2,
                'status' => $status,
                'payment_status' => $paymentStatus,
            ]);

            if ($paymentStatus === PaymentStatus::Paid) {
                Payment::create([
                    'booking_id' => $booking->id,
                    'payment_gateway_ref' => 'SPT-'.Str::upper(Str::random(12)),
                    'amount' => $booking->total_price,
                    'payment_method' => fake()->randomElement(['bank_transfer', 'ewallet', 'qris']),
                    'status' => 'paid',
                    'gateway_response' => ['simulated' => true],
                ]);
            }

            if ($status === BookingStatus::Completed && fake()->boolean(70)) {
                Review::create([
                    'booking_id' => $booking->id,
                    'user_id' => $customer->id,
                    'venue_id' => $field->venue_id,
                    'rating' => fake()->numberBetween(4, 5),
                    'comment' => fake()->randomElement([
                        'Lapangan bersih, pencahayaan bagus, dan staf ramah. Pasti kembali lagi!',
                        'Fasilitas lengkap dan lokasi mudah dijangkau. Recommended.',
                        'Harga sesuai kualitas. Jadwal tepat waktu dan tidak perlu menunggu.',
                        'Tempatnya nyaman, parkir luas. Cocok untuk main bareng teman.',
                        'Pelayanan cepat dan lapangan terawat dengan baik.',
                    ]),
                ]);
            }

            return $booking;
        };

        $primaryField = $fields->first();

        $createBooking(
            $primaryField,
            today()->addDays(2)->toDateString(),
            '19:00',
            BookingStatus::Confirmed,
            PaymentStatus::Paid,
            $primaryCustomer,
        );

        $createBooking(
            $primaryField,
            today()->addDays(4)->toDateString(),
            '16:00',
            BookingStatus::Pending,
            PaymentStatus::Unpaid,
            $primaryCustomer,
        );

        $createBooking(
            $primaryField,
            today()->subDays(9)->toDateString(),
            '20:00',
            BookingStatus::Completed,
            PaymentStatus::Paid,
            $primaryCustomer,
        );

        $createBooking(
            $primaryField,
            today()->subDays(3)->toDateString(),
            '10:00',
            BookingStatus::Cancelled,
            PaymentStatus::Unpaid,
            $primaryCustomer,
        );

        foreach ($fields as $field) {
            for ($weeksAgo = 6; $weeksAgo >= 1; $weeksAgo--) {
                foreach ([1, 4] as $dayOffset) {
                    $date = today()->subWeeks($weeksAgo)->addDays($dayOffset);
                    $startTime = fake()->randomElement($startTimes);

                    $createBooking(
                        $field,
                        $date->toDateString(),
                        $startTime,
                        BookingStatus::Completed,
                        PaymentStatus::Paid,
                        $customers->random(),
                    );
                }
            }

            foreach ([1, 3] as $daysAhead) {
                $date = today()->addDays($daysAhead);
                $startTime = fake()->randomElement($startTimes);

                $createBooking(
                    $field,
                    $date->toDateString(),
                    $startTime,
                    fake()->boolean(60) ? BookingStatus::Confirmed : BookingStatus::Pending,
                    fake()->boolean(60) ? PaymentStatus::Paid : PaymentStatus::Unpaid,
                    $customers->random(),
                );
            }
        }
    }
}
