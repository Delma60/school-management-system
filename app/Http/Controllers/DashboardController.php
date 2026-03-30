<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\LeaveRequest;
use App\Models\Payment;
use App\Models\SchoolEvent;
use App\Models\Staff;
use App\Models\Student;
use App\Models\SystemLog;
use App\Models\Teacher;
use App\Models\Timetable;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class DashboardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
   public function index(Request $request)
   {
    $user = $request->user();
        $role = $user->role->name;

        // 1. Fetch Shared Data (e.g., Upcoming events visible to everyone)


        // 2. Base props array (Set default values to null so Inertia doesn't complain)
        $props = [];

        if (in_array($role, ['admin', 'super_admin', 'owner'])) {
            $props['admin'] = $this->getAdminStats();
        } elseif (in_array($role, ['teacher', 'staff'])) {
            $props['teacher'] = $this->getTeacherStats($user?->id);
        } elseif ($role === 'student') {
            $props['student'] = $this->getStudentStats($user);
        }

        Log::info($props);
        return inertia('dashboard', $props);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    private function getAdminStats()
    {

            // 1. Calculate Real Stats
        $totalStudents = Student::count();
        $totalRevenue = Payment::whereMonth('payment_date', now()->month)->sum('amount');

        $overviewStats = [
            // 'admin' => [
                'enrollment' => [
                    'value' => number_format($totalStudents),
                    'trend' => ['value' => '+12', 'isPositive' => true] // Calculate real trend if needed
                ],
                'attendance' => [
                    'value' => '94.2%',
                    'trend' => ['value' => '-0.8%', 'isPositive' => false],
                    'desc' => '82 students absent'
                ],
                'revenue' => [
                    'value' => '₦' . number_format($totalRevenue),
                    'trend' => ['value' => '75%', 'isPositive' => true]
                ],
                'inquiries' => [
                    'value' => '42',
                    'trend' => ['value' => '+5', 'isPositive' => true]
                ]
            ];

        // ];

        // 2. Fetch Recent System Logs for Activity Board
        $activities = SystemLog::with('user')->latest()->take(5)->get()->map(function ($log) {
            $initials = $log->user ? substr($log->user->first_name, 0, 1) . substr($log->user->last_name, 0, 1) : 'SYS';
            return [
                'id' => $log->id,
                'user' => ['name' => $log->user->first_name ?? 'System', 'initials' => strtoupper($initials)],
                'type' => $log->level === 'error' ? 'security' : 'payment',
                'description' => $log->message,
                'timestamp' => $log->created_at->diffForHumans(),
            ];
        });

        // 3. Fetch Real Events
        $events = SchoolEvent::where('date', '>=', now())->orderBy('date', 'asc')->take(4)->get();

        // 5. Build Daily Attendance Chart Data (Last 7 Days)
        $attendanceChartData = collect(range(6, 0))->map(function ($daysAgo) {
            $date = Carbon::today()->subDays($daysAgo);

            // Count students who were marked present or late
            $studentsPresent = Attendance::whereDate('date', $date)
                ->whereIn('status', ['present', 'late'])
                ->whereNotNull('student_id')
                ->count();

            // Count staff/teachers (they have a user_id)
            $staffPresent = Attendance::whereDate('date', $date)
                ->whereIn('status', ['present', 'late'])
                ->whereNotNull('user_id')
                ->count();
            return [
                'name' => $date->format('D'), // e.g., Mon, Tue, Wed
                'students' => $studentsPresent,
                'staff' => $staffPresent,
            ];
        })->toArray();


        // 4. Mock Data for missing tables (Update these when you build the tables)
        $notices = [
            [
                'id' => 1,
                'title' => 'System Live',
                'content' => 'The school management dashboard is now connected to the database.',
                'date' => now()->format('M d, Y'),
                'type' => 'info',
                'isPinned' => true,
            ]
        ];


        return  [
            'overviewStats' => $overviewStats,
            'activities' => $activities,
            'events' => $events,
            'notices' => $notices,
            'attendanceChartData' => $attendanceChartData, // Pass your chart data here later
            'staffStatusData' => [],     // Pass your staff status here later
        ];
    }

    private function getTeacherStats(string $user_id)
    {
        // Eager load classrooms to see if this teacher is a "Form Teacher" / "Homeroom Teacher"
        $user = Teacher::with('classrooms', 'subjects', 'timetable.classroom')->find($user_id)->toResource();

        if (!$user) {
            return [];
        }

        $today = now()->format('l');
        $currentDate = now()->toDateString();
        $currentTime = now()->format('H:i:s');

        $events = SchoolEvent::where('date', '>=', now())->orderBy('date', 'asc')->take(4)->get();

        // ==========================================
        // 1. Fetch Today's Classes
        // ==========================================
        $todayClasses = Timetable::with(['subject', 'classroom'])
            ->where('teacher_id', $user->id)
            ->where('day_of_week', $today)
            ->orderBy('start_time', 'asc')
            ->get();

        $totalStudents = $user->classrooms()->withCount('students')->get()->sum('students_count');

        // ==========================================
        // 2. Map Timetable Schedule
        // ==========================================
        $todaySchedule = $todayClasses->map(function ($slot) use ($currentTime) {
            $status = 'upcoming';
            if ($currentTime >= $slot->start_time && $currentTime <= $slot->end_time) {
                $status = 'ongoing';
            } elseif ($currentTime > $slot->end_time) {
                $status = 'completed';
            }

            return [
                'id' => $slot->id,
                'subject' => $slot->subject ? $slot->subject->name : 'N/A',
                'class_group' => $slot->classroom ? $slot->classroom->name : 'N/A',
                'time' => Carbon::parse($slot->start_time)->format('h:i A') . ' - ' . Carbon::parse($slot->end_time)->format('h:i A'),
                'room' => $slot->classroom ? $slot->classroom->room_number : 'TBA',
                'status' => $status
            ];
        });

        // ==========================================
        // 3. Generate Action Items
        // ==========================================
        $actionItems = [];
        foreach ($todayClasses as $slot) {
            if ($currentTime >= $slot->start_time) {
                $actionItems[] = [
                    'id' => 'att_' . $slot->id,
                    'title' => 'Mark Attendance for ' . ($slot->classroom->name ?? 'Class'),
                    'type' => 'attendance',
                    'is_urgent' => true,
                    'link' => '/admin/attendances?classroom_id=' . $slot->classroom_id
                ];
            }
        }
        $actionItems = array_slice($actionItems, 0, 3);

        // ==========================================
        // 4. Form/Homeroom Class Attendance Overview
        // ==========================================
        // If the teacher owns a classroom, show them how many students showed up today
        $formClassAttendance = $user->classrooms->map(function ($classroom) use ($currentDate) {
            $totalClassStudents = $classroom->students()->count();

            $presentStudents = Attendance::where('classroom_id', $classroom->id)
                ->whereDate('date', $currentDate)
                ->whereIn('status', ['present', 'late'])
                ->count();

            $percentage = $totalClassStudents > 0 ? round(($presentStudents / $totalClassStudents) * 100) : 0;

            return [
                'id' => $classroom->id,
                'name' => $classroom->name,
                'total_students' => $totalClassStudents,
                'present_today' => $presentStudents,
                'attendance_percentage' => $percentage,
            ];
        });

        // ==========================================
        // 5. Personal Leave Requests Status
        // ==========================================
        // Shows the teacher the status of their recent time-off/leave applications
        $recentLeaves = LeaveRequest::where('user_id', $user->id)
            ->latest()
            ->take(3)
            ->get()
            ->map(function ($leave) {
                return [
                    'id' => $leave->id,
                    'type' => $leave->leave_type ?? 'General Leave',
                    'date_range' => Carbon::parse($leave->start_date)->format('M d') . ' - ' . Carbon::parse($leave->end_date)->format('M d'),
                    'status' => $leave->status, // e.g., 'pending', 'approved', 'rejected'
                    'days' => Carbon::parse($leave->start_date)->diffInDays(Carbon::parse($leave->end_date)) + 1
                ];
            });

        // ==========================================
        // 6. School Notices / Announcements
        // ==========================================
        // You can fetch this from a Notice/Announcement model if you have one.
        // Using static data as a placeholder for the frontend UI design.
        $notices = [
            [
                'id' => 1,
                'title' => 'Grade Submission Deadline',
                'content' => 'Please ensure all continuous assessment scores are uploaded to the portal by Friday 5PM.',
                'date' => now()->format('M d, Y'),
                'type' => 'warning',
                'isPinned' => true,
            ],
            [
                'id' => 2,
                'title' => 'Staff Meeting',
                'content' => 'Brief staff meeting on Wednesday regarding the upcoming inter-house sports.',
                'date' => now()->addDays(2)->format('M d, Y'),
                'type' => 'info',
                'isPinned' => false,
            ]
        ];

        // ==========================================
        // Return Comprehensive Teacher Profile
        // ==========================================
        return [
            'overviewStats' => [
                'classes_today' => $todayClasses->count(),
                'total_students' => (int) $totalStudents,
                'pending_tasks' => count($actionItems),
                'unread_notices' => count($notices),
            ],
            'teacher' => $user,
            'events' => $events,
            'todaySchedule' => $todaySchedule,
            'actionItems' => $actionItems,
            'formClassAttendance' => $formClassAttendance, // New Widget Data
            'recentLeaves' => $recentLeaves,               // New Widget Data
            'notices' => $notices                          // New Widget Data
        ];
    }

    private function getStudentStats($user)
    {
        // TODO: Fetch this student's actual attendance records
        return [
            'present_days' => Attendance::where('student_id', $user->id)->where('status', 'present')->count(),
            'total_days' => Attendance::where('student_id', $user->id)->count(),
        ];
    }
}
