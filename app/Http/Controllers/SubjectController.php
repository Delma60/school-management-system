<?php

namespace App\Http\Controllers;

use App\Models\Subject;
use App\Http\Requests\StoreSubjectRequest;
use App\Http\Requests\UpdateSubjectRequest;
use App\Models\Teacher;
use App\Services\ViewResolver;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class SubjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        //
        $authType = Auth::user()->role->name ?? "admin";

        $subjects = Subject::withCount('teachers') // Assuming a belongsToMany relationship
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                      ->orWhere('code', 'like', "%{$search}%");
            })
            ->when($request->department && $request->department !== 'all', function ($query, $dept) use ($request) {
                $query->where('department', $request->department);
            })
            ->orderBy('department')
            ->orderBy('name')
            ->paginate(15)
            ->withQueryString();

        return inertia(ViewResolver::resolve("subjects/index", "admin"), [
            'subjects' => $subjects,
            'filters' => $request->only(['search', 'department'])
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
    public function store(StoreSubjectRequest $request)
    {
        //
        $validated = $request->validated();
        Subject::create([
            ...$validated,
            'slug' => Str::slug($validated['name']),
        ]);

        return redirect()->back()->with('success', "Subject '{$validated['name']}' added to curriculum.");
    }

    /**
     * Display the specified resource.
     */
    public function show(Subject $subject)
    {

        $subject->load('teachers'); // Load currently assigned teachers

        // Get the Teacher role ID

        // Find all teachers who are NOT already assigned to this subject
        $availableTeachers = Teacher::whereNotIn('id', $subject->teachers->pluck('id'))
            ->select('id', 'name', 'email')
            ->orderBy('name')
            ->get();

        return inertia(ViewResolver::resolve("subjects/show", "admin"), [
            'subject' => $subject,
            'assignedTeachers' => $subject->teachers,
            'availableTeachers' => $availableTeachers,
        ]);
    }



    public function teachers(Subject $subject)
    {
        $subject->load('teachers');
        // $teacherRoleId = Role::where('slug', 'teacher')->first()->id;
        $authType = Auth::user()->role->name ?? "admin";


        $availableTeachers = Teacher::whereNotIn('id', $subject->teachers->pluck('id'))
            ->select('id', 'name', 'email')
            ->orderBy('name')
            ->get();

        return inertia(ViewResolver::resolve("subjects/teachers", "admin"), [
            'subject' => $subject,
            'assignedTeachers' => $subject->teachers,
            'availableTeachers' => $availableTeachers,
        ]);
    }

    // 3. The Syllabus Page
    public function syllabus(Subject $subject)
    {
        return inertia(ViewResolver::resolve("subjects/syllabus", "admin"), [
            'subject' => $subject,
        ]);
    }

    public function edit(Subject $subject)
    {
        //
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSubjectRequest $request, Subject $subject)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Subject $subject)
    {
        //
    }
}
