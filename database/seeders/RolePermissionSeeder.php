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
        // Admin - all permissions
        $adminRole = Role::where('slug', 'admin')->first();
        if ($adminRole) {
            $allPermissionIds = Permission::all()->pluck('id')->toArray();
            $adminRole->permissions()->sync($allPermissionIds);
        }

        // Teacher permissions
        $teacherRole = Role::where('slug', 'teacher')->first();
        if ($teacherRole) {
            $teacherPermissionIds = Permission::whereIn('slug', [
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
                'leave_request.view',
                'leave_request.create',
                'leave_request.edit',
                'leave_request.delete',
            ])->pluck('id')->toArray();

            $teacherRole->permissions()->sync($teacherPermissionIds);
        }

        // Student permissions
        $studentRole = Role::where('slug', 'student')->first();
        if ($studentRole) {
            $studentPermissionIds = Permission::whereIn('slug', [
                'classroom.view',
                'attendance.view',
                'exam.view',
                'timetable.view',
                'event.view',
                'user.view',
                'leave_request.view',
                'leave_request.create',
            ])->pluck('id')->toArray();

            $studentRole->permissions()->sync($studentPermissionIds);
        }

        // Staff permissions
        $staffRole = Role::where('slug', 'staff')->first();
        if ($staffRole) {
            $staffPermissionIds = Permission::whereIn('slug', [
                'classroom.view',
                'classroom.create',
                'classroom.edit',
                'attendance.view',
                'attendance.create',
                'attendance.edit',
                'exam.view',
                'exam.create',
                'exam.edit',
                'timetable.view',
                'timetable.create',
                'timetable.edit',
                'event.view',
                'event.create',
                'event.edit',
                'user.view',
                'user.create',
                'user.edit',
                'reports.view',
                'reports.generate',
                'reports.export',
                'staff.manage',
                'leave_request.view',
                'leave_request.approve',
                'leave_request.reject',
            ])->pluck('id')->toArray();

            $staffRole->permissions()->sync($staffPermissionIds);
        }
    }
}
