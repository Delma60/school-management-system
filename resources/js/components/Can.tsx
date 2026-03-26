import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { ReactNode } from 'react';

interface CanProps {
    permission: string | string[];
    fallback?: ReactNode;
    children: ReactNode;
}

/**
 * Can Component - Works like Blade's @can directive
 *
 * Checks if the authenticated user has the required permission(s).
 * If the user has the permission, renders the children.
 * If not, renders the fallback content (if provided) or nothing.
 *
 * Usage:
 * <Can permission="classroom.create">
 *   <button>Create Classroom</button>
 * </Can>
 *
 * With fallback:
 * <Can permission="user.delete" fallback={<span>You don't have permission</span>}>
 *   <button>Delete User</button>
 * </Can>
 *
 * Multiple permissions (user needs ANY):
 * <Can permission={['classroom.create', 'classroom.edit']}>
 *   <button>Modify Classroom</button>
 * </Can>
 */
export function Can({ permission, fallback, children }: CanProps) {
    const { auth } = usePage<SharedData>().props;

    // No user logged in - show fallback
    if (!auth?.user) {
        return <>{fallback}</>;
    }

    // Get user's permissions
    const userPermissions = auth.permissions || [];

    // Check if user has the required permission(s)
    const hasPermission = Array.isArray(permission)
        ? permission.some((p) => userPermissions.includes(p)) // Has ANY of the permissions
        : userPermissions.includes(permission); // Has THIS permission

    // Admin users have all permissions
    const isAdmin = auth.user.role?.slug === 'admin';

    // Show children if user has permission or is admin
    if (hasPermission || isAdmin) {
        return <>{children}</>;
    }

    // Show fallback if provided
    return <>{fallback}</>;
}

export default Can;
