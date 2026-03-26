<?php

namespace Database\Seeders;

use App\Models\Permission;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = [
            // Classrooms
            [
                'name' => 'View Classrooms',
                'slug' => 'classroom.view',
                'description' => 'Can view all classroom information',
                'group' => 'Academics',
            ],
            [
                'name' => 'Create Classroom',
                'slug' => 'classroom.create',
                'description' => 'Can create new classrooms',
                'group' => 'Academics',
            ],
            [
                'name' => 'Edit Classroom',
                'slug' => 'classroom.edit',
                'description' => 'Can edit classroom information',
                'group' => 'Academics',
            ],
            [
                'name' => 'Delete Classroom',
                'slug' => 'classroom.delete',
                'description' => 'Can delete classrooms',
                'group' => 'Academics',
            ],

            // Attendance
            [
                'name' => 'View Attendance',
                'slug' => 'attendance.view',
                'description' => 'Can view attendance records',
                'group' => 'Attendance',
            ],
            [
                'name' => 'Create Attendance',
                'slug' => 'attendance.create',
                'description' => 'Can record attendance',
                'group' => 'Attendance',
            ],
            [
                'name' => 'Edit Attendance',
                'slug' => 'attendance.edit',
                'description' => 'Can modify attendance records',
                'group' => 'Attendance',
            ],
            [
                'name' => 'Delete Attendance',
                'slug' => 'attendance.delete',
                'description' => 'Can delete attendance records',
                'group' => 'Attendance',
            ],

            // Examinations & Marks
            [
                'name' => 'View Exams',
                'slug' => 'exam.view',
                'description' => 'Can view examination details and results',
                'group' => 'Exams & Marks',
            ],
            [
                'name' => 'Create Exam',
                'slug' => 'exam.create',
                'description' => 'Can create new examinations',
                'group' => 'Exams & Marks',
            ],
            [
                'name' => 'Edit Exam',
                'slug' => 'exam.edit',
                'description' => 'Can edit examination details',
                'group' => 'Exams & Marks',
            ],
            [
                'name' => 'Delete Exam',
                'slug' => 'exam.delete',
                'description' => 'Can delete examinations',
                'group' => 'Exams & Marks',
            ],
            [
                'name' => 'Manage Exam Results',
                'slug' => 'exam.manage-results',
                'description' => 'Can enter and manage exam marks',
                'group' => 'Exams & Marks',
            ],

            // Timetables
            [
                'name' => 'View Timetables',
                'slug' => 'timetable.view',
                'description' => 'Can view class timetables',
                'group' => 'Timetables',
            ],
            [
                'name' => 'Create Timetable',
                'slug' => 'timetable.create',
                'description' => 'Can create timetables',
                'group' => 'Timetables',
            ],
            [
                'name' => 'Edit Timetable',
                'slug' => 'timetable.edit',
                'description' => 'Can edit timetables',
                'group' => 'Timetables',
            ],
            [
                'name' => 'Delete Timetable',
                'slug' => 'timetable.delete',
                'description' => 'Can delete timetables',
                'group' => 'Timetables',
            ],

            // School Events
            [
                'name' => 'View Events',
                'slug' => 'event.view',
                'description' => 'Can view school events',
                'group' => 'School Events',
            ],
            [
                'name' => 'Create Event',
                'slug' => 'event.create',
                'description' => 'Can create school events',
                'group' => 'School Events',
            ],
            [
                'name' => 'Edit Event',
                'slug' => 'event.edit',
                'description' => 'Can edit school events',
                'group' => 'School Events',
            ],
            [
                'name' => 'Delete Event',
                'slug' => 'event.delete',
                'description' => 'Can delete school events',
                'group' => 'School Events',
            ],

            // User Management
            [
                'name' => 'View Users',
                'slug' => 'user.view',
                'description' => 'Can view user accounts',
                'group' => 'User Management',
            ],
            [
                'name' => 'Create User',
                'slug' => 'user.create',
                'description' => 'Can create new user accounts',
                'group' => 'User Management',
            ],
            [
                'name' => 'Edit User',
                'slug' => 'user.edit',
                'description' => 'Can edit user information',
                'group' => 'User Management',
            ],
            [
                'name' => 'Delete User',
                'slug' => 'user.delete',
                'description' => 'Can delete user accounts',
                'group' => 'User Management',
            ],
            [
                'name' => 'Assign Role',
                'slug' => 'user.assign-role',
                'description' => 'Can assign roles to users',
                'group' => 'User Management',
            ],

            // Reports
            [
                'name' => 'View Reports',
                'slug' => 'reports.view',
                'description' => 'Can view system reports',
                'group' => 'Reports',
            ],
            [
                'name' => 'Generate Reports',
                'slug' => 'reports.generate',
                'description' => 'Can generate new reports',
                'group' => 'Reports',
            ],
            [
                'name' => 'Export Reports',
                'slug' => 'reports.export',
                'description' => 'Can export reports to files',
                'group' => 'Reports',
            ],

            // Staff Management
            [
                'name' => 'Manage Staff',
                'slug' => 'staff.manage',
                'description' => 'Can manage staff information',
                'group' => 'User Management',
            ],
            // Fee
            [
                'name' => 'View Fees',
                'slug' => 'fee.view',
                'description' => 'Can view fee structures',
                'group' => 'Finance',
            ],
            [
                'name' => 'Create Fee',
                'slug' => 'fee.create',
                'description' => 'Can create new fee structures',
                'group' => 'Finance',
            ],
            [
                'name' => 'Edit Fee',
                'slug' => 'fee.edit',
                'description' => 'Can edit fee structures',
                'group' => 'Finance',
            ],
            [
                'name' => 'Delete Fee',
                'slug' => 'fee.delete',
                'description' => 'Can delete fee structures',
                'group' => 'Finance',
            ],
            [
                'name' => 'Assign Fee',
                'slug' => 'fee.assign',
                'description' => 'Can assign fee structures to students',
                'group' => 'Finance',
            ],
            [
                'name' => 'View Payments',
                'slug' => 'payment.view',
                'description' => 'Can view payment records',
                'group' => 'Finance',
            ],
            [
                'name' => 'Create Payment',
                'slug' => 'payment.create',
                'description' => 'Can create new payments',
                'group' => 'Finance',
            ],
            [
                'name' => 'Edit Payment',
                'slug' => 'payment.edit',
                'description' => 'Can edit payment records',
                'group' => 'Finance',
            ],
            [
                'name' => 'Delete Payment',
                'slug' => 'payment.delete',
                'description' => 'Can delete payment records',
                'group' => 'Finance',
            ],
            [
                'name' => 'View Payroll',
                'slug' => 'payroll.view',
                'description' => 'Can view payroll records',
                'group' => 'Finance',
            ],
            
        ];

        foreach ($permissions as $permission) {
            Permission::updateOrCreate(
                ['slug' => $permission['slug']],
                $permission
            );
        }
    }
}
