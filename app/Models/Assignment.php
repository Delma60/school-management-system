<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Assignment extends Model
{
    /** @use HasFactory<\Database\Factories\AssignmentFactory> */
    use HasFactory;

    protected $fillable = [
        'teacher_id',
        'subject_id',
        'classroom_id',
        'title',
        'description',
        'due_date',
        'max_points',
    ];

    public function teacher (){
        return $this->belongsTo(Teacher::class, 'teacher_id');
    }

    public function subject() {
        return $this->belongTo(Subject::class, 'subject_id');
    }

    public function classroom(){
        return $this->belongsTO(Classroom::class, 'classroom_id');
    }
}
