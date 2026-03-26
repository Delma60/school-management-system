# React Permission Components & Hooks

This guide explains how to use the `Can` component and permission hooks in your React/TypeScript components.

## Quick Start

### Using the `Can` Component (Like Blade's @can)

The easiest way to show/hide content based on permissions:

```tsx
import { Can } from '@/components/Can';

export default function ClassroomIndex() {
    return (
        <div>
            <h1>Classrooms</h1>
            
            {/* Show button only if user has permission */}
            <Can permission="classroom.create">
                <button>Create Classroom</button>
            </Can>
        </div>
    );
}
```

That's it! It works exactly like Blade's `@can` directive.

---

## Components

### `<Can>` Component

Shows or hides content based on user permissions.

**Props:**
- `permission` (string | string[]): Permission slug(s) to check
- `children` (ReactNode): Content to show if user has permission
- `fallback?` (ReactNode): Optional content to show if user lacks permission

**Example 1: Single Permission**
```tsx
<Can permission="classroom.create">
    <button>Create Classroom</button>
</Can>
```

**Example 2: Multiple Permissions (User needs ANY)**
```tsx
<Can permission={['classroom.create', 'classroom.edit']}>
    <button>Manage Classroom</button>
</Can>
```

**Example 3: With Fallback**
```tsx
<Can 
    permission="user.delete"
    fallback={<span className="text-red-500">You don't have permission to delete users</span>}
>
    <button className="btn btn-danger">Delete User</button>
</Can>
```

**Example 4: Complex Content**
```tsx
<Can permission="attendance.create">
    <Card className="bg-blue-50">
        <CardHeader>
            <CardTitle>Record Attendance</CardTitle>
        </CardHeader>
        <CardContent>
            <AttendanceForm />
        </CardContent>
    </Card>
</Can>
```

---

## Hooks

Use hooks when you need to check permissions in JavaScript code.

### `usePermission(permission)`

Check if user has a specific permission.

**Returns:** `boolean`

**Example:**
```tsx
import { usePermission } from '@/hooks/usePermission';

export default function Dashboard() {
    const canCreateUser = usePermission('user.create');
    
    return (
        <div>
            {canCreateUser && (
                <button onClick={createUser}>Create User</button>
            )}
        </div>
    );
}
```

**With Multiple Permissions (ANY):**
```tsx
const canManageUsers = usePermission(['user.create', 'user.edit', 'user.delete']);

if (canManageUsers) {
    // User has at least one of these permissions
}
```

### `useAllPermissions(permissions)`

Check if user has ALL given permissions.

**Returns:** `boolean`

**Example:**
```tsx
import { useAllPermissions } from '@/hooks/usePermission';

export default function UserManager() {
    const canFullyManage = useAllPermissions(['user.view', 'user.create', 'user.delete']);
    
    if (!canFullyManage) {
        return <div>You need all user management permissions</div>;
    }
    
    return <UserManagementPanel />;
}
```

### `useRole(roleSlug)`

Check if user has a specific role.

**Returns:** `boolean`

**Example:**
```tsx
import { useRole } from '@/hooks/usePermission';

export default function StudentDashboard() {
    const isStudent = useRole('student');
    const isTeacher = useRole('teacher');
    
    if (isStudent) {
        return <StudentView />;
    }
    
    if (isTeacher) {
        return <TeacherView />;
    }
    
    return <div>You don't have access</div>;
}
```

**Available Roles:**
- `'admin'` - Administrator
- `'staff'` - Staff member
- `'teacher'` - Teacher
- `'student'` - Student

### `useIsAdmin()`

Check if user is an admin (shorthand for `useRole('admin')`).

**Returns:** `boolean`

**Example:**
```tsx
import { useIsAdmin } from '@/hooks/usePermission';

export default function SystemSettings() {
    const isAdmin = useIsAdmin();
    
    if (!isAdmin) {
        return <div>Admin access required</div>;
    }
    
    return <AdminPanel />;
}
```

### `useAnyRole(roleSlugs)`

Check if user has any of the given roles.

**Returns:** `boolean`

**Example:**
```tsx
import { useAnyRole } from '@/hooks/usePermission';

export default function TeacherResources() {
    const isStaffOrTeacher = useAnyRole(['staff', 'teacher']);
    
    if (!isStaffOrTeacher) {
        return <div>Only staff and teachers can access this</div>;
    }
    
    return <ResourceLibrary />;
}
```

---

## Real-World Examples

### Example 1: Conditional Button in a Table

```tsx
import { Can } from '@/components/Can';

export default function UserList({ users }) {
    return (
        <table>
            <tbody>
                {users.map(user => (
                    <tr key={user.id}>
                        <td>{user.name}</td>
                        <td>
                            <Can permission="user.edit">
                                <button onClick={() => editUser(user)}>Edit</button>
                            </Can>
                            
                            <Can permission="user.delete">
                                <button onClick={() => deleteUser(user)}>Delete</button>
                            </Can>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
```

### Example 2: Multiple Conditional Sections

```tsx
import { Can } from '@/components/Can';
import { usePermission } from '@/hooks/usePermission';

export default function ClassroomDetail({ classroom }) {
    const canEdit = usePermission('classroom.edit');
    const canDelete = usePermission('classroom.delete');
    
    return (
        <div className="space-y-6">
            <div className="classroom-info">
                <h1>{classroom.name}</h1>
                <p>{classroom.capacity} students</p>
            </div>
            
            {/* Edit Section */}
            <Can permission="classroom.edit">
                <Card>
                    <CardHeader>
                        <CardTitle>Edit Classroom</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ClassroomForm classroom={classroom} />
                    </CardContent>
                </Card>
            </Can>
            
            {/* Attendance Section */}
            <Can permission="attendance.create">
                <Card>
                    <CardHeader>
                        <CardTitle>Record Attendance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <AttendanceForm classroom={classroom} />
                    </CardContent>
                </Card>
            </Can>
            
            {/* Delete Section */}
            {canDelete && (
                <Button variant="destructive" onClick={() => deleteClassroom(classroom)}>
                    Delete Classroom
                </Button>
            )}
        </div>
    );
}
```

### Example 3: Role-Based Navigation

```tsx
import { useRole, useIsAdmin, useAnyRole } from '@/hooks/usePermission';

export default function Navigation() {
    const isAdmin = useIsAdmin();
    const isTeacher = useRole('teacher');
    const isStaffOrAdmin = useAnyRole(['staff', 'admin']);
    
    return (
        <nav>
            <ul>
                <li><Link href="/">Dashboard</Link></li>
                
                {isStaffOrAdmin && (
                    <>
                        <li><Link href="/classrooms">Classrooms</Link></li>
                        <li><Link href="/users">Users</Link></li>
                    </>
                )}
                
                {isTeacher && (
                    <>
                        <li><Link href="/attendance">Attendance</Link></li>
                        <li><Link href="/grades">Grades</Link></li>
                    </>
                )}
                
                {isAdmin && (
                    <li><Link href="/settings">Settings</Link></li>
                )}
            </ul>
        </nav>
    );
}
```

### Example 4: Combining With Can and Hooks

```tsx
import { Can } from '@/components/Can';
import { usePermission } from '@/hooks/usePermission';

export default function ExamManagement({ exam }) {
    const canCreateResults = usePermission('exam.manage-results');
    
    return (
        <section>
            <h2>{exam.name}</h2>
            
            {/* Show data to anyone who can view exams */}
            <Can permission="exam.view">
                <div className="exam-details">
                    <p>Status: {exam.status}</p>
                    <p>Date: {exam.date}</p>
                </div>
            </Can>
            
            {/* Show marking interface only to authorized users */}
            <Can permission="exam.manage-results">
                <section className="mt-6 p-4 bg-blue-50 rounded">
                    <h3>Enter Student Marks</h3>
                    {canCreateResults && (
                        <GradeEntry exam={exam} />
                    )}
                </section>
            </Can>
        </section>
    );
}
```

---

## Comparison: Blade vs React

### Blade Template (Old)
```blade
@if(auth()->user()->hasPermission('classroom.create'))
    <button>Create Classroom</button>
@endif

@can('classroom.delete', $classroom)
    <button>Delete Classroom</button>
@endcan
```

### React Component (New)
```tsx
// Method 1: Using Can component (simplest, like @can)
<Can permission="classroom.create">
    <button>Create Classroom</button>
</Can>

// Method 2: Using hook (when you need JS logic)
const canDelete = usePermission('classroom.delete');
if (canDelete) {
    return <button>Delete</button>;
}
```

---

## Available Permission Slugs

See [PERMISSIONS_QUICK_START.md](PERMISSIONS_QUICK_START.md) for the complete list of permission slugs.

Common ones:
```
Classrooms:
  classroom.view, classroom.create, classroom.edit, classroom.delete

Attendance:
  attendance.view, attendance.create, attendance.edit, attendance.delete

Exams:
  exam.view, exam.create, exam.edit, exam.delete, exam.manage-results

Users:
  user.view, user.create, user.edit, user.delete, user.assign-role
```

---

## Performance Tips

1. **Use hooks in functions**: Hooks are best for conditional logic
   ```tsx
   const canEdit = usePermission('item.edit');
   ```

2. **Use Can component for JSX**: Components are best for showing/hiding UI
   ```tsx
   <Can permission="item.edit">
     <button>Edit</button>
   </Can>
   ```

3. **Combine for complex scenarios**:
   ```tsx
   const canFullyManage = useAllPermissions(['item.view', 'item.create', 'item.delete']);
   
   if (!canFullyManage) {
     return <Can permission="item.view"><ViewOnly /></Can>;
   }
   
   return <FullAccess />;
   ```

---

## Automatic Admin Bypass

Both the `Can` component and all hooks automatically give admins access to everything:

```tsx
// This works for admins without needing the specific permission
<Can permission="super.secret.feature">
    <SuperSecretButton />
</Can>

// Admins always get true
const canDo = usePermission('anything');  // true for admins
```

---

## Files

- `resources/js/components/Can.tsx` - The Can component
- `resources/js/hooks/usePermission.ts` - Permission hooks
- `app/Http/Middleware/HandleInertiaRequests.php` - Shares permissions to frontend

---

## Troubleshooting

### Permissions not showing?
- 1. Make sure permissions are seeded: `php artisan db:seed --class=PermissionSeeder`
- 2. Make sure role has permissions: `php artisan db:seed --class=RolePermissionSeeder`
- 3. User's role must be assigned permissions
- 4. Clear cache: `php artisan cache:clear`

### Can component shows nothing (not even fallback)?
- Check that user is logged in: `if (!auth?.user) return null;`
- Check that permissions are passed correctly

### Hook returns false unexpectedly?
- User might not have the permission in their role
- User might not be assigned a role
- Check role has the permission in the database

---

## Summary

| Need | Use This |
|------|----------|
| Show/hide UI element | `<Can permission="...">` |
| Check in JavaScript | `usePermission('...')` |
| Check all permissions | `useAllPermissions([...])` |
| Check role | `useRole('...')` or `useIsAdmin()` |
| Multiple roles | `useAnyRole([...])` |

You now have two ways to check permissions:
1. **Blade syntax (server-side)**: `@can` directive
2. **React syntax (client-side)**: `<Can>` component + hooks ✅
