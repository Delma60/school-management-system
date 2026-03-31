<?php

namespace App\Http\Controllers;

use App\Models\Assignment;
use App\Http\Requests\StoreAssignmentRequest;
use App\Http\Requests\UpdateAssignmentRequest;
use App\Models\AssignmentSubmission;
use App\Models\Classroom;
use App\Models\Subject;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class AssignmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $assignments = Assignment::with(['subject', 'classroom.students'])
            ->where('teacher_id', Auth::id())
            ->orderBy('due_date', 'asc')
            ->get()
            ->map(function ($assignment) {
                // Add the count of students in the classroom
                $assignment['classroom_students_count'] = $assignment->classroom?->students?->count() ?? 0;
                return $assignment;
            });

        return inertia('teacher/assignments/index', [
            'assignments' => $assignments
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
        return inertia('teacher/assignments/create', [
        'classrooms' => Classroom::select('id', 'name')->get(),
        'subjects' => Subject::select('id', 'name')->get(),
    ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreAssignmentRequest $request)
    {
        //
        $validated = $request->validated();

        // 2. Automatically assign the logged-in user as the teacher
        $validated['teacher_id'] = $request->user()->id;

        // 3. Create the assignment in the database
        Assignment::create($validated);

        // 4. Redirect back to the dashboard with a success flash message
        return redirect()->route('assignments.index')
                         ->with('success', 'Assignment published successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Assignment $assignment)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Assignment $assignment)
    {
        //
        return inertia('teacher/assignments/edit', [
            'assignment' => $assignment,
            'classrooms' => Classroom::select('id', 'name')->get(),
            'subjects'   => Subject::select('id', 'name')->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAssignmentRequest $request, Assignment $assignment)
    {
        //
        $validated = $request->validated();

        // 3. Update the database
        $assignment->update($validated);

        // 4. Redirect back to dashboard
        return redirect()->route('assignments.index')
                         ->with('success', 'Assignment updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Assignment $assignment)
    {
        //
    }

    /**
     * Show the grading dashboard for a specific assignment.
     */
    public function grade(Assignment $assignment)
    {
       

        // 2. Fetch all students in the assigned classroom
        $students = Student::where('classroom_id', $assignment->classroom_id)
            ->select('id', 'name', 'email')
            ->get();

        // 3. Fetch submissions for this assignment and map them to the students
        $submissions = AssignmentSubmission::where('assignment_id', $assignment->id)->get();

        // Attach the submission object to the respective student for the React frontend
        $students->map(function ($student) use ($submissions) {
            $student->submission = $submissions->firstWhere('student_id', $student->id);
            return $student;
        });

        return inertia('teacher/assignments/grade', [
            'assignment' => $assignment,
            'students'   => $students,
        ]);
    }

    /**
     * Store or update a grade for a student's submission.
     */
    public function storeGrade(Request $request, Assignment $assignment)
    {
        $request->validate([
            'student_id' => 'required|exists:users,id',
            'score'      => 'required|integer|min:0',
            'feedback'   => 'nullable|string',
        ]);


        // Create a submission record if the student hasn't submitted anything yet, 
        // OR update the existing submission with the grade.
        AssignmentSubmission::updateOrCreate(
            [
                'assignment_id' => $assignment->id,
                'student_id'    => $request->student_id,
            ],
            [
                'score'    => $request->score,
                'feedback' => $request->feedback,
            ]
        );

        return redirect()->back()->with('success', 'Grade saved successfully.');
    }

    
}
