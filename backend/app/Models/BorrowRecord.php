<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BorrowRecord extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'id_bookcopy',
        'start_time',
        'due_time',
        'end_time',
        'is_extended_request',
        'is_extended_approved',
        'is_return',
        'renew_count',
        'note',
    ];

    protected $casts = [
        'start_time' => 'datetime',
        'due_time' => 'datetime',
        'end_time' => 'datetime',
        'is_extended_request' => 'boolean',
        'is_return' => 'boolean',
        'renew_count' => 'integer',
    ];

    // Quan hệ với User
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // Quan hệ với BookCopy (nếu có model BookCopy)
    public function bookCopy()
    {
        return $this->belongsTo(BookCopy::class, 'id_bookcopy');
    }

    // Scope: các bản ghi chưa trả sách
    public function scopeNotReturned($query)
    {
        return $query->where('is_return', false);
    }

    // Scope: các bản ghi đã trả sách
    public function scopeReturned($query)
    {
        return $query->where('is_return', true);
    }

    // Kiểm tra quá hạn
    public function isOverdue()
    {
        return !$this->is_return && now()->greaterThan($this->due_time);
    }
}
