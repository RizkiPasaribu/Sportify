<?php

namespace Tests\Feature;

use App\Enums\BookingStatus;
use App\Enums\PaymentStatus;
use App\Models\Booking;
use App\Models\Field;
use App\Models\OperatingHour;
use App\Models\Review;
use App\Models\User;
use App\Models\Venue;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class BookingFlowTest extends TestCase
{
    use RefreshDatabase;

    public function test_customer_can_create_a_booking_and_is_redirected_to_checkout(): void
    {
        $customer = User::factory()->create();
        $field = $this->createField();

        $response = $this->actingAs($customer)->post(route('customer.bookings.store', $field), [
            'booking_date' => today()->addDay()->toDateString(),
            'start_time' => '10:00',
            'end_time' => '12:00',
            'notes' => 'Tolong siapkan bola.',
        ]);

        $booking = Booking::query()->firstOrFail();

        $response->assertRedirect(route('customer.bookings.show', $booking, absolute: false));
        $this->assertSame($customer->id, $booking->user_id);
        $this->assertSame(BookingStatus::Pending, $booking->status);
        $this->assertSame(PaymentStatus::Unpaid, $booking->payment_status);
        $this->assertSame('200000.00', $booking->total_price);
    }

    public function test_overlapping_booking_is_rejected(): void
    {
        $customer = User::factory()->create();
        $otherCustomer = User::factory()->create();
        $field = $this->createField();

        Booking::factory()->create([
            'user_id' => $otherCustomer->id,
            'field_id' => $field->id,
            'booking_date' => today()->addDay()->toDateString(),
            'start_time' => '10:00',
            'end_time' => '11:00',
        ]);

        $response = $this->actingAs($customer)->post(route('customer.bookings.store', $field), [
            'booking_date' => today()->addDay()->toDateString(),
            'start_time' => '10:00',
            'end_time' => '11:00',
        ]);

        $response->assertSessionHasErrors('start_time');
        $this->assertSame(1, Booking::query()->count());
    }

    public function test_non_overlapping_booking_is_allowed(): void
    {
        $customer = User::factory()->create();
        $otherCustomer = User::factory()->create();
        $field = $this->createField();

        Booking::factory()->create([
            'user_id' => $otherCustomer->id,
            'field_id' => $field->id,
            'booking_date' => today()->addDay()->toDateString(),
            'start_time' => '10:00',
            'end_time' => '11:00',
        ]);

        $response = $this->actingAs($customer)->post(route('customer.bookings.store', $field), [
            'booking_date' => today()->addDay()->toDateString(),
            'start_time' => '11:00',
            'end_time' => '12:00',
        ]);

        $response->assertSessionHasNoErrors();
        $this->assertSame(2, Booking::query()->count());
    }

    public function test_booking_outside_operating_hours_is_rejected(): void
    {
        $customer = User::factory()->create();
        $field = $this->createField();

        $response = $this->actingAs($customer)->post(route('customer.bookings.store', $field), [
            'booking_date' => today()->addDay()->toDateString(),
            'start_time' => '07:00',
            'end_time' => '08:00',
        ]);

        $response->assertSessionHasErrors('start_time');
        $this->assertDatabaseCount('bookings', 0);
    }

    public function test_customer_can_pay_and_receive_a_refund_after_cancelling(): void
    {
        $customer = User::factory()->create();
        $field = $this->createField();
        $booking = Booking::factory()->create([
            'user_id' => $customer->id,
            'field_id' => $field->id,
            'booking_date' => today()->addDay()->toDateString(),
            'total_price' => 200000,
        ]);

        $this->actingAs($customer)
            ->post(route('customer.bookings.pay', $booking), [
                'payment_method' => 'bank_transfer',
            ])
            ->assertSessionHasNoErrors();

        $booking->refresh();
        $this->assertSame(PaymentStatus::Paid, $booking->payment_status);
        $this->assertDatabaseHas('payments', [
            'booking_id' => $booking->id,
            'payment_method' => 'bank_transfer',
            'status' => 'paid',
        ]);

        $this->actingAs($customer)
            ->post(route('customer.bookings.cancel', $booking))
            ->assertRedirect(route('customer.bookings.index', absolute: false));

        $booking->refresh();
        $this->assertSame(BookingStatus::Cancelled, $booking->status);
        $this->assertSame(PaymentStatus::Refunded, $booking->payment_status);
        $this->assertDatabaseHas('payments', [
            'booking_id' => $booking->id,
            'status' => 'refunded',
        ]);
    }

    public function test_customer_cannot_view_another_customers_booking(): void
    {
        $customer = User::factory()->create();
        $otherCustomer = User::factory()->create();
        $booking = Booking::factory()->create(['user_id' => $otherCustomer->id]);

        $this->actingAs($customer)
            ->get(route('customer.bookings.show', $booking))
            ->assertForbidden();
    }

    public function test_customer_cannot_access_owner_dashboard(): void
    {
        $customer = User::factory()->create();

        $this->actingAs($customer)
            ->get(route('owner.dashboard'))
            ->assertForbidden();
    }

    public function test_customer_can_review_a_completed_booking(): void
    {
        $customer = User::factory()->create();
        $field = $this->createField();
        $booking = Booking::factory()->completed()->create([
            'user_id' => $customer->id,
            'field_id' => $field->id,
        ]);

        $this->actingAs($customer)
            ->post(route('customer.bookings.review', $booking), [
                'rating' => 5,
                'comment' => 'Lapangan bersih dan pelayanan ramah.',
            ])
            ->assertSessionHasNoErrors();

        $this->assertDatabaseHas('reviews', [
            'booking_id' => $booking->id,
            'user_id' => $customer->id,
            'venue_id' => $field->venue_id,
            'rating' => 5,
            'comment' => 'Lapangan bersih dan pelayanan ramah.',
        ]);
    }

    public function test_customer_cannot_review_a_booking_that_is_not_completed(): void
    {
        $customer = User::factory()->create();
        $field = $this->createField();
        $booking = Booking::factory()->confirmed()->create([
            'user_id' => $customer->id,
            'field_id' => $field->id,
            'booking_date' => today()->addDay()->toDateString(),
        ]);

        $this->actingAs($customer)
            ->post(route('customer.bookings.review', $booking), [
                'rating' => 5,
            ])
            ->assertForbidden();

        $this->assertDatabaseCount('reviews', 0);
    }

    public function test_customer_cannot_review_the_same_booking_twice(): void
    {
        $customer = User::factory()->create();
        $field = $this->createField();
        $booking = Booking::factory()->completed()->create([
            'user_id' => $customer->id,
            'field_id' => $field->id,
        ]);

        Review::factory()->create([
            'booking_id' => $booking->id,
            'user_id' => $customer->id,
            'venue_id' => $field->venue_id,
            'rating' => 4,
        ]);

        $this->actingAs($customer)
            ->post(route('customer.bookings.review', $booking), [
                'rating' => 5,
            ])
            ->assertForbidden();

        $this->assertDatabaseCount('reviews', 1);
    }

    public function test_past_confirmed_bookings_are_completed_when_customer_opens_their_bookings(): void
    {
        $customer = User::factory()->create();
        $field = $this->createField();
        $booking = Booking::factory()->confirmed()->create([
            'user_id' => $customer->id,
            'field_id' => $field->id,
            'booking_date' => today()->subDay()->toDateString(),
            'start_time' => '18:00',
            'end_time' => '20:00',
        ]);

        $this->actingAs($customer)
            ->get(route('customer.bookings.index'))
            ->assertOk();

        $this->assertSame(BookingStatus::Completed, $booking->refresh()->status);
    }

    public function test_customer_can_review_a_past_confirmed_booking_after_it_is_auto_completed(): void
    {
        $customer = User::factory()->create();
        $field = $this->createField();
        $booking = Booking::factory()->confirmed()->create([
            'user_id' => $customer->id,
            'field_id' => $field->id,
            'booking_date' => today()->subDay()->toDateString(),
            'start_time' => '18:00',
            'end_time' => '20:00',
        ]);

        $this->actingAs($customer)
            ->get(route('customer.bookings.index'))
            ->assertOk();

        $this->actingAs($customer)
            ->post(route('customer.bookings.review', $booking), [
                'rating' => 5,
            ])
            ->assertSessionHasNoErrors();

        $this->assertDatabaseHas('reviews', [
            'booking_id' => $booking->id,
            'rating' => 5,
        ]);
    }

    public function test_venue_page_exposes_reviewable_booking_for_an_unreviewed_completed_booking(): void
    {
        $customer = User::factory()->create();
        $field = $this->createField();
        $booking = Booking::factory()->completed()->create([
            'user_id' => $customer->id,
            'field_id' => $field->id,
        ]);

        $this->actingAs($customer)
            ->get(route('venues.show', $field->venue))
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->where('reviewableBooking.id', $booking->id));
    }

    public function test_customer_dashboard_lists_completed_bookings_waiting_for_a_review(): void
    {
        $customer = User::factory()->create();
        $field = $this->createField();
        $booking = Booking::factory()->completed()->create([
            'user_id' => $customer->id,
            'field_id' => $field->id,
        ]);

        $this->actingAs($customer)
            ->get(route('customer.dashboard'))
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->where('pendingReviews.0.id', $booking->id));
    }

    public function test_fully_booked_venues_are_excluded_from_search_for_a_selected_date(): void
    {
        $date = today()->addDay()->toDateString();

        $bookedField = $this->createField();
        Booking::factory()->confirmed()->create([
            'field_id' => $bookedField->id,
            'booking_date' => $date,
            'start_time' => '08:00',
            'end_time' => '22:00',
        ]);

        $availableField = $this->createField();

        $this->get(route('venues.index', ['date' => $date]))
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->has('venues.data', 1)
                ->where('venues.data.0.id', $availableField->venue_id)
                ->where('venues.data.0.available_fields_count', 1));
    }

    private function createField(): Field
    {
        $owner = User::factory()->owner()->create();
        $venue = Venue::factory()->create(['owner_id' => $owner->id]);
        $field = Field::factory()->create([
            'venue_id' => $venue->id,
            'price_per_hour' => 100000,
            'is_active' => true,
        ]);

        foreach (range(0, 6) as $dayOfWeek) {
            OperatingHour::factory()->create([
                'field_id' => $field->id,
                'day_of_week' => $dayOfWeek,
                'open_time' => '08:00',
                'close_time' => '22:00',
                'is_closed' => false,
            ]);
        }

        return $field;
    }
}
