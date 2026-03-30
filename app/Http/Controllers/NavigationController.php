<?php

namespace App\Http\Controllers;

use App\Services\NavigationService;
use Illuminate\Http\JsonResponse;

class NavigationController extends Controller
{
    public function __construct(private NavigationService $navigationService)
    {
    }

    /**
     * Get main navigation items for authenticated user
     */
    public function getMainNav(): JsonResponse
    {
        return response()->json([
            'data' => $this->navigationService->getNavItems(),
        ]);
    }

    /**
     * Get settings navigation items
     */
    public function getSettingsNav(): JsonResponse
    {
        return response()->json([
            'data' => $this->navigationService->getSettingsNavItems(),
        ]);
    }
}
