<?php

namespace App\Services;

use Illuminate\Support\Facades\Auth;

class NavigationService
{
    /**
     * Get navigation items for authenticated user based on their permissions
     */
    public function getNavItems(): array
    {
        $user = Auth::user();

        if (!$user) {
            return [];
        }

        $navItems = [
            [
                'title' => 'Dashboard',
                'url' => '/dashboard',
                'icon' => 'LayoutDashboard',
                'isActive' => false,
            ],
        ];

        // Teacher & Staff Specific Modules
        if ($user->hasPermission('view_own_classes') || $user->hasPermission('classroom.view')) {
            $navItems[] = [
                'title' => 'My Classes',
                'url' => '/dashboard/teacher/classes',
                'icon' => 'BookOpen',
                'isActive' => false,
                'permission' => 'view_own_classes',
                'items' => [
                    ['title' => 'Class Rosters', 'url' => '/dashboard/teacher/classes/rosters', 'permission' => 'view_own_classes'],
                    ['title' => 'My Timetable', 'url' => '/dashboard/teacher/timetable', 'permission' => 'view_own_classes'],
                    ['title' => 'Lesson Plans', 'url' => '/dashboard/teacher/lesson-plans', 'permission' => 'manage_lesson_plans'],
                    ['title' => 'Assignments', 'url' => '/dashboard/teacher/assignments', 'permission' => 'manage_assignments'],
                ],
            ];
        }

        if ($user->hasPermission('view_own_students') || $user->hasPermission('student.view')) {
            $navItems[] = [
                'title' => 'My Students',
                'url' => '/dashboard/teacher/students',
                'icon' => 'Users',
                'isActive' => false,
                'permission' => 'view_own_students',
                'items' => [
                    ['title' => 'Student Directory', 'url' => '/dashboard/teacher/students/directory', 'permission' => 'view_own_students'],
                    ['title' => 'Mark Attendance', 'url' => '/dashboard/teacher/attendance', 'permission' => 'mark_own_attendance'],
                    ['title' => 'Examinations & Grading', 'url' => '/dashboard/teacher/grades', 'permission' => 'manage_own_grades'],
                    ['title' => 'Behavioral Logs', 'url' => '/dashboard/teacher/students/behavior', 'permission' => 'manage_behavior_logs'],
                ],
            ];
        }

        if ($user->hasPermission('view_hr_portal') || $user->hasPermission('leave.view')) {
            $navItems[] = [
                'title' => 'My HR Portal',
                'url' => '/dashboard/teacher/hr',
                'icon' => 'Briefcase',
                'isActive' => false,
                'permission' => 'view_hr_portal',
                'items' => [
                    ['title' => 'Leave Requests', 'url' => '/dashboard/teacher/leave', 'permission' => 'request_leave'],
                    ['title' => 'My Payslips', 'url' => '/dashboard/teacher/payslips', 'permission' => 'view_payslips'],
                    ['title' => 'Profile Settings', 'url' => route('profile.edit')],
                ],
            ];
        }

        // Shared Modules (Admin & Staff)
        if ($user->hasPermission('view_communications') || $user->hasPermission('event.view')) {
            $navItems[] = [
                'title' => 'Communication',
                'url' => '/dashboard/notices',
                'icon' => 'Megaphone',
                'isActive' => false,
                'permission' => 'view_communications',
                'items' => [
                    ['title' => 'Noticeboard', 'url' => '/dashboard/notices', 'permission' => 'view_notices'],
                    ['title' => 'Messages', 'url' => '/dashboard/teacher/messages', 'permission' => 'send_messages'],
                ],
            ];
        }

        // Admin Specific Modules
        if ($user->hasPermission('manage_academics') || $user->hasPermission('classroom.view')) {
            $navItems[] = [
                'title' => 'Academics',
                'url' => '/dashboard/academics',
                'icon' => 'BookOpen',
                'isActive' => false,
                'permission' => 'manage_academics',
                'items' => [
                    ['title' => 'Classrooms', 'url' => '/dashboard/academics/classrooms', 'permission' => 'manage_classrooms'],
                    ['title' => 'Subjects & Curricula', 'url' => '/dashboard/academics/subjects', 'permission' => 'manage_subjects'],
                    ['title' => 'Timetables', 'url' => '/dashboard/academics/timetables', 'permission' => 'manage_timetables'],
                    ['title' => 'Examinations', 'url' => '/dashboard/academics/exams', 'permission' => 'manage_examinations'],
                ],
            ];
        }

        if ($user->hasPermission('user.view')) {
            $navItems[] = [
                'title' => 'Students',
                'url' => '/dashboard/students',
                'icon' => 'Users',
                'isActive' => false,
                'permission' => 'user.view',
                'items' => [
                    ['title' => 'Student Directory', 'url' => '/dashboard/students', 'permission' => 'user.view'],
                    ['title' => 'Admissions', 'url' => route('admissions.create'), 'permission' => 'user.create'],
                    ['title' => 'Overall Attendance', 'url' => '/dashboard/students/attendances', 'permission' => 'attendance.view'],
                    ['title' => 'Performance Logs', 'url' => '/dashboard/students/performance', 'permission' => 'view_all_performance'],
                ],
            ];
        }

        if ($user->hasPermission('payroll.view') || $user->hasPermission('teacher.view')) {
            $navItems[] = [
                'title' => 'Staff Management',
                'url' => route('staffs.others'),
                'icon' => 'UserCheck',
                'isActive' => false,
                'items' => [
                    ['title' => 'Teacher Directory', 'url' => route('teachers.index'), 'permission' => 'manage_teachers'],
                    ['title' => 'Non-Academic Staff', 'url' => route('staffs.others'), 'permission' => 'manage_other_staff'],
                    ['title' => 'Payroll & Leave Admin', 'url' => route('payroll.index'), 'permission' => 'payroll.view'],
                ],
            ];
        }

        if ($user->hasPermission('manage_finance') || $user->hasPermission('payment.view')) {
            $navItems[] = [
                'title' => 'Finance',
                'url' => '/dashboard/finance',
                'icon' => 'Wallet',
                'isActive' => false,
                'permission' => 'manage_finance',
                'items' => [
                    ['title' => 'Fee Management', 'url' => '/dashboard/finance/fees', 'permission' => 'manage_fees'],
                    ['title' => 'Expenses', 'url' => '/dashboard/finance/expenses', 'permission' => 'manage_expenses'],
                    ['title' => 'Reports', 'url' => '/dashboard/finance/reports', 'permission' => 'view_finance_reports'],
                ],
            ];
        }

        if ($user->hasPermission('user.assign-role') || $user->hasPermission('role.view')) {
            $navItems[] = [
                'title' => 'Administration',
                'url' => '/dashboard/admin',
                'icon' => 'ShieldCheck',
                'isActive' => false,
                'permission' => 'user.assign-role',
                'items' => [
                    ['title' => 'Roles & Permissions', 'url' => '/dashboard/roles', 'permission' => 'user.assign-role'],
                    ['title' => 'System Logs', 'url' => route('system-logs.index'), 'permission' => 'view_system_logs'],
                    ['title' => 'School Profile', 'url' => route('school-profile.index'), 'permission' => 'manage_school_profile'],
                ],
            ];
        }

        if ($user->hasPermission('manage_settings') || $user->hasPermission('setting.manage')) {
            $navItems[] = [
                'title' => 'Settings',
                'url' => '/dashboard/settings',
                'icon' => 'Settings',
                'isActive' => false,
                'permission' => 'manage_settings',
            ];
        }

        return $navItems;
    }

    /**
     * Get settings navigation items
     */
    public function getSettingsNavItems(): array
    {
        return [
            [
                'title' => 'Profile',
                'url' => '/settings/profile',
                'icon' => null,
            ],
            [
                'title' => 'Password',
                'url' => '/settings/password',
                'icon' => null,
            ],
            [
                'title' => 'Appearance',
                'url' => '/settings/appearance',
                'icon' => null,
            ],
        ];
    }
}
