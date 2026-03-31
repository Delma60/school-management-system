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
        $authType = Auth::user()->role->name ?? "admin";

        $classroomId = $request->input('classroom_id', Classroom::first()->id);
        $date = $request->input('date', now()->format('Y-m-d'));

        $students = Student::where('classroom_id', $classroomId)
        ->with(['attendances' => function($query) use ($date) {
            $query->where('date', $date);
        }])
        ->get();

        $total = $students->count();
        $present = $students->filter(fn($s) => $s->attendances->first()?->status === 'present')->count();
        $absent = $students->filter(fn($s) => $s->attendances->first()?->status === 'absent')->count();
        $late = $students->filter(fn($s) => $s->attendances->first()?->status === 'late')->count();
        
        $percentage = $total > 0 ? round(($present / $total) * 100) : 0;

        return inertia(ViewResolver::resolve("attendances/index", "admin"), [
            'classrooms' => Classroom::all(),
            'selectedClassroom' => Classroom::find($classroomId),
            'students' => $students,
            'stats' => [
                'total' => $total,
                'present' => $present,
                'absent' => $absent,
                'late' => $late,
                'percentage' => $percentage,
            ],
            'filters' => [
                'classroom_id' => $classroomId,
                'date' => $date,
            ]
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
