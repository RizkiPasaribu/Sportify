<?php

namespace App\Http\Controllers\Customer;

use App\Enums\BookingStatus;
use App\Enums\PaymentStatus;
use App\Http\Controllers\Controller;
use App\Models\Venue;
use App\Services\BookingService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(private readonly BookingService $bookingService) {}

    /**
     * Display the customer dashboard.
     */
    public function __invoke(Request $request): Response
    {
        $user = $request->user();

        $this->bookingService->completePastBookings($user->id);

        $baseQuery = $user->bookings();

        $upcomingBookings = (clone $baseQuery)
            ->with(['field.venue', 'latestPayment'])
            ->whereIn('status', [BookingStatus::Pending, BookingStatus::Confirmed])
            ->whereDate('booking_date', '>=', today())
            ->orderBy('booking_date')
            ->orderBy('start_time')
            ->take(4)
            ->get();

        $recentBookings = (clone $baseQuery)
            ->with(['field.venue', 'latestPayment'])
            ->latest('booking_date')
            ->take(5)
            ->get();

        $stats = [
            'upcoming' => (clone $baseQuery)
                ->whereIn('status', [BookingStatus::Pending, BookingStatus::Confirmed])
                ->whereDate('booking_date', '>=', today())
                ->count(),
            'completed' => (clone $baseQuery)->where('status', BookingStatus::Completed)->count(),
            'total' => (clone $baseQuery)->count(),
            'spent' => (float) (clone $baseQuery)
                ->where('payment_status', PaymentStatus::Paid)
                ->where('status', '!=', BookingStatus::Cancelled)
                ->sum('total_price'),
        ];

        $favouriteVenues = Venue::query()
            ->with(['fields' => fn ($query) => $query->where('is_active', true)])
            ->withCount('reviews')
            ->withAvg('reviews', 'rating')
            ->whereHas('bookings', fn ($query) => $query->where('user_id', $user->id))
            ->take(3)
            ->get();

        return Inertia::render('Customer/Dashboard', [
            'upcomingBookings' => $upcomingBookings,
            'recentBookings' => $recentBookings,
            'favouriteVenues' => $favouriteVenues,
            'pendingReviews' => (clone $baseQuery)
                ->with(['field.venue'])
                ->where('status', BookingStatus::Completed)
                ->whereDoesntHave('review')
                ->orderByDesc('booking_date')
                ->take(3)
                ->get(),
            'stats' => $stats,
        ]);
    }
}
