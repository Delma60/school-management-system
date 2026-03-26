<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Attendance;

class AttendancePolicy
{
    /**
     * Determine whether the user can view any attendance records.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermission('attendance.view');
    }

    /**
     * Determine whether the user can view the attendance record.
     */
    public function view(User $user, Attendance $attendance): bool
    {
        return $user->hasPermission('attendance.view');
    }

    /**
     * Determine whether the user can create attendance records.
     */
    public function create(User $user): bool
    {
        return $user->hasPermission('attendance.create');
    }

    /**
     * Determine whether the user can update the attendance record.
     */
    public function update(User $user, Attendance $attendance): bool
    {
        return $user->hasPermission('attendance.edit');
    }

    /**
     * Determine whether the user can delete the attendance record.
     */
    public function delete(User $user, Attendance $attendance): bool
    {
        return $user->hasPermission('attendance.delete');
    }
}
