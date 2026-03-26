# Permission System Documentation

This document explains how to use the permission-based access control system implemented in this school management system.

## Overview

The system implements **Permission-Based Access Control (PBAC)** with support for:
- Fine-grained permissions for specific actions on resources
- Role-based permission assignment
- Policy-based authorization in controllers
- Permission checks in middleware, views, and code

## Key Components

### 1. Permission Model
- Located in: `app/Models/Permission.php`
- Stores all available permissions with:
  - `name`: Human-readable permission name (e.g., "Create Classroom")
  - `slug`: Machine-readable identifier (e.g., "classroom.create")
  - `description`: What this permission allows
  - `group`: Permission category (Academics, Attendance, etc.)

### 2. Role Model
- Located in: `app/Models/Role.php`
- Enhanced with relationships and methods:
  - `permissions()`: Get all permissions assigned to the role
  - `givePermission()`: Assign a permission
  - `revokePermission()`: Remove a permission
  - `syncPermissions()`: Replace all permissions at once

### 3. HasRole Trait
- Located in: `app/HasRole.php`
- Provides permission checking methods:
  - `hasPermission($slug)`: Check if user has a specific permission
  - `hasAnyPermission($slugs)`: Check if user has any of the given permissions
  - `hasAllPermissions($slugs)`: Check if user has all given permissions

### 4. Policies
Located in: `app/Policies/`
- `ClassroomPolicy.php`: Controls access to classroom resources
- `AttendancePolicy.php`: Controls access to attendance records
- `ExaminationPolicy.php`: Controls access to exams and marks
- `TimetablePolicy.php`: Controls access to timetables
- `SchoolEventPolicy.php`: Controls access to school events
- `UserPolicy.php`: Controls access to user management

### 5. Middleware
- Located in: `app/Http/Middleware/CheckPermission.php`
- Middleware for permission verification in routes

## Available User Roles

1. **Admin** - Full system access (all permissions)
2. **Staff** - Management permissions (create/edit/delete resources)
3. **Teacher** - Teaching and attendance permissions
4. **Student** - View-only permissions for their own data

## Available Permission Groups

### Academics (Classrooms)
- `classroom.view`: View classroom information
- `classroom.create`: Create new classrooms
- `classroom.edit`: Edit classroom details
- `classroom.delete`: Delete classrooms

### Attendance
- `attendance.view`: View attendance records
- `attendance.create`: Record attendance
- `attendance.edit`: Modify attendance records
- `attendance.delete`: Delete attendance records

### Exams & Marks
- `exam.view`: View examinations and results
- `exam.create`: Create new examinations
- `exam.edit`: Edit exam details
- `exam.delete`: Delete examinations
- `exam.manage-results`: Enter and manage exam marks

### Timetables
- `timetable.view`: View timetables
- `timetable.create`: Create timetables
- `timetable.edit`: Edit timetables
- `timetable.delete`: Delete timetables

### School Events
- `event.view`: View school events
- `event.create`: Create events
- `event.edit`: Edit events
- `event.delete`: Delete events

### User Management
- `user.view`: View user accounts
- `user.create`: Create new users
- `user.edit`: Edit user information
- `user.delete`: Delete user accounts
- `user.assign-role`: Assign roles to users
- `staff.manage`: Manage staff information

### Reports
- `reports.view`: View system reports
- `reports.generate`: Generate new reports
- `reports.export`: Export reports to files

## Usage Examples

### 1. Check Permission in Controller

```php
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class ClassroomController extends Controller
{
    use AuthorizesRequests;

    public function index()
    {
        // Using policy methods
        $this->authorize('viewAny', Classroom::class);
        
        $classrooms = Classroom::all();
        return view('classrooms.index', compact('classrooms'));
    }

    public function create()
    {
        // Using policy method
        $this->authorize('create', Classroom::class);
        
        return view('classrooms.create');
    }

    public function store(Request $request)
    {
        $this->authorize('create', Classroom::class);
        
        // Create classroom logic
    }
}
```

### 2. Check Permission Using Trait Methods

```php
// In a controller or service
$user = auth()->user();

if ($user->hasPermission('classroom.create')) {
    // User can create classrooms
}

if ($user->hasAnyPermission(['classroom.create', 'classroom.edit'])) {
    // User can create OR edit classrooms
}

if ($user->hasAllPermissions(['classroom.create', 'classroom.edit'])) {
    // User can create AND edit classrooms
}

// Admins have all permissions automatically
if ($user->isAdmin()) {
    // Only for admins
}
```

### 3. Use Middleware on Routes

```php
// In routes/web.php
Route::post('/classrooms', [ClassroomController::class, 'store'])
    ->middleware('permission:classroom.create');

Route::get('/exams/{exam}/results', [ExamController::class, 'results'])
    ->middleware('permission:exam.manage-results');

// Multiple permissions (requires one of them)
Route::delete('/users/{user}', [UserController::class, 'destroy'])
    ->middleware('permission:user.delete,staff.manage');
```

### 4. Check Permission in Blade View

```blade
<!-- Show button only if user has permission -->
@can('create', Classroom::class)
    <a href="{{ route('classrooms.create') }}" class="btn btn-primary">
        Create Classroom
    </a>
@endcan

<!-- Using gate -->
@if(auth()->user()->hasPermission('exam.manage-results'))
    <a href="{{ route('exams.results') }}">Manage Results</a>
@endif
```

### 5. Assign Permissions to Role

```php
$role = Role::find(1);

// Assign single permission
$role->givePermission('classroom.view');

// Assign multiple permissions
$role->syncPermissions([
    Permission::where('slug', 'classroom.view')->first(),
    Permission::where('slug', 'classroom.create')->first(),
]);

// Using slug strings
$role->givePermission('exam.manage-results');
```

### 6. Check User Role

```php
$user = auth()->user();

if ($user->isAdmin()) {
    // Admin only
}

if ($user->isTeacher()) {
    // Teacher only
}

if ($user->isStudent()) {
    // Student only
}

if ($user->isStaff()) {
    // Staff only
}

if ($user->hasRole('admin')) {
    // Alternative way to check role
}
```

## Setup Instructions

### 1. Run Migrations
```bash
php artisan migrate
```

This creates:
- `permissions` table
- `role_permission` pivot table

### 2. Seed Initial Data
```bash
php artisan db:seed --class=PermissionSeeder
php artisan db:seed --class=RolePermissionSeeder
```

Or seed everything:
```bash
php artisan db:seed
```

### 3. Register Middleware (if not already done)
In `bootstrap/app.php`, middleware should be registered in the global middleware stack or route groups.

## Protected Resources by Default

The following resources require proper authorization:

- **Classrooms**: Required permissions for CRUD operations
- **Attendance**: Only authorized users can view/create/edit attendance
- **Examinations**: Exam creation and mark management restricted
- **Timetables**: Only admins and staff can manage timetables
- **School Events**: Event management restricted to authorized users
- **Users**: User management only for authorized administrators
- **Reports**: Report generation and export restricted

## Testing Permissions

```php
// In tests
$user = User::factory()->create();
$user->role()->associate(Role::where('slug', 'teacher')->first())->save();

// Check permission
$this->assertTrue($user->hasPermission('attendance.create'));
$this->assertFalse($user->hasPermission('user.delete'));

// Test authorization
$this->actingAs($user)
    ->post('/classrooms', [
        'name' => 'Grade 1 A',
        'teacher_id' => $user->id,
    ])
    ->assertStatus(403); // Forbidden if user lacks permission
```

## Best Practices

1. **Always check permissions in controllers** - Use `$this->authorize()` or policies
2. **Use permission slugs consistently** - Follow the pattern `resource.action`
3. **Admin bypass** - Admins automatically have all permissions
4. **Document custom permissions** - Add new permissions to the PermissionSeeder
5. **Use policies for resource-based authorization** - More maintainable than checking strings
6. **Cache permissions** - For performance in high-traffic applications
7. **Log permission denials** - Helps with security auditing

## Extending the System

### Add New Permission

```php
// In PermissionSeeder
Permission::create([
    'name' => 'View Dashboard',
    'slug' => 'dashboard.view',
    'description' => 'Can access the main dashboard',
    'group' => 'General',
]);
```

### Add New Resource Authorization

```php
// Create policy
php artisan make:policy YourResourcePolicy

// Register in AuthServiceProvider
$this->policy(YourResource::class, YourResourcePolicy::class);
```

### Create Custom Gate

```php
// In AuthServiceProvider boot()
Gate::define('view-sensitive-data', function (User $user) {
    return $user->hasPermission('data.view-sensitive');
});

// Use in controller
$this->authorize('view-sensitive-data');
```

## Troubleshooting

**Q: User can't access resource even with permission**
- A: Check that the permission is assigned to the user's role
- A: Verify the policy method is being called
- A: Check middleware is properly registered

**Q: Getting "Unauthenticated" error**
- A: Ensure user is logged in before checking permissions
- A: Use `auth()->check()` to verify authentication

**Q: Admin doesn't have all permissions**
- A: Check that admin role is mapped to all permissions in RolePermissionSeeder
- A: Verify `isAdmin()` returns true for admin users

**Q: Permission denied on allowed action**
- A: Check the permission slug matches exactly
- A: Verify policy method name is correct
- A: Clear application cache with `php artisan cache:clear`

## Support

For more information on Laravel authorization, see the [Laravel Documentation](https://laravel.com/docs/authorization).
