<?php

namespace Tests\Feature;

use App\Models\Booking;
use App\Models\Field;
use App\Models\OperatingHour;
use App\Models\User;
use App\Models\Venue;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class PageRenderingTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_pages_render(): void
    {
        $venue = Venue::factory()->create();
        Field::factory()->create(['venue_id' => $venue->id]);

        $this->get(route('home'))
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page->component('Welcome'));

        $this->get(route('venues.index'))
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page->component('Customer/Venues/Index'));

        $this->get(route('venues.show', $venue))
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page->component('Customer/Venues/Show'));
    }

    public function test_customer_pages_render(): void
    {
        $customer = User::factory()->create();
        $field = $this->createFieldForOwner();
        $booking = Booking::factory()->create([
            'user_id' => $customer->id,
            'field_id' => $field->id,
            'booking_date' => today()->addDay()->toDateString(),
        ]);

        $this->actingAs($customer)->get(route('customer.dashboard'))->assertOk();
        $this->actingAs($customer)->get(route('customer.bookings.index'))->assertOk();
        $this->actingAs($customer)->get(route('customer.bookings.show', $booking))->assertOk();
        $this->actingAs($customer)->get(route('profile.edit'))->assertOk();
    }

    public function test_owner_pages_render(): void
    {
        $owner = User::factory()->owner()->create();
        $venue = Venue::factory()->create(['owner_id' => $owner->id]);
        $field = $this->createField($venue);

        Booking::factory()->create([
            'field_id' => $field->id,
            'booking_date' => today()->addDay()->toDateString(),
        ]);

        $this->actingAs($owner)->get(route('owner.dashboard'))->assertOk();
        $this->actingAs($owner)->get(route('owner.venues.index'))->assertOk();
        $this->actingAs($owner)->get(route('owner.venues.create'))->assertOk();
        $this->actingAs($owner)->get(route('owner.venues.edit', $venue))->assertOk();
        $this->actingAs($owner)->get(route('owner.venues.fields.index', $venue))->assertOk();
        $this->actingAs($owner)->get(route('owner.venues.fields.create', $venue))->assertOk();
        $this->actingAs($owner)->get(route('owner.venues.fields.edit', [$venue, $field]))->assertOk();
        $this->actingAs($owner)->get(route('owner.bookings.index'))->assertOk();
        $this->actingAs($owner)->get(route('owner.reports.index'))->assertOk();
    }

    public function test_admin_pages_render(): void
    {
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)->get(route('admin.dashboard'))->assertOk();
        $this->actingAs($admin)->get(route('admin.users.index'))->assertOk();
        $this->actingAs($admin)->get(route('admin.venues.index'))->assertOk();
        $this->actingAs($admin)->get(route('admin.bookings.index'))->assertOk();
    }

    private function createFieldForOwner(): Field
    {
        $owner = User::factory()->owner()->create();
        $venue = Venue::factory()->create(['owner_id' => $owner->id]);

        return $this->createField($venue);
    }

    private function createField(Venue $venue): Field
    {
        $field = Field::factory()->create(['venue_id' => $venue->id]);

        foreach (range(0, 6) as $dayOfWeek) {
            OperatingHour::factory()->create([
                'field_id' => $field->id,
                'day_of_week' => $dayOfWeek,
            ]);
        }

        return $field;
    }
}
