<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'id_parent',
        'name',
        'description',
    ];

    // Quan hệ cha (danh mục cha)
    public function parent()
    {
        return $this->belongsTo(Category::class, 'id_parent');
    }

    // Quan hệ con (danh mục con)
    public function children()
    {
        return $this->hasMany(Category::class, 'id_parent');
    }

    // Quan hệ với Book
    public function books()
    {
        return $this->hasMany(Book::class, 'id_category');
    }
}