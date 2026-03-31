<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Classroom;
use App\Models\Student;
use App\Services\ViewResolver;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class AttendanceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        $props = [];
        $override = "admin";

        $props['filters']['classroomId'] = $request->input('classroom_id', Classroom::first()->id);
        $props['filters']['date'] = $request->input('date', now()->format('Y-m-d'));
        $props['selectedClassroom'] =Classroom::find($props['filters']['classroomId']);

        $props['students'] = Student::where('classroom_id', $props['filters']['classroomId'])
        ->with(['attendances' => function($query) use ($props) {
            $query->where('date', $props['filters']['date']);
        }])
        ->get();

        $props['stats']['total'] = $props['students']->count();
        $props['stats']['present'] = $props['students']->filter(fn($s) => $s->attendances->first()?->status === 'present')->count();
        $props['stats']['absent'] = $props['students']->filter(fn($s) => $s->attendances->first()?->status === 'absent')->count();
        $props['stats']['late'] = $props['students']->filter(fn($s) => $s->attendances->first()?->status === 'late')->count();

        $props['stats']['percentage'] = $props['stats']['total'] > 0 ? round(($props['stats']['present'] / $props['stats']['total']) * 100) : 0;


        if ($user->hasRole('teacher')) {
            $override = "teacher";


            // 1. Fetch classrooms assigned to this teacher
            $props['classrooms'] = Classroom::where('teacher_id', $user->id)
                ->with(['students' => function ($query) use ($props) {
                    $query->select('users.id', 'name', 'email', 'meta', 'classroom_id')
                          // 2. Eager load the specific attendance record for this date
                          ->with(['attendance' => function ($attendanceQuery) use ($props) {
                              $attendanceQuery->whereDate('date', $props['filters']['date'])
                                              ->select('id', 'student_id', 'status', 'remarks');
                          }]);
                }])
                ->get();

        }

        return inertia(ViewResolver::resolve("attendances/index", $override), $props);
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
       $validated = $request->validate([
            'date' => 'required|date',
            'classroom_id' => 'required|exists:classrooms,id',
            // 'data' should be an object: { "student_id": "status" }
            'data' => 'required|array',
        ]);

        DB::transaction(function () use ($validated) {
            foreach ($validated['data'] as $studentId => $status) {
                Attendance::updateOrCreate(
                    [
                        'student_id' => $studentId,
                        'date' => $validated['date'],
                    ],
                    [
                        'status' => $status,
                        'classroom_id' => $validated['classroom_id'],
                        // Remarks can be added here if included in the UI
                    ]
                );
            }
        });

        return back()->with('success', 'Attendance recorded successfully.');
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
