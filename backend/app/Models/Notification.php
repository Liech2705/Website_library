<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'message',
        'type',
        'is_read',
        'action_url',
    ];

    /**
     * Mối quan hệ với User
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope để lấy notifications chưa đọc
     */
    public function scopeUnread($query)
    {
        return $query->where('is_read', false);
    }

    /**
     * Scope để lấy notifications đã đọc
     */
    public function scopeRead($query)
    {
        return $query->where('is_read', true);
    }

    /**
     * Đánh dấu notification là đã đọc
     */
    public function markAsRead()
    {
        $this->update(['is_read' => true]);
    }

    /**
     * Đánh dấu notification là chưa đọc
     */
    public function markAsUnread()
    {
        $this->update(['is_read' => false]);
    }

    /**
     * Kiểm tra xem notification có phải chưa đọc không
     */
    public function isUnread()
    {
        return !$this->is_read;
    }

    /**
     * Tạo notification mới
     */
    public static function createNotification($userId, $title, $message, $type = 'info', $actionUrl = null, $data = null)
    {
        return self::create([
            'user_id' => $userId,
            'title' => $title,
            'message' => $message,
            'type' => $type,
            'action_url' => $actionUrl,
        ]);
    }
}
