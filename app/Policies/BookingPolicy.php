<?php

namespace App\Policies;

use App\Enums\BookingStatus;
use App\Models\Booking;
use App\Models\User;

class BookingPolicy
{
    public function view(User $user, Booking $booking): bool
    {
        return $user->isAdmin()
            || $booking->user_id === $user->id
            || $booking->field->venue->owner_id === $user->id;
    }

    public function pay(User $user, Booking $booking): bool
    {
        return $booking->user_id === $user->id;
    }

    public function cancel(User $user, Booking $booking): bool
    {
        return $booking->user_id === $user->id
            && in_array($booking->status, [BookingStatus::Pending, BookingStatus::Confirmed], true);
    }

    public function review(User $user, Booking $booking): bool
    {
        return $booking->user_id === $user->id
            && $booking->status === BookingStatus::Completed
            && $booking->review === null;
    }

    public function manage(User $user, Booking $booking): bool
    {
        return $user->isAdmin() || $booking->field->venue->owner_id === $user->id;
    }
}
