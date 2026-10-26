<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Field;
use App\Models\Venue;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    /**
     * Display the public landing page.
     */
    public function __invoke(): Response
    {
        $venues = Venue::query()
            ->with(['fields' => fn ($query) => $query->where('is_active', true)])
            ->withCount(['fields as active_fields_count' => fn ($query) => $query->where('is_active', true)])
            ->withCount('reviews')
            ->withAvg('reviews', 'rating')
            ->latest()
            ->take(6)
            ->get();

        return Inertia::render('Welcome', [
            'venues' => $venues,
            'sports' => Field::query()
                ->where('is_active', true)
                ->distinct()
                ->orderBy('sport_type')
                ->pluck('sport_type'),
            'stats' => [
                'venues' => Venue::count(),
                'fields' => Field::where('is_active', true)->count(),
                'bookings' => Booking::count(),
                'customers' => Booking::distinct('user_id')->count('user_id'),
            ],
        ]);
    }
}
