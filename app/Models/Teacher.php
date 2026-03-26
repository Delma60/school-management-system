<?php

namespace App\Models;

use App\HasRole;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Teacher extends Model
{
    //
    use HasRole;

     // Use 'protected' for the table name
    protected $table = 'users';

    protected $fillable = [
        'name',
        'email',
        'password',
        'meta',
        'role_id',
        "classroom_id"
    ];

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


    /**
     * The "booted" method of the model.
     * This ensures 'Student::all()' only returns users with the 'student' role.
     */
    protected static function booted(): void
    {
        static::addGlobalScope('role', function (Builder $builder) {
            // We use whereHas to filter users who have the 'student' role slug
            $builder->whereHas('role', function ($query) {
                $query->where('slug', 'teacher');
            });
        });
    }

    public function subjects(): BelongsToMany
    {
        /**
         * We explicitly name 'user_id' as the foreign key because
         * Laravel would otherwise look for 'teacher_id' on the pivot table.
         */
        return $this->belongsToMany(Subject::class, 'subject_user', 'user_id', 'subject_id')
                    ->withTimestamps();
    }

    /**
     * Get all timetable slots assigned to this teacher.
     */
    public function timetable(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Timetable::class, 'teacher_id');
    }
}
