<?php

return [
    // Main Dashboard
    [
        'title' => 'Dashboard',
        'url' => 'dashboard',
        'icon' => 'LayoutDashboard',
        'isActive' => false,
        // Visible to all authenticated users
    ],

    // ==========================================
    // TEACHER & STAFF SPECIFIC MODULES
    // Scope these explicitly to the Teacher role 
    // to prevent Admins from seeing "My..." menus
    // ==========================================
    [
        'title' => 'My Classes',
        'url' => '/dashboard/teacher/classes',
        'icon' => 'BookOpen',
        'isActive' => false,
        'roleOrPermission' => 'role:teacher,permission:classroom.view', 
        'items' => [
            ['title' => 'Class Rosters', 'url' => 'classes.roosters', 'roleOrPermission' => 'role:teacher,permission:classroom.view'],
            ['title' => 'My Timetable', 'url' => 'timetable', 'roleOrPermission' => 'role:teacher,permission:timetable.view'],
            ['title' => 'Lesson Plans', 'url' => 'lesson-plans.index', 'roleOrPermission' => 'role:teacher,permission:lessonplan.view'],
            ['title' => 'Assignments', 'url' => 'assignments.index', 'roleOrPermission' => 'role:teacher,permission:subject.view'], 
        ],
    ],

    [
        'title' => 'My Students',
        'url' => '/dashboard/teacher/students',
        'icon' => 'Users',
        'isActive' => false,
        'roleOrPermission' => 'role:teacher,permission:student.view',
        'items' => [
            ['title' => 'Student Directory', 'url' => 'students.index', 'roleOrPermission' => 'role:teacher,permission:student.view'],
            ['title' => 'Mark Attendance', 'url' => 'attendances.index', 'roleOrPermission' => 'role:teacher,permission:attendance.create'],
            ['title' => 'Examinations & Grading', 'url' => 'grade-books.index', 'roleOrPermission' => 'role:teacher,permission:exam.manage-results'],
            ['title' => 'Behavioral Logs', 'url' => '/dashboard/teacher/students/behavior', 'roleOrPermission' => 'role:teacher,permission:student.view'], 
        ],
    ],

    [
        'title' => 'My HR Portal',
        'url' => '/dashboard/teacher/hr',
        'icon' => 'Briefcase',
        'isActive' => false,
        'roleOrPermission' => 'role:teacher,permission:leave.create', 
        'items' => [
            ['title' => 'Leave Requests', 'url' => '/dashboard/teacher/leave', 'roleOrPermission' => 'role:teacher,permission:leave.create'],
            ['title' => 'My Payslips', 'url' => '/dashboard/teacher/payslips', 'roleOrPermission' => 'role:teacher,permission:payroll.view'],
            ['title' => 'Profile Settings', 'url' => 'profile.edit'], // Usually open to everyone
        ],
    ],

    // ==========================================
    // SHARED MODULES (Admin & Staff)
    // No role specified, so it falls back to purely permission-based
    // ==========================================
    [
        'title' => 'Communication',
        'url' => '/dashboard/notices',
        'icon' => 'Megaphone',
        'isActive' => false,
        'roleOrPermission' => 'permission:event.view',
        'items' => [
            ['title' => 'Noticeboard', 'url' => '/dashboard/notices', 'roleOrPermission' => 'permission:event.view'],
            ['title' => 'Messages', 'url' => '/dashboard/teacher/messages', 'roleOrPermission' => 'permission:event.view'],
        ],
    ],

    // ==========================================
    // ADMIN SPECIFIC MODULES
    // Scope these explicitly to the Admin role 
    // to prevent Teachers from seeing global menus
    // ==========================================
    [
        'title' => 'Academics',
        'url' => '/dashboard/academics',
        'icon' => 'BookOpen',
        'isActive' => false,
        'roleOrPermission' => 'notRole:teacher|student,permission:classroom.view', 
        'items' => [
            ['title' => 'Classrooms', 'url' => 'classrooms.index', 'roleOrPermission' => 'notRole:teacher|student,permission:classroom.view'],
            ['title' => 'Subjects & Curricula', 'url' => 'subjects.index', 'roleOrPermission' => 'notRole:teacher|student,permission:subject.view'],
            ['title' => 'Timetables', 'url' => 'timetables.index', 'roleOrPermission' => 'notRole:teacher|student,permission:timetable.view'],
            ['title' => 'Examinations', 'url' => 'exams.index', 'roleOrPermission' => 'notRole:teacher|student,permission:exam.view'],
            ['title' => 'Grading Scales', 'url' => 'grades.index', 'roleOrPermission' => 'notRole:teacher|student,permission:gradingscale.view'],
        ],
    ],


    [
        'title' => 'Students',
        'url' => '/dashboard/students',
        'icon' => 'Users',
        'isActive' => false,
        'roleOrPermission' => 'notRole:teacher|student,permission:student.view',
        'items' => [
            ['title' => 'Student Directory', 'url' => 'students.index', 'roleOrPermission' => 'notRole:teacher|student,permission:student.view'],
            ['title' => 'Admissions', 'url' => 'admissions.create', 'roleOrPermission' => 'notRole:teacher|student,permission:student.create'],
            ['title' => 'Overall Attendance', 'url' => 'attendances.index', 'roleOrPermission' => 'notRole:teacher|student,permission:attendance.view'],
            ['title' => 'Performance Logs', 'url' => 'performance.index', 'roleOrPermission' => 'notRole:teacher|student,permission:exam.manage-results'],
        ],
    ],

    [
        'title' => 'Staff Management',
        'url' => '/dashboard/staff',
        'icon' => 'UserCheck',
        'isActive' => false,
        'roleOrPermission' => 'notRole:teacher|student,permission:staff.manage',
        'items' => [
            ['title' => 'Teacher Directory', 'url' => 'teachers.index', 'roleOrPermission' => 'notRole:teacher|student,permission:teacher.view'],
            ['title' => 'Non-Academic Staff', 'url' => 'staffs.others', 'roleOrPermission' => 'notRole:teacher|student,permission:staff.manage'],
            ['title' => 'Payroll & Leave Admin', 'url' => 'payroll.index', 'roleOrPermission' => 'notRole:teacher|student,permission:payroll.view'],
        ],
    ],

    [
        'title' => 'Finance',
        'url' => '/dashboard/finance',
        'icon' => 'Wallet',
        'isActive' => false,
        'roleOrPermission' => 'notRole:teacher|student,permission:fee.view',
        'items' => [
            ['title' => 'Fee Management', 'url' => 'fees.index', 'roleOrPermission' => 'notRole:teacher|student,permission:fee.view'],
            ['title' => 'Payments', 'url' => 'payments.index', 'roleOrPermission' => 'notRole:teacher|student,permission:payment.view'],
            ['title' => 'Expenses', 'url' => 'expenses.index', 'roleOrPermission' => 'notRole:teacher|student,permission:expense.view'],
            ['title' => 'Reports', 'url' => 'reports.index', 'roleOrPermission' => 'notRole:teacher|student,permission:reports.view'],
        ],
    ],

    [
        'title' => 'School Events',
        'url' => 'events.index',
        'icon' => 'Calendar',
        'isActive' => false,
        'roleOrPermission' => 'permission:event.view', // Intentionally left open to anyone with the permission
    ],

    [
        'title' => 'Administration',
        'url' => '/dashboard/admin',
        'icon' => 'ShieldCheck',
        'isActive' => false,
        'roleOrPermission' => 'notRole:teacher|student', // Purely role-based
        'items' => [
            ['title' => 'Roles & Permissions', 'url' => 'roles.index', 'roleOrPermission' => 'notRole:teacher|student'],
            ['title' => 'System Logs', 'url' => 'system-logs.index', 'roleOrPermission' => 'notRole:teacher|student,permission:system-log.view'],
            ['title' => 'School Profile', 'url' => 'school-profile.index', 'roleOrPermission' => 'notRole:teacher|student,permission:setting.manage'],
        ],
    ],

    [
        'title' => 'Settings',
        'url' => 'settings.index',
        'icon' => 'Settings',
        'isActive' => false,
        'roleOrPermission' => 'permission:setting.view',
    ],
];