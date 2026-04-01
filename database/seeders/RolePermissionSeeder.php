<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\Permission;
use Illuminate\Database\Seeder;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all permissions
        $allPermissions = Permission::all()->pluck('id')->toArray();

        // Admin - all permissions
        $adminRole = Role::where('slug', 'admin')->first();
        if ($adminRole) {
            $adminRole->givePermissions($allPermissions);
            $this->command->info("✓ Admin role assigned all permissions");
        }

        // Teacher permissions - academic and personal management
        $teacherRole = Role::where('slug', 'teacher')->first();
        if ($teacherRole) {
            $teacherPermissions = [
                'classroom.view',
                'attendance.view',
                'attendance.create',
                'attendance.edit',
                'exam.view',
                'exam.manage-results',
                'timetable.view',
                'event.view',
                'user.view',
                'reports.view',
                'reports.generate',
                'subject.view',
                'lessonplan.view',
                'lessonplan.create',
                'lessonplan.edit',
                'leave.view',
                'leave.create',
                'leave.delete',
            ];

            $permissionIds = Permission::whereIn('slug', $teacherPermissions)->pluck('id')->toArray();
            $teacherRole->givePermissions($permissionIds);
            $this->command->info("✓ Teacher role assigned " . count($permissionIds) . " permissions");
        }

        // Student permissions - view-only access
        $studentRole = Role::where('slug', 'student')->first();
        if ($studentRole) {
            $studentPermissions = [
                'classroom.view',
                'attendance.view',
                'exam.view',
                'timetable.view',
                'event.view',
                'user.view',
                'student.view-fees',
                'leave.view',
                'leave.create',
            ];

            $permissionIds = Permission::whereIn('slug', $studentPermissions)->pluck('id')->toArray();
            $studentRole->givePermissions($permissionIds);
            $this->command->info("✓ Student role assigned " . count($permissionIds) . " permissions");
        }

        // Staff permissions - full administrative access
        $staffRole = Role::where('slug', 'staff')->first();
        if ($staffRole) {
            $staffPermissions = [
                // Academics
                'classroom.view',
                'classroom.create',
                'classroom.edit',
                'classroom.delete',
                'subject.view',
                'subject.create',
                'subject.edit',
                'subject.delete',
                'timetable.view',
                'timetable.create',
                'timetable.edit',
                'timetable.delete',
                'timebreak.view',
                'timebreak.create',
                'timebreak.edit',
                'timebreak.delete',
                'lessonplan.view',
                'lessonplan.create',
                'lessonplan.edit',
                'lessonplan.delete',
                'exam.view',
                'exam.create',
                'exam.edit',
                'exam.manage-results',
                'gradingscale.view',
                'gradingscale.create',
                'gradingscale.edit',
                'examsubject.view',
                'examsubject.create',
                'examsubject.edit',

                // Attendance
                'attendance.view',
                'attendance.create',
                'attendance.edit',
                'attendance.delete',

                // Users & Roles
                'user.view',
                'user.create',
                'user.edit',
                'user.delete',
                'user.assign-role',
                'student.view',
                'student.create',
                'student.edit',
                'student.delete',
                'student.view-fees',
                'teacher.view',
                'teacher.create',
                'teacher.edit',
                'teacher.delete',
                'teacher.assign-class',
                'staff.manage',
                'role.view',
                'role.create',
                'role.edit',
                'role.manage-permissions',

                // Finance
                'fee.view',
                'fee.create',
                'fee.edit',
                'fee.delete',
                'fee.assign',
                'payment.view',
                'payment.create',
                'payment.edit',
                'payment.delete',
                'payroll.view',
                'payroll.manage',
                'expense.view',
                'expense.create',
                'expense.edit',
                'expense.delete',
                'feetype.view',
                'feetype.create',
                'feetype.edit',
                'feetype.delete',

                // Reports & Events
                'reports.view',
                'reports.generate',
                'reports.export',
                'event.view',
                'event.create',
                'event.edit',
                'event.delete',

                // Leave Management
                'leave.view',
                'leave.create',
                'leave.approve',
                'leave.reject',
                'leave.delete',

                // System
                'setting.view',
                'setting.manage',
                'log.view',
                'log.delete',
            ];

            $permissionIds = Permission::whereIn('slug', $staffPermissions)->pluck('id')->toArray();
            $staffRole->givePermissions($permissionIds);
            $this->command->info("✓ Staff role assigned " . count($permissionIds) . " permissions");
        }

        // Parent permissions - limited view-only access
        $parentRole = Role::where('slug', 'parent')->first();
        if ($parentRole) {
            $parentPermissions = [
                'student.view',
                'exam.view',
                'attendance.view',
                'event.view',
                'student.view-fees',
            ];

            $permissionIds = Permission::whereIn('slug', $parentPermissions)->pluck('id')->toArray();
            $parentRole->givePermissions($permissionIds);
            $this->command->info("✓ Parent role assigned " . count($permissionIds) . " permissions");
        }

        $this->command->info("\n✅ All role-permission mappings completed!");
    }
}
