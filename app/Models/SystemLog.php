<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SystemLog extends Model
{
    /** @use HasFactory<\Database\Factories\SystemLogFactory> */
    use HasFactory;

    protected $fillable = [
        'level', 'action', 'message', 'user_id', 'ip_address', 'user_agent', 'meta'
    ];
    
    protected $casts = [
        'meta' => 'json'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public static function logActivity(string $action, string $message, string $level = 'info', array|null $meta = null)
    {
        return self::create([
            'level'      => $level,
            'action'     => $action,
            'message'    => $message,
            'user_id'    => auth()->id(), // Automatically grabs the logged-in user
            'ip_address' => request()->ip(), // Automatically grabs the IP
            'user_agent' => request()->userAgent(), // Automatically grabs the device/browser info
            'meta'       => $meta,
        ]);
    }
    
}
