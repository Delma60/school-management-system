<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        $user = $request->user();
        
        // Assuming your role relation uses 'slug' or 'name'. Adjust as needed.
        $userRole = $user ? $user->role?->slug ?? $user->role?->name : null; 
        $permissions = $user ? $user->role?->permissions?->pluck('slug')->toArray() ?? [] : [];
        
        // Get the raw sidebar array
        $rawSidebar = config("sidebar"); 
        
        // Filter the sidebar based on the user's role and permissions
        $filteredSidebar = $user ? $this->filterSidebarAccess($rawSidebar, $userRole, $permissions) : [];

        return array_merge(parent::share($request), [
            'name' => config('app.name'),
            'sidebar' => $filteredSidebar,
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => $user,
                'role' => $userRole,
                'permissions' => $permissions,
            ],
        ]);
    }

    /**
     * Recursively filters the sidebar array based on provided roles and permissions.
     */
    private function filterSidebarAccess(array $sidebar, ?string $userRole, array $permissions): array
    {
        $filtered = [];

        foreach ($sidebar as $item) {
            // 1. Check parent access
            if (!$this->userHasAccess($item, $userRole, $permissions)) {
                continue;
            }

            // 2. Filter sub-items if they exist
            if (isset($item['items']) && is_array($item['items'])) {
                $filteredChildren = [];
                
                foreach ($item['items'] as $child) {
                    if ($this->userHasAccess($child, $userRole, $permissions)) {
                        $filteredChildren[] = $child;
                    }
                }

                // 3. If it's a dropdown container and all children were removed, hide the parent
                if (empty($filteredChildren)) {
                    continue;
                }

                $item['items'] = array_values($filteredChildren);
            }

            $filtered[] = $item;
        }

        return array_values($filtered); // Re-index array nicely for JSON conversion
    }

    /**
     * Evaluates the 'roleOrPermission' string to determine access.
     * Supports multi-roles (role:a|b), multi-permissions (permission:x|y), and negations (notRole:c|d).
     */
    private function userHasAccess(array $item, ?string $userRole, array $permissions): bool
    {
        if (empty($item['roleOrPermission'])) {
            return true; // No restrictions set on this item
        }

        $safeUserRole = strtolower((string) $userRole);

        // 1. GLOBAL OVERRIDE (Optional: rename 'super_admin' to match your top role)
        if ($safeUserRole === 'super_admin') {
            return true;
        }

        $conditions = explode(',', $item['roleOrPermission']);
        
        // Tracking which rules were actually requested
        $requiresRole = false;
        $requiresNotRole = false;
        $requiresPerm = false;
        
        // Tracking if the user passed the requested rules
        $passedRole = false;
        $passedNotRole = true; // Defaults to true; fails if they hit a restricted role
        $passedPerm = false;

        foreach ($conditions as $condition) {
            $condition = trim($condition);

            // 2. MULTIPLE ROLES (e.g., "role:admin|teacher")
            if (str_starts_with($condition, 'role:')) {
                $requiresRole = true;
                $allowedRoles = explode('|', str_replace('role:', '', $condition));
                $allowedRoles = array_map('strtolower', $allowedRoles);
                
                if (in_array($safeUserRole, $allowedRoles)) {
                    $passedRole = true;
                }
            }

            // 3. MULTIPLE NOT-ROLES (e.g., "notRole:student|parent")
            if (str_starts_with($condition, 'notRole:')) {
                $requiresNotRole = true;
                $restrictedRoles = explode('|', str_replace('notRole:', '', $condition));
                $restrictedRoles = array_map('strtolower', $restrictedRoles);
                
                if (in_array($safeUserRole, $restrictedRoles)) {
                    $passedNotRole = false; 
                }
            }

            // 4. MULTIPLE PERMISSIONS (e.g., "permission:view.any|view.own")
            if (str_starts_with($condition, 'permission:')) {
                $requiresPerm = true;
                $allowedPerms = explode('|', str_replace('permission:', '', $condition));
                
                if (!empty(array_intersect($allowedPerms, $permissions))) {
                    $passedPerm = true;
                }
            }
        }

        // 5. FINAL EVALUATION (Enforce AND logic across condition types)
        $finalRolePass = $requiresRole ? $passedRole : true;
        $finalNotRolePass = $requiresNotRole ? $passedNotRole : true;
        $finalPermPass = $requiresPerm ? $passedPerm : true;

        // The user must pass EVERY condition block that was defined in the string
        return $finalRolePass && $finalNotRolePass && $finalPermPass;
    }
}