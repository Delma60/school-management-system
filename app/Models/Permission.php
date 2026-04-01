<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;

class Permission extends Model
{
    /** @use HasFactory<\Database\Factories\PermissionFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'group',
    ];

    /**
     * Get all roles that have this permission
     */
    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class, 'role_permission');
    }

    /**
     * Get all users that have this permission through roles
     */
    public function users(): BelongsToMany
    {
        return $this->hasManyThrough(User::class, Role::class, 'id', 'role_id', 'id', 'id')
                    ->distinct();
    }

    /**
     * Check if this permission is assigned to any role
     */
    public function isAssigned(): bool
    {
        return $this->roles()->exists();
    }

    /**
     * Get roles using this permission
     */
    public function getRolesAttribute(): Collection
    {
        return $this->roles;
    }

    /**
     * Get count of roles using this permission
     */
    public function getRoleCount(): int
    {
        return $this->roles()->count();
    }

    /**
     * Scope: Get permissions by group
     */
    public function scopeByGroup(Builder $query, string $group): Builder
    {
        return $query->where('group', $group);
    }

    /**
     * Scope: Get all permission groups
     */
    public function scopeGroups(Builder $query): Builder
    {
        return $query->select('group')->distinct()->orderBy('group');
    }

    /**
     * Scope: Get assigned permissions (used by at least one role)
     */
    public function scopeAssigned(Builder $query): Builder
    {
        return $query->whereHas('roles');
    }

    /**
     * Scope: Get unassigned permissions (not used by any role)
     */
    public function scopeUnassigned(Builder $query): Builder
    {
        return $query->whereDoesntHave('roles');
    }

    /**
     * Scope: Search by name or slug
     */
    public function scopeSearch(Builder $query, string $search): Builder
    {
        return $query->where('name', 'like', "%{$search}%")
                     ->orWhere('slug', 'like', "%{$search}%")
                     ->orWhere('description', 'like', "%{$search}%");
    }

    /**
     * Scope: Get permissions by multiple groups
     */
    public function scopeByGroups(Builder $query, array $groups): Builder
    {
        return $query->whereIn('group', $groups);
    }
}
