import { Role } from '@/types';
import { usePage } from '@inertiajs/react';
import React, { ReactNode } from 'react';

// Define the roles available in your system

interface CanProps {
    role?: Role['name'] | Role['name'][];
    notRole?: Role['name'] | Role['name'][];
    // notRole?: Role | Role[];
    children: ReactNode;
    fallback?: ReactNode;
}

export function Can({ role, notRole, children, fallback = null }: CanProps) {
    // Safely grab the authenticated user from Inertia
    const user = usePage().props.auth?.user as { role: Role } | null;

    // If no one is logged in, deny access
    if (!user) return <>{fallback}</>;

    const userRole = user.role.name;

    // 1. Check Negative Constraints First (e.g., "hide this from students")
    if (notRole) {
        const forbiddenRoles = Array.isArray(notRole) ? notRole : [notRole];
        if (forbiddenRoles.includes(userRole)) {
            return <>{fallback}</>;
        }
    }

    // 2. Check Positive Constraints (e.g., "only admins and staff can see this")
    if (role) {
        const allowedRoles = Array.isArray(role) ? role : [role];
        if (!allowedRoles.includes(userRole)) {
            return <>{fallback}</>;
        }
    }

    // 3. If they pass all checks, render the content!
    return <>{children}</>;
}
