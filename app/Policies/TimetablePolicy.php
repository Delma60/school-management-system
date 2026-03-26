<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Timetable;

class TimetablePolicy
{
    /**
     * Determine whether the user can view any timetables.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermission('timetable.view');
    }

    /**
     * Determine whether the user can view the timetable.
     */
    public function view(User $user, Timetable $timetable): bool
    {
        return $user->hasPermission('timetable.view');
    }

    /**
     * Determine whether the user can create timetables.
     */
    public function create(User $user): bool
    {
        return $user->hasPermission('timetable.create');
    }

    /**
     * Determine whether the user can update the timetable.
     */
    public function update(User $user, Timetable $timetable): bool
    {
        return $user->hasPermission('timetable.edit');
    }

    /**
     * Determine whether the user can delete the timetable.
     */
    public function delete(User $user, Timetable $timetable): bool
    {
        return $user->hasPermission('timetable.delete');
    }
}
