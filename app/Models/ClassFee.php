<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClassFee extends Model
{
    //
    protected $fillable = ['classroom_id', 'fee_type_id', 'amount_due', 'amount_paid', 'status'];

    public function student()
    {
        return $this->belongsTo(Classroom::class, 'classroom_id');
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
