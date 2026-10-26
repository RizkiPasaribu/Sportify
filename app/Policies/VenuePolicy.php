<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Venue;

class VenuePolicy
{
    public function view(?User $user, Venue $venue): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return $user->isOwner() || $user->isAdmin();
    }

    public function update(User $user, Venue $venue): bool
    {
        return $user->isAdmin() || $venue->owner_id === $user->id;
    }

    public function delete(User $user, Venue $venue): bool
    {
        return $this->update($user, $venue);
    }

    public function manageFields(User $user, Venue $venue): bool
    {
        return $this->update($user, $venue);
    }
}
