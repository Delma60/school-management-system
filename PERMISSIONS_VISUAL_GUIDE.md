# Permission System Visual Guide

## How Permissions Flow Through Your App

### User Accesses a Feature

```
User Clicks Button
        ↓
Route Handler
        ↓
Check: Is Authenticated?
    ├─ NO → Redirect to Login ❌
    └─ YES ✓
        ↓
Check: Does User Have Permission?
    ├─ Is user Admin?
    │   └─ YES ✓ → Allow Everything
    └─ Is permission in user's role?
        ├─ YES ✓ → Execute Action
        └─ NO ❌ → Show 403 Error
```

---

## Database Structure (How It's Stored)

```
USERS TABLE
┌─────────────────────┐
│ user_id: 1          │
│ name: John          │
│ role_id: 2    ──────┼─────┐
└─────────────────────┘     │
                            │
                     ROLES TABLE
                     ┌─────────────────────┐      ROLE_PERMISSION TABLE
                     │ role_id: 2          │      ┌──────────────────────┐
                     │ name: Teacher       │─────→│ role_id: 2           │
                     │ slug: teacher       │      │ permission_id: 5  ───┼───┐
                     └─────────────────────┘      │ permission_id: 8  ───┼──┐│
                                                  │ permission_id: 12 ───┼─┐││
                                                  │ permission_id: 15 ───┼┐││
                                                  └──────────────────────┘││││
                                                                        │││││
                                    PERMISSIONS TABLE              │││││
                                    ┌─────────────────────────┐   │││││
                                    │ id: 5                   │←──┘│││
                                    │ name: View Classrooms   │    ││
                                    │ slug: classroom.view    │    ││
                                    ├─────────────────────────┤    ││
                                    │ id: 8                   │←───┘│
                                    │ name: Create Attendance │     │
                                    │ slug: attendance.create │     │
                                    └─────────────────────────┘     │
                                                                     Other
                                                                   permissions...
```

**What this means:**
- User "John" has role "Teacher"
- Teacher role has 4 permissions (IDs: 5, 8, 12, 15)
- So John can: view classrooms, create attendance, etc.

---

## Permission Types by Level

### Level 1: Global Admin
```
User is Admin? 
    → YES ✓ Can do EVERYTHING
    → NO → Check specific permission
```

### Level 2: Role-Based
```
User has role "Staff"?
    → Staff role includes "classroom.create"?
    → YES ✓ Can create classrooms
    → NO → 403 Error
```

### Level 3: Direct Check
```
auth()->user()->hasPermission('classroom.edit')
    → Check user's role
    → Check if role has this permission
    → YES → True
    → NO → False
```

---

## Adding Permissions - Complete Flow

### The 5-Step Addition Process

```
    1. CREATE            2. SEED             3. ASSIGN           4. CHECK            5. PROTECT
    ┌──────────┐         ┌──────────┐        ┌──────────┐         ┌──────────┐       ┌──────────┐
    │          │         │          │        │          │         │          │       │          │
    │ Add to   │────────→│ Run db   │───────→│ Add to   │────────→│ Code:    │──────→│ Add to   │
    │ Seeder   │         │ seed     │        │ Role     │         │ Check    │       │ Route/  │
    │          │         │          │        │ Seeder   │         │ Permission       │ View     │
    │          │         │          │        │          │         │          │       │          │
    └──────────┘         └──────────┘        └──────────┘         └──────────┘       └──────────┘
    
    PermissionSeeder  db seed cmd    RolePermissionSeeder   Controller    Route Handler
```

### Example: "Delete User" Permission

**Step 1: Create**
```php
// PermissionSeeder.php
[
    'slug' => 'user.delete',
    'name' => 'Delete User',
    'group' => 'User Management',
]
```

**Step 2: Seed**
```bash
php artisan db:seed --class=PermissionSeeder
# Result: Permission row inserted in DB
```

**Step 3: Assign to Role**
```php
// RolePermissionSeeder.php
$adminRole->permissions()->sync([..., 15]); // 15 is permission ID
```

**Step 4: Check in Code**
```php
// Controller
if (!auth()->user()->hasPermission('user.delete')) {
    abort(403);
}
```

**Step 5: Protect Display**
```blade
{{-- View --}}
@if(auth()->user()->hasPermission('user.delete'))
    <button onclick="deleteUser()">Delete</button>
@endif
```

---

## Request Lifecycle with Permissions

```
REQUEST ARRIVES
    ↓
ROUTE DISPATCHER
    ├─ Middleware: auth (Check if logged in)
    │   ├─ Not logged in? → Redirect to login
    │   └─ Logged in? Continue ✓
    │
    ├─ Middleware: permission (Optional route protection)
    │   ├─ Check: DB query user's role → permissions
    │   ├─ Has permission? ✓ Continue
    │   └─ No permission? → 403 Error
    │
    └─ CONTROLLER METHOD
        ├─ Code: if (!$user->hasPermission(...))
        │   ├─ NO: abort(403)
        │   └─ YES: Execute logic ✓
        │
        ├─ VIEW/RESPONSE
        │   └─ Blade: @if(hasPermission) Show button
        │
        └─ RESPONSE SENT TO USER
```

---

## Permission Checks: 4 Methods

```
METHOD 1: Direct Check
┌─────────────────────────────────────────┐
│ if (!auth()->user()->hasPermission(...)) │
│     abort(403);                         │
└─────────────────────────────────────────┘
        Location: In controller methods
        When to use: Simple, straightforward checks

METHOD 2: Policy Class
┌─────────────────────────────────────────┐
│ $this->authorize('delete', $user);      │
└─────────────────────────────────────────┘
        Location: In controller methods
        When to use: Complex, resource-specific logic

METHOD 3: Middleware
┌─────────────────────────────────────────┐
│ Route::post(...)->middleware(            │
│     'permission:user.delete'             │
│ );                                       │
└─────────────────────────────────────────┘
        Location: In routes
        When to use: Route-level protection

METHOD 4: View Display
┌─────────────────────────────────────────┐
│ @if(auth()->user()->hasPermission(...))  │
│     Show button                          │
│ @endif                                   │
└─────────────────────────────────────────┘
        Location: In Blade templates
        When to use: Show/hide UI elements
```

---

## Role Hierarchy (What Each Role Gets)

```
ADMIN
├─ All Permissions ✓✓✓
└─ Can do ANYTHING

STAFF
├─ Classroom: view, create, edit
├─ Attendance: view, create, edit
├─ Exam: view, create, edit
├─ Timetable: view, create, edit
├─ Event: view, create, edit
├─ User: view, create, edit
├─ Reports: view, generate, export
└─ Can manage most resources (except delete)

TEACHER
├─ Classroom: view
├─ Attendance: view, create, edit
├─ Exam: view, manage-results
├─ Timetable: view
├─ Event: view
├─ User: view
├─ Reports: view, generate
└─ Can teach and record attendance

STUDENT
├─ Classroom: view
├─ Attendance: view (own only)
├─ Exam: view (results only)
├─ Timetable: view
├─ Event: view
├─ User: view (own profile only)
└─ Can view information (read-only)
```

---

## Permission Naming Convention

```
PATTERN: resource.action

Examples:
┌──────────────────────────────────────────────┐
│ classroom.view       - VIEW Classrooms        │
│ classroom.create     - CREATE Classroom       │
│ classroom.edit       - EDIT Classroom         │
│ classroom.delete     - DELETE Classroom       │
│                                              │
│ attendance.view      - VIEW Attendance        │
│ attendance.create    - CREATE Attendance      │
│ attendance.edit      - EDIT Attendance        │
│ attendance.delete    - DELETE Attendance      │
└──────────────────────────────────────────────┘

Why this format?
- Consistent and easy to remember
- Machine-readable (no spaces, lowercase)
- Groups related permissions together
- Easy to search/find in code
```

---

## Authentication vs Authorization

```
┌──────────────────────────────────────────────────────┐
│ AUTHENTICATION: Is this really John?                 │
│ ✓ Check username/password                            │
│ ✓ Verify identity                                    │
│ Result: Logged in ✓                                  │
└──────────────────────────────────────────────────────┘

        ↓ If authenticated, then check...

┌──────────────────────────────────────────────────────┐
│ AUTHORIZATION: Can John do this action?              │
│ ✓ Check: John's role                                │
│ ✓ Check: Role has permission                        │
│ ✓ Check: User has specific permission               │
│ Result: Can do action ✓ or Forbidden ❌              │
└──────────────────────────────────────────────────────┘

BOTH NEEDED:
  Authentication: "You are who you say you are"
  Authorization: "You are allowed to do this"
```

---

## Common Patterns

### Pattern 1: CRUD Permissions
```
CREATE  → resource.create
READ    → resource.view
UPDATE  → resource.edit
DELETE  → resource.delete

Example:
classroom.create - Create new classroom
classroom.view   - View classroom details
classroom.edit   - Modify classroom
classroom.delete - Remove classroom
```

### Pattern 2: Admin Can Skip
```
if ($user->isAdmin()) {
    return true; // Admin skips all checks
}

// Check specific permission
return $user->hasPermission('resource.action');
```

### Pattern 3: Multiple Permissions
```
// User needs ANY of these
$user->hasAnyPermission(['create', 'edit'])

// User needs ALL of these
$user->hasAllPermissions(['view', 'create'])
```

---

## Debugging Permissions

### Check if User Has Permission
```php
$user = auth()->user();
dd($user->hasPermission('classroom.view')); // Shows true/false
```

### See User's Role
```php
dd(auth()->user()->role);
// Shows: Role {id, name, slug, permissions: [...]}
```

### See User's Permissions
```php
dd(auth()->user()->role->permissions);
// Shows array of all permissions for user's role
```

### Check Specific Permission Exists in DB
```php
$perm = Permission::where('slug', 'classroom.view')->first();
dd($perm); // Shows permission or null
```

### Check Role Has Permission
```php
$role = Role::where('slug', 'teacher')->first();
dd($role->permissions); // Shows all permissions for teacher role
```

---

## Summary Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  USER (John)                                                    │
│    ↓ (assigned)                                                 │
│  ROLE (Teacher)                                                 │
│    ↓ (contains)                                                 │
│  PERMISSIONS (classroom.view, attendance.create, exam.results)  │
│    ↓ (checked by)                                               │
│  CODE CHECKS                                                    │
│    ├─ Controller: if(!$user->hasPermission('classroom.view'))   │
│    ├─ Route: middleware('permission:classroom.view')            │
│    └─ View: @if($user->hasPermission('classroom.view'))         │
│
│  RESULT: User can do the action ✓                              │
│
└─────────────────────────────────────────────────────────────────┘
```

---

Perfect! Now you understand how permissions flow through your entire application. 🎓
