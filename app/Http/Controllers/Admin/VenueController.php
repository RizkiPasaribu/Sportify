<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Venue;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class VenueController extends Controller
{
    /**
     * Display all venues on the platform.
     */
    public function index(Request $request): Response
    {
        $filters = $request->validate([
            'q' => ['nullable', 'string', 'max:100'],
            'city' => ['nullable', 'string', 'max:100'],
        ]);

        $venues = Venue::query()
            ->with('owner:id,name,email')
            ->withCount(['fields', 'bookings', 'reviews'])
            ->withAvg('reviews', 'rating')
            ->when($filters['q'] ?? null, function ($query, string $search): void {
                $query->where(function ($query) use ($search): void {
                    $query->where('name', 'ilike', "%{$search}%")
                        ->orWhere('address', 'ilike', "%{$search}%");
                });
            })
            ->when($filters['city'] ?? null, fn ($query, string $city) => $query->where('city', $city))
            ->latest()
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Admin/Venues/Index', [
            'venues' => $venues,
            'filters' => [
                'q' => $filters['q'] ?? '',
                'city' => $filters['city'] ?? '',
            ],
            'cities' => Venue::query()->whereNotNull('city')->distinct()->orderBy('city')->pluck('city'),
        ]);
    }

    /**
     * Remove a venue from the platform.
     */
    public function destroy(Venue $venue): RedirectResponse
    {
        $this->authorize('delete', $venue);

        foreach ($venue->images ?? [] as $image) {
            if (str_starts_with($image, '/storage/')) {
                Storage::disk('public')->delete(Str::after($image, '/storage/'));
            }
        }

        $venue->delete();

        return back()->with('success', 'Venue berhasil dihapus dari platform.');
    }
}
