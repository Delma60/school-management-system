# How Permissions Work - Developer Guide

## Quick Overview

The permission system lets you control who can do what in your application. It works like this:

1. **Permissions** are individual actions (e.g., "create classroom", "edit exam")
2. **Roles** contain multiple permissions (e.g., Teacher role has specific permissions)
3. **Users** are assigned roles, which give them their permissions
4. **Authorization** happens when a user tries to perform an action - the system checks if they have permission

### Example Flow
```
User (John) 
  → has Role (Teacher) 
    → has Permissions (classroom.view, attendance.create, exam.manage-results)
      → can perform those actions
      → cannot perform user.delete (doesn't have that permission)
```

---

## How It Works - The Architecture

### 1. Database Structure

```
┌─────────────┐       ┌──────────────────┐       ┌─────────────────┐
│   users     │       │  roles           │       │  permissions    │
├─────────────┤       ├──────────────────┤       ├─────────────────┤
│ id          │───┐   │ id               │───┬───│ id              │
│ name        │   └──→│ name             │   │   │ name            │
│ email       │       │ slug             │   │   │ slug (unique!)  │
│ role_id     │       └──────────────────┘   │   │ description     │
└─────────────┘                              │   │ group           │
                  ┌─────────────────────┐    │   └─────────────────┘
                  │ role_permission     │    │
                  ├─────────────────────┤    │
                  │ id                  │    │
                  │ role_id─────────────┼────┤
                  │ permission_id───────┼────┘
                  └─────────────────────┘
```

### 2. Key Concepts

**Permission Slug**: A unique, machine-readable ID for each permission
- Format: `resource.action`
- Examples: `classroom.create`, `attendance.edit`, `exam.manage-results`
- Used in code to check permissions

**Permission Group**: Organizes permissions visually
- Examples: "Academics", "Attendance", "Exams & Marks", "User Management"
- Purely organizational, doesn't affect functionality

**Role Permissions**: A many-to-many relationship
- One role can have many permissions
- One permission can belong to many roles
- Stored in `role_permission` pivot table

---

## How to Add New Authorization to Content

### Step 1: Create a New Permission

**Location**: `database/seeders/PermissionSeeder.php`

Add your new permission to the `$permissions` array:

```php
[
    'name' => 'View Reports',
    'slug' => 'reports.view',
    'description' => 'Can access system reports',
    'group' => 'Reports',
],
```

**Important**: The `slug` must be unique and follow the `resource.action` pattern.

Then run:
```bash
php artisan db:seed --class=PermissionSeeder
```

### Step 2: Assign Permission to Roles

**Location**: `database/seeders/RolePermissionSeeder.php`

Find the role you want to update and add the permission slug:

```php
// Teacher permissions
$teacherRole = Role::where('slug', 'teacher')->first();
if ($teacherRole) {
    $teacherPermissionIds = Permission::whereIn('slug', [
        'classroom.view',
        'attendance.create',
        'exam.manage-results',
        'reports.view',  // ← Add your new permission
    ])->pluck('id')->toArray();

    $teacherRole->permissions()->sync($teacherPermissionIds);
}
```

Then run:
```bash
php artisan db:seed --class=RolePermissionSeeder
```

### Step 3: Protect Your Controller

**In your controller, add authorization checks:**

```php
<?php
namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class ReportController extends Controller
{
    use AuthorizesRequests;

    public function index()
    {
        // Method 1: Simple permission check
        if (!auth()->user()->hasPermission('reports.view')) {
            abort(403, 'You do not have permission to view reports');
        }

        $reports = Report::all();
        return view('reports.index', compact('reports'));
    }

    public function generate()
    {
        // Method 2: Using gate
        $this->authorize('generate-reports');

        // Generate report logic here
    }

    public function export(Report $report)
    {
        // Method 3: Direct check
        if (!auth()->user()->hasPermission('reports.export')) {
            abort(403);
        }

        // Export logic
    }
}
```

### Step 4: Protect Your Routes (Optional)

**In `routes/web.php`:**

```php
Route::middleware(['auth'])->group(function () {
    // Public for authenticated users
    Route::get('/reports', [ReportController::class, 'index']);

    // Protected - requires specific permission
    Route::post('/reports/generate', [ReportController::class, 'generate'])
        ->middleware('permission:reports.generate');

    Route::get('/reports/{report}/export', [ReportController::class, 'export'])
        ->middleware('permission:reports.export');
});
```

### Step 5: Protect Your Views (Optional)

**In your Blade templates:**

```blade
<!-- Show button only if user has permission -->
@if(auth()->user()->hasPermission('reports.generate'))
    <button class="btn btn-primary" onclick="generateReport()">
        Generate Report
    </button>
@endif

<!-- Using Blade's @can directive -->
@can('manage-staff')
    <a href="{{ route('staff.index') }}">Manage Staff</a>
@endcan

<!-- Multiple conditions -->
@if(auth()->user()->hasAnyPermission(['reports.view', 'reports.generate']))
    <div class="reports-section">
        <!-- Show reports section -->
    </div>
@endif
```

---

## Real Examples from Your Project

### Example 1: Classroom Management

**Permission added** (already in PermissionSeeder):
```php
['slug' => 'classroom.create', 'name' => 'Create Classroom'],
['slug' => 'classroom.edit', 'name' => 'Edit Classroom'],
['slug' => 'classroom.delete', 'name' => 'Delete Classroom'],
```

**In RolesController** (already done):
```php
public function store(Request $request)
{
    $this->authorize('create', new Classroom());
    // Create classroom logic
}

public function update(Request $request, Role $role)
{
    $this->authorize('update', $role);
    // Update logic
}
```

### Example 2: Adding "Archive Classroom" Permission

**Step 1: Add to PermissionSeeder**
```php
[
    'name' => 'Archive Classroom',
    'slug' => 'classroom.archive',
    'description' => 'Can archive inactive classrooms',
    'group' => 'Academics',
],
```

**Step 2: Assign to Staff in RolePermissionSeeder**
```php
$staffPermissionIds = Permission::whereIn('slug', [
    'classroom.view',
    'classroom.create',
    'classroom.edit',
    'classroom.archive',  // ← Add this
    // ... other permissions
])->pluck('id')->toArray();

$staffRole->permissions()->sync($staffPermissionIds);
```

**Step 3: Add to ClassroomPolicy**
```php
public function archive(User $user, Classroom $classroom): bool
{
    return $user->hasPermission('classroom.archive');
}
```

**Step 4: Use in Controller**
```php
class ClassroomController extends Controller
{
    public function archive(Classroom $classroom)
    {
        $this->authorize('archive', $classroom);
        
        $classroom->update(['archived_at' => now()]);
        return redirect()->back()->with('success', 'Classroom archived');
    }
}
```

**Step 5: Protect Route**
```php
Route::post('/classrooms/{classroom}/archive', [ClassroomController::class, 'archive'])
    ->middleware('permission:classroom.archive');
```

---

## Common Patterns

### Pattern 1: Simple Permission Check
```php
if (auth()->user()->hasPermission('reports.view')) {
    // User can view reports
}
```

### Pattern 2: Any of Multiple Permissions
```php
if (auth()->user()->hasAnyPermission(['reports.view', 'reports.generate'])) {
    // User can do at least one of these
}
```

### Pattern 3: All Permissions Required
```php
if (auth()->user()->hasAllPermissions(['reports.view', 'reports.export'])) {
    // User must have ALL permissions
}
```

### Pattern 4: Check by Role (Admin Bypass)
```php
if (auth()->user()->isAdmin()) {
    // Admins can always do this
}
```

### Pattern 5: Deny with Custom Message
```php
if (!auth()->user()->hasPermission('delete-users')) {
    abort(403, 'You cannot delete users. Contact an administrator.');
}
```

---

## Workflow: Adding New Feature with Authorization

Let's say you want to add a "Print Attendance Sheet" feature available only to teachers and staff.

### Complete Checklist

- [ ] **1. Create Permission**
  ```php
  // In PermissionSeeder.php
  ['slug' => 'attendance.print', 'name' => 'Print Attendance', 'group' => 'Attendance']
  ```

- [ ] **2. Seed Permission**
  ```bash
  php artisan db:seed --class=PermissionSeeder
  ```

- [ ] **3. Assign to Roles**
  ```php
  // In RolePermissionSeeder.php - add to both teacher and staff roles
  'attendance.print',
  ```

- [ ] **4. Seed Roles**
  ```bash
  php artisan db:seed --class=RolePermissionSeeder
  ```

- [ ] **5. Add Controller Method**
  ```php
  class AttendanceController extends Controller
  {
      public function print(Attendance $attendance)
      {
          if (!auth()->user()->hasPermission('attendance.print')) {
              abort(403);
          }
          return response()->download($pdf);
      }
  }
  ```

- [ ] **6. Add Route**
  ```php
  Route::get('/attendance/{attendance}/print', [AttendanceController::class, 'print'])
      ->middleware('permission:attendance.print');
  ```

- [ ] **7. Add View Button**
  ```blade
  @if(auth()->user()->hasPermission('attendance.print'))
      <a href="{{ route('attendance.print', $attendance) }}" class="btn">
          Print Sheet
      </a>
  @endif
  ```

- [ ] **8. Test**
  - Log in as teacher → should see button and can click
  - Log in as student → button hidden and 403 error if URL accessed directly

---

## Permission Architecture Diagram

```
REQUEST
  ↓
ROUTE
  ↓
MIDDLEWARE (Check: Is user authenticated?)
  ├─ No → Redirect to login
  └─ Yes → Continue
  ↓
CONTROLLER METHOD
  ↓
AUTHORIZATION CHECK ($this->authorize() or hasPermission())
  ├─ Is user admin? → YES, allow (all permissions)
  ├─ Does user have permission?
  │  └─ Query: role_permission table for user's role
  ├─ YES → Execute business logic
  └─ NO → abort(403, 'Unauthorized')
  ↓
EXECUTE LOGIC
  ↓
RESPONSE (with data/view)
```

---

## Troubleshooting

### Problem: Permission check always passes
**Solution**: Clear cache
```bash
php artisan cache:clear
php artisan config:clear
```

### Problem: Permission not found in seeders
**Solution**: Make sure permission slug is exactly right (case-sensitive)
```php
// ❌ Wrong - will fail
'attendance.print'  // but seeder has 'attendance.Print'

// ✅ Correct - must match exactly
'attendance.print'  // seeder has 'attendance.print'
```

### Problem: Seeder says table not found
**Solution**: Run migrations first
```bash
php artisan migrate
php artisan db:seed --class=PermissionSeeder
```

### Problem: Users can bypass authorization
**Solution**: Make sure you're checking in the controller, not just the view
```php
// ❌ Not enough - only hides button
@if(auth()->user()->hasPermission('delete-user'))
    <form action="/users/delete"><button>Delete</button></form>
@endif

// ✅ Correct - protects at controller level too
public function destroy(User $user)
{
    if (!auth()->user()->hasPermission('delete-user')) {
        abort(403);
    }
    $user->delete();
}
```

---

## Quick Reference

### Check Permission (Code)
```php
auth()->user()->hasPermission('resource.action')
```

### Check Multiple Permissions
```php
auth()->user()->hasAnyPermission(['resource.action1', 'resource.action2'])
auth()->user()->hasAllPermissions(['resource.action1', 'resource.action2'])
```

### Check Role
```php
auth()->user()->isAdmin()
auth()->user()->isTeacher()
auth()->user()->isStaff()
auth()->user()->isStudent()
```

### In Views
```blade
@if(auth()->user()->hasPermission('resource.action'))
    <!-- Show content -->
@endif
```

### In Routes
```php
Route::post('/path', [Controller::class, 'method'])
    ->middleware('permission:resource.action');
```

---

## Files to Know

| File | Purpose |
|------|---------|
| `app/Models/Permission.php` | Permission model |
| `app/Models/Role.php` | Role model with relationship methods |
| `app/HasRole.php` | User permission checking methods |
| `app/Policies/*Policy.php` | Policy classes for resources |
| `database/seeders/PermissionSeeder.php` | All available permissions |
| `database/seeders/RolePermissionSeeder.php` | Role permission assignments |
| `app/Http/Middleware/CheckPermission.php` | Middleware for route protection |

---

## Need Help?

- **Create a new permission?** Edit `PermissionSeeder.php` and add to the `$permissions` array
- **Assign to a role?** Edit `RolePermissionSeeder.php` and add slug to the role's permission list
- **Protect a route?** Add `.middleware('permission:slug')` to the route
- **Check in code?** Use `auth()->user()->hasPermission('slug')`
- **Show/hide in view?** Use `@if(auth()->user()->hasPermission('slug'))`

---

## Summary

1. **Add permission** → `PermissionSeeder.php`
2. **Assign to role** → `RolePermissionSeeder.php`
3. **Run seeders** → `php artisan db:seed`
4. **Check in code** → `auth()->user()->hasPermission('slug')`
5. **Protect controller** → Wrap with authorization check
6. **Protect view** → Use `@if` directive
7. **Protect route** → Add middleware

Done! ✅
