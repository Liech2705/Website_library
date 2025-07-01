<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BookCopy extends Model
{
    use HasFactory;

    protected $fillable = [
        'id_book',
        'copynumber',
        'year',
        'status',
        'location',
    ];

    protected $casts = [
        'year' => 'integer',
    ];

    // Quan hệ với Book
    public function book()
    {
        return $this->belongsTo(Book::class, 'id_book');
    }

    // Quan hệ với BorrowRecord
    public function borrowRecords()
    {
        return $this->hasMany(BorrowRecord::class, 'id_bookcopy');
    }
}
