<?php

namespace App\Http\Controllers\Owner;

use App\Enums\BookingStatus;
use App\Enums\PaymentStatus;
use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Field;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the owner dashboard.
     */
    public function __invoke(Request $request): Response
    {
        $user = $request->user();
        $venueIds = $user->venues()->pluck('id');

        $bookingQuery = Booking::query()
            ->whereHas('field', fn ($query) => $query->whereIn('venue_id', $venueIds));

        $paidQuery = (clone $bookingQuery)
            ->where('payment_status', PaymentStatus::Paid)
            ->where('status', '!=', BookingStatus::Cancelled);

        $stats = [
            'revenue_this_month' => (float) (clone $paidQuery)
                ->whereBetween('booking_date', [now()->startOfMonth(), now()->endOfMonth()])
                ->sum('total_price'),
            'revenue_total' => (float) (clone $paidQuery)->sum('total_price'),
            'pending_bookings' => (clone $bookingQuery)->where('status', BookingStatus::Pending)->count(),
            'upcoming_bookings' => (clone $bookingQuery)
                ->whereIn('status', [BookingStatus::Pending, BookingStatus::Confirmed])
                ->whereDate('booking_date', '>=', today())
                ->count(),
            'venues' => $venueIds->count(),
            'fields' => Field::whereIn('venue_id', $venueIds)->where('is_active', true)->count(),
        ];

        $monthlyRevenue = collect(range(5, 0))->map(function (int $monthsAgo) use ($paidQuery): array {
            $month = now()->subMonths($monthsAgo);

            return [
                'label' => $month->translatedFormat('M Y'),
                'total' => (float) (clone $paidQuery)
                    ->whereBetween('booking_date', [$month->copy()->startOfMonth(), $month->copy()->endOfMonth()])
                    ->sum('total_price'),
            ];
        });

        $topFields = Field::query()
            ->whereIn('venue_id', $venueIds)
            ->with('venue:id,name')
            ->withCount(['bookings as paid_bookings_count' => fn ($query) => $query->where('payment_status', PaymentStatus::Paid)])
            ->withSum(['bookings as revenue' => fn ($query) => $query->where('payment_status', PaymentStatus::Paid)], 'total_price')
            ->orderByDesc('paid_bookings_count')
            ->take(5)
            ->get();

        $recentBookings = (clone $bookingQuery)
            ->with(['user:id,name,email', 'field.venue:id,name', 'latestPayment'])
            ->latest()
            ->take(6)
            ->get();

        return Inertia::render('Owner/Dashboard', [
            'stats' => $stats,
            'monthlyRevenue' => $monthlyRevenue,
            'topFields' => $topFields,
            'recentBookings' => $recentBookings,
        ]);
    }
}
