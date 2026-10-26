<?php

namespace App\Policies;

use App\Models\Field;
use App\Models\User;
use App\Models\Venue;

class FieldPolicy
{
    public function create(User $user, Venue $venue): bool
    {
        return $user->isAdmin() || $venue->owner_id === $user->id;
    }

    public function update(User $user, Field $field): bool
    {
        return $user->isAdmin() || $field->venue->owner_id === $user->id;
    }

    public function delete(User $user, Field $field): bool
    {
        return $this->update($user, $field);
    }
}
