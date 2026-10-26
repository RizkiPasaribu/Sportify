<?php

namespace App\Http\Controllers\Admin;

use App\Enums\BookingStatus;
use App\Enums\PaymentStatus;
use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Field;
use App\Models\User;
use App\Models\Venue;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the admin dashboard.
     */
    public function __invoke(): Response
    {
        $stats = [
            'users' => User::count(),
            'customers' => User::where('role', UserRole::Customer)->count(),
            'owners' => User::where('role', UserRole::Owner)->count(),
            'venues' => Venue::count(),
            'fields' => Field::count(),
            'bookings' => Booking::count(),
            'pending_bookings' => Booking::where('status', BookingStatus::Pending)->count(),
            'revenue' => (float) Booking::query()
                ->where('payment_status', PaymentStatus::Paid)
                ->where('status', '!=', BookingStatus::Cancelled)
                ->sum('total_price'),
        ];

        $recentBookings = Booking::query()
            ->with(['user:id,name,email', 'field.venue:id,name', 'latestPayment'])
            ->latest()
            ->take(8)
            ->get();

        $topVenues = Venue::query()
            ->with('owner:id,name')
            ->withCount('fields')
            ->withCount('bookings')
            ->withSum(['bookings as revenue' => fn ($query) => $query
                ->where('payment_status', PaymentStatus::Paid)], 'total_price')
            ->orderByDesc('bookings_count')
            ->take(5)
            ->get();

        $monthlyBookings = collect(range(5, 0))->map(function (int $monthsAgo): array {
            $month = now()->subMonths($monthsAgo);

            return [
                'label' => $month->translatedFormat('M Y'),
                'total' => Booking::query()
                    ->whereBetween('booking_date', [$month->copy()->startOfMonth(), $month->copy()->endOfMonth()])
                    ->count(),
            ];
        });

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'recentBookings' => $recentBookings,
            'topVenues' => $topVenues,
            'monthlyBookings' => $monthlyBookings,
        ]);
    }
}
