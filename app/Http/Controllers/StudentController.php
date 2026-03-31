<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Http\Requests\StoreStudentRequest;
use App\Http\Requests\UpdateStudentRequest;
use App\Models\Classroom;
use App\Models\Role;
use App\Models\SystemLog;
use App\Models\User;
use App\Services\ViewResolver;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class StudentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $props = [
            "filters" => $request->search
        ];
        $user = $request->user();
        $route = "students/index";
        $override = "admin";
        
        $props['classrooms'] = Classroom::all();
        $props['students'] = Student::with(['classroom', 'role'])
        // Search filter
        ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                      })
                      // Sorting
                      ->latest()
                      // Pagination (15 per page)
                      ->paginate(15)
                      ->withQueryString();
                      
        if ($user->hasRole('teacher')) { // Adjust this check to match your auth/role setup
            // Log::info("teacher");
            $override = "teacher";
            // 1. Get classrooms assigned to this specific teacher
            $props['classrooms'] = Classroom::where('teacher_id', $user->id)->get();
            
            // 2. Fetch only students in those classrooms
            $props['students'] = Student::whereIn('classroom_id', $props['classrooms']->pluck('id'))
                ->with('classroom:id,name')
                ->select('id', 'name', 'email', 'meta', 'classroom_id')
                ->get();
            
        }

        error_log($override);

        return inertia(ViewResolver::resolve("students/index", "teacher"), $props);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia(ViewResolver::resolve("students/create", "admin"), [
            // Pass classrooms so the admin can assign a class immediately
            'classrooms' => \App\Models\Classroom::orderBy('grade_level')->get(['id', 'name', 'grade_level']),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreStudentRequest $request)
    {
        //

        $validated = $request->validated() ;
        $lastStudent = Student::latest('id')->first();
        $nextId = $lastStudent ? $lastStudent->id + 1 : 1;
        $admissionNumber = 'ADM-' . date('Y') . '-' . str_pad($nextId, 4, '0', STR_PAD_LEFT);

        $userData = collect($validated)->only(['name', 'email', 'classroom_id', 'password'])->toArray();
        $metaData = collect($validated)->except(['name', 'email', 'classroom_id', 'password'])->toArray();

        // Add the generated admission number to the meta payload
        $metaData['admission_number'] = $admissionNumber;

        $student = Student::create(array_merge($userData, [
            'role_id'      => Role::where('slug', 'student')->first()->id,
            'meta' => $metaData
        ]));

        // Inside store() method, after creating the student:
        SystemLog::logActivity(
            'student_admitted', 
            "Admitted new student: {$student->first_name} {$student->last_name}",
            'info',
            ['student_id' => $student->id, 'admission_number' => $student->admission_number]
        );




        return redirect()->back()->with('success', 'Student admitted successfully. Admission No: ' . $admissionNumber);
    }

    /**
     * Display the specified resource.
     */
    public function show(Student $student)
    {
        $student->load(['classroom', 'fees.feeType', // Loads the bills and the details of what the bill is for
            'payments', 'attendances' => function($query) {
            $query->whereMonth('date', now()->month)
                ->whereYear('date', now()->year)
                ->latest();
        }]);

        // Load exam marks with their relationships
        $examMarks = $student->examMarks()
            ->with(['examSubject.subject', 'examSubject.exam', 'teacher:id,name'])
            ->latest()
            ->get();

        // Calculate academic statistics
        $academicData = [
            'examMarks' => $examMarks,
            'totalMarksObtained' => $examMarks->sum('marks_obtained'),
            'examsTaken' => $examMarks->count(),
            'classroom' => $student?->classroom ?? [],
            'class_rank' => $student->rank ?? 0,
            'averageScore' => $examMarks->count() > 0
                ? round($examMarks->average('marks_obtained'), 2)
                : 0,
        ];

        return inertia(ViewResolver::resolve("students/show", "admin"), [
            'student' => $student,
            'classrooms' => Classroom::all(),
            'attendanceStats' => [
                'present' => $student->attendances->where('status', 'present')->count(),
                'absent' => $student->attendances->where('status', 'absent')->count(),
                'late' => $student->attendances->where('status', 'late')->count(),
                'excused' => $student->attendances->where('status', 'excused')->count(),
                'percentage' => $student->attendance_percentage,
                // ...
            ],
            'academicData' => $academicData
        ])  ;
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Student $student)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Student $student)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $student->id,
            'classroom_id' => 'nullable|exists:classrooms,id', // Validate the class exists
            // Meta fields
            // 'phone' => 'nullable|string',
            'dob' => 'nullable|date',
            'parent_name' => 'nullable|string',
        ]);

        // Update core student/user data including the foreign key
        $student->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'classroom_id' => $validated['classroom_id'],

        ]);

        return back()->with('success', "{$student->name}'s profile and class assignment updated.");
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Student $student)
    {
        //
        // Inside destroy() method:
        SystemLog::logActivity(
            'student_deleted', 
            "Deleted student record for ID: {$student->id}",
            'warning',
            ['student_name' => "{$student->first_name} {$student->last_name}"]
        );
        $student->delete();
        return back()->with('success', 'Student record deleted successfully.');
    }
}
