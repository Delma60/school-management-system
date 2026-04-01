<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Builder;

class Role extends Model
{
    /** @use HasFactory<\Database\Factories\RoleFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'is_admin',
        'is_system',
    ];

    protected $casts = [
        'is_admin' => 'boolean',
        'is_system' => 'boolean',
    ];

    /**
     * Get all permissions for this role
     */
    public function permissions(): BelongsToMany
    {
        return $this->belongsToMany(Permission::class, 'role_permission');
    }

    /**
     * Get all users with this role
     */
    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    /**
     * Check if role has a specific permission
     */
    public function hasPermission(Permission|string $permission): bool
    {
        if (is_string($permission)) {
            return $this->permissions()->where('slug', $permission)->exists();
        }

        return $this->permissions()->where('permission_id', $permission->id)->exists();
    }

    /**
     * Check if role has any of the given permissions
     */
    public function hasAnyPermission(array $permissions): bool
    {
        foreach ($permissions as $permission) {
            if ($this->hasPermission($permission)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Check if role has all of the given permissions
     */
    public function hasAllPermissions(array $permissions): bool
    {
        foreach ($permissions as $permission) {
            if (!$this->hasPermission($permission)) {
                return false;
            }
        }
        return true;
    }

    /**
     * Attach a permission to this role
     */
    public function givePermission(Permission|string $permission): self
    {
        if (is_string($permission)) {
            $permission = Permission::where('slug', $permission)->firstOrFail();
        }

        if (!$this->hasPermission($permission)) {
            $this->permissions()->attach($permission);
        }

        return $this;
    }

    /**
     * Attach multiple permissions to this role
     */
    public function givePermissions(array $permissions): self
    {
        foreach ($permissions as $permission) {
            $this->givePermission($permission);
        }
        return $this;
    }

    /**
     * Revoke a permission from this role
     */
    public function revokePermission(Permission|string $permission): self
    {
        if (is_string($permission)) {
            $permission = Permission::where('slug', $permission)->firstOrFail();
        }

        $this->permissions()->detach($permission);
        return $this;
    }

    /**
     * Revoke multiple permissions from this role
     */
    public function revokePermissions(array $permissions): self
    {
        foreach ($permissions as $permission) {
            $this->revokePermission($permission);
        }
        return $this;
    }

    /**
     * Sync permissions for this role
     */
    public function syncPermissions(array $permissions): self
    {
        $permissionIds = [];

        foreach ($permissions as $permission) {
            if (is_string($permission)) {
                $permission = Permission::where('slug', $permission)->firstOrFail();
            }
            $permissionIds[] = $permission->id;
        }

        $this->permissions()->sync($permissionIds);
        return $this;
    }

    /**
     * Scope: Get admin roles
     */
    public function scopeAdmin(Builder $query): Builder
    {
        return $query->where('is_admin', true);
    }

    /**
     * Scope: Get non-admin roles
     */
    public function scopeNonAdmin(Builder $query): Builder
    {
        return $query->where('is_admin', false);
    }

    /**
     * Scope: Get system roles
     */
    public function scopeSystem(Builder $query): Builder
    {
        return $query->where('is_system', true);
    }

    /**
     * Scope: Search by name or slug
     */
    public function scopeSearch(Builder $query, string $search): Builder
    {
        return $query->where('name', 'like', "%{$search}%")
                     ->orWhere('slug', 'like', "%{$search}%");
    }
}
