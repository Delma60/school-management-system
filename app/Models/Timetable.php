<?php

namespace App\Models;

use App\Models\TimeBreak;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Timetable extends Model
{
    use HasFactory;

    protected $fillable = [
        'subject_id', 
        'teacher_id', 
        'classroom_id',
        'timebreak_id',
        'day_of_week', 
        'start_time', 
        'end_time',
        'entry_type',
        'meta'
    ];

    protected $casts = [
        'meta' => 'array',
        'entry_type' => 'string',
    ];

    public function subject(): BelongsTo
    {
        return $this->belongsTo(Subject::class);
    }

    public function classroom(): BelongsTo
    {
        return $this->belongsTo(Classroom::class);
    }

    /**
     * Even though it's the 'users' table, we use the Teacher model
     * to ensure the Global Scope (role=teacher) is applied.
     */
    public function teacher(): BelongsTo
    {
        return $this->belongsTo(Teacher::class, 'teacher_id');
    }

    /**
     * Get the break associated with this timetable entry
     */
    public function timebreak(): BelongsTo
    {
        return $this->belongsTo(TimeBreak::class, 'timebreak_id', 'id', 'breaks');
    }
}
