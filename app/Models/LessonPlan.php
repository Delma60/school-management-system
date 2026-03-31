<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LessonPlan extends Model
{
    /** @use HasFactory<\Database\Factories\LessonPlanFactory> */
    use HasFactory;

    protected $fillable = [
        'teacher_id',
        'subject_id',
        'classroom_id',
        'title',
        'date',
        'objectives',
        'materials',
        'content',
        'meta',
    ];

    public function teacher(){
        return $this->belongsTo(Teacher::class, 'teacher_id');
    }

    public function subject(){
        return $this->belongsTo(Subject::class, 'subject_id');
    }

    public function classroom()
    {
        return $this->belongsTo(Classroom::class);
    }
}
