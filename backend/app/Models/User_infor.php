<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class User_infor extends Model
{
    use HasFactory;

    protected $table = 'user_infos';

    protected $fillable = [
        'user_id',
        'phone',
        'address',
        'image_url',
        'school_name'
    ];

    /**
     * Mối quan hệ với User
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Lấy thông tin đầy đủ của người dùng
     */
    public function getFullInfo()
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'phone' => $this->phone,
            'address' => $this->address,
            'image_url' => $this->image_url,
            'school_name' => $this->school_name,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at
        ];
    }

    /**
     * Cập nhật thông tin người dùng
     */
    public function updateInfo($data)
    {
        return $this->update($data);
    }

    /**
     * Kiểm tra xem người dùng có đầy đủ thông tin không
     */
    public function isComplete()
    {
        return !empty($this->full_name) && !empty($this->phone);
    }
}
