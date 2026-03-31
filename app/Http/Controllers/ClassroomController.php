<?php

namespace App\Http\Controllers;

use App\Models\Classroom;
use App\Http\Requests\StoreClassroomRequest;
use App\Http\Requests\UpdateClassroomRequest;
use App\Models\Teacher;
use App\Services\ViewResolver;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;

class ClassroomController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        return inertia(ViewResolver::resolve("classroom/index", "admin"), [
                    'classrooms' => Classroom::with('teacher')
                        ->withCount('students')
                        ->get()
                        ->map(fn($cls) => [
                            'id' => $cls->id,
                            'name' => $cls->name,
                            'grade_level' => $cls->grade_level,
                            'room_number' => $cls->room_number,
                            'student_count' => $cls->students_count,
                            'capacity' => $cls->capacity,
                            'teacher_name' => $cls->teacher ? $cls->teacher->name : 'Unassigned',
                        ]),
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
    public function store(StoreClassroomRequest $request)
    {
        //
        $validated = $request->validated();
        $created = Classroom::create($request->validated());
        return Redirect::back()->with('success', "Classroom {$validated['name']} created successfully!");
    }

    /*
     * Display the specified resource.
     */
    public function show(Classroom $classroom)
        {
            // Load existing relationships
            $classroom->load(['students', 'teacher']);

            // Fetch all teachers (assuming role 'teacher' or a Teacher model)
            $teachers = Teacher::select('id', 'name', 'email')->get();
            // Or if you have a specific Teacher model: \App\Models\Teacher::all();

            return inertia('admin/classroom/show', [
                'classroom' => $classroom,
                'teachers' => $teachers, // Pass the teachers to the frontend
            ]);
        }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Classroom $classroom)
    {

        return inertia(ViewResolver::resolve("classroom/edit", "admin"), [
        'classroom' => $classroom->loadCount('students'),
        'teachers' => Teacher::all(),
    ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateClassroomRequest $request, Classroom $classroom)
    {
        $validated = $request->validated();
        Log::info("Updating classroom with data: " . json_encode($validated));
        $classroom->update($validated);
        return redirect()->back()
        ->with('success', 'Classroom details updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Classroom $classroom)
    {
        //
    }



}
