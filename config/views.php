<?php

return [
    /**
     * Role to View Folder Mapping
     *
     * Maps user roles to their corresponding view folders.
     * Multiple roles can map to the same folder for shared views.
     *
     * If a view doesn't exist in the mapped folder, it falls back to 'shared' folder.
     *
     * Example:
     *  'admin' => 'admin',      // admin role uses admin/ views
     *  'owner' => 'admin',      // owner role ALSO uses admin/ views (shared)
     *  'principal' => 'admin',  // principal role ALSO uses admin/ views (shared)
     */
    'role_view_map' => [
        'admin' => 'admin',
        'principal' => 'admin',
        'owner' => 'admin',
        'staff' => 'staff',
        'teacher' => 'teacher',
        'student' => 'student',
    ],

    /**
     * Fallback view folder if role is not in the map
     * or if the role-specific view doesn't exist
     */
    'fallback_folder' => 'shared',

    /**
     * Enable automatic fallback to shared views
     * If false, it will throw an error if view doesn't exist
     */
    'enable_fallback' => true,
];
