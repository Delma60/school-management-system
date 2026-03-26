<?php

namespace App\Http\Controllers;

use App\Models\LeaveRequest;
use App\Models\Payroll;
use App\Models\Staff;
use App\Services\ViewResolver;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PayrollController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $currentMonthYear = Carbon::now()->format('m-Y');
        $displayMonth = Carbon::now()->format('F Y');

        // Fetch payrolls for the current month
        $payrolls = Payroll::with('user.role')
            ->where('month_year', $currentMonthYear)
            ->get()
            ->map(function($payroll) {
                return [
                    'id' => $payroll->id,
                    'name' => $payroll->user->name,
                    'role' => $payroll->user->role->name ?? 'Staff',
                    'base_salary' => $payroll->base_salary,
                    'allowances' => $payroll->allowances,
                    'net_pay' => $payroll->net_pay,
                    'status' => $payroll->status,
                ];
            });

        // Fetch leave requests
        $leaveRequests = LeaveRequest::with('user')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function($leave) {
                return [
                    'id' => $leave->id,
                    'staff_name' => $leave->user->name,
                    'type' => $leave->type,
                    'start_date' => Carbon::parse($leave->start_date)->format('M d, Y'),
                    'end_date' => Carbon::parse($leave->end_date)->format('M d, Y'),
                    'reason' => $leave->reason,
                    'status' => $leave->status,
                ];
            });

        return inertia(ViewResolver::resolve('staff/payroll/index', "admin"), [
            'currentMonth' => $displayMonth,
            'payroll' => $payrolls,
            'leaveRequests' => $leaveRequests,
            'stats' => [
                'total_payroll' => '₦' . number_format($payrolls->sum('net_pay'), 2),
                'pending_leaves' => LeaveRequest::where('status', 'pending')->count(),
                'staff_on_leave' => LeaveRequest::where('status', 'approved')
                                        ->whereDate('start_date', '<=', Carbon::today())
                                        ->whereDate('end_date', '>=', Carbon::today())
                                        ->count()
            ]
        ]);
    }


    public function updateLeaveStatus(Request $request, LeaveRequest $leaveRequest)
    {
        $validated = $request->validate([
            'status' => 'required|in:approved,rejected'
        ]);

        $leaveRequest->update([
            'status' => $validated['status'],
            'approved_by' => Auth::id()
        ]);

        return back()->with('success', 'Leave request ' . $validated['status']);
    }

    /**
     * Action: Generate Payroll for all active staff for the current month
     */
    public function runPayroll()
    {
        $currentMonthYear = Carbon::now()->format('m-Y');

        // Get all staff (exclude students)
        $staffMembers = Staff::all();
        $processedCount = 0;

        foreach ($staffMembers as $staff) {
            // Check if payroll already exists to prevent duplicates
            $exists = Payroll::where('user_id', $staff->id)
                             ->where('month_year', $currentMonthYear)
                             ->exists();

            if (!$exists) {
                // In a real app, base_salary would come from a staff_profiles table or user meta
                $baseSalary = $staff->meta['base_salary'] ?? 0;
                $allowances = $staff->meta['allowances'] ?? 0;
                $deductions = $staff->meta['deductions'] ?? 0;

                $netPay = ($baseSalary + $allowances) - $deductions;

                Payroll::create([
                    'user_id' => $staff->id,
                    'month_year' => $currentMonthYear,
                    'base_salary' => $baseSalary,
                    'allowances' => $allowances,
                    'deductions' => $deductions,
                    'net_pay' => $netPay,
                    'status' => 'draft' // Stays in draft until actual payment is made
                ]);

                $processedCount++;
            }
        }

        return back()->with('success', "Payroll generated for {$processedCount} staff members.");
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
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Payroll $payroll)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Payroll $payroll)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Payroll $payroll)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Payroll $payroll)
    {
        //
    }
}
