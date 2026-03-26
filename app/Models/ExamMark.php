<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExamMark extends Model
{
    protected $fillable = [
        'student_id',
        'exam_subject_id',
        'teacher_id',
        'marks_obtained',
        'teacher_remark',
        'meta'
    ];

    protected $casts = ['meta' => 'array'];

    protected $appends = ['grade'];

    public function student() { return $this->belongsTo(Student::class); }
    public function examSubject() { return $this->belongsTo(ExamSubject::class); }

    public function teacher()
    {
        // Identifies the staff member who recorded the score
        return $this->belongsTo(User::class, 'teacher_id');
    }

    public function getGradeAttribute()
    {
        return GradingScale::where('min_score', '<=', $this->marks_obtained)
                        ->where('max_score', '>=', $this->marks_obtained)
                        ->first()?->grade ?? 'N/A';
    }
}
