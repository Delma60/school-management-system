<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExamSubject extends Model
{
    //
     protected $fillable = [
        "examination_id",
        "subject_id",
        "exam_date",
        "start_time",
        "max_marks",
        "pass_marks",
        'meta'

    ];

    protected $casts = [
        "meta" => "json"
    ];
    public function exam() { return $this->belongsTo(Examination::class, 'examination_id'); }
    public function subject() { return $this->belongsTo(Subject::class); }

    public function marks()
    {
        return $this->hasMany(ExamMark::class);
    }
}
