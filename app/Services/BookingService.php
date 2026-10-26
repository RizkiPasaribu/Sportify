<?php

namespace App\Services;

use App\Enums\BookingStatus;
use App\Enums\PaymentStatus;
use App\Models\Booking;
use App\Models\Field;
use App\Models\User;
use Carbon\CarbonImmutable;
use Carbon\CarbonInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class BookingService
{
    /**
     * Build the hourly availability grid for a field on a given date.
     *
     * @return array{
     *     date: string,
     *     day_name: string,
     *     is_open: bool,
     *     open_time: string|null,
     *     close_time: string|null,
     *     slots: array<int, array{start_time: string, end_time: string, available: bool, is_past: bool, price: float}>
     * }
     */
    public function availabilityFor(Field $field, CarbonInterface $date): array
    {
        $date = CarbonImmutable::parse($date)->startOfDay();
        $dayOfWeek = (int) $date->dayOfWeek;
        $operatingHour = $field->operatingHours->firstWhere('day_of_week', $dayOfWeek);

        if ($operatingHour === null || $operatingHour->is_closed) {
            return [
                'date' => $date->toDateString(),
                'day_name' => CarbonImmutable::getDays()[$dayOfWeek],
                'is_open' => false,
                'open_time' => null,
                'close_time' => null,
                'slots' => [],
            ];
        }

        $openTime = $this->normalizeTime((string) $operatingHour->open_time);
        $closeTime = $this->normalizeTime((string) $operatingHour->close_time);
        $openMinutes = $this->timeToMinutes($openTime);
        $closeMinutes = $this->timeToMinutes($closeTime);

        $bookings = Booking::query()
            ->where('field_id', $field->id)
            ->whereDate('booking_date', $date->toDateString())
            ->blocking()
            ->get(['start_time', 'end_time']);

        $now = now();
        $isToday = $date->isToday();
        $slots = [];

        for ($minutes = $openMinutes; $minutes + 60 <= $closeMinutes; $minutes += 60) {
            $slotStart = $this->minutesToTime($minutes);
            $slotEnd = $this->minutesToTime($minutes + 60);

            $isBooked = $bookings->contains(function (Booking $booking) use ($slotStart, $slotEnd): bool {
                $bookingStart = $this->normalizeTime((string) $booking->start_time);
                $bookingEnd = $this->normalizeTime((string) $booking->end_time);

                return $bookingStart < $slotEnd && $bookingEnd > $slotStart;
            });

            $isPast = $isToday && $slotStart <= $now->format('H:i');

            $slots[] = [
                'start_time' => $slotStart,
                'end_time' => $slotEnd,
                'available' => ! $isBooked && ! $isPast,
                'is_past' => $isPast,
                'price' => (float) $field->price_per_hour,
            ];
        }

        return [
            'date' => $date->toDateString(),
            'day_name' => CarbonImmutable::getDays()[$dayOfWeek],
            'is_open' => true,
            'open_time' => $openTime,
            'close_time' => $closeTime,
            'slots' => $slots,
        ];
    }

    /**
     * Create a booking after validating availability under a row lock.
     *
     * @param  array{booking_date: string, start_time: string, end_time: string, notes?: string|null}  $data
     *
     * @throws ValidationException
     */
    public function createBooking(User $user, Field $field, array $data): Booking
    {
        return DB::transaction(function () use ($user, $field, $data): Booking {
            $lockedField = Field::query()->lockForUpdate()->findOrFail($field->id);
            $date = CarbonImmutable::parse($data['booking_date'])->startOfDay();
            $startTime = $this->normalizeTime($data['start_time']);
            $endTime = $this->normalizeTime($data['end_time']);

            if ($date->isBefore(today())) {
                throw ValidationException::withMessages([
                    'booking_date' => 'Tanggal booking tidak boleh di masa lalu.',
                ]);
            }

            if ($startTime >= $endTime) {
                throw ValidationException::withMessages([
                    'end_time' => 'Jam selesai harus lebih lambat dari jam mulai.',
                ]);
            }

            $startMinutes = $this->timeToMinutes($startTime);
            $endMinutes = $this->timeToMinutes($endTime);
            $duration = $endMinutes - $startMinutes;

            if ($duration < 60 || $duration % 60 !== 0) {
                throw ValidationException::withMessages([
                    'start_time' => 'Durasi booking minimal 1 jam dan dalam kelipatan 1 jam.',
                ]);
            }

            if ($date->isToday() && $startTime <= now()->format('H:i')) {
                throw ValidationException::withMessages([
                    'start_time' => 'Slot waktu tersebut sudah terlewat.',
                ]);
            }

            $operatingHour = $lockedField->operatingHours()
                ->where('day_of_week', $date->dayOfWeek)
                ->first();

            if ($operatingHour === null || $operatingHour->is_closed) {
                throw ValidationException::withMessages([
                    'booking_date' => 'Lapangan tutup pada tanggal tersebut.',
                ]);
            }

            $openTime = $this->normalizeTime((string) $operatingHour->open_time);
            $closeTime = $this->normalizeTime((string) $operatingHour->close_time);

            if ($startTime < $openTime || $endTime > $closeTime) {
                throw ValidationException::withMessages([
                    'start_time' => "Booking harus berada di dalam jam operasional ({$openTime} - {$closeTime}).",
                ]);
            }

            $hasOverlap = Booking::query()
                ->where('field_id', $lockedField->id)
                ->whereDate('booking_date', $date->toDateString())
                ->blocking()
                ->where('start_time', '<', $endTime)
                ->where('end_time', '>', $startTime)
                ->exists();

            if ($hasOverlap) {
                throw ValidationException::withMessages([
                    'start_time' => 'Slot waktu tersebut sudah dibooking. Silakan pilih jam lain.',
                ]);
            }

            $totalPrice = round(($duration / 60) * (float) $lockedField->price_per_hour, 2);

            return Booking::create([
                'user_id' => $user->id,
                'field_id' => $lockedField->id,
                'booking_date' => $date->toDateString(),
                'start_time' => $startTime,
                'end_time' => $endTime,
                'total_price' => $totalPrice,
                'status' => BookingStatus::Pending,
                'payment_status' => PaymentStatus::Unpaid,
                'notes' => $data['notes'] ?? null,
            ]);
        });
    }

    /**
     * Mark confirmed bookings whose session has already ended as completed.
     */
    public function completePastBookings(?string $userId = null): int
    {
        $cutoffTime = now()->format('H:i:s');

        return Booking::query()
            ->where('status', BookingStatus::Confirmed)
            ->when($userId, fn ($query) => $query->where('user_id', $userId))
            ->where(function ($query) use ($cutoffTime): void {
                $query->whereDate('booking_date', '<', today())
                    ->orWhere(function ($query) use ($cutoffTime): void {
                        $query->whereDate('booking_date', today())
                            ->whereTime('end_time', '<=', $cutoffTime);
                    });
            })
            ->update(['status' => BookingStatus::Completed->value]);
    }

    public function timeToMinutes(string $time): int
    {
        [$hours, $minutes] = array_map('intval', explode(':', $this->normalizeTime($time)));

        return ($hours * 60) + $minutes;
    }

    public function minutesToTime(int $minutes): string
    {
        return sprintf('%02d:%02d', intdiv($minutes, 60), $minutes % 60);
    }

    public function normalizeTime(string $time): string
    {
        return substr($time, 0, 5);
    }
}
