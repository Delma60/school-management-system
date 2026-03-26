# Permission System Implementation Guide

## Quick Setup Checklist

- [x] Permission model created
- [x] Permissions migration created
- [x] Role-Permission pivot table migration created  
- [x] HasRole trait updated with permission methods
- [x] Role model updated with permission relationships
- [x] Policy classes created for all resources
- [x] AuthServiceProvider created and registered
- [x] Permission seeder created with all permissions
- [x] RolePermissionSeeder created with role assignments
- [x] Middleware for permission checks created
- [x] RolesController updated with authorization
- [x] Comprehensive documentation created

## Next Steps - Implement in Other Controllers

### Step 1: Add Authorization to Existing Controllers

For each resource controller (Attendance, Examination, Timetable, SchoolEvent), add the following:

```php
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class YourResourceController extends Controller
{
    use AuthorizesRequests;

    public function index()
    {
        // Determine which model's policy to use
        // For example: Attendance, Examination, etc.
        $this->authorize('viewAny', YourModel::class);
        
        $items = YourModel::paginate(15);
        return inertia('your-resource/index', ['items' => $items]);
    }

    public function create()
    {
        $this->authorize('create', YourModel::class);
        return inertia('your-resource/create');
    }

    public function store(Request $request)
    {
        $this->authorize('create', YourModel::class);
        // ... store logic
    }

    public function show(YourModel $model)
    {
        $this->authorize('view', $model);
        return inertia('your-resource/show', ['item' => $model]);
    }

    public function edit(YourModel $model)
    {
        $this->authorize('update', $model);
        return inertia('your-resource/edit', ['item' => $model]);
    }

    public function update(Request $request, YourModel $model)
    {
        $this->authorize('update', $model);
        // ... update logic
    }

    public function destroy(YourModel $model)
    {
        $this->authorize('delete', $model);
        // ... delete logic
    }
}
```

### Step 2: Protect Routes (Optional)

In `routes/web.php`:

```php
Route::middleware(['auth'])->group(function () {
    // Attendance routes
    Route::resource('attendance', AttendanceController::class);
    
    // Examination routes
    Route::resource('examinations', ExaminationController::class);
    
    // Timetable routes
    Route::resource('timetables', TimetableController::class);
    
    // Event routes
    Route::resource('events', SchoolEventController::class);
    
    // User management
    Route::resource('users', UserController::class);
});
```

### Step 3: Use in Blade Views

```blade
<!-- Show create button only if authorized -->
@can('create', App\Models\Attendance::class)
    <a href="{{ route('attendance.create') }}" class="btn btn-primary">
        Record Attendance
    </a>
@endcan

<!-- Show edit/delete for authorized users -->
@can('update', $attendance)
    <a href="{{ route('attendance.edit', $attendance) }}">Edit</a>
@endcan

@can('delete', $attendance)
    <form method="POST" action="{{ route('attendance.destroy', $attendance) }}">
        @method('DELETE')
        @csrf
        <button type="submit">Delete</button>
    </form>
@endcan
```

## Running Migrations and Seeds

```bash
# Run all pending migrations
php artisan migrate

# Seed the database with permissions and roles
php artisan db:seed --class=PermissionSeeder
php artisan db:seed --class=RolePermissionSeeder

# Or seed everything at once
php artisan db:seed
```

## File Structure

### Models
- `app/Models/Permission.php` - Permission model
- `app/Models/Role.php` - Updated with permissions relationship
- `app/Models/User.php` - Has HasRole trait

### Traits
- `app/HasRole.php` - Updated with permission methods

### Policies
- `app/Policies/ClassroomPolicy.php`
- `app/Policies/AttendancePolicy.php`
- `app/Policies/ExaminationPolicy.php`
- `app/Policies/TimetablePolicy.php`
- `app/Policies/SchoolEventPolicy.php`
- `app/Policies/UserPolicy.php`

### Middleware
- `app/Http/Middleware/CheckPermission.php` - Permission verification

### Providers
- `app/Providers/AuthServiceProvider.php` - Policy registration

### Controllers
- `app/Http/Controllers/RolesController.php` - Updated with authorization

### Database
- `database/migrations/2026_03_25_150000_create_permissions_table.php`
- `database/seeders/PermissionSeeder.php`
- `database/seeders/RolePermissionSeeder.php`
- `database/factories/PermissionFactory.php`

### Documentation
- `PERMISSIONS.md` - Complete permission system documentation

## Testing Permissions

```php
// Login and test
$user = User::factory()->create();
$user->role()->associate(Role::where('slug', 'teacher')->first());
$user->save();

// Test in browser or in tests
$this->actingAs($user)
    ->get('/classrooms')
    ->assertStatus(200); // Teacher can view

$this->actingAs($user)
    ->post('/classrooms', ['name' => 'Test'])
    ->assertStatus(403); // Teacher cannot create (unauthorized)
```

## Current Permission Assignments

### Admin
- All permissions

### Staff
- All management permissions
- Can create, edit, view most resources
- Cannot delete users

### Teacher
- View classrooms, attendance, exams, timetables, events
- Can create and edit attendance
- Can manage exam results

### Student
- View-only permissions
- Can view: classrooms, attendance, exams, timetables, events

## Customizing for Your Needs

1. **Add new permission**: Add to `PermissionSeeder`
2. **Modify role permissions**: Update `RolePermissionSeeder` 
3. **Change authorization logic**: Modify policy methods
4. **Add route-level checks**: Use middleware with permission checks

## Common Issues and Solutions

| Issue | Solution |
|-------|----------|
| "Unauthenticated" error | Ensure user is logged in before accessing protected routes |
| "Unauthorized" error | Check user's role has required permission via database |
| Permission not working | Verify permission slug matches exactly and is assigned to role |
| Admin has no permissions | Clear cache with `php artisan cache:clear` |
| Can't create resources | Check database seeders ran successfully |

## Performance Tips

1. **Cache permissions**: Consider caching permission queries
2. **Eager load relationships**: Use `with('permissions')` when loading roles
3. **Use gates for complex logic**: More efficient than multiple authorize calls
4. **Batch permission checks**: Use `hasAnyPermission()` or `hasAllPermissions()`
