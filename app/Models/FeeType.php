<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FeeType extends Model
{
    protected $fillable = ['name', 'amount', 'academic_session', 'term', 'status', 'meta'];

    protected $casts = [
        'meta' => 'json',
    ];

    public function studentFees()
    {
        return $this->hasMany(StudentFee::class);
    }

    public function classroomFees()
    {
        return $this->hasMany(ClassFee::class);
    }
}
