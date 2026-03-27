<?php

namespace App\Http\Controllers;

use App\Models\SystemLog;
use App\Http\Requests\StoreSystemLogRequest;
use App\Http\Requests\UpdateSystemLogRequest;
use Illuminate\Http\Request;

class SystemLogController extends Controller
{
    /**
     * Display a listing of the resource.
     */
   public function index(Request $request)
    {
        // Require admin permissions (Assuming you have a gate or middleware for this)
        // $this->authorize('viewAny', SystemLog::class);

        $query = SystemLog::with('user:id,name,email');

        // Filter by Level
        if ($request->filled('level') && $request->level !== 'all') {
            $query->where('level', $request->level);
        }

        // Search by action or message
        if ($request->filled('search')) {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('action', 'like', "%{$searchTerm}%")
                  ->orWhere('message', 'like', "%{$searchTerm}%");
            });
        }

        $logs = $query->latest()->paginate(20)->withQueryString();

        return inertia('admin/system-log/index', [
            'logs' => $logs,
            'filters' => $request->only(['search', 'level']),
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
    public function store(StoreSystemLogRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(SystemLog $systemLog)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(SystemLog $systemLog)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSystemLogRequest $request, SystemLog $systemLog)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(SystemLog $systemLog)
    {
        //
    }
}
