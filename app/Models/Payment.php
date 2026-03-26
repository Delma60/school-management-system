<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'transaction_reference', 'user_id', 'student_fee_id',
        'amount', 'payment_method', 'payment_date', 'notes'
    ];

    // Using your custom Carbon implementation for dates if needed here
    protected $casts = [
        'payment_date' => 'date',
    ];

    public function student()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function studentFee()
    {
        return $this->belongsTo(StudentFee::class);
    }
}
