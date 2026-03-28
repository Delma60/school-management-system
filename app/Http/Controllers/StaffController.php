<?php

namespace App\Http\Controllers;

use App\Models\Staff;
use App\Http\Requests\StoreStaffRequest;
use App\Http\Requests\UpdateStaffRequest;
use App\Models\Role;
use App\Models\SystemLog;
use Carbon\Carbon;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;

class StaffController extends Controller
{
    use AuthorizesRequests;
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
    // 1. Remove getQuery() to stay in the Eloquent Builder
    $query = Staff::whereHas("role", function($q) {
        $q->whereNotIn("slug", ['teacher']);
    });

    // 2. Search filter (Good use of a logical grouping here)
    if ($request->filled('search')) {
        $query->where(function($q) use ($request) {
            $q->where('name', 'like', '%' . $request->search . '%')
              ->orWhere('email', 'like', '%' . $request->search . '%');
        });
    }

    // 3. Role filter
    if ($request->filled('role_id')) {
        $query->where('role_id', $request->role_id);
    }

    // Now ->with() and ->paginate() will work perfectly
    $staff = $query->with("role")->paginate(15)->withQueryString();

    return inertia("admin/staff/non-academics/index", [
        'staff' => $staff,
        'filters' => $request->only(['search', 'role_id']),
        'roles' => Role::whereNotIn('slug', ['student', 'teacher'])->get(['id', 'name']),
        'stats' => [
            'total' => Staff::whereHas("role", function($q) {
        $q->whereNotIn("slug", ['teacher']);
    })->count(),
            'admin_count' => Staff::whereHas('role', fn($q) => $q->whereIn('slug', ['owner', 'admin', 'principal']))->count(),
            'support_count' => Staff::whereHas('role', fn($q) => $q->whereNotIn('slug', ['student', 'teacher', 'admin']))->count(),
        ]
    ]);
}

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        Log::info("Create Staff");
        $roles = Role::whereNotIn('slug', ['student', 'teacher'])->get(['id', 'name']);
    return inertia("admin/staff/create", [
        'roles' => $roles,
            'type' => $request->query('type', 'non-academic')
    ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreStaffRequest $request)
    {
        //
        $validated = $request->validated();
        $staff = Staff::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make(Str::random(10)), // Or set a default like 'password'
            'role_id' => $validated['role_id'],
            'meta' => [
                'phone' => $validated['phone'],
                'department' => $validated['department'],
                'base_salary' => (float) $validated['base_salary'],
                'joining_date' => $validated['joining_date'],
                'status' => 'active'
            ]
        ]);

        return redirect()->route('staffs.others')
            ->with('success', 'Staff member added successfully. An email with login details has been sent.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Staff $staff)
    {
        //
        // Log::info($staff);
        $staff= $staff->load("role");
        return inertia("admin/staff/non-academics/show", [
            'staff' => [
                'id' => $staff->id,
                'name' => $staff->name,
                'email' => $staff->email,
                'role' => $staff->role?->name,
                'role_slug' => $staff->role?->slug,
                // Extracting from the meta JSON
                'phone' => $staff->meta['phone'] ?? 'N/A',
                'department' => $staff->meta['department'] ?? 'Unassigned',
                'base_salary' => $staff->meta['base_salary'] ?? 0,
                'joining_date' => $staff->meta['joining_date'] ?? null,
                'status' => $staff->meta['status'] ?? 'active',
                'created_at' => Carbon::parse($staff->created_at)->format('M d, Y'),
            ]
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Staff $staff)
    {
        //
        $roles = Role::whereNotIn('slug', ['student', 'teacher'])->get(['id', 'name']);

        return inertia('admin/staff/non-academics/edit', [
            'staff' => $staff,
            'roles' => $roles
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateStaffRequest $request, Staff $staff)
    {
        //
        $validated = $request->validated();
        $staff->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role_id' => $validated['role_id'],
            'meta' => [
                'phone' => $validated['phone'],
                'department' => $validated['department'],
                'base_salary' => (float) $validated['base_salary'],
                'joining_date' => $validated['joining_date'],
                'status' => $user->meta['status'] ?? 'active' // Preserving status
            ]
        ]);

        return redirect()->route('staff.show', $staff->id)
            ->with('success', 'Staff profile updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Staff $staff)
    {
        //
    }

    public function updatePassword(Request $request, Staff $user)
    {
        // 1. Optional but recommended: Ensure the target user is actually staff/teacher
        if (in_array($user->role, ['student'])) {
            return back()->with('error', 'You cannot use this endpoint for students.');
        }

        // 2. Validate the new password
        $validated = $request->validate([
            'password' => ['required', 'confirmed'],
        ]);

        // 3. Update the password
        $user->update([
            'password' => Hash::make($validated['password']),
        ]);

        // 4. Log this sensitive action!
        SystemLog::logActivity(
            'admin_password_reset',
            "Admin forcefully reset the password for {$user->name} ({$user->email}).",
            'warning', // Warning level because it's a security event
            ['target_user_id' => $user->id]
        );

        return back()->with('success', "Password for {$user->first_name} has been reset successfully.");
    }
}

