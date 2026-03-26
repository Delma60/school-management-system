<?php

namespace App\Policies;

use App\Models\FeeType;
use App\Models\User;

class FeePolicy
{
    /**
     * Determine whether the user can view any fee types.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermission('fee.view');
    }

    /**
     * Determine whether the user can view the fee type.
     */
    public function view(User $user, FeeType $feeType): bool
    {
        return $user->hasPermission('fee.view');
    }

    /**
     * Determine whether the user can create fee types.
     */
    public function create(User $user): bool
    {
        return $user->hasPermission('fee.create');
    }

    /**
     * Determine whether the user can update the fee type.
     */
    public function update(User $user, FeeType $feeType): bool
    {
        return $user->hasPermission('fee.edit');
    }

    /**
     * Determine whether the user can delete the fee type.
     */
    public function delete(User $user, FeeType $feeType): bool
    {
        return $user->hasPermission('fee.delete');
    }
}
