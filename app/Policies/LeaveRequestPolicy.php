<?php

namespace App\Policies;

use App\Models\User;
use App\Models\LeaveRequest;

class LeaveRequestPolicy
{
    /**
     * Determine whether the user can view any leave requests.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermission('leave_request.view');
    }

    /**
     * Determine whether the user can view the leave request.
     */
    public function view(User $user, LeaveRequest $leaveRequest): bool
    {
        // Users can view their own leave requests, or users with view permission
        return $user->id === $leaveRequest->user_id || $user->hasPermission('leave_request.view');
    }

    /**
     * Determine whether the user can create leave requests.
     */
    public function create(User $user): bool
    {
        return $user->hasPermission('leave_request.create');
    }

    /**
     * Determine whether the user can update the leave request.
     */
    public function update(User $user, LeaveRequest $leaveRequest): bool
    {
        // Users can only update their own pending leave requests
        return $user->id === $leaveRequest->user_id && $leaveRequest->status === 'pending' && $user->hasPermission('leave_request.edit');
    }

    /**
     * Determine whether the user can delete the leave request.
     */
    public function delete(User $user, LeaveRequest $leaveRequest): bool
    {
        // Users can only delete their own pending leave requests
        return $user->id === $leaveRequest->user_id && $leaveRequest->status === 'pending' && $user->hasPermission('leave_request.delete');
    }

    /**
     * Determine whether the user can approve a leave request (admin only).
     */
    public function approve(User $user, LeaveRequest $leaveRequest): bool
    {
        return $user->hasPermission('leave_request.approve');
    }

    /**
     * Determine whether the user can reject a leave request (admin only).
     */
    public function reject(User $user, LeaveRequest $leaveRequest): bool
    {
        return $user->hasPermission('leave_request.reject');
    }
}
