<?php

namespace App\Http\Controllers\Owner;

use App\Enums\BookingStatus;
use App\Enums\PaymentStatus;
use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Payment;
use Carbon\CarbonImmutable;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    /**
     * Display revenue and booking reports for the owner.
     */
    public function __invoke(Request $request): Response
    {
        $venueIds = $request->user()->venues()->pluck('id');
        $month = $this->resolveMonth($request->query('month'));

        $bookingQuery = Booking::query()
            ->whereHas('field', fn ($query) => $query->whereIn('venue_id', $venueIds))
            ->where('status', '!=', BookingStatus::Cancelled);

        $monthBookings = (clone $bookingQuery)
            ->with(['field.venue:id,name'])
            ->whereBetween('booking_date', [$month->startOfMonth(), $month->endOfMonth()])
            ->get();

        $paidBookings = $monthBookings->where('payment_status', PaymentStatus::Paid);

        $revenueByVenue = $monthBookings
            ->groupBy(fn (Booking $booking): string => $booking->field->venue->name)
            ->map(function ($bookings, string $venueName): array {
                return [
                    'venue' => $venueName,
                    'bookings' => $bookings->count(),
                    'revenue' => (float) $bookings
                        ->where('payment_status', PaymentStatus::Paid)
                        ->sum('total_price'),
                ];
            })
            ->sortByDesc('revenue')
            ->values();

        $revenueByField = $monthBookings
            ->groupBy(fn (Booking $booking): string => $booking->field->name)
            ->map(function ($bookings, string $fieldName): array {
                return [
                    'field' => $fieldName,
                    'bookings' => $bookings->count(),
                    'revenue' => (float) $bookings
                        ->where('payment_status', PaymentStatus::Paid)
                        ->sum('total_price'),
                ];
            })
            ->sortByDesc('revenue')
            ->values();

        $dailyRevenue = collect(range(1, $month->daysInMonth))->map(function (int $day) use ($monthBookings, $month): array {
            $date = $month->day($day);

            return [
                'date' => $date->toDateString(),
                'label' => $date->format('d'),
                'revenue' => (float) $monthBookings
                    ->filter(fn (Booking $booking): bool => $booking->booking_date->isSameDay($date))
                    ->where('payment_status', PaymentStatus::Paid)
                    ->sum('total_price'),
            ];
        });

        $monthlyRevenue = collect(range(5, 0))->map(function (int $monthsAgo) use ($bookingQuery): array {
            $target = now()->subMonths($monthsAgo);

            return [
                'label' => $target->translatedFormat('M Y'),
                'total' => (float) (clone $bookingQuery)
                    ->where('payment_status', PaymentStatus::Paid)
                    ->whereBetween('booking_date', [$target->copy()->startOfMonth(), $target->copy()->endOfMonth()])
                    ->sum('total_price'),
            ];
        });

        $paymentMethods = Payment::query()
            ->whereHas('booking', fn ($query) => $query
                ->whereHas('field', fn ($query) => $query->whereIn('venue_id', $venueIds))
                ->whereBetween('booking_date', [$month->startOfMonth(), $month->endOfMonth()]))
            ->where('status', 'paid')
            ->get()
            ->groupBy('payment_method')
            ->map(fn ($payments, string $method): array => [
                'method' => $method,
                'count' => $payments->count(),
                'total' => (float) $payments->sum('amount'),
            ])
            ->values();

        return Inertia::render('Owner/Reports/Index', [
            'month' => $month->format('Y-m'),
            'monthLabel' => $month->translatedFormat('F Y'),
            'stats' => [
                'revenue' => (float) $paidBookings->sum('total_price'),
                'bookings' => $monthBookings->count(),
                'paid_bookings' => $paidBookings->count(),
                'average' => $paidBookings->count() > 0
                    ? (float) round($paidBookings->avg('total_price'), 2)
                    : 0.0,
            ],
            'revenueByVenue' => $revenueByVenue,
            'revenueByField' => $revenueByField,
            'dailyRevenue' => $dailyRevenue,
            'monthlyRevenue' => $monthlyRevenue,
            'paymentMethods' => $paymentMethods,
        ]);
    }

    private function resolveMonth(?string $value): CarbonImmutable
    {
        if ($value === null || ! preg_match('/^\d{4}-\d{2}$/', $value)) {
            return CarbonImmutable::now()->startOfMonth();
        }

        try {
            return CarbonImmutable::createFromFormat('Y-m', $value)->startOfMonth();
        } catch (\Exception) {
            return CarbonImmutable::now()->startOfMonth();
        }
    }
}
