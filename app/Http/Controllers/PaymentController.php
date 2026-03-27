<?php

namespace App\Http\Controllers;

use App\Models\FeeType;
use App\Models\Payment;
use App\Models\Student;
use App\Models\StudentFee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PaymentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        return inertia('admin/finance/payments/index');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        //
        $params = $request->all();

        return inertia('admin/finance/payments/create', [
            "feeTypes" => FeeType::all(),
            "students" => Student::all(),
            "params" => $params,
            "tx_reference" => 'TRX-' . date('Ymd') . '-' . strtoupper(Str::random(5))

        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        // 1. Validate the incoming data from the React frontend
        $validated = $request->validate([
            'student_id' => 'required|exists:users,id', // Make sure this matches your users table
            'fee_type_id' => 'required|exists:fee_types,id',
            'amount' => 'required|numeric|min:1',
            'payment_date' => 'required|date',
            'payment_method' => 'required|in:bank_transfer,cash,pos,cheque,online',
            'transaction_reference' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        // 2. Wrap everything in a transaction to ensure data integrity
        // \Illuminate\Support\Facades\
        DB::transaction(function () use ($validated) {

            // A. Record the actual transaction in the payments table
            Payment::create([
                'user_id' => $validated['student_id'],
                'fee_type_id' => $validated['fee_type_id'],
                'amount' => $validated['amount'],
                'payment_date' => $validated['payment_date'],
                'payment_method' => $validated['payment_method'],
                'transaction_reference' => $validated['transaction_reference'],
                'meta' => [
                    'notes' => $validated['notes'],
                    'recorded_by' => Auth::id(), // Track the admin who logged the payment
                ],
            ]);

            // B. Find the student's specific bill for this fee structure
            $studentFee = StudentFee::where('user_id', $validated['student_id'])
                ->where('fee_type_id', $validated['fee_type_id'])
                ->first();

            // C. Update their balance
            if ($studentFee) {
                // If they already have a bill, just add the new payment to their total paid
                $studentFee->amount_paid += $validated['amount'];

                // Optional: You could update the status to "paid" if amount_paid >= amount_due
                // $studentFee->status = ($studentFee->amount_paid >= $studentFee->amount_due) ? 'paid' : 'partial';

                $studentFee->save();
            } else {
                // Edge Case: The student is paying for a fee they weren't explicitly assigned yet.
                // We create the bill right now and apply the payment to it.
                $feeStructure = \App\Models\FeeType::find($validated['fee_type_id']);

                \App\Models\StudentFee::create([
                    'user_id' => $validated['student_id'],
                    'fee_type_id' => $validated['fee_type_id'],
                    'amount_due' => $feeStructure->amount,
                    'amount_paid' => $validated['amount'],
                ]);
            }
        });

        // 3. Redirect back to the fee structure details page with a success message
        return redirect()
            ->route('fees.show', $validated['fee_type_id'])
            ->with('success', 'Payment recorded successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Payment $payment)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Payment $payment)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Payment $payment)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Payment $payment)
    {
        //
    }
}
