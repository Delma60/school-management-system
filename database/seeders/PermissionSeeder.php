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
            // Subject
            [
                'name' => 'View Subject',
                'slug' => 'subject.view',
                'description' => 'Can view subjects',
                'group' => 'Academics'
            ],
            [
                'name' => 'Create Subject',
                'slug' => 'subject.create',
                'description' => 'Can create subjects for classrooms or students',
                'group' => 'Academics'
            ],

            [
                'name' => 'Edit Subject',
                'slug' => 'subject.edit',
                'description' => 'Can edit existing subjects',
                'group' => 'Academics'
            ],

            [
                'name' => 'Delete Subject',
                'slug' => 'subject.delete',
                'description' => 'Can delete exi subjects',
                'group' => 'Academics'
            ],

            // Timetable Time Breaks
            [
                'name' => 'View Time Breaks',
                'slug' => 'timebreak.view',
                'description' => 'Can view school time breaks',
                'group' => 'Timetables',
            ],
            [
                'name' => 'Create Time Break',
                'slug' => 'timebreak.create',
                'description' => 'Can create new time breaks',
                'group' => 'Timetables',
            ],
            [
                'name' => 'Edit Time Break',
                'slug' => 'timebreak.edit',
                'description' => 'Can edit time breaks',
                'group' => 'Timetables',
            ],
            [
                'name' => 'Delete Time Break',
                'slug' => 'timebreak.delete',
                'description' => 'Can delete time breaks',
                'group' => 'Timetables',
            ],

            // Lesson Plan
            [
                'name' => 'View Lesson Plans',
                'slug' => 'lessonplan.view',
                'description' => 'Can view lesson plans',
                'group' => 'Academics',
            ],
            [
                'name' => 'Create Lesson Plan',
                'slug' => 'lessonplan.create',
                'description' => 'Can create lesson plans',
                'group' => 'Academics',
            ],
            [
                'name' => 'Edit Lesson Plan',
                'slug' => 'lessonplan.edit',
                'description' => 'Can edit lesson plans',
                'group' => 'Academics',
            ],
            [
                'name' => 'Delete Lesson Plan',
                'slug' => 'lessonplan.delete',
                'description' => 'Can delete lesson plans',
                'group' => 'Academics',
            ],

            // Student Management
            [
                'name' => 'View Students',
                'slug' => 'student.view',
                'description' => 'Can view student information',
                'group' => 'Student Management',
            ],
            [
                'name' => 'Create Student',
                'slug' => 'student.create',
                'description' => 'Can create new student accounts',
                'group' => 'Student Management',
            ],
            [
                'name' => 'Edit Student',
                'slug' => 'student.edit',
                'description' => 'Can edit student information',
                'group' => 'Student Management',
            ],
            [
                'name' => 'Delete Student',
                'slug' => 'student.delete',
                'description' => 'Can delete student accounts',
                'group' => 'Student Management',
            ],
            [
                'name' => 'View Student Fees',
                'slug' => 'student.view-fees',
                'description' => 'Can view student fee information',
                'group' => 'Student Management',
            ],

            // Teacher Management
            [
                'name' => 'View Teachers',
                'slug' => 'teacher.view',
                'description' => 'Can view teacher information',
                'group' => 'Staff Management',
            ],
            [
                'name' => 'Create Teacher',
                'slug' => 'teacher.create',
                'description' => 'Can create new teacher accounts',
                'group' => 'Staff Management',
            ],
            [
                'name' => 'Edit Teacher',
                'slug' => 'teacher.edit',
                'description' => 'Can edit teacher information',
                'group' => 'Staff Management',
            ],
            [
                'name' => 'Delete Teacher',
                'slug' => 'teacher.delete',
                'description' => 'Can delete teacher accounts',
                'group' => 'Staff Management',
            ],
            [
                'name' => 'Assign Teacher to Class',
                'slug' => 'teacher.assign-class',
                'description' => 'Can assign teachers to classrooms',
                'group' => 'Staff Management',
            ],

            // Leave Request Management
            [
                'name' => 'View Leave Requests',
                'slug' => 'leave.view',
                'description' => 'Can view leave requests',
                'group' => 'Staff Management',
            ],
            [
                'name' => 'Create Leave Request',
                'slug' => 'leave.create',
                'description' => 'Can create leave requests',
                'group' => 'Staff Management',
            ],
            [
                'name' => 'Approve Leave',
                'slug' => 'leave.approve',
                'description' => 'Can approve leave requests',
                'group' => 'Staff Management',
            ],
            [
                'name' => 'Reject Leave',
                'slug' => 'leave.reject',
                'description' => 'Can reject leave requests',
                'group' => 'Staff Management',
            ],
            [
                'name' => 'Delete Leave Request',
                'slug' => 'leave.delete',
                'description' => 'Can delete leave requests',
                'group' => 'Staff Management',
            ],

            // Expense Management
            [
                'name' => 'View Expenses',
                'slug' => 'expense.view',
                'description' => 'Can view expense records',
                'group' => 'Finance',
            ],
            [
                'name' => 'Create Expense',
                'slug' => 'expense.create',
                'description' => 'Can create new expenses',
                'group' => 'Finance',
            ],
            [
                'name' => 'Edit Expense',
                'slug' => 'expense.edit',
                'description' => 'Can edit expense records',
                'group' => 'Finance',
            ],
            [
                'name' => 'Delete Expense',
                'slug' => 'expense.delete',
                'description' => 'Can delete expense records',
                'group' => 'Finance',
            ],
            [
                'name' => 'Manage Payroll',
                'slug' => 'payroll.manage',
                'description' => 'Can manage payroll records',
                'group' => 'Finance',
            ],

            // Grading Scale Management
            [
                'name' => 'View Grading Scales',
                'slug' => 'gradingscale.view',
                'description' => 'Can view grading scales',
                'group' => 'Exams & Marks',
            ],
            [
                'name' => 'Create Grading Scale',
                'slug' => 'gradingscale.create',
                'description' => 'Can create new grading scales',
                'group' => 'Exams & Marks',
            ],
            [
                'name' => 'Edit Grading Scale',
                'slug' => 'gradingscale.edit',
                'description' => 'Can edit grading scales',
                'group' => 'Exams & Marks',
            ],
            [
                'name' => 'Delete Grading Scale',
                'slug' => 'gradingscale.delete',
                'description' => 'Can delete grading scales',
                'group' => 'Exams & Marks',
            ],

            // Fee Type Management
            [
                'name' => 'View Fee Types',
                'slug' => 'feetype.view',
                'description' => 'Can view fee types',
                'group' => 'Finance',
            ],
            [
                'name' => 'Create Fee Type',
                'slug' => 'feetype.create',
                'description' => 'Can create new fee types',
                'group' => 'Finance',
            ],
            [
                'name' => 'Edit Fee Type',
                'slug' => 'feetype.edit',
                'description' => 'Can edit fee types',
                'group' => 'Finance',
            ],
            [
                'name' => 'Delete Fee Type',
                'slug' => 'feetype.delete',
                'description' => 'Can delete fee types',
                'group' => 'Finance',
            ],

            // System Settings
            [
                'name' => 'View Settings',
                'slug' => 'setting.view',
                'description' => 'Can view system settings',
                'group' => 'System',
            ],
            [
                'name' => 'Manage Settings',
                'slug' => 'setting.manage',
                'description' => 'Can manage system settings',
                'group' => 'System',
            ],

            // System Logs
            [
                'name' => 'View System Logs',
                'slug' => 'log.view',
                'description' => 'Can view system activity logs',
                'group' => 'System',
            ],
            [
                'name' => 'Delete System Logs',
                'slug' => 'log.delete',
                'description' => 'Can delete system logs',
                'group' => 'System',
            ],

            // Role Management
            [
                'name' => 'View Roles',
                'slug' => 'role.view',
                'description' => 'Can view system roles',
                'group' => 'System',
            ],
            [
                'name' => 'Create Role',
                'slug' => 'role.create',
                'description' => 'Can create new roles',
                'group' => 'System',
            ],
            [
                'name' => 'Edit Role',
                'slug' => 'role.edit',
                'description' => 'Can edit role information',
                'group' => 'System',
            ],
            [
                'name' => 'Delete Role',
                'slug' => 'role.delete',
                'description' => 'Can delete roles',
                'group' => 'System',
            ],
            [
                'name' => 'Manage Role Permissions',
                'slug' => 'role.manage-permissions',
                'description' => 'Can assign permissions to roles',
                'group' => 'System',
            ],

            // Exam Subject Management
            [
                'name' => 'View Exam Subjects',
                'slug' => 'examsubject.view',
                'description' => 'Can view exam subjects',
                'group' => 'Exams & Marks',
            ],
            [
                'name' => 'Create Exam Subject',
                'slug' => 'examsubject.create',
                'description' => 'Can create exam subjects',
                'group' => 'Exams & Marks',
            ],
            [
                'name' => 'Edit Exam Subject',
                'slug' => 'examsubject.edit',
                'description' => 'Can edit exam subjects',
                'group' => 'Exams & Marks',
            ],
            [
                'name' => 'Delete Exam Subject',
                'slug' => 'examsubject.delete',
                'description' => 'Can delete exam subjects',
                'group' => 'Exams & Marks',
            ],

            // Leave Request Management
            [
                'name' => 'View Leave Requests',
                'slug' => 'leave_request.view',
                'description' => 'Can view leave requests',
                'group' => 'Leave Management',
            ],
            [
                'name' => 'Create Leave Request',
                'slug' => 'leave_request.create',
                'description' => 'Can create new leave requests',
                'group' => 'Leave Management',
            ],
            [
                'name' => 'Edit Leave Request',
                'slug' => 'leave_request.edit',
                'description' => 'Can edit leave requests',
                'group' => 'Leave Management',
            ],
            [
                'name' => 'Delete Leave Request',
                'slug' => 'leave_request.delete',
                'description' => 'Can delete leave requests',
                'group' => 'Leave Management',
            ],
            [
                'name' => 'Approve Leave Request',
                'slug' => 'leave_request.approve',
                'description' => 'Can approve leave requests',
                'group' => 'Leave Management',
            ],
            [
                'name' => 'Reject Leave Request',
                'slug' => 'leave_request.reject',
                'description' => 'Can reject leave requests',
                'group' => 'Leave Management',
            ],

        ];

        $createdCount = 0;
        $updatedCount = 0;

        foreach ($permissions as $permission) {
            $result = Permission::updateOrCreate(
                ['slug' => $permission['slug']],
                $permission
            );

            if ($result->wasRecentlyCreated) {
                $createdCount++;
            } else {
                $updatedCount++;
            }
        }

        $this->command->info("\n✅ Permissions seeded successfully!");
        $this->command->info("   ✓ Created: {$createdCount}");
        $this->command->info("   ✓ Updated: {$updatedCount}");
        $this->command->info("   ✓ Total: " . count($permissions));
    }
}
