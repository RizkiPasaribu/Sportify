<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use App\Models\Field;
use App\Models\OperatingHour;
use App\Models\Venue;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class FieldController extends Controller
{
    /**
     * Display the fields belonging to a venue.
     */
    public function index(Venue $venue): Response
    {
        $this->authorize('manageFields', $venue);

        $fields = $venue->fields()
            ->with('operatingHours')
            ->withCount('bookings')
            ->orderBy('name')
            ->get();

        return Inertia::render('Owner/Fields/Index', [
            'venue' => $venue,
            'fields' => $fields,
        ]);
    }

    /**
     * Show the form for creating a new field.
     */
    public function create(Venue $venue): Response
    {
        $this->authorize('manageFields', $venue);

        return Inertia::render('Owner/Fields/Create', [
            'venue' => $venue,
            'sportTypes' => ['futsal', 'badminton', 'tennis', 'basket', 'voli'],
        ]);
    }

    /**
     * Store a newly created field with its operating hours.
     */
    public function store(Request $request, Venue $venue): RedirectResponse
    {
        $this->authorize('manageFields', $venue);

        $validated = $this->validatePayload($request);

        DB::transaction(function () use ($venue, $validated): void {
            $field = $venue->fields()->create([
                'name' => $validated['name'],
                'sport_type' => $validated['sport_type'],
                'price_per_hour' => $validated['price_per_hour'],
                'is_active' => $validated['is_active'],
            ]);

            $this->syncOperatingHours($field, $validated['hours']);
        });

        return redirect()
            ->route('owner.venues.fields.index', $venue)
            ->with('success', 'Lapangan berhasil ditambahkan.');
    }

    /**
     * Show the form for editing a field.
     */
    public function edit(Venue $venue, Field $field): Response
    {
        $this->authorize('update', $field);
        abort_unless($field->venue_id === $venue->id, 404);

        $field->load('operatingHours');

        return Inertia::render('Owner/Fields/Edit', [
            'venue' => $venue,
            'field' => $field,
            'sportTypes' => ['futsal', 'badminton', 'tennis', 'basket', 'voli'],
        ]);
    }

    /**
     * Update the specified field.
     */
    public function update(Request $request, Venue $venue, Field $field): RedirectResponse
    {
        $this->authorize('update', $field);
        abort_unless($field->venue_id === $venue->id, 404);

        $validated = $this->validatePayload($request);

        DB::transaction(function () use ($field, $validated): void {
            $field->update([
                'name' => $validated['name'],
                'sport_type' => $validated['sport_type'],
                'price_per_hour' => $validated['price_per_hour'],
                'is_active' => $validated['is_active'],
            ]);

            $this->syncOperatingHours($field, $validated['hours']);
        });

        return redirect()
            ->route('owner.venues.fields.index', $venue)
            ->with('success', 'Data lapangan berhasil diperbarui.');
    }

    /**
     * Remove the specified field.
     */
    public function destroy(Venue $venue, Field $field): RedirectResponse
    {
        $this->authorize('delete', $field);
        abort_unless($field->venue_id === $venue->id, 404);

        $field->delete();

        return redirect()
            ->route('owner.venues.fields.index', $venue)
            ->with('success', 'Lapangan berhasil dihapus.');
    }

    /**
     * @return array<string, mixed>
     */
    private function validatePayload(Request $request): array
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'sport_type' => ['required', Rule::in(['futsal', 'badminton', 'tennis', 'basket', 'voli'])],
            'price_per_hour' => ['required', 'numeric', 'min:0', 'max:99999999'],
            'is_active' => ['boolean'],
            'hours' => ['required', 'array', 'size:7'],
            'hours.*.day_of_week' => ['required', 'integer', 'between:0,6', 'distinct'],
            'hours.*.open_time' => ['required', 'date_format:H:i'],
            'hours.*.close_time' => ['required', 'date_format:H:i'],
            'hours.*.is_closed' => ['boolean'],
        ]);

        foreach (array_values($validated['hours']) as $index => $hour) {
            if (! ($hour['is_closed'] ?? false) && $hour['close_time'] <= $hour['open_time']) {
                throw ValidationException::withMessages([
                    "hours.{$index}.close_time" => 'Jam tutup harus lebih lambat dari jam buka.',
                ]);
            }
        }

        $validated['is_active'] = (bool) ($validated['is_active'] ?? true);

        return $validated;
    }

    /**
     * @param  array<int, array{day_of_week: int, open_time: string, close_time: string, is_closed?: bool}>  $hours
     */
    private function syncOperatingHours(Field $field, array $hours): void
    {
        foreach (array_values($hours) as $hour) {
            OperatingHour::updateOrCreate(
                [
                    'field_id' => $field->id,
                    'day_of_week' => $hour['day_of_week'],
                ],
                [
                    'open_time' => $hour['open_time'],
                    'close_time' => $hour['close_time'],
                    'is_closed' => (bool) ($hour['is_closed'] ?? false),
                ],
            );
        }
    }
}
