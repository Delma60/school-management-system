<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BehaviorLog extends Model
{
    /** @use HasFactory<\Database\Factories\BehaviorLogFactory> */
    use HasFactory;

    protected $fillable = [
        'student_id',
        'reporter_id',
        'type',
        'title',
        'description',
        'incident_date',
        'action_taken',
    ];

    protected $casts = [
        'incident_date' => 'date',
    ];

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function reporter()
    {
        return $this->belongsTo(User::class, 'reporter_id');
    }
}
