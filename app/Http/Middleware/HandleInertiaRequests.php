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
        $permissions = $user ? $user->role?->permissions?->pluck('slug')->toArray() ?? [] : [];
        
        // Get the raw sidebar array
        $rawSidebar = config("sidebar"); 
        
        // Filter the sidebar based on the user's permissions array
        $filteredSidebar = $user ? $this->filterSidebarByPermissions($rawSidebar, $permissions) : [];

        return array_merge(parent::share($request), [
            'name' => config('app.name'),
            'sidebar' => $filteredSidebar,
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => $user,
                'permissions' => $permissions,
            ],
        ]);
    }

    /**
     * Recursively filters the sidebar array based on provided permissions.
     */
    private function filterSidebarByPermissions(array $sidebar, array $permissions): array
    {
        $filtered = [];

        foreach ($sidebar as $item) {
            // 1. Check parent permission (if it requires one and the user lacks it, skip)
            if (isset($item['permission']) && !in_array($item['permission'], $permissions)) {
                continue;
            }

            // 2. Filter sub-items if they exist
            if (isset($item['items']) && is_array($item['items'])) {
                $filteredChildren = [];
                
                foreach ($item['items'] as $child) {
                    // Check child permission (allow if no permission is set, OR if user has it)
                    if (!isset($child['permission']) || in_array($child['permission'], $permissions)) {
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
}