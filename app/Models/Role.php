<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Role extends Model
{
    /** @use HasFactory<\Database\Factories\RoleFactory> */
    use HasFactory;

    public $fillable = [
        "name",
        "slug"
    ];

    /**
     * Get all permissions for this role
     */
    public function permissions(): BelongsToMany
    {
        return $this->belongsToMany(Permission::class, 'role_permission');
    }

    /**
     * Attach a permission to this role
     */
    public function givePermission(Permission|string $permission): void
    {
        if (is_string($permission)) {
            $permission = Permission::where('slug', $permission)->firstOrFail();
        }

        if (!$this->permissions()->where('permission_id', $permission->id)->exists()) {
            $this->permissions()->attach($permission);
        }
    }

    /**
     * Revoke a permission from this role
     */
    public function revokePermission(Permission|string $permission): void
    {
        if (is_string($permission)) {
            $permission = Permission::where('slug', $permission)->firstOrFail();
        }

        $this->permissions()->detach($permission);
    }

    /**
     * Sync permissions for this role
     */
    public function syncPermissions(array $permissions): void
    {
        $permissionIds = [];

        foreach ($permissions as $permission) {
            if (is_string($permission)) {
                $permission = Permission::where('slug', $permission)->firstOrFail();
            }
            $permissionIds[] = $permission->id;
        }

        $this->permissions()->sync($permissionIds);
    }
}
