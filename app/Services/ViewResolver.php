<?php

namespace App\Services;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\View;

class ViewResolver
{
    /**
     * Cache for config to avoid repeated config() calls.
     */
    protected array $map;
    protected string $fallback;
    protected bool $useFallback;

    public function __construct()
    {
        $this->map = config('views.role_view_map', []);
        $this->fallback = config('views.fallback_folder', 'shared');
        $this->useFallback = config('views.enable_fallback', true);
    }

    /**
     * Resolve the correct view path based on user's role.
     * * @param string $viewName (e.g., 'dashboard/index')
     * @param string|null $overrideRole Manually check for a specific role
     */
    static function resolve(string $viewName, ?string $overrideRole = null): string
    {
        $user = Auth::user();
        $self = new Self();
        // 1. Determine the Role Slug
        $roleSlug = $overrideRole ?? $user?->role?->slug ?? 'guest';

        // 2. Determine intended folder from map
        $targetFolder = $self->map[$roleSlug] ?? $self->fallback;
        error_log($overrideRole);
        error_log($targetFolder);
        $fullPath = "{$targetFolder}/{$viewName}";

        // 3. Return target if it exists
        if (View::exists($fullPath)) {
            return $fullPath;
        }

        // 4. Fallback logic
        if ($self->useFallback) {
            $fallbackPath = "{$self->fallback}/{$viewName}";
            
            // Only return fallback if it actually exists, 
            // otherwise return original path to let Laravel throw the standard 'View Not Found' error
            return View::exists($fallbackPath) ? $fallbackPath : $fullPath;
        }

        return $fullPath;
    }
}