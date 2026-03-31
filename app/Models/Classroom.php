<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Classroom extends Model
{
    /** @use HasFactory<\Database\Factories\ClassroomFactory> */
    use HasFactory;

    public $fillable = [
        "name",
        "grade_level",
        "room_number",
        "capacity",
        "teacher_id",
    ]; 

    public $appends = [
        "students_count"
    ];

    public function students(): HasMany
    {
        // This assumes your students table has a 'classroom_id' column
        return $this->hasMany(Student::class);
    }

    public function teacher()
    {
        return $this->belongsTo(Teacher::class, 'teacher_id');
    }

    public function timetable(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Timetable::class);
    }

    function getStudentsCountAttribute(){
        return $this->students->count();
    }
    
}
