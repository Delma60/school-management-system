<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SchoolEvent extends Model
{
    /** @use HasFactory<\Database\Factories\SchoolEventFactory> */
    use HasFactory;

    public $fillable = [
        "title",
        "date",
        "time",
        "location",
        "type"
    ];

    public $casts = [
        "date" => "datetime"
    ];
}


