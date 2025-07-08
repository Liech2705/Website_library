<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Book;
use App\Models\User;
use App\Models\BorrowRecord;

class DashboardController extends Controller
{
    public function summary()
    {
        $books = Book::count();
        $readers = User::where('role', 0)->count(); // Giả sử role=0 là độc giả
        $accounts = User::count();
        $borrows = BorrowRecord::count();

        return response()->json([
            'books' => $books,
            'readers' => $readers,
            'accounts' => $accounts,
            'borrows' => $borrows,
        ]);
    }

    public function newBooks()
    {
        $books = Book::with(['authors:id,name', 'category:id,name'])
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        $books = $books->map(function ($book) {
            return [
                'id' => $book->id,
                'title' => $book->title,
                'authors' => $book->authors->map(fn($a) => ['id' => $a->id, 'name' => $a->name]),
                'category' => $book->category ? [
                    'id' => $book->category->id,
                    'name' => $book->category->name,
                ] : null,
            ];
        });

        return response()->json($books);
    }

    public function newReaders()
    {
        $readers = User::where('role', 'user')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get(['id', 'email']);

        return response()->json($readers);
    }
}
