<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\Subject;
use App\Models\Teacher;
use App\Models\Timetable;
use App\Services\ViewResolver;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class TeachersController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $authType = Auth::user()->role->name ?? "admin";

        $teachers = Teacher::withCount('subjects') // Many-to-Many relationship
            ->when($request->search, function($query, $search) {
                $query->where(function($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('meta->department', 'like', "%{$search}%");
                });
            })
            ->orderBy('name')
            ->paginate(12)
            ->withQueryString();

        return inertia(ViewResolver::resolve("teachers/index", "admin"), [
            'teachers' => $teachers,
            'filters' => $request->only(['search']),

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
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'department' => 'required',
            'designation' => 'required',
        ]);

        Teacher::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make(Str::random(10)),
            'role_id' => Role::where('slug', 'teacher')->first()->id, // Assuming 'teacher' is the slug for the Teacher role
            'meta' => [
                'department' => $validated['department'],
                'designation' => $validated['designation'],
                'joining_date' => $request->joining_date,
            ]
        ]);

        return back();
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $teacher = Teacher::with('subjects')->findOrFail($id);
        $authType = Auth::user()->role->name ?? "admin";

        return inertia(ViewResolver::resolve("teachers/show", "admin"), [
            // Passing the teacher directly maps perfectly to your TypeScript interface
            'teacher' => $teacher,
            'subjects' => Subject::all(), // Assuming you want to list all subjects for assignment in the modal
            'schedule' => Timetable::where('teacher_id', $teacher->id)
            ->with(['subject', 'classroom', 'timebreak'])
            ->get(),
        ]);

    }

    public function assignSubjects(Request $request, Teacher $teacher)
    {
        $request->validate([
            'subject_ids' => 'present|array',
            'subject_ids.*' => 'exists:subjects,id',
        ]);

        /**
         * The sync() method will:
         * 1. Detach any subjects NOT in the array.
         * 2. Attach any NEW subjects in the array.
         * 3. Keep existing ones untouched.
         */
        $teacher->subjects()->sync($request->subject_ids);

        return back()->with('success', "Subjects updated for {$teacher->name}");
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
    public function update(Request $request, Teacher $teacher)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $teacher->id,
            'department' => 'required|string',
            'designation' => 'required|string',
            'office' => 'nullable|string',
            'joining_date' => 'nullable|date',
            'base_salary' => 'nullable|string'
        ]);

        // Update main user fields
        $teacher->fill([
            'name' => $validated['name'],
            'email' => $validated['email'],
        ]);

        /**
         * Update Meta JSON
         * We merge the new data with existing meta to preserve any keys
         * not present in this specific form (like 'avatar_url' or 'preferences').
         */
        $currentMeta = $teacher->meta ?? [];
        $teacher->meta = array_merge($currentMeta, [
            'department' => $validated['department'],
            'designation' => $validated['designation'],
            'office' => $validated['office'],
            'joining_date' => $validated['joining_date'],
            'base_salary' => $validated['base_salary'],
        ]);

        $teacher->save();

        return back()->with('success', 'Profile updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    public function roosters(Request $request)
{
    // Assuming the teacher's user ID is mapped to teacher_id on the Classroom model
    $teacherId = $request->user()->id;

    $classrooms = \App\Models\Classroom::with(['students' => function($query) {
        // Select what you need to keep the payload light
        $query->select('users.id', 'name', 'email', 'meta'); 
    }])
    ->where('teacher_id', $teacherId)
    ->get();

    return inertia('teacher/classes/roosters', [
        'classrooms' => $classrooms
    ]);
}
}
