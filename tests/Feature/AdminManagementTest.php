<?php

namespace Tests\Feature;

use App\Enums\BookingStatus;
use App\Enums\PaymentStatus;
use App\Enums\UserRole;
use App\Models\Booking;
use App\Models\Field;
use App\Models\Payment;
use App\Models\User;
use App\Models\Venue;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_update_another_users_role(): void
    {
        $admin = User::factory()->admin()->create();
        $user = User::factory()->create();

        $this->actingAs($admin)
            ->patch(route('admin.users.role', $user), ['role' => 'owner'])
            ->assertSessionHas('success');

        $this->assertSame(UserRole::Owner, $user->refresh()->role);
    }

    public function test_admin_cannot_change_their_own_role(): void
    {
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)
            ->patch(route('admin.users.role', $admin), ['role' => 'customer'])
            ->assertSessionHas('error');

        $this->assertSame(UserRole::Admin, $admin->refresh()->role);
    }

    public function test_admin_can_delete_another_user(): void
    {
        $admin = User::factory()->admin()->create();
        $user = User::factory()->create();

        $this->actingAs($admin)
            ->delete(route('admin.users.destroy', $user))
            ->assertSessionHas('success');

        $this->assertDatabaseMissing('users', ['id' => $user->id]);
    }

    public function test_admin_can_cancel_a_booking_and_refund_the_payment(): void
    {
        $admin = User::factory()->admin()->create();
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

        $this->actingAs($admin)
            ->post(route('admin.bookings.cancel', $booking))
            ->assertSessionHas('success', fn (string $message): bool => str_contains($message, 'direfund'));

        $booking->refresh();
        $this->assertSame(BookingStatus::Cancelled, $booking->status);
        $this->assertSame(PaymentStatus::Refunded, $booking->payment_status);
        $this->assertDatabaseHas('payments', [
            'booking_id' => $booking->id,
            'status' => 'refunded',
        ]);
    }

    public function test_non_admin_cannot_access_admin_routes(): void
    {
        $customer = User::factory()->create();

        $this->actingAs($customer)
            ->get(route('admin.dashboard'))
            ->assertForbidden();
    }

    public function test_admin_can_view_the_management_pages(): void
    {
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)->get(route('admin.dashboard'))->assertOk();
        $this->actingAs($admin)->get(route('admin.users.index'))->assertOk();
        $this->actingAs($admin)->get(route('admin.venues.index'))->assertOk();
        $this->actingAs($admin)->get(route('admin.bookings.index'))->assertOk();
    }
}
