<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\Permission;
use App\Models\SystemLog;
use Illuminate\Http\Request;

class RolesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $this->authorize('viewAny', new \App\Models\User());

        $roles = Role::with('permissions')->get();
        $permissionGroups = Permission::all()
            ->groupBy('group')
            ->map(function ($permissions) {
                return $permissions->map(function ($permission) {
                    return [
                        'id' => $permission->id,
                        'label' => $permission->name,
                        'description' => $permission->description,
                        'slug' => $permission->slug,
                    ];
                })->toArray();
            })
            ->toArray();

        return inertia("admin/roles/index", compact("roles", 'permissionGroups'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $this->authorize('create', new \App\Models\User());

        $permissionGroups = Permission::all()
            ->groupBy('group')
            ->map(function ($permissions) {
                return $permissions->map(function ($permission) {
                    return [
                        'id' => $permission->id,
                        'label' => $permission->name,
                        'description' => $permission->description,
                        'slug' => $permission->slug,
                    ];
                })->toArray();
            })
            ->toArray();

        return inertia("admin/roles/create", compact('permissionGroups'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $this->authorize('create', new \App\Models\User());

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:roles,name',
            'slug' => 'required|string|max:50|unique:roles,slug',
            'permissions' => 'array',
            'permissions.*' => 'exists:permissions,id',
        ]);

        $role = Role::create([
            'name' => $validated['name'],
            'slug' => $validated['slug'],
        ]);

        if (!empty($validated['permissions'])) {
            $role->permissions()->sync($validated['permissions']);
        }

        // Inside the method that assigns roles/permissions to a user:
        SystemLog::logActivity(
            'role_assigned', 
            "Assigned the '{$role->name}' role to User ID: {$user->id}",
            'warning', // Warning level because it's a security-sensitive action
            ['assigned_by' => auth()->id(), 'target_user' => $user->email]
        );

        return redirect()->route('roles.index')
            ->with('success', "Role '{$role->name}' created successfully.");
    }

    /**
     * Display the specified resource.
     */
    public function show(Role $role)
    {
        $this->authorize('view', new \App\Models\User());

        return inertia("admin/roles/show", [
            'role' => $role->load('permissions'),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Role $role)
    {
        $this->authorize('update', new \App\Models\User());

        $permissionGroups = Permission::all()
            ->groupBy('group')
            ->map(function ($permissions) {
                return $permissions->map(function ($permission) {
                    return [
                        'id' => $permission->id,
                        'label' => $permission->name,
                        'description' => $permission->description,
                        'slug' => $permission->slug,
                    ];
                })->toArray();
            })
            ->toArray();

        $rolePermissionIds = $role->permissions()->pluck('id')->toArray();

        return inertia("admin/roles/edit", compact('role', 'permissionGroups', 'rolePermissionIds'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Role $role)
    {
        $this->authorize('update', new \App\Models\User());

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:roles,name,' . $role->id,
            'slug' => 'required|string|max:50|unique:roles,slug,' . $role->id,
            'permissions' => 'array',
            'permissions.*' => 'exists:permissions,id',
        ]);

        $role->update([
            'name' => $validated['name'],
            'slug' => $validated['slug'],
        ]);

        if (isset($validated['permissions'])) {
            $role->permissions()->sync($validated['permissions']);
        }

        return redirect()->route('roles.index')
            ->with('success', "Role '{$role->name}' updated successfully.");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Role $role)
    {
        $this->authorize('delete', new \App\Models\User());

        // Prevent deleting admin role
        if ($role->slug === 'admin') {
            return redirect()->back()
                ->with('error', 'Cannot delete the Admin role');
        }

        $role->permissions()->detach();
        $role->delete();

        return redirect()->route('roles.index')
            ->with('success', 'Role deleted successfully.');
    }
}

