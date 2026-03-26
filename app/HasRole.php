<?php

namespace App;

use App\Models\Role;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

trait HasRole
{
    /**
     * Relationship to the Role model
     */
    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }

    /**
     * Check if the user has a specific role by slug
     */
    public function hasRole(string $slug): bool
    {
        return $this->role && $this->role->slug === $slug;
    }

    /**
     * Check if user has a specific permission by slug
     */
    public function hasPermission(string $permissionSlug): bool
    {
        if (!$this->role) {
            return false;
        }

        // Admins have all permissions
        if ($this->isAdmin()) {
            return true;
        }

        return $this->role->permissions()
            ->where('slug', $permissionSlug)
            ->exists();
    }

    /**
     * Check if user has any of the given permissions
     */
    public function hasAnyPermission(array $permissionSlugs): bool
    {
        foreach ($permissionSlugs as $slug) {
            if ($this->hasPermission($slug)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Check if user has all given permissions
     */
    public function hasAllPermissions(array $permissionSlugs): bool
    {
        foreach ($permissionSlugs as $slug) {
            if (!$this->hasPermission($slug)) {
                return false;
            }
        }
        return true;
    }

    /**
     * Helper methods for common school roles
     */
    public function isAdmin(): bool
    {
        return $this->hasRole('admin');
    }

    public function isTeacher(): bool
    {
        return $this->hasRole('teacher');
    }

    public function isStudent(): bool
    {
        return $this->hasRole('student');
    }

    public function isStaff(): bool
    {
        return $this->hasRole('staff');
    }
}
