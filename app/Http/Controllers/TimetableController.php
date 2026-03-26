<?php

namespace App\Http\Controllers;

use App\Models\Timetable;
use App\Http\Requests\StoreTimetableRequest;
use App\Http\Requests\UpdateTimetableRequest;
use App\Models\Classroom;
use App\Models\Subject;
use App\Models\Teacher;
use App\Models\TimeBreak;
use App\Services\ViewResolver;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class TimetableController extends Controller
{
    /**
     * Display a listing of the resource.
     */
   public function index(Request $request)
    {
        $classroomId = $request->input('classroom_id', 1);
        
        // If no classroom_id is provided, default to the first classroom
        if (!$classroomId) {
            $firstClassroom = Classroom::first();
            $classroomId = $firstClassroom ? $firstClassroom->id : null;
        }
        

        return inertia(ViewResolver::resolve("timetable/index", "admin"), [
            "selectedClassroomId" => $classroomId,
           'classrooms' => Classroom::all(),
            'subjects' => Subject::where('is_active', true)->orderBy('name')->get(),
            'teachers' => Teacher::orderBy('name')->get(), // Uses the Global Scope
            'breaks' => TimeBreak::all(),
            'schedule' => $classroomId ? Timetable::where('classroom_id', $classroomId)
                ->with(['subject', 'teacher', 'classroom', 'timebreak'])
                ->get() : collect([]),
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
    public function store(StoreTimetableRequest $request)
    {
        $validated = $request->validated();

        // 1. Classroom Conflict Check (Applies to both Classes and Breaks)
        $classroomConflict = Timetable::where('classroom_id', $validated['classroom_id'])
            ->where('day_of_week', $validated['day_of_week'])
            ->where(function ($query) use ($validated) {
                // Overlap logic: (Start A < End B) AND (End A > Start B)
                $query->where('start_time', '<', $validated['end_time'])
                      ->where('end_time', '>', $validated['start_time']);
            })->first();

        if ($classroomConflict) {
            // Safely determine the name of the conflicting slot
            $conflictName = $classroomConflict->entry_type === 'break' 
                ? ($classroomConflict->timebreak->name ?? 'a break') 
                : ($classroomConflict->subject->name ?? 'another class');
                
            throw ValidationException::withMessages([
                'start_time' => "This classroom is already booked for {$conflictName} during this time.",
            ]);
        }

        // 2. Teacher Conflict Check (ONLY applies to Classes)
        if ($validated['entry_type'] === 'class') {
            $teacherConflict = Timetable::where('teacher_id', $validated['teacher_id'])
                ->where('day_of_week', $validated['day_of_week'])
                ->where(function ($query) use ($validated) {
                    $query->where('start_time', '<', $validated['end_time'])
                          ->where('end_time', '>', $validated['start_time']);
                })->first();
                
            if ($teacherConflict) {
                throw ValidationException::withMessages([
                    'teacher_id' => "This teacher is already scheduled in Room {$teacherConflict->classroom->room_number} at this time.",
                ]);
            }
        }

        // Clean up data based on type before saving to ensure database integrity
        if ($validated['entry_type'] === 'break') {
            $validated['subject_id'] = null;
            $validated['teacher_id'] = null;
        } else {
            $validated['timebreak_id'] = null;
        }

        // 3. Save
        Timetable::create($validated);

        return back()->with('success', 'Timetable slot created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Timetable $timetable)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Timetable $timetable)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTimetableRequest $request, Timetable $timetable)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Timetable $timetable)
    {
        //
    }
}
