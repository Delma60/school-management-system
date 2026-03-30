<?php

return [
    // Main Dashboard
    [
        'title' => 'Dashboard',
        'url' => 'dashboard',
        'icon' => 'LayoutDashboard',
        'isActive' => false,
        // Typically no permission needed; visible to all logged-in users
    ],

    // ==========================================
    // TEACHER & STAFF SPECIFIC MODULES
    // ==========================================
    [
        'title' => 'My Classes',
        'url' => '/dashboard/teacher/classes',
        'icon' => 'BookOpen',
        'isActive' => false,
        'permission' => 'classroom.view', 
        'items' => [
            ['title' => 'Class Rosters', 'url' => '/dashboard/teacher/classes/rosters', 'permission' => 'classroom.view'],
            ['title' => 'My Timetable', 'url' => '/dashboard/teacher/timetable', 'permission' => 'timetable.view'],
            ['title' => 'Lesson Plans', 'url' => '/dashboard/teacher/lesson-plans', 'permission' => 'lessonplan.view'],
            // Note: 'Assignment' permission isn't in your seeder yet, mapping to subject.view for now
            ['title' => 'Assignments', 'url' => '/dashboard/teacher/assignments', 'permission' => 'subject.view'], 
        ],
    ],

    [
        'title' => 'My Students',
        'url' => '/dashboard/teacher/students',
        'icon' => 'Users',
        'isActive' => false,
        'permission' => 'student.view',
        'items' => [
            ['title' => 'Student Directory', 'url' => '/dashboard/teacher/students/directory', 'permission' => 'student.view'],
            ['title' => 'Mark Attendance', 'url' => '/dashboard/teacher/attendance', 'permission' => 'attendance.create'],
            ['title' => 'Examinations & Grading', 'url' => '/dashboard/teacher/grades', 'permission' => 'exam.manage-results'],
            // Note: 'Behavioral Logs' isn't in your seeder, mapping to student.view for now
            ['title' => 'Behavioral Logs', 'url' => '/dashboard/teacher/students/behavior', 'permission' => 'student.view'], 
        ],
    ],

    [
        'title' => 'My HR Portal',
        'url' => '/dashboard/teacher/hr',
        'icon' => 'Briefcase',
        'isActive' => false,
        'permission' => 'leave.create', // Or payroll.view
        'items' => [
            ['title' => 'Leave Requests', 'url' => '/dashboard/teacher/leave', 'permission' => 'leave.create'],
            ['title' => 'My Payslips', 'url' => '/dashboard/teacher/payslips', 'permission' => 'payroll.view'],
            ['title' => 'Profile Settings', 'url' =>  'profile.edit'], // Usually open to everyone
        ],
    ],

    // ==========================================
    // SHARED MODULES (Admin & Staff)
    // ==========================================
    [
        'title' => 'Communication',
        'url' => '/dashboard/notices',
        'icon' => 'Megaphone',
        'isActive' => false,
        'permission' => 'event.view', // Closest match in your seeder to "Notices"
        'items' => [
            ['title' => 'Noticeboard', 'url' => '/dashboard/notices', 'permission' => 'event.view'],
            // Messages isn't in the seeder, falling back to event.view
            ['title' => 'Messages', 'url' => '/dashboard/teacher/messages', 'permission' => 'event.view'],
        ],
    ],

    // ==========================================
    // ADMIN SPECIFIC MODULES
    // ==========================================
    [
        'title' => 'Academics',
        'url' => '/dashboard/academics',
        'icon' => 'BookOpen',
        'isActive' => false,
        'permission' => 'classroom.view', // Gatekeeper for this menu
        'items' => [
            ['title' => 'Classrooms', 'url' =>  'classrooms.index ', 'permission' => 'classroom.view'],
            ['title' => 'Subjects & Curricula', 'url' =>  'subjects.index ', 'permission' => 'subject.view'],
            ['title' => 'Timetables', 'url' =>  'timetables.index ', 'permission' => 'timetable.view'],
            ['title' => 'Examinations', 'url' =>  'exams.index ', 'permission' => 'exam.view'],
            ['title' => 'Grading Scales', 'url' =>  'grades.index ', 'permission' => 'gradingscale.view'],
        ],
    ],

    [
        'title' => 'Exam Management',
        'url' => '/dashboard/exam_marks',
        'icon' => 'FileText',
        'isActive' => false,
        'permission' => 'exam.manage-results',
        'items' => [
            ['title' => 'Enter Marks', 'url' =>  'exam_marks.create ', 'permission' => 'exam.manage-results'],
            ['title' => 'View Marks', 'url' =>  'exam_marks.index ', 'permission' => 'exam.view'],
        ],
    ],

    [
        'title' => 'Students',
        'url' => '/dashboard/students',
        'icon' => 'Users',
        'isActive' => false,
        'permission' => 'student.view',
        'items' => [
            ['title' => 'Student Directory', 'url' =>  'students.index ', 'permission' => 'student.view'],
            ['title' => 'Admissions', 'url' =>  'admissions.create ', 'permission' => 'student.create'],
            ['title' => 'Overall Attendance', 'url' =>  'attendances.index ', 'permission' => 'attendance.view'],
            ['title' => 'Performance Logs', 'url' =>  'performance.index ', 'permission' => 'exam.manage-results'],
        ],
    ],

    [
        'title' => 'Staff Management',
        'url' => '/dashboard/staff',
        'icon' => 'UserCheck',
        'isActive' => false,
        'permission' => 'staff.manage',
        'items' => [
            ['title' => 'Teacher Directory', 'url' =>  'teachers.index ', 'permission' => 'teacher.view'],
            ['title' => 'Non-Academic Staff', 'url' =>  'staffs.others ', 'permission' => 'staff.manage'],
            ['title' => 'Payroll & Leave Admin', 'url' =>  'payroll.index ', 'permission' => 'payroll.view'],
        ],
    ],

    [
        'title' => 'Finance',
        'url' => '/dashboard/finance',
        'icon' => 'Wallet',
        'isActive' => false,
        'permission' => 'fee.view',
        'items' => [
            ['title' => 'Fee Management', 'url' =>  'fees.index ', 'permission' => 'fee.view'],
            ['title' => 'Payments', 'url' =>  'payments.index ', 'permission' => 'payment.view'],
            ['title' => 'Expenses', 'url' =>  'expenses.index ', 'permission' => 'expense.view'],
            ['title' => 'Reports', 'url' =>  'reports.index ', 'permission' => 'reports.view'],
        ],
    ],

    [
        'title' => 'School Events',
        'url' =>  'events.index ',
        'icon' => 'Calendar',
        'isActive' => false,
        'permission' => 'event.view',
    ],

    [
        'title' => 'Administration',
        'url' => '/dashboard/admin',
        'icon' => 'ShieldCheck',
        'isActive' => false,
        // 'permission' => 'setting.view', // Gatekeeper for the admin section
        'items' => [
            ['title' => 'Roles & Permissions', 'url' =>  'roles.index '],
            ['title' => 'System Logs', 'url' =>  'system-logs.index ', 'permission' => 'log.view'],
            ['title' => 'School Profile', 'url' =>  'school-profile.index ', 'permission' => 'setting.manage'],
        ],
    ],

    [
        'title' => 'Settings',
        'url' =>  'settings.index ',
        'icon' => 'Settings',
        'isActive' => false,
        'permission' => 'setting.view',
    ],
];