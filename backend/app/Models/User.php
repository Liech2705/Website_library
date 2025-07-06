<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'status',
        'lock_until'
    ];

    protected $hidden = [
        'password',
    ];

    protected $casts = [
        'lock_until' => 'datetime',
        'password' => 'hashed',
    ];

    /**
     * Mối quan hệ với User_infor
     */
    public function userInfo()
    {
        return $this->hasOne(User_infor::class);
    }

    /**
     * Mối quan hệ với Notification
     */
    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }

    /**
     * Lấy notifications chưa đọc
     */
    public function unreadNotifications()
    {
        return $this->notifications()->unread();
    }

    /**
     * Lấy số lượng notifications chưa đọc
     */
    public function unreadNotificationsCount()
    {
        return $this->notifications()->unread()->count();
    }

    /**
     * Kiểm tra xem user có phải admin không
     */
    public function isAdmin()
    {
        return $this->role === 'admin';
    }

    /**
     * Kiểm tra xem tài khoản có bị khóa không
     */
    public function isLocked()
    {
        return $this->lock_until && $this->lock_until->isFuture();
    }

    /**
     * Kiểm tra xem tài khoản có active không
     */
    public function isActive()
    {
        return $this->status === 'active' && !$this->isLocked();
    }
}
