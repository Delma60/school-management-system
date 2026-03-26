# Quick Start: Adding Permissions in 5 Minutes

Copy these templates and fill in your details.

## Template 1: Add a New Permission

**File**: `database/seeders/PermissionSeeder.php`

Find the `$permissions` array and add:

```php
[
    'name' => 'YOUR_NAME_HERE',           // e.g., "Delete Classroom"
    'slug' => 'resource.action',          // e.g., "classroom.delete"
    'description' => 'Can do something',  // e.g., "Can delete inactive classrooms"
    'group' => 'GROUP_NAME',              // e.g., "Academics"
],
```

**Example: "Archive Event" permission**
```php
[
    'name' => 'Archive Event',
    'slug' => 'event.archive',
    'description' => 'Can archive past events',
    'group' => 'School Events',
],
```

**Run**: `php artisan db:seed --class=PermissionSeeder`

---

## Template 2: Assign Permission to a Role

**File**: `database/seeders/RolePermissionSeeder.php`

Find the role section and add your slug:

### For Admin (gets all permissions automatically)
// No action needed - admins have all permissions

### For Staff
```php
$staffPermissionIds = Permission::whereIn('slug', [
    'classroom.view',
    'event.archive',      // ← Add your slug here
    // ... existing permissions
])->pluck('id')->toArray();

$staffRole->permissions()->sync($staffPermissionIds);
```

### For Teachers
```php
$teacherPermissionIds = Permission::whereIn('slug', [
    'classroom.view',
    'event.archive',      // ← Add your slug here (if needed)
    // ... existing permissions
])->pluck('id')->toArray();

$teacherRole->permissions()->sync($teacherPermissionIds);
```

### For Students
```php
$studentPermissionIds = Permission::whereIn('slug', [
    'event.view',
    // ... (students have most limited permissions)
])->pluck('id')->toArray();

$studentRole->permissions()->sync($studentPermissionIds);
```

**Run**: `php artisan db:seed --class=RolePermissionSeeder`

---

## Template 3: Protect Controller Method

**File**: `app/Http/Controllers/YourController.php`

```php
<?php
namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class YourController extends Controller
{
    use AuthorizesRequests;

    public function yourMethod()
    {
        // Add this line at the start of the protected method:
        if (!auth()->user()->hasPermission('resource.action')) {
            abort(403, 'You do not have permission to do this');
        }

        // Your logic here
    }
}
```

**Example: Protect archive event**
```php
public function archive(Event $event)
{
    if (!auth()->user()->hasPermission('event.archive')) {
        abort(403, 'You cannot archive events');
    }

    $event->update(['archived_at' => now()]);
    return redirect()->back()->with('success', 'Event archived');
}
```

---

## Template 4: Protect Route (Optional)

**File**: `routes/web.php`

```php
Route::post('/resource/{id}/action', [YourController::class, 'yourMethod'])
    ->middleware('permission:resource.action');
```

**Example: Protect archive route**
```php
Route::post('/events/{event}/archive', [EventController::class, 'archive'])
    ->middleware('permission:event.archive');
```

---

## Template 5: Show/Hide Button in View

**File**: `resources/views/your-view.blade.php`

```blade
@if(auth()->user()->hasPermission('resource.action'))
    <button onclick="doAction()">Action Button</button>
@endif
```

**Example: Archive button**
```blade
@if(auth()->user()->hasPermission('event.archive'))
    <button class="btn btn-warning" onclick="archiveEvent({{ $event->id }})">
        Archive Event
    </button>
@endif
```

---

## Complete Example: "Export Report" Feature

Follow these steps exactly:

### Step 1: Add Permission
**Edit**: `database/seeders/PermissionSeeder.php`

```php
// Find the $permissions array and add:
[
    'name' => 'Export Reports',
    'slug' => 'reports.export',
    'description' => 'Can export reports to file',
    'group' => 'Reports',
],
```

**Run**: `php artisan db:seed --class=PermissionSeeder`

### Step 2: Assign to Roles
**Edit**: `database/seeders/RolePermissionSeeder.php`

Add `'reports.export'` to staff role:
```php
$staffPermissionIds = Permission::whereIn('slug', [
    'reports.view',
    'reports.generate',
    'reports.export',  // ← Add this
    // ... other permissions
])->pluck('id')->toArray();
```

**Run**: `php artisan db:seed --class=RolePermissionSeeder`

### Step 3: Add Controller Method
**Edit**: `app/Http/Controllers/ReportController.php`

```php
public function export(Report $report)
{
    if (!auth()->user()->hasPermission('reports.export')) {
        abort(403, 'You cannot export reports');
    }

    return response()->download("path/to/{$report->filename}.pdf");
}
```

### Step 4: Add Route (Optional)
**Edit**: `routes/web.php`

```php
Route::get('/reports/{report}/export', [ReportController::class, 'export'])
    ->middleware('permission:reports.export');
```

### Step 5: Add Button to View
**Edit**: `resources/views/reports/show.blade.php`

```blade
@if(auth()->user()->hasPermission('reports.export'))
    <a href="{{ route('reports.export', $report) }}" class="btn btn-primary">
        📥 Export PDF
    </a>
@endif
```

### Result
- ✅ Staff can see and click "Export PDF" button
- ✅ Teachers cannot see button (lack permission)
- ✅ If someone tries URL directly without permission → 403 error

---

## Cheat Sheet

### Check Permission
```php
auth()->user()->hasPermission('resource.action')
```

### Check Multiple (ANY)
```php
auth()->user()->hasAnyPermission(['resource.action1', 'resource.action2'])
```

### Check Multiple (ALL)
```php
auth()->user()->hasAllPermissions(['resource.action1', 'resource.action2'])
```

### Check Role
```php
auth()->user()->isAdmin()
auth()->user()->isTeacher()
auth()->user()->isStaff()
auth()->user()->isStudent()
auth()->user()->hasRole('role-slug')
```

### In Blade View
```blade
@if(auth()->user()->hasPermission('slug'))
    <!-- Show content -->
@endif

@if(auth()->user()->isAdmin())
    <!-- Admin only -->
@endif
```

---

## Common Permission Slugs

```
Classrooms:
  classroom.view      - View classroom details
  classroom.create    - Create new classroom
  classroom.edit      - Edit classroom info
  classroom.delete    - Delete classroom

Attendance:
  attendance.view     - View attendance
  attendance.create   - Record attendance
  attendance.edit     - Modify attendance
  attendance.delete   - Delete attendance

Exams:
  exam.view           - View exams
  exam.create         - Create exam
  exam.edit           - Edit exam
  exam.delete         - Delete exam
  exam.manage-results - Enter/update marks

Timetables:
  timetable.view      - View timetables
  timetable.create    - Create timetable
  timetable.edit      - Edit timetable
  timetable.delete    - Delete timetable

Events:
  event.view          - View events
  event.create        - Create event
  event.edit          - Edit event
  event.delete        - Delete event

Users:
  user.view           - View users
  user.create         - Create user
  user.edit           - Edit user
  user.delete         - Delete user
  user.assign-role    - Assign roles

Reports:
  reports.view        - View reports
  reports.generate    - Generate reports
  reports.export      - Export reports
```

---

## Database Commands

```bash
# Run all pending migrations
php artisan migrate

# Run specific seeder
php artisan db:seed --class=PermissionSeeder

# Clear cache after changes
php artisan cache:clear

# Check migration status
php artisan migrate:status
```

---

## Testing Your Permission

### Via Browser
1. Login as Staff/Teacher
2. Click button or visit URL → should work
3. Login as Student
4. Try same URL → should get 403 error

### Via Code
```php
$user = User::factory()->create();
$user->role()->associate(Role::where('slug', 'teacher')->first());
$user->save();

// Test
assert($user->hasPermission('classroom.view'));      // true
assert(!$user->hasPermission('user.delete'));        // false (teachers can't delete users)
```

---

## Got Stuck?

### Permission added but not working?
1. ✅ Did you run `php artisan db:seed`?
2. ✅ Did you check the spelling matches exactly?
3. ✅ Did you clear cache: `php artisan cache:clear`?
4. ✅ Did you assign to the role in `RolePermissionSeeder`?

### Can't see the button?
1. ✅ Check user has the permission: `auth()->user()->hasPermission('slug')`
2. ✅ Check role was seeded with that permission

### Getting 403 error unexpectedly?
1. ✅ Check user is logged in: `auth()->check()`
2. ✅ Check permission check is correct: `auth()->user()->hasPermission('slug')`
3. ✅ Check seeder added permission to user's role

---

## File Locations Recap

| What | Where |
|------|-------|
| Add permission | `database/seeders/PermissionSeeder.php` |
| Assign to role | `database/seeders/RolePermissionSeeder.php` |
| Check in code | `auth()->user()->hasPermission('slug')` |
| Protect route | `routes/web.php` + `.middleware('permission:slug')` |
| Hide button | `resources/views/your-file.blade.php` + `@if` |
| Protect method | `app/Http/Controllers/YourController.php` |

---

**That's it! You now know how to add permissions. Start with Step 1 above and follow the template.** ✅
