<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'id_category',
        'description',
        'publisher',
        'year',
        'views',
        'image',
    ];

    protected $casts = [
        'year' => 'integer',
        'views' => 'integer',
    ];

    // Quan hệ với BookCopy
    public function bookCopies()
    {
        return $this->hasMany(BookCopy::class, 'id_book');
    }

    public function category()
    {
        return $this->belongsTo(Category::class, 'id_category');
    }

    public function authors()
    {
        return $this->belongsToMany(Author::class, 'book_author', 'id_book', 'id_author');
    }
}
