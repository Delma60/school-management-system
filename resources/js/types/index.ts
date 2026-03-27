import { LucideIcon } from 'lucide-react';

// ==================== Role Interface ====================
export interface Role {
    id: number;
    name: string;
    slug: string;
    created_at?: string;
    updated_at?: string;
}

// ==================== Classroom Interface ====================
export interface Classroom {
    id: number;
    name: string;
    grade_level: string;
    room_number?: string | null;
    capacity: number;
    teacher_id?: number | null;
    status?: string | null;
    created_at?: string;
    updated_at?: string;
    teacher?: Teacher;
    students?: Student[];
    timetable?:TimetableEntry[]
}

// ==================== Finance & Fees Interfaces ====================

export interface FeeType {
    id: number;
    name: string;
    amount: number | string; // Usually returned as string from decimal columns in Laravel
    academic_session: string;
    term: string;
    status: 'active' | 'inactive';
    meta?: Record<string, any> | null;
    created_at?: string;
    updated_at?: string;

    // Relationships
    student_fees?: StudentFee[];
    classroom_fees?: ClassFee[]; // Snake case of the 'classroomFees' relationship
    assigned_students?: number; // Used in index stats via withCount
}

export interface ClassFee {
    id: number;
    classroom_id: number;
    fee_type_id: number;
    amount_due: number | string;
    amount_paid: number | string;
    status?: string | null;
    meta?: Record<string, any> | null;
    created_at?: string;
    updated_at?: string;

    // Relationships
    classroom?: Classroom;
    fee_type?: FeeType;
}

export interface StudentFee {
    id: number;
    user_id: number;
    fee_type_id: number;
    amount_due: number | string;
    amount_paid: number | string;
    status?: string | null;
    meta?: Record<string, any> | null;
    created_at?: string;
    updated_at?: string;

    // Relationships
    student?: Student;
    fee_type?: FeeType;
}

export interface Payment {
    id: number;
    transaction_reference?: string;
    student_id: number;
    fee_type_id?: number | null;
    amount: number | string;
    payment_date: string;
    payment_method?: string;
    status?: string;
    meta?: Record<string, any> | null;
    created_at?: string;
    updated_at?: string;

    // Relationships
    student?: Student;
}

// ==================== Subject Interface ====================
export interface Subject {
    id: number;
    name: string;
    slug: string;
    code: string;
    department: string;
    description?: string | null;
    credits: number;
    type: 'core' | 'elective' | 'vocational';
    has_syllabus: boolean;
    syllabus_path?: string | null;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string | null;
    teachers?: Teacher[];
}

// ==================== Exam/Examination Interface ====================
export interface Exam {
    id: number;
    name: string;
    term: string;
    session: string;
    start_date: string;
    end_date: string;
    status: 'draft' | 'ongoing' | 'completed';
    results_published: boolean;
    meta?: Record<string, unknown> | null;
    created_at?: string;
    updated_at?: string;
    subjects?: ExamSubject[];
    classrooms?: Classroom[];
}

// ==================== ExamSubject Interface ====================
export interface ExamSubject {
    id: number;
    examination_id: number;
    subject_id: number;
    exam_date: string;
    start_time: string;
    max_marks: number;
    pass_marks: number;
    meta?: Record<string, unknown> | null;
    created_at?: string;
    updated_at?: string;
    exam?: Exam;
    subject?: Subject;
    marks?: ExamMark[];
}

// ==================== User Interface ====================
export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string | null;
    password?: string;
    remember_token?: string | null;
    meta?: Record<string, unknown> | null;
    role_id?: number | null;
    classroom_id?: number | null;
    created_at?: string;
    updated_at?: string;
    avatar?: string;
    role?: Role;
    classroom?: Classroom;
    permissions?: string[];
    // [key: string]: unknown;
}

// ==================== Student Interface ====================
export interface Student extends User {
    role_id: number;
    classroom_id?: number | null;
    rank?: number | null;
    attendance_percentage?: number;
    classroom?: Classroom;
    attendances?: Attendance[];
    exam_marks?: ExamMark[];
}

// index.ts

// ==================== ExamMark Interface ====================
export interface ExamMark {
    id: number;
    exam_subject_id: number;
    student_id: number;
    teacher_id: number;
    marks_obtained: number;
    teacher_remark?: string | null;
    meta?: Record<string, any> | null; // For CA vs Exam score breakdowns
    created_at?: string;
    updated_at?: string;
    student?: Student;
    teacher?:Teacher
    exam_subject?: ExamSubject;
    grade?: GradingScale;
}


// ==================== Teacher Interface ====================
export interface Teacher extends User {
    role_id: number; // Must be teacher role
    subjects?: Subject[];
}

// ==================== Attendance Interface ====================
export interface Attendance {
    id: number;
    student_id: number;
    date: string; // Date in YYYY-MM-DD format
    status: 'present' | 'absent' | 'late' | 'excused';
    remarks?: string | null;
    created_at?: string;
    updated_at?: string;
    student?: Student;
}

// ==================== Break Interface ====================
export interface Break {
    id: number;
    name: string;
    type: 'break' | 'fellowship' | 'sport' | 'assembly' | 'event';
    description?: string | null;
    color?: string | null;
    created_at?: string;
    updated_at?: string;
}

// ==================== SchoolEvent Interface ====================
export interface SchoolEvent {
    id: number;
    title: string;
    date: string;
    time?: string | null;
    location?: string | null;
    type?: string | null;
    created_at?: string;
    updated_at?: string;
}

// ==================== GradingScale Interface ====================
export interface GradingScale {
    id: number;
    grade: string;
    min_score: number;
    max_score: number;
    remark?: string | null;
    created_at?: string;
    updated_at?: string;
}

// ==================== TimetableEntry Interfaces ====================
export interface TimetableEntry {
    id: number;
    subject_id?: number | null;
    teacher_id?: number | null;
    classroom_id: number;
    timebreak_id?: number | null;
    day_of_week: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
    start_time: string; // "08:00"
    end_time: string;   // "09:00"
    entry_type?: string; // 'class' or 'break' - defaults to 'class'
    meta?: Record<string, unknown> | null;
    subject?: Subject;
    teacher?: Teacher;
    timetable?: TimetableEntry[]
    classroom?: Classroom;
    timebreak?: Break;
    created_at?: string;
    updated_at?: string;
}

// ==================== Existing Interfaces ====================
export interface Auth {
    user: User;
    permissions?: string[];
}


export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    url: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    [key: string]: unknown;
}
