<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GradingScale extends Model
{
    /** @use HasFactory<\Database\Factories\GradingScaleFactory> */
    use HasFactory;
    protected $fillable = [
        "grade",
        "min_score",
        "max_score",
        "remark"
    ];
}
