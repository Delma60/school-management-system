<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Examination;

class ExaminationPolicy
{
    /**
     * Determine whether the user can view any exams.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermission('exam.view');
    }

    /**
     * Determine whether the user can view the exam.
     */
    public function view(User $user, Examination $examination): bool
    {
        return $user->hasPermission('exam.view');
    }

    /**
     * Determine whether the user can create exams.
     */
    public function create(User $user): bool
    {
        return $user->hasPermission('exam.create');
    }

    /**
     * Determine whether the user can update the exam.
     */
    public function update(User $user, Examination $examination): bool
    {
        return $user->hasPermission('exam.edit');
    }

    /**
     * Determine whether the user can delete the exam.
     */
    public function delete(User $user, Examination $examination): bool
    {
        return $user->hasPermission('exam.delete');
    }

    /**
     * Determine whether the user can manage exam results.
     */
    public function manageResults(User $user): bool
    {
        return $user->hasPermission('exam.manage-results');
    }
}
