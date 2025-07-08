<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class AdminActivity extends Model
{
    use HasFactory;

    protected $fillable = [
        'id_admin',
        'description'
    ];

    public function admin()
    {
        return $this->belongsTo(User::class, 'id_admin');
    }

    /**
     * Tự động ghi log hoạt động admin
     */
    public static function log($description)
    {
        if (Auth::check() && Auth::user()->role === 'admin') {
            return self::create([
                'id_admin' => Auth::id(),
                'description' => $description
            ]);
        }
    }
}
