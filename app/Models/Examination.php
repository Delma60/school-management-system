<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Examination extends Model
{
    /** @use HasFactory<\Database\Factories\ExaminationFactory> */
    use HasFactory;

    protected $fillable = [
        "name",
        "term",
        "session",
        "start_date",
        "end_date",
        "status",
        "results_published",
        "meta"
    ];
    protected $casts = ['meta' => 'array'];

    public function subjects()
    {
        // Link to subjects through the pivot table
        return $this->hasMany(ExamSubject::class);
    }

    public function classrooms()
    {
        return $this->belongsToMany(Classroom::class);
    }
}
