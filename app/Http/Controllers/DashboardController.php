<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
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
        
        if (in_array($role, ['admin', 'super_admin'])) {
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
            'admin' => [
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
            ],

        ];

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
        $user = Teacher::find($user_id);
        $today = now()->format('l'); // Gets the current day, e.g., "Monday", "Friday"

        // ==========================================
        // 1. THE REAL DATABASE QUERIES (For later)
        // ==========================================
        
        $todayClasses = Timetable::with(['subject', 'classroom'])
            ->where('teacher_id', $user->id)
            ->where('day_of_week', $today)
            ->orderBy('start_time', 'asc')
            ->get();

        // Count how many students are in this teacher's assigned classes
        // $totalStudents = $user->classrooms()->withCount('students')->get()->sum('students_count');
        $totalStudents = $user->classrooms()->withCount('students')->get()->sum('students_count');

        // ==========================================
        // 2. COMPREHENSIVE MOCK DATA (For UI Development now)
        // ==========================================
        return [
            // Quick stats for the top cards (GlassStatCard)
            'overviewStats' => [
                'classes_today' => $todayClasses,
                'total_students' => $totalStudents,
                'pending_tasks' => 2,
            ],
            
            // Their specific timetable for the current day
            'todaySchedule' => [
                [
                    'id' => 1, 
                    'subject' => 'Mathematics', 
                    'class_group' => 'JSS 3A', 
                    'time' => '08:00 AM - 09:30 AM', 
                    'room' => 'Block A, Rm 12',
                    'status' => 'completed' // completed, ongoing, upcoming
                ],
                [
                    'id' => 2, 
                    'subject' => 'Physics', 
                    'class_group' => 'SSS 1B', 
                    'time' => '10:00 AM - 11:30 AM', 
                    'room' => 'Science Lab 1',
                    'status' => 'upcoming'
                ],
                [
                    'id' => 3, 
                    'subject' => 'Further Mathematics', 
                    'class_group' => 'SSS 3A', 
                    'time' => '12:00 PM - 01:00 PM', 
                    'room' => 'Block B, Rm 04',
                    'status' => 'upcoming'
                ],
            ],

            // Actionable tasks to keep them organized
            'actionItems' => [
                [
                    'id' => 101, 
                    'title' => 'Mark Attendance for JSS 3A', 
                    'type' => 'attendance', 
                    'is_urgent' => true,
                    'link' => '/staff/attendance?class=jss3a'
                ],
                [
                    'id' => 102, 
                    'title' => 'Grade Physics Mid-Term Assignments', 
                    'type' => 'grading', 
                    'is_urgent' => false,
                    'link' => '/staff/grades'
                ]
            ]
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
