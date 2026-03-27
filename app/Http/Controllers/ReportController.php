<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use App\Models\Payment;
use App\Models\Staff;
use App\Models\Student;
use App\Models\StudentFee;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $currentYear = now()->year;

        // 1. Calculate High-Level Financial Metrics
        $totalIncome = Payment::whereYear('payment_date', $currentYear)->sum('amount');
        $totalExpenses = Expense::whereYear('expense_date', $currentYear)->sum('amount');
        
        $expectedFees = StudentFee::sum('amount_due');
        $collectedFees = StudentFee::sum('amount_paid');
        $totalOutstanding = $expectedFees - $collectedFees;

        // 2. Prepare Monthly Data for the Bar Chart
        $monthlyIncome = Payment::selectRaw('MONTH(payment_date) as month, SUM(amount) as total')
            ->whereYear('payment_date', $currentYear)
            ->groupBy('month')
            ->pluck('total', 'month')->toArray();

        $monthlyExpenses = Expense::selectRaw('MONTH(expense_date) as month, SUM(amount) as total')
            ->whereYear('expense_date', $currentYear)
            ->groupBy('month')
            ->pluck('total', 'month')->toArray();

        $chartData = [];
        $months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        foreach ($months as $index => $month) {
            $monthNum = $index + 1;
            $chartData[] = [
                'name' => $month,
                'income' => $monthlyIncome[$monthNum] ?? 0,
                'expense' => $monthlyExpenses[$monthNum] ?? 0,
            ];
        }

        // 3. General School Stats
        $totalStudents = Student::count();
        $totalStaff = Staff::count();

        return inertia('admin/reports/index', [
            'financial' => [
                'income' => (float) $totalIncome,
                'expenses' => (float) $totalExpenses,
                'net' => (float) ($totalIncome - $totalExpenses),
                'outstanding' => (float) $totalOutstanding,
            ],
            'chartData' => $chartData,
            'general' => [
                'students' => $totalStudents,
                'staff' => $totalStaff,
            ],
            'currentYear' => $currentYear,
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
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
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
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
