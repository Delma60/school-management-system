import { usePage } from '@inertiajs/react';
import { SharedData } from '@/types';

/**
 * Hook to check if user has a specific permission
 *
 * Usage:
 * const canDelete = usePermission('user.delete');
 * if (canDelete) { // show delete button }
 */
export function usePermission(permission: string | string[]): boolean {
    const { auth } = usePage<SharedData>().props;

    // No user
    if (!auth?.user) {
        return false;
    }

    // Admin has all permissions
    if (auth.user.role?.slug === 'admin') {
        return true;
    }

    const userPermissions = auth.permissions || [];

    // Check if user has permission(s)
    if (Array.isArray(permission)) {
        return permission.some((p) => userPermissions.includes(p)); // Has ANY
    }

    return userPermissions.includes(permission); // Has specific permission
}

/**
 * Hook to check if user has ALL given permissions
 *
 * Usage:
 * const canManage = useAllPermissions(['user.view', 'user.create', 'user.edit']);
 */
export function useAllPermissions(permissions: string[]): boolean {
    const { auth } = usePage<SharedData>().props;

    if (!auth?.user) {
        return false;
    }

    if (auth.user.role?.slug === 'admin') {
        return true;
    }

    const userPermissions = auth.permissions || [];
    return permissions.every((p) => userPermissions.includes(p));
}

/**
 * Hook to check if user is a specific role
 *
 * Usage:
 * const isTeacher = useRole('teacher');
 */
export function useRole(roleSlug: string): boolean {
    const { auth } = usePage<SharedData>().props;
    return auth?.user?.role?.slug === roleSlug;
}

/**
 * Hook to check if user is admin
 *
 * Usage:
 * const isAdmin = useIsAdmin();
 */
export function useIsAdmin(): boolean {
    const { auth } = usePage<SharedData>().props;
    return auth?.user?.role?.slug === 'admin';
}

/**
 * Hook to check if user is any of the given roles
 *
 * Usage:
 * const canManageContent = useAnyRole(['admin', 'staff']);
 */
export function useAnyRole(roleSlugs: string[]): boolean {
    const { auth } = usePage<SharedData>().props;
    return roleSlugs.includes(auth?.user?.role?.slug || '');
}

export default {
    usePermission,
    useAllPermissions,
    useRole,
    useIsAdmin,
    useAnyRole,
};
