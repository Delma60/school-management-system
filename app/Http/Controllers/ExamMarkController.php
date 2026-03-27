<?php

namespace App\Http\Controllers;

use App\Models\ExamMark;
use App\Models\ExamSubject;
use App\Models\Student;
use App\Models\Examination;
use App\Models\Classroom;
use App\Models\GradingScale;
use App\Models\SystemLog;
use App\Services\ViewResolver;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class ExamMarkController extends Controller
{
    /**
     * Display exam mark selection and entry interface
     */
    public function index(Request $request)
    {
        // $authType = Auth::user()->role->name ?? "admin";

        // If exam_subject_id is provided, load the marks entry view
        if ($request->has('exam_subject_id')) {
            return $this->loadMarksEntry($request);
        }

        // Otherwise, show the exam/subject selector
        $exams = Examination::with('subjects')->get();
        $classrooms = Classroom::all();
        $gradingScales = GradingScale::orderBy('min_score')->get();
        $selectedExamId = $request->input('exam_id');

        return inertia(ViewResolver::resolve("exam_mark/index", "admin"), [
            'exams' => $exams,
            'classrooms' => $classrooms,
            'selectedExamId' => $selectedExamId,
            'selectedExamSubject' => null,
            'students' => [],
            'gradingScales' => $gradingScales,
        ]);
    }

    /**
     * Load the marks entry view for a specific exam subject
     */
    private function loadMarksEntry(Request $request)
    {
        // $authType = Auth::user()->role->name ?? "admin";
        $examSubjectId = $request->input('exam_subject_id');
        $classroomId = $request->input('classroom_id');

        // Fetch the specific exam-subject setup (to get max_marks)
        $examSubject = ExamSubject::with(['exam', 'subject'])->find($examSubjectId);

        // Fetch students in the classroom with their marks for THIS specific exam subject
        $students = Student::where('meta->classroom_id', $classroomId)
            ->with(['examMarks' => function($query) use ($examSubjectId) {
                $query->where('exam_subject_id', $examSubjectId);
            }])
            ->get();

        $gradingScales = GradingScale::orderBy('min_score')->get();

        return inertia(ViewResolver::resolve("exam_mark/index", "admin"),[
            'exams' => Examination::with('subjects')->get(),
            'classrooms' => Classroom::all(),
            'selectedExamSubject' => $examSubject,
            'students' => $students,
            'classroomId' => $classroomId,
            'gradingScales' => $gradingScales,
        ]);
    }

    /**
     * Fetch subjects for a specific exam
     */
    public function getSubjectsByExam(Request $request)
    {
        $examId = $request->input('exam_id');
        $subjects = ExamSubject::where('examination_id', $examId)
            ->with('subject')
            ->get();

        return response()->json(['subjects' => $subjects]);
    }

    /**
     * Fetch classrooms offering a specific exam subject
     */
    public function getClassroomsBySubject(Request $request)
    {
        $examSubjectId = $request->input('exam_subject_id');

        // Get the exam subject to validate it exists
        $examSubject = ExamSubject::findOrFail($examSubjectId);

        // Get all students who have this exam subject and get their unique classrooms
        $classroomIds = Student::query()
            ->distinct()
            ->whereNotNull('classroom_id')
            ->pluck('classroom_id')
            ->unique()
            ->values();

        // Fetch classroom details
        $classrooms = Classroom::whereIn('id', $classroomIds)->get();

        return response()->json(['classrooms' => $classrooms]);
    }

    /**
     * Fetch students for a specific classroom and exam subject
     */
    public function getStudentsBySubject(Request $request)
    {
        $examSubjectId = $request->input('exam_subject_id');
        $classroomId = $request->input('classroom_id');

        $examSubject = ExamSubject::with(['exam', 'subject'])->find($examSubjectId);

        $students = Student::where('classroom_id', $classroomId)
            ->with(['examMarks' => function($query) use ($examSubjectId) {
                $query->where('exam_subject_id', $examSubjectId);
            }])
            ->get();

        return response()->json([
            'examSubject' => $examSubject,
            'students' => $students
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
        $examSubjectId = $request->input('exam_subject_id');
        $marks = $request->input('marks', []);
        $classroomId = $request->input('classroom_id');
        $teacherId = Auth::id(); // Get the authenticated teacher's ID

        // Save all exam marks
        foreach ($marks as $mark) {
            ExamMark::updateOrCreate(
                [
                    'student_id' => $mark['student_id'],
                    'exam_subject_id' => $examSubjectId,
                ],
                [
                    'teacher_id' => $teacherId,
                    'marks_obtained' => $mark['marks_obtained'] ?? 0,
                    'teacher_remark' => $mark['teacher_remark'] ?? '',
                    'meta' => [
                        'ca_score' => $mark['ca_score'] ?? 0,
                        'exam_score' => $mark['exam_score'] ?? 0,
                    ],
                ]
            );
            Student::where('id', $mark['student_id'])->update(['rank' => $mark['rank'] ?? null]);
        }

        // Inside the method where you save/update student grades:
        SystemLog::logActivity(
            'grades_updated', 
            "Updated exam scores for Subject ID: {$request->subject_id} in Class ID: {$request->classroom_id}",
            'info',
            ['exam_id' => $request->examination_id]
        );
        return back()->with('message', 'Marks saved successfully!');
    }

    /**
     * Calculate and update class ranks for students in a classroom
     */
    private function updateClassRanks($classroomId, $examSubjectId)
    {
        // Get all students in the classroom with their exam marks for this subject
        $students = Student::where('classroom_id', $classroomId)
            ->with(['examMarks' => function($query) use ($examSubjectId) {
                $query->where('exam_subject_id', $examSubjectId);
            }])
            ->get();

        if ($students->isEmpty()) {
            return;
        }

        // Create an array of students with their marks, sorted by marks descending
        // Use null-safe operator to safely access marks (if mark doesn't exist, use 0)
        $studentMarks = $students->map(function($student) {
            $mark = $student->examMarks->first();
            return [
                'student_id' => $student->id,
                'marks_obtained' => $mark?->marks_obtained ?? 0,
            ];
        })->sortByDesc('marks_obtained')->values()->all();

        // Assign ranks (handling ties)
        $ranks = [];
        $currentRank = 1;
        $previousMarks = null;

        foreach ($studentMarks as $index => $studentMark) {
            $currentMarks = $studentMark['marks_obtained'];

            // If this is the first student or marks changed from previous, assign new rank
            if ($previousMarks !== null && $currentMarks !== $previousMarks) {
                // Set rank to current position (skipping tied positions)
                $currentRank = $index + 1;
            }

            $ranks[$studentMark['student_id']] = $currentRank;
            $previousMarks = $currentMarks;
        }

        // Update each student's rank
        foreach ($ranks as $studentId => $rank) {
            Log::info("Updating rank for student ID: {$studentId}, Rank: {$rank}");
            Student::where('id', $studentId)->update(['rank' => $rank]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(ExamMark $examMark)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ExamMark $examMark)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ExamMark $examMark)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ExamMark $examMark)
    {
        //
    }
}

