<?php

namespace App\Policies;

use App\Models\User;
use App\Models\SchoolEvent;

class SchoolEventPolicy
{
    /**
     * Determine whether the user can view any events.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermission('event.view');
    }

    /**
     * Determine whether the user can view the event.
     */
    public function view(User $user, SchoolEvent $event): bool
    {
        return $user->hasPermission('event.view');
    }

    /**
     * Determine whether the user can create events.
     */
    public function create(User $user): bool
    {
        return $user->hasPermission('event.create');
    }

    /**
     * Determine whether the user can update the event.
     */
    public function update(User $user, SchoolEvent $event): bool
    {
        return $user->hasPermission('event.edit');
    }

    /**
     * Determine whether the user can delete the event.
     */
    public function delete(User $user, SchoolEvent $event): bool
    {
        return $user->hasPermission('event.delete');
    }
}
