<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Classroom;

class ClassroomPolicy
{
    /**
     * Determine whether the user can view any classrooms.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermission('classroom.view');
    }

    /**
     * Determine whether the user can view the classroom.
     */
    public function view(User $user, Classroom $classroom): bool
    {
        return $user->hasPermission('classroom.view');
    }

    /**
     * Determine whether the user can create classrooms.
     */
    public function create(User $user): bool
    {
        return $user->hasPermission('classroom.create');
    }

    /**
     * Determine whether the user can update the classroom.
     */
    public function update(User $user, Classroom $classroom): bool
    {
        return $user->hasPermission('classroom.edit');
    }

    /**
     * Determine whether the user can delete the classroom.
     */
    public function delete(User $user, Classroom $classroom): bool
    {
        return $user->hasPermission('classroom.delete');
    }
}
