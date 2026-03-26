<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudentFee extends Model
{
    protected $fillable = ['user_id', 'fee_type_id', 'amount_due', 'amount_paid', 'status'];

    public function student()
    {
        return $this->belongsTo(Student::class, 'user_id');
    }

    public function feeType()
    {
        return $this->belongsTo(FeeType::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }
}
