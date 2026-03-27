<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Expense extends Model
{
    /** @use HasFactory<\Database\Factories\ExpenseFactory> */
    use HasFactory;

    protected $fillable = ['title', 'amount', 'category', 'expense_date', 'recorded_by', 'notes'];
    
    protected $casts = ['expense_date' => 'date'];

    public function recordedBy()
    {
        return $this->belongsTo(User::class, 'recorded_by');
    }
}
