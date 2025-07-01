<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\Request;

class BookController extends Controller
{
    public function index()
    {
        return Book::all();
    }

    public function _index()
    {
        $books = Book::with(['authors:id,name', 'category:id,name'])->get();

        // Đổi tên key cho đúng format frontend nếu cần
        $books = $books->map(function ($book) {
            return [
                'id' => $book->id,
                'title' => $book->title,
                'authors' => $book->authors->map(function ($author) {
                    return [
                        'id' => $author->id,
                        'name' => $author->name,
                    ];
                }),
                'category' => [
                    'id' => $book->category->id,
                    'name' => $book->category->name,
                ],
                'publisher' => $book->publisher,
                'year' => $book->year,
                'views' => $book->views,
                'book_copies' => [],
                'image' => $book->image,
            ];
        });

        return response()->json($books);
    }

    public function store(Request $request)
    {
        $book = Book::create($request->all());
        return response()->json($book, 201);
    }

    public function show($id)
    {
        return Book::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $book = Book::findOrFail($id);
        $book->update($request->all());
        return response()->json($book, 200);
    }

    public function destroy($id)
    {
        Book::destroy($id);
        return response()->json(null, 204);
    }
}
