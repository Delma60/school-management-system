<?php

namespace App\Http\Controllers;

use App\Models\LessonPlan;
use App\Http\Requests\StoreLessonPlanRequest;
use App\Http\Requests\UpdateLessonPlanRequest;
use App\Models\Classroom;
use App\Models\Subject;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class LessonPlanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        return inertia('teacher/lesson-plans/index', [
        'lessonPlans' => LessonPlan::where('teacher_id', auth()->id())
                            ->with(['subject', 'classroom'])
                            ->latest('date')
                            ->get(),
        'classrooms' => Classroom::all(), // Or filter by teacher's assigned classes
        'subjects' => Subject::where('is_active', true)->get(),
    ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia('teacher/lesson-plans/create', [
            // Only fetch classrooms assigned to this teacher (or all, depending on your setup)
            'classrooms' => Classroom::select('id', 'name')->get(), 
            // Fetch active subjects
            'subjects' => Subject::select('id', 'name')->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreLessonPlanRequest $request)
    {
        //
        $validated = $request->validated();

        // Automatically assign the logged-in user as the teacher
        $validated['teacher_id'] = $request->user()->id;

        // Create the record in the database
        LessonPlan::create($validated);

        // Redirect back to the lesson plans list with a success message
        return redirect()->route('lesson-plans.index')
                         ->with('success', 'Lesson plan created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(LessonPlan $lessonPlan)
    {
        $lessonPlan->with(['subject', 'classroom']);
        Log::info($lessonPlan);

        return inertia('teacher/lesson-plans/show', [
            'lessonPlan' => $lessonPlan
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(LessonPlan $lessonPlan)
    {

        return inertia('teacher/lesson-plans/edit', [
            'lessonPlan' => $lessonPlan,
            'classrooms' => \App\Models\Classroom::select('id', 'name')->get(),
            'subjects'   => \App\Models\Subject::select('id', 'name')->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateLessonPlanRequest $request, LessonPlan $lessonPlan)
    {
        //
        $validated = $request->validated();

        // 3. Update the database record
        $lessonPlan->update($validated);

        // 4. Send them back to the 'Show' page so they can see their updated document
        return redirect()->route('lesson-plans.show', $lessonPlan->id)
                         ->with('success', 'Lesson plan updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(LessonPlan $lessonPlan)
    {
        //
    }
}
