<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TimeBreak extends Model
{
    /** @use HasFactory<\Database\Factories\BreakFactory> */
    use HasFactory;

    protected $table = 'breaks'; 

    protected $fillable = [
        'name',
        'type',
        'description',
        'color',
    ];

    protected $casts = [
        'type' => 'string',
    ];

    /** Break types available in Nigerian schools */
    const TYPES = [
        'break' => 'Break Time',
        'fellowship' => 'Fellowship/Prayer',
        'sport' => 'Sports',
        'assembly' => 'Assembly',
        'event' => 'Event',
    ];

    public static function getDefaultBreaks()
    {
        return [
            ['name' => 'Morning Break', 'type' => 'break', 'color' => '#FFA500'],
            ['name' => 'Lunch Break', 'type' => 'break', 'color' => '#FF6347'],
            ['name' => 'Fellowship Time', 'type' => 'fellowship', 'color' => '#9370DB'],
            ['name' => 'Sports Time', 'type' => 'sport', 'color' => '#32CD32'],
            ['name' => 'Morning Assembly', 'type' => 'assembly', 'color' => '#1E90FF'],
        ];
    }
}
