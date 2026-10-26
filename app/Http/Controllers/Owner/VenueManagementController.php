<?php

namespace App\Http\Controllers\Owner;

use App\Enums\VenueFacility;
use App\Http\Controllers\Controller;
use App\Models\Venue;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class VenueManagementController extends Controller
{
    /**
     * Display the venues owned by the authenticated owner.
     */
    public function index(Request $request): Response
    {
        $venues = $request->user()
            ->venues()
            ->with('fields:id,venue_id,sport_type,price_per_hour')
            ->withCount(['fields', 'bookings', 'reviews'])
            ->withAvg('reviews', 'rating')
            ->latest()
            ->get();

        return Inertia::render('Owner/Venues/Index', [
            'venues' => $venues,
        ]);
    }

    /**
     * Show the form for creating a new venue.
     */
    public function create(): Response
    {
        return Inertia::render('Owner/Venues/Create');
    }

    /**
     * Store a newly created venue.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate($this->rules());
        $venueData = collect($validated)->except(['images', 'removed_images', 'facilities'])->all();

        $venue = $request->user()->venues()->create([
            ...$venueData,
            'images' => $this->storeImages($request),
            'facilities' => $validated['facilities'] ?? [],
        ]);

        return redirect()
            ->route('owner.venues.fields.index', $venue)
            ->with('success', 'Venue berhasil dibuat. Sekarang tambahkan lapangan dan jam operasional.');
    }

    /**
     * Show the form for editing the specified venue.
     */
    public function edit(Venue $venue): Response
    {
        $this->authorize('update', $venue);

        $venue->load(['fields' => fn ($query) => $query->withCount('bookings')]);
        $venue->loadCount('reviews');
        $venue->loadAvg('reviews', 'rating');

        return Inertia::render('Owner/Venues/Edit', [
            'venue' => $venue,
        ]);
    }

    /**
     * Update the specified venue.
     */
    public function update(Request $request, Venue $venue): RedirectResponse
    {
        $this->authorize('update', $venue);

        $validated = $request->validate($this->rules());
        $venueData = collect($validated)->except(['images', 'removed_images', 'facilities'])->all();

        $removedImages = collect($request->input('removed_images', []))
            ->filter(fn (mixed $image): bool => is_string($image))
            ->values()
            ->all();

        $images = collect($venue->images ?? [])
            ->reject(fn (string $image): bool => in_array($image, $removedImages, true))
            ->values()
            ->all();

        foreach ($removedImages as $image) {
            $this->deleteImageFile($image);
        }

        $images = array_slice([...$images, ...$this->storeImages($request)], 0, 5);

        $venue->update([
            ...$venueData,
            'images' => $images,
            'facilities' => $validated['facilities'] ?? [],
        ]);

        return redirect()
            ->route('owner.venues.index')
            ->with('success', 'Data venue berhasil diperbarui.');
    }

    /**
     * Remove the specified venue.
     */
    public function destroy(Venue $venue): RedirectResponse
    {
        $this->authorize('delete', $venue);

        foreach ($venue->images ?? [] as $image) {
            $this->deleteImageFile($image);
        }

        $venue->delete();

        return redirect()
            ->route('owner.venues.index')
            ->with('success', 'Venue beserta lapangannya berhasil dihapus.');
    }

    /**
     * @return array<string, mixed>
     */
    private function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'city' => ['required', 'string', 'max:100'],
            'address' => ['required', 'string', 'max:500'],
            'description' => ['nullable', 'string', 'max:2000'],
            'phone' => ['nullable', 'string', 'max:30'],
            'images' => ['nullable', 'array', 'max:5'],
            'images.*' => ['image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
            'removed_images' => ['nullable', 'array'],
            'removed_images.*' => ['string'],
            'facilities' => ['nullable', 'array', 'max:20'],
            'facilities.*' => ['string', Rule::in(VenueFacility::values())],
        ];
    }

    /**
     * @return array<int, string>
     */
    private function storeImages(Request $request): array
    {
        $images = [];

        foreach ($request->file('images', []) as $image) {
            $images[] = '/storage/'.$image->store('venues', 'public');
        }

        return $images;
    }

    private function deleteImageFile(string $image): void
    {
        if (str_starts_with($image, '/storage/')) {
            Storage::disk('public')->delete(Str::after($image, '/storage/'));
        }
    }
}
