<?php

namespace App\Http\Controllers;

use App\Models\ClassFee;
use App\Models\Classroom;
use App\Models\FeeType;
use App\Models\Payment;
use App\Models\Student;
use App\Models\StudentFee;
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
        $recentPayments = Payment::with('student.meta')
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

        return inertia('admin/finance/fees/index', [
            'stats' => $stats,
            'feeStructures' => $feeStructures,
            'recentPayments' => $recentPayments,
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

        // 1. Update validation to include the arrays from the React frontend
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
            'student_ids.*' => 'exists:users,id', // Validating against the users table
        ]);

        // 2. Use a Database Transaction to ensure all data saves together safely
        DB::transaction(function () use ($validated) {

            // Create the main FeeType record
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

            // Handle Specific Student Assignment
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
            // Handle Entire Classroom Assignment
            elseif ($validated['assignment_type'] === 'class' && !empty($validated['classroom_ids'])) {
                $studentIds = Student::whereIn('classroom_id', $validated['classroom_ids'])
                    ->pluck('id');

                // First, record that this fee applies to these classrooms
                foreach ($validated['classroom_ids'] as $classroomId) {
                    ClassFee::create([
                        'classroom_id' => $classroomId,
                        'fee_type_id' => $fee->id,
                        'amount_due' => $fee->amount * count($studentIds),
                        'amount_paid' => 0,
                    ]);
                }

                // Next, fetch all student IDs belonging to these selected classrooms


                // Finally, generate the actual bill (StudentFee) for each student in those classes
                foreach ($studentIds as $studentId) {
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

        $classrooms = Classroom::all(['id', 'name']);
        $students = User::where('role', 'student')->get(['id', 'name']);

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
            'assign_to' => 'required|in:students,classes',
            'student_ids' => 'required_if:assign_to,students|array',
            'student_ids.*' => 'exists:users,id',
            'classroom_ids' => 'required_if:assign_to,classes|array',
            'classroom_ids.*' => 'exists:classrooms,id',
        ]);

        DB::transaction(function () use ($validated, $fee) {
            if ($validated['assign_to'] === 'students') {
                $studentIds = $validated['student_ids'];

                // Create StudentFee records for each student
                foreach ($studentIds as $studentId) {
                    StudentFee::updateOrCreate(
                        [
                            'student_id' => $studentId,
                            'fee_type_id' => $fee->id,
                        ],
                        [
                            'amount_due' => $fee->amount,
                            'amount_paid' => 0, // Default to 0 on new assignment
                        ]
                    );
                }
            } elseif ($validated['assign_to'] === 'classes') {
                $classroomIds = $validated['classroom_ids'];

                // Create ClassFee records for each classroom
                foreach ($classroomIds as $classroomId) {
                    ClassFee::updateOrCreate(
                        [
                            'classroom_id' => $classroomId,
                            'fee_type_id' => $fee->id,
                        ]
                    );
                }

                // Get all student IDs from the selected classrooms
                $studentIds = User::whereIn('classroom_id', $classroomIds)
                    ->where('role', 'student')
                    ->pluck('id');

                // Assign the fee to all students in those classes
                foreach ($studentIds as $studentId) {
                    StudentFee::updateOrCreate(
                        [
                            'student_id' => $studentId,
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

        return redirect()->route('fees.index')->with('success', 'Fee structure assigned successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(FeeType $fee)
    {
        $this->authorize('delete', $fee);

        $fee->delete();

        return redirect()
            ->route('fees.index')
            ->with('success', 'Fee structure deleted successfully.');
    }
}
