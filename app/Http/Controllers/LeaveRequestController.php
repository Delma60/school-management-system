<?php

namespace App\Http\Controllers;

use App\Models\LeaveRequest;
use App\Http\Requests\StoreLeaveRequestRequest;
use App\Http\Requests\UpdateLeaveRequestRequest;
use Illuminate\Http\Request;

class LeaveRequestController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Authorize the user
        $this->authorize('viewAny', LeaveRequest::class);

        // Fetch leave requests for the logged-in teacher
        $leaveRequests = LeaveRequest::where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();

            // C:\Users\HP\Documents\projects\school-management-system\resources\js\pages\
        return inertia('teacher/leave-request/index', [
            'leaveRequests' => $leaveRequests
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
    public function store(StoreLeaveRequestRequest $request)
    {
        // Authorize the user
        $this->authorize('create', LeaveRequest::class);

        $validated = $request->validated();
        
        // Attach the user ID and set default status
        $validated['user_id'] = $request->user()->id;
        $validated['status'] = 'pending';

        LeaveRequest::create($validated);

        return redirect()->back()->with('success', 'Leave request submitted successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(LeaveRequest $leaveRequest)
    {
        // Authorize the user
        $this->authorize('view', $leaveRequest);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(LeaveRequest $leaveRequest)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateLeaveRequestRequest $request, LeaveRequest $leaveRequest)
    {
        // Authorize the user
        $this->authorize('update', $leaveRequest);

        $validated = $request->validated();
        $leaveRequest->update($validated);

        return redirect()->back()->with('success', 'Leave request updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(LeaveRequest $leaveRequest)
    {
        // Authorize the user
        $this->authorize('delete', $leaveRequest);

        $leaveRequest->delete();

        return redirect()->back()->with('success', 'Leave request deleted successfully.');
    }
}
