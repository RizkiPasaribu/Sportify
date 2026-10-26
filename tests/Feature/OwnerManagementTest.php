<?php

namespace Tests\Feature;

use App\Enums\BookingStatus;
use App\Enums\PaymentStatus;
use App\Models\Booking;
use App\Models\Field;
use App\Models\OperatingHour;
use App\Models\Payment;
use App\Models\User;
use App\Models\Venue;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OwnerManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_owner_can_create_a_venue(): void
    {
        $owner = User::factory()->owner()->create();

        $response = $this->actingAs($owner)->post(route('owner.venues.store'), [
            'name' => 'Arena Sportify',
            'city' => 'Bandung',
            'address' => 'Jl. Merdeka No. 10',
            'description' => 'Venue futsal modern.',
            'phone' => '081234567890',
        ]);

        $venue = Venue::query()->firstOrFail();

        $response->assertRedirect(route('owner.venues.fields.index', $venue, absolute: false));
        $this->assertSame($owner->id, $venue->owner_id);
        $this->assertSame('Arena Sportify', $venue->name);
    }

    public function test_owner_cannot_update_another_owners_venue(): void
    {
        $owner = User::factory()->owner()->create();
        $otherOwner = User::factory()->owner()->create();
        $venue = Venue::factory()->create(['owner_id' => $otherOwner->id]);

        $this->actingAs($owner)
            ->put(route('owner.venues.update', $venue), [
                'name' => 'Venue Bajakan',
                'city' => 'Jakarta',
                'address' => 'Jl. Contoh',
            ])
            ->assertForbidden();
    }

    public function test_owner_can_create_a_field_with_operating_hours(): void
    {
        $owner = User::factory()->owner()->create();
        $venue = Venue::factory()->create(['owner_id' => $owner->id]);

        $response = $this->actingAs($owner)->post(route('owner.venues.fields.store', $venue), [
            'name' => 'Lapangan Utama',
            'sport_type' => 'futsal',
            'price_per_hour' => 150000,
            'is_active' => true,
            'hours' => $this->hoursPayload(),
        ]);

        $field = Field::query()->firstOrFail();

        $response->assertRedirect(route('owner.venues.fields.index', $venue, absolute: false));
        $this->assertSame($venue->id, $field->venue_id);
        $this->assertSame(7, OperatingHour::query()->where('field_id', $field->id)->count());
    }

    public function test_owner_can_update_a_field_and_its_hours(): void
    {
        $owner = User::factory()->owner()->create();
        $venue = Venue::factory()->create(['owner_id' => $owner->id]);
        $field = Field::factory()->create(['venue_id' => $venue->id]);

        $hours = $this->hoursPayload();
        $hours[0]['open_time'] = '09:00';
        $hours[0]['close_time'] = '21:00';

        $response = $this->actingAs($owner)->put(
            route('owner.venues.fields.update', [$venue, $field]),
            [
                'name' => 'Lapangan Baru',
                'sport_type' => 'badminton',
                'price_per_hour' => 90000,
                'is_active' => false,
                'hours' => $hours,
            ],
        );

        $response->assertRedirect(route('owner.venues.fields.index', $venue, absolute: false));

        $field->refresh();
        $this->assertSame('Lapangan Baru', $field->name);
        $this->assertSame('badminton', $field->sport_type);
        $this->assertFalse($field->is_active);
        $this->assertDatabaseHas('operating_hours', [
            'field_id' => $field->id,
            'day_of_week' => 0,
            'open_time' => '09:00:00',
        ]);
    }

    public function test_owner_can_delete_a_field(): void
    {
        $owner = User::factory()->owner()->create();
        $venue = Venue::factory()->create(['owner_id' => $owner->id]);
        $field = Field::factory()->create(['venue_id' => $venue->id]);

        $this->actingAs($owner)
            ->delete(route('owner.venues.fields.destroy', [$venue, $field]))
            ->assertRedirect(route('owner.venues.fields.index', $venue, absolute: false));

        $this->assertDatabaseMissing('fields', ['id' => $field->id]);
    }

    public function test_owner_can_confirm_and_complete_a_paid_booking(): void
    {
        $owner = User::factory()->owner()->create();
        $venue = Venue::factory()->create(['owner_id' => $owner->id]);
        $field = Field::factory()->create(['venue_id' => $venue->id]);
        $booking = Booking::factory()->create([
            'field_id' => $field->id,
            'status' => BookingStatus::Pending,
            'payment_status' => PaymentStatus::Paid,
        ]);

        $this->actingAs($owner)
            ->post(route('owner.bookings.confirm', $booking))
            ->assertSessionHas('success');

        $this->assertSame(BookingStatus::Confirmed, $booking->refresh()->status);

        $this->actingAs($owner)
            ->post(route('owner.bookings.complete', $booking))
            ->assertSessionHas('success');

        $this->assertSame(BookingStatus::Completed, $booking->refresh()->status);
    }

    public function test_owner_cannot_confirm_an_unpaid_booking(): void
    {
        $owner = User::factory()->owner()->create();
        $venue = Venue::factory()->create(['owner_id' => $owner->id]);
        $field = Field::factory()->create(['venue_id' => $venue->id]);
        $booking = Booking::factory()->create([
            'field_id' => $field->id,
            'status' => BookingStatus::Pending,
            'payment_status' => PaymentStatus::Unpaid,
        ]);

        $this->actingAs($owner)
            ->post(route('owner.bookings.confirm', $booking))
            ->assertSessionHas('error');

        $this->assertSame(BookingStatus::Pending, $booking->refresh()->status);
    }

    public function test_owner_can_cancel_a_booking_and_refund_the_payment(): void
    {
        $owner = User::factory()->owner()->create();
        $venue = Venue::factory()->create(['owner_id' => $owner->id]);
        $field = Field::factory()->create(['venue_id' => $venue->id]);
        $booking = Booking::factory()->create([
            'field_id' => $field->id,
            'status' => BookingStatus::Confirmed,
            'payment_status' => PaymentStatus::Paid,
        ]);
        Payment::factory()->create([
            'booking_id' => $booking->id,
            'status' => 'paid',
        ]);

        $this->actingAs($owner)
            ->post(route('owner.bookings.cancel', $booking))
            ->assertSessionHas('success');

        $booking->refresh();
        $this->assertSame(BookingStatus::Cancelled, $booking->status);
        $this->assertSame(PaymentStatus::Refunded, $booking->payment_status);
        $this->assertDatabaseHas('payments', [
            'booking_id' => $booking->id,
            'status' => 'refunded',
        ]);
    }

    /**
     * @return array<int, array{day_of_week: int, open_time: string, close_time: string, is_closed: bool}>
     */
    private function hoursPayload(): array
    {
        return collect(range(0, 6))
            ->map(fn (int $day): array => [
                'day_of_week' => $day,
                'open_time' => '08:00',
                'close_time' => '22:00',
                'is_closed' => false,
            ])
            ->all();
    }
}
