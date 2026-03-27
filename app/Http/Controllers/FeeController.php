<?php

namespace App\Http\Controllers;

use App\Models\ClassFee;
use App\Models\Classroom;
use App\Models\FeeType;
use App\Models\Payment;
use App\Models\Student;
use App\Models\StudentFee;
use App\Models\SystemLog;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;

class FeeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $this->authorize('viewAny', FeeType::class);

        // Define the current active period
        $currentSession = '2025/2026';
        $currentTerm = 'First Term';

        // 1. Calculate Global Statistics for the current term
        $expected = StudentFee::whereHas('feeType', function ($q) use (
            $currentSession,
            $currentTerm
        ) {
            $q->where('academic_session', $currentSession)->where('term', $currentTerm);
        })->sum('amount_due');

        $collected = StudentFee::whereHas('feeType', function ($q) use (
            $currentSession,
            $currentTerm
        ) {
            $q->where('academic_session', $currentSession)->where('term', $currentTerm);
        })->sum('amount_paid');

        $outstanding = $expected - $collected;
        $collectionRate = $expected > 0 ? round(($collected / $expected) * 100, 1) : 0;

        $stats = [
            'total_expected' => (float) $expected,
            'total_collected' => (float) $collected,
            'total_outstanding' => (float) $outstanding,
            'collection_rate' => $collectionRate,
        ];

        // 2. Fetch Fee Structures with the count of assigned students
        $feeStructures = FeeType::where('academic_session', $currentSession)
            ->where('term', $currentTerm)
            ->withCount('studentFees as assigned_students')
            ->get()
            ->map(function ($fee) {
                return [
                    'id' => $fee->id,
                    'name' => $fee->name,
                    'amount' => (float) $fee->amount,
                    'assigned_students' => $fee->assigned_students,
                    'status' => $fee->status,
                ];
            });

        // 3. Fetch Recent Transactions
        $recentPayments = Payment::with('student')
            ->orderBy('payment_date', 'desc')
            ->take(10)
            ->get()
            ->map(function ($payment) {
                return [
                    'id' => $payment->transaction_reference,
                    'student' => $payment->student->name,
                    // Assuming class/grade is stored in user meta
                    'class' => $payment->student->meta['class'] ?? 'N/A',
                    'amount' => (float) $payment->amount,
                    'date' => $payment->payment_date->format('M d, Y'),
                    'method' => $payment->payment_method,
                    'status' => 'completed',
                ];
            });

            $defaulters = StudentFee::with(['student.classroom', 'feeType'])
                ->whereHas('feeType', function ($q) use ($currentSession, $currentTerm) {
                    $q->where('academic_session', $currentSession)->where('term', $currentTerm);
                })
                ->whereColumn('amount_due', '>', 'amount_paid') // Only get unpaid or partially paid
                ->orderByRaw('(amount_due - amount_paid) DESC') // Order by highest debt first
                ->get()
                ->map(function ($fee) {
                    return [
                        'id' => $fee->id,
                        'student_id' => $fee->user_id,
                        'student_name' => $fee->student->name ?? trim(($fee->student->first_name ?? '') . ' ' . ($fee->student->last_name ?? '')),
                        'class' => $fee->student->classroom->name ?? 'N/A',
                        'fee_name' => $fee->feeType->name,
                        'fee_type_id' => $fee->feeType->id,
                        'balance' => (float) ($fee->amount_due - $fee->amount_paid),
                    ];
                });
        return inertia('admin/finance/fees/index', [
            'stats' => $stats,
            'feeStructures' => $feeStructures,
            'recentPayments' => $recentPayments,
            'defaulters' => $defaulters,
            'currentTerm' => "$currentSession - $currentTerm",
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $this->authorize('create', FeeType::class);

        //
        $classrooms = Classroom::all();
        // Assuming you have a Student model, and eager loading the user if names are stored there
        $students = Student::all();

        return inertia('admin/finance/fees/create', [
            'classrooms' => $classrooms,
            'students' => $students,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $this->authorize('create', FeeType::class);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'academic_session' => 'required|string',
            'term' => 'required|in:First Term,Second Term,Third Term',
            'status' => 'required|in:active,inactive',
            'description' => 'nullable|string',
            'assignment_type' => 'required|in:class,student',
            'classroom_ids' => 'required_if:assignment_type,class|array',
            'classroom_ids.*' => 'exists:classrooms,id',
            'student_ids' => 'required_if:assignment_type,student|array',
            'student_ids.*' => 'exists:users,id',
        ]);

        DB::transaction(function () use ($validated) {

            $fee = FeeType::create([
                'name' => $validated['name'],
                'amount' => $validated['amount'],
                'academic_session' => $validated['academic_session'],
                'term' => $validated['term'],
                'status' => $validated['status'],
                'meta' => [
                    'description' => $validated['description'],
                    'created_by' => Auth::id(),
                ],
            ]);

            Log::info($fee);

            if ($validated['assignment_type'] === 'student' && !empty($validated['student_ids'])) {
                foreach ($validated['student_ids'] as $studentId) {
                    StudentFee::create([
                        'user_id' => $studentId,
                        'fee_type_id' => $fee->id,
                        'amount_due' => $fee->amount,
                        'amount_paid' => 0,
                    ]);
                }
            }
            elseif ($validated['assignment_type'] === 'class' && !empty($validated['classroom_ids'])) {

                // Get ALL students in all selected classes (for individual bills)
                $allStudentIds = Student::whereIn('classroom_id', $validated['classroom_ids'])->pluck('id');

                foreach ($validated['classroom_ids'] as $classroomId) {
                    // FIX: Count students strictly for THIS specific class
                    $classStudentCount = Student::where('classroom_id', $classroomId)->count();

                    ClassFee::create([
                        'classroom_id' => $classroomId,
                        'fee_type_id' => $fee->id,
                        'amount_due' => $fee->amount * $classStudentCount, // Corrected Math
                        'amount_paid' => 0,
                    ]);
                }

                // Generate the actual bill for each individual student
                foreach ($allStudentIds as $studentId) {
                    StudentFee::create([
                        'user_id' => $studentId,
                        'fee_type_id' => $fee->id,
                        'amount_due' => $fee->amount,
                        'amount_paid' => 0,
                    ]);
                }
            }
        });

        return redirect()
            ->route('fees.index')
            ->with('success', 'New fee structure created and assigned successfully.');
    }


    /**
     * Update the specified resource in storage.
     */


    /**
     * Display the specified resource.
     */
    /**
     * Display the specified resource.
     */
    public function show(FeeType $fee)
    {
        $this->authorize('view', $fee);

        // Load relationships (Ensure these are defined in your FeeType model)
        $fee->load(['classroomFees.classroom', 'studentFees.student']);

        // Calculate specific stats for this fee
        $expected = $fee->studentFees()->sum('amount_due');
        $collected = $fee->studentFees()->sum('amount_paid');
        $outstanding = $expected - $collected;
        $collectionRate = $expected > 0 ? round(($collected / $expected) * 100, 1) : 0;

        return inertia('admin/finance/fees/show', [
            'fee' => $fee,
            'stats' => [
                'expected' => (float) $expected,
                'collected' => (float) $collected,
                'outstanding' => (float) $outstanding,
                'collection_rate' => $collectionRate,
            ],
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(FeeType $fee)
    {
        $this->authorize('update', $fee);

        $fee->load(['classroomFees', 'studentFees']);
        $classrooms = Classroom::all(['id', 'name']);
        $students = Student::all(['id', 'name']);

        return inertia('admin/finance/fees/edit', [
            'fee' => $fee,
            'classrooms' => $classrooms,
            'students' => $students,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, FeeType $fee)
    {
        $this->authorize('update', $fee);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'academic_session' => 'required|string',
            'term' => 'required|in:First Term,Second Term,Third Term',
            'status' => 'required|in:active,inactive',
            'description' => 'nullable|string',
            'assignment_type' => 'required|in:class,student',
            'classroom_ids' => 'required_if:assignment_type,class|array',
            'classroom_ids.*' => 'exists:classrooms,id',
            'student_ids' => 'required_if:assignment_type,student|array',
            'student_ids.*' => 'exists:users,id',
        ]);

        DB::transaction(function () use ($validated, $fee) {

            $fee->update([
                'name' => $validated['name'],
                'amount' => $validated['amount'],
                'academic_session' => $validated['academic_session'],
                'term' => $validated['term'],
                'status' => $validated['status'],
                'meta' => [
                    'description' => $validated['description'],
                    'updated_by' => Auth::id(),
                ],
            ]);

            if ($validated['assignment_type'] === 'student' && !empty($validated['student_ids'])) {
                foreach ($validated['student_ids'] as $studentId) {
                    StudentFee::firstOrCreate(
                        [
                            'user_id' => $studentId,
                            'fee_type_id' => $fee->id,
                        ],
                        [
                            'amount_due' => $fee->amount,
                            'amount_paid' => 0,
                        ]
                    );
                }
            }
            elseif ($validated['assignment_type'] === 'class' && !empty($validated['classroom_ids'])) {

                // FIX: Moved inside the condition to prevent "Undefined array key" errors
                $allStudentIds = Student::whereIn('classroom_id', $validated['classroom_ids'])->pluck('id');

                foreach ($validated['classroom_ids'] as $classroomId) {
                    // FIX: Count students strictly for THIS specific class
                    $classStudentCount = Student::where('classroom_id', $classroomId)->count();

                    ClassFee::firstOrCreate(
                        [
                            'classroom_id' => $classroomId,
                            'fee_type_id' => $fee->id,
                        ],
                        [
                            'amount_due' => $fee->amount * $classStudentCount, // Corrected Math
                            'amount_paid' => 0,
                        ]
                    );
                }

                foreach ($allStudentIds as $studentId) {
                    Log::info("Assigning fee to student ID: $studentId for fee ID: {$fee->id} amount: {$fee->amount}");
                    StudentFee::updateOrInsert(
                        [
                            'user_id' => $studentId,
                            'fee_type_id' => $fee->id,
                        ],
                        [
                            'amount_due' => $fee->amount,
                            'amount_paid' => 0,
                        ]
                    );
                }
            }
        });

        return redirect()
            ->route('fees.show', $fee->id)
            ->with('success', 'Fee structure updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(FeeType $fee)
    {
        $this->authorize('delete', $fee);

        $fee->delete();

        SystemLog::logActivity(
            'fee_deleted', 
            "Deleted the fee structure: {$fee->name}",
            'warning',
            ['fee_id' => $fee->id, 'amount' => $fee->amount]
        );

        return redirect()
            ->route('fees.index')
            ->with('success', 'Fee structure deleted successfully.');
    }
}
