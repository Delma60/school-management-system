<?php

namespace App\Http\Controllers;

use App\Models\BehaviorLog;
use App\Http\Requests\StoreBehaviorLogRequest;
use App\Http\Requests\UpdateBehaviorLogRequest;
use App\Models\Student;
use App\Services\ViewResolver;
use Illuminate\Http\Request;

class BehaviorLogController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = BehaviorLog::with(['student.classroom', 'reporter'])->orderBy('incident_date', 'desc');

        // Optional Filters
        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }
        
        if ($request->filled('search')) {
            $query->whereHas('student', function($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%');
            });
        }

        $logs = $query->paginate(15)->withQueryString();

        return inertia(ViewResolver::resolve("students/behavior/index", "teacher"), [
            'logs' => $logs,
            'filters' => $request->only(['type', 'search']),
            // Get all students to populate the "Add Log" dropdown
            'students' => Student::select('id', 'name')->get(), 
            'stats' => [
                'total_logs' => BehaviorLog::count(),
                'positive' => BehaviorLog::where('type', 'positive')->count(),
                'infractions' => BehaviorLog::where('type', 'infraction')->count(),
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
    public function store(StoreBehaviorLogRequest $request)
    {
        //
        $validated = $request->validated();
        $validated['reporter_id'] = $request->user()->id;

        BehaviorLog::create($validated);

        return redirect()->back()->with('success', 'Behavior log recorded successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(BehaviorLog $behaviorLog)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(BehaviorLog $behaviorLog)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBehaviorLogRequest $request, BehaviorLog $behaviorLog)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(BehaviorLog $behaviorLog)
    {
        //
    }
}
