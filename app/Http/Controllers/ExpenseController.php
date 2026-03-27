<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use App\Http\Requests\StoreExpenseRequest;
use App\Http\Requests\UpdateExpenseRequest;
use App\Models\SystemLog;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ExpenseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        // 1. Calculate Stats for the current month
        $currentMonth = now()->month;
        $currentYear = now()->year;

        $totalExpenses = Expense::whereMonth('expense_date', $currentMonth)
            ->whereYear('expense_date', $currentYear)
            ->sum('amount');

        // Get breakdown by category
        $categoryBreakdown = Expense::select('category', DB::raw('SUM(amount) as total'))
            ->whereMonth('expense_date', $currentMonth)
            ->whereYear('expense_date', $currentYear)
            ->groupBy('category')
            ->pluck('total', 'category')
            ->toArray();

        // 2. Fetch Recent Expenses
        $expenses = Expense::with('recordedBy:id,name')
            ->orderBy('expense_date', 'desc')
            ->get()
            ->map(function ($exp) {
                return [
                    'id' => $exp->id,
                    'title' => $exp->title,
                    'amount' => (float) $exp->amount,
                    'category' => $exp->category,
                    'date' => $exp->expense_date->format('M d, Y'),
                    'recorded_by' => $exp->recordedBy->name,
                ];
            });

        return inertia('admin/finance/expenses/index', [
            'totalExpenses' => (float) $totalExpenses,
            'categoryBreakdown' => $categoryBreakdown,
            'expenses' => $expenses,
            'currentMonth' => now()->format('F Y'),
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
    public function store(StoreExpenseRequest $request)
    {
        //
        $validated = $request->validated();

        $validated['recorded_by'] = Auth::id();

        Expense::create($validated);

        // Inside store() method:
        SystemLog::logActivity(
            'expense_recorded', 
            "Recorded a {$validated['category']} expense of NGN {$validated['amount']} for '{$validated['title']}'",
            'info',
            ['amount' => $validated['amount'], 'category' => $validated['category']]
        );

        return redirect()->back()->with('success', 'Expense recorded successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Expense $expense)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Expense $expense)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateExpenseRequest $request, Expense $expense)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Expense $expense)
    {
        //
    }
}
