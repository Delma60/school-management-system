<?php

namespace App\Http\Controllers;

use App\Models\Assignment;
use App\Models\AssignmentSubmission;
use App\Models\Classroom;
use App\Models\Student;
use App\Models\Subject;
use Illuminate\Http\Request;

class GradebookController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $teacherId = $request->user()->id;

        // 1. Fetch Classrooms assigned to this teacher
        $classrooms = Classroom::where('teacher_id', $teacherId)->get(['id', 'name']);
        
        // 2. Fetch Subjects (assuming subjects are global or linked to the teacher)
        $subjects = Subject::where('is_active', true)->get(['id', 'name']);

        // Set default filters from URL or fallback to the first available class/subject
        $classroomId = $request->query('classroom_id', $classrooms->first()?->id);
        $subjectId = $request->query('subject_id', $subjects->first()?->id);

        $assignments = [];
        $studentsData = [];

        // 3. If we have a class and subject selected, build the matrix
        if ($classroomId && $subjectId) {
            
            // Get all assignments for this class and subject
            $assignments = Assignment::where('classroom_id', $classroomId)
                ->where('subject_id', $subjectId)
                ->where('teacher_id', $teacherId)
                ->orderBy('due_date', 'asc')
                ->get(['id', 'title', 'max_points', 'due_date']);

            // Get students in this classroom
            $students = Student::where('classroom_id', $classroomId)
                ->get(['id', 'name', 'meta']);

            // Get all submissions for these specific assignments
            $assignmentIds = $assignments->pluck('id');
            $submissions = AssignmentSubmission::whereIn('assignment_id', $assignmentIds)->get();

            // Format the student data into a clean structure for the React grid
            foreach ($students as $student) {
                // Find all submissions belonging to this student
                $studentSubmissions = $submissions->where('student_id', $student->id);
                
                $submissionMap = [];
                foreach ($studentSubmissions as $sub) {
                    $submissionMap[$sub->assignment_id] = [
                        'id' => $sub->id,
                        'score' => $sub->score,
                    ];
                }

                $studentsData[] = [
                    'id' => $student->id,
                    'name' => $student->name,
                    'admission_number' => $student->meta['admission_number'] ?? null,
                    'submissions' => $submissionMap, // Keyed by assignment_id
                ];
            }
        }

        return inertia('teacher/grades/index', [
            'classrooms' => $classrooms,
            'subjects' => $subjects,
            'assignments' => $assignments,
            'students' => $studentsData,
            'filters' => [
                'classroom_id' => (string) $classroomId,
                'subject_id' => (string) $subjectId,
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
        $request->validate([
            'grades' => 'required|array', // Format: ["studentId-assignmentId" => score]
            'classroom_id' => 'required|exists:classrooms,id',
        ]);

        $grades = $request->input('grades');

        foreach ($grades as $key => $score) {
            // Split the key "student_id-assignment_id"
            [$studentId, $assignmentId] = explode('-', $key);

            // Verify the assignment belongs to this teacher to prevent tampering
            $assignment = Assignment::where('id', $assignmentId)
                ->where('teacher_id', $request->user()->id)
                ->first();

            if ($assignment) {
                // Update or create the submission record
                AssignmentSubmission::updateOrCreate(
                    [
                        'assignment_id' => $assignment->id,
                        'student_id' => $studentId,
                    ],
                    [
                        'score' => $score,
                        // 'feedback' => null // Optional: clear or keep feedback
                    ]
                );
            }
        }

        return redirect()->back()->with('success', 'Grades updated successfully.');
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
