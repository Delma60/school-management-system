import { Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    CalendarDays,
    ClipboardCheck,
    FileEdit,
    LayoutDashboard,
    Megaphone,
    Settings,
    ShieldCheck,
    UserCheck,
    Briefcase,
    Users,
    Wallet
} from 'lucide-react';

// ... your existing adminNavItems array ...

const url = window.location.pathname


// THE NEW TEACHER/STAFF NAVIGATION
export const staffNavItems = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: LayoutDashboard,
    isActive: url === "/dashboard",
  },
  {
    title: 'My Classes',
    url: '/dashboard/teacher/classes',
    icon: BookOpen,
    isActive: url.startsWith('/dashboard/teacher/classes'),
    items: [
      { title: 'Class Rosters', url: '/dashboard/teacher/classes/rosters' },
      { title: 'My Timetable', url: '/dashboard/teacher/timetable' },
      { title: 'Lesson Plans', url: '/dashboard/teacher/lesson-plans' },
      { title: 'Assignments', url: '/dashboard/teacher/assignments' },
    ],
  },
  {
    title: 'Student Management',
    url: '/dashboard/teacher/students',
    icon: Users,
    isActive: url.startsWith('/dashboard/teacher/students'),
    items: [
      { title: 'My Students', url: '/dashboard/teacher/students/directory' },
      { title: 'Mark Attendance', url: '/dashboard/teacher/attendance' },
      { title: 'Examinations & Grading', url: '/dashboard/teacher/grades' },
      { title: 'Behavioral Logs', url: '/dashboard/teacher/students/behavior' },
    ],
  },
  {
    title: 'Communication',
    url: '/dashboard/notices',
    icon: Megaphone,
    isActive: url.startsWith('/dashboard/notices') || url.startsWith('/dashboard/messages'),
    items: [
      { title: 'Noticeboard', url: '/dashboard/notices' },
      { title: 'Messages', url: '/dashboard/teacher/messages' },
    ],
  },
  {
    title: 'My HR Portal', 
    url: '/dashboard/teacher/hr',
    icon: Briefcase,
    isActive: url.startsWith('/dashboard/teacher/hr'),
    items: [
      { title: 'Leave Requests', url: '/dashboard/teacher/leave' },
      { title: 'My Payslips', url: '/dashboard/teacher/payslips' },
      { title: 'Profile Settings', url: route('profile.edit') },
    ],
  },
];



export const adminNavItems = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: LayoutDashboard,
    isActive: url === "/dashboard",
  },
  {
    title: 'Academics',
    url: '/dashboard/academics',
    icon: BookOpen,
    isActive: url.startsWith('/dashboard/academics'),
    items: [
      { title: 'Classrooms', url: '/dashboard/academics/classrooms' },
      { title: 'Subjects & Curricula', url: '/dashboard/academics/subjects' },
      { title: 'Timetables', url: '/dashboard/academics/timetables' },
      { title: 'Examinations', url: '/dashboard/academics/exams' },
    ],
  },
  {
    title: 'Students',
    url: '/dashboard/students',
    icon: Users,
    isActive: url.startsWith('/dashboard/students'),
    items: [
      { title: 'Student Directory', url: '/dashboard/students' },
      { title: 'Admissions', url: route("admissions.create") },
      { title: 'Attendance', url: '/dashboard/students/attendances' },
      { title: 'Performance Logs', url: '/dashboard/students/performance' },
    ],
  },
  {
    title: 'Staff Management', // CRUD for Teachers and Non-academic staff
    url: route("staffs.others"),
    icon: UserCheck,
    isActive: url.startsWith('/dashboard/staff'),
    items: [
      { title: 'Teacher Directory', url: route("teachers.index") },
      { title: 'Non-Academic Staff', url: route("staffs.others") },
      { title: 'Payroll & Leave', url: route("payroll.index") },
    ],
  },
  {
    title: 'Finance',
    url: '/dashboard/finance',
    icon: Wallet,
    isActive: url.startsWith('/dashboard/finance'),
    items: [
      { title: 'Fee Management', url: '/dashboard/finance/fees' },
      { title: 'Expenses', url: '/dashboard/finance/expenses' },
      { title: 'Reports', url: '/dashboard/finance/reports' },
    ],
  },
  {
    title: 'Administration', // This covers Roles and Permissions
    url: '/dashboard/admin',
    icon: ShieldCheck,
    isActive: url.startsWith('/dashboard/admin'),
    items: [
      { title: 'Roles & Permissions', url: '/dashboard/roles' },
      { title: 'System Logs', url:  route("system-logs.index") },
      { title: 'School Profile', url: route("school-profile.index") },
    ],
  },
  {
    title: 'Settings',
    url: '/dashboard/settings',
    icon: Settings,
    isActive: url.startsWith('/dashboard/settings'),
  },
];
