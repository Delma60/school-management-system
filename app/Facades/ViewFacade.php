<?php

namespace App\Facades;

use Illuminate\Support\Facades\Facade;

/**
 * @method static string resolve(string $viewName, ?string $userRole = null)
 * @method static void mapRole(string $roleSlug, string $viewFolder)
 * @method static array getMappings()
 * @method static void setMappings(array $mappings)
 *
 * @see \App\Services\ViewResolver
 */
class ViewFacade extends Facade
{
    protected static function getFacadeAccessor()
    {
        return \App\Services\ViewResolver::class;
    }
}
