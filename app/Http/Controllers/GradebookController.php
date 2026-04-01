<?php

namespace App\Http\Controllers;

use App\Models\Assignment;
use App\Models\AssignmentSubmission;
use App\Models\Attendance;
use App\Models\Classroom;
use App\Models\ExamMark;
use App\Models\ExamSubject;
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

        // 1. Fetch Classrooms & Subjects
        $classrooms = Classroom::where('teacher_id', $teacherId)->get(['id', 'name']);
        $subjects = Subject::where('is_active', true)->get(['id', 'name']);

        $classroomId = $request->query('classroom_id', $classrooms->first()?->id);
        $subjectId = $request->query('subject_id', $subjects->first()?->id);

        $columns = [];
        $studentsData = [];

        if ($classroomId && $subjectId) {
            // --- A. FETCH COLUMN HEADERS ---
            
            // 1. Assignments
            $assignments = Assignment::where('classroom_id', $classroomId)
                ->where('subject_id', $subjectId)
                ->get();
                
            foreach ($assignments as $ass) {
                $columns[] = ['type' => 'assignment', 'id' => $ass->id, 'title' => $ass->title, 'max' => $ass->max_points, 'readonly' => false];
            }

            // 2. Exams (Assuming ExamSubject links a Subject to an Examination)
            $examSubjects = ExamSubject::where('subject_id', $subjectId)
                ->with('exam') // Eager load the examination to get the name
                ->get();
                
            foreach ($examSubjects as $es) {
                $columns[] = ['type' => 'exam', 'id' => $es->id, 'title' => $es->exam->name ?? 'Exam', 'max' => 100, 'readonly' => false];
            }

            // 3. Attendance (Always exactly 1 column, Read-Only)
            $columns[] = ['type' => 'attendance', 'id' => 'att', 'title' => 'Attendance %', 'max' => 100, 'readonly' => true];


            // --- B. FETCH STUDENT DATA ---
            $students = Student::where('classroom_id', $classroomId)->get(['id', 'name', 'meta']);
            
            // Pre-fetch all relevant grades to avoid N+1 queries
            $assignmentSubmissions = AssignmentSubmission::whereIn('assignment_id', $assignments->pluck('id'))->get();
            $examMarks = ExamMark::whereIn('exam_subject_id', $examSubjects->pluck('id'))->get();
            $attendances = Attendance::where('classroom_id', $classroomId)->get();

            foreach ($students as $student) {
                $grades = [];

                // Map Assignment Scores
                foreach ($assignments as $ass) {
                    $sub = $assignmentSubmissions->where('student_id', $student->id)->where('assignment_id', $ass->id)->first();
                    $grades["assignment-{$ass->id}"] = $sub ? $sub->score : null;
                }

                // Map Exam Scores
                foreach ($examSubjects as $es) {
                    $mark = $examMarks->where('student_id', $student->id)->where('exam_subject_id', $es->id)->first();
                    $grades["exam-{$es->id}"] = $mark ? $mark->marks_obtained : null;
                }

                // Calculate Attendance %
                $studentAtts = $attendances->where('student_id', $student->id);
                $totalDays = $studentAtts->count();
                if ($totalDays > 0) {
                    $presentDays = $studentAtts->where('status', 'present')->count();
                    // Give half credit for late if desired, but here we strictly count 'present'
                    $grades["attendance-att"] = round(($presentDays / $totalDays) * 100);
                } else {
                    $grades["attendance-att"] = 100; // Default to 100% if no attendance taken yet
                }

                $studentsData[] = [
                    'id' => $student->id,
                    'name' => $student->name,
                    'admission_number' => $student->meta['admission_number'] ?? null,
                    'grades' => $grades, 
                ];
            }
        }

        return inertia('teacher/grades/index', [
            'classrooms' => $classrooms,
            'subjects' => $subjects,
            'columns' => $columns,
            'students' => $studentsData,
            'filters' => [
                'classroom_id' => (string) $classroomId,
                'subject_id' => (string) $subjectId,
            ]
        ]);}

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
            'grades' => 'required|array', // Format: ["type-itemId-studentId" => score]
        ]);

        $grades = $request->input('grades');
        $teacherId = $request->user()->id;

        foreach ($grades as $key => $score) {
            // Key comes from frontend as: "assignment-12-5" (type-itemId-studentId)
            [$type, $itemId, $studentId] = explode('-', $key);

            if ($type === 'assignment') {
                AssignmentSubmission::updateOrCreate(
                    ['assignment_id' => $itemId, 'student_id' => $studentId],
                    ['score' => $score]
                );
            } 
            elseif ($type === 'exam') {
                ExamMark::updateOrCreate(
                    ['exam_subject_id' => $itemId, 'student_id' => $studentId],
                    ['marks_obtained' => $score, 'teacher_id' => $teacherId]
                );
            }
            // We ignore 'attendance' edits because attendance is driven by daily logs, not the gradebook
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
