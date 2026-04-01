<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            [
                'name' => 'Admin',
                'slug' => 'admin',
                'description' => 'System administrator with full access to all features',
                'is_admin' => true,
                'is_system' => true,
            ],
            [
                'name' => 'Teacher',
                'slug' => 'teacher',
                'description' => 'Teacher with access to classroom, attendance, and grading features',
                'is_admin' => false,
                'is_system' => true,
            ],
            [
                'name' => 'Student',
                'slug' => 'student',
                'description' => 'Student with view-only access to their own records',
                'is_admin' => false,
                'is_system' => true,
            ],
            [
                'name' => 'Staff',
                'slug' => 'staff',
                'description' => 'School staff member with administrative access',
                'is_admin' => false,
                'is_system' => true,
            ],
            [
                'name' => 'Parent',
                'slug' => 'parent',
                'description' => 'Parent with limited access to view child\'s academic records',
                'is_admin' => false,
                'is_system' => true,
            ],
        ];

        foreach ($roles as $role) {
            $existingRole = Role::where('slug', $role['slug'])->first();
            if (!$existingRole) {
                Role::create($role);
                $this->command->info("✓ Role '{$role['name']}' created successfully");
            } else {
                $this->command->warn("◆ Role '{$role['name']}' already exists");
            }
        }
    }
}
