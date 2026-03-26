<?php
namespace App\Models;

use App\HasRole;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Student extends Model
{
    use HasFactory, HasRole;

    // Use 'protected' for the table name
    protected $table = 'users';

     /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'meta',
        'role_id',
        'classroom_id',
        'rank'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'meta' => 'json'
        ];
    }


    protected $appends = [
        "attendance_percentage"
    ];

    /**
     * The "booted" method of the model.
     * This ensures 'Student::all()' only returns users with the 'student' role.
     */
    protected static function booted(): void
    {
        static::addGlobalScope('role', function (Builder $builder) {
            // We use whereHas to filter users who have the 'student' role slug
            $builder->whereHas('role', function ($query) {
                $query->where('slug', 'student');
            });
        });
    }

    public function examMarks()
    {
        // A student can have many marks across different subjects and exams
        return $this->hasMany(ExamMark::class, 'student_id');
    }

    /**
     * Relationship to the Classroom
     */
    public function classroom(): BelongsTo
    {
        return $this->belongsTo(Classroom::class, 'classroom_id');
    }

    public function attendances():HasMany
    {
        return $this->hasMany(Attendance::class, 'student_id');
    }

    public function getAttendancePercentageAttribute()
{
    // 1. Get total sessions where attendance was actually recorded
    // We exclude 'excused' because they shouldn't count against the percentage
    $totalSessions = $this->attendances()
        ->whereIn('status', ['present', 'absent', 'late'])
        ->count();

    if ($totalSessions === 0) return 0;

    // 2. Count "Positive" attendance (Present + Late)
    $presentCount = $this->attendances()
        ->whereIn('status', ['present', 'late'])
        ->count();

    // 3. Calculate: (Present / Total) * 100
    return round(($presentCount / $totalSessions) * 100, 1);
}
}
