<?php

namespace App\Http\Controllers;

use App\Models\Examination as Exam;
use App\Http\Requests\StoreExaminationRequest;
use App\Http\Requests\UpdateExaminationRequest;
use App\Models\Classroom;
use App\Models\Examination;
use App\Models\Subject;
use App\Services\ViewResolver;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ExaminationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {

        return inertia(ViewResolver::resolve("exam/index", "admin"), [
            'exams' => Exam::withCount('subjects')->latest()->paginate(10),
            'stats' => [
                'active_exams' => Exam::where('status', 'ongoing')->count(),
                'pending_results' => Exam::where('status', 'completed')->where('results_published', false)->count(),
                'subjects_count' => count(Subject::all()),
            ],
            'terms' => ['First Term', 'Second Term', 'Third Term'],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //

        return inertia(ViewResolver::resolve("exam/create", "admin"), [
        'subjects' => \App\Models\Subject::where('is_active', true)->get(['id', 'name', 'code']),
        'terms' => ['First Term', 'Second Term', 'Third Term'],
        'sessions' => ['2025/2026', '2026/2027'],
        'classrooms' => Classroom::with(['timetable.subject'])->orderBy('grade_level')->get(['id', 'name'])
    ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreExaminationRequest $request)
    {
        //
        $validated = $request->validated();
        DB::transaction(function () use ($validated) {
        // Create the main Exam record
        $exam = Exam::create(collect($validated)->except('schedules')->toArray());
        $exam->classrooms()->attach($validated['classroom_ids']);

        // Attach subjects with their timetable details
        foreach ($validated['schedules'] as $schedule) {
                $exam->subjects()->create([
                    'subject_id' => $schedule['subject_id'],
                    'exam_date' => $schedule['date'],
                    'start_time' => $schedule['start_time'],
                    // Storing end_time in meta or as a new column, assuming meta for flexibility here:
                    'meta' => ['end_time' => $schedule['end_time']],
                    'max_marks' => 100,
                    'pass_marks' => 40,
                ]);
            }
        });

        return redirect()->route('exams.index')->with('success', 'Exam timetable published successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Examination $examination)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Examination $exam)
    {
        
        return inertia(ViewResolver::resolve("exam/editSchedule", "admin"), [
            'classrooms' => Classroom::with(['timetable.subject'])
            ->orderBy('grade_level')->get(['id', 'name']),
            'exam' => $exam->load(['subjects.subject', 'classrooms']),
            'allSubjects' => Subject::where('is_active', true)->get(['id', 'name', 'code']),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateExaminationRequest $request, Examination $exam)
    {
        $validated = $request->validated();

        DB::transaction(function () use ($validated, $exam) {
            foreach ($validated['schedules'] as $row) {
                $exam->classrooms()->sync($validated['classroom_ids']);

                // 2. Update Timetable
                // First, get IDs of subjects sent in the request
                $keptSubjectIds = collect($validated['schedules'] ?? [])->pluck('id')->filter()->toArray();

                // Delete any existing subjects that were removed from the UI
                $exam->subjects()->whereNotIn('id', $keptSubjectIds)->delete();
                $exam->subjects()->updateOrCreate(
                    ['id' => $row['id'] ?? null], // Match by ID or create new
                    [
                        'subject_id' => $row['subject_id'],
                        'exam_date' => $row['exam_date'],
                        'start_time' => $row['start_time'],
                        'meta' => ['end_time' => $row['end_time']]
                    ]
                );
            }
        });

        return redirect()->back()->with('success', 'Timetable updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Examination $examination)
    {
        try {
            Log::info("Deleting examination: " . json_encode($examination->only(['id', 'name'])));

            DB::transaction(function () use ($examination) {
                // Delete all exam marks associated with this exam's subjects
                $examination->subjects()->each(function ($examSubject) {
                    $examSubject->marks()->delete();
                });

                // Delete all exam subjects
                $examination->subjects()->delete();

                // Detach classrooms
                $examination->classrooms()->detach();

                // Delete the examination
                $examination->delete();
            });

            return back()->with('success', 'Examination deleted successfully.');
        } catch (\Exception $e) {
            Log::error('Failed to delete examination: ' . $e->getMessage());
            return redirect()->route('exams.index')->with('error', 'Failed to delete examination.');
        }
    }
}
