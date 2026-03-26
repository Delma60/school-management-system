<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    /**
     * Determine whether the user can view any users.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermission('user.view');
    }

    /**
     * Determine whether the user can view the user.
     */
    public function view(User $user, User $model): bool
    {
        return $user->hasPermission('user.view');
    }

    /**
     * Determine whether the user can create users.
     */
    public function create(User $user): bool
    {
        return $user->hasPermission('user.create');
    }

    /**
     * Determine whether the user can update the user.
     */
    public function update(User $user, User $model): bool
    {
        return $user->hasPermission('user.edit');
    }

    /**
     * Determine whether the user can delete the user.
     */
    public function delete(User $user, User $model): bool
    {
        return $user->hasPermission('user.delete');
    }

    /**
     * Determine whether the user can assign roles.
     */
    public function assignRole(User $user): bool
    {
        return $user->hasPermission('user.assign-role');
    }
}
