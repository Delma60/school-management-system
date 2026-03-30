import { usePage } from '@inertiajs/react';

export function usePermission() {
    // Extract auth from Inertia's shared props
    const { auth } = usePage<any>().props;
    
    const userPermissions: string[] = auth.permissions || [];
    const userRole: string = auth.role || '';

    // Check if user has a specific permission
    const hasPermission = (permission: string) => {
        console.log({ permission, userPermissions })
        return userPermissions.includes(permission);
    };
    
    // Check if user has ANY of the given permissions in an array
    const hasAnyPermission = (permissions: string[]) => {
        return permissions.some(permission => {
            // console.log({ permission, userPermissions })
            return userPermissions.includes(permission)
        });
    };

    // Optional: Check by role (Admin usually bypasses everything)
    const hasRole = (role: string) => userRole === role;
    const isAdmin = userRole === 'admin' || userRole === 'super_admin';

    // A smart check: If they are admin, they can see it. Otherwise, check exact permission.
    const canAccess = (permission?: string) => {
        if (!permission) return true; // If no permission is required, everyone sees it
        if (isAdmin) return true;     // Admins see everything
        return hasPermission(permission);
    };

    return { hasPermission, hasAnyPermission, hasRole, isAdmin, canAccess };
}