<?php

namespace App\Models;

use App\HasRole;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Staff extends Model
{
    /** @use HasFactory<\Database\Factories\StaffFactory> */
    use HasFactory, HasRole;

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
                $query->whereNotIn('slug', ['student']);
            });
        });
    }
}
