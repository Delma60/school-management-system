<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Subject extends Model
{
   use HasFactory, SoftDeletes;

    protected $fillable = [
        'name', 'slug', 'code', 'department', 
        'description', 'credits', 'type', 'has_syllabus'
    ];

    /**
     * The teachers assigned to this subject.
     */
    public function teachers()
    {
        return $this->belongsToMany(User::class);
    }

    /**
     * Scope to filter by department for your UI.
     */
    public function scopeInDepartment($query, $dept)
    {
        return $query->where('department', $dept);
    }

    /**
     * Get all scheduled instances of this subject.
     */
    public function timetable(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Timetable::class);
    }
}
