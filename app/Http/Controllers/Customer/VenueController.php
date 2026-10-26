<?php

namespace App\Http\Controllers\Customer;

use App\Enums\BookingStatus;
use App\Http\Controllers\Controller;
use App\Models\Field;
use App\Models\Venue;
use App\Services\BookingService;
use Carbon\CarbonImmutable;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class VenueController extends Controller
{
    public function __construct(private readonly BookingService $bookingService) {}

    /**
     * Display a filterable list of venues.
     */
    public function index(Request $request): Response
    {
        $filters = $request->validate([
            'q' => ['nullable', 'string', 'max:100'],
            'sport' => ['nullable', 'string', 'max:30'],
            'city' => ['nullable', 'string', 'max:100'],
            'date' => ['nullable', 'date'],
        ]);

        $selectedDate = isset($filters['date'])
            ? CarbonImmutable::parse($filters['date'])->startOfDay()
            : null;

        if ($selectedDate !== null && $selectedDate->isBefore(today())) {
            $selectedDate = CarbonImmutable::today();
        }

        $venues = Venue::query()
            ->with([
                'fields' => fn ($query) => $query
                    ->where('is_active', true)
                    ->with('operatingHours'),
            ])
            ->withCount(['fields as active_fields_count' => fn ($query) => $query->where('is_active', true)])
            ->withCount('reviews')
            ->withAvg('reviews', 'rating')
            ->when($filters['q'] ?? null, function ($query, string $search): void {
                $query->where(function ($query) use ($search): void {
                    $query->where('name', 'ilike', "%{$search}%")
                        ->orWhere('address', 'ilike', "%{$search}%")
                        ->orWhere('city', 'ilike', "%{$search}%");
                });
            })
            ->when($filters['sport'] ?? null, function ($query, string $sport): void {
                $query->whereHas('fields', fn ($query) => $query
                    ->where('sport_type', $sport)
                    ->where('is_active', true));
            })
            ->when($filters['city'] ?? null, function ($query, string $city): void {
                $query->where('city', $city);
            })
            ->when($selectedDate, function ($query) use ($selectedDate): void {
                $query->whereHas('fields.operatingHours', fn ($query) => $query
                    ->where('day_of_week', $selectedDate->dayOfWeek)
                    ->where('is_closed', false));
            })
            ->orderBy('name')
            ->paginate(9)
            ->withQueryString()
            ->through(function (Venue $venue) use ($selectedDate): Venue {
                $venue->setAttribute('min_price', $venue->fields->min('price_per_hour'));
                $venue->setAttribute('sport_types', $venue->fields->pluck('sport_type')->unique()->values());

                if ($selectedDate !== null) {
                    $venue->setAttribute('available_fields_count', $venue->fields->filter(
                        fn (Field $field): bool => collect($this->bookingService->availabilityFor($field, $selectedDate)['slots'])
                            ->contains('available', true),
                    )->count());
                }

                return $venue;
            });

        return Inertia::render('Customer/Venues/Index', [
            'venues' => $venues,
            'filters' => [
                'q' => $filters['q'] ?? '',
                'sport' => $filters['sport'] ?? '',
                'city' => $filters['city'] ?? '',
                'date' => $selectedDate?->toDateString() ?? '',
            ],
            'cities' => Venue::query()->whereNotNull('city')->distinct()->orderBy('city')->pluck('city'),
            'sports' => Field::query()->where('is_active', true)->distinct()->orderBy('sport_type')->pluck('sport_type'),
        ]);
    }

    /**
     * Display a venue with its fields, schedule, and reviews.
     */
    public function show(Request $request, Venue $venue): Response
    {
        $date = $this->resolveDate($request->query('date'));

        if ($request->user() !== null) {
            $this->bookingService->completePastBookings($request->user()->id);
        }

        $venue->load([
            'owner:id,name',
            'fields' => fn ($query) => $query
                ->where('is_active', true)
                ->with('operatingHours'),
            'reviews' => fn ($query) => $query
                ->with('user:id,name')
                ->latest()
                ->take(8),
        ]);

        $venue->loadCount('reviews');
        $venue->loadAvg('reviews', 'rating');

        $fields = $venue->fields->map(function (Field $field) use ($date): array {
            return [
                ...$field->toArray(),
                'availability' => $this->bookingService->availabilityFor($field, $date),
            ];
        });

        $ratingBreakdown = $venue->reviews()
            ->selectRaw('rating, count(*) as total')
            ->groupBy('rating')
            ->pluck('total', 'rating');

        $relatedVenues = Venue::query()
            ->whereKeyNot($venue->id)
            ->where('city', $venue->city)
            ->with(['fields' => fn ($query) => $query->where('is_active', true)])
            ->withCount('reviews')
            ->withAvg('reviews', 'rating')
            ->take(3)
            ->get();

        return Inertia::render('Customer/Venues/Show', [
            'venue' => $venue,
            'fields' => $fields,
            'reviews' => $venue->reviews,
            'ratingBreakdown' => $ratingBreakdown,
            'relatedVenues' => $relatedVenues,
            'reviewableBooking' => $request->user()?->bookings()
                ->where('status', BookingStatus::Completed)
                ->whereHas('field', fn ($query) => $query->where('venue_id', $venue->id))
                ->whereDoesntHave('review')
                ->orderByDesc('booking_date')
                ->orderByDesc('start_time')
                ->first(['id', 'booking_date']),
            'selectedDate' => $date->toDateString(),
            'dateOptions' => collect(range(0, 13))
                ->map(fn (int $offset): array => [
                    'value' => today()->addDays($offset)->toDateString(),
                    'label' => today()->addDays($offset)->translatedFormat('D, d M'),
                ]),
        ]);
    }

    private function resolveDate(?string $value): CarbonImmutable
    {
        if ($value === null || $value === '') {
            return CarbonImmutable::today();
        }

        try {
            $date = CarbonImmutable::parse($value)->startOfDay();
        } catch (\Exception) {
            return CarbonImmutable::today();
        }

        return $date->isBefore(today()) ? CarbonImmutable::today() : $date;
    }
}
