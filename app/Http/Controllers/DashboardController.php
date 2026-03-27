<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Payment;
use App\Models\SchoolEvent;
use App\Models\Staff;
use App\Models\Student;
use App\Models\SystemLog;
use App\Models\Teacher;
use Carbon\Carbon;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
   public function index()
   {
    // 1. Calculate Real Stats
        $totalStudents = Student::count();
        $totalRevenue = Payment::whereMonth('payment_date', now()->month)->sum('amount');
        
        $overviewStats = [
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

        return inertia('dashboard', [
            'overviewStats' => $overviewStats,
            'activities' => $activities,
            'events' => $events,
            'notices' => $notices,
            'attendanceChartData' => $attendanceChartData, // Pass your chart data here later
            'staffStatusData' => [],     // Pass your staff status here later
        ]);
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
}
