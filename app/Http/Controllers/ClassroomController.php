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
        $authType = Auth::user()->role?->name ?? "admin";

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
        Log::info(["created" => $created, "all" => $request->all(), "validated" => $validated]);
        return Redirect::back()->with('success', "Classroom {$validated['name']} created successfully!");
    }

    /*
     * Display the specified resource.
     */
    public function show(Classroom $classroom)
    {

        $classroom->load(['students', 'teacher']);

        // We also need the count for the UI capacity bar
        $classroom->loadCount('students');
        return inertia(ViewResolver::resolve("classroom/show", "admin"), compact("classroom"));
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
